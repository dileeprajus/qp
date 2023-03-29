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
package cdee.web.model.testSpecification;

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
import com.lcs.wc.testing.TestSpecificationQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import java.util.HashMap;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.testing.TestDetails;
import com.lcs.wc.testing.TestDetailsClientModel;
import wt.util.WTException;
import com.lcs.wc.testing.TestDetailsLogic;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class TestDetailsModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(TestDetailsModel.class.getName());
//private static final String CLASSNAME = TestDetailsModel.class.getName();

  TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
	AppUtil util = new AppUtil();

	/**
      * This method is used either insert or update the TestDetails flex object that are  passed by using type as reference,
      * oid and array of different TestDetails data 
      * Using this method we can insert/update several records of a TestDetails flextype at a time.
      * @param type String 
      * @param oid String
      * @param TestDetailsJSONArray  Contains array of TestDetails data
      * @exception Exception
      * @return JSONArray  It returns TestDetails JSONArray object
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
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestDetails with criteria ***** "));

                responseObject=updateTestDetails(list.get(2).toString(),type,payloadJson);
              } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createTestDetails  ***** "));

                responseObject=createTestDetails(type,payloadJson);
              }
            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestDetails with oid ***** "));

              responseObject=updateTestDetails(oid,type,payloadJson);
            }
          }catch(Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
          }
        return responseObject;        
    }

    /**
      * This method is used to insert the TestDetails flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a TestDetails flextype at a time.
      * @param type is a string 
      * @param testDetailsDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns TestDetails JSONArray object
      */  

    public JSONObject createTestDetails(String type, JSONObject testDetailsJsonData){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create test details ***** "));
        JSONObject responseObject = new JSONObject();
        TestDetailsClientModel testDetailsClientModel=new TestDetailsClientModel();
        try{
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(testDetailsJsonData,type,(String)testDetailsJsonData.get("typeId"));
            convertedAttrs.put("detailType","LIBRARY");
            convertedAttrs.put("testPropertyId",(String)testDetailsJsonData.get("testPropertyId"));
            convertedAttrs.put("testMethodId",(String)testDetailsJsonData.get("testMethodId"));
            convertedAttrs.put("testConditionId",(String)testDetailsJsonData.get("testConditionId"));
            convertedAttrs.put("testSpecificationType",(String)testDetailsJsonData.get("testSpecificationType"));
            AttributeValueSetter.setAllAttributes(testDetailsClientModel,convertedAttrs);
            testDetailsClientModel.save();
            responseObject=util.getResponse(FormatHelper.getObjectId(testDetailsClientModel.getBusinessObject()).toString(),type,responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    } 

    /**
      * This method is used to update the TestDetails flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a TestDetails flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param testDetailsJsonObject  Contains TestDetails data
      * @exception Exception
      * @return String  It returns OID of TestDetails object
      */

    public JSONObject updateTestDetails(String oid,String type, JSONObject attrsJsonObject) throws Exception{
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update test details with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        TestDetailsClientModel testDetailsClientModel=new TestDetailsClientModel();
        try{
            testDetailsClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(attrsJsonObject,type,FormatHelper.getObjectId(testDetailsClientModel.getFlexType()));
            convertedAttrs.put("testPropertyId",(String)attrsJsonObject.get("testPropertyId"));
            convertedAttrs.put("testMethodId",(String)attrsJsonObject.get("testMethodId"));
            convertedAttrs.put("testConditionId",(String)attrsJsonObject.get("testConditionId"));
            convertedAttrs.put("testSpecificationType",(String)attrsJsonObject.get("testSpecificationType"));
            convertedAttrs.put("specTypeString","TEMPLATE");
            AttributeValueSetter.setAllAttributes(testDetailsClientModel,convertedAttrs);
            testDetailsClientModel.save();
            responseObject=util.getResponse(FormatHelper.getObjectId(testDetailsClientModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
    /**
    * This method is used delete Test Details of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** dlete with oid ***** "+ oid));
      JSONObject responseObject=new JSONObject();
      try{
        TestDetails testDetails= (TestDetails) LCSQuery.findObjectById(oid);
        TestDetailsLogic testDetailsLogic = new TestDetailsLogic();
        testDetailsLogic.deleteTestDetails(testDetails);
        responseObject=util.getDeleteResponseObject("Test Details",oid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception in Delete  ***** "+wte.getMessage()));
        responseObject=util.getExceptionJson(wte.getMessage());
      }
      return responseObject;
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

  public JSONObject getFlexSchema(String type, String typeId) throws NumberFormatException,TypeIdNotFoundException,Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with type and typeId ***** "));
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
                        if (attribute.getAttScope().equals("DETAILS")) {
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
   	    	flexType = FlexTypeCache.getFlexTypeRoot("Test Specification");
   	    	results = testSpecificationQuery.findTestSpecificationsByCriteria(criteriaMap,flexType,null,null);
 		  }else{
  		    flexType = FlexTypeCache.getFlexType(typeId);
  		    results = testSpecificationQuery.findLibraryTestDetails(flexType,criteriaMap);
		  }
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
  public String searchByName(Map crit,FlexType type,String name) throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** search by name ***** "+ name));
    FlexType flexType = com.lcs.wc.flextype.FlexTypeCache.getFlexTypeFromPath("Test Details");
        Map criteria = new HashMap();
      criteria.put(flexType.getAttribute("detailsName").getSearchCriteriaIndex(),name);
        Collection<FlexObject> response = testSpecificationQuery.findLibraryTestDetails(flexType,criteria).getResults();
    String oid = (String) response.iterator().next().get("TESTDETAILS.IDA2A2");
    oid = "OR:com.lcs.wc.testing.TestDetails:"+oid;
        if(response.size() == 0){
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
    public String getOid(FlexObject flexObject){
        return "OR:com.lcs.wc.testing.TestDetails:"+(String)flexObject.getString("TESTDETAILS.IDA2A2");
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
        TestDetails testDetailsInput = (TestDetails) LCSQuery.findObjectById(oid);
        TestDetails testDetails = testDetailsInput;
        try{
          testDetails = (TestDetails) VersionHelper.latestIterationOf(testDetailsInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(testDetails.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(testDetails.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(testDetails.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(testDetails).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",testDetails.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(testDetails));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = testDetails.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(testDetails.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,testDetails.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(testDetails.getFlexType()));	
    }

}