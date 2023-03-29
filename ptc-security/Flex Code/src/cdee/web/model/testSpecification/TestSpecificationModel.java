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
package cdee.web.model.testSpecification;

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
import com.lcs.wc.testing.TestSpecificationQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.testing.TestSpecification;
import com.lcs.wc.testing.TestSpecificationClientModel;
import wt.util.WTException;
import com.lcs.wc.testing.TestSpecificationLogic;
import wt.fc.WTObject;
import com.lcs.wc.sample.*;
import com.lcs.wc.testing.*;
import com.lcs.wc.material.LCSMaterialSupplier;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class TestSpecificationModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(TestSpecificationModel.class.getName());
//private static final String CLASSNAME = TestSpecificationModel.class.getName();

	AppUtil util = new AppUtil();
   	Gson gson = new Gson();

	/**
      * This method is used either insert or update the TestSpecification flex object that are  passed by using type as reference,
      * oid and array of different TestSpecification data 
      * Using this method we can insert/update several records of a TestSpecification flextype at a time.
      * @param type String 
      * @param oid String
      * @param TestSpecificationJSONArray  Contains array of TestSpecification data
      * @exception Exception
      * @return JSONArray  It returns TestSpecification JSONArray object
      */

  public JSONObject saveOrUpdate(String type,String oid, JSONObject tsJsonData,JSONObject payloadJson) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
      JSONObject responseObject = new JSONObject();
      try{
        
        if(oid == null){
          ArrayList list = util.getOidFromSeachCriteria(type,tsJsonData,payloadJson);
          if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestSpecification with criteria ***** "));
            responseObject=updateTestSpecification(list.get(2).toString(),type,payloadJson);
          } else {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createTestSpecification ***** "));
            responseObject=createTestSpecification(type,payloadJson);
          }
        } else {
          //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestSpecification with oid ***** "));
          responseObject=updateTestSpecification(oid,type,payloadJson);
        }
      }catch(Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
      }
    return responseObject;
  }

    /**
    * This method is used to insert the TestSpecification flex object that are  passed by using type as reference.
    * Using this method we can insert several records of a TestSpecification flextype at a time.
    * @param type is a string 
    * @param TestSpecificationDataList  Contains attributes, typeId, oid(if existing)
    * @exception Exception
    * @return JSONArray  It returns TestSpecification JSONArray object
    */   
  public JSONObject createTestSpecification(String type, JSONObject testSpecJsonData){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Test specification ***** "));
      JSONObject responseObject = new JSONObject();
      TestSpecificationClientModel testSpecificationClientModel=new TestSpecificationClientModel();
      try{
          DataConversionUtil datConUtil=new DataConversionUtil();
          Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(testSpecJsonData,type,(String)testSpecJsonData.get("typeId"));
          AttributeValueSetter.setAllAttributes(testSpecificationClientModel,convertedAttrs);
          testSpecificationClientModel.save();
          responseObject=util.getInsertResponse(FormatHelper.getObjectId(testSpecificationClientModel.getBusinessObject()).toString(),type,responseObject);
      } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
      }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
  }


    /**
      * This method is used to update the TestSpecification flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a TestSpecification flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param TestSpecificationJsonObject  Contains TestSpecification data
      * @exception Exception
      * @return String  It returns OID of TestSpecification object
      */

    public JSONObject updateTestSpecification(String oid,String type,JSONObject testSpecJsonData) throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update test specification with oid ***** "+ oid));
      JSONObject responseObject = new JSONObject();
      TestSpecificationClientModel testSpecificationClientModel=new TestSpecificationClientModel();
      try{
          testSpecificationClientModel.load(oid);
          DataConversionUtil datConUtil=new DataConversionUtil();
          Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(testSpecJsonData,type,FormatHelper.getObjectId(testSpecificationClientModel.getFlexType()));
          //Map attrs=util.getObjectAttributes(type ,testSpecJsonData);
          convertedAttrs.put("specTypeString","TEMPLATE");
          AttributeValueSetter.setAllAttributes(testSpecificationClientModel,convertedAttrs);
          testSpecificationClientModel.save();
          responseObject=util.getUpdateResponse(FormatHelper.getObjectId(testSpecificationClientModel.getBusinessObject()).toString(),type,responseObject);
      }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
    }

     /**
    * This method is used delete Test Specification of given oid,
    * @param testSpecificationOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String testSpecificationOid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete with testSpecificationOid ***** "+ testSpecificationOid));
      JSONObject responseObject=new JSONObject();
      try{
        TestSpecification testSpecification= (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationLogic testSpecificationLogic = new TestSpecificationLogic();
        testSpecificationLogic.deleteTestSpecification(testSpecification);
        responseObject=util.getDeleteResponseObject("Test Specification",testSpecificationOid,responseObject);
      }catch(WTException wte){
         //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception in Delete  ***** "+wte.getMessage()));
        responseObject=util.getExceptionJson(wte.getMessage());
      }
      return responseObject;
    }

      /**
    * This method is used to create testing request.
    * @param type is a string 
    * @param sampleDataList  Contains attributes, typeId, oid(if existing)
    * @exception Exception
    * @return JSONObject  It returns Sample JSONObject object
    */  
    public JSONObject createTestingRequest(JSONObject sampleObject) throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Testing Request ***** "));
      JSONObject colorSampleResObject=new JSONObject();
      try {
          String testSpecificationId = (String) sampleObject.get("testSpecificationOid");
          String materialSuplierOid=(String)sampleObject.get("materialSupplierOid");
          String materialColorOid=(String)sampleObject.get("materialColorOid");
          LCSSampleClientModel sampleModel = new LCSSampleClientModel();
          LCSSampleRequestClientModel sampleRequestModel = new LCSSampleRequestClientModel();
          LCSMaterialSupplier materialSupplier = (LCSMaterialSupplier) LCSQuery.findObjectById(materialSuplierOid);
          String ownerId = materialSupplier.getMaster().toString();
          Map attrs = new HashMap();
          String sampleTypeId=(String)sampleObject.get("typeId");
          FlexType sampleType = FlexTypeCache.getFlexType(sampleTypeId);
          attrs.put("rootTypeId",sampleTypeId);
          attrs.put("type",sampleTypeId);
          attrs.put("typeId", sampleTypeId);
          attrs.put("ownerId", ownerId);
          attrs.put("returnOid", materialSuplierOid);
          attrs.put("oid", materialSuplierOid);
          AttributeValueSetter.setAllAttributes(sampleModel, attrs);
          AttributeValueSetter.setAllAttributes(sampleRequestModel, attrs);
          sampleModel.setSourcingConfigId(ownerId);
          sampleRequestModel.setSourcingConfigId(ownerId);

          Map sampleScopeAttrs = (Map) util.getScopeAttributes(sampleType, "SAMPLE");
          sampleScopeAttrs = (Map) util.setJsonAttributes(sampleScopeAttrs, sampleObject);

          Map sampleRequestScopeAttrs = (Map) util.getScopeAttributes(sampleType, "SAMPLE-REQUEST");
          sampleRequestScopeAttrs = (Map) util.setJsonAttributes(sampleRequestScopeAttrs, sampleObject);

         for(Object str:sampleScopeAttrs.keySet()){
              attrs.put("LCSSAMPLE_"+str.toString(),(String) sampleScopeAttrs.get(str.toString()));
          }
          for(Object str:sampleRequestScopeAttrs.keySet()){
              attrs.put("LCSSAMPLEREQUEST_"+str.toString(),(String) sampleRequestScopeAttrs.get(str.toString()));
          }
          attrs.put("testSpecificationId",testSpecificationId);
          attrs.put("testSpecificationType", "INSTANCE");
          if(sampleObject.containsKey("materialColorOid")){
              attrs.put("colorId",(String)sampleObject.get("materialColorOid"));
          }
          sampleModel.setTypeId(sampleTypeId);
          AttributeValueSetter.setAllAttributes(sampleModel, attrs, "LCSSAMPLE");
          sampleRequestModel.setTypeId(sampleTypeId);
          AttributeValueSetter.setAllAttributes(sampleRequestModel, attrs, "LCSSAMPLEREQUEST");
          LCSSample sample = LCSSample.newLCSSample();
          sample = (LCSSample) sampleModel.copyState(sample);
          LCSSampleRequest sampleRequest = LCSSampleRequest.newLCSSampleRequest();
          sampleRequest = (LCSSampleRequest) sampleRequestModel.copyState(sampleRequest);
          WTObject owner = (WTObject) LCSQuery.findObjectById(ownerId);
          TestSpecification newSpec = null;
          if(materialColorOid!=null){
              sample.setColor((WTObject)LCSQuery.findObjectById(materialColorOid));
          }
          newSpec = TestingHelper.service.initTestingSpecification(owner, sampleRequest, sample, testSpecificationId);
          String testSpecOid = FormatHelper.getVersionId(newSpec);
          colorSampleResObject=util.getResponse(testSpecOid,"Test Specification",colorSampleResObject);
      } catch (Exception e) {
        colorSampleResObject=util.getExceptionJson(e.getMessage());
      }
      return colorSampleResObject;
    }

    


    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
	public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.testing.TestSpecification"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with type and typeId ***** "));
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
                    if(attribute.getAttScope().equals("SPECIFICATION")){
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
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
  public JSONObject getRecords(String typeId,String objectType, Map criteriaMap) throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
    SearchResults results = new SearchResults();
        FlexType flexType = null;
        //Map criteria = util.convertJsonToMap(jsonObject,criteriaMap); 
        if(typeId == null){
          flexType = FlexTypeCache.getFlexTypeRoot(objectType);
    }else{
          flexType = FlexTypeCache.getFlexType(typeId);
    }
        results = new TestSpecificationQuery().findTestSpecificationsByCriteria(criteriaMap,flexType,null,null);
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
    public String searchByName(Map criteria,FlexType type,String name) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** search by name ***** "+ name));
        FlexType flexType = com.lcs.wc.flextype.FlexTypeCache.getFlexTypeFromPath("Test Specification");
        //Map criteria = new HashMap();
        //criteria.put(flexType.getAttribute("specificationName").getSearchCriteriaIndex(),name);
        Collection<FlexObject> response = new TestSpecificationQuery().findTestSpecificationsByCriteria(criteria,flexType,null,null).getResults();
        String oid = (String) response.iterator().next().get("TESTSPECIFICATION.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.testing.TestSpecification:"+oid;
        if(response.size() == 0){
            return "no record";
        } else {
            return oid;
        }
    }

    /**
    * This method is used to search schema object .
    * @param jsonObject is a JSONObject 
    * @param objectType  String
    * @param flexType  FlexType
    * @param criteriaMap  Map
    * @exception Exception
    * @return String  it returns schema object
    */  
  public JSONObject searchSchemaObject(String objectType, FlexType flexType, Map criteriaMap ) throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** search schema object ***** "));
      SearchResults results = new SearchResults();
      results = new TestSpecificationQuery().findTestSpecificationsByCriteria(criteriaMap,flexType,null,null);
      return util.getResponseFromResults(results,objectType);
  } 

  /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
  public String getRecordsData(FlexType flexType)throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records data ***** "));
     JSONObject object = new JSONObject();
    Map criteria = new HashMap();
    TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
    object.put("Test Specification",testSpecificationQuery.findTestSpecificationsByCriteria(criteria,flexType,null,null).getResults());
    object.put("Test Method",testSpecificationQuery.findTestMethods(flexType,criteria).getResults());
    object.put("Test Property",testSpecificationQuery.findTestProperties(flexType,criteria).getResults());
    object.put("Test Details",testSpecificationQuery.findLibraryTestDetails(flexType,criteria).getResults());
    object.put("Test Standards",testSpecificationQuery.findTestStandards(flexType,criteria).getResults());
    object.put("Test Conditions",testSpecificationQuery.findTestConditions(flexType,criteria).getResults());
    return gson.toJson(object);

  }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "VR:com.lcs.wc.testing.TestSpecification:"+(String)flexObject.getString("TESTSPECIFICATION.BRANCHIDITERATIONINFO");
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
        TestSpecification testSpecificationInput = (TestSpecification) LCSQuery.findObjectById(oid);
        TestSpecification testSpecification = testSpecificationInput;
        try{
            testSpecification = (TestSpecification) VersionHelper.latestIterationOf(testSpecificationInput);
        }catch(Exception e){}
        jSONObject.put("createdOn",FormatHelper.applyFormat(testSpecification.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(testSpecification.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("oid", util.getVR(testSpecification));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(testSpecification.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(testSpecification).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",testSpecification.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(testSpecification));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(testSpecification));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = testSpecification.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
      while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(testSpecification.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,testSpecification.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
      }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(testSpecification.getFlexType()));  
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Test Details")) {
          jSONObject.put("Test Details", findTestDetails(oid));
        }else if (association.equalsIgnoreCase("Test Property")) {
          jSONObject.put("Test Property", findTestPropertys(oid));
        }else if (association.equalsIgnoreCase("Test Method")) {
          jSONObject.put("Test Method", findTestMethods(oid));
        }else if (association.equalsIgnoreCase("Test Condition")) {
          jSONObject.put("Test Condition", findTestConditions(oid));
        }else if (association.equalsIgnoreCase("Test Standard")) {
          jSONObject.put("Test Standard", findTestStandards(oid));
        }
        return jSONObject;
      }

    /**
     * This method is used to get the Test Detils records of given testSpecificationOid .
     * @param String testSpecificationOid
     * @return JSONArray  it returns the TestSpecification associated Test Detils records in the form of array
     */
  
    public JSONArray findTestDetails(String testSpecificationOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find test details with testSpecificationOid ***** "+ testSpecificationOid));
      TestDetailsModel testDetailsModel = new TestDetailsModel();
      JSONArray testDetailsArray = new JSONArray();
      try{
        TestSpecification testSpecification = (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
        SearchResults results =  testSpecificationQuery.findTemplateTestDetails(testSpecification,null);
        Collection response = results.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
         FlexObject flexObject = (FlexObject)itr.next();
         String testDetailsOid = testDetailsModel.getOid(flexObject);
         JSONObject testDetailObject = testDetailsModel.getRecordByOid("Test Details",testDetailsOid);
          testDetailsArray.add(testDetailObject);
        }
      }catch(Exception e){
        testDetailsArray.add(util.getExceptionJson(e.getMessage()));
      }
        return testDetailsArray;
    }

    /**
     * This method is used to get the Test Property records of given testSpecificationOid .
     * @param String testSpecificationOid
     * @return JSONArray  it returns the TestSpecification associated Test Property records in the form of array
     */
    public JSONArray findTestPropertys(String testSpecificationOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find test propertys with testSpecificationOid ***** "+ testSpecificationOid));
     TestPropertyModel testPropertyModel = new TestPropertyModel();
      JSONArray testPropertyArray = new JSONArray();
      try{
        TestSpecification testSpecification = (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
        SearchResults results =  testSpecificationQuery.findTemplateTestDetails(testSpecification,null);
        Collection response = results.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
         FlexObject flexObject = (FlexObject)itr.next();
         String testPropertyOid = testPropertyModel.getOid(flexObject);
         JSONObject testPropertyObject = testPropertyModel.getRecordByOid("Test Property",testPropertyOid);
          testPropertyArray.add(testPropertyObject);
        }
      }catch(Exception e){
        testPropertyArray.add(util.getExceptionJson(e.getMessage()));
      }
        return testPropertyArray;
    }

    /**
     * This method is used to get the Test Method records of given testSpecificationOid .
     * @param String testSpecificationOid
     * @return JSONArray  it returns the TestSpecification associated Test Method records in the form of array
     */
    public JSONArray findTestMethods(String testSpecificationOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find test methods with testSpecificationOid***** "+ testSpecificationOid));
      TestMethodModel testMethodModel = new TestMethodModel();
      JSONArray testMethodArray = new JSONArray();
      try{
        TestSpecification testSpecification = (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
        SearchResults results =  testSpecificationQuery.findTemplateTestDetails(testSpecification,null);
        Collection response = results.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
         FlexObject flexObject = (FlexObject)itr.next();
         String testMethodOid = testMethodModel.getOid(flexObject);
         JSONObject testMethodObject = testMethodModel.getRecordByOid("Test Method",testMethodOid);
          testMethodArray.add(testMethodObject);
        }
      }catch(Exception e){
        testMethodArray.add(util.getExceptionJson(e.getMessage()));
      }
        return testMethodArray;
    }

    /**
     * This method is used to get the Test Condition records of given testSpecificationOid .
     * @param String testSpecificationOid
     * @return JSONArray  it returns the TestSpecification associated Test Condition records in the form of array
     */
    public JSONArray findTestConditions(String testSpecificationOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find test conditions with testSpecificationOid  ***** "+ testSpecificationOid));
      TestConditionModel testConditionModel = new TestConditionModel();
      JSONArray testConditionArray = new JSONArray();
      try{
        TestSpecification testSpecification = (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
        SearchResults results =  testSpecificationQuery.findTemplateTestDetails(testSpecification,null);
        Collection response = results.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
         FlexObject flexObject = (FlexObject)itr.next();
         String testConditionOid = testConditionModel.getOid(flexObject);
         JSONObject testConditionObject = testConditionModel.getRecordByOid("Test Condition",testConditionOid);
          testConditionArray.add(testConditionObject);
        }
      }catch(Exception e){
        testConditionArray.add(util.getExceptionJson(e.getMessage()));
      }
        return testConditionArray;
    }

    /**
     * This method is used to get the Test Standard records of given testSpecificationOid .
     * @param String testSpecificationOid
     * @return JSONArray  it returns the TestSpecification associated Test Standard records in the form of array
     */
     public JSONArray findTestStandards(String testSpecificationOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find test Standards with testSpecificationOid ***** "+ testSpecificationOid));
      TestStandardModel testStandardModel = new TestStandardModel();
      JSONArray testStandardArray = new JSONArray();
      try{
        TestSpecification testSpecification = (TestSpecification) LCSQuery.findObjectById(testSpecificationOid);
        TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
        SearchResults results =  testSpecificationQuery.findTemplateTestDetails(testSpecification,null);
        Collection response = results.getResults();
        Iterator itr = response.iterator();
        while(itr.hasNext()) {
         FlexObject flexObject = (FlexObject)itr.next();
         String testStandardOid = testStandardModel.getOid(flexObject);
         JSONObject testStandardObject = testStandardModel.getRecordByOid("Test Standard",testStandardOid);
          testStandardArray.add(testStandardObject);
        }
      }catch(Exception e){
        testStandardArray.add(util.getExceptionJson(e.getMessage()));
      }
        return testStandardArray;
    }

}