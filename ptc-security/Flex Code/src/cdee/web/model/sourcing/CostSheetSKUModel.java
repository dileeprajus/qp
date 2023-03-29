/*
 * Created on 06/09/2017
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
import java.util.Vector;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.last.LCSLastClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.sourcing.RFQQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.sourcing.RFQRequestClientModel;
import wt.util.WTException;
import com.lcs.wc.sourcing.LCSCostSheetLogic;
import com.lcs.wc.sourcing.LCSCostSheet;
import com.lcs.wc.sourcing.LCSSKUCostSheetClientModel;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.sourcing.LCSCostSheetQuery;
import com.lcs.wc.sourcing.LCSCostSheetMaster;
import com.lcs.wc.sourcing.LCSSKUCostSheet;
import com.lcs.wc.product.ProductDestination;
import cdee.web.model.product.ProductDestinationModel;
import cdee.web.model.sizing.SizingModel;
import com.lcs.wc.sizing.ProductSizeCategory;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import wt.util.WTException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.db.PreparedQueryStatement;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.season.LCSSeasonMaster;
import java.util.Set;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class CostSheetSKUModel extends GenericObjectService {
	//private static final Logger LOGGER = LogR.getLogger(CostSheetSKUModel.class.getName());
	//private static final String CLASSNAME = CostSheetSKUModel.class.getName();

	AppUtil util = new AppUtil();

	/**
	 * This method is used to update the RFQ flex object that are passed by using
	 * type as reference.
	 * 
	 * @param oid                 is a string
	 * @param type                is a string
	 * @param costSheetJsonObject rfqData
	 * @exception Exception
	 * @return JSONObject It returns RFQ JSONObject object
	 */
	public JSONObject updateSKUCostSheet(String oid, String type, JSONObject costSheetJsonObject) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Update SKU Cost sheet with oid ***** " + oid));
		JSONObject responseObject = new JSONObject();
		LCSSKUCostSheetClientModel costSheetSKUModel = new LCSSKUCostSheetClientModel();
		try {
			costSheetSKUModel.load(oid);
			DataConversionUtil datConUtil = new DataConversionUtil();
			Map convertedAttrs = datConUtil.convertJSONToFlexTypeFormatUpdate(costSheetJsonObject, type,
					FormatHelper.getObjectId(costSheetSKUModel.getFlexType()));
			AttributeValueSetter.setAllAttributes(costSheetSKUModel, convertedAttrs);
			costSheetSKUModel.save();
			responseObject = util.getUpdateResponse(
					FormatHelper.getVersionId(costSheetSKUModel.getBusinessObject()).toString(), type, responseObject);
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to insert the RFQ flex object that are passed by using
	 * type as reference.
	 * 
	 * @param type              is a string
	 * @param costSheetDataList Contains attributes, typeId, oid(if existing)
	 * @exception Exception
	 * @return JSONObject It returns RFQ JSONObject object
	 */
	public JSONObject createSKUCostSheet(String type, JSONObject costSheetDataList) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Create SKU Cost Sheet  initialized ***** " + type));
		JSONObject responseObject = new JSONObject();
		LCSSKUCostSheetClientModel CostSheetSKUModel = new LCSSKUCostSheetClientModel();
		try {
			DataConversionUtil datConUtil = new DataConversionUtil();
			Map mappedAttrs = datConUtil.convertJSONToFlexTypeFormat(costSheetDataList, type,
					(String) costSheetDataList.get("typeId"));
			mappedAttrs.put("productId", (String) costSheetDataList.get("productOid"));
			mappedAttrs.put("costSheetType", "SKU");
			mappedAttrs.put("csTypeId", (String) costSheetDataList.get("typeId"));
			mappedAttrs.put("SKUId", (String) costSheetDataList.get("SKUId"));
			if (costSheetDataList.containsKey("sourcingOid")) {
				String sourceoid = (String) costSheetDataList.get("sourcingOid");
				mappedAttrs.put("sourceoid", sourceoid);
				mappedAttrs.put("sourcingConfigId", sourceoid);
			}
			if (costSheetDataList.containsKey("seasonOid")) {
				String seasonid = (String) costSheetDataList.get("seasonOid");
				LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonid);
				String seasonMaster = FormatHelper.getObjectId(lcsSeason.getMaster());
				mappedAttrs.put("seasonId", seasonMaster);
			}
			AttributeValueSetter.setAllAttributes(CostSheetSKUModel, mappedAttrs);
			CostSheetSKUModel.save();
			responseObject = util.getInsertResponse(
					FormatHelper.getVersionId(CostSheetSKUModel.getBusinessObject()).toString(), type, responseObject);
		} catch (TypeIdNotFoundException te) {
			responseObject = util.getExceptionJson(te.getMessage());
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson, JSONObject rfqData)
			throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****" + type));
		JSONObject responseObject = new JSONObject();
		try {
			if (oid == null) {
				ArrayList list = util.getOidFromSeachCriteria(type, searchJson, rfqData);

				if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
					//if (LOGGER.isDebugEnabled())
						//LOGGER.debug((Object) (CLASSNAME+ "***** saveOrUpdate  calling updateSKUCostSheet with criteria ***** "));
					responseObject = updateSKUCostSheet(list.get(2).toString(), type, rfqData);
				} else {
					//if (LOGGER.isDebugEnabled())
						//LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSkuSizeSeason ***** "));
					responseObject = createSKUCostSheet(type, rfqData);
				}
			} else {
				//if (LOGGER.isDebugEnabled())
					//LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSKUCostSheet with oid ***** "));
				responseObject = updateSKUCostSheet(oid, type, rfqData);
			}
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used delete Product cost sheet of given oid,
	 * 
	 * @param oid String
	 * @exception Exception
	 * @return JSONObject It returns response JSONObject object
	 */
	public JSONObject delete(String oid) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** delete with oid ***** " + oid));
		JSONObject responseObject = new JSONObject();
		try {
			LCSCostSheet lcsCostSheet = (LCSCostSheet) LCSQuery.findObjectById(oid);
			LCSCostSheetLogic costSheetLogic = new LCSCostSheetLogic();
			costSheetLogic.deleteCostSheet(lcsCostSheet);
			responseObject = util.getDeleteResponseObject("Cost Sheet Product", oid, responseObject);
		} catch (WTException wte) {
			//if (LOGGER.isDebugEnabled())
				//LOGGER.debug((Object) (CLASSNAME + "***** delete with oid exception ***** " + wte.getMessage()));
			responseObject = util.getExceptionJson(wte.getMessage());
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
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.LCSProductCostSheet");
	}

	/**
	 * This method is used to get the schema for the given typeId of this flex
	 * object .
	 * 
	 * @param String type
	 * @param String typeId
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

						if (attribute.getAttScope().equals("COST_SHEET")
								&& (attribute.getAttObjectLevel().equals("PRODUCT-SKU")
										|| attribute.getAttObjectLevel().equals("SKU"))) {
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
	 * @param criteriaMap Map
	 * @exception Exception
	 * @return JSONObject it returns all the records of this flex object in the form
	 *         of json
	 */
	public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** get records with objectType ***** "));
		SearchResults results = null;
		FlexType flexType = null;
		LCSCostSheet skuSheet = null;
		String typeId = (String) criteriaMap.get("typeId");
		String sourceConfigOid = (String) criteriaMap.get("sourceConfigOid");
		String seasonOid = (String) criteriaMap.get("seasonOid");
		String colorwayOid = (String) criteriaMap.get("colorwayOid");
		LCSSourcingConfig sourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceConfigOid);
		LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
		LCSSKU lcssku = (LCSSKU) LCSQuery.findObjectById(colorwayOid);
		Collection skuSheets = LCSCostSheetQuery.getCostSheetsForSourceToSeason(lcsSeason.getMaster(),
				(LCSSourcingConfigMaster) sourcingConfig.getMaster(), (LCSPartMaster) lcssku.getMaster());
		// Collection skuCostSheetObjects = null;
		JSONArray skuCostSheetObjects = new JSONArray();

		if (skuSheets != null && skuSheets.size() > 0) {
			skuSheet = (LCSSKUCostSheet) skuSheets.iterator().next();
			String skuOid = (String) FormatHelper.getVersionId(skuSheet);
			skuCostSheetObjects.add(getRecordByOid(objectType, skuOid));
		}
		JSONObject object = new JSONObject();
		object.put("TotalRecords", skuSheets.size());
		object.put("FromIndex", 0);
		object.put("ToIndex", skuSheets.size());
		object.put(objectType, skuCostSheetObjects);
		// SearchResults results =new
		// RFQQuery().findRFQsByCriteria(criteriaMap,flexType,null,null,null);
		// return util.getResponseFromResults(results,objectType);
		return object;

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
		return "VR:com.lcs.wc.sourcing.LCSSKUCostSheet:"
				+ (String) flexObject.getString("LCSSKUCOSTSHEET.BRANCHIDITERATIONINFO");
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
	
    public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
         JSONObject jSONObject = new JSONObject();

         LCSSKUCostSheet lcsCostSheetInput = (LCSSKUCostSheet) LCSQuery.findObjectById(oid);
         LCSSKUCostSheet lcsskuCostSheet = lcsCostSheetInput;
          try{
             lcsskuCostSheet = (LCSSKUCostSheet) VersionHelper.latestIterationOf(lcsCostSheetInput);
         }catch(Exception e){
         }
         jSONObject.put("createdOn",FormatHelper.applyFormat(lcsskuCostSheet.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
         jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsskuCostSheet.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
         jSONObject.put("image",null);
         jSONObject.put("oid", util.getVR(lcsskuCostSheet));
         //jSONObject.put("oid",FormatHelper.getVersionId(lcsskuCostSheet).toString());
         jSONObject.put("typeId",FormatHelper.getObjectId(lcsskuCostSheet.getFlexType()));
         jSONObject.put("ORid",FormatHelper.getObjectId(lcsskuCostSheet).toString());
         jSONObject.put("flexName",objectType);
         jSONObject.put("typeHierarchyName",lcsskuCostSheet.getFlexType().getFullNameDisplay(true));
         jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsskuCostSheet));
         jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsskuCostSheet));
         String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
         LCSProduct prod = (LCSProduct)VersionHelper.latestIterationOf(lcsskuCostSheet.getProductMaster());
         LCSSeason season = (LCSSeason)VersionHelper.latestIterationOf(lcsskuCostSheet.getSeasonMaster());
         
         LCSSourcingConfig sourceConfig = (LCSSourcingConfig)VersionHelper.latestIterationOf(lcsskuCostSheet.getSourcingConfigMaster());
         if(lcsskuCostSheet.getSpecificationMaster() != null){
           FlexSpecification flexSpec = (FlexSpecification)VersionHelper.latestIterationOf(lcsskuCostSheet.getSpecificationMaster());
           jSONObject.put("specificationOid",FormatHelper.getVersionId(flexSpec));
         }else {
           jSONObject.put("specificationOid","");
         }       
         jSONObject.put("productOid",FormatHelper.getVersionId(prod));
         jSONObject.put("sourcingConfigurationOid",FormatHelper.getVersionId(sourceConfig));
         try {
         LCSSKU sku = (LCSSKU)VersionHelper.latestIterationOf(lcsskuCostSheet.getSkuMaster());
         jSONObject.put("skuOid",FormatHelper.getVersionId(sku));
         }catch(Exception ex1) { 
        	 //LOGGER.debug((Object) (CLASSNAME + "***** exception no master found for SKU ***** "+ ex1.getMessage()));
			 
		 }
         
         jSONObject.put("seasonOid",FormatHelper.getVersionId(season));
         //jSONObject.put("productId",FormatHelper.getVersionId(prod));
         jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
         Collection attributes = lcsskuCostSheet.getFlexType().getAllAttributes();
         Iterator it = attributes.iterator();
         while(it.hasNext()){
             FlexTypeAttribute att = (FlexTypeAttribute) it.next();
             String attKey = att.getAttKey();
             try{
                 if(lcsskuCostSheet.getValue(attKey) == null){
                     jSONObject.put(attKey,"");
                 }
                 else{
                     jSONObject.put(attKey,lcsskuCostSheet.getValue(attKey).toString());
                 }
             }catch(Exception e){
             }
         }

       DataConversionUtil datConUtil=new DataConversionUtil();
       return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsskuCostSheet.getFlexType()));   
     }
    
	
	/**
	 * This method is used to fetch the record that matched with the given oid of
	 * this flex object with association flexObject records.
	 * 
	 * @param String objectType which contains flexObject name
	 * @param String oid
	 * @param String association which contains association(includes) flexObject
	 *               name
	 * @Exception exception
	 * @return JSONObject it returns the record that matched the given oid of this
	 *         flex object with association flexObject records
	 */

	public JSONObject getRecordByOid(String objectType, String oid, String association) throws Exception {
		JSONObject jSONObject = new JSONObject();
		/*
		 * if(association.equalsIgnoreCase("Product Destination")){
		 * jSONObject.put("Product Destination",findDestinations(oid)); }else
		 * if(association.equalsIgnoreCase("Size Category")){
		 * jSONObject.put("Size Category",findSizeCategorys(oid)); }
		 */
		return jSONObject;
	}

	/**
	 * This method is used to get the Destinations records of given costSheetOid .
	 * 
	 * @param String costSheetOid
	 * @return JSONArray it returns the costSheet associated Destinations records in
	 *         the form of array
	 */
	public JSONArray findDestinations(String costSheetOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Find destinations with costSheetOid ***** " + costSheetOid));
		LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery();
		ProductDestinationModel productDestinationModel = new ProductDestinationModel();
		JSONArray productDestinationArray = new JSONArray();
		try {
			LCSCostSheet lcsCostSheet = (LCSCostSheet) LCSQuery.findObjectById(costSheetOid);
			LCSCostSheetMaster lcsCostSheetMaster = (LCSCostSheetMaster) lcsCostSheet.getMaster();
			Collection response = lcsCostSheetQuery.getDestinationLinks(lcsCostSheetMaster);
			Iterator itr = response.iterator();
			while (itr.hasNext()) {
				FlexObject flexObject = (FlexObject) itr.next();
				String productDestinationOid = productDestinationModel.getOid(flexObject);
				JSONObject productDestinationObject = productDestinationModel.getRecordByOid("Product Destination",
						productDestinationOid);
				productDestinationArray.add(productDestinationObject);
			}
		} catch (Exception e) {
			productDestinationArray.add(util.getExceptionJson(e.getMessage()));
		}
		return productDestinationArray;
	}

	/**
	 * This method is used to get the Size Category records of given costSheetOid .
	 * 
	 * @param String costSheetOid
	 * @return JSONArray it returns the costSheet associated Size Category records
	 *         in the form of array
	 */
	public JSONArray findSizeCategorys(String costSheetOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Find size Categorys with costSheetOid ***** " + costSheetOid));
		LCSCostSheetQuery lcsCostSheetQuery = new LCSCostSheetQuery();
		JSONArray sizeCategoryArray = new JSONArray();
		SizingModel sizingModel = new SizingModel();
		try {
			LCSCostSheet lcsCostSheet = (LCSCostSheet) LCSQuery.findObjectById(costSheetOid);
			LCSCostSheetMaster lcsCostSheetMaster = (LCSCostSheetMaster) lcsCostSheet.getMaster();
			Collection results = lcsCostSheetQuery.getSizeCategoryLinks(lcsCostSheetMaster);
			Iterator itr = results.iterator();
			while (itr.hasNext()) {
				FlexObject flexObject = (FlexObject) itr.next();
				String sizeCategoryOid = sizingModel.getOid(flexObject);
				JSONObject sizeCategoryObject = sizingModel.getRecordByOid("Size Category", sizeCategoryOid);
				sizeCategoryArray.add(sizeCategoryObject);
			}
		} catch (Exception e) {
			sizeCategoryArray.add(util.getExceptionJson(e.getMessage()));
		}
		return sizeCategoryArray;
	}

	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject)
			throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Get flex link info ***** "));
		String sourceOid = "";
		String skuOid = "";
		String seasonOid = "";
		String key = "";
		boolean primary = false;
		String costSheetId = "";
		JSONObject responseObject = new JSONObject();
		LCSSeasonMaster seasonMaster = null;
		LCSSourcingConfigMaster sourceMaster = null;
		LCSSKU sku = null;
		LCSPartMaster skuMaster = null;
		JSONArray costSheetArray = new JSONArray();
		try {
			Set<?> keys = rootObject.keySet();
			Iterator<?> itr = keys.iterator();
			while (itr.hasNext()) {
				key = (String) itr.next();
				if (key.equalsIgnoreCase("seasonOid")) {
					seasonOid = (String) rootObject.get(key);
				} else if (key.equalsIgnoreCase("sourceOid")) {
					sourceOid = (String) rootObject.get(key);
				} else if (key.equalsIgnoreCase("skuOid")) {
					skuOid = (String) rootObject.get(key);
				} else if (key.equalsIgnoreCase("primary")) {
					primary = (boolean) rootObject.get(key);
				}
			}

			if (!seasonOid.equals("")) {
				LCSSeason season = (LCSSeason) LCSQuery.findObjectById(seasonOid);
				if (season != null)
					seasonMaster = season.getMaster();
			}
			if (!sourceOid.equals("")) {
				LCSSourcingConfig source = (LCSSourcingConfig) LCSQuery.findObjectById(sourceOid);
				if (source != null)
					sourceMaster = source.getMaster();
			}
			if (!skuOid.equals("")) {
				sku = (LCSSKU) LCSQuery.findObjectById(skuOid);
				if (sku != null)
					skuMaster = sku.getMaster();
			}
			// Season and Source are Required. SKU is optional.
			if (seasonMaster != null && sourceMaster != null) {
				Collection<?> costSheetList = LCSCostSheetQuery.getCostSheetsForSourceToSeason(seasonMaster,
						sourceMaster, skuMaster, primary);
				Iterator<?> listItr = costSheetList.iterator();
				while (listItr.hasNext()) {
					costSheetId = listItr.next().toString();
					// Only Fetch the SKU Cost Sheet. Ignore the Product Cost sheet. Adding it to an
					// array, because SKU is optional.
					if (!costSheetId.contains("LCSProductCostSheet")) {
						JSONObject costSheetObject = getRecordByOid("Cost Sheet Colorway", costSheetId);
						costSheetArray.add(costSheetObject);
					}
				}
				responseObject.put(objectType, costSheetArray);
			}

		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}
}