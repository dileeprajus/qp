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
import com.thingworx.persistence.TransactionFactory;
import com.thingworx.security.context.SecurityContext;
import com.thingworx.things.Thing;
import com.thingworx.types.InfoTable;
import com.thingworx.types.collections.ValueCollection;
import com.thingworx.types.primitives.StringPrimitive;
import com.thingworx.webservices.context.ThreadLocalContext;

public class CallAsyncThing implements Runnable {
	JSONObject valueJson, mccJson,  thingJson;
	
	
	/**
	 * CallAsyncThing implements Thread to execute service asynchronous
	 */
	
	CallAsyncThing(JSONObject valueJsonInput,JSONObject mccJsonInput, JSONObject thingJsonInput)
	{
		valueJson = valueJsonInput;
		mccJson = mccJsonInput;
		thingJson = thingJsonInput;
		
	}
	public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(JoltSample.class);
	
	/**
	 * run calls thing service as asynchronous  

	 */
	
	public void run() {
		ValueCollection collection = new ValueCollection();

		try {
			//Thread.sleep(6000);
			_logger.warn(">>>CallAsyncThing>>after sleep>>>>>>>> ");
			//As code that executes outside of a request or in a separate thread, it is necessary to create your own transaction
			TransactionFactory.beginTransactionRequired();
			ThreadLocalContext.setSecurityContext(SecurityContext.createSuperUserContext());
			collection.SetJSONValue("MasterCreateContext", mccJson);
			collection.SetJSONValue("RequestVariables", valueJson);
			_logger.warn(">>>CallAsyncThing>>>>>ThingInfoJson>>>>> " + thingJson);
			String thingName = (String) thingJson.get("ConfigName");
			String serviceName = (String) thingJson.get("ServiceName");
			Thing thing = (Thing) ThingUtilities.findThing(thingName);
			ThreadLocalContext.setTransactionSuccess(true);
			_logger.warn(">>>CallAsyncThing>>>>>thing>>>>> " + thing);
			InfoTable table = thing.processServiceRequest(serviceName, collection);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			_logger.warn(">>>CallAsyncThing>>>>>error>>>>> " + e);
			ThreadLocalContext.setTransactionSuccess(false);
			TransactionFactory.failure();
		} finally {
			TransactionFactory.endTransactionRequired();
		}

	}
	


}
