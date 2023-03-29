package com.cdee.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.StringWriter;
import java.io.Writer;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class EntityUpdator {
	
	static String temp = "";
	public static File folder = new File("Entities");
	


	public static void main(String[] args) throws Exception {
		
		System.out.println("Reading files under the folder "+ folder.getAbsolutePath());
	      listFilesForFolder(folder);
			
		
	}
	
	public static final void prettyPrint(Document xml) throws Exception {
		Transformer tf = TransformerFactory.newInstance().newTransformer();
		tf.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
		tf.setOutputProperty(OutputKeys.INDENT, "yes");
		Writer out = new StringWriter();
		tf.transform(new DOMSource(xml), new StreamResult(out));
		System.out.println(out.toString());
	}
	
	public static void listFilesForFolder(final File folder) {
		System.out.println("Reading files under the folder " + folder.getName());
		for (final File fileEntry : folder.listFiles()) {
			if (fileEntry.isDirectory()) {
				// System.out.println("Reading files under the folder
				// "+folder.getAbsolutePath());
				listFilesForFolder(fileEntry);
			} else {
				if (fileEntry.isFile()) {
					System.out.println(" files under the folder " + fileEntry.getName());
					temp = fileEntry.getName();
					if ((temp.substring(temp.lastIndexOf('.') + 1, temp.length()).toLowerCase()).equals("xml"))
						System.out.println("File= " + folder.getAbsolutePath() + "\\" + fileEntry.getName());
					String filename = folder.getPath() + "\\" + fileEntry.getName();
					String filepath = folder.getPath();
					System.out.println("File= " + filename);
					try {
						checkEntity(filename,filepath);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						System.out.println("Exception = " + e);
						e.printStackTrace();
					}
				}

			}
		}
	}
	
	
	public static void checkEntity(String filePath,String partialPath) throws Exception {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		dbf.setValidating(false);
		DocumentBuilder db = dbf.newDocumentBuilder();
		System.out.println(" partialPath == " + partialPath);

		Document doc = db.parse(new FileInputStream(new File(filePath)));

		
		if(partialPath.equalsIgnoreCase("Entities\\DataShapes"))
		{
			Element element = (Element) doc.getElementsByTagName("DataShape").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		else if(partialPath.equalsIgnoreCase("Entities\\ModelTags"))
		{
			Element element = (Element) doc.getElementsByTagName("ModelTagVocabulary").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		else if(partialPath.equalsIgnoreCase("Entities\\ThingShapes"))
		{
			Element element = (Element) doc.getElementsByTagName("ThingShape").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		else if(partialPath.equalsIgnoreCase("Entities\\ThingTemplates"))
		{
			Element element = (Element) doc.getElementsByTagName("ThingTemplate").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		else if(partialPath.equalsIgnoreCase("Entities\\Things"))
		{
			Element element = (Element) doc.getElementsByTagName("Thing").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		else if(partialPath.equalsIgnoreCase("Entities\\Projects"))
		{
			Element element = (Element) doc.getElementsByTagName("Project").item(0);
			System.out.println("getTagName ===== " +element.getTagName());
			updateEntity(element,doc,filePath);
			
		}
		
		 
		 
		
		
	
		
	}
	
	public static void updateEntity(Element element,Document doc,String filePath) throws Exception {
		
		 
		 
		System.out.println("getTagName ===== " + element.getTagName());

		// Adds a new attribute. If an attribute with that name is already
		// present
		// in the element, its value is changed to be that of the value
		// parameter
		element.setAttribute("aspect.isEditableExtensionObject", "true");

		Transformer transformer = TransformerFactory.newInstance().newTransformer();
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty(OutputKeys.METHOD, "xml");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "5");
		DOMSource source = new DOMSource(doc);
		StreamResult result = new StreamResult(new File(filePath));
		transformer.transform(source, result);
		
	
		
	}
	
	
	

}