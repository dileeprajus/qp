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
package cdee.web.model.placeholder;

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
import com.lcs.wc.placeholder.PlaceholderQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.placeholder.Placeholder;
import cdee.web.model.product.ProductModel;
import wt.util.WTException;
import com.lcs.wc.placeholder.PlaceholderLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class PlaceholderModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(PlaceholderModel.class.getName());
 //private static final String CLASSNAME = PlaceholderModel.class.getName();
    PlaceholderQuery placeholderQuery = new PlaceholderQuery();
  	AppUtil util = new AppUtil();

    /**
      * This method is used either insert or update the Placeholder flex object that are  passed by using type as reference,
      * oid and array of different Placeholder data 
      * Using this method we can insert/update several records of a Placeholder flextype at a time.
      * @param type String 
      * @param oid String
      * @param PlaceholderJSONArray  Contains array of Placeholder data
      * @exception Exception
      * @return JSONArray  It returns Placeholder JSONArray object
      */
    public JSONArray saveOrUpdate(String type,String oid, JSONArray jsonArray) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "----oid----"+ oid)); 
      JSONArray responseArray = new JSONArray();
      return responseArray;
    }

    /**
      * This method is used to insert the Placeholder flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a Placeholder flextype at a time.
      * @param type is a string 
      * @param placeholderDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns Placeholder JSONArray object
      */  
    public JSONObject createPlaceholder(String type, ArrayList placeholderDataList){

        return null;
    }

    /**
      * This method is used to update the Placeholder flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a Placeholder flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param placeholderJsonObject  Contains Placeholder data
      * @exception Exception
      * @return String  It returns OID of Placeholder object
      */
    public JSONObject updatePlaceholder(String oid,String type, JSONObject placeholderJsonObject) throws Exception{
    
        return null;
    }

    /**
      * This method is used delete Placeholder of given oid,
      * @param oid String 
      * @exception Exception
      * @return JSONObject  It returns response JSONObject object
      */
    public JSONObject delete(String oid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid  initialized ***** "+ oid));
      JSONObject responseObject=new JSONObject();
      try{
        Placeholder placeholder = (Placeholder) LCSQuery.findObjectById(oid);
        PlaceholderLogic placeholderLogic = new PlaceholderLogic();
        placeholderLogic.deletePlaceholder(placeholder);
        responseObject=util.getDeleteResponseObject("Placeholder",oid,responseObject);
      }catch(WTException wte){
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.placeholder.Placeholder"); 
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
                        if (attribute.getAttScope().equals("PLACEHOLDER")) {
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
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception{
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new PlaceholderQuery().findPlaceholdersByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        FlexType flexType = com.lcs.wc.flextype.FlexTypeCache.getFlexTypeFromPath("Product");
        Map criteria = new HashMap();
        criteria.put(flexType.getAttribute("placeholderName").getSearchCriteriaIndex(),name);
        Collection<FlexObject> response = placeholderQuery.findPlaceholdersByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("PLACEHOLDER.IDA2A2");
        oid = "OR:com.lcs.wc.placeholder.Placeholder:"+oid;
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
        return "OR:com.lcs.wc.placeholder.Placeholder:"+(String)flexObject.getString("PLACEHOLDER.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        Placeholder placeholderInput = (Placeholder) LCSQuery.findObjectById(oid);
        Placeholder placeholder = placeholderInput;
        try{
            placeholder = (Placeholder) VersionHelper.latestIterationOf (placeholderInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(placeholder.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(placeholder.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",placeholder.getPrimaryImageURL());
        jSONObject.put("typeId",FormatHelper.getObjectId(placeholder.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(placeholder).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",placeholder.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(placeholder));
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(placeholder.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = placeholder.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
       	while(it.hasNext()){
          	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          	String attKey = att.getAttKey();
          	try{
            		if(placeholder.getValue(attKey) == null){
             		 	jSONObject.put(attKey,"");
            		}
            		else{
             			jSONObject.put(attKey,placeholder.getValue(attKey).toString());
           		}
         		}catch(Exception e){
             	}
      	}
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(placeholder.getFlexType()));
      }


    /**
    * This method is used to fetch the record that matched with the given oid of this flex object with association flexObject records.
    * @param String  objectType which contains flexObject name
    * @param String oid 
    * @param String association which contains association(includes) flexObject name
    * @Exception exception
    * @return JSONObject  it returns the record that matched the given oid of this flex object with association flexObject records
    */ 
    
    public JSONObject getRecordByOid(String objectType,String oid,String association) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if(association.equalsIgnoreCase("Product")){
            jSONObject.put("Product",findProducts(oid));
        }
         return jSONObject;
      }

     /**
     * This method is used to get the Product records of given placeholderOid .
     * @param String placeholderOid
     * @return JSONArray  it returns the Placeholder associated Product records in the form of array
     */

    public JSONArray findProducts(String placeholderOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find products  initialized ***** "+ placeholderOid));
      ProductModel productModel = new ProductModel();
      JSONArray productArray = new JSONArray();
      PlaceholderQuery placeholderQuery = new PlaceholderQuery();
      try{
          Placeholder placeholder =  (Placeholder) LCSQuery.findObjectById(placeholderOid);
          Collection response = placeholderQuery.findProductsForPlaceholder(placeholder);
          Iterator itr = response.iterator();
          while(itr.hasNext()) {
            FlexObject flexObject = (FlexObject)itr.next();
            String productOid = productModel.getOid(flexObject);
            JSONObject productObject = productModel.getRecordByOid("Product",productOid);
            productArray.add(productObject);
        }
      }catch(Exception e){
        productArray.add(util.getExceptionJson(e.getMessage()));
      }
      return productArray;
    }
}