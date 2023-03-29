/*
 * Created on 06/10/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.product;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
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
import com.lcs.wc.season.SeasonGroupQuery;
import com.lcs.wc.sizing.ProductSizeCategory;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.season.LCSSKUSeasonLink;
import java.util.Collection;
import com.lcs.wc.skusize.SKUSize;
import com.lcs.wc.skusize.SKUSizeMaster;
import com.lcs.wc.skusize.SKUSizeQuery;

import cdee.web.util.DataConversionUtil;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SkuSizeModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SkuSizeModel.class.getName());
//private static final String CLASSNAME = SkuSizeModel.class.getName();
	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


	/**
      * This method is used either insert or update the SeasonGroup flex object that are  passed by using type as reference,
      * oid and array of different SeasonGroup data 
      * Using this method we can insert/update several records of a SeasonGroup flextype at a time.
      * @param type String 
      * @param oid String
      * @param SeasonGroupJSONArray  Contains array of SeasonGroup data
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */
    public JSONArray saveOrUpdate(String type,String oid, JSONArray jsonArray) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"-----oid-----"+ oid)); 
        JSONArray responseArray = new JSONArray();
        return responseArray;
    }

    /**
      * This method is used to insert the SeasonGroup flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SeasonGroup flextype at a time.
      * @param type is a string 
      * @param seasonGroupDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SeasonGroup JSONArray object
      */  

    public JSONObject createSeasonGroup(String type, ArrayList seasonGroupDataList){

        return null;
    }

    /**
      * This method is used to update the SeasonGroup flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a SeasonGroup flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param seasonGroupJsonObject  Contains SeasonGroup data
      * @exception Exception
      * @return String  It returns OID of SeasonGroup object
      */

    public JSONObject updateSeasonGroup(String oid,String type, JSONObject seasonGroupJsonObject) throws Exception{
    
        return null;
    }

    /**
      * This method is used to call Associations objects of the Flex type SeasonGroup.
      * @param  
      * @param 
      * @param 
      * @exception Exception
      * @return 
      */
    private void seasonGroupAssociations( ) throws Exception{
    }

       /**
    * This method is used to get the schema for the given typeId of this flex object .
    * @param String  type
    * @param String typeId
    * @param JSONObject jsonAsscos
    * @Exception exception
    * @return JSONObject  it returns the schema for the given typeId of this flex object .
    */

    public JSONObject getFlexSchema(String type,String typeId) throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema ***** "));
       JSONObject jsonAsscos = util.getConfigureJSON();
        JSONObject responseObject=new JSONObject();
        JSONObject scopedObjSchemaObject=new JSONObject();
        JSONObject configObject =(JSONObject)jsonAsscos.get(type);
        JSONObject attributesObj=(JSONObject) configObject.get("properties");
        Collection attrsList = new ArrayList() ;
        Collection totalAttrs = null;
        if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
          totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
        }else{
          totalAttrs=FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
        }
        //Collection totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
          Iterator totalAttrsListItr = totalAttrs.iterator();
          while(totalAttrsListItr.hasNext()){
            FlexTypeAttribute attribute=(FlexTypeAttribute)totalAttrsListItr.next();
            if(attribute.getAttScope().equals("SKU_SIZE_SCOPE"))
            {
              attrsList.add(attribute);
            }
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
        //FlexType treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
        String typeName = treeNodeFlexType.getFullNameDisplay(true);
        JSONObject basicDetails = new JSONObject();
        basicDetails.put("typeId",typeId);
        basicDetails.put("rootObjectName",type);
        basicDetails.put("typeName",typeName);
        responseObject.put("basicDetails",basicDetails);
        responseObject.put("transformation_kind",(JSONObject)configObject.get("transformation_kind"));
        responseObject.put("associations",(JSONObject)configObject.get("associations"));
        return responseObject;
    }


    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
	public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.skusize.SKUSize"); 
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
		return null;
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "";
	}

	/**
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return String  it returns the records that matched the given oid of this flex object
    */ 
	public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid));
      JSONObject jSONObject = new JSONObject();
      SKUSize skuSizeInput = (SKUSize) LCSQuery.findObjectById(oid);
      SKUSize skuSize = skuSizeInput;
      try{
            skuSize = (SKUSize) VersionHelper.latestIterationOf(skuSizeInput);
      }catch(Exception e){

      }
      jSONObject.put("createdOn",FormatHelper.applyFormat(skuSize.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
      jSONObject.put("modifiedOn",FormatHelper.applyFormat(skuSize.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
      jSONObject.put("image",null);
      jSONObject.put("typeId",FormatHelper.getObjectId(skuSize.getFlexType()));
      jSONObject.put("oid",FormatHelper.getVersionId(skuSize).toString());
      jSONObject.put("ORid",FormatHelper.getObjectId(skuSize).toString());
      jSONObject.put("flexName",objectType);
      jSONObject.put("typeHierarchyName",skuSize.getFlexType().getFullNameDisplay(true));
      jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(skuSize));
      jSONObject.put("skuSizeactive", skuSize.isActive());
      SKUSizeMaster SKUSizeMaster = (SKUSizeMaster)skuSize.getMaster();

      LCSSKU sku = (LCSSKU)VersionHelper.latestIterationOf(SKUSizeMaster.getSkuMaster());
      jSONObject.put("skuOid", FormatHelper.getVersionId(sku));
      jSONObject.put("skuSize1 ",SKUSizeMaster.getSizeValue());
      jSONObject.put("skuSize2",SKUSizeMaster.getSize2Value());

      String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
      jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
      Collection attributes = skuSize.getFlexType().getAllAttributes();
      Iterator it = attributes.iterator();
      while(it.hasNext()){
        FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        String attKey = att.getAttKey();
        try{
            if(skuSize.getValue(attKey) == null){
              jSONObject.put(attKey,"");
            }
            else{
              jSONObject.put(attKey,skuSize.getValue(attKey).toString());
          }
        }catch(Exception e){
          }
          }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(skuSize.getFlexType()));	}

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
	
	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject) throws Exception {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object)(CLASSNAME + "***** Get Flex Link Info  ***** "));

		JSONObject responseObject = new JSONObject();
		try {
			String skuOid = (String) rootObject.get("skuOid");
			String psdOid = (String) rootObject.get("pscOid");
			JSONObject pslResponse = (JSONObject)findSKUSize(objectType, skuOid,psdOid);
			//responseObject.put(objectType, findSKUSize(objectType, skuOid,psdOid));
			responseObject.put("objectType", pslResponse.get(objectType));
		} catch(Exception e) {
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
	public JSONObject findSKUSize(String objectType, String skusOid,String pscOid) {
		//if (LOGGER.isDebugEnabled()) //LOGGER.debug((Object)(CLASSNAME + "***** Find SKU Size Season Link with skuSOid  ***** " + skusOid));
		JSONObject responseObject = new JSONObject();
		JSONArray sizeCategoryArray = new JSONArray();
		LCSSKU sku = null;
		ProductSizeCategory psc = null;
		LCSPartMaster skuMaster = null;
		try {
			if(skusOid != null) {
				sku = (LCSSKU) LCSQuery.findObjectById(skusOid);
				if(sku != null)
					skuMaster = (LCSPartMaster) sku.getMaster();
			}
			if(psc != null)
				psc = (ProductSizeCategory) LCSQuery.findObjectById(pscOid);
			
			Collection skuSizeCol = SKUSizeQuery.findSKUSizesForPSC(psc, skuMaster, null, null).getResults();
			Collection < SKUSize > skuSizeCollection = LCSQuery.getObjectsFromResults(skuSizeCol, "VR:com.lcs.wc.skusize.SKUSize:", "SKUSIZE.BRANCHIDITERATIONINFO");
			if ((skuSizeCollection != null) && (skuSizeCollection.size() > 0)) {
				for (SKUSize skuSize: skuSizeCollection) {
					String skuSizeId = FormatHelper.getObjectId(skuSize);
					JSONObject sizeSeasonObject = getRecordByOid("Colorway Size", skuSizeId);
					sizeCategoryArray.add(sizeSeasonObject);
				}
			}
			responseObject.put("Colorway Size", sizeCategoryArray);

		} catch(Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return responseObject;
	}
}