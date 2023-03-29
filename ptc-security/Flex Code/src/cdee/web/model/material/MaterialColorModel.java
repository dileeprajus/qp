/*
 * Created on 06/09/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.material;

import cdee.web.model.sample.SampleModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.material.LCSMaterialColor;
import com.lcs.wc.material.LCSMaterialMaster;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.supplier.LCSSupplierMaster;
import com.lcs.wc.material.LCSMaterialColorClientModel;
import com.lcs.wc.material.LCSMaterialColorLogic;
import com.lcs.wc.material.LCSMaterialColorQuery;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.material.LCSMaterialSupplierMaster;
import com.lcs.wc.material.MaterialPricingEntry;
import com.lcs.wc.material.MaterialPricingEntryQuery;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.material.LCSMaterial;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import com.lcs.wc.util.VersionHelper;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.*;
import com.lcs.wc.util.VersionHelper;
import cdee.web.model.color.ColorModel;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class MaterialColorModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(MaterialColorModel.class.getName());
    //private static final String CLASSNAME = MaterialColorModel.class.getName();
    AppUtil util = new AppUtil();

    /**
     * This method is used to insert the individual Material Color flex object that are  passed by using type as reference,
     * @param type String 
     * @param jsonMaterialColObject JSONObject
     * @exception Exception
     * @return JSONObject  It returns material color JSONObject object
     */
    public JSONObject insertMaterialColor(String type, JSONObject jsonMaterialColObject) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create initialized ***** " + type));
        JSONObject responseObject = new JSONObject();
        String materialoid = (String) jsonMaterialColObject.get("materialOid");
        String materialsupplieroid = (String) jsonMaterialColObject.get("materialSupplierOid");
        String colorOid = (String) jsonMaterialColObject.get("colorOid");
        try {
            String materialColorTypeId = (String) jsonMaterialColObject.get("typeId");
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialsupplieroid);
            FlexType materialcolorType = FlexTypeCache.getFlexType(materialColorTypeId);
            LCSMaterialColorClientModel materialColorModel = new LCSMaterialColorClientModel();
            String materialMasterId = FormatHelper.getObjectId(materialSupplier.getMaterialMaster());
            String supMasterId = FormatHelper.getObjectId(materialSupplier.getSupplierMaster());
            materialColorModel.setMaterialMasterId(materialMasterId);
            materialColorModel.setSupplierMasterId(supMasterId);
            materialColorModel.setTypeId(materialColorTypeId);
            materialColorModel.setColorId(colorOid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(jsonMaterialColObject,type,(String)jsonMaterialColObject.get("typeId"));
            AttributeValueSetter.setAllAttributes(materialColorModel, convertedAttrs);
            //Added for image insertion
            if(jsonMaterialColObject.containsKey("base64File") && jsonMaterialColObject.containsKey("base64FileName") && jsonMaterialColObject.containsKey("imageKey") )
            materialColorModel = imageAssignment (materialColorModel,jsonMaterialColObject);
            //End
            materialColorModel.save();
            String materialColorOid = FormatHelper.getObjectId(materialColorModel.getBusinessObject());
            responseObject = util.getInsertResponse(materialColorOid, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the individual Material Color flex object that are  passed by using type as reference,
     * @param materialColorOid String 
     * @param type String 
     * @param jsonMaterialColObject JSONObject
     * @exception Exception
     * @return JSONObject  It returns material color JSONObject object
     */
    public JSONObject updateMaterialColor(String materialColorOid, String type, JSONObject jsonMaterialColObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update initialized with oid ***** "+ materialColorOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMaterialColorClientModel materialColorModel = new LCSMaterialColorClientModel();
            materialColorModel.load(materialColorOid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(jsonMaterialColObject,type,FormatHelper.getObjectId(materialColorModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(materialColorModel, convertedAttrs);
            if(jsonMaterialColObject.containsKey("base64File") && jsonMaterialColObject.containsKey("base64FileName") && jsonMaterialColObject.containsKey("imageKey") )
            materialColorModel = imageAssignment (materialColorModel,jsonMaterialColObject);
            materialColorModel.save();
            materialColorOid = FormatHelper.getObjectId(materialColorModel.getBusinessObject());
            responseObject = util.getUpdateResponse(materialColorOid, type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete material color of given oid,
     * @param matColOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String matColOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+matColOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMaterialColor lcsMaterialColor = (LCSMaterialColor) LCSQuery.findObjectById(matColOid);
            try {
                MaterialPricingEntryQuery materialPricingEntryQuery = new MaterialPricingEntryQuery();
                LCSMaterialSupplierMaster materialSupplierMaster = lcsMaterialColor.getMaterialSupplierMaster();
                MaterialPricingModel materialPricingModel = new MaterialPricingModel();
                Collection results = materialPricingEntryQuery.findByReferences(materialSupplierMaster, lcsMaterialColor);
                Iterator itr = results.iterator();
                while (itr.hasNext()) {
                    FlexObject materialPricingData = (FlexObject) itr.next();
                    String materialPrcingOid = materialPricingModel.getOid(materialPricingData);
                    materialPricingModel.delete(materialPrcingOid);
                }
            } catch (Exception e) {

            }
            try {
                Collection results = new LCSMaterialColorQuery().findSamples(lcsMaterialColor).getResults();
                SampleModel sampleModel = new SampleModel();
                Iterator itr = results.iterator();
                while (itr.hasNext()) {
                    FlexObject sampleData = (FlexObject) itr.next();
                    String sampleOid = "OR:com.lcs.wc.sample.LCSSample:" + sampleData.getString("LCSSAMPLE.IDA2A2");
                    sampleModel.delete(sampleOid);
                }
            } catch (Exception e) {}
            LCSMaterialColorLogic lcsMaterialColorLogic = new LCSMaterialColorLogic();
            lcsMaterialColorLogic.deleteMaterialColor(lcsMaterialColor);
            responseObject = util.getDeleteResponseObject("Material Color", matColOid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Material Color flex object that are  passed by using type as reference,
     * @param type String 
     * @param oid String
     * @param materialJsonData JSONObject  Contains object of material color data
     * @exception Exception
     * @return JSONObject  It returns material color JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject materialJsonData,JSONObject payloadJson) throws Exception {
        JSONObject responseObject = new JSONObject();
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"------oid------"+ oid)); 
        try {
            
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, materialJsonData,payloadJson);
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling insertMaterialColor ***** "));
                responseObject = insertMaterialColor(type, payloadJson);
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMaterialColor with creteria ***** "));
                responseObject = updateMaterialColor(oid, type, payloadJson);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.material.LCSMaterialColor");
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
           //LOGGER.debug((Object) (CLASSNAME + "*****  initialized with get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSMaterialColorQuery().findMaterialColorsByCriteria(criteriaMap, flexType, null, null);
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
        return "";
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.material.LCSMaterialColor:" + (String) flexObject.getString("LCSMATERIALCOLOR.IDA2A2");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return JSONObject  it return the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSMaterialColor lcsMaterialColorInput = (LCSMaterialColor) LCSQuery.findObjectById(oid);
        LCSMaterialColor lcsMaterialColor = lcsMaterialColorInput;
        try{
            lcsMaterialColor = (LCSMaterialColor) VersionHelper.latestIterationOf (lcsMaterialColorInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsMaterialColor.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsMaterialColor.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", oid);
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsMaterialColor.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsMaterialColor));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsMaterialColor.getFlexType()));
        jSONObject.put("ORid", FormatHelper.getObjectId(lcsMaterialColor).toString());
        jSONObject.put("colorOid", FormatHelper.getObjectId(lcsMaterialColor.getColor()));
        Collection attributes = lcsMaterialColor.getFlexType().getAllAttributes();
        String msId = FormatHelper.getVersionId((LCSMaterialSupplier) VersionHelper.latestIterationOf(((LCSMaterialColor) lcsMaterialColor).getMaterialSupplierMaster()));
        jSONObject.put("materialSupplierOid", msId);
        LCSMaterialSupplier lcsMaterialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(msId);
        LCSSupplierMaster supplierMaster = lcsMaterialSupplier.getSupplierMaster();
        LCSSupplier supplier = (LCSSupplier) VersionHelper.latestIterationOf(supplierMaster);
        jSONObject.put("supplierOid", FormatHelper.getVersionId(supplier));
        LCSMaterialMaster materialMaster = lcsMaterialSupplier.getMaterialMaster();
        LCSMaterial material = (LCSMaterial) VersionHelper.latestIterationOf(materialMaster);
        jSONObject.put("materialOid", FormatHelper.getVersionId(material));
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsMaterialColor.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsMaterialColor.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMaterialColor.getFlexType()));    }


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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Sample")) {
            jSONObject.put("Sample", findSamples(oid));
        } else if (association.equalsIgnoreCase("Material Pricing")) {
            jSONObject.put("Material Pricing", findMaterialPricingEntrys(oid));
        } else if (association.equalsIgnoreCase("Material")) {
            jSONObject.put("Material", findMaterial(oid));
        } else if (association.equalsIgnoreCase("Material Supplier")) {
            jSONObject.put("Material Supplier", findMaterialSupplier(oid));
        } else if (association.equalsIgnoreCase("Color")) {
            jSONObject.put("Color", findColor(oid));
        }
        return jSONObject;
    }

     /**
     * This method is used to get the Sample records of given mayerialColorOid .
     * @param String materialColorOid
     * @return JSONArray  it returns the material Color associated Sample records in the form of array
     */
    public JSONArray findSamples(String materialColorOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find sample associated with  id  ***** "+materialColorOid));
        Collection response = null;
        JSONArray sampleArray = new JSONArray();
        try {
            SampleModel sampleModel = new SampleModel();
            LCSMaterialColor materialColor = (LCSMaterialColor) LCSQuery.findObjectById(materialColorOid);
            SearchResults searchResults = new LCSMaterialColorQuery().findSamples(materialColor);
            response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String sampleOid = sampleModel.getOid(flexObject);
                JSONObject sampleObject = sampleModel.getRecordByOid("Sample", sampleOid);
                sampleArray.add(sampleObject);
            }
        } catch (Exception e) {
            sampleArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sampleArray;
    }


   /**
     * This method is used to get the Material Pricing records of given mayerialColorOid .
     * @param String materialColorOid
     * @return JSONArray  it returns the material Color associated Material Pricing records in the form of array
     */
    public JSONArray findMaterialPricingEntrys(String materialColorOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material pricing associated with  materialColorOid  ***** "+materialColorOid));
        MaterialPricingEntryQuery materialPricingEntryQuery = new MaterialPricingEntryQuery();
        MaterialPricingModel materialPricingModel = new MaterialPricingModel();
        Collection response = null;
        JSONArray materialPrcingArray = new JSONArray();
        try {
            LCSMaterialColor materialColor = (LCSMaterialColor) LCSQuery.findObjectById(materialColorOid);
            LCSMaterialSupplierMaster materialSupplierMaster = materialColor.getMaterialSupplierMaster();
            response = materialPricingEntryQuery.findByReferences(materialSupplierMaster, materialColor);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                MaterialPricingEntry materialPricingEntry = (MaterialPricingEntry) itr.next();
                String materialPricingOid = FormatHelper.getObjectId(materialPricingEntry);
                JSONObject materialPricingObject = materialPricingModel.getRecordByOid("Material Pricing", materialPricingOid);
                materialPrcingArray.add(materialPricingObject);
            }
        } catch (Exception e) {
            materialPrcingArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialPrcingArray;
    }
    
    /**
     * This method is used to get the Material  records of given mayerialColorOid .
     * @param String materialColorOid
     * @return JSONArray  it returns the material  associated Material Pricing records in the form of array
     */
    public JSONArray findMaterial(String materialColorOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material associated with  materialColorOid  ***** "+materialColorOid));
            JSONObject mObject = new JSONObject();
            JSONArray mArray = new JSONArray();
            try {
                MaterialModel materialModel =new MaterialModel();
                LCSMaterialColor materialColor = (LCSMaterialColor) LCSQuery.findObjectById(materialColorOid);
                String materialOid = FormatHelper.getVersionId((LCSMaterial) VersionHelper.latestIterationOf(((LCSMaterialColor) materialColor).getMaterialMaster()));
                mObject = materialModel.getRecordByOid("Material", materialOid);
                mArray.add(mObject);
               
            } catch (Exception e) {
                mArray.add(util.getExceptionJson(e.getMessage()));
            }
            return mArray;
            } 
    
    /**
     * This method is used to get the MaterialSupplier  records of given mayerialColorOid .
     * @param String materialColorOid
     * @return JSONArray  it returns the MaterialSupplier  associated with mayerialColorOid records in the form of array
     */
    public JSONArray findMaterialSupplier(String materialColorOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material supplier associated with  materialColorOid  ***** "+materialColorOid));
        JSONObject msObject = new JSONObject();
        JSONArray msArray = new JSONArray();
        try {
            MaterialSupplierModel supplierModel =new MaterialSupplierModel();
            LCSMaterialColor materialColor = (LCSMaterialColor) LCSQuery.findObjectById(materialColorOid);
            String materialSupplierOid = FormatHelper.getVersionId((LCSMaterialSupplier) VersionHelper.latestIterationOf(((LCSMaterialColor) materialColor).getMaterialSupplierMaster()));
            msObject = supplierModel.getRecordByOid("Material Supplier", materialSupplierOid);
            msArray.add(msObject);
           
        } catch (Exception e) {
            msArray.add(util.getExceptionJson(e.getMessage()));
        }
        return msArray;
        } 

    /**
     * This method is used to get the Color  records of given mayerialColorOid .
     * @param String materialColorOid
     * @return JSONArray  it returns the Color  associated with mayerialColorOid records in the form of array
     */
    public JSONArray findColor(String materialColorOid) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find color with associated materialColorOid***** "+materialColorOid));
        JSONObject cObject = new JSONObject();
        JSONArray cArray = new JSONArray();
        try {
            ColorModel colorModel =new ColorModel();
            LCSMaterialColor materialColor = (LCSMaterialColor) LCSQuery.findObjectById(materialColorOid);
            String colorOid = FormatHelper.getObjectId(materialColor.getColor());
            cObject = colorModel.getRecordByOid("Color", colorOid);
            cArray.add(cObject);
           
        } catch (Exception e) {
            cArray.add(util.getExceptionJson(e.getMessage()));
        }
        return cArray;
        } 
    
    /**
     * This method is used to get schema of this flex object
     * @param String  typeId
     * @param JSONObject jsonAsscos
     * @param String type
     * @Exception exception
     * @return return flex schema for the given type.
     */

    public JSONObject getFlexSchema(String type, String typeId) throws NumberFormatException,TypeIdNotFoundException,Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Initialized with Flex Schema ***** "));
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

    public LCSMaterialColorClientModel imageAssignment(LCSMaterialColorClientModel materialColorModel, JSONObject attrsJsonObject)throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** image assignment initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        materialColorModel.setValue(imageKey, util.setImage(fileName, thumbnail));          //   }
        return materialColorModel;
    }
}