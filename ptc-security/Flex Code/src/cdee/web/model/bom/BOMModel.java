
/*
 * Created on 06/20/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.bom;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.Vector;
import java.util.Date;
import java.util.List;
//import java.sql.Timestamp;
import wt.fc.WTObject;
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
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flexbom.*;
import com.lcs.wc.foundation.LCSLogic;
import com.lcs.wc.foundation.LCSQuery;
import wt.util.WTException;
import cdee.web.model.color.ColorModel;
import cdee.web.model.material.MaterialModel;
import cdee.web.model.material.MaterialSupplierModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import cdee.web.model.product.ProductModel;
import com.lcs.wc.util.LCSProperties;
//import com.lcs.wc.flexbom.BOMOwner;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
//import com.lcs.wc.supplier.LCSSupplierMaster;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.specification.FlexSpecification;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.specification.SpecificationModel;

public class BOMModel extends GenericObjectService {

	//private static final Logger LOGGER = LogR.getLogger(BOMModel.class.getName());
	//private static final String CLASSNAME = BOMModel.class.getName();

	AppUtil util = new AppUtil();
	Gson gson = new Gson();
	BOMLinkModel bomlinkModel = new BOMLinkModel();

	/**
	 * This method is used either insert or update the BOM part flex object that are
	 * passed by using type as reference, Using this method we can insert/update
	 * several records of a BOM part flex flextype at a time.
	 * 
	 * @param type        String
	 * @param oid         String
	 * @param bomJsonData Contains object of BOM part flex data
	 * @exception Exception
	 * @return JSONObject It returns BOM part flex JSONObject object
	 */
	/*
	 * public JSONObject saveOrUpdate(String type,String oid, JSONObject
	 * bomJsonData,JSONObject payloadJson) throws Exception { JSONObject
	 * responseObject = new JSONObject(); try{ if(oid == null){
	 * responseObject=insertBOM(type,payloadJson); }else {
	 * responseObject=updateBOM(oid,type,payloadJson); } }catch (Exception e) {
	 * responseObject = util.getExceptionJson(e.getMessage()); } return
	 * responseObject; }
	 */
	public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson, JSONObject payloadJson)
			throws Exception {
		JSONObject responseObject = new JSONObject();
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****" + type));
		try {

			if (oid == null) {
				ArrayList list = util.getOidFromSeachCriteria(type, searchJson, payloadJson);
				if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
					responseObject = updateBOM(list.get(2).toString(), type, payloadJson);
				} else {
					// responseObject = insertBOM(type, payloadJson);
					responseObject = insertcompleteBOM(type, payloadJson);

				}
			} else {
				responseObject = updateBOM(oid, type, payloadJson);
			}
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to initiate Bom for the given material
	 * 
	 * @param type
	 * @param bomAttrs
	 * @Exception exception
	 * @return JSONObject it returns the Response of BOM.
	 */
	/*
	 * public JSONObject insertBOM(String type,JSONObject bomAttrs)throws Exception{
	 * JSONObject responseObject = new JSONObject(); try{ String
	 * materialoid=(String)bomAttrs.get("materialOid"); String
	 * productOid=(String)bomAttrs.get("productOid"); String bomOwner="";
	 * 
	 * if(materialoid!=null){ bomOwner=materialoid; }else{ bomOwner=productOid; }
	 * FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel(); String
	 * typeId=(String) bomAttrs.get("typeId"); ciModel.setTypeId(typeId);
	 * DataConversionUtil datConUtil=new DataConversionUtil(); Map
	 * bomattrs=datConUtil.convertJSONToFlexTypeFormat(bomAttrs,type,(String)
	 * bomAttrs.get("typeId")); Map bomScopeAttrs = (Map)
	 * util.getScopeAttributes(FlexTypeCache.getFlexType(typeId), "BOM_SCOPE"); Map
	 * bomattrs = (Map) util.setJsonAttributes(bomScopeAttrs, bomAttrs);
	 * bomattrs.put("bomTypeId", (String) bomAttrs.get("typeId"));
	 * bomattrs.put("typeId", (String) bomAttrs.get("typeId")); bomattrs.put("oid",
	 * bomOwner); AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
	 * ciModel.initiateBOMPart(bomOwner, typeId, "MAIN", new ArrayList(), false);
	 * FlexBOMPart newPart = ciModel.getBusinessObject(); String
	 * bomOid=FormatHelper.getObjectId(newPart);
	 * responseObject=util.getInsertResponse(bomOid,type,responseObject);
	 * }catch(Exception e){ responseObject=util.getExceptionJson(e.getMessage()); }
	 * return responseObject; }
	 */

	public JSONObject insertcompleteBOM(String type, JSONObject payloadJson) throws Exception {
		JSONObject responseObject = new JSONObject();
		JSONObject responseObjectbomlink = new JSONObject();
		JSONArray bomlinkarrayresp = new JSONArray();
		String newPartOid = "";
		JSONObject bomAttrbutes = (JSONObject) payloadJson.get("bomData");
		if (bomAttrbutes.containsKey("bomOid")) {
			newPartOid = (String) bomAttrbutes.get("bomOid");
			responseObject = updateBOM(newPartOid, type, bomAttrbutes);
		
		} else {
			responseObject = insertBOM(type, bomAttrbutes);
			newPartOid = (String) responseObject.get("oid");
		}

		FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
		newPart = (FlexBOMPart) VersionHelper.checkout(newPart);
		if (payloadJson.containsKey("bomLinkData")) {

			JSONArray inputArray = (JSONArray) payloadJson.get("bomLinkData");
			Iterator itr = inputArray.iterator();
			while (itr.hasNext()) {
				JSONObject bomLinkAttrbutes = (JSONObject) itr.next();
				bomLinkAttrbutes.put("BOMOid", newPartOid);
				if ((bomLinkAttrbutes.containsKey("skuId")) && (bomLinkAttrbutes.containsKey("bomLinkOid")))
					responseObjectbomlink = bomlinkModel.insertBomLinkVariants("BOM Link", bomLinkAttrbutes);
				else if (bomLinkAttrbutes.containsKey("bomLinkOid")) {
					String bomloid = (String) bomLinkAttrbutes.get("bomLinkOid");
					responseObjectbomlink = bomlinkModel.updateBomLink(bomloid, "BOM Link", bomLinkAttrbutes);

				} else
					responseObjectbomlink = bomlinkModel.insertBomLink("BOM Link", bomLinkAttrbutes);
				bomlinkarrayresp.add(responseObjectbomlink);
			}

		}
		newPart = (FlexBOMPart) VersionHelper.checkin(newPart);
		responseObject.put("BOMLink", bomlinkarrayresp);
		return responseObject;

	}

	public JSONObject insertBOM(String type, JSONObject bomAttrs) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Save initialized *****" + type));
		// JSONObject bomAttrs = (JSONObject) cbomAttrs.get("bomData");
		JSONObject responseObject = new JSONObject();
		try {
			String bomOwner = "";
			if (bomAttrs.containsKey("productId")) {
				String productId = (String) bomAttrs.get("productId");
				bomOwner = productId;

			} else if (bomAttrs.containsKey("materialId")) {
				String materialId = (String) bomAttrs.get("materialId");
				bomOwner = materialId;
			}
			// Check for Specification IDs
			List specificationIds = new ArrayList();
			if (bomAttrs.containsKey("specificationId")) {
				String specId = (String) bomAttrs.get("specificationId");
				specificationIds.add(specId);
			}
			/*
			 * if(materialoid!=null){ bomOwner=materialoid; }else{ bomOwner=productOid; }
			 */
			FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel();
			String typeId = (String) bomAttrs.get("typeId");
			ciModel.setTypeId(typeId);
			DataConversionUtil datConUtil = new DataConversionUtil();
			Map bomattrs = datConUtil.convertJSONToFlexTypeFormat(bomAttrs, type, (String) bomAttrs.get("typeId"));
			/*
			 * Map bomScopeAttrs = (Map)
			 * util.getScopeAttributes(FlexTypeCache.getFlexType(typeId), "BOM_SCOPE"); Map
			 * bomattrs = (Map) util.setJsonAttributes(bomScopeAttrs, bomAttrs);
			 */
			bomattrs.put("bomTypeId", (String) bomAttrs.get("typeId"));
			bomattrs.put("typeId", (String) bomAttrs.get("typeId"));
			bomattrs.put("oid", bomOwner);
			AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
			ciModel.initiateBOMPart(bomOwner, typeId, "MAIN", specificationIds, false);
			FlexBOMPart newPart = ciModel.getBusinessObject();
			String bomOid = FormatHelper.getVersionId(newPart);
			responseObject = util.getInsertResponse(bomOid, type, responseObject);

		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used to update Bom for the given material
	 * 
	 * @param bomOid
	 * @param type
	 * @param bomAttrs
	 * @Exception exception
	 * @return JSONObject it returns the Response of BOM.
	 */

	/*
	 * public JSONObject updateBOM(String bomOid,String type,JSONObject
	 * bomAttrs)throws Exception{ JSONObject responseObject = new JSONObject(); try{
	 * FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel();
	 * ciModel.load(bomOid); DataConversionUtil datConUtil=new DataConversionUtil();
	 * Map
	 * bomattrs=datConUtil.convertJSONToFlexTypeFormat(bomAttrs,type,FormatHelper.
	 * getObjectId(ciModel.getFlexType()));
	 * 
	 * Map bomScopeAttrs = (Map) util.getScopeAttributes(ciModel.getFlexType(),
	 * "BOM_SCOPE"); Map bomattrs = (Map) util.setJsonAttributes(bomScopeAttrs,
	 * bomAttrs); AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
	 * ciModel.save(); bomOid=FormatHelper.getObjectId(ciModel.getBusinessObject());
	 * responseObject=util.getUpdateResponse(bomOid,type,responseObject);
	 * }catch(Exception e){ responseObject=util.getExceptionJson(e.getMessage()); }
	 * return responseObject;
	 * 
	 * boolean isCheckedOut =
	 * VersionHelper.isCheckedOut(bomPartClientModel.getBusinessObject());
	 * bomPartClientModel.load(oid); FlexBOMPart bomPart1 =
	 * bomPartClientModel.getBusinessObject(); LCSProduct prodSeasonRev =
	 * (LCSProduct) VersionHelper.latestIterationOf(bomPart1.getOwnerMaster());
	 * AttributeValueSetter.setAllAttributes(bomPartClientModel,
	 * RequestHelper.hashRequest(request)); bomPartClientModel.save(); boolean
	 * isCheckedOut1 =
	 * VersionHelper.isCheckedOut(bomPartClientModel.getBusinessObject());
	 * if(!isCheckedOut){ bomPartClientModel.checkIn(); } }
	 */
	public JSONObject updateBOM(String bomOid, String type, JSONObject bomAttrs) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Update Bom initialized *****" + bomOid));
		JSONObject responseObject = new JSONObject();
		try {

			FlexBOMPart bomPart = (FlexBOMPart) LCSQuery.findObjectById(bomOid);
			bomPart = (FlexBOMPart) VersionHelper.checkout(bomPart);
			bomOid = FormatHelper.getVersionId(bomPart);
			 FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel();
			 boolean isCheckedOut = VersionHelper.isCheckedOut(ciModel.getBusinessObject());
	            ciModel.load(bomOid);
	            DataConversionUtil datConUtil=new DataConversionUtil();
	            Map bomattrs=datConUtil.convertJSONToFlexTypeFormat(bomAttrs,type,FormatHelper.getObjectId(ciModel.getFlexType()));
	            /*Map bomScopeAttrs = (Map) util.getScopeAttributes(ciModel.getFlexType(), "BOM_SCOPE");
	            Map bomattrs  = (Map) util.setJsonAttributes(bomScopeAttrs, bomAttrs);*/
	          //  AttributeHandler.setAttributeValues(flexType, bomParameter.getAttributesMap(), flexBOMPartClientModel, bomParameter.getActionFlag(), FlexBOMFlexTypeScopeDefinition.BOM_SCOPE, null);
	            AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
	            ciModel.save();
		        if(!isCheckedOut){
		        	ciModel.checkIn();
		        }
	            bomOid=FormatHelper.getVersionId(ciModel.getBusinessObject());
	            
	            responseObject=util.getUpdateResponse(bomOid,type,responseObject);
			/*
			 * FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel();
			 * ciModel.load(bomOid); DataConversionUtil datConUtil = new
			 * DataConversionUtil(); Map convertedAttrs =
			 * datConUtil.convertJSONToFlexTypeFormat(bomAttrs, type,(String)
			 * bomAttrs.get("typeId")); System.out.println(".....updateBOM convertedAttrs "
			 * + convertedAttrs); AttributeValueSetter.setAllAttributes(ciModel,
			 * convertedAttrs); System.out.println(".....updateBOM before save " );
			 */
			//ciModel.save();
			//responseObject = util.getUpdateResponse(FormatHelper.getObjectId(ciModel), type, responseObject);
			/*
			 * FlexBOMPartClientModel ciModel = new FlexBOMPartClientModel(); boolean
			 * isCheckedOut = VersionHelper.isCheckedOut(ciModel.getBusinessObject());
			 * 
			 * ciModel.load(bomOid); //String typeId=(String) bomAttrs.get("typeId");
			 * //ciModel.setTypeId(typeId); DataConversionUtil datConUtil=new
			 * DataConversionUtil(); Map
			 * bomattrs=datConUtil.convertJSONToFlexTypeFormat(bomAttrs,type,(String)
			 * bomAttrs.get("typeId")); Map bomScopeAttrs = (Map)
			 * util.getScopeAttributes(FlexTypeCache.getFlexType(typeId), "BOM_SCOPE"); Map
			 * bomattrs = (Map) util.setJsonAttributes(bomScopeAttrs, bomAttrs);
			 * //bomattrs.put("bomTypeId", (String) bomAttrs.get("typeId"));
			 * //bomattrs.put("typeId", (String) bomAttrs.get("typeId"));
			 * //bomattrs.put("oid", bomOwner);
			 * AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
			 * 
			 * //DataConversionUtil datConUtil=new DataConversionUtil(); //Map
			 * bomattrs=datConUtil.convertJSONToFlexTypeFormatUpdate(bomAttrs,type,
			 * FormatHelper.getObjectId(ciModel.getFlexType()));
			 * 
			 * Map bomScopeAttrs = (Map) util.getScopeAttributes(ciModel.getFlexType(),
			 * "BOM_SCOPE"); Map bomattrs = (Map) util.setJsonAttributes(bomScopeAttrs,
			 * bomAttrs); //AttributeValueSetter.setAllAttributes(ciModel, bomattrs);
			 * ciModel.save(); if(!isCheckedOut){ ciModel.checkIn(); }
			 * bomOid=FormatHelper.getVersionId(ciModel.getBusinessObject());
			 * responseObject=util.getUpdateResponse(bomOid,type,responseObject);
			 */
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}

	/**
	 * This method is used delete BOM Part of given oid,
	 * 
	 * @param bomOid String
	 * @exception Exception
	 * @return JSONObject It returns response JSONObject object
	 */
	public JSONObject delete(String bomOid) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with object *****" + bomOid));
		JSONObject responseObject = new JSONObject();
		LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
		FlexBOMPart flexBOMParts = (FlexBOMPart) LCSQuery.findObjectById(bomOid);
		LCSFlexBOMLogic lcsFlexBOMLogic = new LCSFlexBOMLogic();
		try {
			try {
				Collection bomLinks = lCSFlexBOMQuery.findFlexBOMLinks(flexBOMParts, null, null, null, null, null,
						"WIP_ONLY", null, false, "ALL_DIMENSIONS", null, null, null);
				lcsFlexBOMLogic.deleteLinks(bomLinks);
			} catch (Exception e) {
			}
			lcsFlexBOMLogic.deleteFlexBOMPart(flexBOMParts);
			responseObject = util.getDeleteResponseObject("BOM Part", bomOid, responseObject);
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
		return new FlexTypeClassificationTreeLoader("com.lcs.wc.flexbom.FlexBOMPart");
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

	public JSONObject getFlexSchema(String type, String typeId) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** flex schema details ***** "));
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
					if (attribute.getAttScope().equals("BOM_SCOPE")) {
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
	 * This method is used to get the records of this flexObject .
	 * 
	 * @param objectType  String which contians flexObject name
	 * @param criteriaMap Map which contains attributes with key value pair This
	 *                    criteria map conatins a key value pair of attributes.Based
	 *                    up on the criteriaMap we can filter the records
	 * @exception Exception
	 * @return JSONObject it returns all the records of this flex object in the form
	 *         of json
	 */

	public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Retrive Records ***** "));
		JSONObject object = new JSONObject();
		FlexType flexType = null;
		String typeId = (String) criteriaMap.get("typeId");
		if (typeId == null) {
			flexType = FlexTypeCache.getFlexTypeRoot(objectType);
		} else {
			flexType = FlexTypeCache.getFlexType(typeId);
		}
		Collection results = null;
		try {
			Map criteria = new HashMap();
			results = new LCSFlexBOMQuery().findWhereUsedData(criteria, null, null, null, Integer.parseInt("0"));
		} catch (Exception e) {
		}
		Iterator itr = results.iterator();
		JSONArray responseArray = new JSONArray();
		JSONObject mainResponseObject = new JSONObject();
		while (itr.hasNext()) {
			JSONObject responseObject = new JSONObject();
			FlexObject flexObject = (FlexObject) itr.next();
			String flexPartOid = getOid(flexObject);
			responseObject = getRecordByOid("BOM", flexPartOid);
			JSONArray bomLinkArray = findBOMLinksWithScehma(flexPartOid);
			responseObject.put("BOM Links", bomLinkArray);
			responseArray.add(responseObject);
		}
		object.put("BOM Parts", responseArray);
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
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Search by Name ***** " + name));
		String oid = "no record";
		Collection productBOMs = new ArrayList();
		;
		try {
			if (criteria != null) {
				String productId = (String) criteria.get("productId");
				String specificationId = (String) criteria.get("specificationId");
				String bomName = "";
				if ((String) criteria.get("name") != null)
					bomName = (String) criteria.get("name");
				if (productId != null) {
					LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(productId);
					if (specificationId != null) {
						FlexSpecification specification = (FlexSpecification) LCSQuery.findObjectById(specificationId);
						productBOMs = new LCSFlexBOMQuery().findBOMPartsForOwner(lcsProduct, null, null, specification,
								bomName);
					} else
						productBOMs = new LCSFlexBOMQuery().findBOMPartsForOwner(lcsProduct, null, null, null, bomName);
				} else {
					return oid;
				}

				// FlexSpecification specification
			}

			if (productBOMs.size() == 0) {
				oid = "no record";
			} else {
				FlexBOMPart sourceBOMPart = (FlexBOMPart) productBOMs.iterator().next();
				String newBOMName = sourceBOMPart.getName();
				String newBOMId = FormatHelper.getVersionId(sourceBOMPart);
				oid = newBOMId;

			}

		} catch (Exception ex) {
			//if (LOGGER.isDebugEnabled())
				//LOGGER.debug((Object) (CLASSNAME + "***** Exception ***** " + ex.getMessage()));

		}

		return oid;

	}

	/**
	 * This method is used to get the oid of this flex object .
	 * 
	 * @param FlexObject flexObject
	 * @return String it returns the oid of this flex object in the form of String
	 */
	public String getOid(FlexObject flexObject) {
		return "OR:com.lcs.wc.flexbom.FlexBOMPart:" + (String) flexObject.getString("FLEXBOMPART.IDA2A2");
	}

	/**
	 * This method is used to get the record that matched with the given oid of this
	 * flex object .
	 * 
	 * @param String objectType
	 * @param String oid
	 * @Exception exception
	 * @return JSONObject it returns the record that matched the given oid of this
	 *         flex object
	 */
	public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** initializing get Record by oid *****" + oid));
		JSONObject jSONObject = new JSONObject();
		FlexBOMPart flexBOMPartInput = (FlexBOMPart) LCSQuery.findObjectById(oid);
		FlexBOMPart flexBOMPart = flexBOMPartInput;
		try {
			flexBOMPart = (FlexBOMPart) VersionHelper.latestIterationOf(flexBOMPartInput);
		} catch (Exception e) {

		}
		jSONObject.put("image", null);
		jSONObject.put("createdOn",
				FormatHelper.applyFormat(flexBOMPart.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("modifiedOn",
				FormatHelper.applyFormat(flexBOMPart.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
		jSONObject.put("typeId", FormatHelper.getObjectId(flexBOMPart.getFlexType()));
		// jSONObject.put("oid",FormatHelper.getVersionId(flexBOMPart).toString());
		// jSONObject.put("vid",FormatHelper.getObjectId(flexBOMPart).toString());
		// jSONObject.put("oid",FormatHelper.getVersionId(flexBOMPart).toString());
		jSONObject.put("oid", util.getVR(flexBOMPart));
		// jSONObject.put("trcId",FormatHelper.getVersionId(flexBOMPart).toString());
		jSONObject.put("ORid", FormatHelper.getObjectId(flexBOMPart).toString());
		jSONObject.put("flexName", objectType);
		jSONObject.put("typeHierarchyName", flexBOMPart.getFlexType().getFullNameDisplay(true));
		jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(flexBOMPart));
		jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(flexBOMPart));
		jSONObject.put("updatedAt", getMilliSec() + "");
		String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
		jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
		Collection attributes = flexBOMPart.getFlexType().getAllAttributes();
		Iterator it = attributes.iterator();
		while (it.hasNext()) {
			FlexTypeAttribute att = (FlexTypeAttribute) it.next();
			String attKey = att.getAttKey();
			try {
				if (flexBOMPart.getValue(attKey) == null) {
					jSONObject.put(attKey, "");
				} else {
					jSONObject.put(attKey, flexBOMPart.getValue(attKey).toString());
				}
			} catch (Exception e) {
			}
		}
		DataConversionUtil datConUtil = new DataConversionUtil();
		return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
				FormatHelper.getObjectId(flexBOMPart.getFlexType()));
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
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Retrive records by oid ***** " + oid));
		JSONObject jSONObject = new JSONObject();
		/*
		 * if(association.equalsIgnoreCase("BOM Link")){
		 * jSONObject.put("BOM Link",findBOMLinksWithScehma(oid)); }else
		 */
		if (association.equalsIgnoreCase("Product")) {
			jSONObject.put("Product", findAssociationLinks(oid, "Product"));
		} else if (association.equalsIgnoreCase("BOMLink")) {
			jSONObject.put("BOMLink", findBOMLinks(oid));
		} else if (association.equalsIgnoreCase("BOM Link")) {
			jSONObject.put("BOM Link", findBOMLinksWithScehma(oid));
		} else if (association.equalsIgnoreCase("Specification")) {
			jSONObject.put("Specification", findAssociationLinks(oid, "Specification"));
		} else if (association.equalsIgnoreCase("Sourcing Configuration")) {
			jSONObject.put("Sourcing Configuration", findAssociationLinks(oid, "Sourcing Configuration"));
		}
		return jSONObject;
	}

	/**
	 * This method is used to get all BOMLinks of given BOMPart oid
	 * 
	 * @param flexBOMPartOid String
	 * @return JSONArray it returns all BOMLinks of given BOMPart oid
	 */
	public JSONArray findBOMLinks(String flexBOMPartOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Initializing in associated bomLinks *****" + flexBOMPartOid));
		JSONArray flexBOMLinkArray = new JSONArray();
		BOMLinkModel bomLinkModel = new BOMLinkModel();
		MaterialModel materialModel = new MaterialModel();
		SupplierModel supplierModel = new SupplierModel();
		ColorModel colorModel = new ColorModel();
		LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
		try {
			FlexBOMPart flexBOMParts = (FlexBOMPart) LCSQuery.findObjectById(flexBOMPartOid);
			Collection bomData = new ArrayList();
			boolean USE_MULTILEVEL = LCSProperties.getBoolean("jsp.flexbom.ViewBOM.useMultilevel");
			boolean multiLevel = USE_MULTILEVEL;
			String skuMasterId = "";
			String skuMode = "ALL_SKUS";
			String sourceDimId = "";
			String destinationId = "";
			String size1 = "";
			String size2 = "";
			String timestamp = "";

			Iterator totalAttrsListItr = flexBOMParts.getFlexType().getAllAttributes().iterator();
			Collection attrsList = new ArrayList();
			while (totalAttrsListItr.hasNext()) {
				FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
				if (attribute.getAttScope().equals("LINK_SCOPE")) {
					attrsList.add(attribute.getAttKey());
				}
			}

			FlexType materialType = FlexTypeCache.getFlexTypeFromPath("Material");
			bomData = LCSFindFlexBOMHelper.findBOM(flexBOMParts, skuMasterId, sourceDimId, size1, size2, destinationId,
					skuMode, timestamp, new Boolean(multiLevel), materialType, attrsList);
			Iterator iterator = bomData.iterator();
			while (iterator.hasNext()) {

				String materialOid = "";
				String materialSupplierOid = "";
				String supplierOid = "";
				FlexObject flexObject = (FlexObject) iterator.next();
				JSONObject bomResObject = new JSONObject();
				for (Map.Entry<String, Object> entry : flexObject.entrySet()) {
					String key = entry.getKey();
					Object value = entry.getValue();
					if (key.equalsIgnoreCase("MATERIALSUPPLIERBRANCHID")) {
						bomResObject.put("MATERIALSUPPLIERID", "VR:com.lcs.wc.material.LCSMaterialSupplier:" + value);
					}
					if (key.equalsIgnoreCase("MATERIALBRANCHID")) {
						bomResObject.put("MATERIALID", "VR:com.lcs.wc.material.LCSMaterial:" + value);
					}
					if (entry.getValue() == null) {
						bomResObject.put(key, "");
					} else {
						bomResObject.put(key, value);
					}
				}

				if (bomResObject.containsKey("MATERIALSUPPLIERID")) {
					String materialSupplierid = (String) bomResObject.get("MATERIALSUPPLIERID");
					LCSMaterialSupplier lcsMaterialSupplier = (LCSMaterialSupplier) LCSQuery
							.findObjectById(materialSupplierid);
					LCSSupplier supplier = (LCSSupplier) VersionHelper
							.latestIterationOf(lcsMaterialSupplier.getSupplierMaster());
					supplierOid = FormatHelper.getObjectId(supplier);

				}
				bomResObject.put("SUPPLIERID", supplierOid);
				// bomResObject.put("MATERIALSUPPLIERID", materialSupplierOid);
				// bomResObject.put("MATERIALID", materialOid);
				flexBOMLinkArray.add(bomResObject);
			}

		} catch (Exception e) {
		}

		return flexBOMLinkArray;
	}

	/**
	 * This method is used to get all BOMLinks of given BOMPart oid
	 * 
	 * @param flexBOMPartOid String
	 * @return JSONArray it returns all BOMLinks of given BOMPart oid
	 */
	public JSONArray findBOMLinksWithScehma(String flexBOMPartOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "*****Search Bom links with schema ***** " + flexBOMPartOid));
		JSONArray flexBOMLinkArray = new JSONArray();
		BOMLinkModel bomLinkModel = new BOMLinkModel();
		MaterialModel materialModel = new MaterialModel();
		SupplierModel supplierModel = new SupplierModel();
		String skuMode = "ALL_SKUS";// ALL_SKUS
		String dimensionMode = "ALL_DIMENSIONS";// ALL_DIMENSIONS,DIMENSION_OVERRIDES_ONLY,ALL_APPLICABLE_TO_DIMENSION
		String sourceMode = "ALL_SOURCES";// ALL_SOURCES
		String sizeMode = "";// ALL_SIZE1_AND_2,ALL_SIZE2
		String wipMode = "";// WIP_ONLY,EFFECTIVE_ONLY
		MaterialSupplierModel materialSupplierModel = new MaterialSupplierModel();
		ColorModel colorModel = new ColorModel();
		LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
		try {
			FlexBOMPart flexBOMParts = (FlexBOMPart) LCSQuery.findObjectById(flexBOMPartOid);
			SearchResults results = lCSFlexBOMQuery.findFlexBOMData(flexBOMParts, null, null, null, null, null, wipMode,
					null, false, false, dimensionMode, skuMode, sourceMode, sizeMode);
			Collection bomResponse = results.getResults();

			Iterator itrs = bomResponse.iterator();
			while (itrs.hasNext()) {
				FlexObject flexObject = (FlexObject) itrs.next();
				String flexBOMLinkOid = bomLinkModel.getOid(flexObject);
				JSONObject flexBOMLinkObject = bomLinkModel.getRecordByOid("BOM Links", flexBOMLinkOid);
				String materialOid = "";
				if ((String) flexObject.getString("LCSMATERIAL.BRANCHIDITERATIONINFO") != "") {
					materialOid = materialModel.getOid(flexObject);
				} else {
					materialOid = "";
				}
				String supplierOid = "";
				if ((String) flexObject.getString("LCSSUPPLIER.BRANCHIDITERATIONINFO") != "") {
					supplierOid = supplierModel.getOid(flexObject);
				} else {
					supplierOid = "";
				}
				String materialSupplierOid = "";
				if ((String) flexObject.getString("LCSMATERIALSUPPLIER.BRANCHIDITERATIONINFO") != "") {
					materialSupplierOid = materialSupplierModel.getOid(flexObject);
				} else {
					materialSupplierOid = "";
				}
				try {
					String colorOid = "";
					if ((String) flexObject.getString("LCSCOLOR.IDA2A2") != "") {
						colorOid = colorModel.getOid(flexObject);
					} else {
						colorOid = "";
					}
					// flexBOMLinkObject.put("colorOid",colorOid);
				} catch (Exception e1) {
				}
				// flexBOMLinkObject.put("materialOid",materialOid);
				// flexBOMLinkObject.put("supplierOid",supplierOid);
				flexBOMLinkObject.put("materialSupplierOid", materialSupplierOid);
				flexBOMLinkObject.put("BRANCH", flexObject.getString("FLEXBOMLINK.BRANCHID"));
				flexBOMLinkObject.put("DIMENSIONID", flexObject.getString("FLEXBOMLINK.DIMENSIONID"));
				flexBOMLinkObject.put("supplierName", flexObject.getString("LCSSUPPLIERMASTER.SUPPLIERNAME"));
				flexBOMLinkArray.add(flexBOMLinkObject);
			}
		} catch (Exception e) {
		}

		return flexBOMLinkArray;
	}

	public long getMilliSec() {
		Date date = new Date();
		long millisec = date.getTime();
		return millisec;
	}

	public JSONArray findAssociationLinks(String flexBOMPartOid, String object) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** Initializing in associated Product with given BOM Id ***** "
					//+ flexBOMPartOid));
		ProductModel productModel = new ProductModel();
		JSONArray productArray = new JSONArray();
		String mainProductId = "";
		try {
			FlexBOMPart fbomPart = (FlexBOMPart) LCSQuery.findObjectById(flexBOMPartOid);
			BOMOwner ownerMaster = fbomPart.getOwnerMaster();
			LCSProduct product = null;
			if (ownerMaster instanceof LCSPartMaster) {
				product = (LCSProduct) VersionHelper.getVersion(ownerMaster, "A");
				mainProductId = FormatHelper.getVersionId(product);
			}
			// Get all product IDs where BOM used
			// Get all product IDs where BOM used
			Collection productList = new Vector();
			Collection specList = new Vector();
			Collection sourceList = new Vector();

			if (fbomPart != null) {
				Collection whereUsed = FlexSpecQuery.componentWhereUsed((WTObject) fbomPart.getMaster());
				Iterator iterWhereUsed = whereUsed.iterator();
				FlexObject flexObj = null;
				while (iterWhereUsed.hasNext()) {
					flexObj = (FlexObject) iterWhereUsed.next();
					if (FormatHelper.hasContent(flexObj.getString("FLEXSPECTOCOMPONENTLINK.COMPONENTPARENTID"))) {
						String parentId = flexObj.getString("FLEXSPECTOCOMPONENTLINK.COMPONENTPARENTID");
					}

					if (FormatHelper.hasContent(flexObj.getString("LCSPRODUCT.BRANCHIDITERATIONINFO"))) {
						String productDefNo = "VR:com.lcs.wc.product.LCSProduct:"
								+ flexObj.get("LCSPRODUCT.BRANCHIDITERATIONINFO");
						if (!productList.contains(productDefNo))
							productList.add(productDefNo);

					}

					if (FormatHelper.hasContent(flexObj.getString("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO"))) {
						String sourceDefNo = "VR:com.lcs.wc.sourcing.LCSSourcingConfig:"
								+ flexObj.get("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO");
						if (!sourceList.contains(sourceDefNo))
							sourceList.add(sourceDefNo);

					}
					if (FormatHelper
							.hasContent(flexObj.getString("LATESTITERFLEXSPECIFICATION.BRANCHIDITERATIONINFO"))) {
						String specDefNo = "VR:com.lcs.wc.specification.FlexSpecification:"
								+ flexObj.get("LATESTITERFLEXSPECIFICATION.BRANCHIDITERATIONINFO");
						if (!specList.contains(specDefNo))
							specList.add(specDefNo);

					}

				}

				if (object.equalsIgnoreCase("Product")) {
					// IF main product not included include BOM product
					if (!productList.contains(mainProductId))
						productList.add(mainProductId);
					Iterator productListIterator = productList.iterator();
					while (productListIterator.hasNext()) {
						String productId = (String) productListIterator.next();
						JSONObject productObject = productModel.getRecordByOid("Product", productId);
						productArray.add(productObject);
					}
				} else if (object.equalsIgnoreCase("Specification")) {
					SpecificationModel specModel = new SpecificationModel();
					Iterator specListIterator = specList.iterator();
					while (specListIterator.hasNext()) {
						String specId = (String) specListIterator.next();
						JSONObject specObject = specModel.getRecordByOid("Product", specId);
						productArray.add(specObject);
					}
				} else if (object.equalsIgnoreCase("Sourcing Configuration")) {
					SourcingConfigurationModel sourceModel = new SourcingConfigurationModel();
					Iterator sourceListIterator = sourceList.iterator();
					while (sourceListIterator.hasNext()) {
						String sourceId = (String) sourceListIterator.next();
						JSONObject sourceObject = sourceModel.getRecordByOid("Sourcing Configuration", sourceId);
						productArray.add(sourceObject);
					}
				}
			}

		} catch (Exception e) {
			productArray.add(util.getExceptionJson(e.getMessage()));
		}
		return productArray;
	}

}