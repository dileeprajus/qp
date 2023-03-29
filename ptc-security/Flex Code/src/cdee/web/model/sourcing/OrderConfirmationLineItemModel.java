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
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.LCSMaterialSupplierQuery;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
//import com.lcs.wc.sourcing.RFQQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import java.util.HashMap;

import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
//import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.sourcing.OrderConfirmation;
import com.lcs.wc.sourcing.OrderConfirmationClientModel;
import com.lcs.wc.sourcing.OrderConfirmationLineItem;
import com.lcs.wc.sourcing.OrderConfirmationLogic;
import com.lcs.wc.sourcing.OrderConfirmationMaster;
import com.lcs.wc.sourcing.OrderConfirmationQuery;
import com.lcs.wc.sourcing.RFQQuery;
import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.supplier.LCSSupplier;

import wt.util.WTException;
//import com.lcs.wc.sourcing.RFQLogic;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import wt.util.WTException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.model.material.MaterialSupplierModel;
import cdee.web.model.product.ProductModel;
import cdee.web.model.specification.SpecificationModel;
import cdee.web.model.supplier.SupplierModel;

import com.lcs.wc.util.VersionHelper;

public class OrderConfirmationLineItemModel extends GenericObjectService {

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
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.OrderConfirmationLineItem");
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

	
	public JSONObject getFlexSchema(String type,String typeId) throws Exception{
	     
	        JSONObject responseObject=new JSONObject();
	        try{
	            JSONObject jsonAsscos = util.getConfigureJSON();
	            JSONObject configObject =(JSONObject)jsonAsscos.get(type);
	            if(configObject!=null){
	                JSONObject attributesObj=(JSONObject) configObject.get("properties");
	                Collection attrsList = new ArrayList() ;
	                Collection totalAttrs = null;
	                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
	                    totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
	                }else{
	                    totalAttrs=FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
	                }
	                Iterator totalAttrsListItr = totalAttrs.iterator();
	                while(totalAttrsListItr.hasNext()){
	                    FlexTypeAttribute attribute=(FlexTypeAttribute)totalAttrsListItr.next();
	                    attrsList.add(attribute);
	                }
	                attributesObj=util.getAttributesData(attrsList,attributesObj);
	                responseObject.put("properties",attributesObj);
	                responseObject.put("type","object");
	                FlexType treeNodeFlexType = null;
	                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
	                  treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
	                }else{
	                  treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
	                }
	                String typeName = treeNodeFlexType.getFullNameDisplay(true);
	                JSONObject basicDetails = new JSONObject();
	                basicDetails.put("typeId",typeId);
	                basicDetails.put("rootObjectName",type);
	                basicDetails.put("typeName",typeName);
	                responseObject.put("basicDetails",basicDetails);
	                responseObject.put("transformation_kind",(JSONObject)configObject.get("transformation_kind"));
	                responseObject.put("associations",(JSONObject)configObject.get("associations"));
	            }else{
	                throw new FlexObjectNotFoundException(type +" does not Exist in ConfigurationRelations.json file");
	            } 
	        }catch(WTException we){
	            responseObject = util.getExceptionJson(we.getMessage());
	        }catch(FlexObjectNotFoundException foe){
	            responseObject = util.getExceptionJson(foe.getMessage());
	        }catch(FileNotFoundException fe){
	            responseObject = util.getExceptionJson(fe.getMessage());
	        }catch(Exception e){
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
			return "OR:com.lcs.wc.sourcing.OrderConfirmationLineItem:"
					+ (String) flexObject.getString("ORDERCONFIRMATION.BRANCHIDA3C5");
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
		OrderConfirmationLineItem orderConfirmationli = (OrderConfirmationLineItem) LCSQuery.findObjectById(oid);
		/*
		 * try{ orderConfirmationli = (OrderConfirmationLineItem)
		 * VersionHelper.latestIterationOf(orderConfirmationli); }catch(Exception e){ }
		 */
		FlexType objectFlexType = orderConfirmationli.getFlexType();
		jSONObject.put("oid", FormatHelper.getObjectId(orderConfirmationli).toString());
		jSONObject.put("createdOn",
		FormatHelper.applyFormat(orderConfirmationli.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("modifiedOn",
		FormatHelper.applyFormat(orderConfirmationli.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("image", null);
		jSONObject.put("typeId", FormatHelper.getObjectId(orderConfirmationli.getFlexType()));
		jSONObject.put("ORid", FormatHelper.getObjectId(orderConfirmationli).toString());
		jSONObject.put("flexName", orderConfirmationli.getFlexType().getFullName());
		jSONObject.put("typeHierarchyName", orderConfirmationli.getFlexType().getFullNameDisplay(true));
		jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(orderConfirmationli));
		jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericObjectIdFromObject(orderConfirmationli));
		String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
		jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
		Collection attributes = orderConfirmationli.getFlexType().getAllAttributes();
		Iterator it = attributes.iterator();
		while (it.hasNext()) {
			FlexTypeAttribute att = (FlexTypeAttribute) it.next();
			String attKey = att.getAttKey();
			try {
				if (orderConfirmationli.getValue(attKey) == null) {
					jSONObject.put(attKey, "");
				} else {
					jSONObject.put(attKey, orderConfirmationli.getValue(attKey));
				}
			} catch (Exception e) {
			}
		}
		
		DataConversionUtil datConUtil = new DataConversionUtil();
		return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
				FormatHelper.getObjectId(orderConfirmationli.getFlexType()));
	}

}