/*
 * Created on 06/06/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.plan;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.planning.FlexPlan;
import com.lcs.wc.planning.PlanClientModel;
import wt.util.WTException;
import com.lcs.wc.planning.PlanLogic;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.part.LCSPartMaster;
import wt.fc.WTObject;
import com.lcs.wc.planning.PlanMaster;
import com.lcs.wc.planning.PlanHelper;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class PlanModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(PlanModel.class.getName());
 //private static final String CLASSNAME = PlanModel.class.getName();
    PlanQuery planQuery = new PlanQuery();
    AppUtil util = new AppUtil();

    /**
     * This method is used to update the Plan object that are  passed by using type as reference.
     * @param oid is a string 
     * @param type is a string 
     * @param planJsonObject  Contains plan data
     * @exception Exception
     * @return JSONObject  It returns plan JSONObject object
     */
    public JSONObject updatePlan(String oid, String type, JSONObject planJsonObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update plan  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        PlanClientModel planModel = new PlanClientModel();
        try {
            planModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(planJsonObject,type,FormatHelper.getObjectId(planModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(planModel, convertedAttrs);
            planModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(planModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Plan object that are  passed by using type as reference.
     * @param type is a string 
     * @param planDataList  Contains plan data
     * @exception Exception
     * @return JSONObject  It returns plan JSONObject object
     */
    
    public JSONObject createPlan(String type, JSONObject planDataList) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Plan  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        PlanClientModel planModel = new PlanClientModel();
        try {
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(planDataList,type,(String)planDataList.get("typeId"));
            AttributeValueSetter.setAllAttributes(planModel,convertedAttrs);
            planModel.save();
            if (planDataList.containsKey("productOid")) {
                LCSProduct product = (LCSProduct) LCSQuery.findObjectById((String) planDataList.get("productOid"));
                LCSPartMaster prodMaster = (LCSPartMaster) product.getMaster();
                WTObject owner = (WTObject) PlanQuery.findObjectById(FormatHelper.getObjectId(prodMaster));
                PlanMaster master = (PlanMaster) planModel.getBusinessObject().getMaster();
                PlanHelper.service.createPlantoOwnerLink(master, owner);
            }
            responseObject = util.getInsertResponse(FormatHelper.getVersionId(planModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the plan flex object that are  passed by using type as reference,
     * @param type String 
     * @param oid String
     * @param planJsonData  Contains plan data
     * @exception Exception
     * @return JSONObject  It returns Sample JSONObject object
     */

    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "---oid-----"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updatePlan with criteria ***** "));
                    responseObject = updatePlan(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createPlan with criteria ***** "));
                    responseObject = createPlan(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updatePlan with oid ***** "));
                responseObject = updatePlan(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Plan of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete using oid   ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            FlexPlan flexPlan = (FlexPlan) LCSQuery.findObjectById(oid);
            PlanLogic planLogic = new PlanLogic();
            planLogic.deletePlan(flexPlan);
            responseObject = util.getDeleteResponseObject("Plan", oid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.planning.FlexPlan");
    }

    /**
     * This method is used to get the schema for the given typeId of this flex object .
     * @param String  type
     * @param String typeId
     * @Exception exception
     * @return JSONObject  it returns the schema for the given typeId of this flex object .
     */

    public JSONObject getFlexSchema(String type,String typeId) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema ***** "));
        JSONObject responseObject=new JSONObject();
        try{
            JSONObject jsonAsscos = util.getConfigureJSON();
            JSONObject configObject =(JSONObject)jsonAsscos.get(type);
            if(configObject!=null){
                JSONObject attributesObj=(JSONObject) configObject.get("properties");
                Collection attrsList = new ArrayList() ;
                Collection totalAttrs = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                    totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
                }else{
                    totalAttrs=FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
                }
                Iterator totalAttrsListItr = totalAttrs.iterator();
                while(totalAttrsListItr.hasNext()){
                    FlexTypeAttribute attribute=(FlexTypeAttribute)totalAttrsListItr.next();
                    if(attribute.getAttScope().equals("PLAN_SCOPE")){
                        attrsList.add(attribute);
                    }
                }
                attributesObj=util.getAttributesData(attrsList,attributesObj);
                responseObject.put("properties",attributesObj);
                responseObject.put("type","object");
                FlexType treeNodeFlexType = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                  treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
                }else{
                  treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
                }
                String typeName = treeNodeFlexType.getFullNameDisplay(true);
                JSONObject basicDetails = new JSONObject();
                basicDetails.put("typeId",typeId);
                basicDetails.put("rootObjectName",type);
                basicDetails.put("typeName",typeName);
                responseObject.put("basicDetails",basicDetails);
                responseObject.put("transformation_kind",(JSONObject)configObject.get("transformation_kind"));
                responseObject.put("associations",(JSONObject)configObject.get("associations"));
            }else{
                throw new FlexObjectNotFoundException(type +" does not Exist in ConfigurationRelations.json file");
            } 
        }catch(WTException we){
            responseObject = util.getExceptionJson(we.getMessage());
        }catch(FlexObjectNotFoundException foe){
            responseObject = util.getExceptionJson(foe.getMessage());
        }catch(FileNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records  initialized ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new PlanQuery().findPlansByCriteria(criteriaMap, flexType, null, null, null, false);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid by taking name of the record.
     * @param FlexType  flexType
     * @param Map criteria
     * @param String name
     * @Exception exception
     * @return return oid by taking name of the record of the flex object
     */
    public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name  initialized ***** "+ name));
        Collection < FlexObject > response = planQuery.findPlansByCriteria(criteria, flexType, null, null, null, false).getResults();
        String oid = (String) response.iterator().next().get("FLEXPLAN.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.planning.FlexPlan:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
    }


    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "VR:com.lcs.wc.planning.FlexPlan:" + (String) flexObject.getString("FLEXPLAN.BRANCHIDITERATIONINFO");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return JSONObject  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        FlexPlan flexPlanInput = (FlexPlan) LCSQuery.findObjectById(oid);
        FlexPlan flexPlan = flexPlanInput;
        try{
            flexPlan = (FlexPlan) VersionHelper.latestIterationOf(flexPlanInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(flexPlan.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(flexPlan.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(flexPlan.getFlexType()));
        jSONObject.put("oid", FormatHelper.getVersionId(flexPlan).toString());
        jSONObject.put("ORid", FormatHelper.getObjectId(flexPlan).toString());
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(flexPlan));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(flexPlan));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", flexPlan.getFlexType().getFullNameDisplay(true));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = flexPlan.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (flexPlan.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, flexPlan.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(flexPlan.getFlexType()));    
    }
    
}