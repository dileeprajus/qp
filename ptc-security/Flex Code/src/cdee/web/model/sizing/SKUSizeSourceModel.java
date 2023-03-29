/*
 * Created on 06/06/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.sizing;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.fc.WTObject;
import wt.util.WTException;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.sourcing.LCSSKUSourcingLink;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.util.IntrospectionHelper;
import com.lcs.wc.skusize.SKUSizeToSeason;
import com.lcs.wc.skusize.SKUSizeToSeasonMaster;
import com.lcs.wc.skusize.SKUSize;
import com.lcs.wc.skusize.SKUSizeMaster;
import com.lcs.wc.skusize.SKUSizeSource;
import com.lcs.wc.skusize.SKUSizeSourceMaster;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.skusize.SKUSizeQuery;
import com.lcs.wc.skusize.SKUSizeToSeasonClientModel;
import com.lcs.wc.skusize.SKUSizeSourceClientModel;
import com.lcs.wc.skusize.SKUSizeClientModel;

public class SKUSizeSourceModel extends GenericObjectService {

	AppUtil util = new AppUtil();
	Gson gson = new Gson();

	/**
	 * This method is used either insert or update the SkuSizeSeasonLink flex object
	 * that are passed by using type as reference, oid and array of different
	 * SkuSizeSeasonLink data Using this method we can insert/update several records
	 * of a SkuSizeSeasonLink flextype at a time.
	 * 
	 * @param type                       String
	 * @param oid                        String
	 * @param SkuSizeSeasonLinkJSONArray Contains array of SkuSizeSeasonLink data
	 * @exception Exception
	 * @return JSONArray It returns SkuSizeSeasonLink JSONArray object
	 */

	public JSONObject saveOrUpdate(String type, String oid, JSONObject skuSizeSeasonJSONData, JSONObject payloadJson)
			throws Exception {
		JSONObject responseObject = new JSONObject();
		try {
			if (oid == null) {
				// ArrayList list = util.getOidFromSeachCriteria(type,
				// skuSizeSeasonJSONData,payloadJson);
				responseObject = createSkuSizeSource(type, payloadJson);

			} else {
				responseObject = updateSkuSizeSource(
						util.getAttributesFromScope("SKU_SIZE_SEASON_SOURCE_SCOPE", payloadJson), type, oid);

			}
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to insert the SkuSizeSeasonLink flex object that are
	 * passed by using type as reference. Using this method we can insert several
	 * records of a SkuSizeSeasonLink flextype at a time.
	 * 
	 * @param type                      is a string
	 * @param SkuSizeSeasonLinkDataList Contains attributes, typeId, oid(if
	 *                                  existing)
	 * @exception Exception
	 * @return JSONArray It returns SkuSizeSeasonLink JSONArray object
	 */
	public JSONObject createSkuSizeSource(String type, JSONObject skuSeasonJsonObject) throws Exception {
		JSONObject responseObject = new JSONObject();
		try {


		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return util.getExceptionJson("SKU Size Source creation is not supported.");
	}

	/**
	 * This method is used to update the SkuSizeSeasonLink flex object that are
	 * passed by using OID as reference. Using this method we can update several
	 * records of a SkuSizeSeasonLink flextype at a time.
	 * 
	 * @param oid                         oid of an item(type) to update
	 * @param SkuSizeSeasonLinkJsonObject Contains SkuSizeSeasonLink data
	 * @exception Exception
	 * @return String It returns OID of SkuSizeSeasonLink object
	 */

	public JSONObject updateSkuSizeSource(Map skuSizeSourceAttr, String type, String skuSizeSourceOid)
			throws WTException {

		String oid = "";
		String latestSkuSizeSourceOid = "";
		JSONObject responseObject = new JSONObject();
		SKUSizeSourceClientModel skuSizeSourceModel = new SKUSizeSourceClientModel();
		try {
			SKUSizeSource skuSizeSourceInput = (SKUSizeSource) LCSQuery.findObjectById(skuSizeSourceOid);
			SKUSizeSource skuSizeSource = skuSizeSourceInput;
			try {
				skuSizeSource = (SKUSizeSource) VersionHelper.latestIterationOf(skuSizeSourceInput);
			} catch (Exception e) {
			}
			latestSkuSizeSourceOid = FormatHelper.getObjectId(skuSizeSource);
			skuSizeSourceModel.load(latestSkuSizeSourceOid);

			AttributeValueSetter.setAllAttributes(skuSizeSourceModel, skuSizeSourceAttr);
			// skuSizeModel.save();
			skuSizeSourceModel.save();
			oid = FormatHelper.getObjectId(skuSizeSourceModel.getBusinessObject());
			responseObject = util.getUpdateResponse(oid, type, responseObject);
		} catch (Exception ex) {
			responseObject = util.getExceptionJson(ex.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to get hierarchy of this flex object
	 * 
	 * @Exception exception
	 * @return return hierarychy of this flex object in the form of
	 *         FlexTypeClassificationTreeLoader
	 */
	public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.skusize.SKUSizeSource");
	}

	/**
	 * This method is used to get the schema for the given typeId of this flex
	 * object .
	 * 
	 * @param String     type
	 * @param String     typeId
	 * @param JSONObject jsonAsscos
	 * @Exception exception
	 * @return JSONObject it returns the schema for the given typeId of this flex
	 *         object .
	 */

	public JSONObject getFlexSchema(String type, String typeId) throws Exception {
		// //if (LOGGER.isDebugEnabled())
		// //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex Schema with type and
		// typeId ***** "));
		JSONObject responseObject = new JSONObject();
		try {
			JSONObject jsonAsscos = util.getConfigureJSON();
			JSONObject configObject = (JSONObject) jsonAsscos.get(type);
			if (configObject != null) {
				JSONObject attributesObj = (JSONObject) configObject.get("properties");
				Collection attrsList = new ArrayList();
				Collection totalAttrs = null;
				if ((typeId != null) && !("".equalsIgnoreCase(typeId))) {
					totalAttrs = FlexTypeCache.getFlexType(typeId).getAllAttributes();
				} else {
					totalAttrs = FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
				}
				Iterator totalAttrsListItr = totalAttrs.iterator();
				while (totalAttrsListItr.hasNext()) {
					FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
					if (attribute.getAttScope().equals("SKU_SIZE_SEASON_SOURCE_SCOPE")) {
						attrsList.add(attribute);
					}
				}
				attributesObj = util.getAttributesData(attrsList, attributesObj);
				responseObject.put("properties", attributesObj);
				responseObject.put("type", "object");
				FlexType treeNodeFlexType = null;
				if ((typeId != null) && !("".equalsIgnoreCase(typeId))) {
					treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
				} else {
					treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
				}
				String typeName = treeNodeFlexType.getFullNameDisplay(true);
				JSONObject basicDetails = new JSONObject();
				basicDetails.put("typeId", typeId);
				basicDetails.put("rootObjectName", type);
				basicDetails.put("typeName", typeName);
				responseObject.put("basicDetails", basicDetails);
				responseObject.put("transformation_kind", (JSONObject) configObject.get("transformation_kind"));
				responseObject.put("associations", (JSONObject) configObject.get("associations"));
			} else {
				throw new FlexObjectNotFoundException(type + " does not Exist in ConfigurationRelations.json file");
			}
		} catch (WTException we) {
			responseObject = util.getExceptionJson(we.getMessage());
		} catch (FlexObjectNotFoundException foe) {
			responseObject = util.getExceptionJson(foe.getMessage());
		} catch (FileNotFoundException fe) {
			responseObject = util.getExceptionJson(fe.getMessage());
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to get the records of this flex object .
	 * 
	 * @param objectType  String
	 * @param typeId      String
	 * @param criteriaMap Map
	 * @exception Exception
	 * @return JSONObject it returns all the records of this flex object in the form
	 *         of json
	 */
	public JSONObject getRecords(String typeId, String objectType, Map criteriaMap) throws Exception {
		SearchResults results = new SearchResults();
		FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
		FlexType flexType = null;
		// Map criteria = util.convertJsonToMap(jsonObject,criteriaMap);
		if (typeId == null) {
			flexType = FlexTypeCache.getFlexTypeRoot("Sourcing Configuration");
		} else {
			flexType = FlexTypeCache.getFlexType(typeId);
		}
		results = flexSpecQuery.findSpecsByCriteria(criteriaMap, flexType, null, null);
		return util.getResponseFromResults(results, objectType);
	}

	/**
	 * This method is used to get the oid by taking name of the record.
	 * 
	 * @param FlexType flexType
	 * @param Map      criteria
	 * @param String   name
	 * @Exception exception
	 * @return return oid by taking name of the record of the flex object
	 */
	public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
		return "no record";
	}

	/**
	 * This method is used to get the oid of this flex object .
	 * 
	 * @param FlexObject flexObject
	 * @return String it returns the oid of this flex object in the form of String
	 */
	public String getOid(FlexObject flexObject) {
		return "VR:com.lcs.wc.skusize.SKUSizeSource:"
				+ (String) flexObject.getString("LCSMATERIAL.BRANCHIDITERATIONINFO");
	}

	/**
	 * This method is used to get the record that matched with the given oid of this
	 * flex object .
	 * 
	 * @param String objectType
	 * @param String oid
	 * @Exception exception
	 * @return String it returns the records that matched the given oid of this flex
	 *         object
	 */
	public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
		JSONObject jSONObject = new JSONObject();
		SKUSizeSource skuSizeSourceInput = (SKUSizeSource) LCSQuery.findObjectById(oid);
		SKUSizeSource skuSizeSource = skuSizeSourceInput;
		try {
			//skuSizeSource = (SKUSizeSource) VersionHelper.latestIterationOf(skuSizeSourceInput);
			skuSizeSource = (SKUSizeSource)VersionHelper.getVersion((WTObject) skuSizeSourceInput.getMaster(), "A");
		} catch (Exception e) {
		}
		jSONObject.put("createdOn",
				FormatHelper.applyFormat(skuSizeSource.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("modifiedOn",
				FormatHelper.applyFormat(skuSizeSource.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("image", null);
		jSONObject.put("oid", util.getVR(skuSizeSource));

        jSONObject.put("ORid",FormatHelper.getObjectId(skuSizeSourceInput).toString());
		jSONObject.put("typeId", FormatHelper.getObjectId(skuSizeSource.getFlexType()));
		//jSONObject.put("ORid", FormatHelper.getObjectId(skuSizeSource).toString());
		jSONObject.put("flexName", objectType);
		jSONObject.put("typeHierarchyName", skuSizeSource.getFlexType().getFullNameDisplay(true));
		jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(skuSizeSource));
 		SKUSizeSourceMaster master = (SKUSizeSourceMaster) skuSizeSource.getMaster();
		SKUSizeMaster skuSizeMaster = (SKUSizeMaster) master.getSkuSizeMaster();
        jSONObject.put("skuSize1",skuSizeMaster.getSizeValue());
        jSONObject.put("skuSize2",skuSizeMaster.getSize2Value());
		//LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(master.getSeasonMaster());
		LCSSeason season = (LCSSeason)VersionHelper.getVersion((WTObject) master.getSeasonMaster(), "A");
		String seasonOid = FormatHelper.getVersionId(season);
		jSONObject.put("seasonOid", seasonOid);
		jSONObject.put("active", skuSizeSource.isActive());
		//SKUSize skuSize = (SKUSize) VersionHelper.latestIterationOf(master.getSkuSizeMaster());
		SKUSize skuSize = (SKUSize)VersionHelper.getVersion((WTObject) master.getSkuSizeMaster(), "A");
		jSONObject.put("skuSizeactive", skuSize.isActive());
		jSONObject.put("skuSizeOid", FormatHelper.getVersionId(skuSize));
		LCSSKU sku = (LCSSKU) VersionHelper.latestIterationOf(((SKUSizeMaster) skuSize.getMaster()).getSkuMaster());
		jSONObject.put("skuOid", FormatHelper.getVersionId(sku));
		LCSSourcingConfig source = (LCSSourcingConfig) VersionHelper.latestIterationOf(master.getSourceMaster());
		jSONObject.put("sourceOid", FormatHelper.getVersionId(source));
		String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
		jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
		Collection attributes = skuSizeSource.getFlexType().getAllAttributes();
		Iterator it = attributes.iterator();
		while (it.hasNext()) {
			FlexTypeAttribute att = (FlexTypeAttribute) it.next();
			String attKey = att.getAttKey();
			try {
				if (skuSizeSource.getValue(attKey) == null) {
					jSONObject.put(attKey, "");
				} else {
					jSONObject.put(attKey, skuSizeSource.getValue(attKey).toString());
				}
			} catch (Exception e) {
			}
		}

		DataConversionUtil datConUtil = new DataConversionUtil();
		return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
				FormatHelper.getObjectId(skuSizeSource.getFlexType()));
	}

	/**
	 * This method is used to get the ProductSeasonLink Info by passing
	 * productOid,seasonOid.
	 * 
	 * @param String objectType
	 * @param String productOid
	 * @param String seasonOid
	 * @Exception exception
	 * @return return record of the ProductSeasonLink flex object
	 */

	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject)
			throws Exception {
		JSONObject responseObject = new JSONObject();
		try {
			if (propertiesObject.containsKey("seasonOid") && propertiesObject.containsKey("skuOid")
					&& propertiesObject.containsKey("sourceOid")) {
				String skuOid = (String) rootObject.get("skuOid");
				String seasonOid = (String) rootObject.get("seasonOid");
				String sourceOid = (String) rootObject.get("sourceOid");
				responseObject.put(objectType, findSKUSizeSourceLink(objectType, skuOid, seasonOid, sourceOid));
			} else {
				throw new Exception("skuOid, seasonOid, sourceOid are required attributes for API");
			}

		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}

		return responseObject;
	}

	/**
	 * This method is used to find the ProductSeasonLink records by passing
	 * productOid,seasonOid.
	 * 
	 * @param String objectType
	 * @param String productOid
	 * @param String seasonOid
	 * @Exception exception 
	 * @return return record of the ProductSeasonLink flex object
	 */
	public JSONObject findSKUSizeSourceLink(String objectType, String skuSOid, String seasonOid, String sourceOid) {
		JSONObject responseObject = new JSONObject();
		JSONArray sizeSKUSourceArray = new JSONArray();
		try {
			LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
			LCSSKU sku = (LCSSKU) LCSQuery.findObjectById(skuSOid);
			LCSSourcingConfig source = (LCSSourcingConfig) LCSQuery.findObjectById(sourceOid);
			LCSSeasonMaster seasonMaster = lcsSeason.getMaster();
			LCSPartMaster skuMaster = (LCSPartMaster) sku.getMaster();
			LCSSourcingConfigMaster sourceMaster = source.getMaster();
			Collection<SKUSizeSource> skuSizeSourceCollection = SKUSizeQuery
					.getSKUSizeSourcesFromSKUSeason(seasonMaster, skuMaster, sourceMaster);
			if ((skuSizeSourceCollection != null) && (skuSizeSourceCollection.size() > 0)) {
				for (SKUSizeSource skuSizeSource : skuSizeSourceCollection) {
					String skuSizeSourceId = FormatHelper.getObjectId(skuSizeSource);
					JSONObject sizeSKUSourceObject = getRecordByOid("Colorway Size to Source", skuSizeSourceId);
					sizeSKUSourceArray.add(sizeSKUSourceObject);
				}
			}
			responseObject.put("Colorway Size to Source", sizeSKUSourceArray);
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}
}