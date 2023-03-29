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
package cdee.web.model.specification;

import org.json.simple.JSONObject;
import java.util.Map;
import java.util.Set;
import java.util.Collection;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecMaster;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.specification.FlexSpecToSeasonLink;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.sourcing.LCSSourcingConfig;
import com.lcs.wc.specification.FlexSpecificationClientModel;
import com.lcs.wc.specification.SpecOwner;

import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.model.document.DocumentModel;
import cdee.web.model.measurements.MeasurementsModel;

import org.json.simple.JSONArray;
import com.lcs.wc.document.LCSDocumentQuery;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.season.LCSSeasonMaster;
import com.lcs.wc.sourcing.LCSSourcingConfigMaster;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;

import cdee.web.model.product.ProductModel;
import cdee.web.model.season.SeasonModel;
import cdee.web.model.sourcing.SourcingConfigurationModel;
import wt.fc.WTObject;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SpecificationModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(SpecificationModel.class.getName());
//private static final String CLASSNAME = SpecificationModel.class.getName();

  AppUtil util = new AppUtil();


  /**
      * This method is used either insert or update the Specification flex object that are  passed by using type as reference,
      * Using this method we can insert/update record of a Specification flextype at a time.
      * @param type String 
      * @param oid String
      * @param specificationJsonData  Contains Specification data
      * @exception Exception
      * @return JSONObject  It returns Specification JSONObject object
      */
    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject specificationJsonData) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                 ArrayList list =util.getOidFromSeachCriteria(type, searchJson,specificationJsonData);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSpecification with criteria ***** "));
                    responseObject = updateSpecification(list.get(2).toString(), type, specificationJsonData);
                } else {
                  //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSpecification ***** "));
                    responseObject = createSpecification(type, specificationJsonData);
                }
            } else {
              //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSpecification with oid ***** "));
                responseObject = updateSpecification(oid, type, specificationJsonData);
            }

        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

  /**
  * This method is used to insert the Specification flex object that are  passed by using type as reference.
  * Using this method we can insert several records of a Specification flextype at a time.
  * @param type is a string 
  * @param specificationDataList ArrayList Contains attributes, typeId, oid(if existing)
  * @exception Exception
  * @return JSONObject  It returns Specification JSON object
  */  
  public JSONObject createSpecification(String type, JSONObject specJsonAttrs){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Specification ***** "));
      JSONObject responseObject = new JSONObject();
      FlexSpecificationClientModel flexSpecModel=new FlexSpecificationClientModel();
      try{
        String productOid = (String)specJsonAttrs.get("productOid");
        String sourcingOid = (String)specJsonAttrs.get("sourcingConfigurationOid");
        LCSProduct productMaster = (LCSProduct) LCSQuery.findObjectById(productOid);
        LCSSourcingConfig sourcingConfigMaster = (LCSSourcingConfig) LCSQuery.findObjectById(sourcingOid);
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(specJsonAttrs,type,(String)specJsonAttrs.get("typeId"));
        convertedAttrs.put("specSourceId",sourcingConfigMaster.getMaster().toString());
        convertedAttrs.put("specOwnerId",productMaster.getMaster().toString());
        AttributeValueSetter.setAllAttributes(flexSpecModel,convertedAttrs);
        flexSpecModel.save();
        responseObject = util.getInsertResponse(FormatHelper.getVersionId(flexSpecModel.getBusinessObject()).toString(),type,responseObject);
      } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
      }catch(Exception e){
        responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
    }

   /**
    * This method is used to update the Specification flex object that are  passed by using OID as reference.
    * Using this method we can update several records of a Specification flextype at a time.
    * @param oid String oid of an item(type) to update
    * @param type String
    * @param specJsonAttrs JSONObject Contains Specification data
    * @exception Exception
    * @return JSONObject  It returns Specification JSON object
    */
    public JSONObject updateSpecification(String oid,String type, JSONObject specJsonAttrs) throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** update specification with oid ***** "+ oid));
      JSONObject responseObject = new JSONObject();
      FlexSpecificationClientModel flexSpecModel=new FlexSpecificationClientModel();
      try{
        flexSpecModel.load(oid);
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(specJsonAttrs,type,FormatHelper.getObjectId(flexSpecModel.getFlexType()));
        AttributeValueSetter.setAllAttributes(flexSpecModel,convertedAttrs);
        flexSpecModel.save();
        responseObject = util.getUpdateResponse(FormatHelper.getVersionId(flexSpecModel.getBusinessObject()).toString(),type,responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.specification.FlexSpecification"); 
  } 


  /**
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  

    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        SearchResults results = new SearchResults();
        FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
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
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
    FlexSpecQuery flexSpecQuery = new FlexSpecQuery();
    Collection < FlexObject > response = flexSpecQuery.findSpecsByCriteria(criteria, flexType, null, null).getResults();
    String oid = (String) response.iterator().next().get("FLEXSPECIFICATION.BRANCHIDITERATIONINFO");
    oid = "VR:com.lcs.wc.specification.FlexSpecification:" + oid;
    if (response.size() == 0) {
        return "no record";
    } else {
        return oid;
    }

  }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "VR:com.lcs.wc.specification.FlexSpecification:"+(String)flexObject.getString("FLEXSPECIFICATION.BRANCHIDITERATIONINFO"); 

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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        FlexSpecification flexSpecificationInput = (FlexSpecification) LCSQuery.findObjectById(oid);
        FlexSpecification flexSpecification = flexSpecificationInput;
        try{
            flexSpecification = (FlexSpecification) VersionHelper.latestIterationOf(flexSpecificationInput);
        }catch(Exception e){
          
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(flexSpecification.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(flexSpecification.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid", util.getVR(flexSpecification));
        //jSONObject.put("oid", FormatHelper.getVersionId(flexSpecification).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(flexSpecification).toString());
        jSONObject.put("typeId",FormatHelper.getObjectId(flexSpecification.getFlexType()));
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",flexSpecification.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(flexSpecification));
        LCSProduct product = LCSProductQuery.getProductVersion((LCSPartMaster)flexSpecification.getSpecOwner(), "A");
        jSONObject.put("productOid", FormatHelper.getVersionId(product).toString());
        LCSSourcingConfigMaster sconfigMaster = (LCSSourcingConfigMaster)(flexSpecification.getSpecSource());
        LCSSourcingConfig config = (LCSSourcingConfig)VersionHelper.latestIterationOf(sconfigMaster);
        jSONObject.put("sourcingConfigurationOid", FormatHelper.getVersionId(config).toString());
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(flexSpecification));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = flexSpecification.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(flexSpecification.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,flexSpecification.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
         }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(flexSpecification.getFlexType()));  
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
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if(association.equalsIgnoreCase("Reference Document")){
          jSONObject.put("Reference Document",findReferenceDocs(oid));
        } else if(association.equalsIgnoreCase("Product")){
          jSONObject.put("Product",findProduct(oid));
        }else if(association.equalsIgnoreCase("Sourcing Configuration")){
          jSONObject.put("Sourcing Configuration",findSourcingConfig(oid));
        }else if(association.equalsIgnoreCase("Specification To Season")){
          jSONObject.put("Specification To Season",findSpecToSeason(oid));
        }else if(association.equalsIgnoreCase("Measurements")){
            jSONObject.put("Measurements",findMeasurements(oid));
          }
        return jSONObject;
    }

    /**
     * This method is used to get the Reference Docs records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the material associated Reference Documents records in the form of array
     */
    public JSONArray findReferenceDocs(String specificationlOid){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find reference docs with specificationlOid ***** "+ specificationlOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentArray = new JSONArray();
        try{
            FlexSpecification flexSpecification = (FlexSpecification) LCSQuery.findObjectById(specificationlOid);
            Collection response = new LCSDocumentQuery().findPartDocReferences(flexSpecification);
            Iterator itr = response.iterator();
            while (itr.hasNext()){
                FlexObject flexObject = (FlexObject)itr.next();
                String documentOid = documentModel.getOid(flexObject);
                JSONObject documentObject = documentModel.getRecordByOid("Document",documentOid);
                documentArray.add(documentObject);
            }
        }catch(Exception e){
            documentArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentArray;
    }

    public JSONArray findProduct(String specificationlOid){
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find product with specificationlOid ***** "+ specificationlOid));
      ProductModel productModel = new ProductModel();
      JSONArray productArray = new JSONArray();
      try { 
        FlexSpecification flexSpecification = (FlexSpecification) LCSQuery.findObjectById(specificationlOid);
        LCSProduct lcsProduct = LCSProductQuery.getProductVersion((LCSPartMaster)flexSpecification.getSpecOwner(), "A");
          //LCSPartMaster lcsProductMaster = flexSpecification.getSpecOwner();
         // LCSProduct lcsProduct = (LCSProduct)VersionHelper.getVersion(lcsProductMaster, "A");
          String productOid = FormatHelper.getObjectId(lcsProduct);
          JSONObject productObject = productModel.getRecordByOid("Product", productOid);
          productArray.add(productObject);
      } catch (Exception e) {
          productArray.add(util.getExceptionJson(e.getMessage()));
      }
      return productArray;
  }

    public JSONArray findSourcingConfig(String specificationlOid){
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find sourcing config ith specificationlOid ***** " + specificationlOid));
      SourcingConfigurationModel sourcingConfigurationModel = new SourcingConfigurationModel();
      JSONArray sourcingConfigArray = new JSONArray();
      try {
        FlexSpecification flexSpecification = (FlexSpecification) LCSQuery.findObjectById(specificationlOid);
        LCSSourcingConfigMaster sconfigMaster = (LCSSourcingConfigMaster)(flexSpecification.getSpecSource());        
        LCSSourcingConfig lcsSourcingConfig = (LCSSourcingConfig)VersionHelper.latestIterationOf(sconfigMaster);
        String sourcingConfigOid = FormatHelper.getObjectId(lcsSourcingConfig);
        JSONObject sourcingConfigObject = sourcingConfigurationModel.getRecordByOid("Sourcing Configuration", sourcingConfigOid);
        sourcingConfigArray.add(sourcingConfigObject);
      } catch (Exception e) {
        sourcingConfigArray.add(util.getExceptionJson(e.getMessage()));
      }
      return sourcingConfigArray;
  }

    public JSONArray findSpecToSeason(String specificationlOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find spec to season with specificationlOid***** "+ specificationlOid));
      SeasonModel seasonModel = new SeasonModel();
      JSONArray specSeasonArray = new JSONArray();
      try{
          FlexSpecification flexSpecification = (FlexSpecification) LCSQuery.findObjectById(specificationlOid);
          Collection response = new FlexSpecQuery().specSeasonUsed(flexSpecification.getMaster());
          Iterator itr = response.iterator();
          while (itr.hasNext()){
              FlexObject flexObject = (FlexObject)itr.next();
              String seasonOid = seasonModel.getOid(flexObject);
              JSONObject seasonObject = seasonModel.getRecordByOid("Season",seasonOid);
              specSeasonArray.add(seasonObject);
          }
      }catch(Exception e){
        specSeasonArray.add(util.getExceptionJson(e.getMessage()));
      }
      return specSeasonArray;
  }

    public JSONArray findMeasurements(String specOid) {
        //if (LOGGER.isDebugEnabled())
             //LOGGER.debug((Object) (CLASSNAME + "***** Find measurements with association object productOid ***** "+ specOid));
          MeasurementsModel measurementsModel = new MeasurementsModel();

          LCSMeasurementsQuery lcsMeasurementsQuery = new LCSMeasurementsQuery();
          JSONArray measurementsArray = new JSONArray();
          try {
              //LCSProduct lcsProduct = (LCSProduct) LCSQuery.findObjectById(specOid);
              FlexSpecification flexSpecification = (FlexSpecification) LCSQuery.findObjectById(specOid);

              Collection response = lcsMeasurementsQuery.findMeasurements(null,null,flexSpecification);

              Iterator itr = response.iterator();
              while (itr.hasNext()) {
                  FlexObject measurementsObj = (FlexObject) itr.next();
                  String measurementsOid = measurementsModel.getOid(measurementsObj);
                  JSONObject measurementsObject = measurementsModel.getRecordByOid("Measurements", measurementsOid);
                  measurementsArray.add(measurementsObject);
              }
          } catch (Exception e) {
              measurementsArray.add(util.getExceptionJson(e.getMessage()));
          }
          return measurementsArray;
      }
 // Function to return sourcing config based on Product, Season and primary flag. 
 	public JSONObject getFlexLinkInfo(String objectType, JSONObject rootObject, JSONObject propertiesObject)
 			throws Exception {
 		//if (LOGGER.isDebugEnabled())
 			//LOGGER.debug((Object) (CLASSNAME + "***** Get flex link info ***** "));
 		String productOid = "";
 		boolean primary = false;
 		String seasonOid = "";
 		String sourceOid = "";
 		String key = "";
 		JSONObject responseObject = new JSONObject();
 		LCSSeasonMaster seasonMaster = null;
 		LCSPartMaster productMaster = null;
 		LCSSourcingConfigMaster sourceMaster = null;
 		LCSProduct product = null;
 		LCSSourcingConfig source = null;
 		JSONArray scArray = new JSONArray();
 		try {
 			Set<?> keys = rootObject.keySet();
 			Iterator<?> itr = keys.iterator();
 			while (itr.hasNext()) {
 				key = (String) itr.next();
 				if (key.equalsIgnoreCase("seasonOid")) {
 					seasonOid = (String) rootObject.get(key);
 				} else if (key.equalsIgnoreCase("productOid")) {
 					productOid = (String) rootObject.get(key);
 				} else if (key.equalsIgnoreCase("primarySpec")) {
 					primary = (boolean) rootObject.get(key);
 				}else if (key.equalsIgnoreCase("sourceOid")) {
 					sourceOid = (String) rootObject.get(key);
 				}
 			}

 			if (!seasonOid.equals("")) {
 				LCSSeason season = (LCSSeason) LCSQuery.findObjectById(seasonOid);
 				if (season != null)
 					seasonMaster = season.getMaster();
 			}
 			if (!productOid.equals("")) {
 				 product = (LCSProduct) LCSQuery.findObjectById(productOid);
 				if (product != null)
 					productMaster = product.getMaster();
 			}
 			if (!sourceOid.equals("")) {
 				 source = (LCSSourcingConfig) LCSQuery.findObjectById(sourceOid);
 				if (source != null)
 					sourceMaster = source.getMaster();  
 			} 


 			if (seasonMaster != null && productMaster != null) {		
				Collection<?> fstslList = FlexSpecQuery.findSpecsToSeasonLinks((SpecOwner) productMaster,  seasonMaster, sourceMaster) ;
				Iterator<?> listItr = fstslList.iterator();
				while (listItr.hasNext()) { 
					FlexSpecToSeasonLink flexObject = (FlexSpecToSeasonLink) listItr.next(); 	
					boolean primarySpec = flexObject.isPrimarySpec();
					FlexSpecMaster specMaster = flexObject.getSpecificationMaster();
					FlexSpecification spec = (FlexSpecification) VersionHelper.latestIterationOf(specMaster);
					JSONObject jsonObject= getRecordByOid("Specification",util.getVR(spec) );
					jsonObject.put("primarySpec", primarySpec);					
					if(primary ) {
						if( primarySpec) {
							scArray.add(jsonObject);
							//break;
						}
					}else {
						scArray.add(jsonObject);
					}
				} 
 			}
 			responseObject.put(objectType, scArray);

 		} catch (Exception e) {
 			responseObject = util.getExceptionJson(e.getMessage());
 		}
 		return responseObject;
 	}
}