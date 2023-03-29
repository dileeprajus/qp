/*
 * Created on 06/11/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.supplier;

import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.supplier.LCSSupplierClientModel;
import com.lcs.wc.supplier.LCSSupplierLogic;
import com.lcs.wc.supplier.LCSSupplierQuery;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SupplierModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SupplierModel.class.getName());
//private static final String CLASSNAME = SupplierModel.class.getName();

AppUtil util = new AppUtil();

  /**
    * This method is used to update the Supplier flex object that are  passed by using OID as reference.
    * @param oid   oid of an item(type) to update
    * @param SupplierJsonObject JSONObject Contains Supplier data
    * @param type String
    * @exception Exception
    * @return JSONObject It returns OID of Supplier object
    */
  public JSONObject updateSupplier(String oid,String type, JSONObject supplierJsonObject) throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update supplier ***** "+ oid));
    JSONObject responseObject = new JSONObject();
    LCSSupplierClientModel supplierModel = new LCSSupplierClientModel();
        try{
          supplierModel.load(oid);
          DataConversionUtil datConUtil=new DataConversionUtil();
          Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(supplierJsonObject,type,FormatHelper.getObjectId(supplierModel.getFlexType()));
        AttributeValueSetter.setAllAttributes(supplierModel, convertedAttrs);
        supplierModel.save();
        responseObject = util.getUpdateResponse(FormatHelper.getVersionId(supplierModel.getBusinessObject()).toString(), type, responseObject);
    }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
    }
    return responseObject;
  }                

  /**
    * This method is used to insert the Supplier flex object that are  passed by using type as reference.
    * @param type is a string 
    * @param SupplierDataList ArrayList Contains attributes, typeId, oid(if existing)
    * @exception Exception
    * @return JSONObject  It returns Supplier JSON object
    */  
    public JSONObject createSuppliers(String type, JSONObject supplierDataList){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Suppliers ***** "));
    JSONObject responseObject = new JSONObject();
    LCSSupplierClientModel supplierClientModel = new LCSSupplierClientModel();
    try{
      DataConversionUtil datConUtil=new DataConversionUtil();
      Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(supplierDataList,type,(String)supplierDataList.get("typeId"));
      AttributeValueSetter.setAllAttributes(supplierClientModel,convertedAttrs);
      supplierClientModel.save();
       responseObject = util.getInsertResponse(FormatHelper.getVersionId(supplierClientModel.getBusinessObject()).toString(), type, responseObject);
    } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
    }catch(Exception e){
      responseObject = util.getExceptionJson(e.getMessage());
    }
    return responseObject;
  }

    /**
    * This method is used delete Supplier of given oid,
    * @param supplierOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String supplierOid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete with supplierOid ***** "+ supplierOid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSSupplier lcsSupplier = (LCSSupplier) LCSQuery.findObjectById(supplierOid);
        LCSSupplierLogic lcsSupplierLogic = new LCSSupplierLogic();
        lcsSupplierLogic.deleteSupplier(lcsSupplier);
        responseObject=util.getDeleteResponseObject("Supplier",supplierOid,responseObject);
      }catch(WTException wte){
         //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception in Delete  ***** "+wte.getMessage()));
        responseObject=util.getExceptionJson(wte.getMessage());
      }
      return responseObject;
    }

  /**
    * This method is used either insert or update the Supplier flex object that are  passed by using type as reference,
    * @param type String 
    * @param oid String
    * @param supplierJsonObject  Contains array of Suppliers data
    * @exception Exception
    * @return JSONObject  It returns Supplier JSONObject object
    */
  public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
      JSONObject responseObject = new JSONObject();
      try{
        if(oid == null){
             ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);

            if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSupplier with criteria ***** "));
              responseObject=updateSupplier(list.get(2).toString(),type,payloadJson);
            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateProduct with criteria ***** "));
              responseObject=createSuppliers(type, payloadJson);
            }
        } else {
          //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSupplier with oid ***** "));
            responseObject=updateSupplier(oid,type,payloadJson);
        }
      }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
  }

  /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.supplier.LCSSupplier"); 
  } 

   /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception{
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSSupplierQuery().findSuppliersByCriteria(criteriaMap,flexType,null,null,null);
        return util.getResponseFromResults(results,objectType);
    }

    /**
    * This method is used to search for flex objects for the given name.
    * @param FlexType  flexType
    * @param Map criteria
    * @param String name
    * @Exception exception
    * @return return flex object's oid for the given name
    */ 
  public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** search by name ***** "+ name));
        LCSSupplierQuery lcsSupplierQuery = new LCSSupplierQuery();
        Collection<FlexObject> response = lcsSupplierQuery.findSuppliersByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSSUPPLIER.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.supplier.LCSSupplier:"+oid;
        if(response.size() == 0){
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
    public String getOid(FlexObject flexObject){
        return "VR:com.lcs.wc.supplier.LCSSupplier:"+(String)flexObject.getString("LCSSUPPLIER.BRANCHIDITERATIONINFO");
    }

  /**
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return JSONObject  it returns the records that matched the given oid of this flex object
    */ 
    public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid  ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSSupplier lcsSupplierInput = (LCSSupplier) LCSQuery.findObjectById(oid);
        LCSSupplier lcsSupplier = lcsSupplierInput;
        try{
            lcsSupplier = (LCSSupplier) VersionHelper.latestIterationOf(lcsSupplierInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsSupplier.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsSupplier.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid", util.getVR(lcsSupplier));
        //jSONObject.put("oid",FormatHelper.getVersionId(lcsSupplier).toString());
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsSupplier.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSupplier).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsSupplier.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsSupplier));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsSupplier));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsSupplier.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(lcsSupplier.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,lcsSupplier.getValue(attKey));
            }
          }catch(Exception e){
            }
      }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSupplier.getFlexType()));  
    }
  
}