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
package cdee.web.model.season;

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
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.season.SeasonGroupQuery;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.season.SeasonGroup;
import java.util.Collection;
import cdee.web.util.DataConversionUtil;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class SeasonGroupModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SeasonGroupModel.class.getName());
 //private static final String CLASSNAME = SeasonGroupModel.class.getName();
	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


	/**
      * This method is used either insert or update the SeasonGroup flex object that are  passed by using type as reference,
      * oid and array of different SeasonGroup data 
      * Using this method we can insert/update several records of a SeasonGroup flextype at a time.
      * @param type String 
      * @param oid String
      * @param SeasonGroupJSONArray  Contains array of SeasonGroup data
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */
    public JSONArray saveOrUpdate(String type,String oid, JSONArray jsonArray) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "-----oid-------"+ oid)); 
        JSONArray responseArray = new JSONArray();
        return responseArray;
    }

    /**
      * This method is used to insert the SeasonGroup flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SeasonGroup flextype at a time.
      * @param type is a string 
      * @param seasonGroupDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */  

    public JSONObject createSeasonGroup(String type, ArrayList seasonGroupDataList){

        return null;
    }

    /**
      * This method is used to update the SeasonGroup flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a SeasonGroup flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param seasonGroupJsonObject  Contains SeasonGroup data
      * @exception Exception
      * @return String  It returns OID of SeasonGroup object
      */

    public JSONObject updateSeasonGroup(String oid,String type, JSONObject seasonGroupJsonObject) throws Exception{
    
        return null;
    }

    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
	public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.season.SeasonGroup"); 
	}	
	


    /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
	  public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "+ objectType));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new SeasonGroupQuery().findByCriteria(criteriaMap, flexType, null, null);
        return util.getResponseFromResults(results, objectType);
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
        return "VR:com.lcs.wc.season.SeasonGroup:"+(String)flexObject.getString("SEASONGROUP.BRANCHIDITERATIONINFO"); 
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
      SeasonGroup seasonGroupInput = (SeasonGroup) LCSQuery.findObjectById(oid);
      SeasonGroup seasonGroup = seasonGroupInput;
      try{
          seasonGroup = (SeasonGroup) VersionHelper.latestIterationOf(seasonGroupInput);
      }catch(Exception e){
      }
      jSONObject.put("createdOn",FormatHelper.applyFormat(seasonGroup.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
      jSONObject.put("modifiedOn",FormatHelper.applyFormat(seasonGroup.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
      jSONObject.put("image",null);
      jSONObject.put("typeId",FormatHelper.getObjectId(seasonGroup.getFlexType()));
      jSONObject.put("oid",FormatHelper.getVersionId(seasonGroup).toString());
      jSONObject.put("ORid",FormatHelper.getObjectId(seasonGroup).toString());
      jSONObject.put("flexName",objectType);
      jSONObject.put("typeHierarchyName",seasonGroup.getFlexType().getFullNameDisplay(true));
      jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(seasonGroup));
      jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(seasonGroup));
      String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
      jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
      Collection attributes = seasonGroup.getFlexType().getAllAttributes();
      Iterator it = attributes.iterator();
      while(it.hasNext()){
        FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        String attKey = att.getAttKey();
        try{
            if(seasonGroup.getValue(attKey) == null){
              jSONObject.put(attKey,"");
            }
            else{
              jSONObject.put(attKey,seasonGroup.getValue(attKey).toString());
          }
        }catch(Exception e){
          }
    }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(seasonGroup.getFlexType()));	
  }

}