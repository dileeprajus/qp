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
package cdee.web.model.sample;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.HashMap;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.sample.LCSSampleQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sample.LCSSample;
import wt.fc.WTObject;
import com.lcs.wc.material.LCSMaterialSupplier;
import cdee.web.model.testSpecification.TestSpecificationModel;
import com.lcs.wc.testing.TestSpecificationQuery;
import com.lcs.wc.sample.LCSSampleLogic;
import com.lcs.wc.sample.LCSSampleRequestClientModel;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.specification.FlexSpecMaster;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.sample.LCSSampleRequest;
import com.lcs.wc.sample.LCSSampleClientModel;
import com.lcs.wc.testing.TestingHelper;
import com.lcs.wc.testing.TestSpecification;
import wt.util.WTException;
import com.lcs.wc.util.LCSProperties;
import cdee.web.model.product.ProductModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.specification.SpecificationModel;
import cdee.web.model.sample.SampleRequestModel;
import cdee.web.model.material.MaterialModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.model.material.MaterialSupplierModel;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.measurements.LCSFitTestQuery;
import cdee.web.model.color.ColorModel;
import cdee.web.model.document.DocumentModel;
import cdee.web.model.material.MaterialColorModel;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SampleModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(SampleModel.class.getName());
//private static final String CLASSNAME = SampleModel.class.getName();

    LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
    AppUtil util = new AppUtil();

    /**
     * This method is used either insert or update the Sample flex object that are  passed by using type as reference,
     * oid and array of different Sample data 
     * Using this method we can insert/update record of a Sample flextype at a time.
     * @param type String 
     * @param oid String
     * @param sampleJsonObject  Contains Sample data
     * @exception Exception
     * @return JSONObject  It returns Sample JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject sampleJsonObject,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"----oid------"+oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                    ArrayList list = util.getOidFromSeachCriteria(type, sampleJsonObject,payloadJson);

                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                     //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSample with criteria ***** "));
                    responseObject = updateSample(list.get(2).toString(), type, payloadJson);
                } else {
                     //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSample ***** "));
                    responseObject = createSample(type, payloadJson);
                }
            } else {
                 //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSample with oid ***** "));
                responseObject = updateSample(oid, type, payloadJson);
                    }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Sample flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Sample flextype at a time.
     * @param type is a string 
     * @param sampleDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Sample JSONArray object
     */

    public JSONObject createSample(String type, JSONObject sampleJsonObject) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Sample  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        try {
            if (sampleJsonObject.containsKey("testSpecificationOid") && sampleJsonObject.containsKey("materialSupplierOid")) {
                return (new TestSpecificationModel().createTestingRequest(sampleJsonObject));
            }
            LCSSampleClientModel sampleModel = new LCSSampleClientModel();
            LCSSampleRequestClientModel sampleRequestModel = new LCSSampleRequestClientModel();
            Map attrs = new HashMap();
            String sampleTypeId = (String) sampleJsonObject.get("typeId");
            FlexType sampleType = FlexTypeCache.getFlexType(sampleTypeId);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(sampleJsonObject,type,(String)sampleJsonObject.get("typeId"));
            convertedAttrs.put("rootTypeId", sampleTypeId);
            convertedAttrs.put("type", sampleTypeId);
            convertedAttrs.put("typeId", sampleTypeId);
            AttributeValueSetter.setAllAttributes(sampleModel, convertedAttrs);
            AttributeValueSetter.setAllAttributes(sampleRequestModel, convertedAttrs);
            if (sampleJsonObject.containsKey("contextSpecId")) {
                //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** Create Sample  with contextSpecId ***** "));
                sampleModel.setSpecificationMasterId((String) sampleJsonObject.get("contextSpecId"));
                sampleRequestModel.setSpecificationMasterId((String) sampleJsonObject.get("contextSpecId"));
            } else {
                sampleModel.setSpecificationMasterId((String) sampleJsonObject.get("ownerId"));
                sampleRequestModel.setSpecificationMasterId((String) sampleJsonObject.get("ownerId"));
            }
            sampleModel.setTypeId(sampleTypeId);
            sampleRequestModel.setTypeId(sampleTypeId);
            Map sampleScopeAttrs = (Map) util.getScopeAttributes(sampleType, "SAMPLE");
            sampleScopeAttrs = (Map) util.setJsonAttributes(sampleScopeAttrs, sampleJsonObject);

            Map sampleRequestScopeAttrs = (Map) util.getScopeAttributes(sampleType, "SAMPLE-REQUEST");
            sampleRequestScopeAttrs = (Map) util.setJsonAttributes(sampleRequestScopeAttrs, sampleJsonObject);

            //sampleModel.setSpecificationMasterId((String) sampleJsonObject.get("specMasterId"));
            sampleModel.setSourcingConfigId((String) sampleJsonObject.get("sourcingConfigId"));
            //sampleModel.setOwnerMasterId((String) sampleJsonObject.get("ownerMasterId"));
            //sampleRequestModel.setSpecificationMasterId((String) sampleJsonObject.get("specMasterId"));
            sampleRequestModel.setSourcingConfigId((String) sampleJsonObject.get("sourcingConfigId"));
            //sampleRequestModel.setOwnerMasterId((String) sampleJsonObject.get("ownerMasterId"));


            for (Object str: sampleScopeAttrs.keySet()) {
                attrs.put("LCSSAMPLE_" + str.toString(), (String) sampleScopeAttrs.get(str.toString()));
            }
            for (Object str: sampleRequestScopeAttrs.keySet()) {
                attrs.put("LCSSAMPLEREQUEST_" + str.toString(), (String) sampleRequestScopeAttrs.get(str.toString()));
            }
            AttributeValueSetter.setAllAttributes(sampleModel, attrs, "LCSSAMPLE");
            AttributeValueSetter.setAllAttributes(sampleRequestModel, attrs, "LCSSAMPLEREQUEST");

            if (sampleJsonObject.containsKey("measurementsId")) {
                String size = (String) sampleJsonObject.get("sampleSize");
                sampleModel.createFitSample((String) sampleJsonObject.get("measurementsId"), size);
            } else {
                sampleModel.save(sampleRequestModel);
            }
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(sampleModel.getBusinessObject()), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** Exception ***** "+e.getMessage()));
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used to update the Sample flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Sample flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param sampleJsonObject  Contains Sample data
     * @exception Exception
     * @return String  It returns OID of Sample object
     */

    public JSONObject updateSample(String oid, String type, JSONObject sampleJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Sample  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSSampleClientModel sampleModel = new LCSSampleClientModel();
        try {
            Map attrs = new HashMap();
            sampleModel.load(oid);
           
            DataConversionUtil datConUtil=new DataConversionUtil();
            
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(sampleJsonObject,type,FormatHelper.getObjectId(sampleModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(sampleModel, convertedAttrs);
            sampleModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(sampleModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete sample of given oid,
     * @param bomlinkOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String sampleOid) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using sample oid***** "+ sampleOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
            LCSSampleLogic sampleLogic = new LCSSampleLogic();
            sampleLogic.deleteSample(lcsSample);
            responseObject = util.getDeleteResponseObject("Sample", sampleOid, responseObject);
        } catch (WTException wte) {
            //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Exception in delete **** "+ wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sample.LCSSample");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with sample scope***** "));
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
                    if(attribute.getAttScope().equals("SAMPLE")){
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
        SearchResults results = new LCSSampleQuery().findSamplesByCriteria(criteriaMap, flexType, null, null, null);
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
        Collection < FlexObject > response = lcsSampleQuery.findSamplesByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSSAMPLE.IDA2A2");
        oid = "OR:com.lcs.wc.sample.LCSSample:" + oid;
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
        return "OR:com.lcs.wc.sample.LCSSample:" + (String) flexObject.getString("LCSSAMPLE.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** " + oid));
        JSONObject jSONObject = new JSONObject();
        LCSSample lcsSampleInput = (LCSSample) LCSQuery.findObjectById(oid);
        LCSSample lcsSample = lcsSampleInput;
        try{
            lcsSample = (LCSSample) VersionHelper.latestIterationOf(lcsSampleInput);
        }catch(Exception e){

        }
        /*...........................................*/
        JSONArray materilArray = findMaterials(oid);
        Iterator materialItr = materilArray.iterator();
        String materialOid = "";
        while(materialItr.hasNext()){
            JSONObject jsonObect = (JSONObject)materialItr.next();
            materialOid = (String)jsonObect.get("oid");
        }
        if(materialOid!=null && !("".equalsIgnoreCase(materialOid))){
            jSONObject.put("materialOid", materialOid);
        }
        /*..................Supplier.........................*/
        JSONArray supplierArray = findSuppliers(oid);
        Iterator supplierItr = supplierArray.iterator();
        String supplierOid = "";
        while(supplierItr.hasNext()){
            JSONObject jsonObect = (JSONObject)supplierItr.next();
            supplierOid = (String)jsonObect.get("oid");
        }
        if(supplierOid!=null && !("".equalsIgnoreCase(supplierOid))){
            jSONObject.put("supplierOid", supplierOid);
        }
        /*..................MaterialSupplier.........................*/
        JSONArray MaterialSupplierArray = findMaterialSuppliers(oid);
        Iterator materialSupplierItr = MaterialSupplierArray.iterator();
        String materialSupplierOid = "";
        while(materialSupplierItr.hasNext()){
            JSONObject jsonObect = (JSONObject)materialSupplierItr.next();
            materialSupplierOid = (String)jsonObect.get("oid");
        }
        if(materialSupplierOid!=null && !("".equalsIgnoreCase(materialSupplierOid))){
            jSONObject.put("materialSupplierOid", materialSupplierOid);
        }
        /*..................Sample-Request.........................*/
        JSONArray sampleRequestArray = findSampleRequests(lcsSample);
        Iterator sampleRequestItr = sampleRequestArray.iterator();
        String sampleRequestOid = "";
        while(sampleRequestItr.hasNext()){
            JSONObject jsonObect = (JSONObject)sampleRequestItr.next();
            sampleRequestOid = (String)jsonObect.get("oid");
        }
        if(sampleRequestOid!=null && !("".equalsIgnoreCase(sampleRequestOid))){
            jSONObject.put("sampleRequestOid", sampleRequestOid);
        }
        /*..................SourcingConfiguration.........................*/
        JSONArray sourcingArray = findSourcingConfigurations(lcsSample);
        Iterator sourcingItr = sourcingArray.iterator();
        String sourcingOid = "";
        while(sourcingItr.hasNext()){
            JSONObject jsonObect = (JSONObject)sourcingItr.next();
            sourcingOid = (String)jsonObect.get("oid");
        }
        if(sourcingOid!=null && !("".equalsIgnoreCase(sourcingOid))){
            jSONObject.put("sourcingConfigurationOid", sourcingOid);
        }
        /*..................Specification.........................*/
        JSONArray specArray = findSpecifications(lcsSample);
        Iterator specItr = specArray.iterator();
        String specOid = "";
        while(specItr.hasNext()){ 
            JSONObject jsonObect = (JSONObject)specItr.next();
            specOid = (String)jsonObect.get("oid");
        }
        if(specOid!=null && !("".equalsIgnoreCase(specOid))){
            jSONObject.put("specificationOid", specOid);
        }
        /*..................Test-Specification.........................*/
        JSONArray testSpecificationArray = findTestSpecifications(oid);
        Iterator testSpecItr = testSpecificationArray.iterator();
        String testSpecificationOid = "";
        while(testSpecItr.hasNext()){
            JSONObject jsonObect = (JSONObject)testSpecItr.next();
            testSpecificationOid = (String)jsonObect.get("oid");
        }
        if(testSpecificationOid!=null && !("".equalsIgnoreCase(testSpecificationOid))){
            jSONObject.put("testSpecificationOid", testSpecificationOid);
        }
        /*.................product..........................*/
        JSONArray productArray = findproducts(lcsSample);
        Iterator productItr = productArray.iterator();
        String productOid = "";
        while(productItr.hasNext()){
            JSONObject jsonObect = (JSONObject)productItr.next();
            productOid = (String)jsonObect.get("oid");
        }
        if(productOid!=null && !("".equalsIgnoreCase(productOid))){
            jSONObject.put("productOid", productOid);
        }
        /*..................Material Color.........................*/
        JSONArray materialColorArray = findMaterialColors(oid);
        Iterator materialColorItr = materialColorArray.iterator();
        String materialColorOid = "";
        while(materialColorItr.hasNext()){
            JSONObject jsonObect = (JSONObject)materialColorItr.next();
            materialColorOid = (String)jsonObect.get("oid");
        }
        if(materialColorOid!=null && !("".equalsIgnoreCase(materialColorOid))){
            jSONObject.put("materialColorOid", materialColorOid);
        }
        /*..................color.........................*/
        JSONArray colorArray = findColors(oid);
        Iterator colorItr = colorArray.iterator();
        String colorOid = "";
        while(colorItr.hasNext()){
            JSONObject jsonObect = (JSONObject)colorItr.next();
            colorOid = (String)jsonObect.get("oid");
        }
        if(colorOid!=null && !("".equalsIgnoreCase(colorOid))){
            jSONObject.put("colorOid", colorOid);
        }
        /*...........................................*/
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsSample.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsSample.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", oid);
        //jSONObject.put("oid", oid);
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsSample).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSample).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsSample.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsSample.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSample));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsSample.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsSample.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsSample.getValue(attKey));
                }
            } catch (Exception e) {}
        }

        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSample.getFlexType()));    }

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
        LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(oid);
        if (association.equalsIgnoreCase("Test Specification")) {
          jSONObject.put("Test Specification", findTestSpecifications(oid));
        }else if(association.equalsIgnoreCase("Product")){
          jSONObject.put("Product",findproducts(lcsSample));
        }else if(association.equalsIgnoreCase("Sourcing Configuration")){
          jSONObject.put("Sourcing Configuration",findSourcingConfigurations(lcsSample));
        }else if(association.equalsIgnoreCase("Specification")){
          jSONObject.put("Specification",findSpecifications(lcsSample));
        }else if(association.equalsIgnoreCase("Sample Request")){
          jSONObject.put("Sample Request",findSampleRequests(lcsSample));
        }else if(association.equalsIgnoreCase("Material")){
          jSONObject.put("Material",findMaterials(oid));
        }else if(association.equalsIgnoreCase("Supplier")){
          jSONObject.put("Supplier",findSuppliers(oid));
        }else if(association.equalsIgnoreCase("Material Supplier")){
          jSONObject.put("Material Supplier",findMaterialSuppliers(oid));
        }else if(association.equalsIgnoreCase("Image Page")){
          jSONObject.put("Image Page",findImagePages(oid));
        }else if(association.equalsIgnoreCase("Color")){
          jSONObject.put("Color",findColors(oid));
        }else if(association.equalsIgnoreCase("Material Color")){
          jSONObject.put("Material Color",findMaterialColors(oid));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the TestSpecification records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the sample associated TestSpecification records in the form of array
     */
    public JSONArray findTestSpecifications(String sampleOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find test findSpecifications with sampleOid***** "+ sampleOid));
        TestSpecificationModel testSpecificationModel = new TestSpecificationModel();
        JSONArray testSpecificationArray = new JSONArray();
        try {
            LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
            Collection response = new TestSpecificationQuery().getTestSpecsForSample(lcsSample);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                TestSpecification testSpecification = (TestSpecification) itr.next();
                String testSpecificationOid = FormatHelper.getObjectId(testSpecification);
                JSONObject testSpecificationObject = testSpecificationModel.getRecordByOid("Test Specification", testSpecificationOid);
                testSpecificationArray.add(testSpecificationObject);
            }
        } catch (Exception e) {
            testSpecificationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return testSpecificationArray;
    } 

    /**
     * This method is used to get the Product records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Product records in the form of array
     */
    public JSONArray findproducts(LCSSample sampleObject) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find products with sampleOid***** "+ sampleObject));
        JSONArray productArray = new JSONArray();
        ProductModel productModel = new ProductModel();
        try {
        	LCSPartMaster productMaster = (LCSPartMaster)sampleObject.getOwnerMaster();
        	LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion((WTObject) productMaster , "A");
        	lcsProduct=(LCSProduct)VersionHelper.latestIterationOf(lcsProduct);
        	String productOid = FormatHelper.getVersionId(lcsProduct);
            JSONObject productObject = productModel.getRecordByOid("Product", productOid);
            productArray.add(productObject);
        } catch (Exception e) {
            productArray.add(util.getExceptionJson(e.getMessage()));
        }
        return productArray;
    }

    /**
     * This method is used to get the SourcingConfiguration records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated SourcingConfiguration records in the form of array
     */
    public JSONArray findSourcingConfigurations(LCSSample sampleObject) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find sourcing Configuration with sampleOid***** "+ sampleObject));
        SourcingConfigurationModel sourcingConfigurationModel = new SourcingConfigurationModel();
        JSONArray sourcingConfigurationArray = new JSONArray();
        try {
        	LCSSourcingConfigMaster souringMaster = (LCSSourcingConfigMaster)sampleObject.getSourcingMaster();
        	LCSSourcingConfig lcsSourcing = (LCSSourcingConfig)VersionHelper.getVersion((WTObject) souringMaster , "A");
        	lcsSourcing=(LCSSourcingConfig)VersionHelper.latestIterationOf(lcsSourcing);
        	String sourcingOid = FormatHelper.getVersionId(lcsSourcing);
            JSONObject sourcingObject = sourcingConfigurationModel.getRecordByOid("Sourcing Config", sourcingOid);
            sourcingConfigurationArray.add(sourcingObject);

        } catch (Exception e) {
            sourcingConfigurationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sourcingConfigurationArray;
    }

    /**
     * This method is used to get the Specification records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Specification records in the form of array
     */
    public JSONArray findSpecifications(LCSSample sampleObject) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find specifications with sampleOid***** "+ sampleObject));
        SpecificationModel specificationModel = new SpecificationModel();
        JSONArray specificationArray = new JSONArray();
        try {
        	FlexSpecMaster specMaster = (FlexSpecMaster)sampleObject.getSpecMaster();
            FlexSpecification lcsSpec = (FlexSpecification) VersionHelper.latestIterationOf(specMaster);
        	//FlexSpecification lcsSpec = (FlexSpecification)VersionHelper.getVersion((WTObject) specMaster , "A");
        	lcsSpec=(FlexSpecification)VersionHelper.latestIterationOf(lcsSpec);
         
        	String specOid = FormatHelper.getVersionId(lcsSpec);
            JSONObject specObject = specificationModel.getRecordByOid("Specification", specOid);
            specificationArray.add(specObject);

        } catch (Exception e) {
            specificationArray.add(util.getExceptionJson(e.getMessage()));
        }
        return specificationArray;
    }

    /**
     * This method is used to get the SampleRequest records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated SampleRequest records in the form of array
     */
    public JSONArray findSampleRequests(LCSSample sampleObject) {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find sample requests with sampleOid***** "+ sampleObject));
        SampleRequestModel sampleRequestModel = new SampleRequestModel();
        JSONArray sampleRequestArray = new JSONArray();
        try {
        	LCSSampleRequest requestObject = (LCSSampleRequest)sampleObject.getSampleRequest();
        	String sampleRequestOid = FormatHelper.getObjectId(requestObject);
            JSONObject request = sampleRequestModel.getRecordByOid("Sample Request", sampleRequestOid);
            sampleRequestArray.add(request);
        } catch (Exception e) {
            sampleRequestArray.add(util.getExceptionJson(e.getMessage()));
        }
        return sampleRequestArray;
    }

    /**
     * This method is used to get the Material records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Material records in the form of array
     */
    public JSONArray findMaterials(String sampleOid)throws Exception{
//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find matreials  with sampleOid***** "+ sampleOid));
        MaterialModel materialModel = new MaterialModel();
        JSONArray materialArray = new JSONArray();
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        try{
            LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
            FlexType flexType  = lcsSample.getFlexType();
            SearchResults searchResults = lcsSampleQuery.findSamplesByCriteria(new HashMap(), flexType, null, null, sampleOid);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while(itr.hasNext()) {
              FlexObject flexObject = (FlexObject)itr.next();
              String materialOid = materialModel.getOid(flexObject);
              JSONObject materialObject = materialModel.getRecordByOid("Material",materialOid);
              materialArray.add(materialObject);
            }
        }catch(Exception e){
            materialArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialArray;
    }

    /**
     * This method is used to get the Supplier records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Supplier records in the form of array
     */
    public JSONArray findSuppliers(String sampleOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findSuppliers with  sampleOid***** "+ sampleOid));
      SupplierModel supplierModel = new SupplierModel();
      JSONArray supplierArray = new JSONArray();
      try{
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
        FlexType flexType  = lcsSample.getFlexType();
        SearchResults searchResults = lcsSampleQuery.findSamplesByCriteria(new HashMap(), flexType, null, null, sampleOid);
        Collection response = searchResults.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
          FlexObject flexObject = (FlexObject)itr.next();
          String supplieroid = supplierModel.getOid(flexObject);
          JSONObject supplierobject = supplierModel.getRecordByOid("Supplier",supplieroid);
          supplierArray.add(supplierobject);
        }
      }catch(Exception e){
            supplierArray.add(util.getExceptionJson(e.getMessage()));
      }
        return supplierArray;
    }


    /**
     * This method is used to get the MaterialSupplier records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated MaterialSupplier records in the form of array
     */
    public JSONArray findMaterialSuppliers(String sampleOid){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find material suppiers with sampleOid ***** "+ sampleOid));
      MaterialSupplierModel materialSupplierModel = new MaterialSupplierModel();
      JSONArray materialSupplierArray = new JSONArray();
      try{
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
        FlexType flexType  = lcsSample.getFlexType();
        SearchResults searchResults = lcsSampleQuery.findSamplesByCriteria(new HashMap(), flexType, null, null, sampleOid);
        Collection response = searchResults.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
          FlexObject flexObject = (FlexObject)itr.next();
          String materialSupplieroid = materialSupplierModel.getOid(flexObject);
          JSONObject materialSupplierobject = materialSupplierModel.getRecordByOid("Material Supplier",materialSupplieroid);
          materialSupplierArray.add(materialSupplierobject);
        }
      }catch(Exception e){
        materialSupplierArray.add(util.getExceptionJson(e.getMessage()));
      }
        return materialSupplierArray;
    }

   /**
     * This method is used to get the ImagePage records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated ImagePage records in the form of array
     */
    public JSONArray findImagePages(String sampleOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find image pages with sampleOid ***** "+ sampleOid));
      DocumentModel documentModel = new DocumentModel();
      JSONArray documentArray = new JSONArray();
      try{
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        Collection response = lcsSampleQuery.findImagePages(sampleOid);
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
          FlexObject flexObject = (FlexObject)itr.next();
          String documentOid = documentModel.getOid(flexObject);
          JSONObject documentObject = documentModel.getRecordByOid("Document",documentOid);
          documentArray.add(documentObject);
        }
      }catch(Exception e){
        documentArray.add(util.getExceptionJson(e.getMessage()));
      }
        return documentArray;
    }

    /**
     * This method is used to get the Material records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Material records in the form of array
     */
    public JSONArray findColors(String sampleOid)throws Exception{
//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find colors with sampleOid ***** " + sampleOid));
        ColorModel colorModel = new ColorModel();
        JSONArray colorArray = new JSONArray();
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        try{
            LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
            FlexType flexType  = lcsSample.getFlexType();
            SearchResults searchResults = lcsSampleQuery.findSamplesByCriteria(new HashMap(), flexType, null, null, sampleOid);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while(itr.hasNext()) {
              FlexObject flexObject = (FlexObject)itr.next();
              String colorOid = colorModel.getOid(flexObject);
              JSONObject colorObject = colorModel.getRecordByOid("Color",colorOid);
              colorArray.add(colorObject);
            }
        }catch(Exception e){
            colorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return colorArray;
    }


     /**
     * This method is used to get the Material records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Material records in the form of array
     */
    public JSONArray findMaterialColors(String sampleOid)throws Exception{
//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find material colors ***** "+ sampleOid));
        MaterialColorModel materialColorModel = new MaterialColorModel();
        JSONArray materialColorArray = new JSONArray();
        LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
        try{
            LCSSample lcsSample = (LCSSample) LCSQuery.findObjectById(sampleOid);
            FlexType flexType  = lcsSample.getFlexType();
            SearchResults searchResults = lcsSampleQuery.findSamplesByCriteria(new HashMap(), flexType, null, null, sampleOid);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while(itr.hasNext()) {
              FlexObject flexObject = (FlexObject)itr.next();
              String materialColorOid = materialColorModel.getOid(flexObject);
              JSONObject materialColorObject = materialColorModel.getRecordByOid("Material Color",materialColorOid);
              materialColorArray.add(materialColorObject);
            }
        }catch(Exception e){
            materialColorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialColorArray;
    }
}