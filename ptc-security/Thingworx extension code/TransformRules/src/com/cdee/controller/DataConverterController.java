package com.cdee.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
//import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
//import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stax.StAXSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
//import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
//import org.w3c.dom.Document;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.bazaarvoice.jolt.Chainr;
import com.bazaarvoice.jolt.JsonUtils;
import com.cdee.IEBussinessRulesShape;
import com.cdee.controller.xsdtojson.Xsd2Json;
//import com.ethlo.schematools.jsons2xsd.Jsons2Xsd;
//import com.google.gson.Gson;
import com.thingworx.logging.LogUtilities;

import de.odysseus.staxon.json.JsonXMLConfig;
import de.odysseus.staxon.json.JsonXMLConfigBuilder;
import de.odysseus.staxon.json.JsonXMLInputFactory;
import de.odysseus.staxon.json.JsonXMLOutputFactory;

public class DataConverterController {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);
	DataJsonController datajsonController = new DataJsonController();

	/**
	 * Handle as a converter from Json object to xml
	 * 
	 * @param json
	 *            Json object input
	 * @param outputXML
	 *            returns XML.
	 */
	public String convertJsontoXml(JSONObject json) {

		String outputXML = null;
		try {
			modifyAttributesForColon(json);

			InputStream input = new ByteArrayInputStream(json.toString().getBytes());
			JsonXMLConfig config = new JsonXMLConfigBuilder().multiplePI(false).build();

			XMLStreamReader reader = new JsonXMLInputFactory(config).createXMLStreamReader(input);
			Source source = new StAXSource(reader);
			StringWriter stringWriter = new StringWriter();
			StreamResult out = new StreamResult(stringWriter);
			TransformerFactory.newInstance().newTransformer().transform(source, out);
			outputXML = modifyXML(replaceSpecialCharacters(out.getWriter().toString()));
			
		} catch (Exception e) {
			e.printStackTrace();
			_logger.warn("Exception...." + e);
		}
		_logger.warn("input...." + json);
		_logger.warn("outputXML...." + outputXML);
		return outputXML;
	}

	/**
	 * Replace special characters with the colon 
	 * @param xmlstring
	 * @return
	 */
	public String replaceSpecialCharacters(String xmlstring) {
		if (xmlstring != null) {
			xmlstring = xmlstring.replaceAll("__\\*", ":");
		}
		return xmlstring;
	}

	/**
	 * Replace the @ and colon with special characters string
	 * @param inputObject
	 * @return
	 * @throws JSONException
	 */
	public JSONObject modifyAttributesForColon(JSONObject inputObject) throws JSONException {
		List<Object> propKeys = getKeys(inputObject);
		for (int i = 0; i < propKeys.size(); i++) {
			String key = (String) propKeys.get(i);
			Object object = inputObject.get(key);
			if (key.contains("@")) {
				String x = key;
				try {
					inputObject.put(x.replace("@", "abcxwsq").replace(":", "__*"), inputObject.remove(key));
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			if (key.contains(":")) {
				try {
					inputObject.put(key.replace(":", "__*"), inputObject.remove(key));
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			if (object instanceof JSONObject) {
				modifyAttributesForColon((JSONObject) object);
			}
		}
		return inputObject;
	}

	public List<Object> getKeys(JSONObject object) {
		List<Object> propKeys = new ArrayList<>();
		object.keys().forEachRemaining(propKeys::add);
		return propKeys;
	}
	
	/**
	 * Set the attributes properly in the string
	 * @param xmlString
	 * @return
	 */
	public String modifyXML(String xmlString) {
		try {
		      DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		      DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
		      InputSource is = new InputSource();
		      is.setCharacterStream(new StringReader(xmlString));
		      Document doc = docBuilder.parse(is);
		      XPathFactory xpathFactory = XPathFactory.newInstance();
		      XPath xpath = xpathFactory.newXPath();
		      XPathExpression expr =  xpath.compile("//*[starts-with(name(), 'abcxwsq')]");
		      NodeList nodes = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		      for (int i = 0; i < nodes.getLength(); i++) {
		    	  Node currentNode = nodes.item(i);
		          Node parentNode = currentNode.getParentNode();
		          ((Element)parentNode).setAttribute(currentNode.getNodeName().split("abcxwsq")[1],currentNode.getTextContent());
		          parentNode.removeChild(currentNode);
		      }
		
		      TransformerFactory transformerFactory = TransformerFactory.newInstance();
		      Transformer transformer = transformerFactory.newTransformer();
		      DOMSource source = new DOMSource(doc);
		      StreamResult result = new StreamResult(new StringWriter());
		      transformer.transform(source, result);
		      String finalRes = result.getWriter().toString();
		      return finalRes;
		 } catch (ParserConfigurationException pce) {
			 pce.printStackTrace();
		 } catch (TransformerException tfe) {
			 tfe.printStackTrace();
		 } catch (IOException ioe) {
			 ioe.printStackTrace();
		 } catch (SAXException sae) {
			 sae.printStackTrace();
		 } catch (XPathExpressionException e) {
			 e.printStackTrace();
		 }
		return xmlString;
	}

	/**
	 * Handle as a converter from xml to Json object
	 * 
	 * @param inputXML
	 *            XML input
	 * @param outputJson
	 *            returns JsonObject.
	 */

	public JSONObject convertXmltoJson(String inputXML) {
		JSONObject outputJson = null;
		try {
		XMLStreamReader input = XMLInputFactory.newInstance().createXMLStreamReader(new StringReader(inputXML));
		//InputStream input = new ByteArrayInputStream(inputXML.getBytes());
		
		JsonXMLConfig config = new JsonXMLConfigBuilder().autoArray(true).autoPrimitive(true).prettyPrint(true).build();
		
			StringWriter stringWriter = new StringWriter();
			StreamResult out = new StreamResult(stringWriter);
			XMLEventReader reader = XMLInputFactory.newInstance().createXMLEventReader(input);
			new JsonXMLOutputFactory(config).createXMLEventWriter(out).add(reader);
			outputJson = new JSONObject(out.getWriter().toString());

			// reader.close();
		} catch (Exception e) {
			_logger.warn("Exception...." + e);
			e.printStackTrace();
		}
		_logger.warn("inputXML...." + inputXML);
		_logger.warn("outputJson...." + outputJson);
		return outputJson;
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

	public JSONObject dataTransformer(JSONObject inputjson, JSONObject specjson) {
		JSONObject resultObject = new JSONObject();
		JSONArray specArray = new JSONArray();
		String transformJson = "";
		try {
			specArray = specjson.getJSONArray("Spec");
			String stSpecJson = specArray.toString();
			String stInputJson = inputjson.toString();
			// String inputjson1 = "{\"statistics\": [{\"id\": \"A\",\"min\":
			// \"2.0\",\"max\": \"10.0\",\"avg\": \"7.9\"},{\"min\":
			// \"6\",\"max\": \"6\",\"avg\": \"6\"},{\"id\": \"C\"}]}";
			// String specjson1 = "[{\"operation\":
			// \"modify-overwrite-beta\",\"spec\": {\"statistics\": {\"*\":
			// {\"min\": [\"=toInteger\", 0],\"max\": [\"=toInteger\",
			// null],\"avg\": [\"=toHello\", null],\"_id\": \"UNKNOWN\"}}}}]";
			List chainrSpecJSON = JsonUtils.jsonToList(stSpecJson);
			Chainr chainr = Chainr.fromSpec(chainrSpecJSON);
			Object inputJSON = JsonUtils.jsonToObject(stInputJson);
			Object transformedOutput = chainr.transform(inputJSON);
			transformJson = JsonUtils.toJsonString(transformedOutput);
			resultObject.put("result", transformedOutput);
			_logger.warn("specArray...." + stSpecJson);
			_logger.warn("stInputJson...." + stInputJson);
			_logger.warn("transformJson...." + transformJson);
			_logger.warn("output...." + resultObject);
		} catch (Exception ex) {
			putValuesInJsonObject(resultObject, ex.getMessage());
			_logger.error(ex.getMessage());

		}
		return resultObject;
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

	/**
	 * Service handles as a transformer from JSON to XSD
	 * @param inputjson Input Json
	 * @return transformed XSD in format of Json object
	 */
	public String convertJsonToXSD(JSONObject jsonInputData) {
		JSONObject jsonObject = new JSONObject();
		try {
			if (!jsonInputData.has("result")) {
				jsonObject.put("result", jsonInputData);	
			} else {
				jsonObject = jsonInputData;
			}
			_logger.warn("input...." + jsonObject);
			String responsexsd = datajsonController.convertJsonToXSD(jsonObject);
			_logger.warn("response from xsd...." + responsexsd);
			return responsexsd;
		} catch (JSONException e) {
			_logger.error(e.getMessage());
			return null;
		}
	}

	public JSONObject convertXSDToJson(String xsdSchemaInput) throws Exception {
		// _logger.warn("input...." + xsdSchemaInput);
		Xsd2Json xsd2json = new Xsd2Json();
		JSONObject responseJson = new JSONObject();
		org.json.simple.JSONObject jsonResponse = (org.json.simple.JSONObject) xsd2json.convertXsd2Json(xsdSchemaInput);
		// _logger.warn("jsonResponse...." + jsonResponse);
		responseJson.put("result", jsonResponse.get("result"));
		// _logger.warn("output...." + responseJson);
		return responseJson;
	}

}
