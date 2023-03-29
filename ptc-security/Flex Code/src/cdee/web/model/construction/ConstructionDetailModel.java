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
package cdee.web.model.construction;

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
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import com.lcs.wc.construction.LCSConstructionQuery;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.construction.LCSConstructionDetailsQuery;
import com.google.gson.Gson;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.construction.LCSConstructionDetail;
import com.lcs.wc.construction.LCSConstructionDetailClientModel;
import wt.util.WTException;
import com.lcs.wc.construction.LCSConstructionDetailLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import com.lcs.wc.util.DeleteFileHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class ConstructionDetailModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(ConstructionDetailModel.class.getName());
    //private static final String CLASSNAME = ConstructionDetailModel.class.getName();

    LCSConstructionQuery lcsConstructionQuery = new LCSConstructionQuery();
    LCSConstructionDetailsQuery lcsConstructionDetailQuery = new LCSConstructionDetailsQuery();
    Gson gson = new Gson();


    AppUtil util = new AppUtil();

    /**
     * This method is used either insert or update the ConstructionDetail flex object that are  passed by using type as reference,
     * oid and array of different ConstructionDetails data 
     * Using this method we can insert/update several records of a Construction Detail flextype at a time.
     * @param type String 
     * @param oid String
     * @param ConstructionDetailJSONArray  Contains array of ConstructionDetail data
     * @exception Exception
     * @return JSONArray  It returns ConstructionDetail JSONArray object
     */

    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type + "----oid-----" + oid)); 
       JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                     //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling updateConstructionDetail"));
                    responseObject = updateConstructionDetail(list.get(2).toString(),type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling createConstructionDetail"));
                    responseObject = createConstructionDetail(type, payloadJson);
                }
            } else {
                 //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling updateConstructionDetail"));
                responseObject = updateConstructionDetail(oid,type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the ConstructionDetail flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a ConstructionDetail flextype at a time.
     * @param type is a string 
     * @param constructionDetailDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns ConstructionDetail JSONArray object
     */

    public JSONObject createConstructionDetail(String type, JSONObject constuctionDetailsDataList) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Construction Details initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        try {
            LCSConstructionDetailClientModel detailModel = new LCSConstructionDetailClientModel();
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(constuctionDetailsDataList,type,(String)constuctionDetailsDataList.get("typeId"));
            convertedAttrs.put("constructionDetailType", "LIBRARY");
            AttributeValueSetter.setAllAttributes(detailModel, convertedAttrs);
           
            /*End*/
            detailModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(detailModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used to update the ConstructionDetail flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a ConstructionDetail flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param constructionDetailJsonObject  Contains ConstructionDetail data
     * @exception Exception
     * @return String  It returns OID of ConstructionDetail object
     */

    public JSONObject updateConstructionDetail(String oid,String type, JSONObject constuctionDetailJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Construction Details initialized with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSConstructionDetailClientModel detailModel = new LCSConstructionDetailClientModel();
        try {
            detailModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(constuctionDetailJsonObject,type,FormatHelper.getObjectId(detailModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(detailModel, convertedAttrs);
            detailModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(detailModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used delete Construction Detail of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSConstructionDetail lcsConstructionDetail = (LCSConstructionDetail) LCSQuery.findObjectById(oid);
            LCSConstructionDetailLogic lcsConstructionDetailLogic = new LCSConstructionDetailLogic();
            lcsConstructionDetailLogic.deleteConstructionDetail(lcsConstructionDetail);
            responseObject = util.getDeleteResponseObject("Construction Detail", oid, responseObject);
        } catch (WTException wte) {
            //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete WTException ***** "+ wte));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.construction.LCSConstructionDetail");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with records***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot("Construction");
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSConstructionDetailsQuery().findConstructionDetailsByCriteria(null, flexType, null, false, false);
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
        return "no record";

    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return null;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records by oid***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSConstructionDetail detailInput = (LCSConstructionDetail) LCSQuery.findObjectById(oid);
        LCSConstructionDetail detail = detailInput;
        try{
            detail = (LCSConstructionDetail) VersionHelper.latestIterationOf(detailInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(detail.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(detail.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(detail.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(detail).toString());
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", detail.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(detail));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = detail.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (detail.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, detail.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(detail.getFlexType()));   
   }

}