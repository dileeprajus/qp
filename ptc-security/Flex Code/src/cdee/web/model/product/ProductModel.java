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
package cdee.web.model.product;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import cdee.web.services.GenericObjectService;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.last.LCSLastClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.LCSProductClientModel;
import cdee.web.model.placeholder.PlaceholderModel;
import cdee.web.model.season.ProductSeasonLinkModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.season.SeasonModel;
import com.lcs.wc.season.LCSSeasonQuery;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.specification.FlexSpecQuery;
import cdee.web.model.bom.BOMModel;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.construction.LCSConstructionQuery;
import cdee.web.model.construction.ConstructionInfoModel;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import cdee.web.model.measurements.MeasurementsModel;
import cdee.web.model.document.DocumentModel;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.ProductDestinationQuery;
import cdee.web.model.plan.PlanModel;
import com.lcs.wc.planning.FlexPlan;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.product.LCSSKUQuery;
import cdee.web.model.sizing.SizingModel;
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.season.SeasonProductLocator;
import com.lcs.wc.document.LCSDocumentQuery;
import cdee.web.model.specification.SpecificationModel;
import com.lcs.wc.placeholder.PlaceholderQuery;
import cdee.web.model.product.ProductDestinationModel;
import wt.util.WTException;
import cdee.web.model.bom.BOMLinkModel;
import com.lcs.wc.product.LCSProductLogic;
import com.lcs.wc.flexbom.FlexBOMLink;
import com.lcs.wc.flexbom.*;
import com.lcs.wc.season.LCSSeasonProductLink;
import com.lcs.wc.sample.LCSSampleQuery;
import java.util.Hashtable;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.sample.SampleRequestModel;
import cdee.web.model.sample.SampleModel;
import com.lcs.wc.sourcing.LCSCostSheetQuery;
import cdee.web.model.season.ProductSeasonLinkModel;
import cdee.web.model.sourcing.RFQModel;
import cdee.web.model.sourcing.CostSheetModel;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import wt.fc.WTObject;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import com.lcs.wc.util.DeleteFileHelper;
import com.lcs.wc.product.CopyModeUtil;
import wt.util.WTMessage;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
//port org.apache.commons.codec.binary.Base64;

public class ProductModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(ProductModel.class.getName());
 //private static final String CLASSNAME = ProductModel.class.getName();

    AppUtil util = new AppUtil();
    String Rev_MAIN = "com.lcs.wc.resource.RevControlledRB";

    /**
     * This method is used either insert or update the Product flex object that are  passed by using type as reference,
     * oid and array of different Product data 
     * Using this method we can insert/update  record of a Product flextype at a time.
     * @param type String 
     * @param oid String
     * @param payloadJson  Contains array of Product data
     * @exception Exception
     * @return JSONObject  It returns Product JSONObject object
     */

    public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"------oid-------"+oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateProduct with criteria ***** "));
                    responseObject = updateProduct(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createProduct ***** "));
                    responseObject = createProduct(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateProduct with criteria ***** "));
                responseObject = updateProduct(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }

        return responseObject;
    }

    /**
     * This method is used to insert the Product flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Product flextype at a time.
     * @param type is a string 
     * @param ProductDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Product JSONArray object
     */

    public JSONObject createProduct(String type, JSONObject productDataList) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Product  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSProductClientModel productModel = new LCSProductClientModel();
        try {
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(productDataList,type,(String)productDataList.get("typeId"));
            AttributeValueSetter.setAllAttributes(productModel, convertedAttrs);
           
            if(productDataList.containsKey("base64File") && productDataList.containsKey("base64FileName") && productDataList.containsKey("imageKey") )
            productModel = imageAssignment (productModel,productDataList);             
            
            //
            productModel.save();
            String productOid = FormatHelper.getVersionId(productModel.getBusinessObject()).toString();
            responseObject = util.getInsertResponse(productOid, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the Product flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Product flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param ProductJsonObject  Contains Product data
     * @exception Exception
     * @return String  It returns OID of Product object
     */


    public JSONObject updateProduct(String oid, String type, JSONObject attrsJsonObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update product  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSProductClientModel productModel = new LCSProductClientModel();
        try {
            productModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(attrsJsonObject,type,FormatHelper.getObjectId(productModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(productModel, convertedAttrs);
            //
            if(attrsJsonObject.containsKey("base64File") && attrsJsonObject.containsKey("base64FileName") && attrsJsonObject.containsKey("imageKey") )
            productModel = imageAssignment (productModel,attrsJsonObject);  
            
            productModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(productModel.getBusinessObject()).toString(), type, responseObject);
        } catch (NullPointerException e) {
            responseObject = util.getExceptionJson("NullPointerException");
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Product of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(oid);
            LCSProductLogic lcsProductLogic = new LCSProductLogic();
            lcsProductLogic.deleteProduct(lcsProduct, true);
            responseObject = util.getDeleteResponseObject("Product", oid, responseObject);
        } catch (WTException wte) {
             //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception in Delete  ***** "+wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.product.LCSProduct");
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
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema  ***** "));
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
					if (attribute.getAttScope().equals("PRODUCT")
							&& (attribute.getAttObjectLevel().equals("PRODUCT-SKU")
									|| attribute.getAttObjectLevel().equals("PRODUCT"))) {
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSProductQuery().findProductsByCriteria(criteriaMap, flexType, null, null, null);
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
        LCSProductQuery lcsProductQuery = new LCSProductQuery();
        Collection < FlexObject > response = lcsProductQuery.findProductsByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSPRODUCT.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.product.LCSProduct:" + oid;
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
        return "VR:com.lcs.wc.product.LCSProduct:" + (String) flexObject.getString("LCSPRODUCT.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** " + oid));
        JSONObject jSONObject = new JSONObject();
        LCSProduct lcsProductInput = (LCSProduct) LCSQuery.findObjectById(oid);
        LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion((WTObject) lcsProductInput.getMaster(), "A");
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsProduct.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsProduct.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", lcsProduct.getPartPrimaryImageURL());
        jSONObject.put("oid", util.getVR(lcsProduct));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsProduct).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsProduct.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsProduct.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsProduct));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsProduct));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        String lifeCycleState = lcsProduct.getLifeCycleState().getDisplay();
        jSONObject.put("lifeCycleState", lifeCycleState);  
        jSONObject.put("IDA2AVer1", lcsProduct.getVersionIdentifier().getValue()) ;
        jSONObject.put("IDA2AVer", VersionHelper.getFullVersionIdentifierValue(lcsProduct)) ;
        Collection attributes = lcsProduct.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsProduct.getValue(attKey) == null){
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsProduct.getValue(attKey));
                }
            } catch (Exception e) {
            }
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
       
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsProduct.getFlexType()));  
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
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** association  initialized ***** "));
        JSONObject jSONObject = new JSONObject();
        try{
            if (association.equalsIgnoreCase("Season")) {
                jSONObject.put("Season", findSeasons(oid));
            } else if (association.equalsIgnoreCase("Sourcing Configuration")) {
                jSONObject.put("Sourcing Configuration", findSourcingConfigurations(oid));
            } else if (association.equalsIgnoreCase("BOM")) {
                jSONObject.put("BOM", findBOMs(oid));
            } else if (association.equalsIgnoreCase("Construction")) {
                jSONObject.put("Construction", findConstructions(oid));
            } else if (association.equalsIgnoreCase("Measurements")) {
                jSONObject.put("Measurements", findMeasurements(oid));
            } else if (association.equalsIgnoreCase("Image Page")) {
                jSONObject.put("Image Page", findImagePages(oid));
            } else if (association.equalsIgnoreCase("Plan")) {
                jSONObject.put("Plan", findPlans(oid));
            } else if (association.equalsIgnoreCase("Product Destination")) {
                jSONObject.put("Product Destination", findProductDestinations(oid));
            } else if (association.equalsIgnoreCase("Colorway")) {
                jSONObject.put("Colorway", findColorways(oid));
            } else if (association.equalsIgnoreCase("Size Category")) {
                jSONObject.put("Size Category", findSizeCategorys(oid));
            } else if (association.equalsIgnoreCase("Specification")) {
                jSONObject.put("Specification", findSpecifications(oid));
            } else if (association.equalsIgnoreCase("Reference Document")) {
                jSONObject.put("Reference Document", findRefDocs(oid));
            } else if (association.equalsIgnoreCase("Described Document")) {
                jSONObject.put("Described Document", findDesDocs(oid));
            } else if (association.equalsIgnoreCase("Product Season Link")) {
                jSONObject.put("Product Season Link", findSeasonProductLink(oid));
            } else if (association.equalsIgnoreCase("Sample")) {
                jSONObject.put("Sample", findSamples(oid));
            } else if (association.equalsIgnoreCase("Size Definition")) {
                jSONObject.put("Size Definition", findSizeDefintions(oid));
            }else if (association.equalsIgnoreCase("Cost Sheet")) {
                jSONObject.put("Cost Sheet", findCostSheets(oid));
            }else if (association.equalsIgnoreCase("Linked Product")) {
                jSONObject.put("Linked Product", findLinkedProduct(oid));
            }

        }catch(Exception e){
            
        }
        return jSONObject;
    }

    /**
     * This method is used to get the Season records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Season records in the form of array
     */
    public JSONArray findSeasons(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find seasons with association object productOid ***** "+ productOid));
        JSONArray seasonArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = new LCSSeasonQuery().findSeasons(lcsProduct);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSeasonMaster seasonMaster = (LCSSeasonMaster) itr.next();
                LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(seasonMaster);
                String seasonOid = FormatHelper.getObjectId(season);
                JSONObject seasonObject = new SeasonModel().getRecordByOid("Season", seasonOid);
                seasonArray.add(seasonObject);
            }
        } catch (Exception e) {
            seasonArray.add(util.getExceptionJson(e.getMessage()));
        }
        return seasonArray;
    }

    /**
     * This method is used to get the Sourcing Configuration records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Sourcing Configuration records in the form of array
     */
    public JSONArray findSourcingConfigurations(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find sourceing configurations with association object productOid***** "+ productOid));
        SourcingConfigurationModel sourcingConfigurationModel = new SourcingConfigurationModel();
        JSONArray sourcingConfigArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = new LCSSourcingConfigQuery().getSourcingConfigsForProduct(lcsProduct);
            Iterator list = response.iterator();
            while (list.hasNext()) {
                LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) list.next();
                String sourcingConfigOid = FormatHelper.getObjectId(lcsSourcingConfig);
                JSONObject sourcingConfigObject = sourcingConfigurationModel.getRecordByOid("Sourcing Configuration", sourcingConfigOid);
                sourcingConfigArray.add(sourcingConfigObject);
            }
        } catch (Exception e) {
            sourcingConfigArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sourcingConfigArray;
    }

    /**
     * This method is used to get the BOM records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated BOM records in the form of array
     */
    public JSONArray findBOMs(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find Boms with association object productOid***** " + productOid));
        BOMModel bomModel = new BOMModel();
        LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
        JSONArray flexBOMPartArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lCSFlexBOMQuery.findBOMPartsForOwner(lcsProduct);
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
     * This method is used to get the Construction records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Construction records in the form of array
     */
    public JSONArray findConstructions(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find constructions  with association object productOid ***** "+ productOid));
        ConstructionInfoModel constructionInfoModel = new ConstructionInfoModel();
        LCSConstructionQuery lcsConstructionQuery = new LCSConstructionQuery();
        JSONArray constructionArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lcsConstructionQuery.findConstructionForProduct(lcsProduct).getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String constructionOid = constructionInfoModel.getOid(flexObject);
                JSONObject constructionObject = constructionInfoModel.getRecordByOid("Construction", constructionOid);
                constructionArray.add(constructionObject);
            }
        } catch (Exception e) {
            constructionArray.add(util.getExceptionJson(e.getMessage()));
        }

        return constructionArray;
    }

    /**
     * This method is used to get the Measurements records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Measurements records in the form of array
     */
    public JSONArray findMeasurements(String productOid) {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find measurements with association object productOid ***** "+ productOid));
        MeasurementsModel measurementsModel = new MeasurementsModel();
        LCSMeasurementsQuery lcsMeasurementsQuery = new LCSMeasurementsQuery();
        JSONArray measurementsArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lcsMeasurementsQuery.findMeasurmentsForProduct(lcsProduct).getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject measurementsObj = (FlexObject) itr.next();
                String measurementsOid = measurementsModel.getOid(measurementsObj);
                JSONObject measurementsObject = measurementsModel.getRecordByOid("Measurements", measurementsOid);
                measurementsArray.add(measurementsObject);
            }
        } catch (Exception e) {
            measurementsArray.add(util.getExceptionJson(e.getMessage()));
        }
        return measurementsArray;
    }

    /**
     * This method is used to get the ImagePages records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated ImagePages records in the form of array
     */
    public JSONArray findImagePages(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "*****Find images pages with association object productOid***** "+ productOid));
        LCSProductQuery lcsProductQuery = new LCSProductQuery();
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lcsProductQuery.getProductImages(lcsProduct);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSDocument lcsDocument = (LCSDocument) itr.next();
                String documentOid = FormatHelper.getObjectId(lcsDocument);
                JSONObject documentObject = documentModel.getRecordByOid("Document", documentOid);
                documentArray.add(documentObject);
            }
        } catch (Exception e) {
            documentArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentArray;
    }

    
    /**
     * This method is used to get the Plan records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Plan records in the form of array
     */
    public JSONArray findPlans(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find plans with association object productOid ***** " + productOid));
        PlanQuery planQuery = new PlanQuery();
        JSONArray planArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            LCSPartMaster productMaster = (LCSPartMaster) lcsProduct.getMaster();
            Collection response = planQuery.findProductPlans(productMaster, null, null, null, false, false);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexPlan flexPlan = (FlexPlan) itr.next();
                String planOid = FormatHelper.getObjectId(flexPlan);
                JSONObject planObject = new PlanModel().getRecordByOid("Plan", planOid);
                planArray.add(planObject);
            }
        } catch (Exception e) {
            planArray.add(util.getExceptionJson(e.getMessage()));
        }
        return planArray;
    }


    /**
     * This method is used to get the Product Destination records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Product Destination records in the form of array
     */
    public JSONArray findProductDestinations(String productOid) {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find product Destinations with association object productOid ***** " + productOid));
        ProductDestinationQuery productDestinationQuery = new ProductDestinationQuery();
        JSONArray destinationArray = new JSONArray();
        ProductDestinationModel productDestinations = new ProductDestinationModel();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            LCSPartMaster productMaster = (LCSPartMaster) lcsProduct.getMaster();
            SearchResults searchResults = productDestinationQuery.findProductDestinationsforProduct(productMaster);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject destinationData = (FlexObject) itr.next();
                String destinationOid = productDestinations.getOid(destinationData);
                JSONObject destinationObject = productDestinations.getRecordByOid("Product Destination", destinationOid);
                destinationArray.add(destinationObject);
            }
        } catch (Exception e) {
            destinationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return destinationArray;
    }

    /**
     * This method is used to get the Colorway records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Colorway records in the form of array
     */
    public JSONArray findColorways(String productOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find colorways with association object productOid ***** "+ productOid));
        ColorwayModel colorwayModel = new ColorwayModel();
        LCSSKUQuery lcsSKUQuery = new LCSSKUQuery();
        JSONArray colorwayArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
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

    /**
     * This method is used to get the SizeCategory records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated SizeCategory records in the form of array
     */
    public JSONArray findSizeCategorys(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find size categories with association object productOid ***** " + productOid));
        SizingQuery sizingQuery = new SizingQuery();
        SizingModel sizingModel = new SizingModel();
        JSONArray sizeCategoryArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = sizingQuery.findProductSizeCategoriesForProduct(lcsProduct).getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String sizeCategoryOid = sizingModel.getOid(flexObject);
                JSONObject sizeCategoryObject = sizingModel.getRecordByOid("Size Category", sizeCategoryOid);
                sizeCategoryArray.add(sizeCategoryObject);
            }
        } catch (Exception e) {
            sizeCategoryArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sizeCategoryArray;
    }

    /**
     * This method is used to get the Specification records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Specification records in the form of array
     */

    public JSONArray findSpecifications(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find specifications with association object productOid ***** "+ productOid));
        SpecificationModel specificationModel = new SpecificationModel();
        JSONArray specificationArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = FlexSpecQuery.findSpecsByOwner((LCSPartMaster) lcsProduct.getMaster(), null, null, null).getResults();
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
     * This method is used to get the Reference Documents records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Reference Documents records in the form of array
     */
    public JSONArray findRefDocs(String productOid) {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find Ref docs with association object productOid ***** "+ productOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentRefArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = new LCSDocumentQuery().findPartDocReferences(lcsProduct);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
            	FlexObject lcsDocument = (FlexObject) itr.next();
            	String documentOid = documentModel.getOid(lcsDocument);
                //LCSDocument lcsDocument = (LCSDocument) itr.next();
                //String documentOid = FormatHelper.getObjectId(lcsDocument);
                JSONObject documentObject = documentModel.getRecordByOid("Document", documentOid);
                documentRefArray.add(documentObject);
            }
        } catch (Exception e) {
            documentRefArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentRefArray;
    }
    
    /**
     * This method is used to get the Described Documents records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Described Documents records in the form of array
     */
    public JSONArray findDesDocs(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find PartDocDescribe with association object productOid ***** "+ productOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentDesArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = new LCSDocumentQuery().findPartDocDescribe(lcsProduct);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
            	FlexObject lcsDocument = (FlexObject) itr.next();
            	String documentOid = documentModel.getOid(lcsDocument);
                //LCSDocument lcsDocument = (LCSDocument) itr.next();
                //String documentOid = FormatHelper.getObjectId(lcsDocument);
                JSONObject documentObject = documentModel.getRecordByOid("Document", documentOid);
                documentDesArray.add(documentObject);
            }
        } catch (Exception e) {
            documentDesArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentDesArray;
    }


    

    /**
     * This method is used to get the Season ProductLink records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Season ProductLink records in the form of array
     */
    public JSONArray findSeasonProductLink(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find season product link ***** "+ productOid));
        LCSSeasonQuery lcsSeasonQuery = new LCSSeasonQuery();
        JSONArray seasonProductArray = new JSONArray();
        ProductSeasonLinkModel productSeasonLinkModel = new ProductSeasonLinkModel();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lcsSeasonQuery.findSeasons(lcsProduct);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSeasonMaster seasonMaster = (LCSSeasonMaster) itr.next();
                LCSSeasonProductLink seasonProductLinkObj = (LCSSeasonProductLink) LCSSeasonQuery.findSeasonProductLink(lcsProduct, (LCSSeason) VersionHelper.latestIterationOf(seasonMaster));
                if (seasonProductLinkObj != null && !seasonProductLinkObj.isSeasonRemoved()){
                    JSONObject seasonProductObject = productSeasonLinkModel.getRecordByOid("Product Season Link", FormatHelper.getObjectId(seasonProductLinkObj));
                    seasonProductArray.add(seasonProductObject);
                }
            }
        } catch (Exception e) {
            seasonProductArray.add(util.getExceptionJson(e.getMessage()));
        }
        return seasonProductArray;
    }

    /**
     * This method is used to get the Sample records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Sample records in the form of array
     */


    public JSONArray findSamples(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find samples ***** "+ productOid));
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        JSONArray sampleArray = new JSONArray();
        SampleModel sampleModel = new SampleModel();
        SpecificationModel specificationModel = new SpecificationModel();
        SourcingConfigurationModel sourcingConfigurationModel = new SourcingConfigurationModel();
        SampleRequestModel sampleRequestModel = new SampleRequestModel();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            SearchResults searchResults = lcsSampleQuery.findSamplesForProduct(lcsProduct, new Hashtable(), null, null);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String sampleOid = sampleModel.getOid(flexObject);
                JSONObject sampleObject = sampleModel.getRecordByOid("Sample", sampleOid);
                String sampleRequestOid = sampleRequestModel.getOid(flexObject);
                String sourcingConfigurationOid = sourcingConfigurationModel.getOid(flexObject);
                String specificationOid = specificationModel.getOid(flexObject);
                sampleObject.put("sampleRequestOid", sampleRequestOid);
                sampleObject.put("sourcingConfigurationOid", sourcingConfigurationOid);
                sampleObject.put("specificationOid", specificationOid);
                sampleArray.add(sampleObject);
            }

        } catch (Exception e) {
            sampleArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sampleArray;
    }

    /**
     * This method is used to get the SizeDefintion records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated SizeDefintion records in the form of array
     */
    public JSONArray findSizeDefintions(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find size definitions  with association object productOid ***** "+ productOid));
        SizingQuery sizingQuery = new SizingQuery();
        SizingModel sizingModel = new SizingModel();
        JSONArray sizeDefintionArray = new JSONArray();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            SearchResults searchResults = sizingQuery.findPSDByProductAndSeason(lcsProduct);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                JSONObject sizeCategoryObject = new JSONObject();
                String sizeCategoryName = (String) flexObject.get("SIZECATEGORY.NAME");
                String sizeCategoryIDA2A2 = "OR:com.lcs.wc.sizing.SizeCategory:" + (String) flexObject.getString("SIZECATEGORY.IDA2A2");
                sizeCategoryObject.put("name", sizeCategoryName);
                sizeCategoryObject.put("oid", sizeCategoryIDA2A2);
                JSONObject fullSizeRangeObject = new JSONObject();
                String sizeRangeName = (String) flexObject.get("FULLSIZERANGE.NAME");
                String fullSizeRRangeSizeValues = (String) flexObject.get("FULLSIZERANGE.SIZEVALUES");
                String fullSizeRRangeSize2Values = (String) flexObject.get("FULLSIZERANGE.SIZE2VALUES");
                String fullSizeRRangeSize1Label = (String) flexObject.get("FULLSIZERANGE.SIZE1LABEL");
                String fullSizeRRangeSize2Label = (String) flexObject.get("FULLSIZERANGE.SIZE2LABEL");
                String fullSizeRangeCategoryOid = "OR:com.lcs.wc.sizing.FullSizeRange:" + (String) flexObject.getString("FULLSIZERANGE.IDA2A2");
                fullSizeRangeObject.put("name", sizeRangeName);
                fullSizeRangeObject.put("sizeValues", fullSizeRRangeSizeValues);
                fullSizeRangeObject.put("size2Values", fullSizeRRangeSize2Values);
                fullSizeRangeObject.put("size1Label", fullSizeRRangeSize1Label);
                fullSizeRangeObject.put("size2Label", fullSizeRRangeSize2Label);
                fullSizeRangeObject.put("oid", fullSizeRangeCategoryOid);
                String sizeValues = (String) flexObject.get("PRODUCTSIZECATEGORY.SIZEVALUES");
                String size2Values = (String) flexObject.get("PRODUCTSIZECATEGORY.SIZE2VALUES");
                String baseSize = (String) flexObject.get("PRODUCTSIZECATEGORY.BASESIZE");
                String baseSize2 = (String) flexObject.get("PRODUCTSIZECATEGORY.BASESIZE2");
                String sizingOid = sizingModel.getOid(flexObject);
                JSONObject sizeDefinitionObject = sizingModel.getRecordByOid("Size Definition", sizingOid);
                sizeDefinitionObject.put("sizeValues", sizeValues);
                sizeDefinitionObject.put("size2Values", size2Values);
                sizeDefinitionObject.put("baseSize", baseSize);
                sizeDefinitionObject.put("baseSize2", baseSize2);
                sizeDefinitionObject.put("Size Category", sizeCategoryObject);
                sizeDefinitionObject.put("Full Size Range", fullSizeRangeObject);
                sizeDefintionArray.add(sizeDefinitionObject);
            }
        } catch (Exception e) {
            sizeDefintionArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sizeDefintionArray;
    }

    /**
     * This method is used to get the Sample records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Sample records in the form of array
     */

    public JSONArray findCostSheets(String productOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find CostSheets  with association object productOid ***** "+ productOid));
        JSONArray costSheetArray = new JSONArray();
        CostSheetModel costSheetModel = new CostSheetModel();
        //SpecificationModel specificationModel = new SpecificationModel();
        LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery();
        
        RFQModel rfqModel = new RFQModel();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection response = lcsCostSheetQuery.getCostSheetsForProduct(new HashMap(),lcsProduct,null,null,null,false,false);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String costSheetOid = costSheetModel.getOid(flexObject);
                JSONObject costSheetObject = costSheetModel.getRecordByOid("Cost Sheet", costSheetOid);
                
                costSheetArray.add(costSheetObject);
            }

        } catch (Exception e) {
            costSheetArray.add(util.getExceptionJson(e.getMessage()));
        }
        return costSheetArray;
    }

    public LCSProductClientModel imageAssignment(LCSProductClientModel productModel, JSONObject attrsJsonObject)throws Exception{

        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
            productModel.setPartPrimaryImageURL(util.setImage(fileName, thumbnail));
            } else {
                    productModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
        return productModel;
    }

    public JSONArray findLinkedProduct(String productOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find linked products ***** " + productOid));
        JSONArray linkedProductArray = new JSONArray();
        ProductModel productModel = new ProductModel();
        try{
            LCSProduct product = (LCSProduct) LCSQuery.findObjectById(productOid);
            Collection parentLinks = LCSProductQuery.getLinkedProducts(FormatHelper.getObjectId((WTObject) product.getMaster()), true, false);
            Iterator itr = parentLinks.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String linkedProductOid = (String) "VR:com.lcs.wc.product.LCSProduct:"+flexObject.get("CHILDPRODUCT.BRANCHIDITERATIONINFO");
                JSONObject linkedProductObject = productModel.getRecordByOid("Product", linkedProductOid);
                linkedProductObject.put("RelationshipType", flexObject.get("PRODUCTTOPRODUCTLINK.LINKTYPE"));
                if("sibling".equalsIgnoreCase(CopyModeUtil.getRelationshipType((String)flexObject.get("PRODUCTTOPRODUCTLINK.LINKTYPE")))){
                    linkedProductObject.put("Relationship", "Parent");
                }else{
                    linkedProductObject.put("Relationship", "Child");
                }
                linkedProductArray.add(linkedProductObject);
            }
            Collection childLinks = LCSProductQuery.getLinkedProducts(FormatHelper.getObjectId((WTObject) product.getMaster()), false, true);
            Iterator itr1 = childLinks.iterator();
            while (itr1.hasNext()) {
                FlexObject flexObject = (FlexObject) itr1.next();
                String linkedProductOid = (String) "VR:com.lcs.wc.product.LCSProduct:"+flexObject.get("PARENTPRODUCT.BRANCHIDITERATIONINFO");
                JSONObject linkedProductObject = productModel.getRecordByOid("Product", linkedProductOid);
                linkedProductObject.put("RelationshipType", flexObject.get("PRODUCTTOPRODUCTLINK.LINKTYPE"));
                if("sibling".equalsIgnoreCase(CopyModeUtil.getRelationshipType((String)flexObject.get("PRODUCTTOPRODUCTLINK.LINKTYPE")))){
                    linkedProductObject.put("Relationship", "Child");
                }else{
                    linkedProductObject.put("Relationship", "Parent");
                }
                linkedProductArray.add(linkedProductObject);
            }
        } catch (Exception e) {
            linkedProductArray.add(util.getExceptionJson(e.getMessage()));
        }
        return linkedProductArray;
    }

    /**
     * This method is used to get the Image thumbnails records of given productOid .
     * @param String productOid
     * @return JSONArray  it returns the Product associated Image thumbnails records in the form of array
     */



    public JSONObject findThumbnailData(String productOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findThumbnails ***** "+ productOid));
        JSONObject jsonObj = new JSONObject();
        Collection attributes = null;
        FlexTypeAttribute att = null;
        String attKey = "";
        String productThumbnail = "";
        String imageString = "";
        JSONArray thumbArray = new JSONArray();
        String value = FileLocation.imageLocation + FileLocation.fileSeperator;
        String imageType = "jpg";
       
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
           // String imageUrl = lcsProduct.getPartPrimaryImageURL();
            productThumbnail = lcsProduct.getPartPrimaryImageURL();
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ productThumbnail));
            if (FormatHelper.hasContent(productThumbnail)) {
                imageType = productThumbnail.substring(productThumbnail.lastIndexOf("/") + 1, productThumbnail.length());
                productThumbnail = productThumbnail.trim();
                String inputImage = lcsProduct.getPartPrimaryImageURL();
                String stImage = "/images/";
                int indx = inputImage.lastIndexOf(stImage);
                if (indx > -1) {
                inputImage = inputImage.substring(indx + stImage.length());
                }
                inputImage = com.lcs.wc.util.FileLocation.imageLocation.concat(File.separator).concat(inputImage);
                //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* inputImage findThumbnails ***** "+ inputImage));
                File f = new File(inputImage);
                FileInputStream fis = new FileInputStream(f);
                byte byteArray[] = new byte[(int) f.length()];
                fis.read(byteArray);
                imageString = Base64.getEncoder().encodeToString(byteArray);
                jsonObj.put("imageEncoded", imageString);
                jsonObj.put("imageFileName", imageType);
                          
            }

        }

        catch(Exception ex) {
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* Exception  .." + ex));
        }
        
        return jsonObj;
       
    }

	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject)
			throws Exception {

		String seasonOid = "";
		String productOid = "";
		boolean primaryCostSheet = true;
		boolean primarySource = true;
		boolean primarySpec = true;
		boolean costSheet = true;
		boolean source = true;
		boolean spec = true;
		boolean colorway = true;
		boolean seasonLink = true;
		String sourceOid = "";
		String key = "";

		JSONObject innerObject = new JSONObject();
		JSONArray array = new JSONArray();
		Set<?> keys = rootObject.keySet();
		Iterator<?> itr = keys.iterator();

		while (itr.hasNext()) {
			key = (String) itr.next();
			if (key.equalsIgnoreCase("seasonOid")) {
				seasonOid = (String) rootObject.get(key);
			} else if (key.equalsIgnoreCase("productOid")) {
				productOid = (String) rootObject.get(key);
			} else if (key.equalsIgnoreCase("primarySource")) {
				primarySource = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("primaryCostSheet")) {
				primaryCostSheet = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("primarySpec")) {
				primarySpec = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("costSheet")) {
				costSheet = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("source")) {
				source = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("spec")) {
				spec = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("colorway")) {
				colorway = (boolean) rootObject.get(key);
			} else if (key.equalsIgnoreCase("seasonLink")) {
				seasonLink = (boolean) rootObject.get(key);
			}
		}

		JSONObject rootObjectSC = new JSONObject();
		rootObjectSC.put("seasonOid", seasonOid);
		rootObjectSC.put("productOid", productOid);

		JSONObject propObject = new JSONObject();
		propObject.put("productOid", "");
		propObject.put("seasonOid", "");
		propObject.put("sourceOid", "");
		if (seasonLink) {
			ProductSeasonLinkModel pslModel = new ProductSeasonLinkModel();
			JSONObject pslResponse = (JSONObject) pslModel.getFlexLinkInfo("Product Season Link", rootObjectSC,
					propObject);
			innerObject.put("Product Season Link", pslResponse.get("Product Season Link"));
		}

		if (colorway) {
			ColorwayModel cModel = new ColorwayModel();
			JSONObject cResponse = (JSONObject) cModel.getFlexLinkInfo("Colorway", rootObjectSC, propObject);
			innerObject.put("Colorway", cResponse.get("Colorway"));
		}

		if (source) {
			JSONArray sourceObject = new JSONArray();
			rootObjectSC.put("primarySeason", primarySource);
			SourcingConfigurationModel scModel = new SourcingConfigurationModel();
			JSONObject sResponse = scModel.getFlexLinkInfo("Sourcing Configuration", rootObjectSC, null);
			JSONArray sArray = (JSONArray) sResponse.get("Sourcing Configuration");
			for (int ii = 0; ii < sArray.size(); ii++) {
				JSONObject sourceValue = (JSONObject) sArray.get(ii);
				sourceOid = (String) sourceValue.get("oid");
				rootObjectSC.put("sourceOid", sourceOid);
				if (costSheet) {
					CostSheetModel csModel = new CostSheetModel();
					rootObjectSC.put("primary", primaryCostSheet);
					JSONObject csResponse = (JSONObject) csModel.getFlexLinkInfo("Cost Sheet Product", rootObjectSC,
							propObject);
					sourceValue.put("CostSheet", csResponse.get("Cost Sheet Product"));
				}
				if (spec) {
					SpecificationModel sModel = new SpecificationModel();
					rootObjectSC.put("primarySpec", primarySpec);
					JSONObject specResponse = (JSONObject) sModel.getFlexLinkInfo("Specification", rootObjectSC,
							propObject);
					sourceValue.put("Specification", specResponse.get("Specification"));
				}
				sourceObject.add(sourceValue);
			}
			innerObject.put("Sourcing Configuration", sourceObject);
		}
		return innerObject;
	}
	
}