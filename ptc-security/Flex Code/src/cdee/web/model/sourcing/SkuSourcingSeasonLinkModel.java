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
import java.util.Map;
import java.util.Collection;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
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
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSLogic;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;
import wt.util.WTPropertyVetoException;

import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.sourcing.LCSSKUSourcingLink;
import com.lcs.wc.product.LCSSKU;


public class SkuSourcingSeasonLinkModel extends GenericObjectService{

	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


	/**
      * This method is used either insert or update the SourcingConfiguration flex object that are  passed by using type as reference,
      * oid and array of different SourcingConfiguration data 
      * Using this method we can insert/update several records of a SourcingConfiguration flextype at a time.
      * @param type String 
      * @param oid String
      * @param SourcingConfigurationJSONArray  Contains array of SourcingConfiguration data
      * @exception Exception
      * @return JSONArray  It returns SourcingConfiguration JSONArray object
      */

  

    public JSONObject saveOrUpdate(String type, String oid, JSONObject sourceSKUJSONData,JSONObject payloadJson) throws Exception {
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                return util.getExceptionJson("SKU Sourcing creation is not supported.");
            } else {
            	String skuSourceLink = updateSourceSKULink(payloadJson, oid);
                responseObject = util.getUpdateResponse(skuSourceLink, type, responseObject);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
      * This method is used to insert the SourcingConfiguration flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SourcingConfiguration flextype at a time.
      * @param type is a string 
      * @param sourcingConfigurationDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SourcingConfiguration JSONArray object
      */  

	

    public String updateSourceSKULink(Map skuSourceAttrs, String skuSourceOid) throws WTException {
        LCSSKUSourcingLink skuSourcingLink = (LCSSKUSourcingLink) LCSQuery.findObjectById(skuSourceOid);
        skuSourceAttrs.forEach((key, value) -> {
        	if(key.toString().equalsIgnoreCase("active")) {
				try {
					skuSourcingLink.setActive(FormatHelper.parseBoolean((String)value));
				} catch (WTPropertyVetoException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
        	}
        	if(!(key.toString().equalsIgnoreCase("typeId") || key.toString().equalsIgnoreCase("active")))
        		skuSourcingLink.setValue((String)key, (String)value);
        });
        
        LCSLogic.persist(skuSourcingLink);
        return skuSourceOid;
    }	
    

  /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.LCSSourcingConfig"); 
  } 

   /**
    * This method is used to get the schema for the given typeId of this flex object .
    * @param String  type
    * @param String typeId
    * @param JSONObject jsonAsscos
    * @Exception exception
    * @return JSONObject  it returns the schema for the given typeId of this flex object .
    */

   public JSONObject getFlexSchema(String type, String typeId) throws NumberFormatException,TypeIdNotFoundException,Exception {
        JSONObject responseObject = new JSONObject();
        try{
            JSONObject jsonAsscos = util.getConfigureJSON();
            JSONObject scopedObjSchemaObject = new JSONObject();
            JSONObject configObject = (JSONObject) jsonAsscos.get(type);
            if(configObject!=null){
                JSONObject attributesObj = (JSONObject) configObject.get("properties");
                Collection attrsList = new ArrayList();
                Collection totalAttrs = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                    totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
                    Iterator totalAttrsListItr = totalAttrs.iterator();
                    while (totalAttrsListItr.hasNext()) {
                        FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
						   try {
                            if (attribute.getQueryColumn().getTableName().equals("LCSSKUSourcingLink")) {
                                attrsList.add(attribute);
                            }
                        } catch (Exception e) {}
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
                }else{
                    throw new TypeIdNotFoundException(type +" have TypeId Manadatory because this attributes are available in another flexObject");
                }
            }else{
                throw new FlexObjectNotFoundException(type +" does not Exist in ConfigurationRelations.json file");
            }
        }catch(NumberFormatException ne){
            throw ne;
        }catch(TypeIdNotFoundException te){
            throw te;
        }catch(FlexObjectNotFoundException foe){
            responseObject = util.getExceptionJson(foe.getMessage());
        }catch(FileNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(WTException we){
            responseObject = util.getExceptionJson(we.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

  /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
  	public JSONObject getRecords(String typeId,String objectType, Map criteriaMap) throws Exception{
        SearchResults results = new SearchResults();
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        FlexType flexType = null;
        //Map criteria = util.convertJsonToMap(jsonObject,criteriaMap); 
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot("Sourcing Configuration");
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        results = flexSpecQuery.findSpecsByCriteria(criteriaMap,flexType,null,null);
        return util.getResponseFromResults(results,objectType);
    }

    /**
    * This method is used to get the oid by taking name of the record.
    * @param FlexType  flexType
    * @param Map criteria
    * @param String name
    * @Exception exception
    * @return return oid by taking name of the record of the flex object
    */ 
  public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
            return "no record";
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "OR:com.lcs.wc.sourcing.LCSSKUSourcingLink:"+(String)flexObject.getString("LCSSKUSOURCINGLINK.IDA2A2");
	  }

    /**
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return String  it returns the records that matched the given oid of this flex object
    */ 
	  public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
      	JSONObject jSONObject = new JSONObject();
        LCSSKUSourcingLink lcsSKUSourceToSeasonLinkInput = (LCSSKUSourcingLink) LCSQuery.findObjectById(oid);
        LCSSKUSourcingLink lcsSkuSourceToSeasonLink = lcsSKUSourceToSeasonLinkInput;
         try{
            lcsSkuSourceToSeasonLink = (LCSSKUSourcingLink) VersionHelper.latestIterationOf(lcsSKUSourceToSeasonLinkInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsSkuSourceToSeasonLink.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsSkuSourceToSeasonLink.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid", oid);
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsSkuSourceToSeasonLink.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSkuSourceToSeasonLink).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsSkuSourceToSeasonLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsSkuSourceToSeasonLink));
        //jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsSkuSourceToSeasonLink));
        LCSSeason season = (LCSSeason) VersionHelper.latestIterationOf(lcsSkuSourceToSeasonLink.getSeasonMaster());
        String seasonOid = FormatHelper.getVersionId(season);
        jSONObject.put("seasonOid", seasonOid);
        LCSSourcingConfig lcssourcingconfig = (LCSSourcingConfig) VersionHelper.latestIterationOf(lcsSkuSourceToSeasonLink.getConfigMaster());
        jSONObject.put("sourceOid", FormatHelper.getVersionId(lcssourcingconfig));
        jSONObject.put("primarySource", lcssourcingconfig.isPrimarySource());
        jSONObject.put("active", lcsSkuSourceToSeasonLink.isActive());
		    LCSPartMaster skuMaster = (LCSPartMaster) lcsSkuSourceToSeasonLink.getSkuMaster();
        LCSSKU sku = (LCSSKU) VersionHelper.latestIterationOf(skuMaster);
		    jSONObject.put("skuOid", FormatHelper.getVersionId(sku));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsSkuSourceToSeasonLink.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsSkuSourceToSeasonLink.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	  while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(lcsSkuSourceToSeasonLink.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,lcsSkuSourceToSeasonLink.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSkuSourceToSeasonLink.getFlexType()));	
      }

   /**
    * This method is used to get the ProductSeasonLink Info by passing productOid,seasonOid.
    * @param String  objectType
    * @param String productOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the ProductSeasonLink flex object
    */ 

   public JSONObject getFlexLinkInfo(String objectType,JSONObject rootObject,JSONObject propertiesObject) throws Exception {
        JSONObject responseObject = new JSONObject();
        try{
		if(propertiesObject.containsKey("sourceOid") && propertiesObject.containsKey("seasonOid") && propertiesObject.containsKey("skuOid"))
		{
		String sourceOid = (String)rootObject.get("sourceOid");
        String seasonOid = (String)rootObject.get("seasonOid");
        String skuOid = (String)rootObject.get("skuOid");
		responseObject.put(objectType, findSKUSourceSeasonLink(objectType,skuOid,sourceOid,seasonOid));
		 }
		 else
		{
		throw new Exception("Required attributes not filled");
		}		 
    }catch(Exception e){
        responseObject = util.getExceptionJson(e.getMessage());
    }

        return responseObject;
    }

    /**
    * This method is used to find the  ProductSeasonLink records by passing productOid,seasonOid.
    * @param String  objectType
    * @param String productOid
    * @param String seasonOid
    * @Exception exception
    * @return return  record of the ProductSeasonLink flex object
    */ 
    public JSONObject findSKUSourceSeasonLink(String objectType,String skuSOid, String sourceOid,String seasonOid) {
        LCSSourcingConfigQuery lcsSourcingConfigQuery = new LCSSourcingConfigQuery();
        JSONObject responseObject = new JSONObject();
        try {
             LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig) LCSQuery.findObjectById(sourceOid);
             LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(seasonOid);
			 LCSSKU sku = (LCSSKU) LCSQuery.findObjectById(skuSOid);
			 LCSSKUSourcingLink lcsSkuSourceToSeasonLink = lcsSourcingConfigQuery.getSKUSourcingLink( lcsSourcingConfig, sku,  lcsSeason);
            // LCSSKUSourcingLink lcsSkuSourceToSeasonLink = lcsSourcingConfigQuery.getSourceToSeasonLink(lcsSourcingConfig,lcsSeason);
             String skuSourceSeasonOid = FormatHelper.getNumericObjectIdFromObject(lcsSkuSourceToSeasonLink);
             skuSourceSeasonOid = "OR:com.lcs.wc.sourcing.LCSSKUSourcingLink:"+skuSourceSeasonOid;
             responseObject =  getRecordByOid(objectType,skuSourceSeasonOid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
}