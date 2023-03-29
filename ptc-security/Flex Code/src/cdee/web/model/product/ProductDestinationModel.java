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
import com.lcs.wc.last.LCSLastClientModel;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.ProductDestination;
import com.lcs.wc.product.ProductDestinationClientModel;
import com.lcs.wc.product.LCSProductClientModel;
import cdee.web.model.placeholder.PlaceholderModel;
import cdee.web.model.season.ProductSeasonLinkModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.season.SeasonModel;
import com.lcs.wc.season.LCSSeasonQuery;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.specification.FlexSpecQuery;
import cdee.web.model.bom.BOMModel;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.construction.LCSConstructionQuery;
import cdee.web.model.construction.ConstructionInfoModel;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import cdee.web.model.measurements.MeasurementsModel;
import cdee.web.model.document.DocumentModel;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.part.LCSPartMaster;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class ProductDestinationModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(ProductDestinationModel.class.getName());
//private static final String CLASSNAME = ProductDestinationModel.class.getName();

  String productOid = "";
  AppUtil util = new AppUtil();
  SeasonModel seasonModel = new SeasonModel();

	/**
      * This method is used either insert or update the Product flex object that are  passed by using type as reference,
      * oid and array of different Product data 
      * Using this method we can insert/update several records of a Product flextype at a time.
      * @param type String 
      * @param oid String
      * @param ProductJSONArray  Contains array of Product data
      * @exception Exception
      * @return JSONArray  It returns Product JSONArray object
      */
      public JSONObject saveOrUpdate(String type,String oid, JSONObject prodDestObj) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
          JSONObject responseObject = new JSONObject();
          try{
              if(oid == null){
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createProductDestination ***** "));
                responseObject = createProductDestination(type, prodDestObj);
              }else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateProductDestination with oid ***** "));
                responseObject = updateProductDestination(oid,type,prodDestObj);
              }
          }catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
          }
          
      return responseObject;
    }
/**
      * This method is used to Create the Product destination flex object
      * @param oid   oid of an item(type) to Create
      * @param type  Contains type
      * @param destinationJson  Contains Product detination data
      * @exception Exception
      * @return JSONObject  It returns JSONObject of Product destination JSONObject
      */


   public JSONObject createProductDestination(String type,JSONObject destinationJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Product Destination  initialized ***** "+ type));
      JSONObject responseObject = new JSONObject();
      try{
          AppUtil util = new AppUtil();
          ProductDestinationClientModel productDestinationModel=new ProductDestinationClientModel();
          String typeId=(String)destinationJson.get("typeId");
          String productOid=(String)destinationJson.get("productOid");
          DataConversionUtil datConUtil=new DataConversionUtil();
          Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(destinationJson,type,(String)destinationJson.get("typeId"));
          AttributeValueSetter.setAllAttributes(productDestinationModel,convertedAttrs);
          LCSProduct product = (LCSProduct) LCSQuery.findObjectById(productOid);
          LCSPartMaster prodMaster = (LCSPartMaster) product.getMaster();
          productDestinationModel.setProductMaster(prodMaster);
          productDestinationModel.save();
          responseObject = util.getInsertResponse(FormatHelper.getObjectId(productDestinationModel.getBusinessObject()).toString(),type,responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
          responseObject = util.getExceptionJson(e.getMessage());
        }
    return responseObject;
    }

  /**
      * This method is used to update the Product destination flex object that are  passed by using OID as reference.
      * @param oid   oid of an item(type) to update
      * @param type  Contains type
      * @param destinationJson  Contains Product detination data
      * @exception Exception
      * @return JSONObject  It returns JSONObject of Product destination JSONObject
      */

    public JSONObject updateProductDestination(String oid,String type,JSONObject destinationJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Product Destination initialized ***** "+ oid));
      JSONObject responseObject = new JSONObject();
      try{
          AppUtil util = new AppUtil();
          ProductDestinationClientModel productDestinationModel=new ProductDestinationClientModel();
          productDestinationModel.load(oid);
          DataConversionUtil datConUtil=new DataConversionUtil();
          Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(destinationJson,type,FormatHelper.getObjectId(productDestinationModel.getFlexType()));
          AttributeValueSetter.setAllAttributes(productDestinationModel,convertedAttrs);
          productDestinationModel.save();
          responseObject = util.getUpdateResponse(FormatHelper.getObjectId(productDestinationModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
          responseObject = util.getExceptionJson(e.getMessage());
        }
    return responseObject;
    }

    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.product.ProductDestination"); 
  } 

  /**
    * This method is used to get the oid by taking name of the record.
    * @param FlexType  flexType
    * @param Map criteria
    * @param String name
    * @Exception exception
    * @return return oid by taking name of the record of the flex object
    */ 
  public String searchByName(Map crit,FlexType flexType,String name) throws Exception{
    return null;
  }


    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "OR:com.lcs.wc.product.ProductDestination:"+(String)flexObject.getString("PRODUCTDESTINATION.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
      	JSONObject jsonObj = new JSONObject();
        ProductDestination productDestinationInput = (ProductDestination) LCSQuery.findObjectById(oid);
        ProductDestination productDestination = productDestinationInput;
        try{
            productDestination = (ProductDestination) VersionHelper.latestIterationOf(productDestinationInput);
        }catch(Exception e){

        }
        jsonObj.put("createdOn",FormatHelper.applyFormat(productDestination.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jsonObj.put("modifiedOn",FormatHelper.applyFormat(productDestination.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jsonObj.put("image",null);
        jsonObj.put("typeId",FormatHelper.getObjectId(productDestination.getFlexType()));
        jsonObj.put("ORid",FormatHelper.getObjectId(productDestination).toString());
        jsonObj.put("flexName",objectType);
        jsonObj.put("typeHierarchyName",productDestination.getFlexType().getFullNameDisplay(true));
        jsonObj.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(productDestination));
        String typeHierarchyName=(String)jsonObj.get("typeHierarchyName");
        jsonObj.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = productDestination.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(productDestination.getValue(attKey) == null){
           		 	jsonObj.put(attKey,"");
          		}
          		else{
           			jsonObj.put(attKey,productDestination.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jsonObj,objectType,FormatHelper.getObjectId(productDestination.getFlexType()));
	}

 /**
    * This method is used to fetch the record that matched with the given oid of this flex object with association flexObject records.
    * @param String  objectType which contains flexObject name
    * @param String oid 
    * @param String association which contains association(includes) flexObject name
    * @Exception exception
    * @return JSONObject  it returns the record that matched the given oid of this flex object with association flexObject records
    */ 
 public JSONObject getRecordByOid(String objectType,String oid,String association) throws Exception {
        JSONObject jsonObj = new JSONObject();
        return jsonObj;
    }
  
}