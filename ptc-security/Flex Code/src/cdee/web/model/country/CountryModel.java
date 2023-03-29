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
package cdee.web.model.country;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.country.LCSCountryClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.country.LCSCountryQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.country.LCSCountry;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import wt.util.WTException;
import com.lcs.wc.country.LCSCountryLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class CountryModel extends GenericObjectService{

    //private static final Logger LOGGER = LogR.getLogger(CountryModel.class.getName());
    //private static final String CLASSNAME = CountryModel.class.getName();

    LCSCountryQuery lcsCountryQuery = new LCSCountryQuery();
	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


	/**
	  * This method is used to update the Country flex object that are  passed by using OID as reference.
	  * @param oid   oid of an item(type) to update
      * @param type
	  * @param countryJsonObject  Contains Country data
	  * @exception Exception
	  * @return JSONObject  It returns OID of Country object
	  */
	public JSONObject updateCountry(String oid, String type, JSONObject countryJsonObject) throws Exception{
		//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Country initialized with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
		LCSCountryClientModel countryModel = new LCSCountryClientModel();
        try{
        	countryModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(countryJsonObject,type,FormatHelper.getObjectId(countryModel.getFlexType()));
		    AttributeValueSetter.setAllAttributes(countryModel, convertedAttrs);
		    countryModel.save();
			responseObject = util.getUpdateResponse(FormatHelper.getObjectId(countryModel.getBusinessObject()).toString(),type,responseObject);
		}catch(Exception e){
		}
		return responseObject;
	}                

	/**
	  * This method is used to insert the Country flex object that are  passed by using type as reference.
	  * Using this method we can insert several records of a Country flextype at a time.
	  * @param type is a string 
	  * @param countryDataList  Contains attributes, typeId, oid(if existing)
	  * @exception Exception
	  * @return JSONObject  It returns Country JSONObject object
	  */  
    
    public JSONObject createCountry(String type, JSONObject countryDataList){
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Country initialized ***** "+ type));
		JSONObject responseObject = new JSONObject();
		LCSCountryClientModel countryClientModel = new LCSCountryClientModel();
		try{
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(countryDataList,type,(String)countryDataList.get("typeId"));
			AttributeValueSetter.setAllAttributes(countryClientModel,convertedAttrs);
			countryClientModel.save();
			responseObject = util.getInsertResponse(FormatHelper.getObjectId(countryClientModel.getBusinessObject()).toString(),type,responseObject);
		} catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	  * This method is used either insert or update the Country flex object that are  passed by using type as reference,
	  * @param type String 
	  * @param oid String
	  * @param payloadJson  Contains colors data
	  * @exception Exception
	  * @return JSONObject  It returns Country JSONObject object
	  */

	public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"----oid------"+ oid)); 
       JSONObject responseObject = new JSONObject();
        try{
            if(oid == null){
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateCountry with creteria***** "));
                    responseObject=updateCountry(list.get(2).toString(),type,payloadJson);
                }else{
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createCountry ***** "));
                    responseObject=createCountry(type, payloadJson);
                }
            }else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateCountry with oid ***** "+oid));
                responseObject=updateCountry(oid,type,payloadJson);
            }
        }catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
    	return responseObject;
	}

      /**
    * This method is used delete Color of given oid,
    * @param countryOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String countryOid)throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+countryOid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSCountry lcsCountry = (LCSCountry) LCSQuery.findObjectById(countryOid);
        LCSCountryLogic countryLogic = new LCSCountryLogic();
        countryLogic.deleteCountry(lcsCountry);
        responseObject=util.getDeleteResponseObject("Country",countryOid,responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.country.LCSCountry"); 
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
        SearchResults results = new LCSCountryQuery().findCountriesByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with search by name ***** "+ name));
        Collection<FlexObject> response = lcsCountryQuery.findCountriesByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSCOUNTRY.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.country.LCSCountry:"+oid;
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
        return "VR:com.lcs.wc.country.LCSCountry:"+(String)flexObject.getString("LCSCOUNTRY.BRANCHIDITERATIONINFO");
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
        LCSCountry lcsCountryInput = (LCSCountry) LCSQuery.findObjectById(oid);
        LCSCountry lcsCountry = lcsCountryInput;
        try{
            lcsCountry = (LCSCountry) VersionHelper.latestIterationOf (lcsCountryInput);
        }catch(Exception e){

        } 
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsCountry.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsCountry.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsCountry.getFlexType()));
        jSONObject.put("flexName",objectType);
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsCountry).toString());
        jSONObject.put("oid", util.getVR(lcsCountry));
        jSONObject.put("typeHierarchyName",lcsCountry.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsCountry));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsCountry));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsCountry.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(lcsCountry.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,lcsCountry.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsCountry.getFlexType()));	
    }
  
}