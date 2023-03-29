/*
 * Created on 06/06/2017
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
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sizing.FullSizeRangeClientModel;
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.sizing.FullSizeRange;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import java.io.FileNotFoundException;
import wt.util.WTException;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class FullSizeRangeModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(FullSizeRangeModel.class.getName());
//private static final String CLASSNAME = FullSizeRangeModel.class.getName();

    AppUtil util = new AppUtil();
    /**
      * This method is used either insert or update the full size range flex object that are  passed by using type as reference,
      * oid and array of different full size range data 
      * Using this method we can insert/update  record of a full size range flextype at a time.
      * @param type String 
      * @param oid String
      * @param full size rangeJsonData  Contains array of full size range data
      * @exception Exception
      * @return JSONObject  It returns full size range JSONObject object
      */
    public JSONObject createFullSizeRange(String type, JSONObject fullSizeRangeJson){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Full Size Range  initialized ***** "));
       JSONObject responseObject = new JSONObject();
        try{
          FullSizeRangeClientModel fullSizeRangeClientModel = new FullSizeRangeClientModel();
          Map fullSizeRangeAttrs =new HashMap();
          fullSizeRangeAttrs.put("name",(String)fullSizeRangeJson.get("name"));
          fullSizeRangeAttrs.put("size1Label",(String)fullSizeRangeJson.get("size1Label"));
          fullSizeRangeAttrs.put("size2Label",(String)fullSizeRangeJson.get("size2Label"));
          fullSizeRangeAttrs.put("sizeValues",(String)fullSizeRangeJson.get("sizeValues"));
          fullSizeRangeAttrs.put("size2Values",(String)fullSizeRangeJson.get("size2Values"));
          fullSizeRangeAttrs.put("baseSize2",(String)fullSizeRangeJson.get("baseSize2"));
          fullSizeRangeAttrs.put("baseSize",(String)fullSizeRangeJson.get("baseSize"));
          fullSizeRangeAttrs.put("typeId",(String)fullSizeRangeJson.get("typeId"));
          AttributeValueSetter.setAllAttributes(fullSizeRangeClientModel,fullSizeRangeAttrs);
          fullSizeRangeClientModel.save();
          String fullSizeRangeOid = FormatHelper.getObjectId(fullSizeRangeClientModel.getBusinessObject());
          responseObject.put("FullSizeRangeOid",fullSizeRangeOid);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
      * This method is used to update the Full Size Range(Size Definition) flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a Full Size Range(Size Definition) flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param fullSizeRangeJson  Contains Full Size Range(Size Definition) data
      * @exception Exception
      * @return String  It returns OID of Full Size Range(Size Definition) object
      */

     public JSONObject updateFullSizeRange(String oid,String type, JSONObject fullSizeRangeJson) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Full Size Range ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        FullSizeRangeClientModel fullSizeRangeClientModel = new FullSizeRangeClientModel();
        try{
            fullSizeRangeClientModel.load(oid);
            Map fullSizeRangeAttrs = new HashMap();
            fullSizeRangeAttrs.put("name",(String)fullSizeRangeJson.get("name"));
            fullSizeRangeAttrs.put("size1Label",(String)fullSizeRangeJson.get("size1Label"));
            fullSizeRangeAttrs.put("size2Label",(String)fullSizeRangeJson.get("size2Label"));
            fullSizeRangeAttrs.put("sizeValues",(String)fullSizeRangeJson.get("sizeValues"));
            fullSizeRangeAttrs.put("size2Values",(String)fullSizeRangeJson.get("size2Values"));
            fullSizeRangeAttrs.put("baseSize2",(String)fullSizeRangeJson.get("baseSize2"));
            fullSizeRangeAttrs.put("baseSize",(String)fullSizeRangeJson.get("baseSize"));
            fullSizeRangeAttrs.put("typeId",(String)fullSizeRangeJson.get("typeId"));
            AttributeValueSetter.setAllAttributes(fullSizeRangeClientModel, fullSizeRangeAttrs);
            fullSizeRangeClientModel.save();
            String fullSizeRangeOid = FormatHelper.getObjectId(fullSizeRangeClientModel.getBusinessObject());
            responseObject.put("FullSizeRangeOid",fullSizeRangeOid);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }       

    /**
      * This method is used either insert or update the Full Size Range(Size Definition) flex object that are  passed by using type as reference,
      * oid and object of different Full Size Range data 
      * Using this method we can insert/update record of a Full Size Range(Size Definition) flextype at a time.
      * @param type String 
      * @param oid String
      * @param fullSizeRangeJsonData  Contains Full Size Range(Size Definition) data
      * @exception Exception
      * @return JSONObject  It returns Full Size Range(Size Definition) JSONObject
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
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateFullSizeRange with criteria ***** "));
                        responseObject=updateFullSizeRange(list.get(2).toString(),type,payloadJson);
                    }else{
                      //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createFullSizeRange ***** "));
                        responseObject=createFullSizeRange(type, payloadJson);
                    }
                }else {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateFullSizeRange with oid ***** "));
                    responseObject=updateFullSizeRange(oid,type,payloadJson);
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
        return null; 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex Schema with type and typeId ***** "));
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
                        if (attribute.getAttScope().equals("SIZING_SCOPE")) {
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
    * This method is used to search schema object .
    * @param Map criteria 
    * @param flexType  FlexType
    * @param String name
    * @exception Exception
    * @return String  it returns schema object
    */ 
    public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name with criteria and flexType and name ***** "+ name));
        Collection<FlexObject> response = null;
        String oid = "";
        SizingQuery query = new SizingQuery();     
        response = query.findFullSizeRangesByName(name).getResults();
        oid = (String) response.iterator().next().get("FULLSIZERANGE.IDA2A2");
        oid = "OR:com.lcs.wc.sizing.FullSizeRange:"+oid;
        if(response.size() == 0){
          return "no record";
        } else {
          return oid;
        }
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Records with ObjectType and criteriaMap ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot("Size Definition");
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new SizingQuery().findFullSizeRanges();
        return util.getResponseFromResults(results,objectType);
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
       return "OR:com.lcs.wc.sizing.FullSizeRange:"+(String)flexObject.getString("FULLSIZERANGE.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid));
      JSONObject jsonObj = new JSONObject();
        FullSizeRange fullSizeRange = (FullSizeRange) LCSQuery.findObjectById(oid);
        SizingQuery sizingQuery = new SizingQuery();
        SearchResults searchResults  = sizingQuery.findFullSizeRanges();
        SearchResults searchResults1  = sizingQuery.findActualSizeRangeData();
        SearchResults actualSizeCategories = sizingQuery.findProductSizeCategoryByCriteria(new HashMap(), FlexTypeCache.getFlexTypeRoot("Size Definition"), "ProductSizeCategory.TEMPLATE_TYPE", null, null);
        Collection results = actualSizeCategories.getResults();

        return null;
    }
}
