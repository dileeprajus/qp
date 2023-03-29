
/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;

import com.google.gson.Gson;
import com.thingworx.logging.LogUtilities;
import org.json.JSONException;
import org.json.JSONObject;


public class OAuth2Service {
	public static Logger logger = LogUtilities.getInstance().getApplicationLogger(OAuth2Service.class);
	
	/**
     * getOAuth2Authentication used for request GET auth service.
     *
     * @param inputJson is a Json
     * @return JsonObject
     */
	
	public JSONObject getOAuth2Authentication(JSONObject inputJson) throws JSONException  {
		JSONObject resultJson = new JSONObject();
		JSONObject jsonObject = new JSONObject();
		logger.warn("Input jason "+inputJson);
		Map finalResp = new HashMap();
		try {
			jsonObject  = getAuthenticationMap(inputJson);
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.warn("getOAuth2Authentication finalResp Json"+jsonObject);
		
		resultJson.put("Result", jsonObject);
		return resultJson;
	}
	
	

	public static JSONObject getAuthenticationMap(JSONObject jsonObject) throws Exception{
		Map finalResp = new HashMap();
		JSONObject resultJsonObject = new JSONObject();
		String urlForOAuth = "";
		String value  = validateInput(jsonObject);
		if(value.equals("SUCCESS")){
			
			// construct URL
			String method_type = (String)jsonObject.get("method_type").toString(); // GET or POST
			
			//String current_auth_type = (String)jsonObject.get("current_auth_type"); // OAuth2
			if(method_type.equals("GET")) {
				if(jsonObject.has("auth_details")){
					urlForOAuth =  constructURL(jsonObject);
				logger.warn("Constructed URL.. "+urlForOAuth);
				JSONObject OAuthDetailsObject = (JSONObject)jsonObject.get("auth_details");
				String Auth_type = (String)OAuthDetailsObject.get("auth_type"); // BasicAuth or NoAuth
				String username = (String)OAuthDetailsObject.get("username");
				String password = (String)OAuthDetailsObject.get("password");
					if(Auth_type.equalsIgnoreCase("BasicAuth")) {
						String encodedPassowrd = encode(password);						
							//urlForOAuth =  constructURL(jsonObject);
						resultJsonObject = getOauthResponse(urlForOAuth , username , password);
							return resultJsonObject;
					}else if(Auth_type.equalsIgnoreCase("NoAuth")) {
						 	//urlForOAuth =  constructURL(jsonObject);
						resultJsonObject = getOauthResponse(urlForOAuth , username , password);
							return resultJsonObject;
					}
			}
			}
		}
		else{
			logger.warn("invalid inputs received. Please send valid inputs or received one of the input as null");
			jsonObject.put("error", value);
			return resultJsonObject;
		}
		return resultJsonObject;
	}
	
	public static String BaseAuthen(String username, String password) {
		String userPass = username+":"+password;
		return new String(Base64.encodeBase64(userPass.getBytes()));
	}

	public static String constructURLOld(JSONObject jsonObject) throws JSONException {
		String finalURL = "";
		String auth_url = "";
		if(jsonObject.has("auth_code_url"))
			auth_url = (String)jsonObject.get("auth_code_url"); 
		String client_id = "";
		if(jsonObject.has("client_id"))
			client_id = (String)jsonObject.get("client_id"); 
		String responce_type = "";
		if(jsonObject.has("response_type"))
			responce_type = (String)jsonObject.get("response_type");
		String state = "";
		if(jsonObject.has("state"))
			state=(String)jsonObject.get("state");
		String redirect_uri = "";
		if(jsonObject.has("redirect_uri"))
			redirect_uri=(String)jsonObject.get("redirect_uri"); 
		String scope = "";
		if(jsonObject.has("scope"))
			scope=(String)jsonObject.get("scope");
		
		// URL has constructed		  
		finalURL = auth_url+"?response_type="+responce_type+"&client_id="+client_id+
				  "&redirect_uri="+redirect_uri+"&scope="+scope;	
		return finalURL;
	}
	
	public static String constructURL(JSONObject jsonObject) throws JSONException {
		String finalURL = "";
		String auth_url = "";
		if(jsonObject.has("auth_code_url"))
			auth_url = (String)jsonObject.get("auth_code_url"); 
		String client_id = "";
		if(jsonObject.has("client_id"))
			client_id = (String)jsonObject.get("client_id"); 
		String responce_type = "";
		if(jsonObject.has("response_type"))
			responce_type = (String)jsonObject.get("response_type");
		String state = "";
		if(jsonObject.has("state"))
			state=(String)jsonObject.get("state");
		String redirect_uri = "";
		if(jsonObject.has("redirect_uri"))
			redirect_uri=(String)jsonObject.get("redirect_uri"); 
		String scope = "";
		if(jsonObject.has("scope"))
			scope=(String)jsonObject.get("scope");
		
		finalURL = auth_url+"?";
		
	/*	headers
		TransformationRules
		method_type
		auth_details
		auth_code_url*/
		
		Iterator keys = jsonObject.keys();
        while (keys.hasNext()) {
            String keyValue = (String) keys.next();
            String valueJson = jsonObject.get(keyValue).toString();
            if(!keyValue.equalsIgnoreCase("auth_code_url") && !keyValue.equalsIgnoreCase("headers") && !keyValue.equalsIgnoreCase("TransformationRules")&& !keyValue.equalsIgnoreCase("method_type") && !keyValue.equalsIgnoreCase("auth_details") && !keyValue.equalsIgnoreCase("auth_code_url"))
            	finalURL = finalURL +keyValue+"="+valueJson+"&";
        }
        finalURL= finalURL.substring(0,finalURL.lastIndexOf('&'));
		// URL has constructed		  
		/*finalURL = auth_url+"?response_type="+responce_type+"&client_id="+client_id+
				  "&redirect_uri="+redirect_uri+"&scope="+scope;*/	
		return finalURL;
	}

	public static String validateInput(JSONObject jsonObject) throws JSONException {
		String errorResponce = "";
		String auth_url = (String)jsonObject.get("auth_code_url"); 
		String client_id = (String)jsonObject.get("client_id"); 
		String responce_type = (String)jsonObject.get("response_type"); 
		if(!auth_url.equals("") && !responce_type.equals("") && !client_id.equals("")) {
			errorResponce = "SUCCESS";

		}else {
			logger.warn("JSON object values are null");
			errorResponce = "JSONValueNull";
		}
	
		return errorResponce;
	}
	
	public static JSONObject getOauthResponse(String requestUrl, String username, String password) throws Exception {
		Map finalMap = new HashMap();
		JSONObject jsonObject = new JSONObject();
		URL url = new URL(urlEncode(requestUrl));
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setFollowRedirects(false);
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Authorization", "Basic " + BaseAuthen(username , password));
		//Get responce code from connection object
		logger.warn("Response code : ["+connection.getResponseCode()+"]");
		if(connection.getResponseCode() != 200 && connection.getResponseCode() != 302) {
			String errorMessage = "["+connection.getResponseCode()+"] error";
			jsonObject.put("error", "responseError");
			return jsonObject;
		}
	    Map<String, List<String>> map = connection.getHeaderFields();
	    Map<String, List<String>> mapAfterRemovedNull = new HashMap<String, List<String>>();
	    for (Map.Entry<String, List<String>> entry : map.entrySet()) {
	    	//logger.warn("Final Responce Key:: : [" + entry.getKey() +"] and ,Value : [" + entry.getValue()+"]");
	    	if(entry.getKey() != null) {
	    		mapAfterRemovedNull.put(entry.getKey(), entry.getValue());
	    	}

	    }
	    BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		try {
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
		} finally {
			in.close();
		}

		jsonObject.put("headers", mapAfterRemovedNull);
		jsonObject.put("body", response);
		jsonObject.put("cookies", connection.getHeaderField("Set-Cookie"));
		    return jsonObject;
	}
	
	
//	@SuppressWarnings("static-access")
//	public static void main(String[] args) throws Exception {
//		System.out.println("at line 103...");
//		JSONParser parser = new JSONParser();
//		JSONObject jsonObject = null;
//		try {
//			Object obj = parser.parse(new FileReader("SOAPIssueJason.json"));
//			jsonObject = (JSONObject) obj;
//			System.out.println("Actaul jason object : "+jsonObject.toString());
//			
//			
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		OAuth2Client CDS = new OAuth2Client(); 
//		  CDS.getoAuth2Authentication(jsonObject);
//		 
//	}
// Main method ended
		
	public static String urlEncode(String urlStr) throws Exception {
		URL url = new URL(urlStr);
		return new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(),
				url.getQuery(), url.getRef()).toASCIIString();
	}
	public static String encode(String url)  
    {  
	       try {  
	            String encodeURL=URLEncoder.encode( url, "UTF-8" );  
	            return encodeURL;  
	       } catch (UnsupportedEncodingException e) {  
	            return "Issue while encoding" +e.getMessage();  
	       }    
    }

}

