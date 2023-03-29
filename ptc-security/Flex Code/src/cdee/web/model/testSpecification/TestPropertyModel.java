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
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.testing.TestProperty;
import com.lcs.wc.testing.TestPropertyClientModel;
import wt.util.WTException;
import com.lcs.wc.testing.TestPropertyLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class TestPropertyModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(TestPropertyModel.class.getName());
//private static final String CLASSNAME = TestPropertyModel.class.getName();

    TestSpecificationQuery testSpecificationQuery = new TestSpecificationQuery();
	AppUtil util = new AppUtil();

	/**
      * This method is used either insert or update the TestProperty flex object that are  passed by using type as reference,
      * oid and array of different TestProperty data 
      * Using this method we can insert/update several records of a TestProperty flextype at a time.
      * @param type String 
      * @param oid String
      * @param TestPropertyJSONArray  Contains array of TestProperty data
      * @exception Exception
      * @return JSONArray  It returns TestProperty JSONArray object
      */
  public JSONObject saveOrUpdate(String type,String oid,JSONObject tpJsonData,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
          JSONObject responseObject = new JSONObject();
          try{
            
            if(oid == null){
              ArrayList list = util.getOidFromSeachCriteria(type,tpJsonData,payloadJson);
              if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestProperty with criteria ***** "));
                responseObject=updateTestProperty(list.get(2).toString(),type,payloadJson);
              } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createTestProperty  ***** "));
                responseObject=createTestProperty(type,payloadJson);
              }
            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateTestProperty with oid ***** "));
              responseObject=updateTestProperty(oid,type,payloadJson);
            }
          }catch(Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
          }
          return responseObject;  
  }

    /**
      * This method is used to insert the TestProperty flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a TestProperty flextype at a time.
      * @param type is a string 
      * @param testPropertyDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns TestProperty JSONArray object
      */  

    public JSONObject createTestProperty(String type, JSONObject testPropertyJsonObject){
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Test property ***** "));
        JSONObject responseObject = new JSONObject();
        TestPropertyClientModel testPropertyClientModel=new TestPropertyClientModel();
        try{
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(testPropertyJsonObject,type,(String)testPropertyJsonObject.get("typeId"));
            AttributeValueSetter.setAllAttributes(testPropertyClientModel,convertedAttrs);
            testPropertyClientModel.save();
            responseObject=util.getResponse(FormatHelper.getObjectId(testPropertyClientModel.getBusinessObject()).toString(),type,responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    } 

    /**
      * This method is used to update the TestProperty flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a TestProperty flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param testPropertyJsonObject  Contains TestProperty data
      * @exception Exception
      * @return String  It returns OID of TestProperty object
      */

    public JSONObject updateTestProperty(String oid,String type, JSONObject testPropertyJsonObject) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update test property with oid ***** "+ oid));
         JSONObject responseObject = new JSONObject();
        TestPropertyClientModel testPropertyClientModel=new TestPropertyClientModel();
        try{
            testPropertyClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(testPropertyJsonObject,type,FormatHelper.getObjectId(testPropertyClientModel.getFlexType()));
            convertedAttrs.put("specTypeString","TEMPLATE");
            AttributeValueSetter.setAllAttributes(testPropertyClientModel,convertedAttrs);
            testPropertyClientModel.save();
            responseObject=util.getResponse(FormatHelper.getObjectId(testPropertyClientModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
    * This method is used delete Test Property of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete with oid ***** "+ oid));
      JSONObject responseObject=new JSONObject();
      try{
        TestProperty testProperty= (TestProperty) LCSQuery.findObjectById(oid);
        TestPropertyLogic testPropertyLogic = new TestPropertyLogic();
        testPropertyLogic.deleteTestProperty(testProperty);
        responseObject=util.getDeleteResponseObject("Test Property",oid,responseObject);
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
                        if (attribute.getAttScope().equals("PROPERTY")) {
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
  		    results = testSpecificationQuery.findTestProperties(flexType,criteriaMap);
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
      FlexType flexType = com.lcs.wc.flextype.FlexTypeCache.getFlexTypeFromPath("Test Specification");
      Map criteria = new HashMap();
      criteria.put(flexType.getAttribute("propertyName").getSearchCriteriaIndex(),name);
      Collection<FlexObject> response = testSpecificationQuery.findTestProperties(flexType,criteria).getResults();
      String oid = (String) response.iterator().next().get("TESTPROPERTY.IDA2A2");
      oid = "OR:com.lcs.wc.testing.TestProperty:"+oid;
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
      results = testSpecificationQuery.findTestProperties(flexType,criteriaMap);
      return util.getResponseFromResults(results,objectType);
  }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
       return "OR:com.lcs.wc.testing.TestProperty:"+(String)flexObject.getString("TESTPROPERTY.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid  ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        TestProperty testPropertyInput = (TestProperty) LCSQuery.findObjectById(oid);
        TestProperty testProperty = testPropertyInput;
        try{
          testProperty = (TestProperty) VersionHelper.latestIterationOf(testPropertyInput);
        }catch(Exception e){}
        jSONObject.put("createdOn",FormatHelper.applyFormat(testProperty.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(testProperty.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(testProperty.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(testProperty).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",testProperty.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(testProperty));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = testProperty.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
      while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(testProperty.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,testProperty.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
      }

        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(testProperty.getFlexType())); 
      }

}