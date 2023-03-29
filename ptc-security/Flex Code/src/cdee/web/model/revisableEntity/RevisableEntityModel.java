/*
 * Created on 06/10/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.revisableEntity;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.foundation.LCSRevisableEntityQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.foundation.LCSRevisableEntity;
import com.lcs.wc.foundation.LCSRevisableEntityClientModel;
import wt.util.WTException;
import com.lcs.wc.foundation.LCSRevisableEntityLogic;
import com.lcs.wc.classification.TreeNode;
import java.util.Vector;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class RevisableEntityModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(RevisableEntityModel.class.getName());
 //private static final String CLASSNAME = RevisableEntityModel.class.getName();

    LCSRevisableEntityQuery lcsRevisableEntityQuery = new LCSRevisableEntityQuery();
    AppUtil util = new AppUtil();

    /**
     * This method is used either insert or update the Season flex object that are  passed by using type as reference,
     * oid and array of different Season data 
     * Using this method we can insert/update several records of a Season flextype at a time.
     * @param type String 
     * @param oid String
     * @param SeasonJSONArray  Contains array of Season data
     * @exception Exception
     * @return JSONArray  It returns Season JSONArray object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject reJsonData,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"----oid-------"+oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, reJsonData,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateRE with criteria ***** "));
                    responseObject = updateRE(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createRE ***** "));
                    responseObject = createRE(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateRE with oid ***** "));
                responseObject = updateRE(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Season flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Season flextype at a time.
     * @param type is a string 
     * @param seasonDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Season JSONArray object
     */

    public JSONObject createRE(String type, JSONObject reAttrsJSON) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** CreateRE  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSRevisableEntityClientModel reClientModel = new LCSRevisableEntityClientModel();
        try {
            String typeId = (String) reAttrsJSON.get("typeId");
            FlexType reType = FlexTypeCache.getFlexType(typeId);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(reAttrsJSON,type,(String)reAttrsJSON.get("typeId"));
            convertedAttrs.put("typeId", typeId);
            convertedAttrs.put("type", typeId);
            AttributeValueSetter.setAllAttributes(reClientModel, convertedAttrs);
            reClientModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getVersionId(reClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used to update the Season flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Season flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param reJsonObject  Contains Season data
     * @exception Exception
     * @return String  It returns OID of Season object
     */

    public JSONObject updateRE(String oid, String type, JSONObject reJsonObject) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** UpdateRE initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSRevisableEntityClientModel reClientModel = new LCSRevisableEntityClientModel();
        try {
            reClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(reJsonObject,type,FormatHelper.getObjectId(reClientModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(reClientModel, convertedAttrs);
            reClientModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(reClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used delete Season of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using by oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSRevisableEntity lcsRevisableEntity = (LCSRevisableEntity) LCSQuery.findObjectById(oid);
            LCSRevisableEntityLogic lcsRevisableEntityLogic = new LCSRevisableEntityLogic();
            lcsRevisableEntityLogic.deleteRevisableEntity(lcsRevisableEntity);
            responseObject = util.getDeleteResponseObject("Revisable Entity", oid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.foundation.LCSRevisableEntity");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSRevisableEntityQuery().findRevisableEntitiesByCriteria(criteriaMap, flexType, null, null, null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        Collection < FlexObject > response = lcsRevisableEntityQuery.findRevisableEntitiesByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSREVISABLEENTITY.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.foundation.LCSRevisableEntity:" + oid;
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
        return "VR:com.lcs.wc.foundation.LCSRevisableEntity:" + (String) flexObject.getString("LCSREVISABLEENTITY.BRANCHIDITERATIONINFO");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return String  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSRevisableEntity lcsRevisableEntityInput = (LCSRevisableEntity) LCSQuery.findObjectById(oid);
        LCSRevisableEntity lcsRevisableEntity = lcsRevisableEntityInput;
        try{
            lcsRevisableEntity = (LCSRevisableEntity) VersionHelper.latestIterationOf(lcsRevisableEntityInput);
        }catch(Exception e){

        }
        
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsRevisableEntity.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsRevisableEntity.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", util.getVR(lcsRevisableEntity));
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsRevisableEntity).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsRevisableEntity).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsRevisableEntity.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsRevisableEntity.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsRevisableEntity));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsRevisableEntity));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsRevisableEntity.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsRevisableEntity.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsRevisableEntity.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsRevisableEntity.getFlexType()));  
        
  }

  


}