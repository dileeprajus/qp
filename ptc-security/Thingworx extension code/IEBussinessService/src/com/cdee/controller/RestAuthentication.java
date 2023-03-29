package com.cdee.controller;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.google.gson.Gson;

public class RestAuthentication {
	
	Gson gson = new Gson();
	DataOutputStream dataOutputStream = null;
	HttpURLConnection connection = null;
	JSONParser parser = new JSONParser();
	
	public String refreshToken(JSONObject configJsonObject,JSONObject accessTokenDetails)throws Exception {

		Gson gson = new Gson();
		HttpURLConnection connection = null;
		JSONParser parser = new JSONParser();
		String refreshToken = (String) accessTokenDetails.get("refresh_token");
		String dataFormat = (String) configJsonObject.get("current_data_format");
		JSONObject oauthdeatils = (JSONObject) configJsonObject.get("oauth_details");
		String authUrl = (String) oauthdeatils.get("auth_url");
		String accessTokenUrl = (String) oauthdeatils.get("access_token_url");
		String baseUrl = authUrl + accessTokenUrl;
		String queryParams = "";
		for (Object o : oauthdeatils.keySet()) {
			String key = (String) o;
			String value = (String) oauthdeatils.get(key);
			if (!(key.contains("auth_url") || key.contains("access_token_url") || key.contains("username") || key.contains("password") || key.contains("grant_type"))) {
				queryParams = queryParams + key + "=" + value + "&";
			}
		}
		String Url = baseUrl + "?grant_type=refresh_token&refresh_token="+ refreshToken + "&" + queryParams.substring(0, queryParams.length() - 1);
		String response = getHttpConncetion(Url,connection,dataFormat);
		JSONObject refreshTokenObject = (JSONObject) parser.parse(response.toString());
		configJsonObject.put("oauth_token_data",refreshTokenObject);
		String refreshTokenResponse = gson.toJson(configJsonObject);
		try{
			//me.ConfigJson = configJsonObject------------>TODO
			FileWriter fw = new FileWriter("config.json");
			fw.write(refreshTokenResponse);
			fw.close();
		}catch (Exception e) {
			System.out.println(e);
		} 
		return refreshTokenResponse;
	}
	
	
	public JSONObject getAccessTokenInfo(JSONObject inpustJsonObject) throws Exception{
		
		String queryParams = "";
		String authUrl = (String) inpustJsonObject.get("auth_url");
		String accessTokenUrl = (String) inpustJsonObject.get("access_token_url");
		String baseUrl = authUrl + accessTokenUrl;
		for (Object o : inpustJsonObject.keySet()) {
			String key = (String) o;
			String value = (String) inpustJsonObject.get(key);
			if (!(key.contains("auth_url") || key.contains("access_token_url"))) {
				queryParams = queryParams + key + "=" + value + "&";
			}
		}
		String dataUrl = baseUrl + "?" + queryParams.substring(0, queryParams.length() - 1);
		String response = getHttpConncetion(dataUrl,connection,null);
		JSONObject tokenDetailsObject = (JSONObject) parser.parse(response.toString());
		return tokenDetailsObject;
	}

	public String getOAuthtokenData(Map headersMap,Map queryParamsMap,String body,String configJsonResponse) throws Exception {
		String res ="";
		JSONObject configJsonObject = (JSONObject) parser.parse(configJsonResponse);
		String authType = (String) configJsonObject.get("current_auth_type");
		if (authType.equals("OAuth")) {
			String queryParams = "";
				for(Object o:queryParamsMap.keySet()) {
				    String key = (String) o;
				    String value = (String)queryParamsMap.get(key);
				    queryParams = queryParams+key+"="+value+"&";
				}
			
			String 	dataUrl = (String)configJsonObject.get("data_url");
			String methodType = (String) configJsonObject.get("current_method_type");
			String dataFormat = (String) configJsonObject.get("current_data_format");
			JSONObject accessTokenDetails = (JSONObject)configJsonObject.get("oauth_token_data");
			String accessToken = (String) accessTokenDetails.get("access_token");
			String data_Url = dataUrl + "?" + "access_token" + "=" + accessToken;
			System.out.println(data_Url);
			if(queryParamsMap.size() != 0){
				dataUrl = dataUrl+"&"+queryParams.substring(0, queryParams.length()-1);
			}
			URL obj = new URL(data_Url);
			connection = (HttpURLConnection) obj.openConnection();
			connection.setRequestMethod(methodType);
			String USER_AGENT = "Mozilla/5.0";
			connection.setRequestProperty("User-Agent", USER_AGENT);
			connection.setRequestProperty("Content-Type", "application/"+ dataFormat.toLowerCase());
			for(Object o :headersMap.keySet()){
				String key = (String)o;
				connection.setRequestProperty(key,(String)headersMap.get(key));
			}
			if(methodType == "POST"){
				try{
					dataOutputStream = new DataOutputStream(connection.getOutputStream());
					dataOutputStream.writeBytes(body);
				}finally{
					dataOutputStream.flush();
					dataOutputStream.close();
				}
			}
			connection.setDoOutput(true);
			if (connection.getResponseCode() == 401) {
				String refreshTokenConfigResponse = refreshToken(configJsonObject, accessTokenDetails);
				res = getOAuthtokenData(headersMap,queryParamsMap,body,refreshTokenConfigResponse);
			} else {
				BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String inputLine;
				try {
					StringBuffer response = new StringBuffer();
					while ((inputLine = in.readLine()) != null) {
						response.append(inputLine);
					}
					res = response.toString();
				} finally {
					in.close();
				}
			}
		}
		return res;
	}
	
	
	
	public String getHttpConncetion(String dataUrl,HttpURLConnection connection,String dataFormat) throws Exception{
		URL obj1 = new URL(dataUrl);
		connection = (HttpURLConnection) obj1.openConnection();
		connection.setRequestMethod("POST");
		String USER_AGENT = "Mozilla/5.0";
		connection.setRequestProperty("User-Agent", USER_AGENT);
		//connection.setRequestProperty("Content-Type", "application/"+ dataFormat.toLowerCase());
		connection.setDoOutput(true);
		String response = gettingResponse(connection);
		return response;
	}
	
	
	public String gettingResponse(HttpURLConnection connection) throws Exception{
		
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
		return response.toString();
	}
	
}
