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
package cdee.web.model.sizing;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Collection;
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
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.season.LCSSeason;
import java.util.Set;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.sourcing.LCSSKUSourcingLink;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.util.IntrospectionHelper;
import com.lcs.wc.skusize.SKUSizeToSeason;
import com.lcs.wc.skusize.SKUSizeToSeasonMaster;
import com.lcs.wc.skusize.SKUSize;
import com.lcs.wc.skusize.SKUSizeMaster;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.skusize.SKUSizeQuery;
import com.lcs.wc.skusize.SKUSizeToSeasonClientModel;
import com.lcs.wc.skusize.SKUSizeClientModel;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SkuSizeSeasonLinkModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SkuSizeSeasonLinkModel.class.getName());
//private static final String CLASSNAME = SkuSizeSeasonLinkModel.class.getName();

  AppUtil util = new AppUtil();
  Gson gson= new Gson();


  /**
      * This method is used either insert or update the SkuSizeSeasonLink flex object that are  passed by using type as reference,
      * oid and array of different SkuSizeSeasonLink data 
      * Using this method we can insert/update several records of a SkuSizeSeasonLink flextype at a time.
      * @param type String 
      * @param oid String
      * @param SkuSizeSeasonLinkJSONArray  Contains array of SkuSizeSeasonLink data
      * @exception Exception
      * @return JSONArray  It returns SkuSizeSeasonLink JSONArray object
  */

  public JSONObject saveOrUpdate(String type, String oid, JSONObject skuSizeSeasonJSONData,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
               //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSkuSizeSeason ***** "));
                responseObject = createSkuSizeSeason(type, payloadJson);

            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSkuSizeSeason with oid ***** "));
                responseObject = updateSkuSizeSeason(util.getAttributesFromScope("SKU_SIZE_SEASON_SCOPE", payloadJson),type, oid);
                
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

  

    /**
      * This method is used to insert the SkuSizeSeasonLink flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SkuSizeSeasonLink flextype at a time.
      * @param type is a string 
      * @param SkuSizeSeasonLinkDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SkuSizeSeasonLink JSONArray object
      */  
    public JSONObject createSkuSizeSeason(String type, JSONObject skuSeasonJsonObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Sku Size Season  initialized ***** "));
        JSONObject responseObject = new JSONObject();
        LCSSeasonQuery lcsSeasonQuery = new LCSSeasonQuery();
        try {
            String colorwayOid = (String) skuSeasonJsonObject.get("skuOid");
            String seasonOid = (String) skuSeasonJsonObject.get("seasonOid");
            LCSSKU lcsSku = (LCSSKU) LCSQuery.findObjectById(colorwayOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
           // LCSSeasonLogic seasonLogic = new LCSSeasonLogic();
          //  seasonLogic.addSKU (lcsSku,lcsSeason);
         //   LCSSeasonProductLink lcsSeasonProductLink = LCSSeasonQuery.findSeasonProductLink(lcsSku,lcsSeason);
         //   String seasonSKUOid = FormatHelper.getObjectId(lcsSeasonProductLink);
         //   String colorwaySeasonOid = updateSkuSeason(util.getAttributesFromScope("PRODUCT-SEASON", skuSeasonJsonObject), seasonSKUOid);
         //   responseObject = util.getInsertResponse(colorwaySeasonOid, type, responseObject);

        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return util.getExceptionJson("SKU Size Season creation is not supported.");
    }

   

    /**
      * This method is used to update the SkuSizeSeasonLink flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a SkuSizeSeasonLink flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param SkuSizeSeasonLinkJsonObject  Contains SkuSizeSeasonLink data
      * @exception Exception
      * @return String  It returns OID of SkuSizeSeasonLink object
      */

    public JSONObject updateSkuSizeSeason(Map skuSizeSeasonAttr,String type, String skuSizeSeasonOid) throws WTException {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update sku size season  initialized ***** "+ skuSizeSeasonOid));
       
        String oid = "";
        String latestSkuSizeSeasonOid = "";
        JSONObject responseObject = new JSONObject();
        SKUSizeToSeasonClientModel skuSizeToSeasonModel = new SKUSizeToSeasonClientModel();
        SKUSizeClientModel skuSizeModel = new SKUSizeClientModel();
        try {
           SKUSizeToSeason skuSizeSeasonInput = (SKUSizeToSeason) LCSQuery.findObjectById(skuSizeSeasonOid);
            SKUSizeToSeason skuSizeSeason = skuSizeSeasonInput;
         try{
            skuSizeSeason = (SKUSizeToSeason) VersionHelper.latestIterationOf(skuSizeSeasonInput);
        }catch(Exception e){
        }
        latestSkuSizeSeasonOid = FormatHelper.getObjectId(skuSizeSeason);
        skuSizeToSeasonModel.load(latestSkuSizeSeasonOid);
      
       AttributeValueSetter.setAllAttributes(skuSizeToSeasonModel, skuSizeSeasonAttr);
       //        skuSizeModel.save();
       skuSizeToSeasonModel.save();
       oid = FormatHelper.getObjectId(skuSizeToSeasonModel.getBusinessObject());
       responseObject = util.getUpdateResponse(oid, type, responseObject);

        } catch (Exception ex) {
             responseObject=util.getExceptionJson(ex.getMessage());
        }
        return responseObject;
    }

  /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.skusize.SKUSizeToSeason"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex Schema with type and typeId ***** "));
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
                        attrsList.add(attribute);
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
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records with typeId and objectType ***** "));
        SearchResults results = new SearchResults();
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        FlexType flexType = null;
        //Map criteria = util.convertJsonToMap(jsonObject,criteriaMap); 
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot("Sourcing Configuration");
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        results = flexSpecQuery.findSpecsByCriteria(criteriaMap,flexType,null,null);
        return util.getResponseFromResults(results,objectType);
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
        return "VR:com.lcs.wc.skusize.SKUSizeToSeason:"+(String)flexObject.getString("SKUSIZETOSEASON.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        SKUSizeToSeason skuSizeSeasonInput = (SKUSizeToSeason) LCSQuery.findObjectById(oid);
        SKUSizeToSeason skuSizeSeason = skuSizeSeasonInput;
         try{
            skuSizeSeason = (SKUSizeToSeason) VersionHelper.latestIterationOf(skuSizeSeasonInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(skuSizeSeason.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(skuSizeSeason.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid", FormatHelper.getVersionId(skuSizeSeason));
        jSONObject.put("typeId",FormatHelper.getObjectId(skuSizeSeason.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(skuSizeSeason).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",skuSizeSeason.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(skuSizeSeason));
        SKUSizeToSeasonMaster master = (SKUSizeToSeasonMaster) skuSizeSeason.getMaster();
        LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(master.getSeasonMaster());
        String seasonOid = FormatHelper.getVersionId(season);
        jSONObject.put("seasonOid", seasonOid);
        jSONObject.put("active", skuSizeSeason.isActive());
        SKUSize skuSize = (SKUSize)VersionHelper.latestIterationOf(master.getSkuSizeMaster());
        jSONObject.put("skuSizeactive", skuSize.isActive());
        LCSSKU sku = (LCSSKU)VersionHelper.latestIterationOf(((SKUSizeMaster)skuSize.getMaster()).getSkuMaster());
        jSONObject.put("skuOid", FormatHelper.getVersionId(sku));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        //Added to get size value
        SKUSizeMaster SKUSizeMaster = master.getSkuSizeMaster();
        jSONObject.put("skuSize1 ",SKUSizeMaster.getSizeValue());
        jSONObject.put("skuSize2",SKUSizeMaster.getSize2Value());
        //end
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = skuSizeSeason.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(skuSizeSeason.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,skuSizeSeason.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
      }
        Collection attributes1 = skuSize.getFlexType().getAllAttributes();
        Iterator it1 = attributes1.iterator();
        while(it1.hasNext()){
          FlexTypeAttribute att1 = (FlexTypeAttribute) it1.next();
          String attKey1 = att1.getAttKey();
          try{
              if(skuSize.getValue(attKey1) == null){
                jSONObject.put(attKey1,"");
              }
              else{
                jSONObject.put(attKey1,skuSize.getValue(attKey1).toString());
            }
          }catch(Exception e){
            }
      }      
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(skuSizeSeason.getFlexType()));  
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex Link Info  ***** "));
        JSONObject responseObject = new JSONObject();
        try{
    if(propertiesObject.containsKey("seasonOid") && propertiesObject.containsKey("skuOid"))
    {
    String skuOid = (String)rootObject.get("skuOid");
        String seasonOid = (String)rootObject.get("seasonOid");
    responseObject.put(objectType, findSKUSizeSeasonLink(objectType,skuOid,seasonOid));
     }
     else
    {
    throw new Exception("Required attributes not filled");
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
    public JSONObject findSKUSizeSeasonLink(String objectType,String skuSOid,String seasonOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find SKU Size Season Link with skuSOid  ***** "+skuSOid +"-----seasonOid------"+ seasonOid ));
        LCSSourcingConfigQuery lcsSourcingConfigQuery = new LCSSourcingConfigQuery(); 
        JSONObject responseObject = new JSONObject();
        JSONArray sizeCategoryArray = new JSONArray();
        try {
       LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
       LCSSKU sku = (LCSSKU) LCSQuery.findObjectById(skuSOid);
       LCSSeasonMaster seasonMaster = lcsSeason.getMaster();
       LCSPartMaster skuMaster = (LCSPartMaster)sku.getMaster();
       Collection<SKUSizeToSeason> skuSizeToSeasonCollection = SKUSizeQuery.getSKUSizeToSeasonFromSKUSeason(seasonMaster, skuMaster);
       if ((skuSizeToSeasonCollection != null) && (skuSizeToSeasonCollection.size() > 0)) {
        for (SKUSizeToSeason skuSizeSeason : skuSizeToSeasonCollection)
        {
          String skuSizeseasonId = FormatHelper.getObjectId(skuSizeSeason);
          JSONObject sizeSeaonObject = getRecordByOid("Colorway Size to Season", skuSizeseasonId);
          sizeCategoryArray.add(sizeSeaonObject);
        }
      }
      responseObject.put("Colorway Size to Season",sizeCategoryArray);
     
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
}