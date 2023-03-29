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
package cdee.web.model.measurements;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.measurements.LCSPointsOfMeasureQuery;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.measurements.LCSPointsOfMeasure;
import com.lcs.wc.measurements.LCSPointsOfMeasureClientModel;
import wt.util.WTException;
import com.lcs.wc.measurements.LCSPointsOfMeasureLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class PomModel extends GenericObjectService{

//private static final Logger LOGGER = LogR.getLogger(PomModel.class.getName());
//private static final String CLASSNAME = PomModel.class.getName();
  AppUtil util = new AppUtil();
  Gson gson= new Gson();
  LCSMeasurementsQuery lcsMeasurements = new LCSMeasurementsQuery();
  LCSPointsOfMeasureQuery lcsPointsOfMeasureQuery = new LCSPointsOfMeasureQuery();


  /**
      * This method is used either insert or update the Pom flex object that are  passed by using type as reference,
      * oid and array of different Pom data 
      * Using this method we can insert/update several records of a Pom flextype at a time.
      * @param type String 
      * @param oid String
      * @param PomJSONArray  Contains array of Pom data
      * @exception Exception
      * @return JSONArray  It returns Pom JSONArray object
      */
  public JSONObject saveOrUpdate(String type,String oid, JSONObject searchJson, JSONObject payloadJson) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "------oid-------"+ oid)); 
      JSONObject responseObject = new JSONObject();
      try{
          ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
          if(oid == null){
              if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updatePom with criteria ***** "));

                responseObject = updatePom(list.get(2).toString(),type, payloadJson);
              } else {
                
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createPom  ***** "));

                  responseObject = createPom(type, payloadJson);
              }
          } else {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updatePom with oid ***** "+oid));

              responseObject = updatePom(oid,type, payloadJson);
          }
      }catch(Exception e) {
        responseObject = util.getExceptionJson(e.getMessage());
      }
        return responseObject;
  }

    /**
      * This method is used to insert the Pom flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a Pom flextype at a time.
      * @param type is a string 
      * @param constructionDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns Pom JSONArray object
      */  

    public JSONObject createPom(String type, JSONObject pomAttrsJSON){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create POM  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSPointsOfMeasureClientModel lcsPointsOfMeasureClientModel=new LCSPointsOfMeasureClientModel();
        try{
            String typeId = (String)pomAttrsJSON.get("typeId");
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(pomAttrsJSON,type,(String)pomAttrsJSON.get("typeId"));
            convertedAttrs.put("typeId",typeId);
            convertedAttrs.put("measurementsType",typeId);
            //if (LOGGER.isDebugEnabled())
              //LOGGER.debug((Object) (CLASSNAME + "***** Create POM  with pointsOfMeasureType LIBRARY***** "));
            convertedAttrs.put("pointsOfMeasureType","LIBRARY");
            AttributeValueSetter.setAllAttributes(lcsPointsOfMeasureClientModel,convertedAttrs);
            lcsPointsOfMeasureClientModel.save();
            responseObject=util.getInsertResponse(FormatHelper.getObjectId(lcsPointsOfMeasureClientModel.getBusinessObject()).toString(),type,responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
         return responseObject;
    }

    /**
      * This method is used to update the Pom flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a Pom flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param pomJsonObject  Contains Pom data
      * @exception Exception
      * @return String  It returns OID of Pom object
      */

    public JSONObject updatePom(String oid,String type, JSONObject pomJsonObject) throws Exception{
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update POM initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSPointsOfMeasureClientModel lcsPointsOfMeasureClientModel=new LCSPointsOfMeasureClientModel();
        try{
            lcsPointsOfMeasureClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs = datConUtil.convertJSONToFlexTypeFormatUpdate(pomJsonObject,type,FormatHelper.getObjectId(lcsPointsOfMeasureClientModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(lcsPointsOfMeasureClientModel, convertedAttrs);
            lcsPointsOfMeasureClientModel.save();
            responseObject=util.getUpdateResponse(FormatHelper.getObjectId(lcsPointsOfMeasureClientModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
    * This method is used delete Points of Measure of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid ***** "+ oid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSPointsOfMeasure lcsPointsOfMeasure= (LCSPointsOfMeasure) LCSQuery.findObjectById(oid);
        LCSPointsOfMeasureLogic lcsPointsOfMeasureLogic = new LCSPointsOfMeasureLogic();
        lcsPointsOfMeasureLogic.deletePointsOfMeasure(lcsPointsOfMeasure);
        responseObject=util.getDeleteResponseObject("POM",oid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
              //LOGGER.debug((Object) (CLASSNAME + "***** Exception with delete **** "+wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.measurements.LCSPointsOfMeasure"); 
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
                        if (attribute.getAttScope().equals("MEASUREMENT_SCOPE")) {
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
          flexType = FlexTypeCache.getFlexTypeRoot("Measurements");
    }else{
          flexType = FlexTypeCache.getFlexType(typeId);
    }
        results = lcsPointsOfMeasureQuery.findPointsOfMeasureByCriteria(criteriaMap,flexType,null,null,null,false,false);
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
  public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
            return "no record";
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "null";  
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
        LCSPointsOfMeasure lcsPointsOfMeasureInput = (LCSPointsOfMeasure) LCSQuery.findObjectById(oid);
        LCSPointsOfMeasure lcsPointsOfMeasure = lcsPointsOfMeasureInput;
        try{
            lcsPointsOfMeasure = (LCSPointsOfMeasure) VersionHelper.latestIterationOf (lcsPointsOfMeasureInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsPointsOfMeasure.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsPointsOfMeasure.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid",oid);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsPointsOfMeasure.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsPointsOfMeasure).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsPointsOfMeasure.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsPointsOfMeasure));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        jSONObject.put("sortingNumber",lcsPointsOfMeasure.getSortingNumber());
        Collection attributes = lcsPointsOfMeasure.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
      while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(lcsPointsOfMeasure.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,lcsPointsOfMeasure.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
      }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsPointsOfMeasure.getFlexType())); 
    }
}