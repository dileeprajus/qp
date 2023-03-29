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

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
//import com.lcs.wc.sourcing.RFQQuery;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.season.LCSSeasonMaster;
//import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.sourcing.OrderConfirmation;
import com.lcs.wc.sourcing.OrderConfirmationClientModel;
import com.lcs.wc.sourcing.OrderConfirmationLineItem;
import com.lcs.wc.sourcing.OrderConfirmationLogic;
import com.lcs.wc.sourcing.OrderConfirmationMaster;
import com.lcs.wc.sourcing.OrderConfirmationQuery;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.VersionHelper;

import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.model.product.ProductModel;
import cdee.web.model.season.SeasonModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
//import com.lcs.wc.sourcing.RFQLogic;
import cdee.web.util.DataConversionUtil;
import wt.util.WTException;

public class OrderConfirmationModel extends GenericObjectService {

	OrderConfirmationQuery ordQuery = new OrderConfirmationQuery();
	AppUtil util = new AppUtil();

	/**
	 * This method is used to update the OrderConfirmation flex object that are
	 * passed by using type as reference.
	 * 
	 * @param oid           is a string
	 * @param type          is a string
	 * @param orcJsonObject OrderConfirmationData
	 * @exception Exception
	 * @return JSONObject It returns OrderConfirmation JSONObject object
	 */
	public JSONObject updateORConfimation(String oid, String type, JSONObject orcJsonObject) throws Exception {

		JSONObject responseObject = new JSONObject();
		OrderConfirmationClientModel orderConfirmationModel = new OrderConfirmationClientModel();
		try {
			orderConfirmationModel.load(oid);
			DataConversionUtil datConUtil = new DataConversionUtil();
			Map convertedAttrs = datConUtil.convertJSONToFlexTypeFormatUpdate(orcJsonObject, type,
					FormatHelper.getObjectId(orderConfirmationModel.getFlexType()));
			AttributeValueSetter.setAllAttributes(orderConfirmationModel, convertedAttrs);
			if (orcJsonObject.containsKey("supplierOid")) {
				String suppid = (String) orcJsonObject.get("supplierOid");
				int index = suppid.lastIndexOf(":");
				if (index > -1) {
					suppid = suppid.substring(index + 1);
				}

				orderConfirmationModel.setOrderSourceId(suppid);
			}

			if (orcJsonObject.containsKey("seasonOid")) {
				String seasonid = (String) orcJsonObject.get("seasonOid");
				int index = seasonid.lastIndexOf(":");
				if (index > -1) {
					seasonid = seasonid.substring(index + 1);
				}

				orderConfirmationModel.setSeasonVersionId(seasonid);
			}

			if (orcJsonObject.containsKey("specOid"))
				orderConfirmationModel.setOrderSpecId((String) orcJsonObject.get("specOid"));
			orderConfirmationModel.save();
			responseObject = util.getUpdateResponse(
					FormatHelper.getVersionId(orderConfirmationModel.getBusinessObject()).toString(), type,
					responseObject);
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to insert the OrderConfirmation flex object that are
	 * passed by using type as reference.
	 * 
	 * @param type        is a string
	 * @param ordDataList Contains attributes, typeId, oid(if existing)
	 * @exception Exception
	 * @return JSONObject It returns OrderConfirmation JSONObject object
	 */
	public JSONObject createORConfimation(String type, JSONObject ordDataList) {

		JSONObject responseObject = new JSONObject();
		OrderConfirmationClientModel ocModel = new OrderConfirmationClientModel();
		try {
			DataConversionUtil datConUtil = new DataConversionUtil();
			Map convertedAttrs = datConUtil.convertJSONToFlexTypeFormat(ordDataList, type,
					(String) ordDataList.get("typeId"));
			AttributeValueSetter.setAllAttributes(ocModel, convertedAttrs);
			// if(ordDataList.containsKey("supplierOid"))
			// {
			String suppid = (String) ordDataList.get("supplierOid");
			int indexs = suppid.lastIndexOf(":");
			if (indexs > -1) {
				suppid = suppid.substring(indexs + 1);
			}

			ocModel.setOrderSourceId(suppid);
			// }

			if (ordDataList.containsKey("seasonOid")) {
				String seasonid = (String) ordDataList.get("seasonOid");
				int index = seasonid.lastIndexOf(":");
				if (index > -1) {
					seasonid = seasonid.substring(index + 1);
				}

				ocModel.setSeasonVersionId(seasonid);
			}

			if (ordDataList.containsKey("specOid"))
				ocModel.setOrderSpecId((String) ordDataList.get("specOid"));
			ocModel.save();
			ocModel.checkIn();
			responseObject = util.getInsertResponse(FormatHelper.getVersionId(ocModel.getBusinessObject()).toString(),
					type, responseObject);
		} catch (TypeIdNotFoundException te) {
			responseObject = util.getExceptionJson(te.getMessage());
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used either insert or update the OrderConfirmation flex object
	 * that are passed by using type as reference, Using this method we can
	 * insert/update record of a OrderConfirmation flextype at a time.
	 * 
	 * @param type        String
	 * @param oid         String
	 * @param payloadJson Contains object of OrderConfirmation data
	 * @exception Exception
	 * @return JSONObject It returns OrderConfirmation JSONObject object
	 */
	public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson, JSONObject payloadJson)
			throws Exception {

		JSONObject responseObject = new JSONObject();
		try {
			if (oid == null) {
				ArrayList list = util.getOidFromSeachCriteria(type, searchJson, payloadJson);

				if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {

					responseObject = updateORConfimation(list.get(2).toString(), type, payloadJson);
				} else {

					responseObject = createORConfimation(type, payloadJson);
				}
			} else {

				responseObject = updateORConfimation(oid, type, payloadJson);
			}
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used delete OrderConfirmation request of given oid,
	 * 
	 * @param oid String
	 * @exception Exception
	 * @return JSONObject It returns response JSONObject object
	 */

	public JSONObject delete(String oid) throws Exception {

		JSONObject responseObject = new JSONObject();
		try {
			OrderConfirmation orderConfirmation = (OrderConfirmation) LCSQuery.findObjectById(oid);
			OrderConfirmationLogic OrderConfirmationLogic = new OrderConfirmationLogic();
			OrderConfirmationLogic.deleteOrderConfirmation(orderConfirmation);
			responseObject = util.getDeleteResponseObject("Order Confirmation", oid, responseObject);
		} catch (WTException wte) {
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
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.OrderConfirmation");
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
					attrsList.add(attribute);
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
	 * @param criteriaMap Map
	 * @exception Exception
	 * @return JSONObject it returns all the records of this flex object in the form
	 *         of json
	 */

	public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {

		FlexType flexType = null;
		String typeId = (String) criteriaMap.get("typeId");
		if (typeId == null) {
			flexType = FlexTypeCache.getFlexTypeRoot(objectType);
		} else {
			flexType = FlexTypeCache.getFlexType(typeId);
		}
		SearchResults results = ordQuery.findOrderConfirmationsByCriteria(criteriaMap, flexType, null, null, null);

		// SearchResults results = new
		// LCSProductQuery().findProductsByCriteria(criteriaMap, flexType, null, null,
		// null);
		return util.getResponseFromResults(results, objectType);
	}
	/*
	 * public JSONObject getRecords(String objectType, Map criteriaMap) throws
	 * Exception{ if (LOGGER.isDebugEnabled()) LOGGER.debug((Object) (CLASSNAME +
	 * "***** Get records with objectType ***** ")); FlexType flexType = null;
	 * String typeId=(String)criteriaMap.get("typeId"); if(typeId == null){ flexType
	 * = FlexTypeCache.getFlexTypeRoot(objectType); }else{ flexType =
	 * FlexTypeCache.getFlexType(typeId); } SearchResults results
	 * =ordQuery.findOrderConfirmationsByCriteria(criteriaMap,flexType,null,null,
	 * null); Collection<FlexObject> response = results.getResults(); Iterator itr =
	 * response.iterator(); JSONArray responseArray = new JSONArray(); while
	 * (itr.hasNext()) { JSONObject responseObject = new JSONObject(); FlexObject
	 * flexObject = (FlexObject) itr.next(); String flexPartOid =
	 * getOid(flexObject); responseObject = getRecordByOid("Order Confirmation",
	 * flexPartOid);
	 * 
	 * responseArray.add(responseObject); }
	 * 
	 * JSONObject object = new JSONObject(); object.put("TotalRecords",
	 * results.getResultsFound()); object.put("FromIndex", results.getFromIndex());
	 * object.put("ToIndex", results.getToIndex()); object.put(objectType,
	 * responseArray); return object;
	 * 
	 * 
	 * }
	 */

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

		Collection<FlexObject> response = ordQuery
				.findOrderConfirmationsByCriteria(criteria, flexType, null, null, null).getResults();
		String oid = (String) response.iterator().next().get("ORDERCONFIRMATION.BRANCHIDITERATIONINFO");
		oid = "VR:com.lcs.wc.sourcing.OrderConfirmation:" + oid;
		if (response.size() == 0) {
			return "no record";
		} else {
			return oid;
		}
	}

	/**
	 * This method is used to get the oid of this flex object .
	 * 
	 * @param FlexObject flexObject
	 * @return String it returns the oid of this flex object in the form of String
	 */
	public String getOid(FlexObject flexObject) {

		if ((String) flexObject.getString("ORDERCONFIRMATION.BRANCHIDITERATIONINFO") != null) {
			return "VR:com.lcs.wc.sourcing.OrderConfirmation:"
					+ (String) flexObject.getString("ORDERCONFIRMATION.BRANCHIDITERATIONINFO");
		} else {
			return "";
		}
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
		OrderConfirmation orderConfirmation = (OrderConfirmation) LCSQuery.findObjectById(oid);

		try {
			orderConfirmation = (OrderConfirmation) VersionHelper.latestIterationOf(orderConfirmation);
		} catch (Exception e) {
		}
		jSONObject.put("oid", util.getVR(orderConfirmation));
		jSONObject.put("createdOn",
				FormatHelper.applyFormat(orderConfirmation.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("modifiedOn",
				FormatHelper.applyFormat(orderConfirmation.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("image", null);
		jSONObject.put("typeId", FormatHelper.getObjectId(orderConfirmation.getFlexType()));
		jSONObject.put("ORid", FormatHelper.getObjectId(orderConfirmation).toString());
		jSONObject.put("flexName", objectType);
		jSONObject.put("typeHierarchyName", orderConfirmation.getFlexType().getFullNameDisplay(true));
		jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(orderConfirmation));
		jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(orderConfirmation));
		String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
		jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
		Collection attributes = orderConfirmation.getFlexType().getAllAttributes();
		LCSSupplier source = null;
		if (((OrderConfirmationMaster) orderConfirmation.getMaster()).getOrderSource() != null) {
			source = (LCSSupplier) ((OrderConfirmationMaster) orderConfirmation.getMaster()).getOrderSource();
			jSONObject.put("supplierOid", util.getVR(source));
		}
		SearchResults resultsod = null;
		Collection branches = null;
		resultsod = OrderConfirmationQuery.findOrderConfirmationLineItemCollectionData(orderConfirmation, false, null);
		branches = resultsod.getResults();
		Iterator it = attributes.iterator();
		while (it.hasNext()) {
			FlexTypeAttribute att = (FlexTypeAttribute) it.next();
			String attKey = att.getAttKey();
			try {
				if (orderConfirmation.getValue(attKey) == null) {
					jSONObject.put(attKey, "");
				} else {
					jSONObject.put(attKey, orderConfirmation.getValue(attKey));
				}
			} catch (Exception e) {
			}
		}

		DataConversionUtil datConUtil = new DataConversionUtil();
		return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
				FormatHelper.getObjectId(orderConfirmation.getFlexType()));
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

		OrderConfirmation orderConfirmation = (OrderConfirmation) LCSQuery.findObjectById(oid);
		JSONObject jSONObject = new JSONObject();
		if (association.equalsIgnoreCase("Product")) {
			jSONObject.put("Product", findOrdConfirmAssociationLinks(orderConfirmation));

		} else if (association.equalsIgnoreCase("Supplier")) {
			jSONObject.put("Supplier", findSuppliers(oid));
		} else if (association.equalsIgnoreCase("Order Confirmation Details")) {
			jSONObject.put("Order Confirmation Details", findLineItemnew(orderConfirmation));
		}else if (association.equalsIgnoreCase("Season")) {
			 jSONObject.put("Season", findSeason(oid)); }


		return jSONObject;
	}

	public JSONArray findOrdConfirmAssociationLinks(OrderConfirmation orderconf) throws WTException {

		SearchResults results2 = null;
		Collection branches = null;

		ProductModel productModel = new ProductModel();
		JSONObject productObject = new JSONObject();
		JSONArray productArray = new JSONArray();
		Collection filteredBranches = new ArrayList();
		try {

			results2 = OrderConfirmationQuery.findOrderConfirmationLineItemCollectionData(orderconf, false, null);
			Collection quotables = results2.getResults();
			if (quotables.size() > 0) {
				Iterator iterator = quotables.iterator();
				FlexObject fo;
				while (iterator.hasNext()) {
					fo = (FlexObject) iterator.next();
					String productId = "VR:com.lcs.wc.product.LCSProduct:"
							+ (String) fo.get("ORDERCONFIRMATIONLINEITEM.BRANCHIDA3C5");
					productObject = productModel.getRecordByOid("Product", productId);
					productArray.add(productObject);
				}
			}
		} catch (Exception e) {

			productArray.add(util.getExceptionJson(e.getMessage()));
		}
		return productArray;
	}

	public JSONArray findSuppliers(String orderconfOid) throws WTException {

		SearchResults results2 = null;
		LCSSupplier supplier = new LCSSupplier();
		JSONObject supplierObject = new JSONObject();
		JSONArray supplierArray = new JSONArray();
		SupplierModel supplierModel = new SupplierModel();

		try {
			Collection branches = new ArrayList();
			OrderConfirmation orderConfirmation = (OrderConfirmation) LCSQuery.findObjectById(orderconfOid);
			LCSSupplier source = null;
			if (((OrderConfirmationMaster) orderConfirmation.getMaster()).getOrderSource() != null) {
				source = (LCSSupplier) ((OrderConfirmationMaster) orderConfirmation.getMaster()).getOrderSource();
			}
			String supplierOid = util.getVR(source);

			supplierObject = supplierModel.getRecordByOid("Supplier", supplierOid);
			supplierArray.add(supplierObject);

		} catch (Exception e) {

			supplierArray.add(util.getExceptionJson(e.getMessage()));
		}
		return supplierArray;
	}

	public JSONArray findLineItem(OrderConfirmation orderconf) throws WTException {

		SearchResults results2 = null;
		Collection branches = null;
		JSONObject lineItemObject = new JSONObject();
		JSONArray lineItemArray = new JSONArray();
		ProductModel productModel = new ProductModel();
		JSONObject productObject = new JSONObject();
		JSONArray productArray = new JSONArray();
		Collection filteredBranches = new ArrayList();
		try {

			Iterator<OrderConfirmationLineItem> existing = OrderConfirmationQuery
					.findOrderConfirmationLineItemCollection(orderconf).iterator();
			// results2 =
			// OrderConfirmationQuery.findOrderConfirmationLineItemCollectionData(orderconf,
			// false, null);
			// Collection current = results2.getResults();
			///
			Collection attrsList = new ArrayList();
			Collection totalAttrs = orderconf.getFlexType().getAllAttributes();
			Iterator totalAttrsListItr = totalAttrs.iterator();
			while (totalAttrsListItr.hasNext()) {
				FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
				if (attribute.getAttScope().equals("LINEITEM_SCOPE")) {
					attrsList.add(attribute);
				}
			}
			// Iterator iter = current.iterator();
			OrderConfirmationLineItem orderConfirmationLineItem = null;
			FlexObject fo;
			while (existing.hasNext()) {

				orderConfirmationLineItem = (OrderConfirmationLineItem) existing.next();
				String oidoc = (String) FormatHelper.getObjectId(orderConfirmationLineItem).toString();
				lineItemObject = new JSONObject();
				FlexType octy = orderConfirmationLineItem.getFlexType();
				Iterator it = attrsList.iterator();
				while (it.hasNext()) {
					FlexTypeAttribute att = (FlexTypeAttribute) it.next();
					String attKey = att.getAttKey();
					try {
						if (orderConfirmationLineItem.getValue(attKey) == null) {
							lineItemObject.put(attKey, "");
						} else {
							lineItemObject.put(attKey, orderConfirmationLineItem.getValue(attKey));
						}
					} catch (Exception e) {
					}

				}
				productArray.add(lineItemObject);

			}

		} catch (Exception e) {

			productArray.add(util.getExceptionJson(e.getMessage()));
		}
		return productArray;
	}

	public JSONArray findLineItemnew(OrderConfirmation orderconf) throws WTException {

		SearchResults results2 = null;
		Collection branches = null;
		JSONObject lineItemObject = new JSONObject();
		JSONArray lineItemArray = new JSONArray();
		ProductModel productModel = new ProductModel();
		JSONObject productObject = new JSONObject();
		JSONArray productArray = new JSONArray();
		Collection filteredBranches = new ArrayList();
		OrderConfirmationLineItemModel oclmodel = new OrderConfirmationLineItemModel();
		try {

			Iterator<OrderConfirmationLineItem> existing = OrderConfirmationQuery
					.findOrderConfirmationLineItemCollection(orderconf).iterator();

			OrderConfirmationLineItem orderConfirmationLineItem = null;
			FlexObject fo;
			while (existing.hasNext()) {

				orderConfirmationLineItem = (OrderConfirmationLineItem) existing.next();
				String oidoc = (String) FormatHelper.getObjectId(orderConfirmationLineItem).toString();
				lineItemObject = new JSONObject();
				lineItemObject = oclmodel.getRecordByOid("Order Confirmation Detail", oidoc);
				lineItemArray.add(lineItemObject);

			}

		} catch (Exception e) {

			productArray.add(util.getExceptionJson(e.getMessage()));
		}
		return lineItemArray;
	}
	public  JSONArray findSeason(String orderconfOid) throws WTException
    {
    
    	SearchResults results2 = null;
    	LCSSupplier supplier = new LCSSupplier();
        JSONObject seasonObject = new JSONObject();
        JSONArray seasonArray = new JSONArray();
        SeasonModel supplierModel =new SeasonModel();
     
   		try{
    	Collection branches = new ArrayList();
    	OrderConfirmation orderConfirmation = (OrderConfirmation) LCSQuery.findObjectById(orderconfOid);
    	LCSSeason season = null;
    	if(((OrderConfirmationMaster)orderConfirmation.getMaster()).getSeasonMaster() != null){
    	    LCSSeasonMaster seasonMaster = (LCSSeasonMaster)((OrderConfirmationMaster)orderConfirmation.getMaster()).getSeasonMaster();
    	    season = (LCSSeason)VersionHelper.latestIterationOf(seasonMaster);
    	   
    	
    	
		
    	String  seasonOid = util.getVR(season);
    	seasonObject = supplierModel.getRecordByOid("Season", seasonOid);
    	seasonArray.add(seasonObject);
    	}
    	
    	
    	}catch (Exception e) {
    		
    		seasonArray.add(util.getExceptionJson(e.getMessage()));
            }
            return seasonArray;
        }
    



}