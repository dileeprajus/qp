package com.cdee;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
//import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;

import com.cdee.controller.DataConverterController;
import com.cdee.controller.DataJsonController;
import com.cdee.controller.RestAuthentication;
import com.cdee.controller.SoapServiceController;
import com.cdee.controller.soap.ReadWSDL;
import com.cdee.controller.xsdtojson.Xsd2Json;
import com.thingworx.logging.LogUtilities;
import com.thingworx.metadata.annotations.ThingworxServiceDefinition;
import com.thingworx.metadata.annotations.ThingworxServiceParameter;
import com.thingworx.metadata.annotations.ThingworxServiceResult;

public class IEBussinessRulesShape {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);

	public IEBussinessRulesShape() {
		// TODO Auto-generated constructor stub
	}

	RestAuthentication restauthentication = new RestAuthentication();
	SoapServiceController soapServiceController = new SoapServiceController();
	DataConverterController dataConverterControl = new DataConverterController();
	DataJsonController datajsonController = new DataJsonController();
	ReadWSDL readWSDL =new ReadWSDL();
	Xsd2Json xsdtojson = new Xsd2Json();
	
	/**
	 * GetServiceNames returns all name of services given WSDL supports
	 * 
	 * @param InputWSDL
	 *            
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "GetServiceNames", description = "Service returns all name of services given WSDL supports", category = "SOAP", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetServiceNames(
			@ThingworxServiceParameter(name = "InputWSDL", description = "WSDL data", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputWSDL) {
		_logger.trace("Entering Service: GetServiceNames");
		_logger.trace("Exiting Service: GetServiceNames");
		return soapServiceController.operations(InputWSDL);
	}
	
	/**
	 * GetXSDForSoapEndPoint returns returns xsd informtion for give WSDL and servce name
	 * 
	 * @param InputWSDL
	 * @param ElementName
	 * returns JSONObject.
	 */

	@ThingworxServiceDefinition(name = "GetXSDForSoapEndPoint", description = "This service returns xsd informtion for give WSDL and servce name", category = "SOAP", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetXSDForSoapEndPoint(
			@ThingworxServiceParameter(name = "InputWSDL", description = "A complete WSDL", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputWSDL,
			@ThingworxServiceParameter(name = "ElementName", description = "Given WSDL's service end point", baseType = "STRING", aspects = {
					"isRequired:true" }) String ElementName) {
		_logger.trace("Entering Service: GetXSDForSoapEndPoint");
		_logger.trace("Exiting Service: GetXSDForSoapEndPoint");
		return soapServiceController.wsdlToXsd(InputWSDL, ElementName);
	}
	

	/**
	 * XMLToJson Convers XML to Json
	 * 
	 * @param InputXML
	 * returns JSONObject.
	 */

	@ThingworxServiceDefinition(name = "XMLToJson", description = "Convers XML to Json", category = "DataFormat", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject XMLToJson(
			@ThingworxServiceParameter(name = "InputXML", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputXML) {
		_logger.trace("Entering Service: XMLToJson");
		_logger.trace("Exiting Service: XMLToJson");
		return dataConverterControl.convertXmltoJson(InputXML);
	}
	
	/**
	 * JsonToXML Converts JSon object to welformed XML data
	 * 
	 * @param JSONObject
	 * returns String.
	 */

	@ThingworxServiceDefinition(name = "JsonToXML", description = "Converts JSon object to welformed XML data", category = "dataformat", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "STRING", aspects = {})
	public String JsonToXML(
			@ThingworxServiceParameter(name = "InputJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject InputJson) {
		_logger.trace("Entering Service: JsonToXML");
		_logger.trace("Exiting Service: JsonToXML");
		return dataConverterControl.convertJsontoXml(InputJson);
	}
	
	/**
	 * GetSoapEndPoint Gets ServiceUrls end points of given WSDL
	 * 
	 * @param InputWSDL
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "GetSoapEndPoint", description = "Gets ServiceUrls end points of given WSDL", category = "SOAP", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetSoapEndPoint(
			@ThingworxServiceParameter(name = "InputWSDL", description = "Required WSDL input", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputWSDL) {
		_logger.trace("Entering Service: GetSoapEndPoint");
		_logger.trace("Exiting Service: GetSoapEndPoint");
		return soapServiceController.getServiceUrls(InputWSDL);
	}
	
	
	/**
	 * SendRequestObject sends request body information to given URL end point and corresponding WSDL
	 * 
	 * @param InputURL
	 * @param  SoapAction
	 * @param InputRequestBody
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "SendRequestObject", description = "Serrvice sends request body information to given URL end point and corresponding WSDL", category = "SOAP", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "STRING", aspects = {})
	public String SendRequestObject(
			@ThingworxServiceParameter(name = "InputURL", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputURL,
			@ThingworxServiceParameter(name = "SoapAction", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String SoapAction,
			@ThingworxServiceParameter(name = "InputRequestBody", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputRequestBody,
			@ThingworxServiceParameter(name = "ConfigJson", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String ConfigJson)
			throws Exception {
		_logger.trace("Entering Service: SendRequestObject");
		_logger.trace("Exiting Service: SendRequestObject");
		return soapServiceController.sendRequestObject(InputURL, InputRequestBody, SoapAction, ConfigJson);
	}
	

	/**
	 * DataTransformer handles as a transformer from JSON to JSON \r\nTransforms given Json according to given spec information
	 * 
	 * @param InputJson
	 * @param  SpecJson
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "DataTransformer", description = "Service handles as a transformer from JSON to JSON \r\nTransforms given Json according to given spec information", category = "TransformRules", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject DataTransformer(
			@ThingworxServiceParameter(name = "InputJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject InputJson,
			@ThingworxServiceParameter(name = "SpecJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject SpecJson) {
		_logger.trace("Entering Service: DataTransformer");
		_logger.trace("Exiting Service: DataTransformer");
		return dataConverterControl.dataTransformer(InputJson, SpecJson);
	}
	
	/**
	 * JsonsToXSD Convert Json Schema to XSD
	 * 
	 * @param InputJson
	 * returns String.
	 */
	@ThingworxServiceDefinition(name = "JsonsToXSD", description = "Convert Json Schema to XSD", category = "dataformat", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "XSD in String format.", baseType = "STRING", aspects = {})
	public String JsonsToXSD(
			@ThingworxServiceParameter(name = "InputJson", description = "Json schema", baseType = "JSON") JSONObject InputJson) {
		_logger.trace("Entering Service: JsonsToXSD");
		_logger.trace("Exiting Service: JsonsToXSD");
		return dataConverterControl.convertJsonToXSD(InputJson);
	}
	
	/**
	 * XSDToJson Converts given XSD to Json object
	 * 
	 * @param InputXSD
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "XSDToJson", description = "Converts given XSD to Json object", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject XSDToJson(
			@ThingworxServiceParameter(name = "InputXSD", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputXSD)
			throws Exception {
		_logger.trace("Entering Service: XSDToJson");
		_logger.trace("Exiting Service: XSDToJson");
		return dataConverterControl.convertXSDToJson(InputXSD);
	}
	
	/**
	 * XSDToJson Converts given XSD to Json object
	 * 
	 * @param InputXSD
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "GetWSDLMetaInfo", description = "", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetWSDLMetaInfo(
			@ThingworxServiceParameter(name = "InputWSDL", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String InputWSDL) {
		_logger.trace("Entering Service: GetWSDLMetaInfo");
		_logger.trace("Exiting Service: GetWSDLMetaInfo");
		return soapServiceController.getWSDLMetaInfo(InputWSDL);
	}
	
	/**
	 * ValidateJSON validates json with json schema
	 * 
	 * @param InputJson
	 * @param JsonSchema
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "ValidateJSON", description = "validate json with json schema", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject ValidateJSON(
			@ThingworxServiceParameter(name = "InputJson", description = "input json", baseType = "JSON") JSONObject InputJson,
			@ThingworxServiceParameter(name = "JsonSchema", description = "Json Schema", baseType = "JSON") JSONObject JsonSchema) {
		_logger.warn("Entering Service: ValidateJSON");
		JSONObject object = new JSONObject();
		try {
			Schema schema = SchemaLoader.load(JsonSchema);
			schema.validate(InputJson);
		} catch (ValidationException e) {
			String errors = e.getMessage();
			_logger.error(errors);
			List<ValidationException> listExceptions = e.getCausingExceptions();
			JSONArray array = new JSONArray();
			try {
				for (ValidationException valid : listExceptions) {
					array.put(valid.getMessage());
				}
				object.put("ValidationException", errors);
				object.put("Exceptions", array);
			} catch (Exception exce) {
				_logger.error(exce.getMessage());
			}
		}
		_logger.warn("Exiting Service: ValidateJSON");
		return object;
	}

	/**
	 * GetSOAPRequestPayLoad Service to get SOAP pay load
	 * 
	 * @param Inputxml
	 * returns JSONObject.
	 */
	@ThingworxServiceDefinition(name = "GetSOAPRequestPayLoad", description = "Service to get SOAP pay load", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetSOAPRequestPayLoad(
			@ThingworxServiceParameter(name = "Inputxml", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String Inputxml) throws Exception {
		_logger.trace("Entering Service: GetSOAPRequestPayLoad");
		_logger.trace("Exiting Service: GetSOAPRequestPayLoad");
		return soapServiceController.getSOAPPayLoad(Inputxml);
	}
	
	/**
	 * GetWSDLFromURL Service to read WSDL
	 * 
	 * @param AuthJson takes URL and authentication data
	 * returns String WSDL.
	 */
	@ThingworxServiceDefinition(name = "GetWSDLFromURL", description = "Reads WSDL from given URL with authentication and returns WSDL", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject GetWSDLFromURL(
			@ThingworxServiceParameter(name = "AuthJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject AuthJson) {
		_logger.trace("Entering Service: GetWSDLFromURL");
		_logger.trace("Exiting Service: GetWSDLFromURL");

		return readWSDL.readWSDLData(AuthJson);
			
	}

}
