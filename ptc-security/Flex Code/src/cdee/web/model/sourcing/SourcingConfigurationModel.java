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
package cdee.web.model.sourcing;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Set;
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
import com.lcs.wc.foundation.LCSLogEntryQuery;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.LCSSourcingConfigClientModel;
import cdee.web.model.specification.SpecificationModel;
import com.lcs.wc.product.LCSProductQuery;
import cdee.web.model.bom.BOMModel;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.sourcing.LCSCostSheet;
import com.lcs.wc.sourcing.LCSCostSheetMaster;
import com.lcs.wc.sourcing.LCSCostSheetQuery;
import cdee.web.model.sourcing.CostSheetModel;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.sourcing.LCSProductCostSheet;
import com.lcs.wc.sourcing.LCSSKUCostSheet;
import com.lcs.wc.sourcing.LCSSKUSourcingLink;
import com.lcs.wc.product.LCSSKU;
import cdee.web.model.product.ColorwayModel;
import cdee.web.model.product.ProductModel;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.fc.WTObject;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.product.ProductHeaderQuery;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.sourcing.LCSSourceToSeasonLink;
import com.lcs.wc.sourcing.LCSSourcingConfigLogic;
import com.lcs.wc.util.LCSProperties;
import wt.log4j.LogR;

public class SourcingConfigurationModel extends GenericObjectService {

    AppUtil util = new AppUtil();
    Gson gson = new Gson();
    String sourcingConfigOid = "";


    /**
     * This method is used either insert or update the SourcingConfiguration flex object that are  passed by using type as reference,
     * oid and array of different SourcingConfiguration data 
     * Using this method we can insert/update several records of a SourcingConfiguration flextype at a time.
     * @param type String 
     * @param oid String
     * @param sourcingConfigJsonData  Contains jasonObject of SourcingConfiguration data
     * @exception Exception
     * @return JSONObject  It returns SourcingConfiguration JSONObject object
     */

    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
      
        JSONObject responseObject = new JSONObject();
        try{
        if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                
                    responseObject = updateSourcingConfig(list.get(2).toString(), type, payloadJson);
                } else {
                    
                    responseObject = createSourcingConfig(type, payloadJson);
                }
            } else {
               
                responseObject = updateSourcingConfig(oid, type, payloadJson);
            }
      } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
      }
        return responseObject;
    }

    /**
     * This method is used to insert the SourcingConfiguration flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a SourcingConfiguration flextype at a time.
     * @param type is a string 
     * @param sourcingConfigurationDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns SourcingConfiguration JSONArray object
     */

    public JSONObject createSourcingConfig(String type, JSONObject sourcingConfigAttrs) {
          
        JSONObject responseObject = new JSONObject();
        LCSSourcingConfigClientModel sourcingModel = new LCSSourcingConfigClientModel();
        try {
            String productOid = (String)sourcingConfigAttrs.get("productOid");
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(sourcingConfigAttrs,type,(String)sourcingConfigAttrs.get("typeId"));
            convertedAttrs.put("productId", (String) sourcingConfigAttrs.get("productOid"));
            AttributeValueSetter.setAllAttributes(sourcingModel,convertedAttrs);
           sourcingModel.save();
           responseObject = util.getInsertResponse(FormatHelper.getVersionId(sourcingModel.getBusinessObject()).toString(),type,responseObject);
      
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the SourcingConfiguration flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a SourcingConfiguration flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param sourcingConfigurationJsonObject  Contains SourcingConfiguration data
     * @exception Exception
     * @return String  It returns OID of SourcingConfiguration object
     */

    public JSONObject updateSourcingConfig(String oid,String type, JSONObject sourceConfigJsonAttrs) throws Exception {
          
        JSONObject responseObject = new JSONObject();
        LCSSourcingConfigClientModel sourcingModel = new LCSSourcingConfigClientModel();
        try {
            sourcingModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(sourceConfigJsonAttrs,type,FormatHelper.getObjectId(sourcingModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(sourcingModel,convertedAttrs);
            sourcingModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(sourcingModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /*
     * This method is used delete sample of given oid,
     * @param bomlinkOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
        
        JSONObject responseObject = new JSONObject();
        try {
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSSourcingConfigQuery.findObjectById(oid);
            LCSSourcingConfigLogic sourcingConfigLogic = new LCSSourcingConfigLogic();
            sourcingConfigLogic.deleteSourcingConfig(lcsSourcingConfig);
            responseObject = util.getDeleteResponseObject("Sourcing Configuration", oid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.LCSSourcingConfig");
    }

    /**
     * This method is used to get the schema for the given typeId of this flex object .
     * @param String  type
     * @param String typeId
     * @param JSONObject jsonAsscos
     * @Exception exception
     * @return JSONObject  it returns the schema for the given typeId of this flex object .
     */

    public JSONObject getFlexSchema(String type,String typeId) throws Exception{
     
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
                    if(attribute.getAttScope().equals("SOURCING_CONFIG_SCOPE")){
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
     * @param typeId  String
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */

    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
       
        FlexType flexType = null;
        JSONObject object = new JSONObject();
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        Collection response = LCSSourcingConfigQuery.getSourcingConfig_migration();
        Iterator itr = response.iterator();
        JSONArray responseArray = new JSONArray();
        while (itr.hasNext()) {
            JSONObject responseObject = new JSONObject();
            FlexObject flexObject = (FlexObject) itr.next();
            String sourcingConfigOid = getOid(flexObject);
            responseObject = getRecordByOid(objectType, sourcingConfigOid);
            responseArray.add(responseObject);
        }
        object.put(objectType, responseArray);
        return object;
    }

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param typeId  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String typeId, String objectType, Map criteriaMap) throws Exception {
      
        SearchResults results = new SearchResults();
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        try {
            FlexType flexType = null;
            if (typeId == null) {
                flexType = FlexTypeCache.getFlexTypeFromPath(objectType);
            } else {
                flexType = FlexTypeCache.getFlexType(typeId);
            }

            results = flexSpecQuery.findSpecificationsByCriteria(criteriaMap, flexType, null, null);
        } catch (Exception e) {
        }
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
      
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        Collection < FlexObject > response = flexSpecQuery.findSpecsByCriteria(criteria, flexType, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.sourcing.LCSSourcingConfig:" + oid;
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
      
        String IDA2A2 = (String) flexObject.getString("LCSSOURCINGCONFIG.IDA2A2");
        String oid = "";
		/*
		 * if (IDA2A2 != null) { oid = "OR:com.lcs.wc.sourcing.LCSSourcingConfig:" +
		 * (String) flexObject.getString("LCSSOURCINGCONFIG.IDA2A2"); } else {
		 */
            oid = "VR:com.lcs.wc.sourcing.LCSSourcingConfig:" + (String) flexObject.getString("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO");
       // }
        return oid;
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return String  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
       
        JSONObject jSONObject = new JSONObject();
        
        LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSSourcingConfigQuery.findObjectById(oid);
        try {
        lcsSourcingConfig = (LCSSourcingConfig)VersionHelper.getVersion((WTObject) lcsSourcingConfig.getMaster(), "A");
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsSourcingConfig.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsSourcingConfig.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("oid", util.getVR(lcsSourcingConfig));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsSourcingConfig.getFlexType()));
        jSONObject.put("ORid", FormatHelper.getObjectId(lcsSourcingConfig).toString());
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsSourcingConfig.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSourcingConfig));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsSourcingConfig));
        jSONObject.put("primarySource", lcsSourcingConfig.isPrimarySource());
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsSourcingConfig.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsSourcingConfig.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsSourcingConfig.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        //
        LCSPartMaster lcsProductMaster = lcsSourcingConfig.getProductMaster();
        LCSProduct lcsProductData = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
        String productOid = FormatHelper.getVersionId(lcsProductData);
        jSONObject.put("productOid", productOid);
        //
        }
        catch (Exception e) {}
        DataConversionUtil datConUtil=new DataConversionUtil();
       // datConUtil.getSystemData(lcsSourcingConfig,util.getVR(lcsSourcingConfig));
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSourcingConfig.getFlexType()));   
     }

    
    /**
     * This method is used to fetch the record that matched with the given oid of this flex object with association flexObject records.
     * @param String  objectType which contains flexObject name
     * @param String oid 
     * @param String association which contains association(includes) flexObject name
     * @Exception exception
     * @return JSONObject  it returns the record that matched the given oid of this flex object with association flexObject records
     */
    public JSONObject getRecordByOid(String objectType, String oid, String association) throws Exception {
     
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("BOM")) {
            jSONObject.put("BOM", findBOMs(oid));
        } else if (association.equalsIgnoreCase("Cost Sheet")) {
            jSONObject.put("Cost Sheet", findCostSheets(oid));
        }else if (association.equalsIgnoreCase("Product")) {
            jSONObject.put("Product", findProduct(oid));
        }else if (association.equalsIgnoreCase("Product")) {
            jSONObject.put("Product", findProduct(oid));
        }else if (association.equalsIgnoreCase("Specification")) {
            jSONObject.put("Specification", findSpecifications(oid));
        }else if (association.equalsIgnoreCase("Sourcing Configuration to Season")) {
            jSONObject.put("Sourcing Configuration to Season", findSourceToSeaon(oid));
        }else if (association.equalsIgnoreCase("Colorway")) {
            jSONObject.put("Colorway", findColorways(oid));
        }else if (association.equalsIgnoreCase("Sourcing Configuration to Colorway")) {
            jSONObject.put("Sourcing Configuration to Colorway", findSkuSourcing(oid));
        }
        return jSONObject;
    }



    /**
     * This method is used to get the BOM records of given sourceConfigOid .
     * @param String sourceConfigOid
     * @return JSONArray  it returns the Sourcing Configuration associated BOM records in the form of array
     */
    public JSONArray findBOMs(String sourceConfigOid) {
       
        BOMModel bomModel = new BOMModel();
        LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
        JSONArray flexBOMPartArray = new JSONArray();
        try {
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
            LCSPartMaster lcsProductMaster = lcsSourcingConfig.getProductMaster();
            LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
            String productOid = FormatHelper.getObjectId(lcsProduct);
            Collection response = LCSFlexBOMQuery.findBOMObjects(lcsProduct, lcsSourcingConfig, null, "MAIN");
            //Collection response = lCSFlexBOMQuery.findBOMPartsForOwner(lcsSourcingConfig);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                JSONObject flexBOMPartObject = new JSONObject();
                FlexBOMPart flexBOMPart = (FlexBOMPart) itr.next();
                String flexBOMPartOid = FormatHelper.getObjectId(flexBOMPart);
                flexBOMPartObject = bomModel.getRecordByOid("BOM", flexBOMPartOid);
                flexBOMPartArray.add(flexBOMPartObject);
            }
        } catch (Exception e) {
            flexBOMPartArray.add(util.getExceptionJson(e.getMessage()));
        }

        return flexBOMPartArray;
    }



    /**
     * This method is used to get the CostSheet records of given sourceConfigOid .
     * @param String sourceConfigOid
     * @return JSONArray  it returns the Sourcing Configuration associated CostSheet records in the form of array
     */

	/*
	 * public JSONArray findCostSheets(String sourceConfigOid) { if
	 * (LOGGER.isDebugEnabled()) LOGGER.debug((Object) (CLASSNAME +
	 * "***** find cost sheets sourceConfigOid ***** "+ sourceConfigOid));
	 * LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery(); CostSheetModel
	 * costSheetModel = new CostSheetModel(); CostSheetSKUModel costSheetSKUModel =
	 * new CostSheetSKUModel();
	 * 
	 * JSONArray costSheetArray = new JSONArray(); String costSheetId = ""; try {
	 * LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig)
	 * LCSQuery.findObjectById(sourceConfigOid); Collection response =
	 * lcsCostSheetQuery.getAllCostSheetsForSourcingConfig(lcsSourcingConfig);
	 * Iterator itr = response.iterator(); while (itr.hasNext()) { costSheetId =
	 * itr.next().toString(); if (costSheetId.contains("LCSProductCostSheet")) {
	 * JSONObject costSheetObject =
	 * costSheetModel.getRecordByOid("Cost Sheet Product", costSheetId);
	 * costSheetArray.add(costSheetObject);
	 * 
	 * }else { JSONObject costSheetObject =
	 * costSheetSKUModel.getRecordByOid("Cost Sheet Colorway", costSheetId);
	 * costSheetArray.add(costSheetObject);
	 * 
	 * }
	 * 
	 * } } catch (Exception e) {
	 * costSheetArray.add(util.getExceptionJson(e.getMessage())); } return
	 * costSheetArray; }
	 */
    
    public JSONArray findCostSheets(String sourceConfigOid) {
        
        boolean ALLOW_MULTPLE = LCSProperties.getBoolean("com.lcs.wc.sourcing.useLCSMultiCosting") || LCSProperties.getBoolean("com.lcs.wc.foundation.LCSCostSheetLogic.allowMultipleCostSheets");
         LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery();
         CostSheetModel costSheetModel = new CostSheetModel();
         CostSheetSKUModel costSheetSKUModel = new CostSheetSKUModel();

         JSONArray costSheetArray = new JSONArray();
         String costSheetId = "";
         try {
        	 LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
             Collection responseCS = lcsCostSheetQuery.getAllCostSheetsForSourcingConfig(lcsSourcingConfig);
             Iterator itr = responseCS.iterator();
             while (itr.hasNext()) {
                 costSheetId = itr.next().toString();
                 LCSCostSheet costSheet = (LCSCostSheet) LCSQuery.findObjectById(costSheetId);
                 if((costSheet instanceof LCSProductCostSheet && ALLOW_MULTPLE))
                 {
 	                if (costSheetId.contains("LCSProductCostSheet")) {
 	                    JSONObject costSheetObject = costSheetModel.getRecordByOid("Cost Sheet Product", costSheetId);
 	                    costSheetArray.add(costSheetObject);
 	
 	                }
                 }
                 if((costSheet instanceof LCSSKUCostSheet && !ALLOW_MULTPLE))
                {
                     JSONObject costSheetObject = costSheetSKUModel.getRecordByOid("Cost Sheet Colorway", costSheetId);
                     costSheetArray.add(costSheetObject);

                 }

             }
         } catch (Exception e) {
             costSheetArray.add(util.getExceptionJson(e.getMessage()));
         }
         return costSheetArray;
     }
    

     /**
     * This method is used to get the Colorway records of given sourceConfigOid .
     * @param String sourceConfigOid
     * @return JSONArray  it returns the Sourcing Configuration associated Colorway records in the form of array
     */
    public JSONArray findColorways(String sourceConfigOid) {
       
         ColorwayModel colorwayModel = new ColorwayModel();
         JSONArray colorwayArray = new JSONArray();
         try {
             ProductHeaderQuery phq = new ProductHeaderQuery();
             //getSKUSourcingLinks(LCSSourcingConfig sConfig) throws 
             LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
             LCSPartMaster lcsProductMaster = lcsSourcingConfig.getProductMaster();
             LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
             Iterator itr = lcsProduct.findSKUObjects().iterator();
             while (itr.hasNext()) {
                 LCSSKU lcsSku = (LCSSKU) itr.next();
                 lcsSku=(LCSSKU)VersionHelper.latestIterationOf(lcsSku);
                 String colorwayOid = FormatHelper.getVersionId(lcsSku);
                 JSONObject colorwayObject = colorwayModel.getRecordByOid("Colorway", colorwayOid);
                 colorwayArray.add(colorwayObject);
             }
           
         } catch (Exception e) {
        	 colorwayArray.add(util.getExceptionJson(e.getMessage()));
         }
         return colorwayArray;
     }
    public JSONArray findSkuSourcing(String sourceConfigOid) {
       
         ColorwayModel colorwayModel = new ColorwayModel();
         JSONArray skuLinkObjectArray = new JSONArray();
         try {
             LCSSourcingConfig sconfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
             SkuSourcingSeasonLinkModel skuSourceModel = new SkuSourcingSeasonLinkModel();
             ProductHeaderQuery phq = new ProductHeaderQuery();
             //getSKUSourcingLinks(LCSSourcingConfig sConfig) throws 
             LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
             Collection skulinks = new LCSSourcingConfigQuery().getSKUSourcingLinks(sconfig);
             Iterator slinks = skulinks.iterator();
             LCSSKUSourcingLink skulink;
             LCSSKU tempSKU = null;
             LCSCostSheet productSheet = null;
             while(slinks.hasNext()){
            	 skulink = (LCSSKUSourcingLink)slinks.next();
                 String skuLinkId = FormatHelper.getObjectId(skulink);
                 JSONObject skuLinkObject = skuSourceModel.getRecordByOid("Sourcing Configuration to Colorway", skuLinkId);
                 skuLinkObjectArray.add(skuLinkObject);
                 
             }
           
         } catch (Exception e) {
        	 skuLinkObjectArray.add(util.getExceptionJson(e.getMessage()));
         }
         return skuLinkObjectArray;
     }
    
    public JSONArray findColorwaysold(String sourceConfigOid) {
     
        LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery();
        ColorwayModel colorwayModel = new ColorwayModel();
        JSONArray colorwayArray = new JSONArray();
        try {
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
            SearchResults searchResults = lcsCostSheetQuery.getSKUCostSheetDataForSourcingConfig(lcsSourcingConfig, false);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSKU lcsSKU = (LCSSKU) itr.next();
                String skuId = FormatHelper.getObjectId(lcsSKU);
                JSONObject colorwayObject = colorwayModel.getRecordByOid("Colorway", skuId);
                colorwayArray.add(colorwayObject);
            }
        } catch (Exception e) {
            colorwayArray.add(util.getExceptionJson(e.getMessage()));
        }
        return colorwayArray;
    }

    public JSONArray findProduct(String sourceConfigOid) {
      
        ProductModel productModel = new ProductModel();
        JSONArray productArray = new JSONArray();
        try {
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
            LCSPartMaster lcsProductMaster = lcsSourcingConfig.getProductMaster();
            LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
            String productOid = FormatHelper.getObjectId(lcsProduct);
            JSONObject productObject = productModel.getRecordByOid("Product", productOid);
            productArray.add(productObject);
    
        } catch (Exception e) {
            productArray.add(util.getExceptionJson(e.getMessage()));
        }
        return productArray;
    }

    /**
     * This method is used to get the Specification records of given sampleOid .
     * @param String sampleOid getSourceToSeasonLinks
     * @return JSONArray  it returns the Sample associated Specification records in the form of array
     */
    public JSONArray findSpecifications(String sourceConfigOid) {
       
        SpecificationModel specificationModel = new SpecificationModel();
        JSONArray specificationArray = new JSONArray();
        Collection specList;
        try {
            ProductHeaderQuery phq = new ProductHeaderQuery();
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
            LCSPartMaster lcsProductMaster = lcsSourcingConfig.getProductMaster();
            LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
            String productOid = FormatHelper.getObjectId(lcsProduct);
            WTObject sObj = (LCSSourcingConfigMaster)lcsSourcingConfig.getMaster();
            Collection response = FlexSpecQuery.findSpecsByOwner((LCSPartMaster) lcsProduct.getMaster(), null, sObj, null).getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String specificationOid = specificationModel.getOid(flexObject);
                JSONObject specificationObject = specificationModel.getRecordByOid("Specification", specificationOid);
                specificationArray.add(specificationObject);
            }
          
        } catch (Exception e) {
            specificationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return specificationArray;
    }

    /**
     * This method is used to get the Specification records of given sampleOid .
     * @param String sampleOid getSourceToSeasonLinks
     * @return JSONArray  it returns the Sample associated Specification records in the form of array
     */
    public JSONArray findSourceToSeaon(String sourceConfigOid) {
      
        SourceToSeasonLinkModel sourceToSeasonLinkModel = new SourceToSeasonLinkModel();
        JSONArray specificationArray = new JSONArray();
        Collection specList;
        try {
            LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
            LCSSourcingConfigQuery lcsSourcingConfigQuery = new LCSSourcingConfigQuery();
            Collection response = lcsSourcingConfigQuery.getSourceToSeasonLinks(lcsSourcingConfig);
            //Collection response = FlexSpecQuery.findSpecsByOwner((LCSPartMaster) lcsProduct.getMaster(), null, sObj, null).getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSourceToSeasonLink lcsSourceToSeasonLink = (LCSSourceToSeasonLink) itr.next();
                String sourceseasonOid = FormatHelper.getObjectId(lcsSourceToSeasonLink);
                //FlexObject flexObject = (FlexObject) itr.next();
                //String sourceseasonOid = sourceToSeasonLinkModel.getOid(flexObject);
                JSONObject specificationObject = sourceToSeasonLinkModel.getRecordByOid("SourSourcing Configuration to Season", sourceseasonOid);
                specificationArray.add(specificationObject);
            }
          
        } catch (Exception e) {
            specificationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return specificationArray;
    }

// Function to return sourcing config based on Product, Season and primary flag. 
	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject)
			throws Exception {
		
		String productOid = "";
		boolean primary = false;
		String seasonOid = "";
		String key = "";
		JSONObject responseObject = new JSONObject();
		LCSSeasonMaster seasonMaster = null;
		LCSPartMaster productMaster = null;
		JSONArray scArray = new JSONArray();
		try {
			Set<?> keys = rootObject.keySet();
			Iterator<?> itr = keys.iterator();
			while (itr.hasNext()) {
				key = (String) itr.next();
				if (key.equalsIgnoreCase("seasonOid")) {
					seasonOid = (String) rootObject.get(key);
				} else if (key.equalsIgnoreCase("productOid")) {
					productOid = (String) rootObject.get(key);
				} else if (key.equalsIgnoreCase("primarySeason")) {
					primary = (boolean) rootObject.get(key);
				}
			}

			if (!seasonOid.equals("")) {
				LCSSeason season = (LCSSeason) LCSQuery.findObjectById(seasonOid);
				if (season != null)
					seasonMaster = season.getMaster();
			}
			if (!productOid.equals("")) {
				LCSProduct product = (LCSProduct) LCSQuery.findObjectById(productOid);
				if (product != null)
					productMaster = product.getMaster();
			}
			if (seasonMaster != null && productMaster != null) {
				if (!primary) {
					Collection<?> sourceList = LCSSourcingConfigQuery.getSourcingConfigForProductSeason(productMaster,
							seasonMaster);
					Iterator<?> listItr = sourceList.iterator();

					while (listItr.hasNext()) {
						LCSSourcingConfig flexObject = (LCSSourcingConfig) listItr.next();
						String sourceId = util.getVR(flexObject);
						JSONObject jsonObject= getRecordByOid("Sourcing Configuration",sourceId );
						scArray.add(jsonObject);
					}
				} else {
					LCSSourceToSeasonLink ssl = LCSSourcingConfigQuery.getPrimarySourceToSeasonLink(productMaster, seasonMaster);
					LCSSourcingConfig lcsSourcing = (LCSSourcingConfig) VersionHelper.getVersion(ssl.getSourcingConfigMaster(), "A");
					lcsSourcing = (LCSSourcingConfig) VersionHelper.latestIterationOf(lcsSourcing);
					String sourceId = FormatHelper.getVersionId(lcsSourcing);
					JSONObject jsonObject= getRecordByOid("Sourcing Configuration",sourceId );
					scArray.add(jsonObject);
				}
			}
			responseObject.put(objectType, scArray);

		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}
}