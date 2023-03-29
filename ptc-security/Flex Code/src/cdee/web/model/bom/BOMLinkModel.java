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

import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
//import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
//import com.lcs.wc.db.SearchResults;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import com.lcs.wc.flextype.FlexTypeAttribute;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.model.color.ColorModel;
import cdee.web.model.material.MaterialColorModel;
import cdee.web.model.material.MaterialModel;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.LCSMaterialColor;
import com.lcs.wc.color.LCSColor;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.foundation.LCSLogic;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.flexbom.BOMOwner;
import com.lcs.wc.flexbom.FlexBOMLink;
import com.lcs.wc.flexbom.LCSFlexBOMLogic;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.supplier.LCSSupplierMaster;
import com.lcs.wc.material.LCSMaterialMaster;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import cdee.web.util.DataConversionUtil;
import wt.util.WTException;
import java.io.FileNotFoundException;
import com.lcs.wc.material.LCSMaterialSupplierQuery;
import com.lcs.wc.product.LCSSKU;

import cdee.web.model.material.MaterialSupplierModel;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.log4j.LogR;
import wt.part.WTPartMaster;

//import org.apache.log4j.Logger;

public class BOMLinkModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(BOMLinkModel.class.getName());
    //private static final String CLASSNAME = BOMLinkModel.class.getName();

    AppUtil util = new AppUtil();
    Gson gson = new Gson();

    /**
     * This method is used either insert or update the BOM link flex object that are
     * passed by using type as reference, Using this method we can insert/update
     * record of a BOM link flextype.
     * 
     * @param type            String String which containd flexType
     * @param oid             String
     * @param bomLinkJsonData Contains of BOM link data
     * @exception Exception
     * @return JSONObject It returns BOM link JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject bomLinkJsonData, JSONObject payloadJson)
            throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****" + type));
        JSONObject responseObject = new JSONObject();
        try {
        	if(payloadJson.containsKey("actionId") && payloadJson.get("actionId").equals("checkout")){
    			responseObject = bomCheckOut(type, payloadJson);
    			
    			}
    			else if( payloadJson.containsKey("actionId") && payloadJson.get("actionId").equals("checkin")){
    			responseObject = bomCheckIn(type, payloadJson);
    			}
    			else if (oid == null) {
            	if((payloadJson.containsKey("skuId"))&&(payloadJson.containsKey("bomLinkId")))
                    responseObject = insertBomLinkVariants(type, payloadJson);
                   else
                    responseObject = insertBomLink(type, payloadJson);
                //responseObject = insertBomLink(type, payloadJson);
            } else {
                responseObject = updateBomLink(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used insert BOM link to the BOM of given BOM part,
     * 
     * @param type          is a string which contains flexType
     * @param bomLinkObject which contains created record attribute information
     * @exception Exception
     * @return JSONObject It returns BOMLinks JSONObject object
     */
    public JSONObject insertBomLinkmod(String type, JSONObject bomLinkObject) throws Exception {
        JSONObject responseObject = new JSONObject();
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "*****  save BomLink initialized with type*****" + type));
        try {
            String newPartOid = (String) bomLinkObject.get("BOMOid");
            FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
            LCSFlexBOMLogic bomPartLogic = new LCSFlexBOMLogic();
            String typeId = (String) bomLinkObject.get("typeId");
            String bomLinkMaterialOid = (String) bomLinkObject.get("materialOid");
            String bomLinkColorOid = (String) bomLinkObject.get("colorOid");
            String bomLinkSupplierOid = (String) bomLinkObject.get("supplierOid");
            FlexBOMLink bomLink = FlexBOMLink.newFlexBOMLink();
            bomLink.setFlexType(newPart.getFlexType());
            bomLink.setFlexType(FlexTypeCache.getFlexType(typeId));
            LCSMaterial material = (LCSMaterial) LCSQuery.findObjectById(bomLinkMaterialOid);
            LCSSupplier supplier = (LCSSupplier) LCSQuery.findObjectById(bomLinkSupplierOid);
            bomLink.setChild((LCSMaterialMaster) material.getMaster());
            bomLink.setSupplier((LCSSupplierMaster) supplier.getMaster());
            bomLink.setColor((LCSColor) LCSQuery.findObjectById(bomLinkColorOid));
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(bomLinkObject,type,(String)bomLinkObject.get("typeId"));
            Map convertedAttr=fillJson(bomLinkObject,type,(String)bomLinkObject.get("typeId"));
            for (Object str : convertedAttr.keySet()) {
                try {
                    bomLink.setValue(str.toString(), (String) convertedAttr.get(str.toString()));
                } catch (Exception e) {
                }
            }
            //AttributeValueSetter.setAllAttributes(FlexBOMLink,convertedAttrs);
            newPart = (FlexBOMPart) VersionHelper.checkout(newPart);
            bomPartLogic.addBranchToBOM(newPart, bomLink);
            bomPartLogic.checkInBOM(newPart);
            //LOGGER.debug((Object) (CLASSNAME + "*****  Adding BomLink to BOM/checkInBOM *****"));
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(bomLink), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
    
    public JSONObject insertBomLink(String type, JSONObject bomLinkObject) throws Exception {
        JSONObject responseObject = new JSONObject();
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "*****  save BomLink initialized with type*****" + type));
        try {
            String newPartOid = (String) bomLinkObject.get("BOMOid");
            FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
            LCSFlexBOMLogic bomPartLogic = new LCSFlexBOMLogic();
            String typeId = (String) bomLinkObject.get("typeId");
            String bomLinkMaterialOid = (String) bomLinkObject.get("materialOid");
            String bomLinkColorOid = (String) bomLinkObject.get("colorOid");
            String bomLinkSupplierOid = (String) bomLinkObject.get("supplierOid");
            FlexBOMLink bomLink = FlexBOMLink.newFlexBOMLink();
            bomLink.setFlexType(newPart.getFlexType());
            bomLink.setFlexType(FlexTypeCache.getFlexType(typeId));
            LCSMaterial material = (LCSMaterial) LCSQuery.findObjectById(bomLinkMaterialOid);
            LCSSupplier supplier = (LCSSupplier) LCSQuery.findObjectById(bomLinkSupplierOid);
            bomLink.setChild((LCSMaterialMaster) material.getMaster());
            bomLink.setSupplier((LCSSupplierMaster) supplier.getMaster());
            bomLink.setColor((LCSColor) LCSQuery.findObjectById(bomLinkColorOid));
            for (Object str : bomLinkObject.keySet()) {
                try {
                    bomLink.setValue(str.toString(), (String) bomLinkObject.get(str.toString()));
                } catch (Exception e) {
                }
            }
           // newPart = (FlexBOMPart) VersionHelper.checkout(newPart);
            bomPartLogic.addBranchToBOM(newPart, bomLink);
            //bomPartLogic.checkInBOM(newPart);
            //LOGGER.debug((Object) (CLASSNAME + "*****  Adding BomLink to BOM/checkInBOM *****"));
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(bomLink), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
    
    /**
     * This method is used insert BOM link Variants to the BOM of given BOM part,
     * @param bomLinkJsonObject JSONObject 
     * @param newPart FlexBOMPart
     * @exception Exception
     * @return JSONArray  It returns BOMLinks JSONArray object
     */
    public JSONObject insertBomLinkVariants(String type,JSONObject bomLinkObject)throws Exception{
      JSONObject responseObject=new JSONObject();
      try{
        String newPartOid=(String)bomLinkObject.get("BOMOid");
        FlexBOMPart bomPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
        LCSFlexBOMLogic bomPartLogic = new LCSFlexBOMLogic();
        LCSFlexBOMLogic bomlogic = new LCSFlexBOMLogic();
        String typeId=(String)bomLinkObject.get("typeId");

        
        FlexBOMLink bomLink = FlexBOMLink.newFlexBOMLink();
        FlexBOMLink topLink =FlexBOMLink.newFlexBOMLink();

        if(bomLinkObject.containsKey("bomLinkId"))
        {
          String bomLinkId=(String)bomLinkObject.get("bomLinkId");
          topLink = (FlexBOMLink)LCSQuery.findObjectById(bomLinkId);
        }
        BOMOwner owner = bomPart.getOwnerMaster();
        String colorDimName = "";
        String branchId = ""+topLink.getBranchId();
        String sortingNumber = ""+topLink.getSortingNumber();
   
        bomLink.setParent(bomPart.getMaster());
        bomLink.setParentRev(bomPart.getVersionIdentifier().getValue());
       // bomLink.setChild(LCSMaterialQuery.PLACEHOLDER);
       // bomLink.setSupplier(LCSSupplierQuery.PLACEHOLDER);
        bomLink.setBranchId(Integer.parseInt(branchId));
        bomLink.setFlexType(bomPart.getFlexType());
        bomLink.setWip(false);
        bomLink.setInDate(new java.sql.Timestamp(new java.util.Date().getTime()));
        bomLink.setOutDate(null);
        //bomLink.setSequence(0);
        bomLink.setSequence(1);

        if(FormatHelper.hasContent(sortingNumber)){
          bomLink.setSortingNumber(Integer.parseInt(sortingNumber));
        }
  	  
  	  if(bomLinkObject.containsKey("colorOid")){
            String bomLinkColorOid = (String) bomLinkObject.get("colorOid");
  		  bomLink.setColor((LCSColor) LCSQuery.findObjectById(bomLinkColorOid));
  		  }
  	  if(bomLinkObject.containsKey("materialOid")){
            String bomLinkMaterialOid = (String) bomLinkObject.get("materialOid");
  		  LCSMaterial material = (LCSMaterial) LCSQuery.findObjectById(bomLinkMaterialOid);
  		  bomLink.setChild((LCSMaterialMaster) material.getMaster());
  		  }
  	  if(bomLinkObject.containsKey("supplierOid")){
            String bomLinkSupplierOid = (String) bomLinkObject.get("supplierOid");
  		  LCSSupplier supplier = (LCSSupplier) LCSQuery.findObjectById(bomLinkSupplierOid);
  		  bomLink.setSupplier((LCSSupplierMaster) supplier.getMaster());
  		  }
  	  
        
        String skuId=(String)bomLinkObject.get("skuId");
        LCSSKU  sku = (LCSSKU)LCSQuery.findObjectById(skuId);
        WTPartMaster  skuMaster = (WTPartMaster)sku.getMaster();
        bomLink.setColorDimension(skuMaster);
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(bomLinkObject,type,(String)bomLinkObject.get("typeId"));
        AttributeValueSetter.setAllAttributes(bomLink,convertedAttrs);

        bomLink.calculateDimensionId();

        bomLink = (FlexBOMLink) LCSLogic.persist(bomLink);
        responseObject=util.getInsertResponse(FormatHelper.getObjectId(bomLink),type,responseObject);
      }catch(Exception e){
        e.printStackTrace();
        responseObject=util.getExceptionJson(e.getMessage());
      }
      return responseObject;
    }
    
    public JSONObject bomCheckOut(String type,JSONObject bomLinkObject)throws Exception{
        JSONObject responseObject=new JSONObject();
        try{
            String newPartOid=(String)bomLinkObject.get("BOMOid");
            String bomLinkId=(String)bomLinkObject.get("bomLinkId");
            FlexBOMLink topLink = (FlexBOMLink)LCSQuery.findObjectById(bomLinkId);
            FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
            newPart = (FlexBOMPart) VersionHelper.checkout(newPart);
            responseObject=util.getInsertResponse(FormatHelper.getObjectId(topLink),type,responseObject);
        }catch(Exception e){
          e.printStackTrace();
            responseObject=util.getExceptionJson(e.getMessage());
        }
        return responseObject;
       }
  	 
  	 public JSONObject bomCheckIn(String type,JSONObject bomLinkObject)throws Exception{
        JSONObject responseObject=new JSONObject();
        try{
            String newPartOid=(String)bomLinkObject.get("BOMOid");
            String bomLinkId=(String)bomLinkObject.get("bomLinkId");
            FlexBOMLink topLink = (FlexBOMLink)LCSQuery.findObjectById(bomLinkId);
            FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(newPartOid);
  		  	LCSFlexBOMLogic bomPartLogic = new LCSFlexBOMLogic();
  		  	bomPartLogic.checkInBOM(newPart);
            responseObject=util.getInsertResponse(FormatHelper.getObjectId(topLink),type,responseObject);
        }catch(Exception e){
          e.printStackTrace();
            responseObject=util.getExceptionJson(e.getMessage());
        }
        return responseObject;
       }

    /**
     * This method is used update BOM link to the BOM of given BOM part,
     * 
     * @param bomLinkOid
     * @param type          is a string which contains flexType
     * @param bomLinkObject which contains created record attribute information
     * @exception Exception
     * @return JSONObject It returns BOMLinks JSONArray object
     */
    public JSONObject updateBomLink(String bomLinkOid, String type, JSONObject bomLinkObject) throws Exception {
    	
    	JSONObject responseObject=new JSONObject();
        try{
      	FlexBOMLink bomLink = (FlexBOMLink)LCSQuery.findObjectById(bomLinkOid);
    	DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(bomLinkObject,type,(String)bomLinkObject.get("typeId"));
        AttributeValueSetter.setAllAttributes(bomLink,convertedAttrs);

        //bomLink.calculateDimensionId();

        bomLink = (FlexBOMLink) LCSLogic.persist(bomLink);
        responseObject=util.getUpdateResponse(FormatHelper.getObjectId(bomLink),type,responseObject);
      }catch(Exception e){
        e.printStackTrace();
        responseObject=util.getExceptionJson(e.getMessage());
      }
      return responseObject;
       
    }

    /**
     * This method is used delete BOM link of given BOM part,
     * 
     * @param bomlinkOid String which contains oid
     * @exception Exception
     * @return JSONObject It returns response JSONObject object
     */
    public JSONObject delete(String bomlinkOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized *****" + bomlinkOid));
        JSONObject responseObject = new JSONObject();
        FlexBOMLink flexBomlink = (FlexBOMLink) LCSQuery.findObjectById(bomlinkOid);
        LCSFlexBOMLogic lcsFlexBOMLogic = new LCSFlexBOMLogic();
        try {
            Collection bomLinkColl = new ArrayList();
            bomLinkColl.add(flexBomlink);
            lcsFlexBOMLogic.deleteLinks(bomLinkColl);
            responseObject = util.getDeleteResponseObject("BOM Link", bomlinkOid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get hierarchy of this flexObject
     * 
     * @Exception exception
     * @return return hierarychy of this flex object in the form of
     *         FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.flexbom.FlexBOMLink");
    }

    /**
     * This method is used to get the schema for the given typeId of this flex
     * object .
     * 
     * @param String type which contians flextype name
     * @param String typeId which conatins flexObject typeId
     * @Exception exception
     * @return JSONObject it returns the schema for the given typeId of this flex
     *         object .
     */
    public JSONObject getFlexSchema(String type, String typeId)
            throws NumberFormatException, TypeIdNotFoundException, Exception {
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
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** Get Schema with link scope *****"));
                    while (totalAttrsListItr.hasNext()) {
                        FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
                        if (attribute.getAttScope().equals("LINK_SCOPE")) {
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
     * This method is used to get the oid by taking name of the record.
     * 
     * @param Map      criteria
     * @param FlexType flexType
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
        return "OR:com.lcs.wc.flexbom.FlexBOMLink:" + (String) flexObject.getString("FLEXBOMLINK.IDA2A2");
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
            //LOGGER.debug((Object) (CLASSNAME + "***** Retrive records by Oid ***** " + oid));

        JSONObject jSONObject = new JSONObject();
        FlexBOMLink flexBOMLinkInput = (FlexBOMLink) LCSQuery.findObjectById(oid);
        FlexBOMLink flexBOMLink = flexBOMLinkInput;
        try {
            flexBOMLink = (FlexBOMLink) VersionHelper.latestIterationOf(flexBOMLinkInput);
        } catch (Exception e) {

        }
        jSONObject.put("createdOn",
                FormatHelper.applyFormat(flexBOMLink.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",
                FormatHelper.applyFormat(flexBOMLink.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("typeId", FormatHelper.getObjectId(flexBOMLink.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("oid", oid);
        jSONObject.put("image", null);
        jSONObject.put("ORid", FormatHelper.getObjectId(flexBOMLink).toString());
        jSONObject.put("typeHierarchyName", flexBOMLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(flexBOMLink));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = flexBOMLink.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (flexBOMLink.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, flexBOMLink.getValue(attKey).toString());
                }
            } catch (Exception e) {
            }
        }
        DataConversionUtil datConUtil = new DataConversionUtil();

        return datConUtil.convertFlexTypesToJSONFormat(jSONObject, objectType,
                FormatHelper.getObjectId(flexBOMLink.getFlexType()));
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
            //LOGGER.debug((Object) (CLASSNAME + "***** Retrive records by oid with associations ***** " + oid));
        JSONObject jSONObject = new JSONObject();
        FlexBOMLink flexBOMLink = (FlexBOMLink) LCSQuery.findObjectById(oid);
        if (association.equalsIgnoreCase("BOMLink Branch")) {
            jSONObject.put("BOMLink Branch", findAllLinksForBranch(oid));
        } else if (association.equalsIgnoreCase("Material")) {
            jSONObject.put("Material", findAssociation("Material", flexBOMLink));
        } else if (association.equalsIgnoreCase("Material Supplier")) {
            jSONObject.put("Material Supplier", findAssociation("Material Supplier", flexBOMLink));
        } else if (association.equalsIgnoreCase("Material Color")) {
            jSONObject.put("Material Color", findAssociation("Material Color", flexBOMLink));
        } else if (association.equalsIgnoreCase("Supplier")) {
            jSONObject.put("Supplier", findAssociation("Supplier", flexBOMLink));
        } else if (association.equalsIgnoreCase("Color")) {
            jSONObject.put("Color", findAssociation("Color", flexBOMLink));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the all flex BomLink branch records of given
     * BOMLink oid
     * 
     * @param String flexBOMLinkOid
     * @return JSONArray it returns all flex BomLink branch records of given BOMLink
     *         oid
     */

    public JSONArray findAllLinksForBranch(String flexBOMLinkOid) {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** Search all links for Branch  ***** " + flexBOMLinkOid));
        LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
        JSONArray bomLinkArray = new JSONArray();
        try {
            FlexBOMLink flexBOMLink = (FlexBOMLink) LCSQuery.findObjectById(flexBOMLinkOid);
            Collection response = lCSFlexBOMQuery.getAllLinksForBranch(flexBOMLink);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexBOMLink bomLink = (FlexBOMLink) itr.next();
                String flexBOMLinkId = FormatHelper.getObjectId(bomLink);
                JSONObject flexBOMLinkObject = getRecordByOid("BOMLink Branch", flexBOMLinkId);
                bomLinkArray.add(flexBOMLinkObject);
            }
        } catch (Exception e) {
            bomLinkArray.add(util.getExceptionJson(e.getMessage()));
        }
        return bomLinkArray;
    }

    public JSONArray findAssociation(String object, FlexBOMLink flexBOMLink) throws Exception {
        JSONArray returnArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        try {
            if (object.equals("Material")) {
                MaterialModel materialModel = new MaterialModel();
                LCSMaterialMaster materialMaster = (LCSMaterialMaster) flexBOMLink.getChild();
                if (materialMaster != null) {
                    LCSMaterial material = (LCSMaterial) VersionHelper.latestIterationOf(materialMaster);
                    jsonObject = (JSONObject) materialModel.getRecordByOid("Material",
                            FormatHelper.getVersionId(material));
                }
            } else if (object.equals("Color")) {
                ColorModel colorModel = new ColorModel();
                LCSColor color = flexBOMLink.getColor();
                if (color != null) {
                    jsonObject = (JSONObject) colorModel.getRecordByOid("Color", FormatHelper.getObjectId(color));
                }
            } else if (object.equals("Supplier")) {
                SupplierModel supplierModel = new SupplierModel();
                LCSSupplierMaster supplierMaster = (LCSSupplierMaster) flexBOMLink.getSupplier();
                
                if (supplierMaster != null && !supplierMaster.isPlaceholder()) {
                    LCSSupplier supplier = (LCSSupplier) VersionHelper.latestIterationOf(supplierMaster);
                 
                    jsonObject = (JSONObject) supplierModel.getRecordByOid("Supplier",
                            FormatHelper.getObjectId(supplier));
                }
            } else if (object.equals("Material Color")) {
                MaterialColorModel mcModel = new MaterialColorModel();
                LCSMaterialColor materialColor = flexBOMLink.getMaterialColor();
                if (materialColor != null)
                    jsonObject = (JSONObject) mcModel.getRecordByOid("Material Color",
                            FormatHelper.getObjectId(materialColor));
            }else if (object.equals("Material Supplier")) {
                LCSMaterialMaster materialMaster = (LCSMaterialMaster) flexBOMLink.getChild();
                LCSSupplierMaster supplierMaster = (LCSSupplierMaster) flexBOMLink.getSupplier();
                if (supplierMaster != null && !supplierMaster.isPlaceholder() && materialMaster != null ) {
                LCSMaterialSupplier lcsMaterialSupplier = LCSMaterialSupplierQuery.findMaterialSupplier(materialMaster, supplierMaster);
                MaterialSupplierModel materialSupplierModel = new MaterialSupplierModel();
                //LCSColor color = flexBOMLink.getColor();
                if (lcsMaterialSupplier != null) {
                    jsonObject = (JSONObject) materialSupplierModel.getRecordByOid("Material Supplier", FormatHelper.getObjectId(lcsMaterialSupplier));
                }
            }
            }
            returnArray.add(jsonObject);
        } catch (Exception e) {
            returnArray.add(util.getExceptionJson(e.getMessage()));
        }
        return returnArray;
    }

    public JSONObject checkInOut(String oid, String action) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** In BOM checkin *****" + oid));
        JSONObject responseObject = new JSONObject();
        FlexBOMPart newPart = (FlexBOMPart) LCSQuery.findObjectById(oid);
        newPart = (FlexBOMPart) VersionHelper.checkout(newPart);
        responseObject = getRecordByOid("BOM", oid);
        return responseObject;

    }
    
    

	public JSONObject fillJson(JSONObject inputJSON,String objectType, String typeId)throws Exception{
		//if (LOGGER.isDebugEnabled())
   	         //LOGGER.debug((Object) (CLASSNAME + "***** convertJSONToFlexTypeFormatUpdate objectType : " + objectType));
		JSONObject schema=GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeId);
		JSONObject propertiesObject=(JSONObject)schema.get("properties");
		AppUtil appUtil=new AppUtil();
		Map<String,String> typeMaps=appUtil.getFlexToJsonMap();
		String typeIdRequired = "false";
		if(inputJSON.containsKey("enableTypeId"))
		{
			typeIdRequired = (String)inputJSON.get("enableTypeId");
		}
		JSONObject convertedAttrs=new JSONObject();
		for(Object obj:propertiesObject.keySet()){
			String key=(String)obj;
			JSONObject singleProperty=(JSONObject)propertiesObject.get(key);
			/*if(singleProperty.containsKey("required") && (boolean)singleProperty.get("required") && (!inputJSON.containsKey(key))  && (!singleProperty.containsKey("readOnly"))){
				throw new Exception("The attribute "+key+" is Required!!!");
			}*/
			if(inputJSON.containsKey(key) && (!singleProperty.containsKey("readOnly"))){
				
			    
			}
			else
			{
				convertedAttrs.put(key,"");
			}
		}
		return convertedAttrs;
	}


}