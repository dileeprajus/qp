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
package cdee.web.model.last;

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
import com.lcs.wc.last.LCSLastQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.last.LCSLast;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import wt.util.WTException;
import com.lcs.wc.last.LCSLastLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class LastModel extends GenericObjectService{
    //private static final Logger LOGGER = LogR.getLogger(LastModel.class.getName());
    //private static final String CLASSNAME = LastModel.class.getName();
    LCSLastQuery lcsLastQuery=new LCSLastQuery();
	AppUtil util = new AppUtil();
 	Gson gson= new Gson();

	/**
	  * This method is used to update the EffectivityContext flex object that are  passed by using OID as reference.
	  * Using this method we can update several records of a EffectivityContext flextype at a time.
	  * @param oid   oid of an item(type) to update
	  * @param effectivityCtxJsonObject  Contains EffectivityContext data
	  * @exception Exception
	  * @return String  It returns OID of EffectivityContext object
	  */
	public JSONObject updateLast(String oid, String type, JSONObject lastJsonObject) throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Last initialized with oid ***** "+ oid));
		JSONObject responseObject = new JSONObject();
		LCSLastClientModel lastClientModel = new LCSLastClientModel();
        try{
	        lastClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(lastJsonObject,type,FormatHelper.getObjectId(lastClientModel.getFlexType()));
		    AttributeValueSetter.setAllAttributes(lastClientModel, convertedAttrs);
		    lastClientModel.save();
			responseObject = util.getUpdateResponse(FormatHelper.getVersionId(lastClientModel.getBusinessObject()).toString(),type,responseObject);
		}catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}               

	/**
	  * This method is used to insert the Last flex object that are  passed by using type as reference.
	  * Using this method we can insert a single Last flextype at a time.
	  * @param type is a string 
	  * @param lastDataList  Contains attributes, typeId, oid(if existing)
	  * @exception Exception
	  * @return JSONArray  It returns Last JSONArray object
	  */  
    public JSONObject createLast(String type, JSONObject lastDataList){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Last initialized ***** "+ type));
		JSONObject responseObject = new JSONObject();
		LCSLastClientModel lastClientModel = new LCSLastClientModel();
		try{
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(lastDataList,type,(String)lastDataList.get("typeId"));
			AttributeValueSetter.setAllAttributes(lastClientModel,convertedAttrs);
			lastClientModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getVersionId(lastClientModel.getBusinessObject()).toString(),type,responseObject);
		}catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	  /**
    * This method is used delete Last of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
      JSONObject responseObject=new JSONObject();
      try{
      	LCSLast lcsLast = (LCSLast) LCSQuery.findObjectById(oid);
		LCSLastLogic lastLogic = new LCSLastLogic();
		lastLogic.deleteLast(lcsLast);
        responseObject=util.getDeleteResponseObject("Last",oid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Exception on delte with  ***** "+wte.getMessage()));
        responseObject=util.getExceptionJson(wte.getMessage());
      }
      return responseObject;
    }

	/**
	  * This method is used either insert or update the Last flex object that are  passed by using type as reference,
	  * oid and array of different Last data 
	  * @param type String 
	  * @param oid String
	  * @param payloadJson   data
	  * @exception Exception
	  * @return JSONObject  It returns Last JSONObject object
	  */

	public JSONObject saveOrUpdate(String type,String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type + "----oid------"+ oid)); 
			JSONObject responseObject = new JSONObject();
			try{
				
				if(oid == null){
                    ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
				 	if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
           //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateLast with creteria***** "));
						responseObject = updateLast(list.get(2).toString(),type,payloadJson);
					} else {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createLast ***** "));
						responseObject = createLast(type, payloadJson);
					}
				} else {
        
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateLast with oid ***** "+oid));
					responseObject = updateLast(oid,type,payloadJson);
				}
			} catch (Exception e) {
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.last.LCSLast"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized by get Records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results =  new LCSLastQuery().findLastsByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "*****  initialized  with search by name ***** "+ name));
        Collection<FlexObject> response = lcsLastQuery.findLastsByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSLAST.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.last.LCSLast:"+oid;
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
        return "VR:com.lcs.wc.last.LCSLast:"+(String)flexObject.getString("LCSLAST.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
      	JSONObject jSONObject = new JSONObject();
        LCSLast lcsLastInput = (LCSLast) LCSQuery.findObjectById(oid);
        LCSLast lcsLast = lcsLastInput;
        //if(obj instanceof RevisionControlled)
        try{
            lcsLast = (LCSLast) VersionHelper.latestIterationOf(lcsLastInput);
        } catch(Exception e){
            
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsLast.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsLast.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsLast.getFlexType()));
        jSONObject.put("oid", util.getVR(lcsLast));
        //jSONObject.put("oid",FormatHelper.getVersionId(lcsLast).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsLast).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsLast.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsLast));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsLast));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsLast.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(lcsLast.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,lcsLast.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
     	DataConversionUtil datConUtil=new DataConversionUtil();
        
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsLast.getFlexType()));	
    }
}