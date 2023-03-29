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
package cdee.web.model.sourcing;

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
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.LCSSourcingConfigClientModel;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.HeaderNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;

import com.lcs.wc.sourcing.LCSSKUCostSheetClientModel;
import com.lcs.wc.sourcing.LCSSourceToSeasonLink;
import com.lcs.wc.sourcing.LCSSourceToSeasonLinkClientModel;
import com.lcs.wc.sourcing.SourcingConfigHelper;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.season.LCSSeasonSKULinkClientModel;
import com.lcs.wc.skusize.SKUSizeSource;
import com.lcs.wc.skusize.SKUSizeSourceClientModel;
import com.lcs.wc.season.LCSSeason;
import java.util.Set;

import javax.ws.rs.core.Response;

import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import com.lcs.wc.part.LCSPartMaster;

public class SourceToSeasonLinkModel extends GenericObjectService {
	//private static final Logger LOGGER = LogR.getLogger(SourceToSeasonLinkModel.class.getName());
	//private static final String CLASSNAME = SourceToSeasonLinkModel.class.getName();

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

	public JSONObject saveOrUpdate(String type, String oid, JSONObject productSeasonJSONData,JSONObject payloadJson) throws Exception {
	       //if (LOGGER.isDebugEnabled())
	           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+ "------oid---------"+ oid)); 
	        JSONObject responseObject = new JSONObject();
	        try {
	            if (oid == null) {
	            //    ArrayList list = util.getOidFromSeachCriteria(type, productSeasonJSONData,payloadJson);
	                //if (LOGGER.isDebugEnabled())
	                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSeasonProductLink  ***** "));
	   
	                responseObject = createSourceSeason(type, payloadJson);
	            } else {
	                //if (LOGGER.isDebugEnabled())
	                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  callingupdateSeasonProductLink ***** "));
	   
	                String sourceSeasonOid = updateSourceSeason(util.getAttributesFromScopeLevel("SOURCE_TO_SEASON_SCOPE", "PRODUCT",payloadJson), oid);
	                responseObject = util.getUpdateResponse(sourceSeasonOid, type, responseObject);
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
	
	
	 public JSONObject createSourceSeason(String type, JSONObject sourceSeasonJsonObject)throws Exception{
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** createSourceSeason  initialized ***** "+ type));
          JSONObject responseObject = new JSONObject();
          LCSSourceToSeasonLinkClientModel sourceseasonModel = new LCSSourceToSeasonLinkClientModel();
          try{
        	  //
        	  String sourceoid=(String)sourceSeasonJsonObject.get("sourcingOid");
        	  String seasonid=(String)sourceSeasonJsonObject.get("seasonOid");
              LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonid);
              LCSSourcingConfig sourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceoid);
              LCSSourceToSeasonLink stsl = SourcingConfigHelper.service.createSourceToSeasonLink(sourcingConfig, lcsSeason);
        	  String sourceSeasonOid = FormatHelper.getObjectId(stsl);

        	  sourceseasonModel.load(sourceSeasonOid);
        	  String sourceseasonlink = updateSourceSeason(util.getAttributesFromScopeLevel("SOURCE_TO_SEASON_SCOPE", "PRODUCT",sourceSeasonJsonObject), sourceSeasonOid);

              responseObject = util.getInsertResponse(sourceseasonlink, type, responseObject);        	  
              
              
          } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
          }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
          }
          return responseObject;
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

	 public String updateSourceSeason(Map seasonProductLinkScopeAttrs, String sourceseasonOid) throws WTException {
	        //if (LOGGER.isDebugEnabled())
	           //LOGGER.debug((Object) (CLASSNAME + "*****update Source to Season  initialized ***** "+ sourceseasonOid));
	        String oid = "";
	        JSONObject exObject = new JSONObject();
	        LCSSourceToSeasonLinkClientModel sourceseasonModel = new LCSSourceToSeasonLinkClientModel();
	        try { 
	        	sourceseasonModel.load(sourceseasonOid);
	            AttributeValueSetter.setAllAttributes(sourceseasonModel, seasonProductLinkScopeAttrs);
	            sourceseasonModel.save();
	            oid = FormatHelper.getObjectId(sourceseasonModel.getBusinessObject());
	        }  catch (Exception ex) {
	        	throw new WTException("Enter a valid Object"+ex.getMessage());
	        }
	        return oid;
	    }

	/**
	 * This method is used to get hierarchy of this flex object
	 * 
	 * @Exception exception
	 * @return return hierarychy of this flex object in the form of
	 *         FlexTypeClassificationTreeLoader
	 */
	public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.LCSSourceToSeasonLink");
	}

	/*
		*//**
			 * This method is used either insert or update the SourcingConfiguration flex
			 * object that are passed by using type as reference, oid and array of different
			 * SourcingConfiguration data Using this method we can insert/update several
			 * records of a SourcingConfiguration flextype at a time.
			 * 
			 * @param type                           String
			 * @param oid                            String
			 * @param SourcingConfigurationJSONArray Contains array of SourcingConfiguration
			 *                                       data
			 * @exception Exception
			 * @return JSONArray It returns SourcingConfiguration JSONArray object
			 */
	/*
	 * 
	 * 
	 * 
	 * public JSONArray saveOrUpdate(String type,String oid, JSONArray
	 * sourcingConfigJSONArray,String productOid) throws Exception { if
	 * (LOGGER.isDebugEnabled()) //LOGGER.debug((Object) (CLASSNAME +
	 * "***** saveOrUpdate initialized with type *****"+ type)); JSONArray
	 * responseArray = new JSONArray(); Iterator sourcingConfigIterator =
	 * sourcingConfigJSONArray.iterator(); while(sourcingConfigIterator.hasNext()){
	 * JSONObject responseObject = new JSONObject(); try{ JSONObject
	 * sourcingConfigJsonData = (JSONObject)sourcingConfigIterator.next(); ArrayList
	 * list = util.getOidFromName(type,sourcingConfigJsonData);
	 * list.add(productOid); if(oid == null){
	 * if(!(list.get(2).toString()).equalsIgnoreCase("no record")) { if
	 * (LOGGER.isDebugEnabled()) //LOGGER.debug((Object) (CLASSNAME +
	 * "***** saveOrUpdate  calling updateSourcingConfig with criteria ***** "));
	 * responseObject =
	 * updateSourcingConfig(list.get(2).toString(),type,sourcingConfigJsonData); }
	 * else { //if (LOGGER.isDebugEnabled()) //LOGGER.debug((Object) (CLASSNAME +
	 * "***** saveOrUpdate  calling createSourcingConfig ***** ")); responseObject =
	 * createSourcingConfig(type, list); } } else { //if (LOGGER.isDebugEnabled())
	 * //LOGGER.debug((Object) (CLASSNAME +
	 * "***** saveOrUpdate  calling updateSourcingConfig with oid ***** "));
	 * responseObject = updateSourcingConfig(oid,type,sourcingConfigJsonData); } }
	 * catch (Exception e) { responseObject = util.getExceptionJson(e.getMessage());
	 * } responseArray.add(responseObject); } return responseArray; }
	 * 
	 * public JSONArray saveOrUpdate(String type,String oid, JSONArray
	 * sourcingConfigJSONArray) throws Exception { JSONArray responseArray = new
	 * JSONArray(); return null; }
	 * 
	 *//**
		 * This method is used to insert the SourcingConfiguration flex object that are
		 * passed by using type as reference. Using this method we can insert several
		 * records of a SourcingConfiguration flextype at a time.
		 * 
		 * @param type                          is a string
		 * @param sourcingConfigurationDataList Contains attributes, typeId, oid(if
		 *                                      existing)
		 * @exception Exception
		 * @return JSONArray It returns SourcingConfiguration JSONArray object
		 */
	/*
	 * 
	 * public JSONObject createSourcingConfig(String type, ArrayList
	 * sourcingConfigDataList){ //if (LOGGER.isDebugEnabled()) //LOGGER.debug((Object)
	 * (CLASSNAME + "***** Create Sourcing config ***** ")); JSONObject
	 * responseObject = new JSONObject(); LCSSourcingConfigClientModel sourcingModel
	 * = new LCSSourcingConfigClientModel(); try{ DataConversionUtil datConUtil=new
	 * DataConversionUtil(); Map
	 * convertedAttrs=datConUtil.convertJSONToFlexTypeFormat((JSONObject)
	 * sourcingConfigDataList.get(0),type,sourcingConfigDataList.get(1).toString());
	 * //Map objAttrs
	 * =util.getObjectAttributes(sourcingConfigDataList.get(1).toString()
	 * ,(JSONObject) sourcingConfigDataList.get(0));
	 * convertedAttrs.put("productId",sourcingConfigDataList.get(3).toString());
	 * AttributeValueSetter.setAllAttributes(sourcingModel,convertedAttrs);
	 * sourcingModel.save(); responseObject =
	 * util.getResponse(FormatHelper.getVersionId(sourcingModel.getBusinessObject())
	 * .toString(),type,responseObject); } catch (TypeIdNotFoundException te) {
	 * responseObject = util.getExceptionJson(te.getMessage()); }catch(Exception e){
	 * responseObject = util.getExceptionJson(e.getMessage()); } return
	 * responseObject; }
	 * 
	 *//**
		 * This method is used to update the SourcingConfiguration flex object that are
		 * passed by using OID as reference. Using this method we can update several
		 * records of a SourcingConfiguration flextype at a time.
		 * 
		 * @param oid                             oid of an item(type) to update
		 * @param sourcingConfigurationJsonObject Contains SourcingConfiguration data
		 * @exception Exception
		 * @return String It returns OID of SourcingConfiguration object
		 */
	/*
	 * 
	 * public JSONObject updateSourcingConfig(String oid,String type, JSONObject
	 * sourcingConfigJsonObject) throws Exception{ //if (LOGGER.isDebugEnabled())
	 * //LOGGER.debug((Object) (CLASSNAME +
	 * "***** Update sourcing config with oid ***** "+ oid)); JSONObject
	 * responseObject = new JSONObject(); LCSSourcingConfigClientModel sourcingModel
	 * = new LCSSourcingConfigClientModel(); try{ sourcingModel.load(oid);
	 * DataConversionUtil datConUtil=new DataConversionUtil(); Map
	 * convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(
	 * sourcingConfigJsonObject,type,FormatHelper.getObjectId(sourcingModel.
	 * getFlexType())); AttributeValueSetter.setAllAttributes(sourcingModel,
	 * convertedAttrs); sourcingModel.save(); responseObject =
	 * util.getResponse(FormatHelper.getObjectId(sourcingModel.getBusinessObject()).
	 * toString(),"",responseObject); }catch(Exception e){ responseObject =
	 * util.getExceptionJson(e.getMessage()); } return responseObject; }
	 * 
	 *//**
		 * This method is used to get hierarchy of this flex object
		 * 
		 * @Exception exception
		 * @return return hierarychy of this flex object in the form of
		 *         FlexTypeClassificationTreeLoader
		 *//*
			 * public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws
			 * Exception{ return new
			 * FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.LCSSourcingConfig"); }
			 */

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

	public JSONObject getFlexSchema(String type, String typeId)
			throws NumberFormatException, TypeIdNotFoundException, Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with type and typeId ***** "));
		JSONObject responseObject = new JSONObject();
		try {
			JSONObject jsonAsscos = util.getConfigureJSON();
			JSONObject scopedObjSchemaObject = new JSONObject();
			JSONObject configObject = (JSONObject) jsonAsscos.get(type);
			if (configObject != null) {
				JSONObject attributesObj = (JSONObject) configObject.get("properties");
				Collection attrsList = new ArrayList();
				Collection totalAttrs = null;
				if ((typeId != null) && !("".equalsIgnoreCase(typeId))) {
					totalAttrs = FlexTypeCache.getFlexType(typeId).getAllAttributes();
					Iterator totalAttrsListItr = totalAttrs.iterator();
					while (totalAttrsListItr.hasNext()) {
						FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
						if (attribute.getAttScope().equals("SOURCE_TO_SEASON_SCOPE")) {
							attrsList.add(attribute);
						}
					}
					attributesObj = util.getAttributesData(attrsList, attributesObj);
					responseObject.put("properties", attributesObj);
					responseObject.put("type", "object");
					FlexType treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
					String typeName = treeNodeFlexType.getFullNameDisplay(true);
					JSONObject basicDetails = new JSONObject();
					basicDetails.put("typeId", typeId);
					basicDetails.put("rootObjectName", type);
					basicDetails.put("typeName", typeName);
					responseObject.put("basicDetails", basicDetails);
					responseObject.put("transformation_kind", (JSONObject) configObject.get("transformation_kind"));
					responseObject.put("associations", (JSONObject) configObject.get("associations"));
				} else {
					throw new TypeIdNotFoundException(type
							+ " have TypeId Manadatory because this attributes are available in another flexObject");
				}
			} else {
				throw new FlexObjectNotFoundException(type + " does not Exist in ConfigurationRelations.json file");
			}
		} catch (NumberFormatException ne) {
			throw ne;
		} catch (TypeIdNotFoundException te) {
			throw te;
		} catch (FlexObjectNotFoundException foe) {
			responseObject = util.getExceptionJson(foe.getMessage());
		} catch (FileNotFoundException fe) {
			responseObject = util.getExceptionJson(fe.getMessage());
		} catch (WTException we) {
			responseObject = util.getExceptionJson(we.getMessage());
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
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** get records  ***** " + typeId));
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
		return "VR:com.lcs.wc.sourcing.LCSSourceToSeasonLink:"
				+ (String) flexObject.getString("LCSSOURCETOSEASONLINK.BRANCHIDITERATIONINFO");
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
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** " + oid));
		JSONObject jSONObject = new JSONObject();
		LCSSourceToSeasonLink lcsSourceToSeasonLinkInput = (LCSSourceToSeasonLink) LCSQuery.findObjectById(oid);
		LCSSourceToSeasonLink lcsSourceToSeasonLink = lcsSourceToSeasonLinkInput;
		try {
			lcsSourceToSeasonLink = (LCSSourceToSeasonLink) VersionHelper.latestIterationOf(lcsSourceToSeasonLinkInput);
		} catch (Exception e) {
		}
		jSONObject.put("createdOn",
				FormatHelper.applyFormat(lcsSourceToSeasonLink.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("modifiedOn",
				FormatHelper.applyFormat(lcsSourceToSeasonLink.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("image", null);
		// jSONObject.put("oid", oid);
		jSONObject.put("oid", util.getVR(lcsSourceToSeasonLink));
		jSONObject.put("typeId", FormatHelper.getObjectId(lcsSourceToSeasonLink.getFlexType()));
		jSONObject.put("ORid", FormatHelper.getObjectId(lcsSourceToSeasonLink).toString());
		jSONObject.put("flexName", objectType);
		jSONObject.put("typeHierarchyName", lcsSourceToSeasonLink.getFlexType().getFullNameDisplay(true));
		jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSourceToSeasonLink));
		jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsSourceToSeasonLink));
		//
		LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(lcsSourceToSeasonLink.getSeasonMaster());
		String seasonOid = FormatHelper.getVersionId(season);
		jSONObject.put("seasonOid", seasonOid);
		LCSSourcingConfig lcssourcingconfig = (LCSSourcingConfig) VersionHelper
				.latestIterationOf(lcsSourceToSeasonLink.getSourcingConfigMaster());
		// LCSMaterial material = (LCSMaterial)
		// VersionHelper.latestIterationOf(materialMaster);
		jSONObject.put("sourcingconfigOid", FormatHelper.getVersionId(lcssourcingconfig));
		jSONObject.put("primarySource", lcssourcingconfig.isPrimarySource());
		jSONObject.put("primarySTSL", lcsSourceToSeasonLink.isPrimarySTSL());

		//
		String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
		jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
		Collection attributes = lcsSourceToSeasonLink.getFlexType().getAllAttributes();
		Iterator it = attributes.iterator();
		while (it.hasNext()) {
			FlexTypeAttribute att = (FlexTypeAttribute) it.next();
			String attKey = att.getAttKey();
			try {
				if (lcsSourceToSeasonLink.getValue(attKey) == null) {
					jSONObject.put(attKey, "");
				} else {
					jSONObject.put(attKey, lcsSourceToSeasonLink.getValue(attKey));
				}
			} catch (Exception e) {
			}
		}
		DataConversionUtil datConUtil = new DataConversionUtil();
		return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
				FormatHelper.getObjectId(lcsSourceToSeasonLink.getFlexType()));
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
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** get flex link info ***** "));
		JSONObject responseObject = new JSONObject();
		try {
			String firstKey = "";
			String secondKey = "";
			String firstKeyValue = "";
			String secondKeyValue = "";
			String sourceOid = "";
			String seasonOid = "";
			String productOid = "";
			Set keys = rootObject.keySet();
			Iterator itr = keys.iterator();
			if (rootObject.containsKey("productOid")) {
				while (itr.hasNext()) {
					firstKey = (String) itr.next();
					secondKey = (String) itr.next();
					if (propertiesObject.containsKey(firstKey) && propertiesObject.containsKey(secondKey)) {
						if (firstKey.equalsIgnoreCase("productOid")) {
							productOid = (String) rootObject.get(firstKey);
							seasonOid = (String) rootObject.get(secondKey);
						} else {
							seasonOid = (String) rootObject.get(firstKey);
							productOid = (String) rootObject.get(secondKey);
						}
					}
				}
				if ((productOid != null) && !("".equalsIgnoreCase(productOid)) && (seasonOid != null)
						&& !("".equalsIgnoreCase(seasonOid))) {

					responseObject.put(objectType, findPrimSourceSeasonLink(objectType, productOid, seasonOid));
				}

			} else {
				while (itr.hasNext()) {
					firstKey = (String) itr.next();
					secondKey = (String) itr.next();
					if (propertiesObject.containsKey(firstKey) && propertiesObject.containsKey(secondKey)) {
						if (firstKey.equalsIgnoreCase("sourceOid")) {
							sourceOid = (String) rootObject.get(firstKey);
							seasonOid = (String) rootObject.get(secondKey);
						} else {
							seasonOid = (String) rootObject.get(firstKey);
							sourceOid = (String) rootObject.get(secondKey);
						}
					}
				}
				if ((sourceOid != null) && !("".equalsIgnoreCase(sourceOid)) && (seasonOid != null)
						&& !("".equalsIgnoreCase(seasonOid))) {
					responseObject.put(objectType, findSourceSeasonLink(objectType, sourceOid, seasonOid));
				}
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
	public JSONObject findSourceSeasonLink(String objectType, String sourceOid, String seasonOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find source season link with sourceOid ***** " + sourceOid+ "----seasonOid-----" + seasonOid));
		LCSSourcingConfigQuery lcsSourcingConfigQuery = new LCSSourcingConfigQuery();
		JSONObject responseObject = new JSONObject();
		try {
			LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceOid);
			LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
			LCSSourceToSeasonLink lcsSourceToSeasonLink = lcsSourcingConfigQuery
					.getSourceToSeasonLink(lcsSourcingConfig, lcsSeason);
			String sourceSeasonOid = FormatHelper.getNumericObjectIdFromObject(lcsSourceToSeasonLink);
			sourceSeasonOid = "OR:com.lcs.wc.sourcing.LCSSourceToSeasonLink:" + sourceSeasonOid;
			responseObject = getRecordByOid(objectType, sourceSeasonOid);
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
	public JSONObject findPrimSourceSeasonLink(String objectType, String productOid, String seasonOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find source season link with productOid ***** " + productOid		+ "----seasonOid-----" + seasonOid));
		LCSSourcingConfigQuery lcsSourcingConfigQuery = new LCSSourcingConfigQuery();
		JSONObject responseObject = new JSONObject();
		try {
			LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productOid);
			LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
			// LCSSourceToSeasonLink lcsSourceToSeasonLink =
			// LCSSourcingConfigQuery.getPrimarySourceToSeasonLink((LCSPartMaster)toProduct.getMaster(),
			// season.getMaster());
			LCSSourceToSeasonLink lcsSourceToSeasonLink = lcsSourcingConfigQuery
					.getPrimarySourceToSeasonLink((LCSPartMaster) lcsProduct.getMaster(), lcsSeason.getMaster());
			String sourceSeasonOid = FormatHelper.getNumericObjectIdFromObject(lcsSourceToSeasonLink);
			sourceSeasonOid = "OR:com.lcs.wc.sourcing.LCSSourceToSeasonLink:" + sourceSeasonOid;
			responseObject = getRecordByOid(objectType, sourceSeasonOid);
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}
}