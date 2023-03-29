package com.cdee.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.TreeSet;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.cdee.IEBussinessRulesShape;
import com.cdee.controller.soap.SoapServiceRequester;
import com.predic8.schema.ComplexContent;
import com.predic8.schema.ComplexType;
import com.predic8.schema.Element;
import com.predic8.schema.Schema;
import com.predic8.schema.SchemaComponent;
import com.predic8.schema.Sequence;
import com.predic8.schema.SimpleContent;
import com.predic8.schema.SimpleType;
import com.predic8.schema.TypeDefinition;
import com.predic8.wsdl.Definitions;
import com.predic8.wsdl.WSDLParser;
import com.thingworx.logging.LogUtilities;

import groovy.xml.QName;

public class SoapServiceController {

	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);
	SoapServiceRequester soapserrvicerequester = new SoapServiceRequester();

	/**
	 * Handle the WSDL to get operations WSDL supports
	 * 
	 * @param inputWsdl
	 *            the WSDL
	 * @param jsonObject
	 *            .
	 */

	Schema schema = null;

	public JSONObject getWSDLMetaInfo(String inputWsdl) {
		ArrayList list = soapserrvicerequester.getWSDLInfo(inputWsdl);
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("result", list);
		} catch (JSONException e) {
			putValuesInJsonObject(jsonObject, e.getMessage());
			_logger.error(e.getMessage());
		}

		return jsonObject;
	}

	/**
	 * Handle the WSDL to get Meta information of given WSDL 
	 * 
	 * @param inputWsdl
	 *            the WSDL
	 * @param jsonObject
	 *            .
	 */



	public JSONObject operations(String inputWsdl) {
		ArrayList list = soapserrvicerequester.getBindingInfo(inputWsdl);
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("result", list);
		} catch (JSONException e) {
			putValuesInJsonObject(jsonObject, e.getMessage());
			_logger.error(e.getMessage());
		}

		_logger.warn("outputJson...." + jsonObject);
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

	/**
	 * Handle the WSDL to get Schema of given WSDL
	 * 
	 * @param inputWsdl
	 *            WSDL
	 * @param serviceName
	 *            service name of WSDL
	 * @param jsonObject
	 *            .
	 */

	/*	public JSONObject wsdlToXsd(String inputWsdl, String serviceName) {
		String response = "";
		_logger.warn("inputWsdl...." + inputWsdl);
		_logger.warn("serviceName...." + serviceName);
		JSONObject jsonObject = new JSONObject();

		  InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		  WSDLParser parser = new WSDLParser();
		  Definitions defs = parser.parse(is);
		  String targerNameSpace = defs.getTargetNamespace();
		  Schema schema = defs.getSchema(targerNameSpace);
		  Schema newSchema = new Schema(targerNameSpace);
		  ComplexType ipCmplxType = null;
		  try{
		   ipCmplxType = schema.getComplexType(serviceName);
		   Sequence ipSequence = ipCmplxType.getSequence();
		   if(!ipSequence.getElements().isEmpty()){
		    for (Element elm : ipSequence.getElements()) {
		     Collection localList = new ArrayList();
		     localList.add(serviceName);
		     localList.add(elm.getType().getLocalPart());
		     Element newElm = newSchema.newElement(elm.getName(), elm.getType().getLocalPart());
		     try {
		      getComplexType(schema, elm.getType().getLocalPart(), newElm,localList);
		     } catch (Exception e1) {
		     }
		     response = newSchema.getAsString();
		    }
		   }else{
		    String parentSchema = newSchema.getAsString();
		    String rootSchema = parentSchema.substring(0, parentSchema.length()-2)+">";
		   // response = rootSchema+"\n"+ipCmplxType.getAsString()+"\n</"+parentSchema.substring(parentSchema.indexOf("<")+1, parentSchema.indexOf("schema"))+":schema>";
		    response = rootSchema+""+ipCmplxType.getAsString()+"</"+parentSchema.substring(parentSchema.indexOf("<")+1, parentSchema.indexOf("schema"))+":schema>";
		   }
		  }catch(Exception e){
		   Element simpleElement = schema.getElement(serviceName);
		   QName s =simpleElement.getType();
		   if(s!=null){
		    ipCmplxType = schema.getComplexType(s.getLocalPart());
		   }else{
		    String parentSchema = newSchema.getAsString();
		    String rootSchema = parentSchema.substring(0, parentSchema.length()-2)+">";
		    //response = rootSchema+"\n"+simpleElement.getAsString()+"\n</"+parentSchema.substring(parentSchema.indexOf("<")+1, parentSchema.indexOf("schema"))+"schema>";
		    response = rootSchema+""+simpleElement.getAsString()+"</"+parentSchema.substring(parentSchema.indexOf("<")+1, parentSchema.indexOf("schema"))+"schema>";
		   }
		  }

		try {
			jsonObject.put("Result", response);
		} catch (JSONException e) {
			putValuesInJsonObject(jsonObject, e.getMessage());
			_logger.error(e.getMessage());
		}

		_logger.warn("output...." + response);

		return jsonObject;
	}*/

	/**
	 * Returns an XSD of given serviceName.
	 * @param inputWsdl contains all information of OperationNames,Services,Ports,PortTypes,ElementNames....etc.,
	 * @param serviceName contains name of the OerationName(Element Name).
	 * @return XSD
	 */

	public JSONObject wsdlToXsd(String inputWsdl, String serviceName) {
		String response = "";
		InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		WSDLParser parser = new WSDLParser();
		Definitions defs = parser.parse(is);
		String targerNameSpace = defs.getTargetNamespace();
		Schema schema = defs.getSchema(targerNameSpace);
		JSONObject jsonObject = new JSONObject();
		Schema newSchema = new Schema(targerNameSpace);
		ComplexType ipCmplxType = null;
		Sequence ipSequence = null;
		try {
			Element simpleElement = schema.getElement(serviceName);
			QName s = simpleElement.getType();
			if (s != null) {
				ipCmplxType = schema.getComplexType(s.getLocalPart());
				ipSequence = ipCmplxType.getSequence();
			} else {
				TypeDefinition typeDefinition = simpleElement.getEmbeddedType();
				if (typeDefinition instanceof ComplexType) {
					ipCmplxType = (ComplexType) typeDefinition;
				}
				ipSequence = ipCmplxType.getSequence();				
			}
			if (ipCmplxType.getSequence() != null) {
				response = gettingComplexElements(schema, newSchema,ipCmplxType, ipSequence, simpleElement, serviceName);
			} else {
				Element e2 = newSchema.newElement(simpleElement.getName());
				e2.setEmbeddedType(ipCmplxType);
				response = newSchema.getAsString();
			}
			jsonObject.put("result", response);
		} catch (Exception e) {
			_logger.warn("Exception...." + e);
			putValuesInJsonObject(jsonObject, e.getMessage());
		}
		return jsonObject;
	}
	/*public JSONObject wsdlToXsd(String inputWsdl, String serviceName) {
		String response = "";
		InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		WSDLParser parser = new WSDLParser();
		Definitions defs = parser.parse(is);
		String targerNameSpace = defs.getTargetNamespace();
		Schema schema = defs.getSchema(targerNameSpace);
		Schema newSchema = new Schema(targerNameSpace);
		ComplexType ipCmplxType = null;
		JSONObject jsonObject = new JSONObject();
		Sequence ipSequence = null;
		try {
			Element simpleElement = schema.getElement(serviceName);
			QName s = simpleElement.getType();
			if (s != null) {
				 Element does not contain Type then goes here 
				ipCmplxType = schema.getComplexType(s.getLocalPart());
				ipSequence = ipCmplxType.getSequence();
			} else {
				Element contains type and complexType have without name then goes here 
				TypeDefinition typeDefinition = simpleElement.getEmbeddedType();
				if (typeDefinition instanceof ComplexType) {
					ipCmplxType = (ComplexType) typeDefinition;
				}
				//https://stackoverflow.com/questions/4821477/xml-schema-minoccurs-maxoccurs-default-values
				ipSequence = ipCmplxType.getSequence();
				
			}
			 ComplexType have sequence is Available then goes here 
			if (ipCmplxType.getSequence() != null) {
				response = gettingComplexElements(schema, newSchema,ipCmplxType, ipSequence, simpleElement, serviceName);
			} else {
				 ComplexType have without sequence the return the schema 
				Element e2 = newSchema.newElement(simpleElement.getName());
				e2.setEmbeddedType(ipCmplxType);
				response = newSchema.getAsString();
			}
			jsonObject.put("Result", response);
		} catch (Exception e) {
			_logger.warn("Exception...." + e);
			putValuesInJsonObject(jsonObject, e.getMessage());
		}
		return jsonObject;
	}
*/


	/**
	 * 
	 * @param schema contains ParentSchema of given wsdl 
	 * @param newSchema contains ParentSchema of given wsdl
	 * @param ipCmplxType contains sequence of elements
	 * @param ipSequence contains elements
	 * @param simpleElement contains a single element
	 * @param serviceName contains name of the operation Name(Service Name)
	 * @return XSD of given wsdl operation name.
	 */
	
public String gettingComplexElements(Schema schema, Schema newSchema,ComplexType ipCmplxType, Sequence ipSequence,Element simpleElement, String serviceName) {
		
		ArrayList<SimpleType> smp = new ArrayList<SimpleType>();
		ArrayList<SimpleType> smp11 = new ArrayList<SimpleType>();
		 TreeSet<String> tree= new TreeSet<String>();  
		String response = "";
		if (!ipSequence.getElements().isEmpty()) {
			Element e2 = newSchema.newElement(simpleElement.getName());
			Sequence seqe = e2.newComplexType().newSequence();
			seqe.setMinOccurs(ipSequence.getMinOccurs());
			seqe.setMaxOccurs(ipSequence.getMaxOccurs());
			for (Element elm : ipSequence.getElements()) {
				String typePrefix = "";
				Element newElm = null;
				String refname ="";
				Collection localList = new ArrayList();
				if(elm.getRef()!=null){
					localList.add(serviceName);
					localList.add(elm.getRef().getLocalPart());
					newElm = schema.getElement(elm.getRef().getLocalPart());
					typePrefix = elm.getRef().getPrefix();
				}else{
					localList.add(serviceName);
					localList.add(elm.getType().getLocalPart());
					newElm = elm;
					typePrefix = elm.getType().getPrefix();
				}
				
				newElm =  gettingRef(elm,newElm,seqe,typePrefix);
				try {
					if(elm.getRef()!=null){
						getComplexType(schema, elm.getRef().getLocalPart(),newElm, localList,smp);
						
					}else{
						getComplexType(schema, elm.getType().getLocalPart(),newElm, localList,smp);
					}
					
					for(int k=0;k<smp.size();k++){
						SimpleType simpleType = (SimpleType)smp.get(k);
						if(smp11.size() == 0){
							smp11.add(simpleType);
							tree.add(simpleType.getName());
						}else if(!tree.contains(simpleType.getName())){
							smp11.add(simpleType);
							tree.add(simpleType.getName());
						}
					}
					newSchema.setSimpleTypes(smp11);
					
				} catch (Exception e) {
					e.getMessage();
				}
				response = newSchema.getAsString();
			}
		} else {
			QName s = simpleElement.getType();
			if (s != null) {
				Element e2 = newSchema.newElement(simpleElement.getName(),s.getLocalPart());
				newSchema.add(ipCmplxType);
				response = newSchema.getAsString();
			} else {
				Element e2 = newSchema.newElement(simpleElement.getName());
				e2.setEmbeddedType(ipCmplxType);
				response = newSchema.getAsString();
			}
		}
		return response;
	}

public static Element gettingRef(Element elm,Element newElm,Sequence seqe,String typePrefix){
	
	if (typePrefix.equals("tns")) {
		if(elm.getName()!=null){
			newElm = seqe.newElement(elm.getName());
		}else if(elm.getRef()!=null){
			newElm = seqe.newElement(elm.getRef().getLocalPart());
		}
	}
	else {
		if(elm.getName()!=null){
			newElm = seqe.newElement(elm.getName(), elm.getType());	
		     newElm.setMinOccurs(elm.getMinOccurs()+" ");
		     newElm.setMaxOccurs(elm.getMaxOccurs()+" ");
		     if(elm.getFixedValue()!=null){
		      newElm.setFixedValue(elm.getFixedValue());
		     }
		     if(elm.getDefaultValue()!=null){
		      newElm.setDefaultValue(elm.getDefaultValue());
		     }
		}else{
			newElm = seqe.newElement(elm.getRef().getLocalPart());
		}

	}
	return newElm;			
}

	/*public String gettingComplexElements(Schema schema, Schema newSchema,ComplexType ipCmplxType, Sequence ipSequence,Element simpleElement, String serviceName) {
	
		String response = "";
		 sequence contains an elements then goes here
		if (!ipSequence.getElements().isEmpty()) {
			Element e2 = newSchema.newElement(simpleElement.getName());
			Sequence seqe = e2.newComplexType().newSequence();
			
			seqe.setMinOccurs(ipSequence.getMinOccurs());
			seqe.setMaxOccurs(ipSequence.getMaxOccurs());
			for (Element elm : ipSequence.getElements()) {
				Collection localList = new ArrayList();
				localList.add(serviceName);
				localList.add(elm.getType().getLocalPart());
				Element newElm = elm;
				String typePrefix = elm.getType().getPrefix();
				 If type contains tns(prefix) and it is ComplexType then goes here 
				if (typePrefix.equals("tns")) {
					newElm = seqe.newElement(elm.getName());
				} else {
					 If type is simpleType then goes here 
					newElm = seqe.newElement(elm.getName(), elm.getType());	
					//Added minOccurs and MaxOccurs to each Element
					newElm.setMinOccurs(elm.getMinOccurs()+" ");
					newElm.setMaxOccurs(elm.getMaxOccurs()+" ");
					//Added Fixed values
					if(elm.getFixedValue()!=null){
						newElm.setFixedValue(elm.getFixedValue());
					}
					//Added default values
					if(elm.getDefaultValue()!=null){
						newElm.setDefaultValue(elm.getDefaultValue());
					}
				}
				try {
					getComplexType(schema, elm.getType().getLocalPart(),newElm, localList);
				} catch (Exception e) {
					e.getMessage();
				}
				response = newSchema.getAsString();
			}
		} else {
			QName s = simpleElement.getType();
			if (s != null) {
				Element e2 = newSchema.newElement(simpleElement.getName(),s.getLocalPart());
				newSchema.add(ipCmplxType);
				// e2.setEmbeddedType(ipCmplxType);
				response = newSchema.getAsString();
			} else {
				Element e2 = newSchema.newElement(simpleElement.getName());
				e2.setEmbeddedType(ipCmplxType);
				response = newSchema.getAsString();
			}
		}
		return response;
	}*/

	/**
	 * Handle the WSDL to get Schema of given WSDL
	 * 
	 * @param schema
	 *            of WSDL
	 * @param serviceName
	 *            service name of WSDL
	 * @param jsonObject
	 *            .
	 */
public static void getComplexType(Schema schema, String type,Element currentElement, Collection ipList,ArrayList smp) {
	
	Collection trace = new ArrayList();
	trace.addAll(ipList);
	trace.add(type);
	if(schema.getType(type) == null){
		TypeDefinition typeDefinition = schema.getElement(type).getEmbeddedType();
		if(schema.getElement(type).getEmbeddedType() instanceof SimpleType){
			SimpleType ss = (SimpleType)typeDefinition;
			currentElement.setEmbeddedType(ss);
		}
		else if(schema.getElement(type).getEmbeddedType() instanceof ComplexType){
			ComplexType cs = (ComplexType)typeDefinition;
			Sequence seq = cs.getSequence();
			Sequence newSeq = currentElement.newComplexType().newSequence();
			for (Element elm : seq.getElements()) {
				Element newElm = elm;
				String typePrefix = "";
				if(elm.getRef()!=null){
					gettingRefInsideRef(schema,elm,newSeq,newElm);
				}
				else{
					try {
						typePrefix = elm.getPrefix();
						if (typePrefix.equals("tns")) {
							if (!trace.contains(elm.getType().getLocalPart())) {
								getComplexType(schema,elm.getType().getLocalPart(), newElm, trace,smp);
							}
						}
					} catch (Exception e) {
							e.getMessage();
					}
					newSeq.add(newElm);
				}
			}
			
		}
	}		
	else if (schema.getType(type) instanceof SimpleType) {
		smp.add(schema.getSimpleType(type));
	} else {
		ComplexType cmp = schema.getComplexType(type);
		SchemaComponent  schemaComponent  = cmp.getModel();
		if(schemaComponent instanceof SimpleContent){
			Sequence newSeq = currentElement.newComplexType().newSequence();
			SimpleContent SimpleContent = (SimpleContent)schemaComponent;
			currentElement.newComplexType().setModel(SimpleContent);
			newSeq.add(currentElement);
		}else if(schemaComponent instanceof ComplexContent){
			Sequence newSeq = currentElement.newComplexType().newSequence();
			ComplexContent complexContent = (ComplexContent)schemaComponent;
			currentElement.newComplexType().setModel(complexContent);
			newSeq.add(currentElement);
		}else{
			Sequence seq = cmp.getSequence();
			Sequence newSeq = currentElement.newComplexType().newSequence();
			for (Element elm : seq.getElements()) {
				Element newElm = elm;
				String typePrefix = "";
				if(elm.getRef()!=null){
					gettingRefInsideRef(schema,elm,newSeq,newElm);
				}
				else{
					try {
						typePrefix = elm.getPrefix();
						if (typePrefix.equals("tns")) {
							if (!trace.contains(elm.getType().getLocalPart())) {
								getComplexType(schema,elm.getType().getLocalPart(), newElm, trace,smp);
							}
						}
					} catch (Exception e) {
							e.getMessage();
					}
					newSeq.add(newElm);
				}
			}	
		}
	}
}

public static void  gettingRefInsideRef(Schema schema,Element elm,Sequence newSeq,Element newElm){
	String typePrefix ="";
	typePrefix = elm.getRef().getPrefix();
	if(schema.getType(elm.getRef().getLocalPart()) == null){
		TypeDefinition typeDefinition = schema.getElement(elm.getRef().getLocalPart()).getEmbeddedType();
		if(schema.getElement(elm.getRef().getLocalPart()).getEmbeddedType() instanceof SimpleType){
			SimpleType ss = (SimpleType)typeDefinition;
			newElm = newSeq.newElement(elm.getRef().getLocalPart());
			newElm.setEmbeddedType(ss);
	   }else if(schema.getElement(elm.getRef().getLocalPart()).getEmbeddedType() instanceof ComplexType){
		   ComplexType complexType = (ComplexType)typeDefinition;
		   Sequence refSequence = complexType.getSequence();
		   Sequence s2 = newSeq.newElement(elm.getRef().getLocalPart()).newComplexType().newSequence();
		   for (Element refElm : refSequence.getElements()) {
			   if(refElm.getRef()!=null){
					newElm = schema.getElement(elm.getRef().getLocalPart());
					typePrefix = elm.getRef().getPrefix();
				}else {
					newElm = refElm;
					typePrefix = refElm.getType().getPrefix();
				}
			   newElm =  gettingRef(refElm,newElm,s2,typePrefix);
			   try {
					if(refElm.getRef()!=null){
						getComplexType(schema, refElm.getRef().getLocalPart(),newElm, new ArrayList(),new ArrayList());
						
					}else{
						getComplexType(schema, refElm.getType().getLocalPart(),newElm, new ArrayList(),new ArrayList());
					}
			   } catch (Exception e) {
					e.getMessage();
				}
			   
		   }
	   }
	}
}

	/*public static void getComplexType(Schema schema, String type,Element currentElement, Collection ipList) {
		Collection trace = new ArrayList();
		trace.addAll(ipList);
		trace.add(type);

		if (schema.getType(type) instanceof SimpleType) {
			Sequence newSeq = currentElement.newComplexType().newSequence();
			SimpleType smp = schema.getSimpleType(type);
			currentElement.setEmbeddedType(smp);
			newSeq.add(currentElement);
		} else {
			ComplexType cmp = schema.getComplexType(type);
			Sequence seq = cmp.getSequence();
			Sequence newSeq = currentElement.newComplexType().newSequence();
			for (Element elm : seq.getElements()) {
				Element newElm = elm;
				try {
					String typePrefix = elm.getPrefix();
					if (typePrefix.equals("tns")) {
						if (!trace.contains(elm.getType().getLocalPart())) {
							getComplexType(schema,
									elm.getType().getLocalPart(), newElm, trace);
						}
					}
				} catch (Exception e) {
					e.getMessage();
				}
				newSeq.add(newElm);
			}
		}
	}*/
	/**
	 * Handles to return all service URLS of given WSDL
	 * 
	 * @param inputWsdl
	 *            WSDL object
	 * @return jsonObject.
	 */
	public JSONObject getServiceUrls(String inputWsdl) {

		JSONObject jsonObject =new JSONObject();
		try {
			ArrayList response = soapserrvicerequester.getServiceInfo(inputWsdl);
			jsonObject.put("result", response);
		} catch (JSONException e) {
			putValuesInJsonObject(jsonObject, e.getMessage());
			_logger.error(e.getMessage());
		}
		return jsonObject;
	}
	
	/**
	 * Handles to return all service URLS of given WSDL
	 * 
	 * @param inputWsdl
	 *            WSDL object
	 * @return jsonObject.
	 * @throws Exception 
	 */
	public JSONObject getSOAPPayLoad(String inputxml) throws Exception {

		JSONObject jsonObject =new JSONObject();
		try {
			String response = soapserrvicerequester.createSoapPayload(inputxml);
			jsonObject.put("result", response);
		} catch (JSONException e) {
			putValuesInJsonObject(jsonObject, e.getMessage());
			_logger.error(e.getMessage());
		}
		return jsonObject;
	}

	/**
	 * Handles to send request body to given URL end point of input WSDL
	 * 
	 * @param inputWsdl
	 *            WSDL object
	 * @param url
	 *            URL end point
	 * @param xmlData
	 *            request body
	 * @return response object.
	 */
	public String sendRequestObject(String url, String xmlData,String soapAction,String configJson) throws Exception {


		String response = soapserrvicerequester.callSoapRequest(url,xmlData,soapAction,configJson);



		return response;
	}



}
