package com.cdee.controller.xsdtojson;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;

public class Xsd2Json {
	
	
	public JSONObject convertXsd2Json(String inputXsd) throws Exception {

		DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder;
		docBuilder = docBuilderFactory.newDocumentBuilder();
		Document document = docBuilder.parse(new ByteArrayInputStream(inputXsd.getBytes()));
		NodeList nodeList = document.getChildNodes();
		Node node = nodeList.item(0);
		NamedNodeMap namedNodeMap = node.getAttributes();
		JSONObject object = new JSONObject();
		for (int j = 0; j < namedNodeMap.getLength(); j++) {
			Node tnsNode = namedNodeMap.item(j);
			object.put("@" + tnsNode.getNodeName(), tnsNode.getNodeValue());
		}
		JSONObject responseJson = new JSONObject();
		JSONParser parser = new JSONParser();
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		JsonSchemaParser schemaParser = new JsonSchemaParser();
		schemaParser.parse(new ByteArrayInputStream(inputXsd.getBytes()));
		JSRoot root = schemaParser.apply("root");
		ObjectNode json = root.toJson(objectMapper);
		String response = objectMapper.writeValueAsString(json);
		JSONObject jsonObjectResponse = (JSONObject) parser.parse(response.toString());
		if (!object.isEmpty()) {
			jsonObjectResponse = structuredJson(jsonObjectResponse, object);
		}
		for (int j = 0; j < namedNodeMap.getLength(); j++) {
			Node tnsNode = namedNodeMap.item(j);
			jsonObjectResponse.put("@" + tnsNode.getNodeName(), tnsNode.getNodeValue());
		}
		responseJson.put("result", jsonObjectResponse);
		//responseJson.put("nameSpaces", object);
		/*JSONObject responseObject = moidyJSONs(responseJson.toString());
		if ( responseObject != null) {
			return responseObject;
		}*/
		return responseJson;
	}

	private JSONObject moidyJSONs(String inputJson) {
		JSONParser parser = new JSONParser();
		try {
		   JSONObject jsonObject = (JSONObject) parser.parse(inputJson);
		   ArrayList<String> tags = new ArrayList<String>();
		   if (jsonObject.containsKey("nameSpaces")) {
			   JSONObject object = (JSONObject) jsonObject.get("nameSpaces");
			   Iterator<String> keys = (object).keySet().iterator();
			   while (keys.hasNext()) {
				   String key = keys.next();
				   if (key.contains(":")) {
					   tags.add(key.split(":")[1]);
				   }
			   }
		   }
		   if (jsonObject.containsKey("result")) {
			   JSONObject jsonResult = (JSONObject) jsonObject.get("result");
			   iterateProperties(jsonResult, null, tags);
			   return jsonObject;
		   }
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	private void iterateProperties(JSONObject object, String tag,ArrayList<String> tags) {
		if (object.containsKey("properties")) {
			JSONObject objectProp = (JSONObject) object.get("properties");
			Object[] propKeys = objectProp.keySet().toArray();
			String str = tag;
			for (int i = 0; i < propKeys.length; i++) {
				String key = (String) propKeys[i];
				if (key.contains(":")) {
					str = key.split(":")[0];
					JSONObject obj = (JSONObject) objectProp.get(key);
					iterateProperties(obj, str, tags);
				} else if (tag != null || str != null) {
					JSONObject obj = (JSONObject) objectProp.get(key);
					objectProp.put(tag + ":" + key, objectProp.remove(key));
					iterateProperties(obj, tag, tags);
				}
			}
		} else if (object.containsKey("items")) {
			JSONObject objectItems = (JSONObject) object.get("items");
			if (objectItems.containsKey("properties"))
				iterateProperties(objectItems, tag, tags);
		}
	}

	public static JSONObject structuredJson(JSONObject inputJsonObject,
			JSONObject nameSpaceobject) throws Exception {

		String response = new Gson().toJson(inputJsonObject);
		for (Object o : nameSpaceobject.keySet()) {
			String key = "";
			String value = "";
			String part1 = "";
			String part2 = "";
			String newKey = "";
			key = (String) o;
			if (key.contains("xmlns:")) {
				String[] parts = key.split(":");
				part1 = parts[0];
				part2 = parts[1];
				newKey = part2;
				value = (String) nameSpaceobject.get(key);
				response = response.replace(value + "#", newKey + ":");
				response = response.replace(value, newKey + ":");
			}
		}
		JSONObject res = (JSONObject) new JSONParser().parse(response);
		return res;
	}


	public static void main(String[] args) throws Exception {
		Xsd2Json xsd2Json = new Xsd2Json();
		String xsdInput ="";
		try {
			File file = new File("sample.xsd");
			FileReader fileReader = new FileReader(file);
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			StringBuffer stringBuffer = new StringBuffer();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuffer.append(line);
				stringBuffer.append("\n");
			}
			fileReader.close();
			xsdInput = stringBuffer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		} 
		JSONObject response = xsd2Json.convertXsd2Json(xsdInput);
		System.out.println(response);
	}

}
