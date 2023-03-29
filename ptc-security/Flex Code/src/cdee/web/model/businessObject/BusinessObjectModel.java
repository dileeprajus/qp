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
package cdee.web.model.businessObject;


import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.foundation.LCSLifecycleManagedClientModel;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.foundation.LCSLifecycleManagedQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.foundation.LCSLifecycleManaged;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.foundation.LCSLifecycleManagedLogic;
import wt.util.WTException;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class BusinessObjectModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(BusinessObjectModel.class.getName());
    //private static final String CLASSNAME = BusinessObjectModel.class.getName();

    LCSLifecycleManagedQuery lcsLifecycleManagedQuery = new LCSLifecycleManagedQuery();
    
    AppUtil util = new AppUtil();
    Gson gson = new Gson();


    /**
     * This method is used to update the Business Object flex object that are  passed by using OID as reference.
     * @param oid   oid of an item(type) to update
     * @param type
     * @param boJsonObject  Contains Business Object data
     * @exception Exception
     * @return JSONObject  It returns OID of Business Object
     */

    public JSONObject updateBusinessObject(String oid, String type, JSONObject boJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update initialized with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSLifecycleManagedClientModel bussinussObjectModel = new LCSLifecycleManagedClientModel();
        try {
            bussinussObjectModel.load(oid);
            DataConversionUtil datConUtil = new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(boJsonObject,type,FormatHelper.getObjectId(bussinussObjectModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(bussinussObjectModel, convertedAttrs);
            bussinussObjectModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(bussinussObjectModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Business Object flex object that are  passed by using type as reference.
     * @param type is a string 
     * @param boDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONObject  It returns Business Object JSONObject 
     */

    public JSONObject createBusinessObject(String type, JSONObject boDataList) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Business object with type ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSLifecycleManagedClientModel lifecycleManagedClientModel = new LCSLifecycleManagedClientModel();
        try {
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(boDataList,type,(String)boDataList.get("typeId"));
            AttributeValueSetter.setAllAttributes(lifecycleManagedClientModel,convertedAttrs);
            lifecycleManagedClientModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(lifecycleManagedClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the business Object flex object that are  passed by using type as reference,
     * Using this method we can insert/update several records of a business object flextype at a time.
     * @param type String 
     * @param oid String
     * @param boJSONObject  Contains business object data
     * @exception Exception
     * @return JSONObject  It returns Bussiness Object JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
           
            if (oid == null) {
                 ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    responseObject = updateBusinessObject(list.get(2).toString(), type, payloadJson);
                } else {
                    responseObject = createBusinessObject(type, payloadJson);
                }
            } else {
                responseObject = updateBusinessObject(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Palette of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
        JSONObject responseObject = new JSONObject();
        try {LCSLifecycleManagedLogic lifecycleManagedLogic = new LCSLifecycleManagedLogic();
            LCSLifecycleManaged lcsLifecycleManagedInput = (LCSLifecycleManaged) LCSQuery.findObjectById(oid);
            lifecycleManagedLogic.deleteLifecycleManaged(lcsLifecycleManagedInput);
            responseObject = util.getDeleteResponseObject("Business Object", oid, responseObject);
           // responseObject = util.getDeleteResponseObject("Palette", oid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.foundation.LCSLifecycleManaged");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name ***** "+ name));
        Collection < FlexObject > response = lcsLifecycleManagedQuery.findLifecycleManagedsByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = oid = (String) response.iterator().next().get("LCSLIFECYCLEMANAGED.IDA2A2");
        oid = "OR:com.lcs.wc.foundation.LCSLifecycleManaged:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Retrive records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSLifecycleManagedQuery().findLifecycleManagedsByCriteria(criteriaMap, flexType, null, null, null);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.foundation.LCSLifecycleManaged:" + (String) flexObject.getString("LCSLIFECYCLEMANAGED.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initializing get Record by oid *****"+oid));
        JSONObject jSONObject = new JSONObject();
        LCSLifecycleManaged lcsLifecycleManagedInput = (LCSLifecycleManaged) LCSQuery.findObjectById(oid);
        LCSLifecycleManaged lcsLifecycleManaged = lcsLifecycleManagedInput;
        try{
            lcsLifecycleManaged = (LCSLifecycleManaged) VersionHelper.latestIterationOf(lcsLifecycleManagedInput);
        }catch(Exception e){
        }
        jSONObject.put("oid",FormatHelper.getObjectId(lcsLifecycleManaged).toString());
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsLifecycleManaged.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsLifecycleManaged.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsLifecycleManaged.getFlexType()));
        //jSONObject.put("created By", lcsLifecycleManaged.getCreatorFullName());
        jSONObject.put("flexName", objectType);
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsLifecycleManaged).toString());
        jSONObject.put("typeHierarchyName", lcsLifecycleManaged.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsLifecycleManaged));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsLifecycleManaged.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsLifecycleManaged.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsLifecycleManaged.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsLifecycleManaged.getFlexType()));    
    }

}