/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import org.json.simple.JSONObject;
import org.slf4j.Logger;

import com.cdee.model.jolt.JoltSample;
import com.thingworx.entities.utils.ThingUtilities;
//import com.thingworx.entities.utils.ThingUtilities;
import com.thingworx.logging.LogUtilities;
import com.thingworx.things.Thing;
import com.thingworx.types.InfoTable;
import com.thingworx.types.collections.ValueCollection;

public class CallSyncThing  {
	JSONObject valueJson, mccJson,  thingJson;
	
	
	CallSyncThing(JSONObject valueJsonInput,JSONObject mccJsonInput, JSONObject thingJsonInput)
	{
		valueJson = valueJsonInput;
		mccJson = mccJsonInput;
		thingJson = thingJsonInput;
		
	}
	public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(JoltSample.class);
	
	 public void asynTriggerServiceCall() {
		 _logger.error(">>>CallSyncThing>>>>>>>>>> "  );
		 ValueCollection collection = new ValueCollection();
		 
			try {
				Thread.sleep(6000);
				 _logger.error(">>>CallSyncThing>>after sleep>>>>>>>> "  );
				collection.SetJSONValue("MasterCreateContext", mccJson);
				collection.SetJSONValue("RequestVariables", valueJson);
				_logger.error(">>>CallSyncThing>>>>>ThingInfoJson>>>>> " + thingJson);
				String thingName = (String) thingJson.get("ConfigName");
				String serviceName = (String) thingJson.get("ServiceName");
				Thing thing = ThingUtilities.findThing(thingName);
				_logger.error(">>>CallSyncThing>>>>>thing>>>>> " + thing);
				InfoTable table = thing.processServiceRequest(serviceName, collection);
				_logger.error(">>>CallSyncThing>>>>>after initiation>>>>> "+table );
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				_logger.error(">>>CallSyncThing>>>>>error>>>>> " + e);
			}
			
		 
		 
	 }
	
	public static void asynTriggerService(JSONObject valueJson,JSONObject mccJson, JSONObject thingJson ) {
		_logger.error(">>>CallAsyncThing>>>>>thread called>>>>> " );
		String thingName = (String) thingJson.get("ConfigName");
		String serviceName = (String) thingJson.get("ServiceName");
		_logger.error(">>>CallAsyncThing>>>>>thingName>>>>> "+thingName );
		_logger.error(">>>CallAsyncThing>>>>>serviceName>>>>> "+serviceName );
		try {
			com.thingworx.entities.utils.ThingUtilities thingutil = new com.thingworx.entities.utils.ThingUtilities();
			_logger.error(">>>CallAsyncThing>>>>>thingutil>>>>> "+thingutil );
			com.thingworx.things.Thing thing = thingutil.findThing(thingName);
			_logger.error(">>>CallAsyncThing>>>>>thing>>>>> "+thing );

			com.thingworx.types.collections.ValueCollection collection = new ValueCollection();
			collection.SetJSONValue("MasterCreateContext", mccJson);
			collection.SetJSONValue("RequestVariables", valueJson);
			_logger.error(">>>CallAsyncThing>>>>>ValueCollection>>>>> "+collection );
			_logger.error(">>>initiateTrigger>>>>>serviceName>>>>> "+serviceName );
			_logger.error(">>>initiateTrigger>>>>>thing>>>>> "+thing );
			InfoTable table = thing.processServiceRequest(serviceName, collection);
			_logger.error(">>>initiateTrigger>>>>>before sleep>>>>> ");
			Thread.sleep(2000);
			_logger.error(">>>initiateTrigger>>>>>after sleep>>>>> ");
		} catch (Exception e) {
			 _logger.error("Thing service not found " + e.getMessage());
			e.printStackTrace();
		}
	}

}
