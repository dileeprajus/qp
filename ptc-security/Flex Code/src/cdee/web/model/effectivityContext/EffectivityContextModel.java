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
package cdee.web.model.effectivityContext;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.foundation.EffectivityContextClientModel;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.foundation.EffectivityContextQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.foundation.EffectivityContext;
import wt.util.WTException;
import com.lcs.wc.foundation.EffectivityContextLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class EffectivityContextModel extends GenericObjectService{
  //private static final Logger LOGGER = LogR.getLogger(EffectivityContextModel.class.getName());
  //private static final String CLASSNAME = EffectivityContextModel.class.getName();
	AppUtil util = new AppUtil();

	/**
	  * This method is used to update the EffectivityContext flex object that are  passed by using OID as reference.
	  * @param oid  String oid of an item(type) to update
	  * @param effectivityCtxJsonObject JSONObject Contains EffectivityContext data
    * @param type String
	  * @exception Exception
	  * @return JSONObject  It updates the given flex object and returns the object
	  */
	public JSONObject updateEffectivityContext(String oid, String type, JSONObject effectivityCtxJsonObject) throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update effectively context initialized with oid ***** "+ oid));
		JSONObject responseObject = new JSONObject();
		EffectivityContextClientModel ecModel = new EffectivityContextClientModel();
        try{
	        ecModel.load(oid);
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(effectivityCtxJsonObject,type,FormatHelper.getObjectId(ecModel.getFlexType()));
		    AttributeValueSetter.setAllAttributes(ecModel, convertedAttrs);
		    ecModel.save();
			responseObject = util.getUpdateResponse(FormatHelper.getObjectId(ecModel.getBusinessObject()).toString(),type,responseObject);
		}catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}                

	/**
	  * This method is used to insert the EffectivityContext flex object that are  passed by using type as reference.
	  * @param type is a string 
	  * @param effectivityCtxDataList ArrayList Contains attributes, typeId, oid(if existing)
	  * @return JSONObject  It returns EffectivityContext JSON object
	  */  
    public JSONObject createEffectivityContext(String type, JSONObject effectivityCtxDataList){
    //if (LOGGER.isDebugEnabled())
        //LOGGER.debug((Object) (CLASSNAME + "***** Create effectively context initialized ***** "));
		JSONObject responseObject = new JSONObject();
		EffectivityContextClientModel ecClientModel = new EffectivityContextClientModel();
		try{
      DataConversionUtil datConUtil=new DataConversionUtil();
      Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(effectivityCtxDataList,type,(String)effectivityCtxDataList.get("typeId"));
			AttributeValueSetter.setAllAttributes(ecClientModel,convertedAttrs);
			ecClientModel.save();
      responseObject = util.getInsertResponse(FormatHelper.getObjectId(ecClientModel.getBusinessObject()).toString(),type,responseObject);
		} catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
    }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	  * This method is used either insert or update the EffectivityContext flex object that are  passed by using type as reference,
	  * @param type String 
	  * @param oid String
	  * @param payloadJson JSONObject Contains array of colors data
	  * @exception Exception
	  * @return JSONObject  It returns EffectivityContext JSON object
	  */
	public JSONObject saveOrUpdate(String type,String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"------oid------"+ oid)); 
		JSONObject responseObject = new JSONObject();
		try{
			if(oid == null){
        ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);

			 	if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
          //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling  updateEffectivityContext with criteria***** "));
					responseObject = updateEffectivityContext(list.get(2).toString(),type,payloadJson);
				} else {
           //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling  createEffectivityContext ***** "));
					responseObject = createEffectivityContext(type, payloadJson);
				}
			} else {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling  updateEffectivityContext with oid ***** "+oid));
				responseObject = updateEffectivityContext(oid,type,payloadJson);
			}
		} catch (Exception e) {
        responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

  /**
    * This method is used delete effextivity context of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
      JSONObject responseObject=new JSONObject();
      try{
      	EffectivityContext effectivityContext = (EffectivityContext) LCSQuery.findObjectById(oid);
		EffectivityContextLogic effectivityContextLogic = new EffectivityContextLogic();
		effectivityContextLogic.deleteEffectivityContext(effectivityContext);
        responseObject=util.getDeleteResponseObject("Effectivity Context",oid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** Exception on delete with oid ***** "+oid));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.foundation.EffectivityContext"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results =new EffectivityContextQuery().findEffectivityContextsByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "*****  initialized with search by name ***** "+ name));
        Collection<FlexObject> response = new EffectivityContextQuery().findEffectivityContextsByCriteria(criteria,flexType,null,null,null).getResults();
         String oid = (String) response.iterator().next().get("EFFECTIVITYCONTEXT.IDA2A2");
        oid = "OR:com.lcs.wc.foundation.EffectivityContext:"+oid;
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
        return "OR:com.lcs.wc.foundation.EffectivityContext:"+(String)flexObject.getString("EFFECTIVITYCONTEXT.IDA2A2");	
	}

	/**
	* This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return JSONObject  it returns the records that matched the given oid of this flex object
    */ 
	public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
      	JSONObject jSONObject = new JSONObject();
        EffectivityContext effectivityContextInput = (EffectivityContext) LCSQuery.findObjectById(oid);
        EffectivityContext effectivityContext = effectivityContextInput;
        try{
            effectivityContext = (EffectivityContext) VersionHelper.latestIterationOf(effectivityContextInput);
        }catch(Exception e){

        }
        jSONObject.put("oid",FormatHelper.getObjectId(effectivityContext).toString());
        jSONObject.put("createdOn",FormatHelper.applyFormat(effectivityContext.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(effectivityContext.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(effectivityContext.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(effectivityContext).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",effectivityContext.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(effectivityContext));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = effectivityContext.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	  while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(effectivityContext.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,effectivityContext.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(effectivityContext.getFlexType()));	
    }	

}