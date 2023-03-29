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
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.sample.LCSSampleQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import java.util.HashMap;

import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sample.LCSSampleRequest;
import wt.util.WTException;

import com.lcs.wc.sample.LCSSample;
import com.lcs.wc.sample.LCSSampleLogic;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import com.lcs.wc.sample.LCSSampleLogic;
import com.lcs.wc.sample.LCSSampleRequestClientModel;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.specification.FlexSpecMaster;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
import cdee.web.model.product.ProductModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.specification.SpecificationModel;
import wt.fc.WTObject;

public class SampleRequestModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(SampleRequestModel.class.getName());
 //private static final String CLASSNAME = SampleRequestModel.class.getName();

    LCSSampleQuery lcsSampleQuery = new LCSSampleQuery();
    AppUtil util = new AppUtil();

    /**
     * This method is used either insert or update the SampleRequest flex object that are  passed by using type as reference,
     * oid and array of different SampleRequest data 
     * Using this method we can insert/update several records of a SampleRequest flextype at a time.
     * @param type String 
     * @param oid String
     * @param SampleRequestJSONArray  Contains array of SampleRequest data
     * @exception Exception
     * @return JSONArray  It returns SampleRequest JSONArray object
     */
    public JSONArray saveOrUpdate(String type, String oid, JSONArray jsonArray) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"----oid-------"+oid)); 
        JSONArray responseArray = new JSONArray();
        return responseArray;
    }

    /**
     * This method is used to insert the SampleRequest flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a SampleRequest flextype at a time.
     * @param type is a string 
     * @param sampleRequestDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns SampleRequest JSONArray object
     */

    public JSONObject createSampleRequest(String type, ArrayList sampleRequestDataList) {

        return null;
    }

    /**
     * This method is used to update the SampleRequest flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a SampleRequest flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param sampleRequestJsonObject  Contains SampleRequest data
     * @exception Exception
     * @return String  It returns OID of SampleRequest object
     */

    public JSONObject updateSampleRequest(String oid, String type, JSONObject sampleRequestJsonObject) throws Exception {

        return null;
    }

    /**
     * This method is used delete Sample Request of given oid,
     * @param sampleRequestOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String sampleRequestOid) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using sample request oid ***** "+ sampleRequestOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSSampleRequest lcsSampleRequest = (LCSSampleRequest) LCSQuery.findObjectById(sampleRequestOid);
            LCSSampleLogic sampleLogic = new LCSSampleLogic();
            sampleLogic.deleteSampleRequest(lcsSampleRequest);
            responseObject = util.getDeleteResponseObject("Sample Request", sampleRequestOid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sample.LCSSampleRequest");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema wih type and typeId***** "));
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
                        if (attribute.getAttScope().equals("SAMPLE-REQUEST")) {
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "*****get Records ***** "));
       
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot("Sample");
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSSampleQuery().findSampleRequestsByCriteria(criteriaMap, flexType, null, null, null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** search by name ***** "+ name));
        Collection < FlexObject > response = lcsSampleQuery.findSamplesByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSSAMPLEREQUEST.IDA2A2");
        oid = "OR:com.lcs.wc.sample.LCSSampleRequest:" + oid;
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
        return "OR:com.lcs.wc.sample.LCSSampleRequest:" + (String) flexObject.getString("LCSSAMPLEREQUEST.IDA2A2");
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
        LCSSampleRequest lcsSampleRequestInput = (LCSSampleRequest) LCSQuery.findObjectById(oid);
        LCSSampleRequest lcsSampleRequest = lcsSampleRequestInput;
        try{
            lcsSampleRequest = (LCSSampleRequest) VersionHelper.latestIterationOf(lcsSampleRequestInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsSampleRequest.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsSampleRequest.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", oid);
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsSampleRequest.getFlexType()));
        jSONObject.put("ORid", FormatHelper.getObjectId(lcsSampleRequest).toString());
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsSampleRequest.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSampleRequest));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsSampleRequest.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsSampleRequest.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsSampleRequest.getValue(attKey).toString());
                }
            } catch (Exception e) {

            }
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSampleRequest.getFlexType()));    
    }
    
    public JSONObject getRecordByOid(String objectType, String oid, String association) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
         JSONObject jSONObject = new JSONObject();
         LCSSampleRequest lcsSampleRequest = (LCSSampleRequest) LCSQuery.findObjectById(oid);
         if (association.equalsIgnoreCase("Sample")) {
           jSONObject.put("Sample", findSample(lcsSampleRequest, false));
         }else if (association.equalsIgnoreCase("Fit Sample")) {
             jSONObject.put("Fit Sample", findSample(lcsSampleRequest, true));
         }else if(association.equalsIgnoreCase("Product")){
          jSONObject.put("Product",findproducts(lcsSampleRequest));
        }else if(association.equalsIgnoreCase("Sourcing Configuration")){
          jSONObject.put("Sourcing Configuration",findSourcingConfigurations(lcsSampleRequest));
        }else if(association.equalsIgnoreCase("Specification")){
          jSONObject.put("Specification",findSpecifications(lcsSampleRequest));
        }
         return jSONObject;
    }
    
    public JSONArray findSample(LCSSampleRequest requestObject, boolean fitSample) {
        //if (LOGGER.isDebugEnabled()) 
              //LOGGER.debug((Object) (CLASSNAME + "***** find sample requests with Request Object & FitSample Flag***** "+ requestObject + fitSample));
           SampleModel sampleModel = new SampleModel();
           JSONArray sampleArray = new JSONArray();
           try {
        	   Collection response= lcsSampleQuery.findSamplesIdForSampleRequest(requestObject,fitSample);
               Iterator itr = response.iterator();
               while (itr.hasNext()) {
                   FlexObject sampleObjectInfo = (FlexObject) itr.next();
                   String sampleOid = sampleModel.getOid(sampleObjectInfo);
                   JSONObject sampleObject = sampleModel.getRecordByOid("Sample", sampleOid);
                   sampleArray.add(sampleObject);
               }
           } catch (Exception e) {
        	   sampleArray.add(util.getExceptionJson(e.getMessage()));
           }
           return sampleArray;
       }    

       /**
     * This method is used to get the Product records of given sampleOid .
     * @param String sampleOid
     * @return JSONArray  it returns the Sample associated Product records in the form of array
     */
    public JSONArray findproducts(LCSSampleRequest sampleObject) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find products with LCSSampleRequest***** "+ sampleObject));
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
    public JSONArray findSourcingConfigurations(LCSSampleRequest sampleObject) {
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
    public JSONArray findSpecifications(LCSSampleRequest sampleObject) {
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
}