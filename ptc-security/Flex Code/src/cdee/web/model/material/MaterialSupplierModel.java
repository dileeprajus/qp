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

import cdee.web.model.sample.SampleModel;
import com.lcs.wc.material.LCSMaterialSupplier;
import cdee.web.model.document.DocumentModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.document.LCSDocumentQuery;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.LCSMaterialColor;
import com.lcs.wc.material.LCSMaterialColorQuery;
import com.lcs.wc.material.LCSMaterialSupplierClientModel;
import com.lcs.wc.material.LCSMaterialSupplierLogic;
import com.lcs.wc.material.LCSMaterialSupplierMaster;
import com.lcs.wc.material.LCSMaterialSupplierQuery;
import com.lcs.wc.material.MaterialPricingEntryQuery;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.supplier.LCSSupplierMaster;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.util.VersionHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import cdee.web.model.bom.BOMLinkModel;
import com.lcs.wc.material.LCSMaterialMaster;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.material.LCSMaterialMaster;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import java.util.Set;
import com.lcs.wc.util.VersionHelper;
import cdee.web.model.bom.BOMModel;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.flexbom.BOMOwner;
import com.lcs.wc.db.PreparedQueryStatement;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class MaterialSupplierModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(MaterialSupplierModel.class.getName());
    //private static final String CLASSNAME = MaterialSupplierModel.class.getName();
    AppUtil util = new AppUtil();

    /**
     * This method is called to create MaterialSupplier.
     * @param type String 
     * @param materialSupplierJsonObject JSONObject  Contains  material supplier data
     * @exception Exception
     * @return JSONObject  It returns material supplier JSON Object 
     */
    public JSONObject createMaterialSupplier(String type, JSONObject materialSupplierJsonObject) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Material Supplier initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSMaterialSupplierQuery lcsMaterialSupplierQuery = new LCSMaterialSupplierQuery();
        try {
            String supplierOid = (String) materialSupplierJsonObject.get("supplierOid");
            String materialoid = (String) materialSupplierJsonObject.get("materialOid");
            LCSMaterial material = (LCSMaterial) LCSQuery.findObjectById(materialoid);
            LCSMaterialSupplierClientModel materialSupplierModel = new LCSMaterialSupplierClientModel();
            Collection supplierids = MOAHelper.getMOACollection(supplierOid);
            materialSupplierModel.addMaterialSuppliers(material, supplierids);
            LCSSupplier lcsSupplier = (LCSSupplier) LCSQuery.findObjectById(supplierOid);
            LCSMaterialSupplier lcsMaterialSupplier = LCSMaterialSupplierQuery.findMaterialSupplier(material.getMaster(), (LCSSupplierMaster) lcsSupplier.getMaster());
            String materialSupOid = FormatHelper.getVersionId(lcsMaterialSupplier);
            String materialSuplierOid = updateMaterialSupplier(util.getAttributesFromScope("MATERIAL-SUPPLIER", materialSupplierJsonObject), materialSupOid);
            responseObject = util.getInsertResponse(materialSuplierOid, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Material Supplier flex object that are  passed by using type as reference,
     * oid and array of different Materials data 
     * Using this method we can insert/update several records of a material supplier flextype at a time.
     * @param type String 
     * @param oid String
     * @param materialJsonData JSONObject  Contains object of material supplier data
     * @exception Exception
     * @return JSONObject  It returns material supplier JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject materialJsonData,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type + "----oid-----"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, materialJsonData,payloadJson);
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createMaterialSupplier ***** "));
                responseObject = createMaterialSupplier(type, payloadJson);
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMaterialSupplier with oid***** "));
                String matSupOid = updateMaterialSupplier(util.getAttributesFromScope("MATERIAL-SUPPLIER", payloadJson), oid);
                responseObject = util.getUpdateResponse(matSupOid, type, responseObject);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    

    /**
     * This method is used to update the Material flex object that are  passed by using OID as reference.
     * @param matSupplierScopeAttrs Map   oid of an item(type) to update
     * @param msupplieroid  String Contains Material data
     * @exception Exception
     * @return String  It returns Material JSONObject object
     */
    public String updateMaterialSupplier(Map matSupplierScopeAttrs, String msupplieroid) throws WTException {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update initialized with oid ***** "+ msupplieroid));
        String oid = "";
        LCSMaterialSupplierClientModel materialSupplierModel = new LCSMaterialSupplierClientModel();
        try {
            materialSupplierModel.load(msupplieroid);
            AttributeValueSetter.setAllAttributes(materialSupplierModel, matSupplierScopeAttrs);
            materialSupplierModel.save();
            oid = FormatHelper.getVersionId(materialSupplierModel.getBusinessObject());
        } catch (Exception ex) {
            //oid = "Exception:" + msupplieroid;
        }
        return oid;
    }

    /**
     * This method is used delete Material supplier of given oid,
     * @param matSuppOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String matSuppOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+matSuppOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(matSuppOid);
            MaterialColorModel materialColorModel = new MaterialColorModel();
            try {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized search for depency materialColor ***** "));
                Collection results = new LCSMaterialColorQuery().findMaterialColorData(materialSupplier).getResults();
                Iterator itr = results.iterator();
                while (itr.hasNext()) {
                    FlexObject materialColorData = (FlexObject) itr.next();
                    String materialColorOid = materialColorModel.getOid(materialColorData);
                    materialColorModel.delete(materialColorOid);
                }
            } catch (Exception e) {

            }
            try {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized search for depency MaterialPricing ***** "));
               /* MaterialPricingModel materialPricingModel = new MaterialPricingModel();
                LCSMaterialSupplierMaster materialSupplierMaster = (LCSMaterialSupplierMaster) materialSupplier.getMaster();
                Collection results = new MaterialPricingEntryQuery().findIndependentMaterialPricingEntryCollection(materialSupplierMaster).getResults();
                Iterator itr = results.iterator();
                while (itr.hasNext()) {
                    FlexObject materialPricingData = (FlexObject) itr.next();
                    String materialPrcingOid = materialPricingModel.getOid(materialPricingData);
                    materialPricingModel.delete(materialPrcingOid);
                }*/
            } catch (Exception e) {

            }
            try {
                 //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized search for depency MaterialSupplier ***** "));
                LCSMaterialSupplierQuery lcsMaterialSupplierQuery = new LCSMaterialSupplierQuery();
                LCSMaterialSupplierMaster materialSupplierMaster = (LCSMaterialSupplierMaster) materialSupplier.getMaster();
                Collection results = new LCSMaterialSupplierQuery().findSamples(materialSupplierMaster).getResults();
                SampleModel sampleModel = new SampleModel();
                Iterator itr = results.iterator();
                while (itr.hasNext()) {
                    FlexObject sampleData = (FlexObject) itr.next();
                    String sampleOid = sampleModel.getOid(sampleData);
                    sampleModel.delete(sampleOid);
                }
            } catch (Exception e) {}
            try {
                 //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized search for depency Document ***** "));
                Collection results = new LCSDocumentQuery().findPartDocReferences(materialSupplier);
                Iterator itr = results.iterator();
                DocumentModel documentModel = new DocumentModel();
                while (itr.hasNext()) {
                    FlexObject documnet = (FlexObject) itr.next();
                    String documentOid = documentModel.getOid(documnet);
                    documentModel.delete(documentOid);
                }
            } catch (Exception e) {

            }
            LCSMaterialSupplierLogic lcsMaterialSupplierLogic = new LCSMaterialSupplierLogic();
            lcsMaterialSupplierLogic.deleteMaterialSupplier(materialSupplier);
            responseObject = util.getDeleteResponseObject("Material Supplier", matSuppOid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.material.LCSMaterialSupplier");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get Flex Schema ***** "));
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
                        if (attribute.getAttScope().equals("MATERIAL-SUPPLIER")) {
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
           //LOGGER.debug((Object) (CLASSNAME + "*****get Records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot("Material");
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSMaterialSupplierQuery().findMaterialSuppliersByCriteria(criteriaMap, flexType, null, null);
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
        //this method is not applicable for this object
        return "";
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get oid ***** "));
        String branchId = (String) flexObject.getString("LCSMATERIALSUPPLIER.BRANCHIDITERATIONINFO");
        String oid = "";
        if (branchId != null) {
            oid = "VR:com.lcs.wc.material.LCSMaterialSupplier:" + (String) flexObject.getString("LCSMATERIALSUPPLIER.BRANCHIDITERATIONINFO");
        } else {
            oid = "OR:com.lcs.wc.material.LCSMaterialSupplier:" + (String) flexObject.getString("LCSMATERIALSUPPLIER.IDA2A2");
        }
        return oid;
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
        LCSMaterialSupplier lcsMaterialSupplierInput = (LCSMaterialSupplier) LCSQuery.findObjectById(oid);
        LCSMaterialSupplier lcsMaterialSupplier = lcsMaterialSupplierInput;
        try{
            lcsMaterialSupplier = (LCSMaterialSupplier) VersionHelper.latestIterationOf (lcsMaterialSupplierInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsMaterialSupplier.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsMaterialSupplier.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", util.getVR(lcsMaterialSupplier));
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsMaterialSupplier).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsMaterialSupplier).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsMaterialSupplier.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsMaterialSupplier.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsMaterialSupplier));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsMaterialSupplier));
        LCSSupplier supplier = (LCSSupplier) VersionHelper.latestIterationOf(lcsMaterialSupplier.getSupplierMaster());
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        String supplierOid = FormatHelper.getVersionId(supplier);
        jSONObject.put("supplierOid", supplierOid);
        LCSMaterialMaster materialMaster = lcsMaterialSupplier.getMaterialMaster();
        LCSMaterial material = (LCSMaterial) VersionHelper.latestIterationOf(materialMaster);
        jSONObject.put("materialOid", FormatHelper.getVersionId(material));
        Collection attributes = lcsMaterialSupplier.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsMaterialSupplier.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsMaterialSupplier.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMaterialSupplier.getFlexType()));   
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
           //LOGGER.debug((Object) (CLASSNAME + "*****Get records by oid ***** " + oid));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Material Color")) {
            jSONObject.put("Material Color", findMaterialColors(oid));
        } else if (association.equalsIgnoreCase("Material Pricing")) {
            jSONObject.put("Material Pricing", findMaterialPricings(oid));
        } else if (association.equalsIgnoreCase("Sample")) {
            jSONObject.put("Sample", findSamples(oid));
        } else if (association.equalsIgnoreCase("Reference Document")) {
            jSONObject.put("Reference Document", findReferenceDocs(oid));
        } else if (association.equalsIgnoreCase("BOM")) {
            jSONObject.put("BOM", findBOMs(oid));
        } else if (association.equalsIgnoreCase("Supplier")) {
            jSONObject.put("Supplier", findSupplier(oid));
        } else if (association.equalsIgnoreCase("Material")) {
            jSONObject.put("Material", findMaterial(oid)); 
        }
        
        return jSONObject;
    }

    /**
     * This method is used to get the MaterialColor records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the materialSupplier associated MaterialColor records in the form of array
     */
    public JSONArray findMaterialColors(String materialSupplierOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material color with  associated materialSupplierOid  ***** "+materialSupplierOid));
        JSONArray materialColorArray = new JSONArray();
        try {
            MaterialColorModel materialColorModel = new MaterialColorModel();
            LCSMaterialSupplier lcsMaterialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            SearchResults results = new LCSMaterialColorQuery().findMaterialColorData(lcsMaterialSupplier);
            Collection response = results.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialColorOid = materialColorModel.getOid(flexObject);
                JSONObject materialColorObject = materialColorModel.getRecordByOid("Material Color", materialColorOid);
                materialColorArray.add(materialColorObject);
            }
        } catch (Exception e) {
            materialColorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialColorArray;
    }

    /**
     * This method is used to get the MaterialPricing records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the materialSupplier associated MaterialPricing records in the form of array
     */
    public JSONArray findMaterialPricings(String materialSupplierOid) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find materials pricings with  associated materialSupplierOid ***** "+ materialSupplierOid));
        MaterialPricingModel materialPricingModel = new MaterialPricingModel();
        JSONArray materialPrcingArray = new JSONArray();
        try {
            LCSMaterialSupplier lcsMaterialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            LCSMaterialSupplierMaster materialSupplierMaster = (LCSMaterialSupplierMaster) lcsMaterialSupplier.getMaster();
            //archResults searchResults = new MaterialPricingEntryQuery().findIndependentMaterialPricingEntryCollection(materialSupplierMaster);
            //change for flexk2
            Collection<String> materialSupplierIds = new ArrayList<String>();
            materialSupplierIds.add(FormatHelper.getNumericFromOid(FormatHelper.getObjectId(materialSupplierMaster)));
            //archResults searchResults = new MaterialPricingEntryQuery().findIndependentMaterialPricingEntryCollection(materialSupplierIds, materialSupplierMaster);
			//SearchResults searchResults = new MaterialPricingEntryQuery().findIndependentMaterialPricingEntryCollection(materialSupplierIds, materialSupplierMaster);
            SearchResults searchResults = new MaterialPricingEntryQuery().findMaterialPricingEntryCollection(materialSupplierIds);
           

            //
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialPricingOid = materialPricingModel.getOid(flexObject);
                JSONObject materialPricingObject = materialPricingModel.getRecordByOid("Material Pricing", materialPricingOid);
                materialPrcingArray.add(materialPricingObject);
            }
            //SearchResults searchResultsEffec = new MaterialPricingEntryQuery().findMaterialPricingEntryCollection(materialSupplierIds, materialSupplierMaster);
            SearchResults searchResultsEffec = new MaterialPricingEntryQuery().findMaterialPricingEntryCollection(materialSupplierIds);

            Collection responseEff = searchResultsEffec.getResults();
            Iterator itrEffec = responseEff.iterator();
            while (itrEffec.hasNext()) {
                FlexObject flexObjectEff = (FlexObject) itrEffec.next();
                String materialPricingOidEff = materialPricingModel.getOid(flexObjectEff);
                JSONObject materialPricingObjectEff = materialPricingModel.getRecordByOid("Material Pricing", materialPricingOidEff);
                materialPrcingArray.add(materialPricingObjectEff);
            }
        } catch (Exception e) {
            materialPrcingArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialPrcingArray;
    }

    /**
     * This method is used to get the Sample records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the materialSupplier associated Sample records in the form of array
     */
    public JSONArray findSamples(String materialSupplierOid) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find samples with  associated materialSupplierOid***** "+ materialSupplierOid));
        SampleModel sampleModel = new SampleModel();
        JSONArray sampleArray = new JSONArray();
        LCSMaterialSupplierQuery lcsMaterialSupplierQuery = new LCSMaterialSupplierQuery();
        try {
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            LCSMaterialSupplierMaster materialSupplierMaster = (LCSMaterialSupplierMaster) materialSupplier.getMaster();
            SearchResults searchResults = new LCSMaterialSupplierQuery().findSamples(materialSupplierMaster);
            Collection response = searchResults.getResults();
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
     * This method is used to get the ReferenceDocs records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the materialSupplier associated Reference Documents records in the form of array
     */
    public JSONArray findReferenceDocs(String materialSupplierOid) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find reference docs with  associated materialSupplierOid***** "+ materialSupplierOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentArray = new JSONArray();
        try {
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            Collection response = new LCSDocumentQuery().findDocObjectReferences(materialSupplier);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String documentOid = documentModel.getOid(flexObject);
                JSONObject documentObject = documentModel.getRecordByOid("Document", documentOid);
                documentArray.add(documentObject);
            }
        } catch (Exception e) {
            documentArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentArray;
    }

    public JSONArray findBOMs(String materialSupplierOid){
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find boms with  associated materialSupplierOid ***** "+materialSupplierOid));
        BOMModel bomModel = new BOMModel();
        LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
        JSONArray flexBOMPartArray = new JSONArray();
        JSONObject flexBOMPartObject = new JSONObject();   
        FlexBOMPart bomPart = null;
        try{
            MaterialModel materialModel =new MaterialModel();
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            String materialOid = FormatHelper.getVersionId((LCSMaterial) VersionHelper.latestIterationOf(((LCSMaterialSupplier) materialSupplier).getMaterialMaster()));
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            PreparedQueryStatement filteredQueryStatement = LCSFlexBOMQuery.findBOMPartsForOwnerQuery((BOMOwner)lcsMaterial.getMaster(), "A", "MAIN", null, null, false, null);
            SearchResults accessOnlyResults = LCSQuery.runDirectQuery(filteredQueryStatement);
            int accessOnlyResultsCount = accessOnlyResults.getResultsFound();
            if (accessOnlyResultsCount>0) { 
                 Collection bomList = new ArrayList();
                 bomList = LCSQuery.getObjectsFromResults(accessOnlyResults, "VR:com.lcs.wc.flexbom.FlexBOMPart:", "FLEXBOMPART.BRANCHIDITERATIONINFO");
                 bomPart = (FlexBOMPart) bomList.iterator().next();
                 String flexBOMPartOid = FormatHelper.getObjectId(bomPart);
                 flexBOMPartObject = bomModel.getRecordByOid("BOM", flexBOMPartOid);
                 flexBOMPartArray.add(flexBOMPartObject);
            }
        }catch(Exception e){
            flexBOMPartArray.add(util.getExceptionJson(e.getMessage())); 
        }
        return flexBOMPartArray;
    }

    /**
     * This method is used to fetch the Linked record that matched with the given oids of this flex object.
     * @param String  objectType which contains flexObject name
     * @param String materialOid 
     * @param String supplierOid
     * @Exception exception
     * @return JSONObject  it returns the record that matched the given oids of this flex object.
     */

    public JSONObject getFlexLinkInfo(String objectType,JSONObject rootObject,JSONObject propertiesObject) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized get flex link info with supplier and material ***** "));
        JSONObject responseObject = new JSONObject();
        try{
        String firstKey ="";
        String secondKey ="";
        String firstKeyValue ="";
        String secondKeyValue ="";
        String materialOid = "";
        String supplierOid = "";
        Set keys = rootObject.keySet();
        Iterator itr = keys.iterator();
        while(itr.hasNext()) {
            firstKey = (String)itr.next();
            secondKey = (String)itr.next();
            if(propertiesObject.containsKey(firstKey) && propertiesObject.containsKey(secondKey)){
                if(firstKey.equalsIgnoreCase("materialOid") ){
                    materialOid = (String)rootObject.get(firstKey);
                    supplierOid = (String)rootObject.get(secondKey);
                }else{
                    supplierOid = (String)rootObject.get(firstKey);
                    materialOid = (String)rootObject.get(secondKey);
                }
            }
        }
        if ((materialOid != null) && !("".equalsIgnoreCase(materialOid)) && (supplierOid != null) && !("".equalsIgnoreCase(supplierOid))) {
            responseObject.put(objectType, findMaterialSupplierLink(objectType, materialOid,supplierOid));
        }
    }catch(Exception e){
        responseObject = util.getExceptionJson(e.getMessage());
    }

        return responseObject;
    }

      /**
    * This method is used to find the  MaterialSupplier records by passing materialOid,supplierOid.
    * @param String  objectType
    * @param String productOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the MaterialSupplier flex object
    */ 

    public JSONObject findMaterialSupplierLink(String objectType,String materialOid,String supplierOid) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find material supplier link materialOid***** " + materialOid +"-----supplierOid------"+ supplierOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            LCSMaterialMaster materialMaster = lcsMaterial.getMaster();
            LCSSupplier lcsSupplier = (LCSSupplier) LCSQuery.findObjectById(supplierOid);
            LCSSupplierMaster supplierMaster = (LCSSupplierMaster) lcsSupplier.getMaster();
            LCSMaterialSupplier lcsMaterialSupplier = LCSMaterialSupplierQuery.findMaterialSupplier(materialMaster,supplierMaster);
            String materialSupplierOid = FormatHelper.getVersionId(lcsMaterialSupplier);
            responseObject =  getRecordByOid(objectType,materialSupplierOid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

   /**
     * This method is used to get the Supplier records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the materialSupplier associated BOM records in the form of array
     */

    public JSONArray findSupplier(String materialSupplierOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find supplier ***** "+ materialSupplierOid));
        LCSSupplier supplier = new LCSSupplier();
        JSONObject supplierObject = new JSONObject();
        JSONArray supplierArray = new JSONArray();
        try {
            SupplierModel supplierModel =new SupplierModel();
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            supplier = (LCSSupplier) VersionHelper.latestIterationOf(materialSupplier.getSupplierMaster());
            String supplierOid = FormatHelper.getObjectId(supplier);
            supplierObject = supplierModel.getRecordByOid("Supplier", supplierOid);
             supplierArray.add(supplierObject);
           
        } catch (Exception e) {
            supplierArray.add(util.getExceptionJson(e.getMessage()));
        }
        return supplierArray;

           
        } 
    
     /**
     * This method is used to get the Material records of given materialSupplierOid .
     * @param String materialSupplierOid
     * @return JSONArray  it returns the Material associated BOM records in the form of array
     */
    public JSONArray findMaterial(String materialSupplierOid) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material ***** "+materialSupplierOid));
        JSONObject mObject = new JSONObject();
        JSONArray mArray = new JSONArray();
        try {
            MaterialModel materialModel =new MaterialModel();
            LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSupplierOid);
            String materialOid = FormatHelper.getVersionId((LCSMaterial) VersionHelper.latestIterationOf(((LCSMaterialSupplier) materialSupplier).getMaterialMaster()));
            mObject = materialModel.getRecordByOid("Material", materialOid);
            mArray.add(mObject);
           
        } catch (Exception e) {
            mArray.add(util.getExceptionJson(e.getMessage()));
        }
        return mArray;
        } 

}