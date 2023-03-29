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
package cdee.web.model.sizing;

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
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sizing.ProductSizeCategory;
import com.lcs.wc.sizing.ProductSizeCategoryClientModel;
import cdee.web.util.AppUtil;
import cdee.web.model.sizing.SizeCategoryModel;
import cdee.web.model.sizing.FullSizeRangeModel;
import cdee.web.model.measurements.MeasurementsModel;
import com.lcs.wc.measurements.LCSMeasurements;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.sourcing.LCSCostSheetQuery;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import wt.util.WTException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SizingModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SizingModel.class.getName());
//private static final String CLASSNAME = SizingModel.class.getName();

	SizingQuery sizing = new SizingQuery();
  SizeCategoryModel sizeCategoryModel = new SizeCategoryModel();
  FullSizeRangeModel fullSizeRangeModel = new FullSizeRangeModel();
	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


  /**
      * This method is used to insert the Size Definition flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a Size Definition flextype at a time.
      * @param type is a string 
      * @param sizeDefinitionJson  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONObject  It returns Size Definition JSONObject
      */  

  public JSONObject createSizeDefinition(String type, JSONObject sizeDefinitionJson){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Size Definition  initialized ***** "+ type));
       JSONObject responseObject = new JSONObject();
       ProductSizeCategoryClientModel productSizeCategoryClientModel = new ProductSizeCategoryClientModel();
      try{
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(sizeDefinitionJson,type,(String)sizeDefinitionJson.get("typeId"));
        convertedAttrs.put("name",(String)sizeDefinitionJson.get("name"));
        convertedAttrs.put("size1Label",(String)sizeDefinitionJson.get("size1Label"));
        convertedAttrs.put("size2Label",(String)sizeDefinitionJson.get("size2Label"));
        convertedAttrs.put("sizeValues",(String)sizeDefinitionJson.get("sizeValues"));
        convertedAttrs.put("size2Values",(String)sizeDefinitionJson.get("size2Values"));
        convertedAttrs.put("baseSize2",(String)sizeDefinitionJson.get("baseSize2"));
        convertedAttrs.put("baseSize",(String)sizeDefinitionJson.get("baseSize"));
        convertedAttrs.put("typeId",(String)sizeDefinitionJson.get("typeId"));
        productSizeCategoryClientModel.setSizeCategoryType("TEMPLATE");
        productSizeCategoryClientModel.setSizeCategoryId((String)sizeDefinitionJson.get("sizeCategoryOid"));
        productSizeCategoryClientModel.setFullSizeRangeId((String)sizeDefinitionJson.get("fullSizeRangeOid"));
        AttributeValueSetter.setAllAttributes(productSizeCategoryClientModel, convertedAttrs);
        productSizeCategoryClientModel.save();
        String sizeDefinitionOid = FormatHelper.getObjectId(productSizeCategoryClientModel.getBusinessObject()).toString();
        responseObject = util.getInsertResponse(sizeDefinitionOid,type,responseObject);
      } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
      }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
      * This method is used to update the Size Definition flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a Size Definition flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param sizeDefinitionJson  Contains Size Definition data
      * @exception Exception
      * @return String  It returns OID of Size Definition object
      */

    public JSONObject updateSizeDefinition(String oid,String type, JSONObject sizeDefinitionJson) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update size definition with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        ProductSizeCategoryClientModel productSizeCategoryClientModel = new ProductSizeCategoryClientModel();
        try{
            productSizeCategoryClientModel.load(oid);
             DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(sizeDefinitionJson,type,(String)sizeDefinitionJson.get("typeId"));
            convertedAttrs.put("name",(String)sizeDefinitionJson.get("name"));
            convertedAttrs.put("size1Label",(String)sizeDefinitionJson.get("size1Label"));
            convertedAttrs.put("size2Label",(String)sizeDefinitionJson.get("size2Label"));
            convertedAttrs.put("sizeValues",(String)sizeDefinitionJson.get("sizeValues"));
            convertedAttrs.put("size2Values",(String)sizeDefinitionJson.get("size2Values"));
            convertedAttrs.put("baseSize2",(String)sizeDefinitionJson.get("baseSize2"));
            convertedAttrs.put("baseSize",(String)sizeDefinitionJson.get("baseSize"));
            convertedAttrs.put("typeId",(String)sizeDefinitionJson.get("typeId"));
            AttributeValueSetter.setAllAttributes(productSizeCategoryClientModel, convertedAttrs);
            productSizeCategoryClientModel.save();
            String sizeDefinitionOid = FormatHelper.getObjectId(productSizeCategoryClientModel.getBusinessObject()).toString();
            responseObject = util.getUpdateResponse(sizeDefinitionOid,type,responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }       


    /**
      * This method is used either insert or update the Size Definition flex object that are  passed by using type as reference,
      * oid and object of different Size Definition data 
      * Using this method we can insert/update record of a Size Definition flextype at a time.
      * @param type String 
      * @param oid String
      * @param sizeDefinitionJsonData  Contains Size Definition data
      * @exception Exception
      * @return JSONObject  It returns Size Definition JSONObject
      */


    public JSONObject saveOrUpdate(String type,String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
            JSONObject responseObject = new JSONObject();
            try{
                if(oid == null){
                    ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                    if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                      //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSizeDefinition with criteria ***** "));
                        responseObject=updateSizeDefinition(list.get(2).toString(),type,payloadJson);
                    }else{
                      //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSizeDefinition  ***** "));
                        responseObject=createSizeDefinition(type, payloadJson);
                    }
                }else {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSizeDefinition with oid ***** "));
                    responseObject=updateSizeDefinition(oid,type,payloadJson);
                }
            }catch (Exception e) {
                responseObject = util.getExceptionJson(e.getMessage());
            }
        return responseObject;
    }
 


    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sizing.ProductSizeCategory"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex Schema with type and typeId ***** "));
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
                    if(attribute.getAttScope().equals("SIZING_SCOPE")){
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
   public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception{
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records with objectType and criteriaMap ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new SizingQuery().findProductSizeCategoryByCriteria(criteriaMap,flexType,null,null,null);
        return util.getResponseFromResults(results,objectType);
    }

	public String getRecordsData(FlexType flexType)throws Exception{
	   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Records Data with flexType ***** "));
     	JSONObject object = new JSONObject();
		Map criteria = new HashMap();
		object.put("Size Definition",sizing.findProductSizeCategoryByCriteria(criteria,flexType,null,null,null).getResults());
		return gson.toJson(object);
	}

  /**
    * This method is used to get the oid by taking name of the record.
    * @param FlexType  flexType
    * @param Map criteria
    * @param String name
    * @Exception exception
    * @return return oid by taking name of the record of the flex object
    */ 
  public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
    Collection<FlexObject> response = sizing.findProductSizeCategoryByCriteria(criteria,flexType,null,null,null).getResults();
    String oid = (String) response.iterator().next().get("PRODUCTSIZECATEGORY.IDA2A2");
    oid = "OR:com.lcs.wc.sizing.ProductSizeCategory:"+oid;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search Schema Objects with objectType ***** "));
    SearchResults results = new SearchResults();
        SizingQuery sizing = new SizingQuery();
    results = sizing.findProductSizeCategoryByCriteria(criteriaMap,flexType,null,null,null);
        return util.getResponseFromResults(results,objectType);
  } 


  /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
	public String getOid(FlexObject flexObject){
        return "OR:com.lcs.wc.sizing.ProductSizeCategory:"+(String)flexObject.getString("PRODUCTSIZECATEGORY.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid  ***** "+ oid));
      	JSONObject jSONObject = new JSONObject();
        ProductSizeCategory productSizeCategoryInput = (ProductSizeCategory) LCSQuery.findObjectById(oid);
        ProductSizeCategory productSizeCategory = productSizeCategoryInput;
        try{
            productSizeCategory = (ProductSizeCategory) VersionHelper.latestIterationOf(productSizeCategoryInput);
        }catch(Exception e){
        }
		    jSONObject.put("createdOn",FormatHelper.format(productSizeCategory.getCreateTimestamp()));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(productSizeCategory.getModifyTimestamp(),"DATE_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid",oid);
        jSONObject.put("typeId",FormatHelper.getObjectId(productSizeCategory.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(productSizeCategory).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",productSizeCategory.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(productSizeCategory));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(productSizeCategory));
        String typeHierrName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierrName.substring(typeHierrName.lastIndexOf("\\")+1));
        Collection attributes = productSizeCategory.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(productSizeCategory.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,productSizeCategory.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(productSizeCategory.getFlexType()));
	}

}