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
package cdee.web.services.update;

import com.lcs.wc.flextype.FlexTypeCache;
import javax.ws.rs.core.Response;
import javax.ws.rs.Produces;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import wt.util.WTException;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import java.util.Map;
import java.util.HashMap;
import cdee.web.util.AppUtil;
import cdee.web.services.GenericObjectService;
import cdee.web.exceptions.*;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class UpdateFlexService{
//private static final Logger LOGGER = LogR.getLogger(UpdateFlexService.class.getName());
//private static final String CLASSNAME = UpdateFlexService.class.getName();

		AppUtil util = new AppUtil();


/**
  * This method is used to update the flext objects that are  passed by using OID as reference.
  * Using this method we can update several records of a particular flextype at a time.
  * @param oid   oid of an item(type) to update
  * @param flextype  To check what type of flex object we are working with to update its data.
  * @param inputData This contains data that is passing from Rest service in the form of a string 
  * @exception WTException
  * @return JsonArray 
  */
	public JSONObject updateFlexObjects(String oid,String flexType,String inputData) throws FlexTypeNotFoundException,FlexObjectNotFoundException,WTException{
		//if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update flex objects service initialized with oid***** "+ oid + "---flexType-----"+ flexType));
		JSONObject jsonObject=new JSONObject();
		JSONObject responseObject=new JSONObject();
			try{
				if(flexType!=null){
					jsonObject=convertStringToJSONObject(inputData);
					responseObject = GenericObjectService.getModelInstance(flexType).saveOrUpdate(flexType,oid,null,jsonObject);
					/*if(responseObject.containsKey("status"))
					{
						String statusVal = (String)responseObject.get("status");
						if(statusVal.equalsIgnoreCase("Success"))
							responseObject=util.getUpdateResponse(oid, flexType, responseObject);
					}*/
				}else{
					throw new FlexTypeNotFoundException("please enter a flexType");
				}
			}catch(FlexObjectNotFoundException fe){
				throw fe;
			}catch(Exception e){
				responseObject = util.getExceptionJson(e.getMessage());
			}
     		return responseObject;
	}

	@Produces("application/json")
	private static JSONObject convertStringToJSONObject(String inputData){
	  //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Convert string to JSON Object initialized with inputData ***** "+ inputData));
	    JSONParser parser = new JSONParser();
	    JSONObject jsonObject = new JSONObject();
	    Map<String,Object> attributesMap = new HashMap<String,Object>();
	    try{
	        jsonObject = (JSONObject)parser.parse(inputData);
	    }catch(Exception e){
	        Response.status(400).entity("'Message':'Bad Request'").build();
	    }
	    return jsonObject;
	}	

    
}
	  
	   