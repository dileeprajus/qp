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
package cdee.web.model.season;

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
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.season.SeasonGroupQuery;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.season.LCSSKUSeasonLink;
import com.lcs.wc.season.LCSSeasonProductLink;
import java.util.Collection;
import com.lcs.wc.season.SeasonProductLocator;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.product.LCSProduct;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.HeaderNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import wt.util.WTException;

import com.lcs.wc.part.LCSPart;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.product.LCSSKU;
import java.util.Set;
import com.lcs.wc.season.LCSSeasonLogic;
import com.lcs.wc.season.LCSSeasonSKULinkClientModel;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.season.LCSSeasonClientModel;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SkuSeasonLinkModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SkuSeasonLinkModel.class.getName());
//private static final String CLASSNAME = SkuSeasonLinkModel.class.getName();
 
  AppUtil util = new AppUtil();
  Gson gson= new Gson();


  /**
      * This method is used either insert or update the SeasonGroup flex object that are  passed by using type as reference,
      * oid and array of different SeasonGroup data 
      * Using this method we can insert/update several records of a SeasonGroup flextype at a time.
      * @param type String 
      * @param oid String
      * @param SeasonGroupJSONArray  Contains array of SeasonGroup data
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject skuSeasonJSONData,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"---oid------"+oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                responseObject = createSkuSeason(type, payloadJson);

            } else {
               //String skuSeasonOid = updateSkuSeason(util.getAttributesFromScope("SKU-SEASON", payloadJson), oid);
               String skuSeasonOid = updateSkuSeason(util.getAttributesFromScopeLevel("PRODUCT-SEASON", "SKU",payloadJson), oid);
               responseObject = util.getUpdateResponse(skuSeasonOid, type, responseObject);
               
               
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    

    public JSONObject createSkuSeason(String type, JSONObject skuSeasonJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Sku Season  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSSeasonSKULinkClientModel seasonProductLinkModel = new LCSSeasonSKULinkClientModel();
        LCSSeasonClientModel seasonModel = new LCSSeasonClientModel();
        try {
          
            String colorwayOid = (String) skuSeasonJsonObject.get("skuOid");
            String seasonOid = (String) skuSeasonJsonObject.get("seasonOid");
            LCSSKU lcsSku = (LCSSKU) LCSQuery.findObjectById(colorwayOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);

            seasonModel.load(seasonOid); 
            seasonModel.addSKUs(MOAHelper.getMOACollection((String) FormatHelper.getObjectId(lcsSku.getMaster())));
            
            LCSSeasonProductLink skuSeasonLink = LCSSeasonQuery.findSeasonProductLink(lcsSku, lcsSeason);
            String skuSeasonOid = FormatHelper.getObjectId(skuSeasonLink);            
            
            seasonProductLinkModel.load(skuSeasonOid);

           // String productSeasonOid = updateSkuSeason(util.getAttributesFromScope("SKU-SEASON", skuSeasonJsonObject), skuSeasonOid);
            String productSeasonOid = updateSkuSeason( util.getAttributesFromScopeLevel("PRODUCT-SEASON", "SKU",skuSeasonJsonObject), skuSeasonOid);

            responseObject = util.getInsertResponse(productSeasonOid, type, responseObject);

        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

   
        public String updateSkuSeason(Map seasonProductLinkScopeAttrs, String seasonProductOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "*****update Sku Season  initialized ***** "+ seasonProductOid));
        String oid = "";
        JSONObject responseObject = new JSONObject();
        LCSSeasonSKULinkClientModel seasonProductLinkModel = new LCSSeasonSKULinkClientModel();
        try { 
            seasonProductLinkModel.load(seasonProductOid);
            AttributeValueSetter.setAllAttributes(seasonProductLinkModel, seasonProductLinkScopeAttrs);
            seasonProductLinkModel.save();
            oid = FormatHelper.getObjectId(seasonProductLinkModel.getBusinessObject());
            //responseObject = util.getUpdateResponse(oid, type, responseObject);
        } catch (Exception e) {
        	throw new Exception(e);
        }
        return oid;
    }

    /**
      * This method is used to call Associations objects of the Flex type SeasonGroup.
      * @param  
      * @param 
      * @param 
      * @exception Exception
      * @return 
      */
    private void seasonGroupAssociations( ) throws Exception{
    }

       /**
    * This method is used to get the schema for the given typeId of this flex object .
    * @param String  type
    * @param String typeId
    * @param JSONObject jsonAsscos
    * @Exception exception
    * @return JSONObject  it returns the schema for the given typeId of this flex object .
    */

    public JSONObject getFlexSchema(String type, String typeId) throws NumberFormatException,TypeIdNotFoundException,Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with type and typeId***** "));
    JSONObject responseObject = new JSONObject();
    try{
        JSONObject jsonAsscos = util.getConfigureJSON();
           JSONObject scopedObjSchemaObject = new JSONObject();
            JSONObject configObject = (JSONObject) jsonAsscos.get(type);
            if(configObject!=null){
                JSONObject attributesObj = (JSONObject) configObject.get("properties");
                Collection attrsList = new ArrayList();
                Collection totalAttrs = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                    totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
                    Iterator totalAttrsListItr = totalAttrs.iterator();
          while (totalAttrsListItr.hasNext()) {
            FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();

            if (attribute.getAttScope().equals("PRODUCT-SEASON")
                && (attribute.getAttObjectLevel().equals("PRODUCT-SKU")
                    || attribute.getAttObjectLevel().equals("SKU"))) {
              attrsList.add(attribute);
            }

          }
                    attributesObj = util.getAttributesData(attrsList, attributesObj);
                    responseObject.put("properties", attributesObj);
                    responseObject.put("type", "object");
                    FlexType treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
                    String typeName = treeNodeFlexType.getFullNameDisplay(true);
                    JSONObject basicDetails = new JSONObject();
                    basicDetails.put("typeId", typeId);
                    basicDetails.put("rootObjectName", type);
                    basicDetails.put("typeName", typeName);
                    responseObject.put("basicDetails", basicDetails);
                    responseObject.put("transformation_kind", (JSONObject) configObject.get("transformation_kind"));
                    responseObject.put("associations", (JSONObject) configObject.get("associations"));
                }else{
                    throw new TypeIdNotFoundException(type +" have TypeId Manadatory because this attributes are available in another flexObject");
                }
            }else{
                throw new FlexObjectNotFoundException(type +" does not Exist in ConfigurationRelations.json file");
            }
        }catch(NumberFormatException ne){
            throw ne;
        }catch(TypeIdNotFoundException te){
            throw te;
        }catch(FlexObjectNotFoundException foe){
            responseObject = util.getExceptionJson(foe.getMessage());
        }catch(FileNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(WTException we){
            responseObject = util.getExceptionJson(we.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
    * This method is used to search schema object .
    * @param jsonObject is a JSONObject 
    * @param objectType  String
    * @param flexType  FlexType
    * @param criteriaMap  Map
    * @exception Exception
    * @return String  it returns schema object
    */  
 
    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.season.LCSSKUSeasonLink"); 
  } 
  

    /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
  public JSONObject getRecords(String typeId,String objectType, Map criteriaMap) throws Exception{
    return null;
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "";
  }

  /**
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return String  it returns the records that matched the given oid of this flex object
    */ 
  

  public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
      JSONObject jSONObject = new JSONObject();
        LCSSKUSeasonLink lcsSkuSeasonLink = (LCSSKUSeasonLink)LCSQuery.findObjectById(oid);
        LCSPartMaster skuMaster = (LCSPartMaster) lcsSkuSeasonLink.getSkuMaster();
        LCSSKU sku = (LCSSKU) VersionHelper.getVersion((LCSPartMaster)lcsSkuSeasonLink.getSkuMaster(), "A");
        String skuOid = FormatHelper.getVersionId(sku);
        LCSSeasonMaster seasonMaster = (LCSSeasonMaster)lcsSkuSeasonLink.getSeasonMaster();
        LCSSeason lcsSeason = (LCSSeason) VersionHelper.latestIterationOf(seasonMaster);
        LCSPart lcsPart = lcsSkuSeasonLink.getOwner();
        LCSSKU lcsSkus = (LCSSKU) lcsPart;
        String seasonOid = FormatHelper.getVersionId(lcsSeason);
        jSONObject.put("seasonRemoved", lcsSkuSeasonLink.isSeasonRemoved());
        jSONObject.put("skuOid", skuOid);
        jSONObject.put("oid", oid);
        jSONObject.put("seasonOid", seasonOid);
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsSkuSeasonLink.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsSkuSeasonLink.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsSkuSeasonLink.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSkuSeasonLink).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsSkuSeasonLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsSkuSeasonLink));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsSkuSeasonLink.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        
        jSONObject.put("lifeCycleState", lcsSkus.getLifeCycleState().getDisplay());
        String lifeCycleNameLabel = lcsSkus.getLifeCycleName();
        jSONObject.put("lifecycleName", lifeCycleNameLabel);
        //jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsSkuSeasonLink));
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
      Collection attributes = lcsSkuSeasonLink.getFlexType().getAllAttributes();
      Iterator it = attributes.iterator();
      while(it.hasNext()){
        FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        String attKey = att.getAttKey();
        try{
            if(lcsSkuSeasonLink.getValue(attKey) == null){
              jSONObject.put(attKey,"");
            }
            else{
              jSONObject.put(attKey,lcsSkuSeasonLink.getValue(attKey).toString());
          }
        }catch(Exception e){
          }
    }
      DataConversionUtil datConUtil=new DataConversionUtil();
      JSONObject jSONObject1 = datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSkuSeasonLink.getFlexType())); 
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSkuSeasonLink.getFlexType())); 
   }
    /**
    * This method is used to get the oid by taking name of the record.
    * @param FlexType  flexType
    * @param Map criteria
    * @param String name
    * @Exception exception
    * @return return oid by taking name of the record of the flex object
    */ 
  public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
            return "no record";
    }
    
        public JSONObject getFlexLinkInfo(String objectType,JSONObject rootObject,JSONObject propertiesObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex link info ***** "+ objectType));
        JSONObject responseObject = new JSONObject();
        try{
            String firstKey ="";
            String secondKey ="";
            String firstKeyValue ="";
            String secondKeyValue ="";
            String skuOid = "";
            String seasonOid = "";
            Set keys = rootObject.keySet();
            Iterator itr = keys.iterator();
            while(itr.hasNext()) {
                firstKey = (String)itr.next();
                secondKey = (String)itr.next();
                if(propertiesObject.containsKey(firstKey) && propertiesObject.containsKey(secondKey)){
                    if(firstKey.equalsIgnoreCase("skuOid") ){
                        skuOid = (String)rootObject.get(firstKey);
                        seasonOid = (String)rootObject.get(secondKey);
                    }else{
                        seasonOid = (String)rootObject.get(firstKey);
                        skuOid = (String)rootObject.get(secondKey);
                    }
                }
            }
            if ((skuOid != null) && !("".equalsIgnoreCase(skuOid)) && (seasonOid != null) && !("".equalsIgnoreCase(seasonOid))) {
                responseObject.put(objectType, findSeasonSKULink(objectType, skuOid,seasonOid));
            }
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
    * This method is used to find the  ColorwaySeasonLink records by passing skuOid,seasonOid.
    * @param String  objectType
    * @param String skuOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the ColorwaySeasonLink flex object
    */ 
    public JSONObject findSeasonSKULink(String objectType,String skuOid,String seasonOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find season Sku link with skuOid ***** " + skuOid + "-----seasonOid-----" + seasonOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSSKU lcsSku = (LCSSKU) LCSQuery.findObjectById(skuOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
            LCSSeasonProductLink lcsSeasonProductLink = LCSSeasonQuery.findSeasonProductLink(lcsSku,lcsSeason);
            String seasonSKUOid = FormatHelper.getNumericObjectIdFromObject(lcsSeasonProductLink);
            seasonSKUOid = "OR:com.lcs.wc.season.LCSSKUSeasonLink:"+seasonSKUOid;
            responseObject =  getRecordByOid(objectType,seasonSKUOid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    } 

    /**
    * This method is used to  build response in the form of JSON object
    * @param oid   
    * @param responseObject  response jsonObject
    * @param type selected flex object
    * @exception Exception
    * @return JSONObject  contains response object in the form of json.
    */
  public JSONObject getUpdateResponseObject(String flexType, String selectedOid, JSONObject responseObject){
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "*****get update response object ***** " + selectedOid +"------flexType------"+flexType));
    responseObject.put("status","Success");
    responseObject.put("message",flexType+" object updated successfully");
    responseObject.put("statusCode",200);
    responseObject.put("oid",selectedOid);
    return responseObject;
  } 

}