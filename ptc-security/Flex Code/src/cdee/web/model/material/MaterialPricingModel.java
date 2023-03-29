/*
 * Created on 06/08/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.material;

import cdee.web.model.effectivityContext.EffectivityContextModel;
import cdee.web.services.GenericObjectService;
import cdee.web.services.schema.CreateFlexSchemaService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.MaterialPricingEntry;
import com.lcs.wc.material.MaterialPricingEntryClientModel;
import com.lcs.wc.material.MaterialPricingEntryLogic;
import com.lcs.wc.material.MaterialPricingEntryQuery;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class MaterialPricingModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(MaterialPricingModel.class.getName());
    //private static final String CLASSNAME = MaterialPricingModel.class.getName();
    AppUtil util = new AppUtil();


    /**
     * This method is used to insert the Material Pricing flex object that are  passed by using type as reference,
     * @param materialPricingAttrs JSONObject 
     * @param type String
     * @exception Exception
     * @return JSONObject  It returns material pricing JSONObject object
     */
    public JSONObject createMaterialPricing(String type, JSONObject materialPricingAttrs) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create material Pricing initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        try {
            String materialoid = (String) materialPricingAttrs.get("materialOid");
            String materialSupplierOid = (String) materialPricingAttrs.get("materialSupplierOid");
            String materialColorOid = (String) materialPricingAttrs.get("materialColorOid");
            String effectivityContextLinkId = (String) materialPricingAttrs.get("effectivityContextOid");
            MaterialPricingEntryClientModel materialPriceModel = new MaterialPricingEntryClientModel();
            String typeId = (String) materialPricingAttrs.get("typeId");
            materialPriceModel.setFlexType(FlexTypeCache.getFlexType(typeId));
            Map priceMap = new HashMap();
            priceMap.put("typeId", typeId);
            priceMap.put("type", typeId);
            priceMap.put("inDateDateString", (String) materialPricingAttrs.get("inDateDateString"));
            priceMap.put("outDateDateString", (String) materialPricingAttrs.get("outDateDateString"));
            priceMap.put("price", (String) materialPricingAttrs.get("price"));
            priceMap.put("supplierLinkId", materialSupplierOid);
            priceMap.put("materialId", materialoid);

            if (effectivityContextLinkId != null) {
                priceMap.put("effectivityContextLinkId", effectivityContextLinkId);
            }
            if (materialColorOid != null) {
                priceMap.put("materialColorLinkId", materialColorOid);
            }
            LCSMaterial material = (LCSMaterial) LCSQuery.findObjectById(materialoid);
            priceMap.put("materialMasterId", material.getMaster().toString());
            AttributeValueSetter.setAllAttributes(materialPriceModel, priceMap);
            materialPriceModel.save();
            String pricingOid = FormatHelper.getObjectId(materialPriceModel.getBusinessObject());
            responseObject = util.getInsertResponse(pricingOid, type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the Material Pricing flex object that are  passed by using type as reference,
     * @param materialPricingAttrs JSONObject 
     * @param type String
     * @param materialPricingOid String
     * @exception Exception
     * @return JSONObject  It returns updated material pricing JSONObject object
     */
    public JSONObject updateMaterialPricing(String materialPricingOid, String type, JSONObject materialPricingAttrs) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update initialized with oid ***** "+ materialPricingOid));
        JSONObject responseObject = new JSONObject();
        try {
            MaterialPricingEntryClientModel materialPriceModel = new MaterialPricingEntryClientModel();
            materialPriceModel.load(materialPricingOid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(materialPricingAttrs,type,FormatHelper.getObjectId(materialPriceModel.getFlexType()));
            convertedAttrs.put("price", (String) materialPricingAttrs.get("price"));
            AttributeValueSetter.setAllAttributes(materialPriceModel, convertedAttrs);
            materialPriceModel.save();
            String pricingOid = FormatHelper.getObjectId(materialPriceModel.getBusinessObject());
            responseObject = util.getUpdateResponse(pricingOid, type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Material Color flex object that are  passed by using type as reference,
     * @param type String 
     * @param oid String
     * @param materialPricingObject JSONObject  Contains object of material color data
     * @exception Exception
     * @return JSONObject  It returns material color JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject materialPricingObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type + "-----oid------"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            
            if (oid == null) {
                ArrayList list = util.getOidFromName(type, materialPricingObject);
                responseObject = createMaterialPricing(type, materialPricingObject);
            } else {
                responseObject = updateMaterialPricing(oid, type, materialPricingObject);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Material Pricing of given oid,
     * @param marPriceOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String marPriceOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+marPriceOid));
        JSONObject responseObject = new JSONObject();
        try {
            MaterialPricingEntry materialPricingEntry = (MaterialPricingEntry) LCSQuery.findObjectById(marPriceOid);
            MaterialPricingEntryLogic materialPricingEntryLogic = new MaterialPricingEntryLogic();
            materialPricingEntryLogic.deleteMaterialPricingEntry(materialPricingEntry);
            responseObject = util.getDeleteResponseObject("Material Pricing", marPriceOid, responseObject);
        } catch (WTException wte) {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Exception in delte ***** "+ wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.material.MaterialPricingEntry");
    }

    /**
     * This method is used to get the schema for the given typeId of this flex object .
     * @param String  type
     * @param String typeId
     * @Exception exception
     * @return JSONObject  it returns the schema for the given typeId of this flex object .
     */

    public JSONObject getFlexSchema(String type, String typeId) throws NumberFormatException,TypeIdNotFoundException,Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex schema ***** "));
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
                        if (attribute.getAttScope().equals("MATERIAL-PRICING")) {
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
     * This method is used to get the oid by taking name of the record.
     * @param FlexType  flexType
     * @param Map criteria
     * @param String name
     * @Exception exception
     * @return return oid by taking name of the record of the flex object
     */
    public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
        //this method is not applicable for this object
        return "";
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.material.MaterialPricingEntry:" + (String) flexObject.getString("MATERIALPRICINGENTRY.IDA2A2");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return JSONObject  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        MaterialPricingEntry materialPricingEntryInput = (MaterialPricingEntry) LCSQuery.findObjectById(oid);
        MaterialPricingEntry materialPricingEntry = materialPricingEntryInput;
        try{
            materialPricingEntry = (MaterialPricingEntry) VersionHelper.latestIterationOf (materialPricingEntryInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(materialPricingEntry.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(materialPricingEntry.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("typeId", FormatHelper.getObjectId(materialPricingEntry.getFlexType()));
        jSONObject.put("ORid", FormatHelper.getObjectId(materialPricingEntry).toString());
        jSONObject.put("oid", oid);
        jSONObject.put("image",null);
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", materialPricingEntry.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(materialPricingEntry));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = materialPricingEntry.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (materialPricingEntry.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, materialPricingEntry.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(materialPricingEntry.getFlexType()));    
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid + "----association-----" + association));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Effectivity Context")) {
            jSONObject.put("Effectivity Context", findEffectivityContexts(oid));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the Effectivity Context records of given materialPricingOid .
     * @param String materialOid
     * @return JSONArray  it returns the  associated Effectivity Context records in the form of array
     */
    public JSONArray findEffectivityContexts(String materialPricingOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find effectivityContext with  id  ***** "+materialPricingOid));
        MaterialPricingEntryQuery materialPricingEntryQuery = new MaterialPricingEntryQuery();
        CreateFlexSchemaService createFlexSchemaService = new CreateFlexSchemaService();
        EffectivityContextModel effectivityContextModel = new EffectivityContextModel();
        JSONArray effectivityContextArray = new JSONArray();
        try {
            MaterialPricingEntry materialPricingEntry = (MaterialPricingEntry) LCSQuery.findObjectById(materialPricingOid);
            SearchResults results = materialPricingEntryQuery.findDuplicatePricingEntriesForEffectivityContext(materialPricingEntry);
            Collection response = results.getResults();
            Iterator itrs = response.iterator();
            while (itrs.hasNext()) {
                FlexObject flexObject = (FlexObject) itrs.next();
                String name = (String) flexObject.getString("EFFECTIVITYCONTEXT.PTC_STR_1TYPEINFOEFFECTIVITY");
                String effectivityContextOid = createFlexSchemaService.searchByName("Effectivity Context", name);
                JSONObject effectivityContextObject = effectivityContextModel.getRecordByOid("Effectivity Context", effectivityContextOid);
                effectivityContextArray.add(effectivityContextObject);
            }
        } catch (Exception e) {
            effectivityContextArray.add(util.getExceptionJson(e.getMessage()));
        }
        return effectivityContextArray;
    }

}