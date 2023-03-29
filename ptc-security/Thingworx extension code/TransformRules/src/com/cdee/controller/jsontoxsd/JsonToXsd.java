package com.cdee.controller.jsontoxsd;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.w3c.dom.Document;

import com.cdee.controller.jsontoxsd.Jsons2XsdDefinitions.OuterWrapping;
import com.google.gson.Gson;


public class JsonToXsd {
	
	
	public String convertJsons2Xsd(JSONObject jsonInputData) throws Exception {
		Gson gson = new Gson();
		String response = "";
		String targetNamespace = (String)jsonInputData.get("@targetNamespace");
		if(targetNamespace == null){
			targetNamespace = "";
		}
		try {
			Document xsdDocument = Jsons2XsdDefinitions.convert(new StringReader(gson.toJson(jsonInputData)), targetNamespace, OuterWrapping.ELEMENT, "cmts");
			DOMSource source = new DOMSource(xsdDocument);
			StringWriter stringWriter = new StringWriter();
			StreamResult out = new StreamResult(stringWriter);
			TransformerFactory.newInstance().newTransformer().transform(source, out);
			response = out.getWriter().toString();
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return response;
	}
	
	public static void main(String[] args) throws Exception {
		JsonToXsd m = new JsonToXsd();
		String jsonInput = "";
		try {
			File file = new File("small.jsons");
			FileReader fileReader = new FileReader(file);
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			StringBuffer stringBuffer = new StringBuffer();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuffer.append(line);
				stringBuffer.append("\n");
			}
			fileReader.close();
			jsonInput = stringBuffer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		JSONParser parser = new JSONParser();
		JSONObject jsonResponse = (JSONObject) parser.parse(jsonInput);
		String res = m.convertJsons2Xsd(jsonResponse);
		System.out.println(res);
	}
}
