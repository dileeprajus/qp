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
package cdee.web.model.sourcing;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.last.LCSLastClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.sourcing.RFQQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.sourcing.RFQRequestClientModel;
import wt.util.WTException;
import com.lcs.wc.sourcing.RFQLogic;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import wt.util.WTException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class RFQModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(RFQModel.class.getName());
//private static final String CLASSNAME = RFQModel.class.getName();
  	RFQQuery rfqQuery = new RFQQuery();
  	AppUtil util = new AppUtil();


       /**
      * This method is used to update the RFQ flex object that are  passed by using type as reference.
      * @param oid is a string 
      * @param type is a string 
      * @param rfqJsonObject  rfqData
      * @exception Exception
      * @return JSONObject  It returns RFQ JSONObject object
      */  
    public JSONObject updateRFQ(String oid,String type, JSONObject rfqJsonObject) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update RFQ with oid ***** " + oid));
        JSONObject responseObject = new JSONObject();
        RFQRequestClientModel rfqModel = new RFQRequestClientModel();
        try{
            rfqModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(rfqJsonObject,type,FormatHelper.getObjectId(rfqModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(rfqModel, convertedAttrs);
            rfqModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(rfqModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
      } 

        /**
      * This method is used to insert the RFQ flex object that are  passed by using type as reference.
      * @param type is a string 
      * @param rfqDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONObject  It returns RFQ JSONObject object
      */  
      public JSONObject createRFQ(String type, JSONObject rfqDataList){
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create RFQ  initialized ***** "));
          JSONObject responseObject = new JSONObject();
          RFQRequestClientModel rfqModel = new RFQRequestClientModel();
          try{
              DataConversionUtil datConUtil=new DataConversionUtil();
              Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(rfqDataList,type,(String)rfqDataList.get("typeId"));
              AttributeValueSetter.setAllAttributes(rfqModel,convertedAttrs);
              if(rfqDataList.containsKey("productOid") && rfqDataList.containsKey("sourceOid")){
                rfqModel.save((String)rfqDataList.get("productOid"),(String)rfqDataList.get("sourceOid"));
              }else{
                rfqModel.save();
              }
              responseObject = util.getInsertResponse(FormatHelper.getVersionId(rfqModel.getBusinessObject()).toString(),type,responseObject);
          } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
          }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
          }
          return responseObject;
      }

         /**
      * This method is used either insert or update the RFQ flex object that are  passed by using type as reference,
      * Using this method we can insert/update record of a RFQ flextype at a time.
      * @param type String 
      * @param oid String
      * @param rfqData  Contains object of RFQ data
      * @exception Exception
      * @return JSONObject  It returns RFQ JSONObject object
      */
      public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);

                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateRFQ with criteria ***** "));
                    responseObject = updateRFQ(list.get(2).toString(), type, payloadJson);
                } else {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createRFQ ***** "));
                    responseObject = createRFQ(type, payloadJson);
                }
            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateRFQ with oid ***** "));
                responseObject = updateRFQ(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
   
      

    /**
    * This method is used delete RFQ request of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete with oid ***** "+ oid));
      JSONObject responseObject=new JSONObject();
      try{
        RFQRequest rfqRequest = (RFQRequest) LCSQuery.findObjectById(oid);
        RFQLogic rfqLogic = new RFQLogic();
        rfqLogic.deleteRFQRequest(rfqRequest);
        responseObject=util.getDeleteResponseObject("RFQ",oid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** delete with oid exception ***** "+wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.RFQRequest"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex schema with type and typeId ***** "));
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
                    if(attribute.getAttScope().equals("REQUEST_HEADER_SCOPE")){
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records with objectType ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results =new RFQQuery().findRFQsByCriteria(criteriaMap,flexType,null,null,null);
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
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        Collection<FlexObject> response = rfqQuery.findRFQsByCriteria(criteria,flexType,null,null,null).getResults();
    String oid = (String) response.iterator().next().get("RFQREQUEST.BRANCHIDITERATIONINFO");
    oid = "VR:com.lcs.wc.sourcing.RFQRequest:"+oid;
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
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get oud with flexObject ***** "));
      if((String)flexObject.getString("RFQREQUEST.BRANCHIDITERATIONINFO")!=null){
        return "VR:com.lcs.wc.sourcing.RFQRequest:"+(String)flexObject.getString("RFQREQUEST.BRANCHIDITERATIONINFO");
      }else{
        return "";
      }
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
        RFQRequest rfqRequestInput = (RFQRequest) LCSQuery.findObjectById(oid);
        RFQRequest rfqRequest = rfqRequestInput;
         try{
            rfqRequest = (RFQRequest) VersionHelper.latestIterationOf(rfqRequestInput);
        }catch(Exception e){
        }
         jSONObject.put("oid", util.getVR(rfqRequest));
        jSONObject.put("createdOn",FormatHelper.applyFormat(rfqRequest.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(rfqRequest.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(rfqRequest.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(rfqRequest).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",rfqRequest.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(rfqRequest));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(rfqRequest));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = rfqRequest.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(rfqRequest.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,rfqRequest.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(rfqRequest.getFlexType()));
	}

}