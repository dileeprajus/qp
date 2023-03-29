package com.cdee.controller.soap;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.xml.sax.SAXException;

import com.predic8.wsdl.AbstractSOAPBinding;
import com.predic8.wsdl.Binding;
import com.predic8.wsdl.BindingOperation;
import com.predic8.wsdl.Definitions;
import com.predic8.wsdl.ExtensibilityOperation;
import com.predic8.wsdl.Input;
import com.predic8.wsdl.Message;
import com.predic8.wsdl.Operation;
import com.predic8.wsdl.Output;
import com.predic8.wsdl.Part;
import com.predic8.wsdl.Port;
import com.predic8.wsdl.PortType;
import com.predic8.wsdl.Service;
import com.predic8.wsdl.WSDLParser;


public class SoapServiceRequester {
	
	
	public ArrayList getWSDLInfo(String inputWsdl) {
		  String url = "";
		  String inputElementName = "";
		  String soapAction = "";
		  String serviceName= "";
		  String portName = "";
		  String outputElementName = "";
		  ArrayList list = new ArrayList();
		  InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		  WSDLParser parser = new WSDLParser();
		  Definitions defs = parser.parse(is);
		  for (Service service : defs.getServices()) {
		   serviceName = service.getName();
		   for (Port port : service.getPorts()) {
		    portName = port.getName();
		    Binding binding  = port.getBinding();
		    if(binding.getBinding() instanceof AbstractSOAPBinding){
		     PortType portType =  binding.getPortType();
		              List operations = portType.getOperations();
		              for (int i = 0; i < operations.size(); i++) {
		               JSONObject responseData = null;
		               Operation operation = (Operation) operations.get(i);
		               String opertaionName = operation.getName();
		               ExtensibilityOperation extensibilityOperation = binding.getOperation(opertaionName).getOperation();
		               JSONObject obj =  new JSONObject();
		               ArrayList<String> lists = new ArrayList<String>();
		               try{
		               Input input = operation.getInput();
		               Message message = input.getMessage();
		               for (Part part : message.getParts()) {
		                if( part.getElement()!=null){
		                	inputElementName = part.getElement().getName();
		                }else{
		                	inputElementName ="";
		                }
		                }
		               
		               Output output = operation.getOutput();
		               Message outputMessage = output.getMessage();
		               for (Part part : outputMessage.getParts()) {
		                if (part.getElement() != null) {
		                 outputElementName = part.getElement().getName();
		                } else {
		                 outputElementName = "";
		                }
		               }
		               }
		               catch(Exception ex)
		               {}
		         
		                obj.put("ServiceName", serviceName);
		                obj.put("PortName", portName);
		                obj.put("BindingName", binding.getQName().getLocalPart());
		                obj.put("PortTypeName", portType.getQName().getLocalPart());
		                obj.put("OperationName",operation.getName());
		                obj.put("InputElementName", inputElementName);
		                obj.put("BindingProtocol", binding.getBinding().getProtocol());
		                obj.put("SoapAction", extensibilityOperation.getSoapAction());
		                obj.put("EndPointUrl", port.getAddress().getLocation());
		                obj.put("OutputElementName", outputElementName);
		                list.add(obj);
		              }
		    }
		   }
		   }
		  return list;
		 }
	
	
	
	public ArrayList getServiceInfo(String inputWsdl) {
		String url = "";
		ArrayList list = new ArrayList();
		InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		WSDLParser parser = new WSDLParser();
		Definitions defs = parser.parse(is);
		for (Service service : defs.getServices()) {
			for (Port port : service.getPorts()) {
				if(port.getBinding().getProtocol().toString().toLowerCase().contains("soap")){
					JSONObject object = new JSONObject();
					object.put("Service Name",service.getName());
					object.put("Port Name",port.getName());
					object.put("Port Binding" , port.getBinding().getName());
					object.put("EndPointUrl", port.getAddress().getLocation());
					list.add(object);
				}
				
			}
		}
		return list;
	}
	
	
	
	public ArrayList getBindingInfo(String inputWsdl) {
		String url = "";
		ArrayList list = new ArrayList();
		InputStream is = new ByteArrayInputStream(inputWsdl.getBytes());
		WSDLParser parser = new WSDLParser();
		Definitions defs = parser.parse(is);
		for (Binding bnd : defs.getBindings()) {
			if(bnd.getBinding() instanceof AbstractSOAPBinding){
				for (BindingOperation bop : bnd.getOperations()) {
					JSONObject object = new JSONObject();
					if(bnd.getBinding() instanceof AbstractSOAPBinding) {
						object.put("bindingProtocol", bnd.getBinding().getProtocol());
						object.put("operationName", bop.getName());
						object.put("soapAction", bop.getOperation().getSoapAction());
						object.put("Port Binding", bnd.getName());
					}
					if(!object.isEmpty()){
						list.add(object);
					}
				}  
			}
		}
		return list;
	}
	
	public String createSoapPayload(String xmlInput) throws Exception{
		
		String key ="";
		String value= "";
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		builderFactory.setNamespaceAware(true);
		InputStream stream = new ByteArrayInputStream(xmlInput.getBytes());
		Document doc = builderFactory.newDocumentBuilder().parse(stream);
		NamedNodeMap NamedNodeMap = doc.getDocumentElement().getAttributes();
		JSONObject nameSpaceObject =new JSONObject();
		for (int j = 0; j < NamedNodeMap.getLength(); j++) {
		  key =  NamedNodeMap.item(j).getNodeName();
		  value =  NamedNodeMap.item(j).getNodeValue();
		  nameSpaceObject.put(key, value); 
		}
		MessageFactory messageFactory = MessageFactory.newInstance();
		SOAPMessage soapMessage = messageFactory.createMessage();
		MimeHeaders headers = soapMessage.getMimeHeaders();
		SOAPPart soapPart = soapMessage.getSOAPPart();
		SOAPEnvelope envelope = soapPart.getEnvelope();
		for(Object o:nameSpaceObject.keySet()){
			key =(String)o;
			value = (String)nameSpaceObject.get(key);
			envelope.setAttribute(key, value);
		}
		SOAPBody soapBody = envelope.getBody();
		soapBody.addDocument(doc);
		soapMessage.saveChanges();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		soapMessage.writeTo(out);
		String response = new String(out.toByteArray());
		return response;
	}

	
	/*public SOAPMessage createSOAPRequest(String inputBody,String soapAction)throws Exception {
		  String key ="";
		  String value= "";
		  DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		  builderFactory.setNamespaceAware(true);
		  InputStream stream = new ByteArrayInputStream(inputBody.getBytes());
		  Document doc = builderFactory.newDocumentBuilder().parse(stream);
		  NamedNodeMap NamedNodeMap = doc.getDocumentElement().getAttributes();
		  JSONObject nameSpaceObject =new JSONObject();
		  for (int j = 0; j < NamedNodeMap.getLength(); j++) {
		    key =  NamedNodeMap.item(j).getNodeName();
		    value =  NamedNodeMap.item(j).getNodeValue();
		    nameSpaceObject.put(key, value); 
		  }
		  MessageFactory messageFactory = MessageFactory.newInstance();
		  SOAPMessage soapMessage = messageFactory.createMessage();
		  MimeHeaders headers = soapMessage.getMimeHeaders();
		        headers.addHeader("SOAPAction",soapAction);
		  SOAPPart soapPart = soapMessage.getSOAPPart();
		  SOAPEnvelope envelope = soapPart.getEnvelope();
		  for(Object o:nameSpaceObject.keySet()){
		   key =(String)o;
		   value = (String)nameSpaceObject.get(key);
		   envelope.setAttribute(key, value);
		  }
		  SOAPBody soapBody = envelope.getBody();
		  soapBody.addDocument(doc);
		  soapMessage.saveChanges();
		  return soapMessage;
		 }*/
    	
   /* public String callSoapRequest(String url,String inputBody,String soapAction){
    	
    	String response = "";
        try {
            SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
            SOAPConnection soapConnection = soapConnectionFactory.createConnection();
            SOAPMessage soapResponse = soapConnection.call(createSOAPRequest(inputBody,soapAction), url);
            response = printSOAPResponse(soapResponse);
            soapConnection.close();
        } catch (Exception e) {
            System.err.println("Error occurred while sending SOAP Request to Server");
            e.printStackTrace();
        }
		return response;
    }*/
/*	public String callSoapRequest(String url,String inputBody,String soapAction) throws SAXException, IOException, ParserConfigurationException, SOAPException{
		   
    	InputStream is = new ByteArrayInputStream(inputBody.getBytes());
    	SOAPMessage soapMessage = MessageFactory.newInstance().createMessage(null, is);
    	MimeHeaders headers = soapMessage.getMimeHeaders();
		headers.addHeader("SOAPAction", soapAction);
    	String response = "";
        try {
            SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
            SOAPConnection soapConnection = soapConnectionFactory.createConnection();
            SOAPMessage soapResponse = soapConnection.call(soapMessage, url);
            response = printSOAPResponse(soapResponse);
            soapConnection.close();
        } catch (Exception e) {
            System.err.println("Error occurred while sending SOAP Request to Server");
            e.printStackTrace();
        }
		return response;
    }*/

	public String callSoapRequest(String url, String inputBody, String soapAction, String authDetailsInput)
			throws SAXException, IOException, ParserConfigurationException, SOAPException, ParseException {

		JSONParser parser = new JSONParser();
		JSONObject authDetails = (JSONObject) parser.parse(authDetailsInput);
		String authType = (String) authDetails.get("current_auth_type");
		InputStream is = new ByteArrayInputStream(inputBody.getBytes());
		SOAPMessage soapMessage = MessageFactory.newInstance().createMessage(null, is);
		MimeHeaders headers = soapMessage.getMimeHeaders();
		headers.addHeader("SOAPAction", soapAction);
		if (authType.equals("BasicAuth")) {
			JSONObject basicDetailsObject = (JSONObject) authDetails.get("basic_auth_details");
			String username = (String) basicDetailsObject.get("username");
			String password = (String) basicDetailsObject.get("password");
			Authenticator.setDefault(new Authenticator() {
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication(username, password.toCharArray());
				}
			});
		}
		String response = "";
		try {
			SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
			SOAPConnection soapConnection = soapConnectionFactory.createConnection();
			SOAPMessage soapResponse = soapConnection.call(soapMessage, url);
			response = printSOAPResponse(soapResponse);
			soapConnection.close();
		} catch (Exception e) {
			response ="Error occurred while sending SOAP Request to Server";
			//e.printStackTrace();
		}
		return response;
	}
    public String printSOAPResponse(SOAPMessage soapResponse) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        Source source = soapResponse.getSOAPPart().getContent();
        StringWriter stringWriter = new StringWriter();
        StreamResult result = new StreamResult(stringWriter);
	    TransformerFactory.newInstance().newTransformer().transform(source, result);
		String response = result.getWriter().toString();
		System.out.println(response);
		return response;
    }
    
    public static void main(String args[]) throws SAXException, IOException, ParserConfigurationException, SOAPException{
    	String response = "";
		try {
			File file = new File("demo.xml");
			FileReader fileReader = new FileReader(file);
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			StringBuffer stringBuffer = new StringBuffer();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuffer.append(line);
				stringBuffer.append("\n");
			}
			fileReader.close();
			response = stringBuffer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		String wsdlInput = "";
		try {
			File file = new File("Weather.wsdl");
			FileReader fileReader = new FileReader(file);
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			StringBuffer stringBuffer = new StringBuffer();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuffer.append(line);
				stringBuffer.append("\n");
			}
			fileReader.close();
			wsdlInput = stringBuffer.toString();
		} catch (IOException e) {
			e.printStackTrace();
		} 
    	
    	SoapServiceRequester soapClientRequest = new SoapServiceRequester();
    	ArrayList bindingResponse = soapClientRequest.getBindingInfo(wsdlInput);
    	System.out.println(bindingResponse);
    	ArrayList servicesResponse = soapClientRequest.getServiceInfo(wsdlInput);
    	System.out.println(servicesResponse);
    	String endPointUrl = "http://www.webservicex.com/globalweather.asmx";
    	String saopAction ="http://www.webserviceX.NET/GetCitiesByCountry";
    	
    	//soapClientRequest.callSoapRequest(endPointUrl,response,saopAction);
    }

}