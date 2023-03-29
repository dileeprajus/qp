/*
 * Created on 06/07/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.util;

import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.WTSFlexTypeAttribute;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.google.gson.Gson;
import com.lcs.wc.flextype.AttributeValueList;
import java.util.Locale;
import com.lcs.wc.client.web.FlexTypeGenerator;
import cdee.web.services.schema.CreateFlexSchemaService;
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.color.LCSColorQuery;
import java.io.File;
import java.io.FileReader;
import wt.util.WTProperties;
import org.json.simple.parser.JSONParser;
import java.io.IOException;
import java.util.Set;
import com.lcs.wc.flextype.FlexTyped;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.util.FormatHelper;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.exceptions.FlexTypeNotFoundException;
import java.io.FileNotFoundException;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.LCSProperties;
import com.lcs.wc.document.FileRenamer;
import com.lcs.wc.document.ImageFolderManager;
import com.lcs.wc.document.ImageFolderManager.Path;
import com.lcs.wc.util.FileLocation;
import com.lcs.wc.util.FileUploadHelper;

import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import wt.util.WTException;
import wt.util.WTMessage;
import wt.util.WTProperties;
import com.lcs.wc.util.LCSException;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.util.RB;
import wt.enterprise.RevisionControlled;
import wt.fc.Persistable;
import wt.vc.wip.WorkInProgressHelper;
import wt.vc.wip.Workable;
//import org.apache.log4j.Logger;
import wt.log4j.LogR;

public class AppUtil {
	//private static final Logger LOGGER = LogR.getLogger(AppUtil.class.getName());
  	//private static final String CLASSNAME = AppUtil.class.getName();
	Map<String, String> typeMaps = new HashMap<String, String>();

	public AppUtil() {
		typeMaps.put("constant", "string");
		typeMaps.put("choice", "string");
		typeMaps.put("textArea", "string");
		typeMaps.put("sequence", "string");
		typeMaps.put("date", "string");
		typeMaps.put("object_ref", "string");
		typeMaps.put("object_ref_list", "string");
		typeMaps.put("text", "string");
		typeMaps.put("uom", "string");
		typeMaps.put("moaList", "array");
		typeMaps.put("moaEntry", "array");
		typeMaps.put("multiobject", "string");
		typeMaps.put("careWashImages", "string");
		typeMaps.put("derivedString", "string");
		typeMaps.put("composite", "array");
		typeMaps.put("currency", "number");
		typeMaps.put("integer", "number");
		typeMaps.put("float", "number");
		typeMaps.put("driven", "string");
		typeMaps.put("userList", "string");
		typeMaps.put("image", "string");
		typeMaps.put("url", "string");
	}

	/**
	 * This method is used to get attributes related to the given scope
	 * 
	 * @param type
	 *            flex type
	 * @param scope
	 *            String
	 * @exception Exception
	 * @return Map Returns all the attributes for the given flex type for the
	 *         given scope
	 */
	public Map getScopeAttributes(FlexType type, String scope) throws Exception {
		Collection attCollection = type.getAllAttributes();
		Map attrs = new HashMap();
		Iterator resultsAttsIter = attCollection.iterator();
		FlexTypeAttribute att = null;
		while (resultsAttsIter.hasNext()) {
			att = (FlexTypeAttribute) resultsAttsIter.next();
			if (att.getAttScope().equals(scope)) {
				attrs.put(att.getAttKey().toString(), att.getAttributeName().toString());
			}
		}
		return attrs;
	}

	/**
	 * This method is used to list of all attributes for a given flex type
	 * 
	 * @param type
	 * @exception Exception
	 * @return Map Returns all the attributes for the given flex type
	 */
	public Map getAttributes(FlexType type) throws FlexTypeNotFoundException, Exception {
		 //if (LOGGER.isDebugEnabled())
    	{
         //LOGGER.debug((Object) (CLASSNAME + "***** getAttributes.of.type: " + type));
        }
		Map attrs = new HashMap();
		try {
			if (type != null) {
				Collection attCollection = type.getAllAttributes();
				Iterator resultsAttsIter = attCollection.iterator();
				while (resultsAttsIter.hasNext()) {
					FlexTypeAttribute att = (FlexTypeAttribute) resultsAttsIter.next();
					attrs.put(att.getAttKey(), att.getAttributeName());
				}
			} else {
				throw new FlexTypeNotFoundException(
						"Please enter a valid flexType otherwise we are unable to get the Attributes");
			}
		} catch (Exception e) {
			throw e;
		}
		return attrs;
	}

	/**
	 * This method is used to set the values to attributes for the selected flex
	 * type
	 * 
	 * @param attrsMap
	 *            contains list of attributes
	 * @param jsonObject
	 *            jsonObject
	 * @exception Exception
	 * @return Map Contains attributeNames as keys and values as value.
	 */
	public Map setJsonAttributes(Map attrsMap, JSONObject jsonObject) throws Exception {
		Map attrs = new HashMap();
		try {
			for (Object str : attrsMap.keySet()) {
				if (jsonObject.get(str.toString()) == null) {
				} else {
					attrs.put(attrsMap.get(str.toString()), (String) jsonObject.get(str.toString()));
				}
			}
		} catch (Exception e) {
			throw e;
		}
		return attrs;
	}

	/**
	 * @param String
	 *            typeId
	 * @param JSONObject
	 *            attrsJson
	 * @exception Exception
	 * @return Map
	 */
	public Map getObjectAttributes(String typeId, JSONObject attrsJson)
			throws TypeIdNotFoundException, FlexTypeNotFoundException, Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getObjectAttributes.of.typeId: " + typeId));
        
		Map objAttrs = new HashMap();
		try {
			if (typeId != null && typeId != "") {
				objAttrs = getAttributes(FlexTypeCache.getFlexType(typeId));
				objAttrs = setJsonAttributes(objAttrs, attrsJson);
				objAttrs.put("typeId", typeId);
			} else {
				throw new TypeIdNotFoundException("TypeId not found");
			}
		} catch (FlexTypeNotFoundException fe) {
			throw fe;
		} catch (Exception e) {
			throw e;
		}

		return objAttrs;
	}

	public ArrayList getOidFromSeachCriteria(String type, JSONObject searchJsonObect, JSONObject payloadJsonObject)
			throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getOidFromSeachCriteria " ));
		CreateFlexSchemaService flexSchemaService = new CreateFlexSchemaService();
		FlexType flexType = null;
		String oid = "";

		if (searchJsonObect.size() > 0) {
			if (payloadJsonObject.get("typeId") == null) {
				if ("POM".equalsIgnoreCase(type)) {
					flexType = FlexTypeCache.getFlexTypeFromPath("Measurements");
				} else {
					flexType = FlexTypeCache.getFlexTypeFromPath(type);
				}
			} else {
				flexType = FlexTypeCache.getFlexType(payloadJsonObject.get("typeId").toString());

			}

			try {
				if (type.equalsIgnoreCase("Full Size Range")) {
					oid = flexSchemaService.searchByName(type, (String) searchJsonObect.get("name"));
				} else if (type.equalsIgnoreCase("Size Category")) {
					oid = flexSchemaService.searchByName(type, (String) searchJsonObect.get("name"));
				} else {
					oid = flexSchemaService.searchByCriteria(type, searchJsonObect);
				}

			} catch (Exception e) {
				e.printStackTrace();
				//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getOidFromSeachCriteria no record found" ));
				oid = "no record";
			}
		} else
			oid = "no record";
		ArrayList list = new ArrayList();
		try {
			list.add(payloadJsonObject);
			if (payloadJsonObject.get("typeId") != null) {
				list.add(payloadJsonObject.get("typeId").toString());
			} else {
				list.add("");
			}
			list.add(oid);
		} catch (Exception e) {
			throw e;
		}
		return list;
	}

	/**
	 * This method is used to return oid, attributes, typeid that are stored in
	 * list object
	 * 
	 * @param attrsJson
	 *            input jsonObject for selected flex type
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return ArrayList contains oid, attributes, typeid values
	 */
	public ArrayList getOidFromName(String type, JSONObject attrsJson) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getOidFromName " ));
		CreateFlexSchemaService flexSchemaService = new CreateFlexSchemaService();
		FlexType flexType = null;
		if (attrsJson.get("typeId") == null) {
			if ("POM".equalsIgnoreCase(type)) {
				flexType = FlexTypeCache.getFlexTypeFromPath("Measurements");
			} else {
				flexType = FlexTypeCache.getFlexTypeFromPath(type);
			}
		} else {
			flexType = FlexTypeCache.getFlexType(attrsJson.get("typeId").toString());
		}
		String oid = "";
		String transKindName = "";
		try {
			if (type.equalsIgnoreCase("Full Size Range")) {
				oid = flexSchemaService.searchByName(type, "name");
			} else {
				transKindName = flexType.getAttribute("name").getAttKey();
				oid = flexSchemaService.searchByName(type, attrsJson.get(transKindName).toString());
			}

		} catch (Exception e) {
			oid = "no record";
		}
		ArrayList list = new ArrayList();
		try {

			list.add(attrsJson);
			if (attrsJson.get("typeId") != null) {
				list.add(attrsJson.get("typeId").toString());
			} else {
				list.add("");
			}
			list.add(oid);
		} catch (Exception e) {
			throw e;
		}
		return list;
	}

	/**
	 * @param String
	 *            type
	 * @param JSONObject
	 *            attrs
	 * @exception Exception
	 * @return Map
	 */
	public Map getAttributesFromScope(String type, JSONObject attrs) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getAttributesFromScope " ));
		FlexType selectedFlexType = FlexTypeCache.getFlexType(attrs.get("typeId").toString());
		Map objAttrs = getScopeAttributes(selectedFlexType, type);
		objAttrs = setJsonAttributes(objAttrs, attrs);
		objAttrs.put("typeId", attrs.get("typeId").toString());
		return objAttrs;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getResponse(String oid, String type, JSONObject responseObject) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getResponse construct a response " ));
		CreateFlexSchemaService schemaService = new CreateFlexSchemaService();
		JSONObject objectData = schemaService.getRecordByOid(type, oid, null);
		responseObject = getResponseObject(type, oid, responseObject);
		responseObject.put("objectData", objectData);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getInsertResponse(String oid, String type, JSONObject responseObject) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getInsertResponse " ));
		CreateFlexSchemaService schemaService = new CreateFlexSchemaService();
		JSONObject objectData = schemaService.getRecordByOid(type, oid, null);
		responseObject = getInsertResponseObject(type, oid, responseObject);
		responseObject.put("objectData", objectData);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getUpdateResponse(String oid, String type, JSONObject responseObject) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getUpdateResponse " ));
		CreateFlexSchemaService schemaService = new CreateFlexSchemaService();
		JSONObject objectData = schemaService.getRecordByOid(type, oid, null);
		responseObject = getUpdateResponseObject(type, oid, responseObject);
		responseObject.put("objectData", objectData);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getResponseObject(String flexType, String selectedOid, JSONObject responseObject) {
		responseObject.put("status", "Success");
		responseObject.put("message", flexType + " object updated successfully");
		responseObject.put("statusCode", 200);
		responseObject.put("oid", selectedOid);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getUpdateResponseObject(String flexType, String selectedOid, JSONObject responseObject) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getUpdateResponseObject " ));
		responseObject.put("status", "Success");
		responseObject.put("message", flexType + " object updated successfully");
		responseObject.put("statusCode", 200);
		responseObject.put("oid", selectedOid);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getInsertResponseObject(String flexType, String selectedOid, JSONObject responseObject) {
		responseObject.put("status", "Success");
		responseObject.put("message", flexType + " object inserted successfully");
		responseObject.put("statusCode", 200);
		responseObject.put("oid", selectedOid);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param oid
	 * @param responseObject
	 *            response jsonObject
	 * @param type
	 *            selected flex object
	 * @exception Exception
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getDeleteResponseObject(String flexType, String selectedOid, JSONObject responseObject) {
		responseObject.put("status", "Success");
		responseObject.put("message", flexType + " object deleted successfully");
		responseObject.put("statusCode", 200);
		responseObject.put("oid", selectedOid);
		return responseObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param String
	 *            msg
	 * @return JSONObject contains response object in the form of json.
	 */
	public JSONObject getExceptionJson(String msg) {

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("status", "Failed");
		jsonObject.put("message", msg);
		jsonObject.put("statusCode", 400);
		return jsonObject;
	}

	/**
	 * This method is used to build response in the form of JSON object
	 * 
	 * @param SearchResults
	 *            results
	 * @paramString objectType
	 * @return JSONObject contains response object in the form of json.
	 */
	// This method is used to call schema reponse
	public JSONObject getResponseFromResults(SearchResults results, String objectType) {
		JSONObject object = new JSONObject();
		object.put("TotalRecords", results.getResultsFound());
		object.put("FromIndex", results.getFromIndex());
		object.put("ToIndex", results.getToIndex());
		object.put(objectType, results.getResults());
		return object;
	}

	/**
	 * @param JSONObject
	 *            jsonObject
	 * @return String contains response object in the form of json.
	 */
	public String convertGsonToJson(JSONObject jsonObject) {
		Gson gson = new Gson();
		return gson.toJson(jsonObject);
	}

	/**
	 * @param JSONObject
	 *            jsonObject
	 * @param Map
	 *            criteriaMap
	 * @return Map contains response object.
	 */
	// This method is used to convert json to Map for schema
	public Map convertJsonToMap(JSONObject jsonObject, Map criteriaMap) {
		Map criteria = jsonObjectToMap(jsonObject);
		criteria.put("fromIndex", criteriaMap.get("fromIndex").toString());
		criteria.put("toIndex", criteriaMap.get("toIndex").toString());
		return criteria;
	}

	/**
	 * @param JSONObject
	 *            jsonObject
	 * @return Map contains response object.
	 */
	public Map jsonObjectToMap(JSONObject jsonObject) {
		Map map = new HashMap();
		for (Object str : jsonObject.keySet()) {
			map.put(str.toString(), (String) jsonObject.get(str.toString()));
		}
		return map;
	}

	/**
	 * @description get the all FlexObject through out Application
	 * @method getFlexObjects
	 * @return {Collection}
	 */
	public Collection getFlexObjects() throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjects " ));
		// jsp file name
		// D:\Windchill\codebase\rfa\custom\flexdemo\jsp\main\sideMenu.jsp

		Collection flexObjectsCollection = new ArrayList();
		ArrayList<String> flexObjects = new ArrayList<String>();
		flexObjects.add("BOM");
		flexObjects.add("BOM Link");
		flexObjects.add("Business Object");
		flexObjects.add("Color");
		flexObjects.add("Colorway");
		flexObjects.add("Colorway Size");
		flexObjects.add("Construction");
		flexObjects.add("Country");
		flexObjects.add("Document");
		flexObjects.add("Effectivity Context");
		flexObjects.add("Last");
		flexObjects.add("Material");
		flexObjects.add("Measurements");
		//flexObjects.add("Media");
		flexObjects.add("Material Supplier");
		flexObjects.add("Palette");
		flexObjects.add("Palette to Color");
		flexObjects.add("Palette to Material");		
		flexObjects.add("Placeholder");
		flexObjects.add("Plan");
		flexObjects.add("Product");
		flexObjects.add("Product Season Link");
		flexObjects.add("RFQ");
		flexObjects.add("Sample");
		flexObjects.add("Season");
		flexObjects.add("Size Definition");
		flexObjects.add("Colorway Season Link");
		flexObjects.add("Supplier");
		flexObjects.add("Test Specification");
		flexObjects.add("Cost Sheet Product");
		flexObjects.add("Sourcing Configuration");
		flexObjects.add("Specification");
		flexObjects.add("Image(read only)");
		flexObjects.add("Material Color");
		flexObjects.add("Season Group(read only)");
		flexObjects.add("Sourcing Configuration to Season");
		flexObjects.add("Sourcing Configuration to Colorway");
		flexObjects.add("Colorway Size to Season");
		flexObjects.add("Cost Sheet Colorway");
		flexObjects.add("Log Entry");
		flexObjects.add("Revisable Entity");
		flexObjects.add("Palette to Material Color Link");	
		flexObjects.add("Sample Request");
		flexObjects.add("Colorway Size to Source");		
		flexObjects.add("Material Pricing");
		flexObjects.add("Order Confirmation");
		flexObjects.add("Retail Component");
		Collections.sort(flexObjects);
		flexObjectsCollection = flexObjects;
		return flexObjectsCollection;
	}

	/**
	 * @description get the all Linked FlexObject through out Application
	 * @method getFlexLinkObjects
	 * @return {Collection}
	 */
	public Collection getFlexLinkObjects() {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getFlexLinkObjects check for link objects not to send trigger " ));
		Collection flexObjects = new ArrayList();
		
		flexObjects.add("Product Season Link");
		flexObjects.add("Colorway Season Link");
		
		return flexObjects;
	}

	/**
	 * This method is used return list of data types that used classify
	 * 
	 * @return ArrayList It returns list of particular data types
	 */
	public ArrayList getAttributeVariableTypes() {
		ArrayList arrayList = new ArrayList();
		arrayList.add("integer");
		arrayList.add("currency");
		arrayList.add("sequence");
		arrayList.add("float");
		arrayList.add("uom");
		arrayList.add("sequence");
		return arrayList;
	}

	/**
	 * This method is used return the info of the input attribute in JSONObject
	 * form. This method is used when the attribute type is date
	 * 
	 * @param attribute
	 *            FlexTypeAttribute
	 * @return JSONObject It returnsdetails of given attribute
	 */
	public JSONObject setDateAttributeList(FlexTypeAttribute attribute) {
		JSONObject attributeObject = new JSONObject();
		JSONObject from = new JSONObject();
		JSONArray searchIndexes = new JSONArray();
		from.put("from", attribute.getSearchCriteriaIndex() + "FromDateString");
		from.put("to", attribute.getSearchCriteriaIndex() + "ToDateString");
		searchIndexes.add(from);
		attributeObject.put("required", attribute.isAttRequired());
		WTSFlexTypeAttribute wtsFlexTypeAttribute = (WTSFlexTypeAttribute) attribute;
		attributeObject.put("column name", wtsFlexTypeAttribute.getColumnName());
		attributeObject.put("scope", attribute.getAttScope());
		attributeObject.put("searchCriteriaIndex", searchIndexes);
		attributeObject.put("groupName", attribute.getAttGroup());
		attributeObject.put("attributeName", attribute.getAttributeName());
		attributeObject.put("flexAttrType", attribute.getAttVariableType());
		attributeObject.put("title", attribute.getAttDisplay());
		return attributeObject;
	}

	/**
	 * This method is used return the info of the input attribute in JSONObject
	 * form.
	 * 
	 * @param attribute
	 *            FlexTypeAttribute
	 * @return JSONObject It returnsdetails of given attribute
	 */
	public JSONObject setOtherAttributeList(FlexTypeAttribute attribute) {
		JSONObject attributeObject = new JSONObject();
		JSONObject from = new JSONObject();
		JSONArray searchIndexes = new JSONArray();
		from.put("from", attribute.getSearchCriteriaIndex() + "From");
		from.put("to", attribute.getSearchCriteriaIndex() + "To");
		searchIndexes.add(from);
		attributeObject.put("required", attribute.isAttRequired());
		WTSFlexTypeAttribute wtsFlexTypeAttribute = (WTSFlexTypeAttribute) attribute;
		attributeObject.put("column name", wtsFlexTypeAttribute.getColumnName());
		attributeObject.put("scope", attribute.getAttScope());
		attributeObject.put("searchCriteriaIndex", searchIndexes);
		attributeObject.put("groupName", attribute.getAttGroup());
		attributeObject.put("attributeName", attribute.getAttributeName());
		attributeObject.put("flexAttrType", attribute.getAttVariableType());
		attributeObject.put("title", attribute.getAttDisplay());
		attributeObject.put("maximum", attribute.getAttUpperLimit() + "");
		attributeObject.put("minimum", attribute.getAttLowerLimit() + "");
		attributeObject.put("default", attribute.getAttSearchDefaultValue() + "");
		attributeObject.put("islowerLimit", attribute.isAttUseLowerLimit() + "");
		attributeObject.put("isupperLimit", attribute.isAttUseUpperLimit() + "");
		return attributeObject;
	}

	/**
	 * This method is used return the input attribute in JSONObject form.
	 * 
	 * @param typeId
	 * @param attributeName
	 * @return JSONObject It returnsdetails of given attribute
	 */
	public JSONObject getObjectRefAttributeList(String typeId, String attributeName) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getObjectRefAttributeList  " ));
		JSONObject attributeObject = new JSONObject();
		// commented for Object reference List (Option list)
		try {
			FlexType flexType = FlexTypeCache.getFlexType(typeId);
			FlexTypeAttribute attribute = flexType.getAttribute(attributeName);
			FlexTypeGenerator flexg = new FlexTypeGenerator();
			Map refList = flexg.getObjectRefListTable(attribute);
			if (refList != null) {
				JSONArray refListArray = new JSONArray();
				JSONArray refListArrayDisplayValues = new JSONArray();
				for (Object obj : refList.keySet()) {
					String key = (String) obj;
					// JSONArray refObj=new JSONArray();
					refListArray.add(key);
					refListArrayDisplayValues.add((String) refList.get(key));
					// refListArray.add(refObj);
				}
				attributeObject.put("enum", refListArray);
				attributeObject.put("enumDisplayNames", refListArrayDisplayValues);
			}
		} catch (Exception e) {
			attributeObject.put("Message", e.getMessage());
		}
		return attributeObject;
	}

	/**
	 * This method is used return the info of the input attribute in JSONObject
	 * form. This method is called when the attribute type is object_ref,etc.,.
	 * 
	 * @param attribute
	 *            FlexTypeAttribute which contains the attribute present in the
	 *            getAttributeVariableTypes()
	 * @return JSONObject It returnsdetails of given attribute
	 */
	public JSONObject setObjectRefAttributeList(FlexTypeAttribute attribute) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** setObjectRefAttributeList  " ));
		JSONObject attributeObject = new JSONObject();
		attributeObject.put("required", attribute.isAttRequired());
		WTSFlexTypeAttribute wtsFlexTypeAttribute = (WTSFlexTypeAttribute) attribute;
		attributeObject.put("column name", wtsFlexTypeAttribute.getColumnName());
		attributeObject.put("scope", attribute.getAttScope());
		attributeObject.put("searchCriteriaIndex", null);
		attributeObject.put("groupName", attribute.getAttGroup());
		attributeObject.put("title", attribute.getAttDisplay());
		attributeObject.put("attributeName", attribute.getAttributeName());
		attributeObject.put("flexAttrType", attribute.getAttVariableType());
		try {
			FlexType treeNodeFlexType = attribute.getRefType();
			String rootChildName = treeNodeFlexType.getFullNameDisplay(true);
			String treeNodeTypeId = FormatHelper.getObjectId(treeNodeFlexType);
			attributeObject.put("typeId", treeNodeTypeId);
			attributeObject.put("typeName", rootChildName);
		} catch (Exception e) {

		}
		return attributeObject;
	}

	/**
	 * This method is used return the info of the input attribute in JSONObject
	 * form.
	 * 
	 * @param attribute
	 *            FlexTypeAttribute
	 * @return JSONObject It returnsdetails of given attribute
	 */
	public JSONObject setAttributeValueListDetails(FlexTypeAttribute attribute) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** setAttributeValueListDetails  " ));
		JSONObject attributeObject = new JSONObject();
		if (attribute.getAttValueList() != null) {
			AttributeValueList attrsValues = attribute.getAttValueList();
			JSONArray optionList = new JSONArray();
			JSONArray optionListDisplayValues = new JSONArray();
			Locale ourLocale = new Locale("en", "US");
			Collection keys = attrsValues.getSelectableKeys(ourLocale, true);
			// Collection keys=attrsValues.getKeys();
			Iterator keyitr = keys.iterator();
			while (keyitr.hasNext()) {
				JSONArray option = new JSONArray();
				String tempKey = (String) keyitr.next();
				optionList.add(tempKey);
				optionListDisplayValues.add(attrsValues.getValue(tempKey, ourLocale));
			}
			attributeObject.put("enum", optionList);
			attributeObject.put("enumDisplayNames", optionListDisplayValues);
		}
		attributeObject.put("required", attribute.isAttRequired());
		WTSFlexTypeAttribute wtsFlexTypeAttribute = (WTSFlexTypeAttribute) attribute;
		attributeObject.put("column name", wtsFlexTypeAttribute.getColumnName());
		attributeObject.put("scope", attribute.getAttScope());
		attributeObject.put("groupName", attribute.getAttGroup());
		attributeObject.put("attributeName", attribute.getAttributeName());
		attributeObject.put("flexAttrType", attribute.getAttVariableType());
		attributeObject.put("title", attribute.getAttDisplay());
		attributeObject.put("searchCriteriaIndex", attribute.getSearchCriteriaIndex());
		// for derived type
		if (attribute.getAttVariableType().equals("derivedString")) {
			try {
				attributeObject.put("derivedFrom", attribute.getAttDerivedFrom());
			} catch (Exception e) {

			}
		}
		return attributeObject;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns createdFromDateAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setCreatedFromDateAttributes(String flexTypePrefix) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** setCreatedFromDateAttributes  " ));
		JSONObject createdFromAttr = new JSONObject();
		createdFromAttr.put("searchCriteriaIndex", flexTypePrefix.toUpperCase() + "_" + "CREATESTAMPA2FromDateString");
		createdFromAttr.put("flexAttrType", "date");
		createdFromAttr.put("title", "CreatedFrom");
		createdFromAttr.put("readOnly", true);
		return createdFromAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns createdToDateAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setCreatedToDateAttributes(String flexTypePrefix) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** setCreatedToDateAttributes  " ));
		JSONObject createdToAttr = new JSONObject();
		createdToAttr.put("searchCriteriaIndex", flexTypePrefix.toUpperCase() + "_" + "CREATESTAMPA2ToDateString");
		createdToAttr.put("flexAttrType", "date");
		createdToAttr.put("title", "CreatedTo");
		createdToAttr.put("readOnly", true);
		return createdToAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns updatedFromDateAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setUpdatedFromDateAttributes(String flexTypePrefix) {
		JSONObject updatedFromAttr = new JSONObject();
		updatedFromAttr.put("searchCriteriaIndex", flexTypePrefix.toUpperCase() + "_" + "MODIFYSTAMPA2FromDateString");
		updatedFromAttr.put("flexAttrType", "date");
		updatedFromAttr.put("title", "UpdatedFrom");
		updatedFromAttr.put("readOnly", true);
		return updatedFromAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns updatedToDateAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setUpdatedToDateAttributes(String flexTypePrefix) {
		JSONObject updatedToAttr = new JSONObject();
		updatedToAttr.put("searchCriteriaIndex", flexTypePrefix.toUpperCase() + "_" + "MODIFYSTAMPA2ToDateString");
		updatedToAttr.put("flexAttrType", "date");
		updatedToAttr.put("title", "UpdatedTo");
		updatedToAttr.put("readOnly", true);
		return updatedToAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns lifeCycleAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setLifeCycleAttributes(String flexTypePrefix) {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("searchCriteriaIndex", flexTypePrefix.toUpperCase() + "_" + "STATESTATEOptions");
		lifeCycleAttr.put("flexAttrType", "date");
		lifeCycleAttr.put("title", "LifeCycle");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns IDA2A2Attribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject setIDA2A2Attribute() {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("flexAttrType", "string");
		lifeCycleAttr.put("title", "IDA2A2");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns TypeHierarchyName details of given
	 *         flexTypePrefix
	 */
	public JSONObject setTypeHierarchyName() {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("flexAttrType", "string");
		lifeCycleAttr.put("title", "typeHierarchyName");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns HierarchyName details of given
	 *         flexTypePrefix
	 */
	public JSONObject setHierarchyName() {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("flexAttrType", "string");
		lifeCycleAttr.put("title", "hierarchyName");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns HierarchyName details of given
	 *         flexTypePrefix
	 */
	public JSONObject setCreatedOn() {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("flexAttrType", "date");
		lifeCycleAttr.put("title", "Created On");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns HierarchyName details of given
	 *         flexTypePrefix
	 */
	public JSONObject setModifiedOn() {
		JSONObject lifeCycleAttr = new JSONObject();
		lifeCycleAttr.put("flexAttrType", "date");
		lifeCycleAttr.put("title", "Modified On");
		lifeCycleAttr.put("readOnly", true);
		return lifeCycleAttr;
	}

	/**
	 * This method is used form the schema of given attributes in JSONObject
	 * form Using this method we can get the information of attributes in JSON.
	 * 
	 * @param attrsList
	 *            Collection
	 * @param attributesObj
	 *            JSONObject
	 * @return JSONObject It returns attributes details
	 */
	public JSONObject getAttributesData(Collection attrsList, JSONObject newattributesObj) {
		String flexTypePrefix = "";
		Iterator attrsListItr = attrsList.iterator();
		JSONObject attributesObjdata = (JSONObject) newattributesObj.clone();
		while (attrsListItr.hasNext()) {
			try {
				FlexTypeAttribute attribute = (FlexTypeAttribute) attrsListItr.next();
				if (attribute.getAttVariableType().equalsIgnoreCase("date")) {
					attributesObjdata.put(attribute.getAttKey(), setDateAttributeList(attribute));
				} else if (getAttributeVariableTypes().contains(attribute.getAttVariableType())) {
					attributesObjdata.put(attribute.getAttKey(), setOtherAttributeList(attribute));
				} else if (attribute.getAttVariableType().equalsIgnoreCase("object_ref_list")
						|| attribute.getAttVariableType().equalsIgnoreCase("object_ref")) {
					attributesObjdata.put(attribute.getAttKey(), setObjectRefAttributeList(attribute));
				} else {
					attributesObjdata.put(attribute.getAttKey(), setAttributeValueListDetails(attribute));
					try {
						flexTypePrefix = attribute.getQueryColumn().getTableName();
					} catch (Exception e) {

					}
				}
			} catch (Exception e) {
			}
		}
		attributesObjdata.put("typeId", setSchemaTypeId());
		attributesObjdata.put("oid", setSchemaOId());
		attributesObjdata.put("createdFrom", setCreatedFromDateAttributes(flexTypePrefix));
		attributesObjdata.put("createdTo", setCreatedToDateAttributes(flexTypePrefix));
		attributesObjdata.put("updatedFrom", setUpdatedFromDateAttributes(flexTypePrefix));
		attributesObjdata.put("updatedTo", setUpdatedToDateAttributes(flexTypePrefix));
		attributesObjdata.put("lifeCycleState", setLifeCycleAttributes(flexTypePrefix));
		attributesObjdata.put("IDA2A2", setIDA2A2Attribute());
		attributesObjdata.put("typeHierarchyName", setTypeHierarchyName());
		attributesObjdata.put("hierarchyName", setHierarchyName());
		attributesObjdata.put("createdOn", setCreatedOn());
		attributesObjdata.put("modifiedOn", setModifiedOn());
		attributesObjdata = santizeForJsonDraft(attributesObjdata);

		return attributesObjdata;
	}
	
	
	public JSONObject getAttributesDataT(Collection attrsList, JSONObject attributesObj) {

        String flexTypePrefix = "";

        Iterator attrsListItr = attrsList.iterator();

        JSONObject newCloneObject = (JSONObject) attributesObj.clone();



                                                                         

        while (attrsListItr.hasNext()) {

               try {

                     FlexTypeAttribute attribute = (FlexTypeAttribute) attrsListItr.next();

                     if (attribute.getAttVariableType().equalsIgnoreCase("date")) {

                            newCloneObject.put(attribute.getAttKey(), setDateAttributeList(attribute));

                     } else if (getAttributeVariableTypes().contains(attribute.getAttVariableType())) {

                            newCloneObject.put(attribute.getAttKey(), setOtherAttributeList(attribute));

                     } else if (attribute.getAttVariableType().equalsIgnoreCase("object_ref_list")

                                    || attribute.getAttVariableType().equalsIgnoreCase("object_ref")) {

                            newCloneObject.put(attribute.getAttKey(), setObjectRefAttributeList(attribute));

                     } else {

                            newCloneObject.put(attribute.getAttKey(), setAttributeValueListDetails(attribute));

                            try {

                                   flexTypePrefix = attribute.getQueryColumn().getTableName();

                            } catch (Exception e) {



                            }

                     }

               } catch (Exception e) {

               }

        }

        newCloneObject.put("typeId", setSchemaTypeId());

        newCloneObject.put("oid", setSchemaOId());

        newCloneObject.put("createdFrom", setCreatedFromDateAttributes(flexTypePrefix));

        newCloneObject.put("createdTo", setCreatedToDateAttributes(flexTypePrefix));

        newCloneObject.put("updatedFrom", setUpdatedFromDateAttributes(flexTypePrefix));

        newCloneObject.put("updatedTo", setUpdatedToDateAttributes(flexTypePrefix));

        newCloneObject.put("lifeCycleState", setLifeCycleAttributes(flexTypePrefix));

        newCloneObject.put("IDA2A2", setIDA2A2Attribute());

        newCloneObject.put("typeHierarchyName", setTypeHierarchyName());

        newCloneObject.put("hierarchyName", setHierarchyName());

        newCloneObject.put("createdOn", setCreatedOn());

        newCloneObject.put("modifiedOn", setModifiedOn());

        return santizeForJsonDraft(newCloneObject);



 }

	public Map getFlexToJsonMap() {
		return typeMaps;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param attributesObj
	 *            JSONObject
	 * @return JSONObject It returns the santized attributes data in json format
	 */
	private JSONObject santizeForJsonDraft(JSONObject attributesObj) {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** santizeForJsonDraft  " ));
		JSONObject santizedObj = new JSONObject();
		for (Object obj : attributesObj.keySet()) {
			String key = (String) obj;
			JSONObject indObject = (JSONObject) attributesObj.get(key);
			String flexAttrKey = (String) indObject.get("flexAttrType");
			if (typeMaps.containsKey(flexAttrKey)) {
				String jsonType = (String) typeMaps.get(flexAttrKey);
				if (jsonType.equals("array")) {
					JSONObject arrayTypeJson = new JSONObject();
					arrayTypeJson.put("type", "string");
					indObject.put("items", arrayTypeJson);
				}
				indObject.put("type", jsonType);
			} else {
				indObject.put("type", flexAttrKey);
			}
			if (flexAttrKey.equals("constant") || flexAttrKey.equals("derivedString")
					|| flexAttrKey.equals("multiobject")) {
				indObject.put("readOnly", true);
			}
			santizedObj.put(key, indObject);
		}
		return santizedObj;
	}

	/**
	 * This method is used return the static attribute info
	 * 
	 * @param flexTypePrefix
	 *            String
	 * @return JSONObject It returns typeID details of given flexTypePrefix
	 */
	public JSONObject setSchemaTypeId() {
		JSONObject createdFromAttr = new JSONObject();
		createdFromAttr.put("flexAttrType", "string");
		createdFromAttr.put("title", "typeId");
		createdFromAttr.put("required", true);
		createdFromAttr.put("attributeName", "typeId");
		createdFromAttr.put("searchCriteriaIndex", "typeId");
		return createdFromAttr;
	}

	/**
	 * This method is used return the static attribute SchemaOId info
	 * 
	 * @return JSONObject It returns OID details of given flexTypePrefix
	 */
	public JSONObject setSchemaOId() {
		JSONObject createdFromAttr = new JSONObject();
		createdFromAttr.put("type", "string");
		createdFromAttr.put("flexAttrType", "string");
		createdFromAttr.put("title", "oid");
		createdFromAttr.put("readOnly", true);
		return createdFromAttr;
	}

	/**
	 * This method is used return the static attribute SchemaVId info
	 * 
	 * @return JSONObject It returns VID details of given flexTypePrefix
	 */
	public JSONObject setSchemaVId() {
		JSONObject createdFromAttr = new JSONObject();
		createdFromAttr.put("type", "string");
		createdFromAttr.put("flexAttrType", "string");
		createdFromAttr.put("title", "VID");
		createdFromAttr.put("readOnly", true);
		return createdFromAttr;
	}

	/**
	 * This method is used to get the object data for the given type and oid,
	 * 
	 * @param oid
	 *            String
	 * @param objectType
	 *            String
	 * @exception Exception
	 * @return JSONObject It returns response object
	 */
	public JSONObject getEncodedImage(JSONObject triggerObject, String objectType, String mediaType) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** getEncodedImage  " ));
		JSONObject objectData = (JSONObject) triggerObject.get("objectData");
		JSONObject recJsonObject = (JSONObject) objectData.get(objectType);
		if (mediaType.equals("base64")) {
			String imageURL = (String) recJsonObject.get("image");
			if (imageURL != null) {
				String imageString = "";
				try {
					if (FormatHelper.hasContent(imageURL)) {
						imageURL = imageURL.trim();
						imageURL = imageURL.replace("/Windchill/images/", "");
						imageURL = imageURL.trim();
						imageURL = FileLocation.imageLocation.trim() + FileLocation.fileSeperator.trim() + imageURL;
						//if (LOGGER.isDebugEnabled())
    	         			//LOGGER.debug((Object) (CLASSNAME + "***** getEncodedImage imageURL "+imageURL ));
						File f = new File(imageURL);
						FileInputStream fis = new FileInputStream(f);
						byte byteArray[] = new byte[(int) f.length()];
						fis.read(byteArray);
						byte[] bytesEncoded = Base64.getEncoder().encode(byteArray);
						imageString = new String(bytesEncoded);
					}
				} catch (Exception e) {
					throw new Exception(e);
				}
				recJsonObject.put("encodedImage", imageString);
				objectData.put(objectType, recJsonObject);
				triggerObject.put("objectData", objectData);
			}
		}
		return triggerObject;
	}

	/**
	 * This method is used to get the object data for the given type and oid,
	 * 
	 * @param oid
	 *            String
	 * @param objectType
	 *            String
	 * @exception Exception
	 * @return JSONObject It returns response object
	 */
	public JSONObject getEncodedImage(JSONObject recJsonObject, String mediaType) throws Exception {
		
		if (mediaType == null) {
			return recJsonObject;
		}
		if (mediaType.equals("base64")) {
			String imageURL = (String) recJsonObject.get("image");
			if (imageURL != null) {
				String imageString = "";
				try {
					if (FormatHelper.hasContent(imageURL)) {
						imageURL = imageURL.trim();
						imageURL = imageURL.replace("/Windchill/images/", "");
						imageURL = imageURL.trim();
						imageURL = FileLocation.imageLocation.trim() + FileLocation.fileSeperator.trim() + imageURL;
						File f = new File(imageURL);
						//if (LOGGER.isDebugEnabled())
    	         			//LOGGER.debug((Object) (CLASSNAME + "***** getEncodedImage imageURL "+imageURL ));
						FileInputStream fis = new FileInputStream(f);
						byte byteArray[] = new byte[(int) f.length()];
						fis.read(byteArray);
						byte[] bytesEncoded = Base64.getEncoder().encode(byteArray);
						imageString = new String(bytesEncoded);
					}
				} catch (Exception e) {
					throw new Exception(e);
				}
				recJsonObject.put("encodedImage", imageString);
			
			}
		}
		return recJsonObject;
	}

	/**
	 * This method is returns configured json
	 * 
	 * @return JSONObject It returns lifeCycleAttribute details of given
	 *         flexTypePrefix
	 */
	public JSONObject getConfigureJSON() throws FileNotFoundException, IOException, Exception {
		JSONObject responseObject = new JSONObject();
		try{
			if (!TRCCache.isInitialized()) 
			{
			TRCCache.refresh();
			}
			responseObject = TRCCache.getRelationCache();
		}catch(Exception e){
			throw e;
		}
		return responseObject;
	}

	/**
	 * @param JSONObject
	 *            inputJson
	 * @param JSONObject
	 *            schemaJson
	 * @return Map mapped attrs
	 */
	public Map setAttrsFromSchema(JSONObject inputJson, JSONObject schemaJson) {
		JSONObject propJson = (JSONObject) schemaJson.get("properties");
		Map attrs = new HashMap();
		for (Object obj : inputJson.keySet()) {
			try {
				String key = (String) obj;
				JSONObject singleJsonObject = (JSONObject) propJson.get(key);
				if (singleJsonObject != null) {
					if (singleJsonObject.containsKey("attributeName")) {
						attrs.put((String) singleJsonObject.get("attributeName"), convertValueToString(inputJson, key));
					} else {
						attrs.put(key, convertValueToString(inputJson, key));
					}
				}
			} catch (Exception e) {
				//if (LOGGER.isDebugEnabled())
    	         	//LOGGER.debug((Object) (CLASSNAME + "***** Exception: " + e.getMessage()));
			}
		}
		return attrs;
	}

	/**
	 * @param JSONObject
	 *            inputJson
	 * @param String
	 *            key
	 * @return String
	 */

	public String convertValueToString(JSONObject inputJson, String key) {
		String stringValue = "";
		Object obj = inputJson.get(key);
		if (obj instanceof JSONArray) {
			JSONArray inputArray = (JSONArray) obj;
			for (int i = 0; i < inputArray.size(); i++) {
				stringValue = stringValue + inputArray.get(i).toString() + "|~*~|";
			}
		} else {
			stringValue = obj.toString();
		}
		return stringValue;
	}

	// checkAssociation
	public boolean checkAssociation(JSONObject inputJson) {
		boolean stringValue = false;
		if (inputJson.containsKey("includes")) {
			JSONObject includesJsonObject = (JSONObject) inputJson.get("includes");
			if (includesJsonObject.size() > 0)
				stringValue = true;

		}
		return stringValue;
	}
	// createAssociation
	
	public boolean checkValidationJson(JSONObject inputJson) {
		boolean stringValue = false;
		if (inputJson.containsKey("validation")) {
			//JSONObject validateJsonObject = (JSONObject) inputJson.get("validation");
			//if (validateJsonObject.size() > 0)
				stringValue = true;

		}
		return stringValue;
	}

	public JSONObject createAssociation(String objectType, String oid, JSONObject includes) {
		JSONObject createAssociatedObj = new JSONObject();
		JSONArray inputsArray = new JSONArray();
		JSONObject inputObject = new JSONObject();
		JSONObject objectTypeJson = new JSONObject();
		objectTypeJson.put("oid", oid);
		objectTypeJson.put("includes", includes);
		inputObject.put(objectType, objectTypeJson);
		inputsArray.add(inputObject);
		createAssociatedObj.put("inputs", inputsArray);
		return createAssociatedObj;
	}

	/**
	 * @param JSONObject
	 *            attributeJson
	 * @param String
	 *            objectType
	 * @return JSONObject
	 */
	public JSONObject getModifiedJson(JSONObject attributesObject, String objectType) {
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** getModifiedJson "));
		String flexAppend = getSearchCriteriaObject(objectType);
		if (attributesObject.containsKey("createDateFrom")) {
			attributesObject.put(flexAppend + "_CREATESTAMPA2FromDateString",
					(String) attributesObject.get("createDateFrom"));
			attributesObject.remove("createDateFrom");
		}
		if (attributesObject.containsKey("createDateTo")) {
			attributesObject.put(flexAppend + "_CREATESTAMPA2ToDateString",
					(String) attributesObject.get("createDateTo"));
			attributesObject.remove("createDateTo");
		}
		if (attributesObject.containsKey("modifiedDateTo")) {
			attributesObject.put(flexAppend + "_MODIFYSTAMPA2ToDateString",
					(String) attributesObject.get("modifiedDateTo"));
			attributesObject.remove("modifiedDateTo");
		}
		if (attributesObject.containsKey("modifiedDateFrom")) {
			attributesObject.put(flexAppend + "_MODIFYSTAMPA2FromDateString",
					(String) attributesObject.get("modifiedDateFrom"));
			attributesObject.remove("modifiedDateFrom");
		}

		return attributesObject;
	}

	public String getSearchCriteriaObject(String objectType) {
		JSONObject object = getFlexObjectType();
		String flexString = "";
		if (object.containsKey(objectType))
			flexString = (String) object.get(objectType);
		return flexString;
	}

	public JSONObject getFlexObjectType() {
		JSONObject flexObjects = new JSONObject();
		flexObjects.put("BOM", "FLEXBOMPART");
		flexObjects.put("BOM Link", "FLEXBOMLINK");
		flexObjects.put("Business Object", "LCSLIFECYCLEMANAGED");
		flexObjects.put("Color", "LCSCOLOR");
		flexObjects.put("Colorway", "LCSSKU");
		flexObjects.put("Colorway Size", "SKUSIZE");
		flexObjects.put("Material", "LCSMATERIAL");
		// flexObjects.put("Construction","LCSCONSTRUCTIONINFO","LCSCONSTRUCTIONDETAIL");
		flexObjects.put("Country", "LCSCOUNTRY");
		flexObjects.put("Document", "LCSDOCUMENT");
		flexObjects.put("Effectivity Context", "EFFECTIVITYCONTEXT");
		flexObjects.put("Last", "LCSLAST");
		flexObjects.put("Material", "LCSMATERIAL");
		flexObjects.put("Measurements", "LCSMEASUREMENTS");
		flexObjects.put("Media", "LCSMEDIA");
		flexObjects.put("Material Supplier", "LCSMATERIALSupplier");
		flexObjects.put("Palette", "LCSPALETTE");
		flexObjects.put("Placeholder", "PLACEHOLDER");
		flexObjects.put("Plan", "FLEXPLAN");
		flexObjects.put("Product", "LCSPRODUCT");
		flexObjects.put("Product Season Link", "LCSPRODUCTSEASONLINK");
		flexObjects.put("RFQ", "RFQREQUEST");
		flexObjects.put("Sample", "LCSSAMPLE");
		flexObjects.put("Season", "LCSSEASON");
		flexObjects.put("Size Definition", "PRODUCTSIZECATEGORY");
		flexObjects.put("Colorway Season Link", "LCSSKUSEASONLINK");
		flexObjects.put("Supplier", "LCSSUPPLIER");
		flexObjects.put("Test Specification", "TESTSPECIFICATION");
		flexObjects.put("Colorway", "LCSSKU");
		flexObjects.put("Cost Sheet Product", "LCSPRODUCTCOSTSHEET");
		flexObjects.put("Sourcing Configuration", "LCSSOURCINGCONFIG");
		flexObjects.put("Specification", "FLEXSPECIFICATION");
		flexObjects.put("Image(read only)", "LCSIMAGE");
		flexObjects.put("Material Color", "LCSMATERIALCOLOR");
		flexObjects.put("Season Group(read only)", "SEASONGROUP");
		flexObjects.put("Sourcing Configuration to Season", "LCSSOURCETOSEASONLINK");
		// flexObjects.put("Sourcing Configuration to Colorway");
		flexObjects.put("Colorway Size to Season", "SKUSIZETOSEASON");
		flexObjects.put("Cost Sheet Colorway", "LCSPRODUCTCOSTSHEET");
		flexObjects.put("SKU Size Source","SKUSizeSource");

		return flexObjects;
	}

	/**
	 * This method is used to set Image attribute to all flex objects
	 * 
	 * @param fileName
	 *            oid of an item(type) to update
	 * @param thumbnail
	 * @exception Exception
	 * @return String file name of image saved
	 * @throws IOException
	 * @throws WTException
	 */

	public String setImage(String fileName, String thumbnail) throws IOException, WTException {
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** setImage "));
		String true_file_name = FormatHelper.replaceCharacter(fileName, " ", "_");
		true_file_name = URLEncoder.encode(true_file_name,
				LCSProperties.get("com.lcs.wc.util.CharsetFilter.Charset", "UTF-8"));
		String images_file_path = "";
		String overridePath = "";
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** setImage true_file_name "+true_file_name));
		if (LCSProperties.get("com.lcs.wc.content.imagefilePathOverride") != null) {
			if (FormatHelper.hasContent(FormatHelper
					.formatOSFolderLocation(LCSProperties.get("com.lcs.wc.content.imagefilePathOverride")))) {
				overridePath = FormatHelper
						.formatOSFolderLocation(LCSProperties.get("com.lcs.wc.content.imagefilePathOverride"));
				images_file_path = overridePath;
			}
		} else {
			final WTProperties wt_properties = WTProperties.getLocalProperties();
			final String wt_home = wt_properties.getProperty("wt.home");
			images_file_path = wt_home + FormatHelper.formatOSFolderLocation(
					LCSProperties.get("com.lcs.wc.content.imagefilePath", "\\codebase\\images"));
		}
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** setImage images_file_path "+images_file_path));

		final String image_url = LCSProperties.get("com.lcs.wc.content.imageURL", "/Windchill/images");
		ImageFolderManager IMAGE_FOLDER_MANAGER = new ImageFolderManager(image_url, images_file_path);
		Path current_image_folder_path = IMAGE_FOLDER_MANAGER.findCurrentFolderPath();
		File finalFile = new File(current_image_folder_path.getFile(), true_file_name);

		final String ALLOWED_RASTER_TYPES = LCSProperties.get("com.lcs.wc.document.imageGeneration.rasterFileTypes",
				"");
		final String ALLOWED_VECTOR_TYPES = LCSProperties.get("com.lcs.wc.document.imageGeneration.vectorFileTypes",
				"");
		try {
			FileUploadHelper.verifyFileExtForUpload(ALLOWED_RASTER_TYPES, FileUploadHelper.getTrueFileName(fileName));
		} catch (LCSException e) {
			String errorMessage = WTMessage.getLocalizedMessage(RB.MAIN, "badImageFormat_MSG", RB.objA);
			throw new WTException(errorMessage);
		}
		// FileUploadHelper.verifyFileExtForUpload(ALLOWED_RASTER_TYPES + "," +
		// ALLOWED_VECTOR_TYPES, finalFile);

		finalFile = FileRenamer.rename(finalFile);
		byte[] decodedBytes = Base64.getDecoder().decode(thumbnail);
		FileOutputStream fos = new FileOutputStream(finalFile);
		fos.write(decodedBytes);
		fos.close();
		// Check the try catch
		String aFileName = IMAGE_FOLDER_MANAGER.getRelativeURL(finalFile.getAbsolutePath());
		//if (LOGGER.isDebugEnabled())
    	         	//LOGGER.debug((Object) (CLASSNAME + "***** FileName: " + aFileName));
		return aFileName;
	}

	public Map getAttributesFromScopeLevel(String scope, String level, JSONObject attrs) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** getAttributesFromScopeLevel "));
		FlexType selectedFlexType = FlexTypeCache.getFlexType(attrs.get("typeId").toString());
		Map objAttrs = getScopeLevelAttributes(selectedFlexType, scope, level);
		objAttrs = setJsonAttributes(objAttrs, attrs);
		objAttrs.put("typeId", attrs.get("typeId").toString());
		return objAttrs;
	}

	public Map getScopeLevelAttributes(FlexType type, String scope, String level) throws Exception {
		//if (LOGGER.isDebugEnabled())
    	    //LOGGER.debug((Object) (CLASSNAME + "***** getScopeLevelAttributes "));
		Collection attCollection = type.getAllAttributes();
		Map attrs = new HashMap();
		Iterator resultsAttsIter = attCollection.iterator();
		FlexTypeAttribute attribute = null;
		while (resultsAttsIter.hasNext()) {
			attribute = (FlexTypeAttribute) resultsAttsIter.next();
			if (scope.equalsIgnoreCase("PRODUCT-SEASON") && level.equalsIgnoreCase("PRODUCT")) {
				if (attribute.getAttScope().equals("PRODUCT-SEASON")
						&& (attribute.getAttObjectLevel().equals("PRODUCT-SKU")
								|| attribute.getAttObjectLevel().equals("PRODUCT"))) {
					attrs.put(attribute.getAttKey().toString(), attribute.getAttributeName().toString());
				}
			}  else if (scope.equalsIgnoreCase("SOURCE_TO_SEASON_SCOPE") && level.equalsIgnoreCase("PRODUCT")) {
				if (attribute.getAttScope().equals("SOURCE_TO_SEASON_SCOPE")|| attribute.getAttObjectLevel().equals("PRODUCT")) {
					attrs.put(attribute.getAttKey().toString(), attribute.getAttributeName().toString());
				}
			}else if (scope.equalsIgnoreCase("PRODUCT-SEASON") && level.equalsIgnoreCase("SKU")) {
				if (attribute.getAttScope().equals("PRODUCT-SEASON")
						&& (attribute.getAttObjectLevel().equals("PRODUCT-SKU")
								|| attribute.getAttObjectLevel().equals("SKU"))) {
					attrs.put(attribute.getAttKey().toString(), attribute.getAttributeName().toString());
				}
			}
		}
		return attrs;
	}

	public static String getVR(Persistable object) {
		String VR = "";
		try {
			if (WorkInProgressHelper.isWorkingCopy((Workable) object)) {
				
				VR = FormatHelper.getVersionId((RevisionControlled) VersionHelper.getOriginalCopy((Workable) object));
			} else {
				
				VR = FormatHelper.getVersionId((RevisionControlled) object);
			}
		} catch (WTException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return VR;
	}

}