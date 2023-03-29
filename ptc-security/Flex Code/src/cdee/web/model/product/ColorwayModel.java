/*
 * Created on 06/07/2017
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
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.product.LCSSKUQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import com.lcs.wc.product.LCSSKUClientModel;
import cdee.web.model.color.ColorModel;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.part.LCSPartMaster;
import cdee.web.model.season.SeasonModel;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.planning.PlanLineItem;
import cdee.web.model.plan.PlanLineItemModel;
import wt.util.WTException;
import com.lcs.wc.product.LCSProductLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import com.lcs.wc.util.DeleteFileHelper;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.product.LCSProduct;
import wt.fc.WTObject;
import com.lcs.wc.season.LCSSeasonProductLink;
import cdee.web.model.season.SkuSeasonLinkModel;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import java.util.Set;

public class ColorwayModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(ColorwayModel.class.getName());
 //private static final String CLASSNAME = ColorwayModel.class.getName();

    LCSSKUQuery lcsskuquery = new LCSSKUQuery();
    ColorModel colorModel = new ColorModel();
    AppUtil util = new AppUtil();
    Gson gson = new Gson();
    PlanLineItemModel planLineItemModel = new PlanLineItemModel();


    /**
     * This method is used to update the Country flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Country flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param countryJsonObject  Contains Country data
     * @exception Exception
     * @return String  It returns OID of Country object
     */
    public JSONObject updateColorway(String oid, String type, JSONObject colorJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Colorway  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSSKUClientModel skuModel = new LCSSKUClientModel();
        try {
            skuModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(colorJsonObject,type,FormatHelper.getObjectId(skuModel.getFlexType()));

            if(colorJsonObject.containsKey("productId")){
            String productOid = (String)colorJsonObject.get("productId");
            skuModel.setProductId(productOid);
            }
            if(colorJsonObject.containsKey("seasonId")){
            String seasonId = (String)colorJsonObject.get("seasonId");
            skuModel.setSeasonId(seasonId);
            }
            if(colorJsonObject.containsKey("colorOid")){
            String colorOid = (String)colorJsonObject.get("colorOid");
            colorOid = FormatHelper.getNumericFromOid(colorOid);
            convertedAttrs.put("ptc_ref_1",colorOid);
            }
            AttributeValueSetter.setAllAttributes(skuModel, convertedAttrs);
            //
             if(colorJsonObject.containsKey("base64File") && colorJsonObject.containsKey("base64FileName") && colorJsonObject.containsKey("imageKey") )
            skuModel = imageAssignment (skuModel,colorJsonObject); 
            //
            /*Set thumnail to ProductObject*/
            String thumbnailOld = skuModel.getPartPrimaryImageURL();
            if(colorJsonObject.containsKey("partPrimaryImageURL")){
                 skuModel.setPartPrimaryImageURL((String)colorJsonObject.get("partPrimaryImageURL"));
                 com.lcs.wc.document.LCSDocumentLogic.deleteThumbnail(thumbnailOld);
            }
            if(colorJsonObject.containsKey("base64ThumbNail")){
                String thumbNail = (String)colorJsonObject.get("base64ThumbNail");
                String loadDirectory = FileLocation.wt_home + File.separator + "temp"+ File.separator;
                loadDirectory = loadDirectory +"colorway.jpg";    
                String thumbnailDel = loadDirectory;
                byte[] decodedBytes = Base64.getDecoder().decode(thumbNail);
                FileOutputStream fos = new FileOutputStream(loadDirectory);
                fos.write(decodedBytes);
                fos.close();
                LoadCommon loadCommon =new LoadCommon();
                if ((loadDirectory = loadCommon.uploadFile(loadDirectory)) != null){
                    skuModel.setPartPrimaryImageURL("/Windchill/images/"  + loadDirectory);
                }
                File file = new File(thumbnailDel);
                boolean ans = file.delete();
                com.lcs.wc.document.LCSDocumentLogic.deleteThumbnail(thumbnailOld);
            }           
            /*End*/
            skuModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(skuModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Country flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Country flextype at a time.
     * @param type is a string 
     * @param countryDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Country JSONArray object
     */
    public JSONObject createColorway(String type, JSONObject colorwayObject) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Color  initialized ***** "));
        JSONObject responseObject = new JSONObject();
        LCSSKUClientModel skuModel = new LCSSKUClientModel();
        try {
              DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(colorwayObject,type,(String)colorwayObject.get("typeId"));

            if(colorwayObject.containsKey("productId")){
            String productOid = (String)colorwayObject.get("productId");
            skuModel.setProductId(productOid);
            }
            if(colorwayObject.containsKey("seasonId")){
            String seasonId = (String)colorwayObject.get("seasonId");
            skuModel.setSeasonId(seasonId);
            }
            if(colorwayObject.containsKey("colorOid")){
            String colorOid = (String)colorwayObject.get("colorOid");
            colorOid = FormatHelper.getNumericFromOid(colorOid);
            convertedAttrs.put("ptc_ref_1",colorOid);
            }
           
			AttributeValueSetter.setAllAttributes(skuModel, convertedAttrs);
            //
             if(colorwayObject.containsKey("base64File") && colorwayObject.containsKey("base64FileName") && colorwayObject.containsKey("imageKey") )
            skuModel = imageAssignment (skuModel,colorwayObject); 
            //
           /*Set thumnail to ProductObject*/
            if(colorwayObject.containsKey("partPrimaryImageURL")){
                 skuModel.setPartPrimaryImageURL((String)colorwayObject.get("partPrimaryImageURL"));
            }
            if(colorwayObject.containsKey("base64ThumbNail")){
                String thumbNail = (String)colorwayObject.get("base64ThumbNail");
                String loadDirectory = FileLocation.wt_home + File.separator + "temp"+ File.separator;
                loadDirectory = loadDirectory +"colorway.jpg";    
                String thumbnailDel = loadDirectory;
                byte[] decodedBytes = Base64.getDecoder().decode(thumbNail);
                FileOutputStream fos = new FileOutputStream(loadDirectory);
                fos.write(decodedBytes);
                fos.close();
                LoadCommon loadCommon =new LoadCommon();
                if ((loadDirectory = loadCommon.uploadFile(loadDirectory)) != null){
                    skuModel.setPartPrimaryImageURL("/Windchill/images/"  + loadDirectory);
                }
                File file = new File(thumbnailDel);
                boolean ans = file.delete();
            }
           /*End*/
            skuModel.save();
            String colorwayId = FormatHelper.getVersionId(skuModel.getBusinessObject()).toString();
            responseObject = util.getInsertResponse(colorwayId, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Colorway of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid  ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSSKU lcsSKU = (LCSSKU) LCSQuery.findObjectById(oid);
            LCSProductLogic lcsProductLogic = new LCSProductLogic();
            //lcsProductLogic.deleteSKU(lcsSKU, false);
            lcsProductLogic.deleteSKU(lcsSKU, true);
            responseObject = util.getDeleteResponseObject("Colorway", oid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Country flex object that are  passed by using type as reference,
     * oid and array of different Country data 
     * Using this method we can insert/update several records of a Country flextype at a time.
     * @param type String 
     * @param oid String
     * @param documentJSONArray  Contains array of colors data
     * @exception Exception
     * @return JSONArray  It returns Country JSONArray object
     */

    public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson,JSONObject payloadJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"----oid------"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateColorway with criteria ***** "));

                    responseObject = updateColorway(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createColorway  ***** "));

                    responseObject = createColorway(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateColorway with oid ***** "));

                responseObject = updateColorway(oid, type, payloadJson);
            }

        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.product.LCSSKU");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema ***** "));
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
						if (attribute.getAttScope().equals("PRODUCT")
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
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** getCreate Co records  initialized ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot("Product");
        } else {
         
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSSKUQuery().findSKUsByCriteria(criteriaMap, flexType, null, null, null);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "VR:com.lcs.wc.product.LCSSKU:" + (String) flexObject.getString("LCSSKU.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSSKU lcsSKUInput = (LCSSKU) LCSQuery.findObjectById(oid);
        LCSSKU lcsSKU = (LCSSKU)VersionHelper.getVersion((WTObject) lcsSKUInput.getMaster(), "A");
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsSKU.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsSKU.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", util.getVR(lcsSKU));
        //jSONObject.put("oid", oid);
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSKUInput).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsSKU.getFlexType()));
		jSONObject.put("productId", FormatHelper.getVersionId(lcsSKU.getProduct()));
        jSONObject.put("seasonId", FormatHelper.getVersionId(lcsSKU.findSeasonUsed()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsSKU.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSKU));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsSKU));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        String skuMasterRef = FormatHelper.getNumericFromReference(lcsSKU.getMasterReference());
        jSONObject.put("idA3masterReference", skuMasterRef);
        Collection attributes = lcsSKU.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsSKU.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsSKU.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSKU.getFlexType()));    
    }

    

    /**
     * This method is used to get the oid by taking name of the record.
     * @param FlexType  flexType
     * @param Map criteria
     * @param String name
     * @Exception exception
     * @return return oid by taking name of the record of the flex object
     */
    public String searchByName(Map criteria, FlexType type, String name) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        FlexType flexType = com.lcs.wc.flextype.FlexTypeCache.getFlexTypeFromPath("Product");
        Collection < FlexObject > response = lcsskuquery.findSKUsByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSSKU.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.product.LCSSKU:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Season")) {
            jSONObject.put("Season", findSeasons(oid));
        } else if (association.equalsIgnoreCase("PlanLineItem")) {
            jSONObject.put("PlanLineItem", findPlanLineItems(oid));
        } else if (association.equalsIgnoreCase("Product")) {
            jSONObject.put("Product", findProducts(oid));
        } else if (association.equalsIgnoreCase("Colorway Season Link")) {
            jSONObject.put("Colorway Season Link", findSeasonSKULink(oid));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the PlanLineItems records of given colorwayOid .
     * @param String colorwayOid
     * @return JSONArray  it returns the colorway associated PlanLineItems records in the form of array
     */
    public JSONArray findPlanLineItems(String colorwayOid) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find assocaition plne line items colorwayOid ***** "+ colorwayOid));
        JSONArray planLineItemArray = new JSONArray();
        PlanQuery planQuery = new PlanQuery();
        try {
            Collection response = planQuery.findPlanLineItemsForSku(colorwayOid);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                PlanLineItem planLineItem = (PlanLineItem) itr.next();
                String planLineItemOid = FormatHelper.getObjectId(planLineItem);
                JSONObject planLineItemObject = planLineItemModel.getRecordByOid("Plan", planLineItemOid);
                planLineItemArray.add(planLineItemObject);
            }
        } catch (Exception e) {
            planLineItemArray.add(util.getExceptionJson(e.getMessage()));
        }
        return planLineItemArray;
    }

    /**
     * This method is used to get the Season records of given colorwayOid .
     * @param String colorwayOid
     * @return JSONArray  it returns the colorway associated Season records in the form of array
     */
    public JSONArray findSeasons(String colorwayOid) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find assocaition season line items colorwayOid ***** "+ colorwayOid));
        SeasonModel seasonModel = new SeasonModel();
        JSONArray seasonArray = new JSONArray();
        try {
            LCSSKU lcsSKU = (LCSSKU) LCSQuery.findObjectById(colorwayOid);
            LCSPartMaster skuMaster = (LCSPartMaster) lcsSKU.getMaster();
            Collection response = new LCSSeasonQuery().findSeasons(skuMaster);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSeasonMaster seasonMaster = (LCSSeasonMaster) itr.next();
                LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(seasonMaster);
                String seasonOid = FormatHelper.getObjectId(season);
                JSONObject seasonObject = seasonModel.getRecordByOid("Season", seasonOid);
                seasonArray.add(seasonObject);
            }
        } catch (Exception e) {
            seasonArray.add(util.getExceptionJson(e.getMessage()));
        }
        return seasonArray;
    }

    /**
     * This method is used to get the Season records of given colorwayOid .
     * @param String colorwayOid
     * @return JSONArray  it returns the colorway associated Season records in the form of array
     */
    public JSONArray findProducts(String colorwayOid) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find assocaition product items colorwayOid ***** "+ colorwayOid));
        ProductModel productModel = new ProductModel();
        JSONArray productArray = new JSONArray();
        try {
            LCSSKU lcsSKU = (LCSSKU) LCSQuery.findObjectById(colorwayOid);
            LCSProduct lcsProduct = lcsSKU.getProduct();
            LCSPartMaster skuMaster = (LCSPartMaster) lcsSKU.getMaster();
            String productOid = FormatHelper.getObjectId(lcsProduct);
            JSONObject productObject = productModel.getRecordByOid("Product", productOid);
            productArray.add(productObject);
    
        } catch (Exception e) {
            productArray.add(util.getExceptionJson(e.getMessage()));
        }
        return productArray;
    }

        public JSONArray findSeasonSKULink(String skuOid) {
  //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find assocaition SeasonSKULink  items skuOid ***** "+ skuOid));
        LCSSeasonQuery lcsSeasonQuery = new LCSSeasonQuery();
        JSONArray seasonSKUArray = new JSONArray();
        SkuSeasonLinkModel skuSeasonLinkModel = new SkuSeasonLinkModel();
        try {
            LCSSKU lcsSKU = (LCSSKU) LCSQuery.findObjectById(skuOid);
            Collection response = lcsSeasonQuery.findSeasons(lcsSKU.getMaster());
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSeasonMaster seasonMaster = (LCSSeasonMaster) itr.next();
                LCSSeasonProductLink seasonSKULinkObj = (LCSSeasonProductLink) LCSSeasonQuery.findSeasonProductLink(lcsSKU, (LCSSeason) VersionHelper.latestIterationOf(seasonMaster));
                if (seasonSKULinkObj != null && !seasonSKULinkObj.isSeasonRemoved()){
                    JSONObject seasonSKUObject = skuSeasonLinkModel.getRecordByOid("Colorway Season Link", FormatHelper.getObjectId(seasonSKULinkObj));
                    seasonSKUArray.add(seasonSKUObject);
                }
            }
        } catch (Exception e) {
            seasonSKUArray.add(util.getExceptionJson(e.getMessage()));
        }
        return seasonSKUArray;
    }

     public LCSSKUClientModel imageAssignment(LCSSKUClientModel skuModel, JSONObject attrsJsonObject)throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Image assignment  initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
            skuModel.setPartPrimaryImageURL(util.setImage(fileName, thumbnail));
            } else {
            // if (imageKey.equals("imageAttr")) 
                    skuModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
        return skuModel;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex link info with product season ***** "));
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
                responseObject.put(objectType, findSKUProductSeasonLink(objectType, productOid,seasonOid));
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
    public JSONArray findSKUProductSeasonLink(String objectType,String productOid,String seasonOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find season product link ***** "+ productOid + "----seasonOid-----"+ seasonOid));
        JSONArray skuArray = new JSONArray();
        JSONObject responseObject = new JSONObject();
        try {
            LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
            //static java.util.Collection getSKUMastersForSeasonAndProduct(LCSSeason season, LCSProduct product, boolean includePlaceHolder, boolean includeSeasonRemoved) 
            Collection skuMasterObjects = LCSSeasonQuery.getSKUMastersForSeasonAndProduct(lcsSeason, lcsProduct, true, true);
            Iterator skuMasters = skuMasterObjects.iterator();
            LCSPartMaster skuMaster = null;
            while (skuMasters.hasNext())
            {
              skuMaster = (LCSPartMaster)skuMasters.next();
              LCSSKU newSku = (LCSSKU)VersionHelper.latestIterationOf(skuMaster);

              String skuOid = util.getVR(newSku);
              JSONObject responseSku =  getRecordByOid("Colorway",skuOid);
              skuArray.add(responseSku);
            }

            /*LCSSeasonProductLink lcsSeasonProductLink = LCSSeasonQuery.findSeasonProductLink(lcsProduct,lcsSeason);
            String seasionProductOid = FormatHelper.getNumericObjectIdFromObject(lcsSeasonProductLink);
            seasionProductOid = "OR:com.lcs.wc.season.LCSProductSeasonLink:"+seasionProductOid;
            responseObject =  getRecordByOid(objectType,seasionProductOid);*/
        } catch (Exception e) {
             skuArray.add(util.getExceptionJson(e.getMessage()));
            
        }
        return skuArray;
    }

    public JSONObject findThumbnailData(String skuOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findThumbnails ***** "+ skuOid));
        JSONObject jsonObj = new JSONObject();
        Collection attributes = null;
        FlexTypeAttribute att = null;
        String attKey = "";
        String imageThumbnail = "";
        String imageString = "";
        JSONArray thumbArray = new JSONArray();
        String value = FileLocation.imageLocation + FileLocation.fileSeperator;
        String imageType = "jpg";
       
        try {
            LCSSKU lcsSKU = (LCSSKU) LCSQuery.findObjectById(skuOid);
            String imageUrl = lcsSKU.getPartPrimaryImageURL();
            imageThumbnail = lcsSKU.getPartPrimaryImageURL();
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ imageThumbnail));
            if (FormatHelper.hasContent(imageThumbnail)) {
                imageType = imageThumbnail.substring(imageThumbnail.lastIndexOf("/") + 1, imageThumbnail.length());
                imageThumbnail = imageThumbnail.trim();
                String inputImage = lcsSKU.getPartPrimaryImageURL();
                String stImage = "/images/";
                int indx = inputImage.lastIndexOf(stImage);
                if (indx > -1) {
                inputImage = inputImage.substring(indx + stImage.length());
                }
                inputImage = com.lcs.wc.util.FileLocation.imageLocation.concat(File.separator).concat(inputImage);
                //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* inputImage findThumbnails ***** "+ inputImage));
                //imageThumbnail = FileLocation.imageLocation.trim() + FileLocation.fileSeperator.trim() + imageThumbnail;
                File f = new File(inputImage);
                FileInputStream fis = new FileInputStream(f);
                byte byteArray[] = new byte[(int) f.length()];
                fis.read(byteArray);
                imageString = Base64.getEncoder().encodeToString(byteArray);
                jsonObj.put("imageEncoded", imageString);
                jsonObj.put("imageFileName", imageType);
               
                //thumbArray.add(jsonObj);
               
            }

        }

        catch(Exception ex) {
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* Exception  .." + ex));
        }
        
        return jsonObj;
       
    }


}