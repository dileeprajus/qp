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
package cdee.web.services.insert;

import wt.util.WTException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import cdee.web.services.GenericObjectService;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Set;
import java.util.ConcurrentModificationException;
import cdee.web.util.AppUtil;
import cdee.web.exceptions.FlexObjectNotFoundException;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class CreateFlexService{
//private static final Logger LOGGER = LogR.getLogger(CreateFlexService.class.getName());
//private static final String CLASSNAME = CreateFlexService.class.getName();

	AppUtil util = new AppUtil(); 
	/**
	* This method is used to delete the flexobject of the given oid,
	* @param oid String
	* @param type String
	* @param jsonData JSONObject
	* @exception Exception
	* @return JSONObject  It returns response  object
	*/
	public JSONObject createOrUpdateFlexObject(String type,String oid,JSONObject jsonData) throws WTException,Exception{
		//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create or Update Flex service initialized "));
		JSONObject responseJson = new JSONObject();
		try{
			JSONObject searchJsonObject = (JSONObject)jsonData.get("search");
			JSONObject payloadJsonObect = (JSONObject)jsonData.get("payload");
			if(searchJsonObject.containsKey("oid")){
				oid = (String)searchJsonObject.get("oid");
				//if (LOGGER.isDebugEnabled())
           			//LOGGER.debug((Object) (CLASSNAME + "***** Create or Update Flex service initialized with oid ***** "+oid ));
				responseJson = GenericObjectService.getModelInstance(type).saveOrUpdate(type,oid,null,payloadJsonObect);
			}else{
				responseJson = GenericObjectService.getModelInstance(type).saveOrUpdate(type,null,searchJsonObject,payloadJsonObect);
			}
		}catch(FlexObjectNotFoundException fe){
			throw fe;
		}catch(Exception e){
			responseJson = util.getExceptionJson(e.getMessage());
		}
		return responseJson;
	}
}
	  