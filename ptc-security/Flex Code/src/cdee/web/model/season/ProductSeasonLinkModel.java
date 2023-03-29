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
import com.lcs.wc.season.LCSProductSeasonLink;
import java.util.Collection;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.part.LCSPart;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.product.LCSProduct;
import cdee.web.model.product.ProductModel;
import com.lcs.wc.season.SeasonProductLocator;
import cdee.web.util.DataConversionUtil;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.season.LCSSeasonProductLink;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.season.LCSSeasonProductLink;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import wt.util.WTException;
import java.util.Set;
import com.lcs.wc.season.LCSSeasonProductLinkClientModel; 
import com.lcs.wc.season.LCSSeasonClientModel;
import com.lcs.wc.season.LCSSeasonLogic;
import com.lcs.wc.util.MOAHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class ProductSeasonLinkModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(ProductSeasonLinkModel.class.getName());
 //private static final String CLASSNAME = ProductSeasonLinkModel.class.getName();
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
    public JSONObject saveOrUpdate(String type, String oid, JSONObject productSeasonJSONData,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "------oid---------"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
            //    ArrayList list = util.getOidFromSeachCriteria(type, productSeasonJSONData,payloadJson);
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSeasonProductLink  ***** "));
   
                responseObject = createSeasonProductLink(type, payloadJson);
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  callingupdateSeasonProductLink ***** "));
   
                String productSeasonOid = updateSeasonProductLink(util.getAttributesFromScopeLevel("PRODUCT-SEASON", "PRODUCT",payloadJson), oid);
                responseObject = util.getUpdateResponse(productSeasonOid, type, responseObject);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }



    public JSONObject createSeasonProductLink(String type, JSONObject productSeasonJsonObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Created Season Product Link ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSSeasonProductLinkClientModel seasonProductLinkModel = new LCSSeasonProductLinkClientModel();
        LCSSeasonClientModel seasonModel = new LCSSeasonClientModel();
       
        try {
            String productOid = (String) productSeasonJsonObject.get("productOid");
            String seasonOid = (String) productSeasonJsonObject.get("seasonOid");

            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);

            seasonModel.load(seasonOid);
            seasonModel.addProducts(MOAHelper.getMOACollection((String) FormatHelper.getObjectId(lcsProduct.getMaster())));

            LCSSeasonProductLink lcsSeasonProductLink = LCSSeasonQuery.findSeasonProductLink(lcsProduct,lcsSeason);
            String seasonProdOid = FormatHelper.getObjectId(lcsSeasonProductLink);            
            seasonProductLinkModel.load(seasonProdOid);
            //String productSeasonOid = updateSeasonProductLink(util.getAttributesFromScope("PRODUCT-SEASON", productSeasonJsonObject), seasonProdOid);
            String productSeasonOid = updateSeasonProductLink(util.getAttributesFromScopeLevel("PRODUCT-SEASON", "PRODUCT",productSeasonJsonObject), seasonProdOid);

            responseObject = util.getInsertResponse(productSeasonOid, type, responseObject);

        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) { 
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    public String updateSeasonProductLink(Map seasonProductLinkScopeAttrs, String seasonProductOid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Season product link ***** "+ seasonProductOid));
        String oid = "";
        LCSSeasonProductLinkClientModel seasonProductLinkModel = new LCSSeasonProductLinkClientModel();
        try {
            seasonProductLinkModel.load(seasonProductOid);
            AttributeValueSetter.setAllAttributes(seasonProductLinkModel, seasonProductLinkScopeAttrs);
            seasonProductLinkModel.save();
            oid = FormatHelper.getObjectId(seasonProductLinkModel.getBusinessObject());
        }  catch (Exception e) {
        	throw new Exception(e);
        }
        return oid;
    }
    /**
      * This method is used to insert the SeasonGroup flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SeasonGroup flextype at a time.
      * @param type is a string 
      * @param seasonGroupDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */  

    public JSONObject createSeasonGroup(String type, ArrayList seasonGroupDataList){

        return null;
    }

    /**
      * This method is used to update the SeasonGroup flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a SeasonGroup flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param seasonGroupJsonObject  Contains SeasonGroup data
      * @exception Exception
      * @return String  It returns OID of SeasonGroup object
      */

    public JSONObject updateSeasonGroup(String oid,String type, JSONObject seasonGroupJsonObject) throws Exception{
    
        return null;
    }




    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.season.LCSProductSeasonLink"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get Flex Schema with type and typeId ***** "));
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
                                        || attribute.getAttObjectLevel().equals("PRODUCT"))) {
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSProductSeasonLink lcsProductSeasonLinkInput = (LCSProductSeasonLink) LCSQuery.findObjectById(oid);
        LCSProductSeasonLink lcsProductSeasonLink = lcsProductSeasonLinkInput;
         DataConversionUtil datConUtil=new DataConversionUtil();        
        try{
            LCSProduct lcsProduct = SeasonProductLocator.getProductSeasonRev(lcsProductSeasonLink);
            LCSProduct lcsProducts = SeasonProductLocator.getProductSeasonRev(lcsProductSeasonLink);
            if(!"A".equals(lcsProduct.getVersionIdentifier().getValue())){
                 lcsProduct = (LCSProduct) VersionHelper.getVersion(lcsProduct.getMaster(), "A");
            }
            //
            LCSPart lcsPart = lcsProductSeasonLink.getOwner();
            lcsProducts = (LCSProduct) lcsPart;
            String seasonProdOid = FormatHelper.getObjectId(lcsProductSeasonLink);
            String productOid = FormatHelper.getVersionId(lcsProduct);
            String productOid2 = FormatHelper.getVersionId(lcsProducts);
            LCSSeasonMaster seasonMaster = (LCSSeasonMaster)lcsProductSeasonLink.getSeasonMaster();
            LCSSeason lcsSeason = (LCSSeason) VersionHelper.latestIterationOf(seasonMaster);
            String seasonOid = FormatHelper.getVersionId(lcsSeason);
            jSONObject.put("seasonRemoved", lcsProductSeasonLink.isSeasonRemoved());
            jSONObject.put("productMasterReference", lcsProduct.getMaster()+"");
            jSONObject.put("seasonMasterReference", lcsProductSeasonLink.getSeasonMaster()+"");

            jSONObject.put("seasonOid", seasonOid);
            jSONObject.put("productOid", productOid);
            jSONObject.put("productOid2", productOid2);
            jSONObject.put("createdOn",FormatHelper.applyFormat(lcsProductSeasonLink.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
            jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsProductSeasonLink.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
            jSONObject.put("image",null);
            jSONObject.put("oid",oid);
            jSONObject.put("typeId",FormatHelper.getObjectId(lcsProductSeasonLink.getFlexType()));
            jSONObject.put("ORid",FormatHelper.getObjectId(lcsProductSeasonLink).toString());
            jSONObject.put("flexName",objectType);
            jSONObject.put("typeHierarchyName",lcsProductSeasonLink.getFlexType().getFullNameDisplay(true));
            jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsProductSeasonLink));
            //required here
            String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
            SimpleDateFormat sdf = new SimpleDateFormat(pattern);
            String updated = sdf.format(lcsProductSeasonLink.getModifyTimestamp());
            jSONObject.put("orderingTimestamp",updated);
            String lifeCycleState = lcsProduct.getLifeCycleState().getDisplay();
            jSONObject.put("lifeCycleState", lcsProducts.getLifeCycleState());  
            String lifeCycleNameLabel = lcsProducts.getLifeCycleName();
            jSONObject.put("lifecycleName", lifeCycleNameLabel);
            String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
            jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        }catch(Exception e){
            e.printStackTrace();
        }
        Collection attributes = lcsProductSeasonLink.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while(it.hasNext()){
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            
            try{
                if(lcsProductSeasonLink.getValue(attKey) == null){
                              
                    jSONObject.put(attKey,"");
                }
                else{
                      boolean cond= datConUtil.checkIfMultiType(attKey,objectType,FormatHelper.getObjectId(lcsProductSeasonLink.getFlexType()));
                         if(cond)
                         {
                              LCSProduct lcsProducta = SeasonProductLocator.getProductSeasonRev(lcsProductSeasonLink);
                              jSONObject.put(attKey,lcsProducta.getValue(attKey));
                         }
                         else
                             jSONObject.put(attKey,lcsProductSeasonLink.getValue(attKey));
              } 
            }catch(Exception e){
            }
        }
       
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsProductSeasonLink.getFlexType())); 
    }

    /**
    * This method is used to get the ProductSeasonLink Info by passing productOid,seasonOid.
    * @param String  objectType
    * @param String productOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the ProductSeasonLink flex object
    */ 

    public JSONObject getFlexLinkInfo(String objectType,JSONObject rootObject,JSONObject propertiesObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex link info ***** "));
        JSONObject responseObject = new JSONObject();
        try{
            String firstKey ="";
            String secondKey ="";
            String firstKeyValue ="";
            String secondKeyValue ="";
            String productOid = "";
            String seasonOid = "";
            Set keys = rootObject.keySet();
            Iterator itr = keys.iterator();
            while(itr.hasNext()) {
                firstKey = (String)itr.next();
                secondKey = (String)itr.next();
                if(propertiesObject.containsKey(firstKey) && propertiesObject.containsKey(secondKey)){
                    if(firstKey.equalsIgnoreCase("productOid") ){
                        productOid = (String)rootObject.get(firstKey);
                        seasonOid = (String)rootObject.get(secondKey);
                    }else{
                        seasonOid = (String)rootObject.get(firstKey);
                        productOid = (String)rootObject.get(secondKey);
                    }
                }
            }
            if ((productOid != null) && !("".equalsIgnoreCase(productOid)) && (seasonOid != null) && !("".equalsIgnoreCase(seasonOid))) {
                responseObject.put(objectType, findSeasonProductLink(objectType, productOid,seasonOid));
            }
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
    * This method is used to find the  ProductSeasonLink records by passing productOid,seasonOid.
    * @param String  objectType
    * @param String productOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the ProductSeasonLink flex object
    */ 
    public JSONObject findSeasonProductLink(String objectType,String productOid,String seasonOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find season product link ***** "+ productOid + "----seasonOid-----"+ seasonOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
            LCSSeasonProductLink lcsSeasonProductLink = LCSSeasonQuery.findSeasonProductLink(lcsProduct,lcsSeason);
            String seasionProductOid = FormatHelper.getNumericObjectIdFromObject(lcsSeasonProductLink);
            seasionProductOid = "OR:com.lcs.wc.season.LCSProductSeasonLink:"+seasionProductOid;
            responseObject =  getRecordByOid(objectType,seasionProductOid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
}