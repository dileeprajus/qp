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
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.google.gson.Gson;
import com.lcs.wc.flextype.AttributeValueList;
import java.util.Locale;

import com.lcs.wc.change.LCSChangeActivity;
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
import com.lcs.wc.foundation.LCSManaged;
import com.lcs.wc.foundation.LCSObject;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.part.LCSPartQuery;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.foundation.LCSQuery;

import cdee.web.services.GenericObjectService;
//import org.apache.log4j.Logger;

import wt.enterprise.CabinetManaged;
import wt.enterprise.RevisionControlled;
import wt.fc.WTObject;
import wt.log4j.LogR;
import wt.org.WTPrincipalReference;
import java.text.SimpleDateFormat;
import wt.team.Team;
import wt.team.TeamManaged;

public class DataConversionUtil {
	// private static final Logger LOGGER =
	// LogR.getLogger(DataConversionUtil.class.getName());
	// private static final String CLASSNAME = DataConversionUtil.class.getName();

	public JSONObject convertJSONToFlexTypeFormat(JSONObject inputJSON, String objectType, String typeId)
			throws Exception {
		// if (LOGGER.isDebugEnabled())
		// LOGGER.debug((Object) (CLASSNAME + "***** convertJSONToFlexTypeFormat
		// objectType : " + objectType));
		JSONObject schema = GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeId);
		JSONObject propertiesObject = (JSONObject) schema.get("properties");
		AppUtil appUtil = new AppUtil();
		Map<String, String> typeMaps = appUtil.getFlexToJsonMap();
		JSONObject convertedAttrs = new JSONObject();
		for (Object obj : propertiesObject.keySet()) {
			String key = (String) obj;
			JSONObject singleProperty = (JSONObject) propertiesObject.get(key);
			/*
			 * if(singleProperty.containsKey("required") &&
			 * (boolean)singleProperty.get("required") && (!inputJSON.containsKey(key)) &&
			 * (!singleProperty.containsKey("readOnly"))){ throw new
			 * Exception("The attribute "+key+" is Required!!!"); }
			 */
			if (inputJSON.containsKey(key) && (!singleProperty.containsKey("readOnly"))) {
				String type = (String) singleProperty.get("type");
				String flexAttrType = (String) singleProperty.get("flexAttrType");
				String value = "";
				try {
					switch (flexAttrType) {
					case "text":
					case "textArea":
					case "choice":
					case "object_ref":
					case "object_ref_list":
					case "sequence":
					case "date":
					case "uom":
					case "string":
					case "image":
					case "url":
					case "driven":
						value = stringToString(inputJSON, key);
						break;

					case "moaList":
					case "moaEntry":
					case "composite":
						value = arrayToString(inputJSON, key);
						break;

					case "integer":
						value = integerToString(inputJSON, key);
						break;

					case "currency":
					case "float":
						value = floatToString(inputJSON, key);
						break;

					case "boolean":
						value = booleanToString(inputJSON, key);
						break;

					default:
						value = stringToString(inputJSON, key);
					}
				} catch (ClassCastException cce) {
					cce.printStackTrace();
					throw new Exception("Invalid data type for the attribute " + key);
				}
				if (value != "") {
					if (singleProperty.containsKey("attributeName")) {
						convertedAttrs.put((String) singleProperty.get("attributeName"), value);
					} else {
						convertedAttrs.put(key, value);
					}
				}

			}
		}
		return convertedAttrs;
	}

	public JSONObject convertJSONToFlexTypeFormatUpdate(JSONObject inputJSON, String objectType, String typeId)
			throws Exception {
		// if (LOGGER.isDebugEnabled())
		// LOGGER.debug((Object) (CLASSNAME + "***** convertJSONToFlexTypeFormatUpdate
		// objectType : " + objectType));
		JSONObject schema = GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeId);
		JSONObject propertiesObject = (JSONObject) schema.get("properties");
		AppUtil appUtil = new AppUtil();
		Map<String, String> typeMaps = appUtil.getFlexToJsonMap();
		String typeIdRequired = "false";
		if (inputJSON.containsKey("enableTypeId")) {
			typeIdRequired = (String) inputJSON.get("enableTypeId");
		}
		JSONObject convertedAttrs = new JSONObject();
		for (Object obj : propertiesObject.keySet()) {
			String key = (String) obj;
			JSONObject singleProperty = (JSONObject) propertiesObject.get(key);
			/*
			 * if(singleProperty.containsKey("required") &&
			 * (boolean)singleProperty.get("required") && (!inputJSON.containsKey(key)) &&
			 * (!singleProperty.containsKey("readOnly"))){ throw new
			 * Exception("The attribute "+key+" is Required!!!"); }
			 */
			if (inputJSON.containsKey(key) && (!singleProperty.containsKey("readOnly"))) {
				String type = (String) singleProperty.get("type");
				String flexAttrType = (String) singleProperty.get("flexAttrType");
				String value = "";
				try {
					switch (flexAttrType) {
					case "text":
					case "textArea":
					case "choice":
					case "object_ref":
					case "object_ref_list":
					case "sequence":
					case "date":
					case "uom":
					case "string":
					case "image":
					case "url":
					case "driven":
						value = stringToString(inputJSON, key);
						break;

					case "moaList":
					case "moaEntry":
					case "composite":
						value = arrayToString(inputJSON, key);
						break;

					case "integer":
						value = integerToString(inputJSON, key);
						break;

					case "currency":
					case "float":
						value = floatToString(inputJSON, key);
						break;

					case "boolean":
						value = booleanToString(inputJSON, key);
						break;

					default:
						value = stringToString(inputJSON, key);
					}
				} catch (ClassCastException cce) {
					cce.printStackTrace();
					throw new Exception("Invalid data type for the attribute " + key);
				} catch (Exception ce) {
					ce.printStackTrace();
					throw new Exception("Invalid data type for the attribute " + key);
				}
				if (value != "") {
					if (singleProperty.containsKey("attributeName")) {
						String attName = (String) singleProperty.get("attributeName");
						if ((attName.equalsIgnoreCase("typeId")) && typeIdRequired.equalsIgnoreCase("false")) {
							// Dont add typeID in payload
						} else
							convertedAttrs.put((String) singleProperty.get("attributeName"), value);
					} else {
						convertedAttrs.put(key, value);
					}
				}

			}
		}
		return convertedAttrs;
	}

	private String stringToString(JSONObject inputJson, String key) throws Exception {
		String value = (String) inputJson.get(key);
		return value;
	}

	private String arrayToString(JSONObject inputJson, String key) throws Exception {
		String stringValue = "";
		JSONArray inputArray = (JSONArray) inputJson.get(key);
		for (int i = 0; i < inputArray.size(); i++) {
			stringValue = stringValue + inputArray.get(i).toString() + "|~*~|";
		}
		return stringValue;
	}

	private String floatToString(JSONObject inputJson, String key) throws Exception {
		double value;
		try {
			value = (double) inputJson.get(key);
		} catch (ClassCastException ex) {
			int intValue = (int) (long) inputJson.get(key);
			Double doubleValue = Double.valueOf(intValue);
			value = (double) doubleValue;
		}

		return Double.toString(value);
	}

	private String integerToString(JSONObject inputJson, String key) throws Exception {
		int value;
		try {
			value = (int) (long) inputJson.get(key);

		} catch (ClassCastException ex) {
			double doubleValue = (double) inputJson.get(key);
			value = (int) doubleValue;

		}

		return value + "";
	}

	private String booleanToString(JSONObject inputJson, String key) throws Exception {
		boolean value = (boolean) inputJson.get(key);
		return value + "";
	}

	public boolean checkIfMultiType(String key, String objectType, String typeId) throws Exception {
		try {
			JSONObject schema = GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeId);

			JSONObject propertiesObject = (JSONObject) schema.get("properties");

			if (propertiesObject.containsKey(key)) {
				JSONObject singleProperty = (JSONObject) propertiesObject.get(key);
				String flexAttrType = (String) singleProperty.get("flexAttrType");
				if (flexAttrType.equalsIgnoreCase("multiobject"))
					return true;

			}

		} catch (Exception e) {
		}
		return false;
	}

	public JSONObject convertFlexTypesToJSONFormat(JSONObject inputJSON, String objectType, String typeId)
			throws Exception {
		try {
			JSONObject schema = GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeId);

			JSONObject propertiesObject = (JSONObject) schema.get("properties");

			for (Object str : inputJSON.keySet()) {
				String key = (String) str;
				if (propertiesObject.containsKey(key)) {
					JSONObject singleProperty = (JSONObject) propertiesObject.get(key);
					String flexAttrType = (String) singleProperty.get("flexAttrType");
				
					try {
						switch (flexAttrType) {
						// case "text":
						// case "textArea":
						// case "choice":
						case "object_ref":
							String stValue = inputJSON.get(key).toString();
							stValue = stValue.replaceAll("\\n|\\n", " ");
							inputJSON.put(key, stValue);
							break;
						case "date":
							inputJSON.put(key, inputJSON.get(key).toString());
							break;
						case "object_ref_list":
							inputJSON.put(key, inputJSON.get(key).toString());
							break;
						// case "multiobject":inputJSON.put(key,inputJSON.get(key).toString());break;
						case "url":
							inputJSON.put(key, stringToString(inputJSON, key));
							break;
						case "multiobject":
							try {
								String multiJson = inputJSON.get(key).toString();
								// JSONObject newMulJson = new JSONObject();
								JSONObject mulJson = new JSONObject();
								mulJson.put(key, inputJSON.get(key));

								

								String strv = String.valueOf(mulJson);
								JSONParser parser = new JSONParser();
								JSONObject json = (JSONObject) parser.parse(strv);
								JSONObject newMulJson = new JSONObject();
								for (Object key1 : json.keySet()) {
									Object value = json.get(key1);
									// String strv = String.valueOf(mulJson);
									if (value instanceof JSONObject) {
										JSONObject innerJson = (JSONObject) value;
										String strv1 = String.valueOf(innerJson);
										JSONParser parser1 = new JSONParser();
										innerJson = (JSONObject) parser1.parse(strv1);
										JSONObject newinnerJson = (JSONObject) value;
										// innerJson = value;
										for (Object key11 : innerJson.keySet()) {
											String strKey = key11.toString();
											strKey = "R" + strKey;
											newinnerJson.put(strKey, innerJson.get(key11));
											newinnerJson.remove(key11.toString());
											inputJSON.put(key1, newinnerJson);
										}

									}
									if (value instanceof JSONArray) {
										// if (LOGGER.isDebugEnabled())
										// LOGGER.debug((Object) (CLASSNAME + "***** value instance of JSONArray: " +
										// value));
									}
									if (value instanceof String) {
										// if (LOGGER.isDebugEnabled())
										// LOGGER.debug((Object) (CLASSNAME + "***** value instance of String: " +
										// value));
									}

								}

								break;
							} catch (Exception e) {
							}

						default:
							break;
						}
					} catch (ClassCastException cce) {
						// if (LOGGER.isDebugEnabled())
						// LOGGER.debug((Object) (CLASSNAME + "***** Invalid data type for the
						// attribute: " + key));
						throw new Exception("Invalid data type for the attribute " + key);
					}
				}

			}
		} catch (Exception e) {
		}
		String targetOid = (String) inputJSON.get("oid");
		try {
			JSONObject userJson = getSystemUserData(targetOid);
			for (Object key11 : userJson.keySet()) {
				String strKey = key11.toString();
				inputJSON.put(strKey, userJson.get(key11));

			}

		} catch (Exception ex) {

		}
		return inputJSON;
	}

	private JSONArray stringToArray(JSONObject inputJson, String key) throws Exception {
		JSONArray respArray = new JSONArray();
		String inputValue = (String) inputJson.get(key);
		String[] words = inputValue.split("\\|\\~\\*\\~\\|");
		for (String word : words) {
			if (word != "") {
				respArray.add(word);
			}
		}
		return respArray;
	}

	private int stringToInteger(JSONObject inputJson, String key) throws Exception {
		String value = (String) inputJson.get(key);
		return Integer.parseInt(value);
	}

	private float stringToFloat(JSONObject inputJson, String key) throws Exception {
		String value = (String) inputJson.get(key);
		return Float.parseFloat(value);
	}

	private boolean stringToBoolean(JSONObject inputJson, String key) throws Exception {
		String value = (String) inputJson.get(key);
		return Boolean.parseBoolean(value);
	}

	public JSONObject getSystemUserData(String targetoid) throws Exception {
		JSONObject jSONuserObject = new JSONObject();
		WTObject obj = (WTObject) new LCSPartQuery().findObjectById(targetoid);
		String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		
		if (obj instanceof RevisionControlled) {
			RevisionControlled rc = (RevisionControlled) obj;
			String versionVal = VersionHelper.getFullVersionIdentifierValue(rc);
			String lifeCycleStateLabel = rc.getLifeCycleState().getDisplay();
			String lifeCycleNameLabel = rc.getLifeCycleName();
			String dateCreatedLabel = FormatHelper.applyFormat(rc.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT");
			String creatorFullName = rc.getCreatorFullName();
			String dateupdateLabel = FormatHelper.applyFormat(rc.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			String updatedFullName = rc.getModifierFullName();
			jSONuserObject.put("version", versionVal);
			jSONuserObject.put("lifecycleState", lifeCycleStateLabel);
			jSONuserObject.put("lifecycleName", lifeCycleNameLabel);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			jSONuserObject.put("createdBy", creatorFullName);
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			jSONuserObject.put("lastUpdatedBy", updatedFullName);
			String updated = sdf.format(rc.getModifyTimestamp());
			jSONuserObject.put("orderingTimestamp", updated);

		} else if (obj instanceof LCSManaged) {
			LCSManaged managed = (LCSManaged) obj;
			String lifeCycleStateLabel = managed.getLifeCycleState().getDisplay();
			String lifeCycleNameLabel = managed.getLifeCycleName();
			String dateCreatedLabel = FormatHelper.applyFormat(managed.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT");
			String creatorFullName = managed.getCreatorFullName();
			String dateupdateLabel = FormatHelper.applyFormat(managed.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			WTPrincipalReference wpr = managed.getModifier();
			String name = "UNKNOWN";
			if (wpr != null) {
				if (wpr.getFullName() != null) {
					name = wpr.getFullName();
				} else {
					name = wpr.getIdentity();
				}
			}
			String updatedFullName = name;
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			jSONuserObject.put("createdBy", creatorFullName);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			jSONuserObject.put("lifecycleState", lifeCycleStateLabel);
			jSONuserObject.put("lifecycleName", lifeCycleNameLabel);
			jSONuserObject.put("lastUpdatedBy", updatedFullName);
			String updated = sdf.format(managed.getModifyTimestamp());
			jSONuserObject.put("orderingTimestamp", updated);

		} else if (obj instanceof CabinetManaged) {
			CabinetManaged ca = (CabinetManaged) obj;
			String name = ca.getName();

			String lifeCycleState = ca.getLifeCycleState().getDisplay();
			String dateCreatedLabel = FormatHelper.applyFormat(ca.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT");
			String dateCreatednamel = ca.getCreatorFullName();
			String dateModiName = FormatHelper.applyFormat(ca.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			String creatorFullName = ca.getCreatorFullName();
			String lifeCycleNameLabel = ca.getLifeCycleName();
			String lifeCycleStateLabel = ca.getLifeCycleState().getDisplay();
			String dateupdateLabel = FormatHelper.applyFormat(ca.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			jSONuserObject.put("createdBy", creatorFullName);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			jSONuserObject.put("lifecycleState", lifeCycleStateLabel);
			jSONuserObject.put("lifecycleName", lifeCycleNameLabel);
			jSONuserObject.put("lastUpdatedBy", name);
			String updated = sdf.format(ca.getModifyTimestamp());
			jSONuserObject.put("orderingTimestamp", updated);

		} else if (obj instanceof LCSChangeActivity) {
			LCSChangeActivity cactivity = (LCSChangeActivity) obj;
			String name = cactivity.getName();

			String lifeCycleState = cactivity.getLifeCycleState().getDisplay();
			String dateCreatedLabel = FormatHelper.applyFormat(cactivity.getCreateTimestamp(),
					"DATE_TIME_STRING_FORMAT");
			String dateCreatednamel = cactivity.getCreatorFullName();
			String dateModiName = FormatHelper.applyFormat(cactivity.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			String creatorFullName = cactivity.getCreatorFullName();
			String lifeCycleNameLabel = cactivity.getLifeCycleName();
			String lifeCycleStateLabel = cactivity.getLifeCycleState().getDisplay();
			String dateupdateLabel = FormatHelper.applyFormat(cactivity.getModifyTimestamp(),
					"DATE_TIME_STRING_FORMAT");
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			jSONuserObject.put("createdBy", creatorFullName);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			jSONuserObject.put("lifecycleState", lifeCycleStateLabel);
			jSONuserObject.put("lifecycleName", lifeCycleNameLabel);
			jSONuserObject.put("lastUpdatedBy", name);

		} else if (obj instanceof LCSObject) {
			LCSObject lcsObject = (LCSObject) obj;
			// String name = lcsObject.getName();

			// String lifeCycleState = lcsObject.getLifeCycleState().getDisplay();
			String dateCreatedLabel = FormatHelper.applyFormat(lcsObject.getCreateTimestamp(),
					"DATE_TIME_STRING_FORMAT");
			// String dateCreatednamel =lcsObject.getCreatorFullName();
			String dateModiName = FormatHelper.applyFormat(lcsObject.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			// String creatorFullName = lcsObject.getCreatorFullName();
			// String lifeCycleNameLabel = lcsObject.getLifeCycleName();
			// String lifeCycleStateLabel = lcsObject.getLifeCycleState().getDisplay();
			String dateupdateLabel = FormatHelper.applyFormat(lcsObject.getCreateTimestamp(),
					"DATE_TIME_STRING_FORMAT");
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			// jSONuserObject.put("createdBy" , creatorFullName);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			// String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
			// SimpleDateFormat sdf = new SimpleDateFormat(pattern);
			String updated = sdf.format(lcsObject.getModifyTimestamp());

			jSONuserObject.put("orderingTimestamp", updated);
			// jSONuserObject.put("lifecycleState" , lifeCycleStateLabel);
			// jSONuserObject.put("lifecycleName" , lifeCycleNameLabel);
			// jSONuserObject.put("lastUpdatedBy" , name);

		} else if (obj instanceof TeamManaged) {
			TeamManaged teamManaged = (TeamManaged) obj;

			Team team = wt.team.TeamHelper.service.getTeam(teamManaged);
			// String lifeCycleState = lcsObject.getLifeCycleState().getDisplay();
			String dateCreatedLabel = FormatHelper.applyFormat(team.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT");
			// String dateCreatednamel =lcsObject.getCreatorFullName();
			String dateModiName = FormatHelper.applyFormat(team.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT");
			// String creatorFullName = lcsObject.getCreatorFullName();
			// String lifeCycleNameLabel = lcsObject.getLifeCycleName();
			// String lifeCycleStateLabel = lcsObject.getLifeCycleState().getDisplay();
			String dateupdateLabel = FormatHelper.applyFormat(team.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT");
			jSONuserObject.put("modifiedOn", dateupdateLabel);
			// jSONuserObject.put("createdBy" , creatorFullName);
			jSONuserObject.put("createdOn", dateCreatedLabel);
			// String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
			// SimpleDateFormat sdf = new SimpleDateFormat(pattern);
			String updated = sdf.format(team.getModifyTimestamp());

			jSONuserObject.put("orderingTimestamp", updated);
			// jSONuserObject.put("lifecycleState" , lifeCycleStateLabel);
			// jSONuserObject.put("lifecycleName" , lifeCycleNameLabel);
			// jSONuserObject.put("lastUpdatedBy" , name);
		}

		return jSONuserObject;
	}

}