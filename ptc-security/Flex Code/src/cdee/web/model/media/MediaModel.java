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
package cdee.web.model.media;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.media.LCSMediaClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.media.LCSMediaQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.media.LCSMedia;
import wt.util.WTException;
import com.lcs.wc.media.LCSMediaLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class MediaModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(MediaModel.class.getName());
 //private static final String CLASSNAME = MediaModel.class.getName();
	AppUtil util = new AppUtil();

	/**
	  * This method is used to update the Media flex object that are  passed by using OID as reference.
	  * @param oid   oid of an item(type) to update
      * @param type
	  * @param mediaJsonObject  Contains Media data
	  * @exception Exception
	  * @return JSONObject  It returns of Media object
	  */
	public JSONObject updateMedia(String oid,String type, JSONObject mediaJsonObject) throws Exception{
		   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Media ***** "+ oid));
        JSONObject responseObject = new JSONObject();
		LCSMediaClientModel mediaClientModel = new LCSMediaClientModel();
        try{
	        mediaClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(mediaJsonObject,type,FormatHelper.getObjectId(mediaClientModel.getFlexType()));
		    AttributeValueSetter.setAllAttributes(mediaClientModel, convertedAttrs);
		    mediaClientModel.save();
			responseObject = util.getUpdateResponse(FormatHelper.getVersionId(mediaClientModel.getBusinessObject()).toString(),type,responseObject);
		}catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}                

	/**
	  * This method is used to insert the Media flex object that are  passed by using type as reference.
	  * @param type is a string 
	  * @param mediaDataList  Contains attributes, typeId, oid(if existing)
	  * @exception Exception
	  * @return JSONObject  It returns Last JSONObject object
	  */  
    public JSONObject createMedia(String type, JSONObject mediaDataList){
		   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Media  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
		LCSMediaClientModel mediaClientModel = new LCSMediaClientModel();
		try{
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(mediaDataList,type,(String)mediaDataList.get("typeId"));
			AttributeValueSetter.setAllAttributes(mediaClientModel,convertedAttrs);
			mediaClientModel.save();
			responseObject = util.getInsertResponse(FormatHelper.getVersionId(mediaClientModel.getBusinessObject()).toString(),type,responseObject);
		} catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	  * This method is used either insert or update the Media flex object that are  passed by using type as reference,
	  * @param type String 
	  * @param oid String
	  * @param mediaJsonData  Contains of media data
	  * @exception Exception
	  * @return JSONObject  It returns Media JSONObject object
	  */
	public JSONObject saveOrUpdate(String type,String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
			    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "-----oid------"+ oid)); 
            JSONObject responseObject = new JSONObject();
			try{
				
				if(oid == null){
                    ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
				 	if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMedia with criteria ***** "));
						responseObject = updateMedia(list.get(2).toString(),type,payloadJson);
					} else {
            //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createMedia with criteria ***** "));
						responseObject = createMedia(type, payloadJson);
					}
				} else {
          //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMedia with oid ***** "));
					responseObject = updateMedia(oid,type,payloadJson);
				}
			} catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
			}
		return responseObject;
	}

	/**
    * This method is used delete Media of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid***** "+oid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSMedia lcsMedia= (LCSMedia) LCSQuery.findObjectById(oid);
		LCSMediaLogic lcsMediaLogic = new LCSMediaLogic();
		lcsMediaLogic.deleteMedia(lcsMedia);
        responseObject=util.getDeleteResponseObject("Media",oid,responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.media.LCSMedia"); 
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
        SearchResults results = new LCSMediaQuery().findMediaByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name ***** "+ name));
        Collection<FlexObject> response = new LCSMediaQuery().findMediaByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSMEDIA.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.media.LCSMedia:"+oid;
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
        return "VR:com.lcs.wc.media.LCSMedia:"+(String)flexObject.getString("LCSMEDIA.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid));
      	JSONObject jSONObject = new JSONObject();
        LCSMedia lcsMediaInput = (LCSMedia) LCSQuery.findObjectById(oid);
        LCSMedia lcsMedia = lcsMediaInput;
        try{
            lcsMedia = (LCSMedia) VersionHelper.latestIterationOf (lcsMediaInput);
        }catch(Exception e){
            
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsMedia.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsMedia.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsMedia.getFlexType()));
        jSONObject.put("oid", util.getVR(lcsMedia));
        //jSONObject.put("oid",FormatHelper.getVersionId(lcsMedia).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsMedia).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsMedia.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsMedia));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsMedia));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsMedia.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(lcsMedia.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,lcsMedia.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMedia.getFlexType()));	
    }

}