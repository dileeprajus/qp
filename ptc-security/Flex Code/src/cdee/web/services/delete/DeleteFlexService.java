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
package cdee.web.services.delete;

import wt.util.WTException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import cdee.web.services.GenericObjectService;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Set;
import java.util.ConcurrentModificationException;
import cdee.web.util.AppUtil;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class DeleteFlexService{
//private static final Logger LOGGER = LogR.getLogger(DeleteFlexService.class.getName());
//private static final String CLASSNAME = DeleteFlexService.class.getName();
	/**
	* This method is used to delete the flexobject of the given oid,
	* @param oid String
	* @param type String
	* @exception Exception
	* @return JSONObject  It returns response  object
	*/
	public JSONObject deleteFlexObjects(String type,String oid) throws WTException,Exception{
			//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete Flex Service Initalized with type ***** "+ type +"----oid------"+ oid));
		JSONObject responseJson = new JSONObject();
		responseJson = GenericObjectService.getModelInstance(type).delete(oid);
		return responseJson;
	}
}
	  