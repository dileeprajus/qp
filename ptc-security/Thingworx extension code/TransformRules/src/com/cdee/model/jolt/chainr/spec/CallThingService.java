/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.script.Bindings;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;

import com.bazaarvoice.jolt.JsonUtils;
import com.cdee.model.jolt.JoltSample;
import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.Transform;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.exception.TransformException;
import com.cdee.model.jolt.modifier.function.Function;
import com.thingworx.entities.utils.ThingUtilities;
import com.thingworx.logging.LogUtilities;
import com.thingworx.things.Thing;
import com.thingworx.types.InfoTable;
import com.thingworx.types.collections.ValueCollection;

public class CallThingService implements SpecDriven, Transform {

	public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(JoltSample.class);
	
	static com.cdee.model.jolt.JoltSample joltsample = new com.cdee.model.jolt.JoltSample();
	//public static String CFCJson = joltsample.CFCInfoJson;
	static String  CFCJson = joltsample.CFCInfoJson;

	public interface WildCards {
		public static final String STAR = "*";
		public static final String OR = "|";
		public static final String ARRAY = "[]";
	}

	private final Key mapRoot;
	private final Key arrayRoot;

	/**
	 * Configure an instance of Defaultr with a spec.
	 *
	 * @throws SpecException
	 *             for a malformed spec or if there are issues
	 */
	@Inject
	public CallThingService(Object spec) {
		String rootString = "root";
		{
			Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
			rootSpec.put(rootString, spec);
			mapRoot = Key.parseSpec(rootSpec).iterator().next();
		}
		{
			Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
			rootSpec.put(rootString + WildCards.ARRAY, spec);
			Key tempKey = null;
			try {
				tempKey = Key.parseSpec(rootSpec).iterator().next();
			} catch (NumberFormatException nfe) {
			}
			arrayRoot = tempKey;
		}
	}

	/**
	 * Top level standalone Defaultr method.
	 *
	 * @param input
	 *            JSON object to have defaults applied to. This will be
	 *            modified.
	 * @return the modified input
	 */

	public Object transform(Object input) {
		if (input == null) {
			input = new HashMap();
		}
		if (input instanceof List) {
			if (arrayRoot == null) {
				throw new TransformException("The Spec provided can not handle input that is a top level Json Array.");
			}
			arrayRoot.applyChildren(input);
		} else {
			mapRoot.applyChildren(input);
		}
		return input;
	}

	// customScript(@(1,Port),'{\"mappingConfigName\":\"RemoteRestMapping-RestRemoteSource-LightSensor-RemoteRestGroup-RemoteR\",\"mappingSpecIndex\":0}'
	public static final class callEvalJS extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			joltsample = new com.cdee.model.jolt.JoltSample();
			String CFCJson = joltsample.CFCInfoJson;
			String TransactionJson = joltsample.TransactionJson;
			String MCCJson = joltsample.MCCJson;
			
			
			//System.out.println("CFCJsonJson value.....in callEvalJS....: " + CFCJson);
			Object result = null;
			Object inputObj = argList.get(0);
			String configinput = argList.get(1).toString();
			String inputDataType = "String";
			JSONParser parser = new JSONParser();
			try {
				Object configObj = parser.parse(configinput);
				JSONObject configJson = (JSONObject) configObj;
				String thingName = (String) configJson.get("mappingConfigName");
				String indexVal = (String) configJson.get("mappingSpecIndex");
				Thing thing = ThingUtilities.findThing(thingName);
				ValueCollection collection = new ValueCollection();
				collection.SetIntegerValue("index", indexVal);
				JSONObject obj = new JSONObject();
				obj.put("inputValue", inputObj);
				if(!CFCJson.equalsIgnoreCase(""))
				{
					collection.SetJSONValue("CFC", CFCJson);
				}
				if(!TransactionJson.equalsIgnoreCase(""))
				{
					collection.SetJSONValue("transactionObj", TransactionJson);
				}
				if(!MCCJson.equalsIgnoreCase(""))
				{
					collection.SetJSONValue("MCC", MCCJson);
				}
				collection.SetJSONValue("input", obj);
				InfoTable table = thing.processServiceRequest("ExecuteScritpsFromMappingConfig", collection);
				String outresult = table.getFirstRow().getStringValue("result");
				JSONObject resultJson = (JSONObject) parser.parse(outresult);
				inputDataType = (String) resultJson.get("data_type");
				result = convert(resultJson.get("value"));
			} catch (Exception e) {
				e.printStackTrace();
			}
			return Optional.<Object> of(result);
		}

		public static Optional<Object> getOptionalVal(Object value) {
			if (value == null) {
				return (Optional) Optional.empty();
			} else {
				return Optional.of(value);
			}
		}

		private static Object convert(final Object obj) {
			// _logger.error("JAVASCRIPT OBJECT: {}"+ obj.getClass());
			if (obj instanceof Bindings) {
				try {
					final Class<?> cls = Class.forName("jdk.nashorn.api.scripting.ScriptObjectMirror");
					System.out.println("Nashorn detected");
					if (cls.isAssignableFrom(obj.getClass())) {
						final Method isArray = cls.getMethod("isArray");
						final Object result = isArray.invoke(obj);
						if (result != null && result.equals(true)) {
							final Method values = cls.getMethod("values");
							final Object vals = values.invoke(obj);
							if (vals instanceof Collection<?>) {
								final Collection<?> coll = (Collection<?>) vals;
								return coll.toArray(new Object[0]);
							}
						}
					}
				} catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException
						| IllegalArgumentException | InvocationTargetException e) {
				}
			}
			if (obj instanceof List<?>) {
				final List<?> list = (List<?>) obj;
				return list.toArray(new Object[0]);
			}
			if (obj instanceof org.json.JSONArray) {
				ArrayList outputList = new ArrayList();
				org.json.JSONArray arrayresult = (org.json.JSONArray) obj;

				for (int i = 0; i < arrayresult.length(); i++) {
					try {
						outputList.add(arrayresult.get(i));
					} catch (Exception e) {
						// _logger.error("Service request failed : " +
						// e.getMessage());
						e.printStackTrace();
					}
				}

				return outputList;
			}
			return obj;
		}

	}
	

	/**
	 * getServiceapi calls remote thingworx serrvice
	 *  
	 * @param thinginfo, MCCJson, ValueJson , Current_index, delimiter
	 * 
	 * Get Current_index value key from ValueJson and send to RequestVariables
	 *            
	 * returns JSONObject.
	 */
	// =getAPIService('{\\\"ConfigName\\\":\\\"post\\\",\\\"ServiceName\\\":\\\"PullInputDataStream\\\",\\\"GroupName\\\":\\\"Posts\\\"}','{\\\"source_group_name\\\":\\\"\\\",\\\"source_config_name\\\":\\\"\\\",\\\"target_group_name\\\":\\\"\\\",\\\"target_config_name\\\":\\\"\\\",\\\"mapping_group_name\\\":\\\"\\\",\\\"mapping_config_name\\\":\\\"\\\",\\\"primary_key_at_dataprovider\\\":\\\"\\\"}',@(5,JOLT_TEMP.remoteAPI.post),@(1,_index),.schema.id)\"}}}}
	public static final class getServiceapi extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			joltsample = new com.cdee.model.jolt.JoltSample();
			String CFCJson = joltsample.CFCInfoJson;
			//_logger.warn("CFCJson value...getServiceapi......: " + CFCJson);
			StringBuilder sb = new StringBuilder("");
			Object result = null;
			String thingInfo = argList.get(0).toString();
			String mccStr = argList.get(1).toString();
			//Requestt variables argList.get(3) could be null
			
			String current_index = "";
			if(argList.get(3) != null)
			{
				current_index = argList.get(3).toString();
			}
					
			String delimeterStr = argList.get(4).toString();
			// delimeter comes in format of .schema.delimeter need to take only
			// delimete value
			String delimetrErrase = ".schema.";
			// delimeter could be undefined
			if(delimeterStr.indexOf(delimetrErrase) != -1)
			delimeterStr = delimeterStr.substring(delimeterStr.indexOf(delimetrErrase) + delimetrErrase.length());
			
			String actdelimeterStr = delimeterStr;
			String jsScript = "";
			JSONParser parser = new JSONParser();
			Object serviceObj, configObj, valueObj;

			try {
				Object arg2 = argList.get(2);
				JSONObject valJson = (JSONObject) parser.parse(JsonUtils.toJsonString(arg2));
				delimeterStr = "result." + delimeterStr;
				configObj = parser.parse(mccStr);
				JSONObject mccJson = (JSONObject) configObj;
				serviceObj = parser.parse(thingInfo);
				JSONObject ThingInfoJson = (JSONObject) serviceObj;
				
				Thing thing = ThingUtilities.findThing(ThingInfoJson.get("ConfigName").toString());
				ValueCollection collection = new ValueCollection();
				collection.SetJSONValue("MasterCreateContext", mccJson);
				if(current_index.equalsIgnoreCase(""))
				{
					collection.SetJSONValue("RequestVariables", new JSONObject());
				}
				else
				{
					collection.SetJSONValue("RequestVariables", valJson.get(current_index));
				}
					
				
				if(!CFCJson.equalsIgnoreCase(""))
				{
					collection.SetJSONValue("CFC", CFCJson);
				}
				InfoTable table = thing.processServiceRequest(ThingInfoJson.get("ServiceName").toString(), collection);
				String outresult = table.getFirstRow().getStringValue("result");
				JSONObject resultJson = (JSONObject) parser.parse(outresult);
				/*if ((actdelimeterStr.equalsIgnoreCase("RootObject")) || (actdelimeterStr.equalsIgnoreCase("undefined"))
						|| (actdelimeterStr.isEmpty())) */
				if ((actdelimeterStr.equalsIgnoreCase("RootObject")) || (actdelimeterStr.equalsIgnoreCase(".schema")) || (actdelimeterStr.equalsIgnoreCase("undefined")) || 
					          (actdelimeterStr.isEmpty())){
					resultJson = (JSONObject) resultJson.get("result");
					return Optional.<Object> of(resultJson);
				} else {
					String[] arr = delimeterStr.split("\\.");
					JSONObject object = (JSONObject) resultJson.get(arr[0]);
					for (int i = 1; i < arr.length - 1; i++) {
						object = (JSONObject) object.get(arr[i]);
					}
					Object obj = object.get(arr[arr.length - 1]);
					return Optional.<Object> of(obj);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			return Optional.<Object> of(sb.toString());
		}

	}
	
	/**
	 * initiateTrigger calls remote asynchronous thingworx serrvice
	 *  
	 * @param thinginfo, MCCJson, ValueJson , Current_index, delimiter
	 * 
	 * Get Current_index value key from ValueJson and send to RequestVariables
	 *            
	 * returns JSONObject.
	 */
	// =initiateasync(thingname,MCC,[keyjson],values..)
	public static final class initiateTrigger extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			StringBuilder sb = new StringBuilder();
			Object result = null;
			// primaryKeyValue if no value assign empty string
			String primaryKeyValue ="";
			String thingInfo = argList.get(0).toString();
			String mccStr = argList.get(1).toString();
			
			try{
				primaryKeyValue = argList.get(3).toString();
			}
			catch(Exception ex)
			{
				primaryKeyValue = "";
			}
		
			String jsScript = "";

			Object serviceObj, configObj, valueObj;

			try {
				JSONParser parser = new JSONParser();
				JSONObject valJson = (JSONObject) parser.parse(JsonUtils.toJsonString(argList.get(2)));

				configObj = parser.parse(mccStr);
				JSONObject mccJson = (JSONObject) configObj;
				//JSONObject valJson = mccJson;
				mccJson.put("primary_key_at_dataprovider", primaryKeyValue);
				serviceObj = parser.parse(thingInfo);
				JSONObject ThingInfoJson = (JSONObject) serviceObj;
				
				Thread thread = new Thread(	new com.cdee.model.jolt.chainr.spec.CallAsyncThing(valJson, mccJson, ThingInfoJson));
				thread.start();
			//	_logger.warn(">>>initiateTrigger>>>>>out of thread>>>>> ");

				// asynTriggerService(valJson,mccJson,thing, serviceName);

				// InfoTable table = thing.processServiceRequest(serviceName,
				// collection);

			} catch (Exception e) {
				_logger.warn("Service request failed : " + e.getMessage());
				e.printStackTrace();
			}

			return Optional.<Object> of(result);
		}
		
		
		public JSONObject callInternalService(JSONObject valJson, String Base64ScriptString) {
			_logger.warn("CFCJson value......callInternalService...: " + CFCJson);
			String outresult = "";
			//_logger.warn(">>>initiateTrigger>>>>> in callInternalService >>>>> " + valJson);
			Thing thing = ThingUtilities.findThing("GenericIEMasterConfig");
			ValueCollection collection = new ValueCollection();
			JSONObject resultJson = new JSONObject();
			JSONParser parser = new JSONParser();
			try {
				collection.SetStringValue("Base64ScriptString", Base64ScriptString);

				collection.SetJSONValue("RequestVariables", valJson);
			//	_logger.error("in callInternalService collection : " +collection);
				InfoTable table = thing.processServiceRequest("UpdateRequestVariablesFromScript", collection);
				outresult = table.getFirstRow().getStringValue("result");
				resultJson = (JSONObject) parser.parse(outresult);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			resultJson = (JSONObject) resultJson.get("rv");
			return resultJson;
		}

		/*
		 * public static void asynTriggerService(JSONObject valueJson,JSONObject
		 * mccJson, Thing thing,String serviceName ) { class OneShotTask
		 * implements Runnable { JSONObject valueJson,mccJson; Thing thing;
		 * String serviceName; OneShotTask(JSONObject valueJson1,JSONObject
		 * mccJson1, Thing thing1,String serviceName1) { valueJson = valueJson1;
		 * mccJson = mccJson1 ;thing =thing1; serviceName = serviceName1;}
		 * public void run() {
		 * 
		 * try { //com.thingworx.entities.utils.ThingUtilities thingutil = new
		 * com.thingworx.entities.utils.ThingUtilities(); _logger.error(
		 * ">>>asynTriggerService>>>>>thingutil>>>>> " );
		 * com.thingworx.things.Thing thing =
		 * com.thingworx.entities.utils.ThingUtilities.findThing(thingName);
		 * _logger.error(">>>asynTriggerService>>>>>thing>>>>> "+thing );
		 * 
		 * com.thingworx.types.collections.ValueCollection collection = new
		 * ValueCollection(); collection.SetJSONValue("MasterCreateContext",
		 * mccJson); collection.SetJSONValue("RequestVariables", valueJson);
		 * _logger.error(">>>asynTriggerService>>>>>ValueCollection>>>>> "
		 * +collection ); _logger.error(">>>asynTriggerService>>>>>thing>>>>> "
		 * +thing ); thing.SetRemoteServiceBinding(serviceName,
		 * serviceName,100); _logger.error(
		 * ">>>asynTriggerService>>>>>thing>>>>> "); _logger.error(
		 * ">>>asynTriggerService>>>>>GetRemoteServiceBinding>>>>> "
		 * +thing.GetRemoteServiceBinding(serviceName)); Thing thing =
		 * ThingUtilities.findThing("GenericIEMasterConfig"); InfoTable table =
		 * thing.processServiceRequest("Demo1", collection); _logger.error(
		 * ">>>asynTriggerService>>>>>before sleep>>>>> ");
		 * //Thread.sleep(2000); _logger.error(
		 * ">>>asynTriggerService>>>>>after sleep>>>>> "); } catch (Exception e)
		 * { _logger.error("Thing service not found " + e.getMessage());
		 * e.printStackTrace(); } } } Thread t = new Thread(new
		 * OneShotTask(valueJson,mccJson,thing, serviceName)); t.start(); }
		 * 
		 * public static void asynTriggerServiceOld(JSONObject
		 * valueJson,JSONObject mccJson, Thing thing,String serviceName ) {
		 * class OneShotTask implements Runnable { JSONObject valueJson,mccJson;
		 * Thing thing; String serviceName; OneShotTask(JSONObject
		 * valueJson1,JSONObject mccJson1, Thing thing1,String serviceName1) {
		 * valueJson = valueJson1; mccJson = mccJson1 ;thing =thing1;
		 * serviceName = serviceName1;} public void run() {
		 * 
		 * try { //com.thingworx.entities.utils.ThingUtilities thingutil = new
		 * com.thingworx.entities.utils.ThingUtilities(); _logger.error(
		 * ">>>asynTriggerService>>>>>thingutil>>>>> " );
		 * com.thingworx.things.Thing thing =
		 * com.thingworx.entities.utils.ThingUtilities.findThing(thingName);
		 * _logger.error(">>>asynTriggerService>>>>>thing>>>>> "+thing );
		 * 
		 * com.thingworx.types.collections.ValueCollection collection = new
		 * ValueCollection(); collection.SetJSONValue("MasterCreateContext",
		 * mccJson); collection.SetJSONValue("RequestVariables", valueJson);
		 * thing.SetRemoteServiceBinding(serviceName, serviceName,100);
		 * _logger.error(">>>asynTriggerService>>>>>thing>>>>> ");
		 * _logger.error(
		 * ">>>asynTriggerService>>>>>GetRemoteServiceBinding>>>>> "
		 * +thing.GetRemoteServiceBinding(serviceName)); Thing thing =
		 * ThingUtilities.findThing("GenericIEMasterConfig"); InfoTable table =
		 * thing.processServiceRequest("Demo1", collection); _logger.error(
		 * ">>>asynTriggerService>>>>>before sleep>>>>> ");
		 * //Thread.sleep(2000); _logger.error(
		 * ">>>asynTriggerService>>>>>after sleep>>>>> "); } catch (Exception e)
		 * { _logger.error("Thing service not found " + e.getMessage());
		 * e.printStackTrace(); } } } Thread t = new Thread(new
		 * OneShotTask(valueJson,mccJson,thing, serviceName)); t.start(); }
		 * 
		 * public static void asynTriggerServiceOld3(JSONObject
		 * valueJson,JSONObject mccJson, Thing thing,String serviceName ) {
		 * class OneShotTask implements Runnable { JSONObject valueJson,mccJson;
		 * Thing thing; String serviceName; OneShotTask(JSONObject
		 * valueJson1,JSONObject mccJson1, Thing thing1,String serviceName1) {
		 * valueJson = valueJson1; mccJson = mccJson1 ;thing =thing1;
		 * serviceName = serviceName1;} public void run() { _logger.error(
		 * ">>>asynTriggerService>>>>>thread called>>>>> " ); _logger.error(
		 * ">>>asynTriggerService>>>>>valueJson>>>>> "+valueJson );
		 * _logger.error(">>>asynTriggerService>>>>>mccJson>>>> "+mccJson );
		 * _logger.error(">>>asynTriggerService>>>>>serviceName>>>>> "
		 * +serviceName ); _logger.error(">>>asynTriggerService>>>>>thing>>>>> "
		 * +thing ); String thingName = (String) thingJson.get("ConfigName");
		 * String serviceName = (String) thingJson.get("ServiceName");
		 * _logger.error(">>>asynTriggerService>>>>>thingName>>>>> "+thingName
		 * ); _logger.error(">>>asynTriggerService>>>>>serviceName>>>>> "
		 * +serviceName ); try {
		 * 
		 * // Setting the server URL and the appkey to enable this client to //
		 * connect to the ThingWorx platform //TWX server URI // String
		 * serverURL = "https://172.16.2.98:8080/Thingworx"; String serverURL =
		 * "http://172.16.2.98:8080/Thingworx"; //Applicaton server appKey
		 * String appKey = "9f7b5de3-e435-469d-a9c9-720a72952cf6";
		 * 
		 * 
		 * // configure client ClientConfigurator config = new
		 * ClientConfigurator(); config.setUri(serverURL);
		 * config.setAppKey(appKey); config.getSecurityClaims().addClaim(appKey,
		 * appKey); _logger.info("After config.....");
		 * 
		 * // connected to client ConnectedThingClient client = new
		 * ConnectedThingClient(config, null);
		 * 
		 * 
		 * // start the client client.start(); // Async - doesn't always mean
		 * that the client has // started immediately when the method is called
		 * _logger.info("After config...start.."); ValueCollection collection =
		 * new ValueCollection(); collection.SetJSONValue("MasterCreateContext",
		 * mccJson); collection.SetJSONValue("RequestVariables", valueJson); if
		 * (client.waitForConnection(30000)) {
		 * 
		 * _logger.info("The client is now connected.");
		 * 
		 * // InfoTable result =
		 * client.readProperty(ThingworxEntityTypes.Things,
		 * "GenericIEMasterConfig","Demo1", 10000);
		 * 
		 * InfoTable result =
		 * client.invokeService(RelationshipTypes.ThingworxEntityTypes.Things,
		 * "GenericIEMasterConfig","Demo1", collection, 5000);
		 * 
		 * // Here is where you add activities such as reading // a property or
		 * invoking a service
		 * 
		 * } else {
		 * 
		 * _logger.warn("Client did not connect within 30 seconds. Exiting"); }
		 * 
		 * client.shutdown();
		 * 
		 * 
		 * } catch (Exception e) { _logger.error("Thing service not found " +
		 * e.getMessage()); e.printStackTrace(); } } } Thread t = new Thread(new
		 * OneShotTask(valueJson,mccJson,thing, serviceName)); t.start(); }
		 */
	}

}