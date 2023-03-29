package com.cdee.controller;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.JSONException;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.w3c.dom.Document;

import com.cdee.IEBussinessRulesShape;
import com.cdee.controller.jsontoxsd.Jsons2XsdDefinitions;
import com.cdee.controller.jsontoxsd.Jsons2XsdDefinitions.OuterWrapping;
import com.thingworx.logging.LogUtilities;

public class DataJsonController {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);

	public JSONObject strucuredJson(JSONObject jsonResponse) {
		_logger.warn("strucuredJson...." + jsonResponse);
		JSONObject responseObject = new JSONObject();
		for (Object o : jsonResponse.keySet()) {
			String key = (String) o;
			String newKey = key;
			int seperatorIndex = key.lastIndexOf('#');
			if (seperatorIndex == -1) {
				seperatorIndex = key.lastIndexOf('/');
			}
			if (seperatorIndex != -1) {
				newKey = key.substring(seperatorIndex + 1, key.length() - 1);
			}
			if (jsonResponse.get(key).getClass().equals((new JSONObject()).getClass())) {
				JSONObject valueJson = strucuredJson((JSONObject) jsonResponse.get(key));
				if (seperatorIndex != -1) {
					valueJson.put("nameSpace", key.substring(0, seperatorIndex));
				}
				responseObject.put(newKey, valueJson);
			} else {
				responseObject.put(newKey, jsonResponse.get(key));
			}
		}
		return responseObject;
	}

	public String convertJsonToXSD(org.json.JSONObject jsonInputData) {
		String response = "";
		_logger.warn("input...." + jsonInputData);
		org.json.JSONObject jsonObject = new org.json.JSONObject();
		try {
			jsonObject = (org.json.JSONObject) jsonInputData.get("Result");
			_logger.warn("input...." + jsonObject);
			String targetNamespace = "";
			if (jsonInputData.has("@targetNamespace")) {
				targetNamespace = (String) jsonObject.get("@targetNamespace");
			}
			if (targetNamespace == null) {
				targetNamespace = "";
			}
			_logger.error((new StringReader(jsonObject.toString())).toString());
			Document xsdDocument = Jsons2XsdDefinitions.convert(new StringReader(jsonObject.toString()), targetNamespace, OuterWrapping.ELEMENT, "");
			DOMSource source = new DOMSource(xsdDocument);
			StringWriter stringWriter = new StringWriter();
			StreamResult out = new StreamResult(stringWriter);
			TransformerFactory.newInstance().newTransformer().transform(source, out);
			response = out.getWriter().toString();
		} catch (JSONException e) {
			_logger.error(e.getMessage());
		} catch (IOException e) {
			_logger.error(e.getMessage());
		} catch (TransformerConfigurationException e) {
			_logger.error(e.getMessage());
		} catch (TransformerException e) {
			_logger.error(e.getMessage());
		} catch (TransformerFactoryConfigurationError e) {
			_logger.error(e.getMessage());
		}
		return response;
	}

}
