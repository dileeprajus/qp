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
package cdee.web.trigger;

import java.util.Iterator;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.google.gson.Gson;
import com.lcs.wc.change.LCSChangeActivity;
import com.lcs.wc.color.LCSColor;
import com.lcs.wc.color.LCSPalette;
//import org.apache.log4j.Logger;
import com.lcs.wc.color.LCSPaletteMaterialColorLink;
import com.lcs.wc.color.LCSPaletteMaterialLink;
import com.lcs.wc.color.LCSPaletteToColorLink;
import com.lcs.wc.component.FlexComponent;
import com.lcs.wc.construction.LCSConstructionDetail;
import com.lcs.wc.construction.LCSConstructionInfo;
import com.lcs.wc.country.LCSCountry;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.flexbom.FlexBOMLink;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.EffectivityContext;
import com.lcs.wc.foundation.LCSLifecycleManaged;
import com.lcs.wc.foundation.LCSLogEntry;
import com.lcs.wc.foundation.LCSRevisableEntity;
import com.lcs.wc.last.LCSLast;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.LCSMaterialColor;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.measurements.LCSMeasurements;
import com.lcs.wc.measurements.LCSPointsOfMeasure;
import com.lcs.wc.media.LCSMedia;
import com.lcs.wc.placeholder.Placeholder;
import com.lcs.wc.planning.FlexPlan;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.LCSSKU;
import com.lcs.wc.product.ProductDestination;
import com.lcs.wc.sample.LCSSample;
import com.lcs.wc.sample.LCSSampleRequest;
import com.lcs.wc.season.LCSProductSeasonLink;
import com.lcs.wc.season.LCSSKUSeasonLink;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.sizing.ProductSizeCategory;
import com.lcs.wc.skusize.SKUSize;
import com.lcs.wc.skusize.SKUSizeSource;
import com.lcs.wc.skusize.SKUSizeToSeason;
import com.lcs.wc.sourcing.LCSCostSheet;
import com.lcs.wc.sourcing.LCSSKUCostSheet;
import com.lcs.wc.sourcing.LCSSKUSourcingLink;
import com.lcs.wc.sourcing.LCSSourceToSeasonLink;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.sourcing.OrderConfirmation;
import com.lcs.wc.sourcing.RFQRequest;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.supplier.LCSSupplier;
import com.lcs.wc.testing.TestCondition;
import com.lcs.wc.testing.TestDetails;
import com.lcs.wc.testing.TestMethod;
import com.lcs.wc.testing.TestProperty;
import com.lcs.wc.testing.TestSpecification;
import com.lcs.wc.testing.TestStandard;
import com.lcs.wc.util.FormatHelper;

import cdee.web.services.schema.CreateFlexSchemaService;
import cdee.web.util.AppUtil;
import cdee.web.util.ExpressionValidator;
import cdee.web.util.TRCCache;
import wt.fc.WTObject;

public class TriggerService{

//private static final Logger LOGGER = LogR.getLogger(TriggerService.class.getName());
//private static final String CLASSNAME = TriggerService.class.getName();

/**
* This method is used to call the http service for trigger,
* @param String action
* @param WTObject obj
*/
public static void callHttpService(String action,WTObject obj)
	{
		CreateFlexSchemaService schemaService=new CreateFlexSchemaService();
		AppUtil appUtil=new AppUtil();
	try{
		Gson gson = new Gson();
		JSONObject triggerObject=new JSONObject();
		FlexType objectFlexType=null;
		String oid=FormatHelper.getObjectId(obj);
		String numericOid=FormatHelper.getNumericObjectIdFromObject(obj);
		String objectType=obj.getType();
		String typeName="";
		boolean placeholderFlag = false;
		JSONObject objectData=new JSONObject();
		JSONObject result = new JSONObject();
		//if (LOGGER.isDebugEnabled())					
		    //LOGGER.debug((Object) (CLASSNAME + "*********objectType "+objectType)); 
		try{
			if(objectType.equals("Material")){
				LCSMaterial lcsMaterial=(LCSMaterial)obj;
				objectFlexType=lcsMaterial.getFlexType();
			}else if(objectType.equals("BOM")){
				FlexBOMPart flexBomPart=(FlexBOMPart)obj;
				objectFlexType=flexBomPart.getFlexType();
			}else if(objectType.equals("BOM Link")){
				FlexBOMLink flexBomLink=(FlexBOMLink)obj;
				objectFlexType=flexBomLink.getFlexType();
			}else if(objectType.equals("Material Supplier")){				
				LCSMaterialSupplier materialSupplier=(LCSMaterialSupplier)obj;
				placeholderFlag = materialSupplier.isPlaceholder();
				objectFlexType=materialSupplier.getFlexType();
			}else if(objectType.equals("Business Object")){
				LCSLifecycleManaged businessObject=(LCSLifecycleManaged)obj;
				objectFlexType=businessObject.getFlexType();
			}else if(objectType.equals("Change Activity")){
				LCSChangeActivity changeActivity=(LCSChangeActivity)obj;
				objectFlexType=changeActivity.getFlexType();
			}else if(objectType.equals("Color")){
				LCSColor lcsColor=(LCSColor)obj;
				objectFlexType=lcsColor.getFlexType();
			}else if(objectType.equals("Colorway")){
				LCSSKU lcsSku=(LCSSKU)obj;
				placeholderFlag = lcsSku.isPlaceholder();
				objectFlexType=lcsSku.getFlexType();
			}else if(objectType.equals("Construction")){
				LCSConstructionInfo lcsConstructionInfo=(LCSConstructionInfo)obj;
				objectFlexType=lcsConstructionInfo.getFlexType();
			}else if(objectType.equals("Construction Detail")){
				LCSConstructionDetail lcsConstructionDetail=(LCSConstructionDetail)obj;
				objectFlexType=lcsConstructionDetail.getFlexType();
			}else if(objectType.equals("Country")){
				LCSCountry lcsCountry=(LCSCountry)obj;
				objectFlexType=lcsCountry.getFlexType();
			}else if(objectType.equals("LCS Document")){
				LCSDocument lcsDocument=(LCSDocument)obj;
				objectType="Document";
				objectFlexType=lcsDocument.getFlexType();
			}else if(objectType.equals("Effectivity Context")){
				EffectivityContext effectivityContext=(EffectivityContext)obj;
				objectFlexType=effectivityContext.getFlexType();
			}else if(objectType.equals("Last")){
				LCSLast lcsLast=(LCSLast)obj;
				objectFlexType=lcsLast.getFlexType();
			}else if(objectType.equals("Measurements")){
				LCSMeasurements lcsMeasurements=(LCSMeasurements)obj;
				objectFlexType=lcsMeasurements.getFlexType();
			}else if(objectType.equals("Measurements POM")){
				LCSPointsOfMeasure lcsPointsOfMeasure=(LCSPointsOfMeasure)obj;
				objectFlexType=lcsPointsOfMeasure.getFlexType();
			}else if(objectType.equals("Media")){
				LCSMedia lcsMedia=(LCSMedia)obj;
				objectFlexType=lcsMedia.getFlexType();
			}else if(objectType.equals("Palette")){
				LCSPalette lcsPalette=(LCSPalette)obj;
				objectFlexType=lcsPalette.getFlexType();
			}else if(objectType.equals("Palette to Color")){
				LCSPaletteToColorLink lcsPaletteToColorLink=(LCSPaletteToColorLink)obj;
				objectFlexType=lcsPaletteToColorLink.getFlexType();
			}else if(objectType.equals("Palette to Material")){
				LCSPaletteMaterialLink lcsPaletteMaterialLink=(LCSPaletteMaterialLink)obj;
				objectFlexType=lcsPaletteMaterialLink.getFlexType();
			}else if(objectType.equals("Placeholder")){
				Placeholder placeholder=(Placeholder)obj;
				objectFlexType=placeholder.getFlexType();
			}else if(objectType.equals("Plan")){
				FlexPlan flexPlan=(FlexPlan)obj;
				objectFlexType=flexPlan.getFlexType();
			}else if(objectType.equals("LCS Product")){
				LCSProduct lcsProduct=(LCSProduct)obj;
				objectType="Product";
				objectFlexType=lcsProduct.getFlexType();
			}else if(objectType.equals("RFQ")){
				RFQRequest rfqRequest=(RFQRequest)obj;
				objectFlexType=rfqRequest.getFlexType();
			}else if(objectType.equals("Season")){
				LCSSeason lcsSeason=(LCSSeason)obj;
				objectFlexType=lcsSeason.getFlexType();
			}else if(objectType.equals("Size Definition")){
				ProductSizeCategory productSizeCategory=(ProductSizeCategory)obj;
				objectFlexType=productSizeCategory.getFlexType();
			}else if(objectType.equals("Test Specification")){
				TestSpecification testSpecification=(TestSpecification)obj;
				objectFlexType=testSpecification.getFlexType();
			}else if(objectType.equals("Supplier")){
				LCSSupplier lcsSupplier=(LCSSupplier)obj;
				placeholderFlag = lcsSupplier.isPlaceholder();
				objectFlexType=lcsSupplier.getFlexType();
			}else if(objectType.equals("Sourcing Configuration")){
				LCSSourcingConfig sourceConfig=(LCSSourcingConfig)obj;
				objectFlexType=sourceConfig.getFlexType();
			}else if(objectType.equals("Cost Sheet Product")){
				LCSCostSheet lcsCostSheet=(LCSCostSheet)obj;
				objectFlexType=lcsCostSheet.getFlexType();
			}else if(objectType.equals("Cost Sheet Colorway")){
				LCSSKUCostSheet lcsSkuCostSheet=(LCSSKUCostSheet)obj;
				objectFlexType=lcsSkuCostSheet.getFlexType();
			}else if(objectType.equals("Material Color")){
				LCSMaterialColor materialColor=(LCSMaterialColor)obj;
				objectFlexType=materialColor.getFlexType();
			}else if(objectType.equals("Test Method")){
				TestMethod testMethod=(TestMethod)obj;
				objectFlexType=testMethod.getFlexType();
			}else if(objectType.equals("Test Condition")){
				TestCondition testMethod=(TestCondition)obj;
				objectFlexType=testMethod.getFlexType();
			}else if(objectType.equals("Test Property")){
				TestProperty testMethod=(TestProperty)obj;
				objectFlexType=testMethod.getFlexType();
			}else if(objectType.equals("Test Details")){
				TestDetails testMethod=(TestDetails)obj;
				objectFlexType=testMethod.getFlexType();
			}else if(objectType.equals("Test Standard")){
				TestStandard testMethod=(TestStandard)obj;
				objectFlexType=testMethod.getFlexType();
			}else if(objectType.equals("Sample")){
				LCSSample lcsSample=(LCSSample)obj;
				objectFlexType=lcsSample.getFlexType();
			}else if(objectType.equals("Sample Request")){
				LCSSampleRequest lcsSampleRequest=(LCSSampleRequest)obj;
				objectFlexType=lcsSampleRequest.getFlexType();
			}else if(objectType.equals("Colorway Size")){
				SKUSize skuSize=(SKUSize)obj;
				objectFlexType=skuSize.getFlexType();
			}else if(objectType.equals("Colorway Season Link")){
				LCSSKUSeasonLink skuSeasonLink=(LCSSKUSeasonLink)obj;
				objectFlexType=skuSeasonLink.getFlexType();
			}else if(objectType.equals("Product Season Link")){
				LCSProductSeasonLink lcsProductSeasonLink=(LCSProductSeasonLink)obj;
				objectFlexType=lcsProductSeasonLink.getFlexType();
			}else if(objectType.equals("Product Destination")){
				ProductDestination productDestination=(ProductDestination)obj;
				objectFlexType=productDestination.getFlexType();
			}else if(objectType.equals("Specification")){
				FlexSpecification flexSpecification=(FlexSpecification)obj;
				objectFlexType=flexSpecification.getFlexType();
			}else if(objectType.equals("Sourcing Configuration to Season")){
				LCSSourceToSeasonLink sourceToSeasonLink=(LCSSourceToSeasonLink)obj;
				objectFlexType=sourceToSeasonLink.getFlexType();
			}else if(objectType.equals("Sourcing Configuration to Colorway")){
				LCSSKUSourcingLink skuSourceToSeasonLink=(LCSSKUSourcingLink)obj;
				objectFlexType=skuSourceToSeasonLink.getFlexType();
			}else if(objectType.equals("Log Entry")){
				LCSLogEntry logEntry=(LCSLogEntry)obj;
				//objectData=schemaService.getRecordByOid("Sourcing Configuration to Colorway", oid,null);
				objectFlexType=logEntry.getFlexType();	
			}else if(objectType.equals("Revisable Entity")){
				LCSRevisableEntity revisableEntity=(LCSRevisableEntity)obj;
				objectFlexType=revisableEntity.getFlexType();	
			}else if(objectType.equals("Colorway Size to Season")){
				SKUSizeToSeason skuSizeToSeasonLink=(SKUSizeToSeason)obj;
				objectFlexType=skuSizeToSeasonLink.getFlexType();
			}else if(objectType.equals("Colorway Size to Source")){
				SKUSizeSource skuSizeSourceLink=(SKUSizeSource)obj;
				objectFlexType=skuSizeSourceLink.getFlexType();
			}else if(objectType.equals("Palette to Material Color Link")){
				LCSPaletteMaterialColorLink palletmatColor=(LCSPaletteMaterialColorLink)obj;
				objectFlexType=palletmatColor.getFlexType();
			}else if(objectType.equals("Order Confirmation")){
				OrderConfirmation orderConfirmation = (OrderConfirmation)obj;
				objectFlexType=orderConfirmation.getFlexType();
			}else if(objectType.equals("Retail Component")){
				FlexComponent lcsComponent = (FlexComponent)obj;
				objectFlexType=lcsComponent.getFlexType();
			}
			else{
				return;
			}
			//Sourcing Configuration to Season
			typeName=objectFlexType.getFullNameDisplay(true);
		}catch(Exception e){
		}
 
		if(!typeName.equals(null)){
			triggerObject.put("typeName",typeName);
		}
		
		JSONArray fileObj = TRCCache.getTriggerCache();
        Iterator itr=fileObj.iterator();
	        while(itr.hasNext()){
	        	try{
	        	String url="";
	        	JSONObject singleObject=(JSONObject)itr.next();
	        	String triggerTypeId=(String)singleObject.get("typeId");
	        	FlexType triggerFlexType=FlexTypeCache.getFlexType(triggerTypeId);
	        	if(objectFlexType!=null && triggerFlexType!=null && objectType.equals(singleObject.get("flexObject")) && !placeholderFlag ){
	        		//Check endpoints
	        		if(triggerFlexType.equals(objectFlexType) || triggerFlexType.getAllChildren().contains(objectFlexType)){
	        			JSONObject endPoints=(JSONObject)singleObject.get("end_points");
						if(action.equals("CREATE") && endPoints.containsKey("create_trigger")){
							url=(String)singleObject.get("base_url")+"/"+(String)endPoints.get("create_trigger");
						}else if(action.equals("UPDATE") && endPoints.containsKey("update_trigger")){
							url=(String)singleObject.get("base_url")+"/"+(String)endPoints.get("update_trigger");
						}else  if(action.equals("DELETE") && endPoints.containsKey("delete_trigger")){
							url=(String)singleObject.get("base_url")+"/"+(String)endPoints.get("delete_trigger");
						}
						if(!url.equals("")){
							
							// Check includes
		        			boolean includesAssociation = appUtil.checkAssociation(singleObject);
		        			if(includesAssociation )
		        			{
		        				JSONObject includesJsonObject = (JSONObject)singleObject.get("includes");
		        				JSONObject associationObject=(JSONObject)appUtil.createAssociation(objectType,oid,includesJsonObject);
		        				objectData = schemaService.getFlexObjectAssociations(gson.toJson(associationObject));
		        				JSONObject rootobjectDataInfo =schemaService.getRecordByOid(objectType, oid,null);
		        				 result = (JSONObject)rootobjectDataInfo.get(objectType);
		        	
		        			}
		        			else
		        			{
		        	    	objectData=schemaService.getRecordByOid(objectType, oid,null);
			        		result = (JSONObject)objectData.get(objectType);
		        			}
			        		//if (LOGGER.isDebugEnabled())
							//{
			        		//LOGGER.debug((Object) (CLASSNAME + "**********----------*****----------*****")); 
							//LOGGER.debug((Object) (CLASSNAME + "*****Action:"+action));
							//LOGGER.debug((Object) (CLASSNAME + "*****Oid:"+oid));
							//LOGGER.debug((Object) (CLASSNAME + "*****Object type:"+objectType));
							//LOGGER.debug((Object) (CLASSNAME + "*****Object Data:"+objectData));
							//LOGGER.debug((Object) (CLASSNAME + "**********----------*****----------*****"));
							//}
							
							
							 
			        		triggerObject.put("action",action);
							String objOID = FormatHelper.getObjectId(obj);
							try{
								objOID = appUtil.getVR(obj);
							}
							catch(Exception oep)
							{
								objOID = FormatHelper.getObjectId(obj);
							}
							triggerObject.put("oid",result.get("oid"));
							//triggerObject.put("oid",objOID);
							triggerObject.put("numericOid",FormatHelper.getNumericObjectIdFromObject(obj));
							triggerObject.put("objectType",objectType);
							triggerObject.put("objectData",objectData);
							//if (LOGGER.isDebugEnabled())
									//LOGGER.debug((Object) (CLASSNAME + "*****Object Data:"+objectData));
							
							//Pre validation check
							boolean includeeValidation = appUtil.checkValidationJson(singleObject);
							String formula = "";
		        			if(includeeValidation )
		        			{
		        				//JSONObject validationJsonObject = (JSONObject)singleObject.get("validation");
		        				formula=(String)singleObject.get("validation");
		        				//JSONObject validationObject=(JSONObject)appUtil.createAssociation(objectType,oid,validationJsonObject);
		        				//objectData = schemaService.getFlexObjectAssociations(gson.toJson(validationObject));
		        	
		        			}
							//(String) singleObject.get("formula");
							//formula = "(vrdStatus==\"vrdActive\" || vrdStatus==\"vrdDevelopment\")?true:false";
							//formula = "(vrdStatus==\"vrdActive\" && (isCMYK || vrdCyan > .01))?true:false";
							//formula = "(vrdCyan > .01) ?true:false";
							boolean goNoFlag= true ;
							if(formula != null && !formula.equals(""))
							{
								ExpressionValidator abc = new ExpressionValidator();
								//goNoFlag = abc.execute(formula, triggerObject,objectType);
								goNoFlag = abc.execute(formula, result);
							}
							//
							if(goNoFlag) {
							if(singleObject.containsKey("mediaType")){
								String mediaType=(String)singleObject.get("mediaType");
								if(mediaType!=null){
									//AppUtil appUtil=new AppUtil();
									triggerObject=appUtil.getEncodedImage(triggerObject,objectType,mediaType);
								}
							}	
							cdee.web.trigger.CallAsyncQueue callAsyncQueue = new cdee.web.trigger.CallAsyncQueue();
							callAsyncQueue.callTRCTriggerAsynch( url,triggerObject,(String)singleObject.get("app_key") );
							}
						}
	        			
						}
		        	}
	        	
	       	}catch(Exception e){
	       		//if (LOGGER.isDebugEnabled())
	       		//LOGGER.debug((Object) (CLASSNAME + "*****Exception While contructing object "+e));
	        }
    	}


		
	}catch(Exception e){
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "*****Exception"+e));
	}
		
	}	

}