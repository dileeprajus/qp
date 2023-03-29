package com.cdee.controller.jsontoxsd;

import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.cdee.IEBussinessRulesShape;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.collect.Lists;
import com.thingworx.logging.LogUtilities;

public class Jsons2XsdDefinitions {
	
	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(IEBussinessRulesShape.class);
	
	private final static ObjectMapper mapper = new ObjectMapper();

	private static String prefix = "xsd";

	private static String ns;

	public enum OuterWrapping {
		ELEMENT, TYPE
	}

	private static final Map<String, String> typeMapping = new HashMap<>();

	static {
		// Primitive types
		typeMapping.put("string", "string");
		typeMapping.put("object", "object");
		typeMapping.put("array", "array");
		typeMapping.put("number", "decimal");
		typeMapping.put("boolean", "boolean");
		typeMapping.put("integer", "int");
		typeMapping.put("decimal", "decimal");

		// Non-standard, often encountered in the wild
		typeMapping.put("int", "int");
		typeMapping.put("date-time", "dateTime");
		typeMapping.put("time", "time");
		typeMapping.put("date", "date");

		// TODO: Support "JSON null"

		// String formats
		typeMapping.put("string|uri", "anyURI");
		typeMapping.put("string|email", "string");
		typeMapping.put("string|phone", "string");
		typeMapping.put("string|date-time", "dateTime");
		typeMapping.put("string|date", "date");
		typeMapping.put("string|time", "time");
		typeMapping.put("string|utc-millisec", "long");
		typeMapping.put("string|regex", "string");
		typeMapping.put("string|color", "string");
		typeMapping.put("string|style", "string");
	}

	/**
	 * Convert JSON Schema to XSD
	 * @param jsonSchema the json schema
	 * @param targetNameSpaceUri the tragetNameSpace
	 * @param wrapping the OuterWrapping
	 * @param name
	 * @return XSD Document
	 * @throws IOException
	 */
	public static Document convert(Reader jsonSchema, String targetNameSpaceUri, OuterWrapping wrapping, String name) throws IOException {
		JsonNode rootNode = mapper.readTree(jsonSchema);

		final Document xsdDoc = XmlUtil.newDocument();
		xsdDoc.setXmlStandalone(true);

		final Element schemaRoot = createRootAttrs(xsdDoc, rootNode, null);

		_logger.error(rootNode.asText());
		final String type = rootNode.path("type").textValue();
		Assert.isTrue("object".equals(type), "root should have type=\"object\"");

		if (rootNode.has("properties")) {
			final JsonNode properties = rootNode.get("properties");
			Assert.notNull(properties, "\"properties\" property should be found in root of JSON schema\"");
			doIterate(schemaRoot, properties, getRequiredList(rootNode), schemaRoot, null);
		}

		// handle external of Tags like oneOf
		checkAndHandleOfTags(rootNode, schemaRoot, null);

		// handle external defs
		final JsonNode definitions = rootNode.path("definitions");
		Assert.notNull(definitions, "\"definitions\"  should be found in root of JSON schema\"");

		doIterateDefinitions(schemaRoot, definitions);

		return xsdDoc;
	}

	/**
	 * Add the attributes to the root of xsd.
	 * @param doc the Document
	 * @param node the JsonNode
	 * @return the Root Element
	 */
	private static Element createRootAttrs(Document doc, JsonNode node, Element schemaRoot) {
		Iterator<String> names = node.fieldNames();
		List<String> nameList = Lists.newArrayList(names);
		if (nameList.contains("@xmlns:xsd")) {
			prefix = "xsd";
			schemaRoot = createXsdElement(doc, "xsd:schema");
		} else if (nameList.contains("@xmlns:xs")) {
			prefix = "xs";
			schemaRoot = createXsdElement(doc, "xs:schema");
		} else if (schemaRoot == null) {
			schemaRoot = createXsdElement(doc, "xsd:schema");
		}
		for (int i = 0; i < nameList.size(); i++) {
			final String key = nameList.get(i);
			if (schemaRoot != null && key.startsWith("@")) {
				final String value = node.get(key).asText();
				schemaRoot.setAttribute(key.replace("@", ""), value);
			}
		}
		return schemaRoot;
	}

	/**
	 * Iterate definitions node.
	 * @param elem the Element
	 * @param node the JsonNode
	 */
	private static void doIterateDefinitions(Element elem, JsonNode node) {
		final Iterator<Entry<String, JsonNode>> fieldIter = node.fields();
		while (fieldIter.hasNext()) {
			// Create a complex type to get properties and call doiteration with
			// properties
			final Entry<String, JsonNode> entry = fieldIter.next();
			final String key = entry.getKey();
			final JsonNode val = entry.getValue();
			if (key.equals("Link")) {
				final Element schemaComplexType = createXsdElement(elem, prefix + ":complexType");
				schemaComplexType.setAttribute("name", key);
				final Element href = createXsdElement(schemaComplexType, prefix + ":attribute");
				final Element rel = createXsdElement(schemaComplexType, prefix + ":attribute");
				final Element title = createXsdElement(schemaComplexType, prefix + ":attribute");
				final Element method = createXsdElement(schemaComplexType, prefix + ":attribute");
				final Element type = createXsdElement(schemaComplexType, prefix + ":attribute");

				href.setAttribute("name", "href");
				href.setAttribute("type", "string");

				rel.setAttribute("name", "rel");
				rel.setAttribute("type", "string");

				title.setAttribute("name", "title");
				title.setAttribute("type", "string");

				method.setAttribute("name", "method");
				method.setAttribute("type", "string");

				type.setAttribute("name", "type");
				type.setAttribute("type", "string");
			} else {
				final Element schemaComplexType = createXsdElement(elem, prefix + ":complexType");
				schemaComplexType.setAttribute("name", key);

				if (val.has("properties")) {
					final Element schemaSequence = createXsdElement(schemaComplexType, prefix + ":sequence");
					final JsonNode properties = val.get("properties");
					Assert.notNull(properties, "\"properties\" property should be found in \"" + key + "\"");

					doIterate(schemaSequence, properties, getRequiredList(val), schemaComplexType, null);
				}
				checkAndHandleOfTags(val, schemaComplexType, null);
			}

		}
	}

	/**
	 * Iterate JsonNode
	 * @param elem the Element
	 * @param node the JsonNode
	 * @param requiredList the required List
	 * @param complex the Complex Element
	 * @param keyPrefix the KeyPrefix
	 */
	private static void doIterate(Element elem, JsonNode node, List<String> requiredList, Element complex, String keyPrefix) {
		final Iterator<Entry<String, JsonNode>> fieldIter = node.fields();
		while (fieldIter.hasNext()) {
			final Entry<String, JsonNode> entry = fieldIter.next();
			final String key = entry.getKey();
			final JsonNode val = entry.getValue();
			doIterateSingle(key, val, elem, requiredList.contains(key), complex, keyPrefix);
		}
	}

	/**
	 * Iterate Single JsonNode
	 * @param key the Key
	 * @param val the Value
	 * @param elem the Element
	 * @param required the required
	 * @param complex the Complex Element
	 * @param keyPrefix the KeyPrefix
	 */
	private static void doIterateSingle(String key, JsonNode val, Element elem, boolean required, Element complex,
			String keyPrefix) {
		final String xsdType = determineXsdType(key, val);
		if (key.startsWith("@")) {
			String keyStr = key.contains(":") ? key.split(":")[1] : key;
			final Element attrElem = createXsdElement(complex, prefix + ":attribute");
			attrElem.setAttribute("name", keyStr);
			if (!"object".equals(xsdType) && !"array".equals(xsdType)) {
				attrElem.setAttribute("type", prefix + ":" + xsdType);
			} else {
				attrElem.setAttribute("type", xsdType);
			}
			return;
		}
		final Element nodeElem = createXsdElement(elem, prefix + ":element");

		//Set root schema attribute with keyPrefix.
		if (elem.getNodeName().equalsIgnoreCase(prefix + ":schema") & key.contains(":")) {
			keyPrefix = key.split(":")[0];
			keyPrefix = elem.hasAttribute("xmlns:" + keyPrefix) ? keyPrefix : null;
		}

		if (!"object".equals(xsdType) && !"array".equals(xsdType)) {
			nodeElem.setAttribute("type", prefix + ":" + xsdType);
		}

		//Remove prefix in the name of the element
		if (keyPrefix != null && key.startsWith(keyPrefix + ":")) {
			nodeElem.setAttribute("name", key.split(":")[1]);
			if (xsdType.equalsIgnoreCase("object") && elem.getNodeName().equalsIgnoreCase(prefix + ":schema"))
				nodeElem.setAttribute("type", key);
		} else {
			nodeElem.setAttribute("name", key);
		}

		if (!required) {
			// Not required
			nodeElem.setAttribute("minOccurs", "0");
		}
		handleBasedOnXsdType(xsdType, nodeElem, keyPrefix, val);
	}

	/**
	 * Handle node based on XSDType
	 * @param xsdType the XSDType
	 * @param nodeElem the Element
	 * @param keyPrefix the KeyPrefix
	 * @param val the JsonNode
	 */
	private static void handleBasedOnXsdType(String xsdType, Element nodeElem, String keyPrefix, JsonNode val) {
		switch (xsdType) {
		case "array":
			handleArray(nodeElem, val, keyPrefix);
			break;

		case "decimal":
		case "int":
			handleNumber(nodeElem, xsdType, val);
			break;

		case "enum":
			handleEnum(nodeElem, val);
			break;

		case "object":
			handleObject(nodeElem, val, keyPrefix);
			break;

		case "string":
			handleString(nodeElem, val);
			break;

		case "reference":
			handleReference(nodeElem, val, keyPrefix);
			break;
		}

	}

	/**
	 * 
	 * @param nodeElem
	 * @param val
	 * @param keyPrefix
	 */
	private static void handleReference(Element nodeElem, JsonNode val, String keyPrefix) {
		final JsonNode refs = val.get("$ref");
		nodeElem.removeAttribute("type");
		ns = keyPrefix;
		if (ns == null) {
			ns = "";
		}
		String fixRef = refs.asText().replace("#/definitions/", ns + ":");
		String name;
		if (ns == "") {
			name = fixRef.substring(1);
		} else {
			name = fixRef.substring(ns.length() + 1);
		}
		String oldName = nodeElem.getAttribute("name");

		if (oldName.length() <= 0) {
			nodeElem.setAttribute("name", name);
		}
		nodeElem.setAttribute("type", fixRef);

	}

	/**
	 * Handle String
	 * @param nodeElem the Element
	 * @param val the JsonNode
	 */
	private static void handleString(Element nodeElem, JsonNode val) {
		final Integer minimumLength = getIntVal(val, "minLength");
		final Integer maximumLength = getIntVal(val, "maxLength");
		final String expression = val.path("pattern").textValue();

		if (minimumLength != null || maximumLength != null || expression != null) {
			nodeElem.removeAttribute("type");
			final Element simpleType = createXsdElement(nodeElem, prefix + ":simpleType");
			final Element restriction = createXsdElement(simpleType, prefix + ":restriction");
			restriction.setAttribute("base", "string");

			if (minimumLength != null) {
				final Element min = createXsdElement(restriction, "minLength");
				min.setAttribute("value", Integer.toString(minimumLength));
			}

			if (maximumLength != null) {
				final Element max = createXsdElement(restriction, "maxLength");
				max.setAttribute("value", Integer.toString(maximumLength));
			}

			if (expression != null) {
				final Element max = createXsdElement(restriction, prefix + ":pattern");
				max.setAttribute("value", expression);
			}
		}
	}

	/**
	 * Handle Object
	 * @param nodeElem the Element
	 * @param val the JsonNode
	 * @param keyPrefix the KeyPrefix
	 */
	private static void handleObject(Element nodeElem, JsonNode val, String keyPrefix) {
		final JsonNode properties = val.get("properties");
		if (properties != null) {
			final Element complexType = createXsdElement(nodeElem, prefix + ":complexType");
			final Element sequence = createXsdElement(complexType, prefix + ":sequence");
			Assert.notNull(properties, "'object' type must have a 'properties' attribute");
			doIterate(sequence, properties, getRequiredList(val), complexType, keyPrefix);
		}
		checkAndHandleOfTags(val, nodeElem, keyPrefix);
	}

	/**
	 * Check and handle of Tags like oneOf
	 * @param val the JsonNode
	 * @param nodeElem the Element
	 * @param keyPrefix the KeyPrefix
	 */
	private static void checkAndHandleOfTags(JsonNode val, Element nodeElem, String keyPrefix) {
		if (val.has("oneOf")) {
			final JsonNode oneOf = val.get("oneOf");
			handleOfTag(nodeElem, oneOf, "choice", val, keyPrefix);
		}
		if (val.has("allOf")) {
			final JsonNode allOf = val.get("oneOf");
			handleOfTag(nodeElem, allOf, "all", val, keyPrefix);
		}

		if (val.has("anyOf")) {
			final JsonNode anyOf = val.get("anyOf");
			handleOfTag(nodeElem, anyOf, "any", val, keyPrefix);
		}
	}

	/**
	 * Handle Of Tag like oneOf
	 * @param nodeElem the Element
	 * @param nodeVal the JsonNode
	 * @param suffix the Tag Name
	 * @param rootNode the RootNode
	 * @param keyPrefix the KeyPrefix
	 */
	private static void handleOfTag(final Element nodeElem, final JsonNode nodeVal, String suffix, JsonNode rootNode,
			String keyPrefix) {
		if (!(nodeVal instanceof ArrayNode)) {
			return;
		}
		final Element complexType = createXsdElement(nodeElem, prefix + ":complexType");
		final Element choice = createXsdElement(complexType, prefix + ":" + suffix);
		ArrayNode arrayNode = (ArrayNode) nodeVal;
		for (JsonNode node : arrayNode) {
			Iterator<String> names = node.fieldNames();
			List<String> nameList = Lists.newArrayList(names);
			String xsdType = determineXsdType(nameList.get(0), node);
			Element elem = createXsdElement(choice, prefix + ":element");
			if (nameList.get(0).equals(xsdType)) {
				xsdType = rootNode.path("type").textValue();
			}
			handleBasedOnXsdType(xsdType, elem, keyPrefix, node);
		}
	}

	/**
	 * Handle Enumeration
	 * @param nodeElem the Element
	 * @param val the JsonNode
	 */
	private static void handleEnum(Element nodeElem, JsonNode val) {
		nodeElem.removeAttribute("type");
		final Element simpleType = createXsdElement(nodeElem, prefix + ":simpleType");
		final Element restriction = createXsdElement(simpleType, prefix + ":restriction");
		restriction.setAttribute("base", "string");
		final JsonNode enumNode = val.get("enum");
		for (int i = 0; i < enumNode.size(); i++) {
			final String enumVal = enumNode.path(i).asText();
			final Element enumElem = createXsdElement(restriction, prefix + ":enumeration");
			enumElem.setAttribute("value", enumVal);
		}
	}

	/**
	 * Handle Number
	 * @param nodeElem the Element
	 * @param xsdType the XSDType
	 * @param jsonNode the JsonNode
	 */
	private static void handleNumber(Element nodeElem, String xsdType, JsonNode jsonNode) {
		final Integer minimum = getIntVal(jsonNode, "minimum");
		final Integer maximum = getIntVal(jsonNode, "maximum");

		if (minimum != null || maximum != null) {
			nodeElem.removeAttribute("type");
			final Element simpleType = createXsdElement(nodeElem, prefix + ":simpleType");
			final Element restriction = createXsdElement(simpleType, prefix + ":restriction");
			restriction.setAttribute("base", xsdType);

			if (minimum != null) {
				final Element min = createXsdElement(restriction, prefix + ":minInclusive");
				min.setAttribute("value", Integer.toString(minimum));
			}

			if (maximum != null) {
				final Element max = createXsdElement(restriction, prefix + ":maxInclusive");
				max.setAttribute("value", Integer.toString(maximum));
			}
		}
	}

	/**
	 * Handle Array
	 * @param nodeElem the Element
	 * @param jsonNode the JsonNode
	 * @param keyPrefix the KeyPrefix
	 */
	private static void handleArray(Element nodeElem, JsonNode jsonNode, String keyPrefix) {
		final JsonNode arrItems = jsonNode.path("items");
		final String arrayXsdType = determineXsdType(arrItems.path("type").textValue(), arrItems);
		final Element complexType = createXsdElement(nodeElem, prefix + ":complexType");
		final Element sequence = createXsdElement(complexType, prefix + ":sequence");
		final Element arrElem = createXsdElement(sequence, prefix + ":element");
		if (arrayXsdType.equals("reference")) {
			handleReference(arrElem, arrItems, keyPrefix);
		} else if (arrayXsdType.equals("object")) {
			handleObject(arrElem, arrItems, keyPrefix);
		} else {
			arrElem.setAttribute("name", "item");
			if (!"object".equals(arrayXsdType) && !"array".equals(arrayXsdType)) {
				arrElem.setAttribute("type", prefix + ":" + arrayXsdType);
			} else {
				arrElem.setAttribute("type", arrayXsdType);
			}
		}
		// TODO: Set restrictions for the array type, and possibly recurse into
		// the type if "object"

		// Minimum items
		final Integer minItems = getIntVal(jsonNode, "minItems");
		arrElem.setAttribute("minOccurs", minItems != null ? Integer.toString(minItems) : "0");

		// Max Items
		final Integer maxItems = getIntVal(jsonNode, "maxItems");
		arrElem.setAttribute("maxOccurs", maxItems != null ? Integer.toString(maxItems) : "unbounded");

	}

	/**
	 * Determine XSDType
	 * @param key the key
	 * @param node the JsonNode
	 * @return String
	 */
	private static String determineXsdType(String key, JsonNode node) {
		String jsonType = node.path("type").textValue();
		final String jsonFormat = node.path("format").textValue();
		final boolean isEnum = node.get("enum") != null;
		final boolean isRef = node.get("$ref") != null;
		if (isRef) {
			return "reference";
		} else if (isEnum) {
			return "enum";
		} else {
			String xsdType = getType(jsonType, jsonFormat);
			if (xsdType == null) {
				xsdType = key;
			}
			Assert.notNull(xsdType,
					"Unable to determine XSD type for json type=" + jsonType + ", format=" + jsonFormat);
			return xsdType;
		}

	}

	/**
	 * Get Integer Value
	 * @param node the JsonNode
	 * @param attribute the Attribute
	 * @return Integer
	 */
	private static Integer getIntVal(JsonNode node, String attribute) {
		return node.get(attribute) != null ? node.get(attribute).intValue() : null;
	}

	/**
	 * Create XSD Element
	 * @param element the Element
	 * @param name the Name
	 * @return Element
	 */
	private static Element createXsdElement(Node element, String name) {
		return XmlUtil.createXsdElement(element, name);
	}

	/**
	 * Get Type
	 * @param type the Type
	 * @param format the Format
	 * @return String
	 */
	private static String getType(String type, String format) {
		final String key = (type + (format != null ? ("|" + format) : "")).toLowerCase();
		final String retVal = typeMapping.get(key);
		return retVal;
	}

	/**
	 * Get Required Array
	 * @param jsonNode the JsonNode 
	 * @return List
	 */
	private static List<String> getRequiredList(JsonNode jsonNode) {
		if (jsonNode.path("required").isMissingNode()) {
			return Collections.emptyList();
		}
		Assert.isTrue(jsonNode.path("required").isArray(), "required must have type: string array");
		List<String> requiredList = new ArrayList<>();
		for (JsonNode requiredField : jsonNode.withArray("required")) {
			Assert.isTrue(requiredField.isTextual(), "required must be string");
			requiredList.add(requiredField.asText());
		}
		System.out.println(Arrays.toString(requiredList.toArray()));
		return requiredList;
	}
}
