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
package cdee.web.services;

import java.io.FileNotFoundException;
import java.util.ArrayList;
//import cdee.web.model.moa.MOAModel;
import java.util.Collection;
import java.util.Map;

import org.json.simple.JSONObject;

import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;

import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.model.bom.BOMLinkModel;
import cdee.web.model.bom.BOMModel;
import cdee.web.model.businessObject.BusinessObjectModel;
import cdee.web.model.color.ColorModel;
import cdee.web.model.color.PaletteMaterialColorLinkModel;
import cdee.web.model.color.PaletteMaterialLinkModel;
import cdee.web.model.color.PaletteModel;
import cdee.web.model.color.PaletteToColorLinkModel;
import cdee.web.model.construction.ConstructionDetailModel;
import cdee.web.model.construction.ConstructionInfoModel;
import cdee.web.model.country.CountryModel;
import cdee.web.model.document.DocumentModel;
import cdee.web.model.document.DocumentObjectLinkModel;
import cdee.web.model.effectivityContext.EffectivityContextModel;
import cdee.web.model.image.ImageModel;
import cdee.web.model.last.LastModel;
import cdee.web.model.logEntry.LogEntryModel;
import cdee.web.model.material.MaterialColorModel;
import cdee.web.model.material.MaterialModel;
import cdee.web.model.material.MaterialPricingModel;
import cdee.web.model.material.MaterialSupplierModel;
import cdee.web.model.measurements.MeasurementsModel;
import cdee.web.model.measurements.PomModel;
import cdee.web.model.media.MediaModel;
import cdee.web.model.placeholder.PlaceholderModel;
import cdee.web.model.plan.PlanLineItemModel;
import cdee.web.model.plan.PlanModel;
import cdee.web.model.product.ColorwayModel;
import cdee.web.model.product.ProductDestinationModel;
import cdee.web.model.product.ProductModel;
import cdee.web.model.product.SkuSizeModel;
import cdee.web.model.retailComponent.RetailComponentModel;
import cdee.web.model.revisableEntity.RevisableEntityModel;
import cdee.web.model.sample.SampleModel;
import cdee.web.model.sample.SampleRequestModel;
import cdee.web.model.season.ProductSeasonLinkModel;
import cdee.web.model.season.SeasonGroupModel;
import cdee.web.model.season.SeasonModel;
import cdee.web.model.season.SkuSeasonLinkModel;
import cdee.web.model.sizing.FullSizeRangeModel;
import cdee.web.model.sizing.SKUSizeSourceModel;
import cdee.web.model.sizing.SizeCategoryModel;
import cdee.web.model.sizing.SizingModel;
import cdee.web.model.sizing.SkuSizeSeasonLinkModel;
import cdee.web.model.sourcing.CostSheetModel;
import cdee.web.model.sourcing.CostSheetSKUModel;
import cdee.web.model.sourcing.OrderConfirmationLineItemModel;
import cdee.web.model.sourcing.OrderConfirmationModel;
import cdee.web.model.sourcing.RFQModel;
import cdee.web.model.sourcing.RFQResponseModel;
import cdee.web.model.sourcing.RFQToQuotableLinkModel;
import cdee.web.model.sourcing.SkuSourcingSeasonLinkModel;
import cdee.web.model.sourcing.SourceToSeasonLinkModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import cdee.web.model.specification.SpecificationModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.model.testSpecification.TestConditionModel;
import cdee.web.model.testSpecification.TestDetailsModel;
import cdee.web.model.testSpecification.TestMethodModel;
import cdee.web.model.testSpecification.TestPropertyModel;
import cdee.web.model.testSpecification.TestSpecificationModel;
import cdee.web.model.testSpecification.TestStandardModel;
import cdee.web.util.AppUtil;
import wt.util.WTException;
//import org.apache.log4j.Logger;

public abstract class GenericObjectService{
  
//private static final Logger LOGGER = LogR.getLogger(GenericObjectService.class.getName());
//private static final String CLASSNAME = GenericObjectService.class.getName();

    AppUtil util=new AppUtil();


    /**
     * @description This Method is used to return model instance of given type 
     * @Param objectType contains the name of the flex object
     * @return GenericObjectService {It returns the instance of the given type which is extending the GenericObjectService}
     */
	public static GenericObjectService getModelInstance(String objectType) throws FlexObjectNotFoundException {
		GenericObjectService inst = null;
		if(objectType.equalsIgnoreCase("Color")) {
	    	inst =new ColorModel();
        }else if(objectType.equalsIgnoreCase("BOM")) {
            inst =new BOMModel();
        }else if(objectType.equalsIgnoreCase("BOM Link")) {
            inst =new BOMLinkModel();
        }else if(objectType.equalsIgnoreCase("Business Object")) {
    	      inst =new BusinessObjectModel();
        }else if(objectType.equalsIgnoreCase("Country")) {
    	      inst =new CountryModel();
        }else if(objectType.equalsIgnoreCase("Colorway")) {
    	      inst =new ColorwayModel();
        }else if(objectType.equalsIgnoreCase("Colorway Size")) {
            inst =new SkuSizeModel();
    	}else if(objectType.equalsIgnoreCase("Colorway Size to Source")) {
              inst =new SKUSizeSourceModel();            
      	}else if(objectType.equalsIgnoreCase("Cost Sheet Product")) {
            inst =new CostSheetModel();
        }else if(objectType.equalsIgnoreCase("Document")) {
       	    inst =new DocumentModel();
        }else if(objectType.equalsIgnoreCase("Effectivity Context")) {
            inst =new EffectivityContextModel();
    	  }else if(objectType.equalsIgnoreCase("Last")) {
            inst =new LastModel(); 
        }else if(objectType.equalsIgnoreCase("Material")) {
    		    inst =new MaterialModel(); 
        }else if(objectType.equalsIgnoreCase("Material Color")) {
            inst =new MaterialColorModel(); 
        }else if(objectType.equalsIgnoreCase("Material Pricing")) {
            inst =new MaterialPricingModel();
        }else if(objectType.equalsIgnoreCase("Media")) {
            inst =new MediaModel(); 
        }else if(objectType.equalsIgnoreCase("Palette")) {
    		    inst =new PaletteModel(); 
        }else if(objectType.equalsIgnoreCase("Palette to Color")) {
            inst =new PaletteToColorLinkModel();
        }else if(objectType.equalsIgnoreCase("Palette to Material")) {
            inst =new PaletteMaterialLinkModel();
        }else if(objectType.equalsIgnoreCase("Palette to Material Color Link")) {
            inst =new PaletteMaterialColorLinkModel();
        }else if(objectType.equalsIgnoreCase("Placeholder")) {
            inst =new PlaceholderModel(); 
    	  }else if(objectType.equalsIgnoreCase("Product")) {
            inst =new ProductModel(); 
        }else if(objectType.equalsIgnoreCase("Product Destination")) {
            inst =new ProductDestinationModel(); 
        }else if(objectType.equalsIgnoreCase("RFQ")) {
    		    inst =new RFQModel(); 
        }else if(objectType.equalsIgnoreCase("Season")) {
        	  inst =new SeasonModel(); 
        }else if(objectType.equalsIgnoreCase("Sample")) {
        	  inst =new SampleModel(); 
        }else if(objectType.equalsIgnoreCase("Sample Request")) {
            inst =new SampleRequestModel(); 
        }else if(objectType.equalsIgnoreCase("Supplier")) {
        	  inst =new SupplierModel(); 
        }else if(objectType.equalsIgnoreCase("Plan")) {
        	  inst =new PlanModel(); 
        }else if(objectType.equalsIgnoreCase("Test Specification")) {
        	  inst =new TestSpecificationModel(); 
        }else if(objectType.equalsIgnoreCase("Size Definition")) {
        	  inst =new SizingModel(); 
        }else if(objectType.equalsIgnoreCase("Test Condition")) {
        	  inst =new TestConditionModel(); 
        }else if(objectType.equalsIgnoreCase("Test Method")) {
        	  inst =new TestMethodModel(); 
        }else if(objectType.equalsIgnoreCase("Test Property")) {
        	  inst =new TestPropertyModel(); 
        }else if(objectType.equalsIgnoreCase("Test Details")) {
            inst =new TestDetailsModel(); 
        }else if(objectType.equalsIgnoreCase("Test Standard")) {
            inst =new TestStandardModel(); 
        }else if(objectType.equalsIgnoreCase("Construction")) {
            inst =new ConstructionInfoModel(); 
        }else if(objectType.equalsIgnoreCase("Construction Info")) {
            inst =new ConstructionInfoModel(); 
        }else if(objectType.equalsIgnoreCase("Construction Detail")) {
            inst =new ConstructionDetailModel(); 
        }else if(objectType.equalsIgnoreCase("Measurements")) {
            inst =new MeasurementsModel(); 
        }else if(objectType.equalsIgnoreCase("POM")) {
            inst =new PomModel(); 
        }else if(objectType.equalsIgnoreCase("Specification")) {
            inst =new SpecificationModel(); 
        }else if(objectType.equalsIgnoreCase("Season Group")) {
            inst =new SeasonGroupModel(); 
        }else if(objectType.equalsIgnoreCase("Material Supplier")) {
            inst =new MaterialSupplierModel(); 
        }else if(objectType.equalsIgnoreCase("Image")) {
            inst =new ImageModel(); 
        }else if(objectType.equalsIgnoreCase("Sample Request")) {
            inst =new SampleRequestModel(); 
        }else if(objectType.equalsIgnoreCase("Sourcing Configuration")) {
            inst =new SourcingConfigurationModel(); 
        }else if(objectType.equalsIgnoreCase("Colorway Season Link")) {
            inst =new SkuSeasonLinkModel(); 
        }else if(objectType.equalsIgnoreCase("Plan Line Item")) {
            inst =new PlanLineItemModel(); 
        }else if(objectType.equalsIgnoreCase("Palette To Color Link")) {
            inst =new PaletteToColorLinkModel(); 
        }else if(objectType.equalsIgnoreCase("Palette Material Link")) {
            inst =new PaletteMaterialLinkModel();
        }else if(objectType.equalsIgnoreCase("Sourcing Configuration to Season")) {
            //Source To Season Link
            inst =new SourceToSeasonLinkModel();
        }
        else if(objectType.equalsIgnoreCase("Sourcing Configuration to Colorway")) {
            //Source To Season Link
            inst =new SkuSourcingSeasonLinkModel();
        }else if(objectType.equalsIgnoreCase("Product Season Link")) {
            inst =new ProductSeasonLinkModel();
        }else if(objectType.equalsIgnoreCase("RFQ To Quotable Link")) {
            inst =new RFQToQuotableLinkModel();
        }else if(objectType.equalsIgnoreCase("RFQ Response")) {
            inst =new RFQResponseModel();
        }else if(objectType.equalsIgnoreCase("Size Category")) {
            inst =new SizeCategoryModel();
        }else if(objectType.equalsIgnoreCase("Full Size Range")) {
            inst =new FullSizeRangeModel();
        }else if(objectType.equalsIgnoreCase("MOA")) {
           // inst =new MOAModel();
        }else if(objectType.equalsIgnoreCase("Document to Object Link")) {
            inst =new DocumentObjectLinkModel();
        }else if(objectType.equalsIgnoreCase("Colorway Size to Season")) {
            inst =new SkuSizeSeasonLinkModel();
        }else if(objectType.equalsIgnoreCase("Log Entry")) {
            inst =new LogEntryModel();		
        }else if(objectType.equalsIgnoreCase("Revisable Entity")) {
            inst =new RevisableEntityModel();                	
        }else if(objectType.equalsIgnoreCase("Cost Sheet Colorway")) {
            inst =new CostSheetSKUModel();
        }else if(objectType.equalsIgnoreCase("Order Confirmation")) {
		    inst =new OrderConfirmationModel(); 
        }else if(objectType.equalsIgnoreCase("Order Confirmation Detail")) {
		    inst =new OrderConfirmationLineItemModel(); 
        }else if(objectType.equalsIgnoreCase("Retail Component")) {
		    inst =new RetailComponentModel(); 
        }else{
          throw new FlexObjectNotFoundException(objectType +" is not a valid flexObject");
        }
        return inst; 
    }

     /**
     * @description This Method is used to search records for the given criteria
     * @Param objectType contains the name of the flex object
     * @Param flexType contains the flextype of the flex object
     * @Param criteriaMap contains the criteria to search
     * @return JSONObject {It returns the filtered records for the given criteria}
     */
    public JSONObject searchSchemaObject(String objectType, FlexType flexType, Map criteriaMap ) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not applicable for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

     /**
     * @description This Method is used to fetch the combination of given OIds Linked Record
     * @Param objectType contains the name of the flex object
     * @Param flexType contains the flextype of the flex object
     * @Param criteriaMap contains the criteria to search
     * @return JSONObject {It returns the filtered records for the given oids}
     */
    public JSONObject getFlexLinkInfo(String objectType,JSONObject rootObject,JSONObject propertiesObject) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not implemented for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

     /**
     * @description This Method is used to search records by the name 
     * @Param criteriaMap contains the criteria to search
     * @Param flexType contains the flextype of the flex object 
     * @Param name contains the name of the record to be search
     * @return String {It returns the  record for the given name}
     */
    public abstract String searchByName(Map criteria,FlexType flexType,String name) throws Exception;


     /**
    * This method is used either insert or update the flex object that are  passed by using type as reference,
    * @param type String 
    * @param oid String
    * @param JSONObject  Contains object of flex object data
    * @exception Exception
    * @return JSONObject  It returns response  object
    */
    public  JSONObject saveOrUpdate(String oid,String type,JSONObject serachJsonObject,JSONObject payloadJsonObect) throws Exception
    {
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not implemented for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

    /**
    * This method is used to delete the flex object for the given oid,
    * @param oid String
    * @exception Exception
    * @return JSONObject  It returns response  object
    */
    public  JSONObject delete(String oid) throws Exception
    {
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not implemented for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

    /**
    * This method is used to get the flexhierarchy of the given model,
    * @exception WTException,Exception
    * @return FlexTypeClassificationTreeLoader  It returns response  object
    */
    public abstract FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws WTException,Exception;


   

    /**
    * This method is used to get the records for given criteria,
    * @param typeId String
    * @param objectType String
    * @param criteriaMap Map
    * @exception Exception
    * @return JSONObject  It returns response  object
    */
    public JSONObject getRecords(String objectType,Map criteriaMap) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not applicable for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

    /**
    * This method is used to get the oid by passing flex object,
    * @param flexObject FlexObject
    * @exception Exception
    * @return String  It returns response  object
    */

    public abstract String getOid(FlexObject flexObject) throws Exception;

    /**
    * This method is used to get the object data for the given type and oid,
    * @param oid String
    * @param objectType String
    * @exception Exception
    * @return JSONObject  It returns response  object
    */

    public abstract JSONObject getRecordByOid(String objectType,String oid) throws Exception;

    /**
    * This method is used to get the related records of the given association type,
    * @param objectType String
    * @param oid String
    * @param association String
    * @exception Exception
    * @return JSONObject  It returns response  object
    */

    public JSONObject getRecordByOid(String objectType,String oid,String association) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not applicable for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }

    /**
    * This method is used to get the flex schema for the given type and typeId,
    * @param oid String
    * @param typeId String
    * @param jsonAsscos JSONObject
    * @exception Exception
    * @return JSONObject  It returns response  object
    */
    public JSONObject getFlexSchema(String type,String typeId) throws Exception{
        //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** default getFlexSchema ***** " ));
        JSONObject responseObject=new JSONObject();
        try{
            JSONObject jsonAsscos = util.getConfigureJSON();
            JSONObject configObject =(JSONObject)jsonAsscos.get(type);
            if(configObject!=null){
                JSONObject attributesObj=(JSONObject) configObject.get("properties");
                Collection attrsList = new ArrayList() ;
                Collection totalAttrs = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                   attrsList=FlexTypeCache.getFlexType(typeId).getAllAttributes();
                }else{
                   attrsList=FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
                }
                attributesObj = util.getAttributesData(attrsList,attributesObj);
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
                JSONObject transObject=new JSONObject();
                responseObject.put("transformation_kind",(JSONObject)configObject.get("transformation_kind"));
                responseObject.put("associations",(JSONObject)configObject.get("associations"));
                responseObject.put("embedded",(JSONObject)configObject.get("embedded")); 
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
     * @description This Method is used to fetch the combination of given OIds Linked Record
     * @Param objectType contains the name of the flex object
     * @Param flexType contains the flextype of the flex object
     * @Param criteriaMap contains the criteria to search
     * @return JSONObject {It returns the filtered records for the given oids}
     */
    public JSONObject checkInOut(String oid,String action) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not implemented for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }


    /**
     * @description This Method is used to fetch the combination of given OIds Linked Record
     * @Param objectType contains the name of the flex object
     * @Param flexType contains the flextype of the flex object
     * @Param criteriaMap contains the criteria to search
     * @return JSONObject {It returns the filtered records for the given oids}
     */
    public JSONObject findThumbnailData(String oid) throws Exception{
      JSONObject responseObject=new JSONObject();
      responseObject.put("status","Failed");
      responseObject.put("message","This method is not implemented for the given type");
      responseObject.put("statusCode",404);
      return responseObject;
    }


}
	