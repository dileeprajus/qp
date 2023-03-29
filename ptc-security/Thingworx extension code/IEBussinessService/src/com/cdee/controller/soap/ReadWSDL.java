package com.cdee.controller.soap;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.PasswordAuthentication;
import java.net.URL;
import java.util.ArrayList;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;

import com.cdee.IEBussinessRulesShape;
import com.google.gson.Gson;
import com.thingworx.logging.LogUtilities;

public class ReadWSDL {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);

	public JSONObject readWSDLData(JSONObject inputObject) {
		String outputXML = null;
		JSONObject jsonObject = new JSONObject();
		try {
			outputXML = getWSDLServiceData(inputObject);
			jsonObject.put("result", outputXML);

		} catch (Exception e) {
			outputXML = e.getMessage();
			putValuesInJsonObject(jsonObject, e.getMessage());
		}

		return jsonObject;
	}

	/**
	 * Handle the JSON Exception while inserting value in jsonObject
	 * 
	 * @param jsonObject
	 *            the JSONObject
	 * @param message
	 *            the error message to be inserted.
	 */
	private void putValuesInJsonObject(final JSONObject jsonObject, final String message) {
		try {
			jsonObject.put("error", message);
		} catch (JSONException e) {
			_logger.error(e.getMessage());
		}
	}

	public String getWSDLServiceData(JSONObject inputObject) throws Exception {
		_logger.warn("getWSDLServiceData...." + inputObject);

		String response = "";
		Gson gson = new Gson();
		JSONParser parser = new JSONParser();
		HttpURLConnection connection = null;
		String currentMethodType = (String) inputObject.get("current_method_type").toString();
		String dataUrl = (String) inputObject.get("data_url");
		String authType = (String) inputObject.get("current_auth_type");
		String dataFormat = (String) inputObject.get("current_data_format");
		JSONObject bodyObject = (JSONObject) inputObject.get("body");
		String body = gson.toJson(bodyObject);
		if (currentMethodType.equals("GET")) {
			if (authType.equals("NoAuth")) {
				_logger.warn("In NoAuth....");
				response = callHttpConnection(dataUrl, connection, dataFormat, currentMethodType, authType, null, null,
						null);
			} else if (authType.equals("BasicAuth")) {
				_logger.warn("In BasicAuth....");
				JSONObject basicAuthDetailsObject = (JSONObject) inputObject.get("basic_auth_details");
				String username = (String) basicAuthDetailsObject.get("username");
				String password = (String) basicAuthDetailsObject.get("password");
				dataUrl = prepareUrl(dataUrl, username, password);
				response = callHttpConnection(dataUrl, connection, dataFormat, currentMethodType, authType, username,
						password, body);
			}
		} else if (currentMethodType.equals("POST")) {
			_logger.warn("In POST with authType ...." + authType);
			if (authType.equals("NoAuth")) {
				response = callHttpConnection(dataUrl, connection, dataFormat, currentMethodType, authType, null, null,
						null);
			} else if (authType.equals("BasicAuth")) {
				JSONObject basicAuthDetailsObject = (JSONObject) inputObject.get("basic_auth_details");
				String username = (String) basicAuthDetailsObject.get("username");
				String password = (String) basicAuthDetailsObject.get("password");
				dataUrl = prepareUrl(dataUrl, username, password);
				response = callHttpConnection(dataUrl, connection, dataFormat, currentMethodType, authType, username,
						password, body);
			}
		}

		inputObject = null;
		return response;
	}

	public String prepareUrl(String dataUrl, String username, String password) {
		String[] parts = dataUrl.split("://");
		String part1 = parts[0];
		String part2 = parts[1];
		dataUrl = "http://" + username + ":" + password + "@" + part2;
		return dataUrl;
	}

	public String callHttpConnection(String dataUrl, HttpURLConnection connection, String dataFormat, String methodType,
			String authType, String username, String password, String body) throws Exception {
		String response = "";
		DataOutputStream dataOutputStream = null;
		URL url = new URL(dataUrl);
		connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod(methodType);
		String USER_AGENT = "Mozilla/5.0";
		connection.setRequestProperty("User-Agent", USER_AGENT);
		// connection.setRequestProperty("Content-Type",
		// "application/"+dataFormat.toLowerCase());

		if (authType.equals("BasicAuth")) {
			Authenticator.setDefault(new Authenticator() {
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication(username, password.toCharArray());
				}
			});
		}
		connection.setDoOutput(true);
		if (methodType.equals("POST")) {
			try {
				dataOutputStream = new DataOutputStream(connection.getOutputStream());
				dataOutputStream.writeBytes(body);
			} finally {
				dataOutputStream.flush();
				dataOutputStream.close();
			}
		}
		response = gettingResponse(connection);
		return response;
	}

	public String gettingResponse(HttpURLConnection connection) throws Exception {

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
