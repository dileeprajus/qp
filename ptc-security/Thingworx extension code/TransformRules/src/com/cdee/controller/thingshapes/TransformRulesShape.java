/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.controller.thingshapes;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.cdee.model.jolt.JoltSample;
import com.cdee.util.OAuth2Service;
import com.cdee.util.RecursiveJSON;
import com.cdee.util.UtilServices;
import com.thingworx.logging.LogUtilities;
import com.thingworx.metadata.annotations.ThingworxServiceDefinition;
import com.thingworx.metadata.annotations.ThingworxServiceParameter;
import com.thingworx.metadata.annotations.ThingworxServiceResult;

public class TransformRulesShape {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(TransformRulesShape.class);

	public TransformRulesShape() {
		// TODO Auto-generated constructor stub
	}
	
	UtilServices utilService = new UtilServices();
	OAuth2Service oauthServices = new OAuth2Service();
	
	/**
	 * customTransformer handles is a transformer takes input and specification to transform data
	 * 
	 * @param inputjson
	 *            Input Json
	 * @param specjson
	 *            Specification Json
	 * @return transformed Json object
	 */

	@ThingworxServiceDefinition(name = "customTransformer", description = "", category = "Data Transformer", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject customTransformer(
			@ThingworxServiceParameter(name = "InputJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject InputJson,
			@ThingworxServiceParameter(name = "SpecJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject SpecJson,
			@ThingworxServiceParameter(name = "CFC", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject CFCJson,
			@ThingworxServiceParameter(name = "transactionObj", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject transactionObjJson,
			@ThingworxServiceParameter(name = "MCC", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject MCCJson
			
			) {
		_logger.trace("Entering Service: customTransformer");
		_logger.trace("Exiting Service: customTransformer");
		return transform(InputJson, SpecJson, CFCJson,transactionObjJson,MCCJson  );
	}

	/**
	 * Service handles as a transformer from JSON to JSON
	 * 
	 * @param inputjson
	 *            Input Json
	 * @param specjson
	 *            Specification Json
	 * @return transformed Json object
	 */

	public JSONObject transform(JSONObject inputjson, JSONObject specjson, JSONObject CFCJson, JSONObject transactionObjJson,JSONObject MCCJson) {
		//_logger.warn("CFCJson value.........: " + CFCJson);
		String stCFCJson ="";
		String sttransactionObjJson ="";
		String stMCCJson ="";
		JSONObject resultObject = new JSONObject();
		JSONArray specArray = new JSONArray();
		Object transformJson = "";
		try {
			specArray = specjson.getJSONArray("Spec");
			String stSpecJson = specArray.toString();
			String stInputJson = inputjson.toString();
			
			
			if(CFCJson.length() > 0) 
				stCFCJson = CFCJson.toString();
			//_logger.warn("stCFCJson value.........: " + stCFCJson);
			if(transactionObjJson.length() > 0) 
				sttransactionObjJson = transactionObjJson.toString();
			//_logger.warn("sttransactionObjJson value.........: " + sttransactionObjJson);
			if(MCCJson.length() > 0) 
				stMCCJson = MCCJson.toString();
			//_logger.warn("stMCCJson value.........: " + stMCCJson);
			JoltSample js = new JoltSample();
			try {
				transformJson = js.getTransformJSON(stInputJson, stSpecJson, stCFCJson, sttransactionObjJson,stMCCJson );
				resultObject.put("Result", transformJson);
			} catch (IOException e) {
				_logger.warn("Error occured while transforming JSON to JSON");
			} catch (Exception e) {
				e.printStackTrace();
				_logger.warn("Error occured while transforming JSON to JSON");
				System.out.println(e.getMessage());
			}
		//	_logger.warn("specArray...." + stSpecJson);
		//	_logger.warn("stInputJson...." + stInputJson);
		//	_logger.warn("transformJson...." + transformJson);
		//	_logger.warn("output...." + resultObject);
		//	_logger.warn("output.CFCJson..." + CFCJson);
		} catch (Exception ex) {
			_logger.error(ex.getMessage());

		}
		return resultObject;
	}

	@ThingworxServiceDefinition(name = "removeAllOccurancesOfJsonKey", description = "Removing all occurances of json key in json object", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject removeAllOccurancesOfJsonKey(
			@ThingworxServiceParameter(name = "jsonObject", description = "Json to be modified", baseType = "JSON") JSONObject jsonObject,
			@ThingworxServiceParameter(name = "jsonKey", description = "Json Key to be removed", baseType = "STRING") String jsonKey) {
		_logger.trace("Entering Service: removeAllOccurancesOfJsonKey");
		_logger.trace("Exiting Service: removeAllOccurancesOfJsonKey");
		try {
			return (new RecursiveJSON()).removeAllOccurancesOfKey(jsonObject, jsonKey);
		} catch (Exception e) {
			e.printStackTrace();
			_logger.error("Remove All Occurances Error : " + e.getCause());
			return null;
		}
	}

	@ThingworxServiceDefinition(name = "encryptionSHAH256", description = "Encrypts SHAH256", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "STRING", aspects = {})
	public String encryptionSHAH256(
			@ThingworxServiceParameter(name = "InputData", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputData) throws Exception {
		_logger.trace("Entering Service: encryptionSHAH256");
		_logger.trace("Exiting Service: encryptionSHAH256");
		return utilService.encryptSHAH(InputData);
	}

	@ThingworxServiceDefinition(name = "EncryptPwdWithKey", description = "Encrypts password with given secretKey", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "STRING", aspects = {})
	public String EncryptPwdWithKey(
			@ThingworxServiceParameter(name = "InputValue", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputValue,
			@ThingworxServiceParameter(name = "InputKey", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputKey) throws Exception {
		_logger.trace("Entering Service: EncryptPwdWithKey");
		_logger.trace("Exiting Service: EncryptPwdWithKey");
		return utilService.encrypt(InputValue,InputKey);
	}

	@ThingworxServiceDefinition(name = "DecryptPwdWithKey", description = "Decrypts given password with given key", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "STRING", aspects = {})
	public String DecryptPwdWithKey(
			@ThingworxServiceParameter(name = "EncryptValue", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String EncryptValue,
			@ThingworxServiceParameter(name = "InputKey", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputKey) throws Exception {
		_logger.trace("Entering Service: DecryptPwdWithKey");
		_logger.trace("Exiting Service: DecryptPwdWithKey");
		return utilService.decrypt(EncryptValue,InputKey);
	}

	@ThingworxServiceDefinition(name = "GetOAuth2Authentication", description = "getOAuth2Authentication", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetOAuth2Authentication(
			@ThingworxServiceParameter(name = "InputJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject InputJson)throws Exception {
		_logger.trace("Entering Service: GetOAuth2Authentication");
		_logger.trace("Exiting Service: GetOAuth2Authentication");
		return oauthServices.getOAuth2Authentication(InputJson);
	}
	
	

}
