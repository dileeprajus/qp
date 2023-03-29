/*
 * Created on 06/08/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.measurements;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Vector;
import java.util.Collection;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.measurements.LCSPointsOfMeasureQuery;
import com.lcs.wc.measurements.MeasurementValues;
import com.lcs.wc.product.LCSProductQuery;

import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.measurements.LCSMeasurements;
import com.lcs.wc.measurements.LCSMeasurementsClientModel;
import com.lcs.wc.measurements.LCSMeasurements;
import com.lcs.wc.measurements.LCSMeasurementsQuery;
import com.lcs.wc.measurements.LCSPointsOfMeasure;
import wt.util.WTException;
import com.lcs.wc.measurements.LCSMeasurementsLogic;
import com.lcs.wc.measurements.LCSMeasurementsMaster;

import cdee.web.model.sizing.SizingModel;
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.specification.FlexSpecUtil;
import com.lcs.wc.sizing.SizeCategory;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import com.lcs.wc.util.DeleteFileHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class MeasurementsModel extends GenericObjectService {
 //private static final Logger LOGGER = LogR.getLogger(MeasurementsModel.class.getName());
    //private static final String CLASSNAME = MeasurementsModel.class.getName();
    AppUtil util = new AppUtil();
    Gson gson = new Gson();
    LCSMeasurementsQuery lcsMeasurements = new LCSMeasurementsQuery();
    LCSPointsOfMeasureQuery lcsPointsOfMeasureQuery = new LCSPointsOfMeasureQuery();


    /**
     * This method is used either insert or update the Measurement flex object that are  passed by using type as reference,
     * oid and array of different Measurement data 
     * Using this method we can insert/update several records of a Measurement flextype at a time.
     * @param type String 
     * @param oid String
     * @param MeasurementJSONArray  Contains array of Measurement data
     * @exception Exception
     * @return JSONArray  It returns Measurement JSONArray object
     */

    public JSONObject saveOrUpdate(String type,String oid, JSONObject searchJson, JSONObject payloadJson) throws Exception { 
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"----oid-----"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
             ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
               
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMeasurement with creteria***** "));
                    responseObject = updateMeasurement(list.get(2).toString(),type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createMeasurement ***** "));
                    responseObject = createMeasurement(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMeasurement with oid ***** "+oid));
                responseObject = updateMeasurement(oid,type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Measurement flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Measurement flextype at a time.
     * @param type is a string 
     * @param constructionDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Measurement JSONArray object
     */

    public JSONObject createMeasurement(String type, JSONObject measurementDataList) {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Measurement  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMeasurementsClientModel measurementModel = new LCSMeasurementsClientModel();
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(measurementDataList,type,(String)measurementDataList.get("typeId"));
            convertedAttrs.put("measurementsType", "TEMPLATE");
            AttributeValueSetter.setAllAttributes(measurementModel, convertedAttrs);
            if(measurementDataList.containsKey("base64File") && measurementDataList.containsKey("base64FileName") && measurementDataList.containsKey("imageKey") )
            measurementModel = imageAssignment (measurementModel,measurementDataList);       
         
            measurementModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getVersionId(measurementModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the Measurement flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Measurement flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param constructionJsonObject  Contains Measurement data
     * @exception Exception
     * @return String  It returns OID of Measurement object
     */

    public JSONObject updateMeasurement(String oid,String type, JSONObject measurementJsonObject) throws Exception {
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Measurement  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSMeasurementsClientModel measurementModel = new LCSMeasurementsClientModel();
        try {
            measurementModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(measurementJsonObject,type,FormatHelper.getObjectId(measurementModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(measurementModel, convertedAttrs);
           
            if(measurementJsonObject.containsKey("base64File") && measurementJsonObject.containsKey("base64FileName") && measurementJsonObject.containsKey("imageKey") )
            measurementModel = imageAssignment (measurementModel,measurementJsonObject);          
            measurementModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(measurementModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
    /**
     * This method is used delete Measurement of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete with oid initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSMeasurements lcsMeasurements = (LCSMeasurements) LCSQuery.findObjectById(oid);
            LCSMeasurementsLogic lcsMeasurementsLogic = new LCSMeasurementsLogic();
            lcsMeasurementsLogic.deleteMeasurements(lcsMeasurements);
            responseObject = util.getDeleteResponseObject("Measurements", oid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.measurements.LCSMeasurements");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex  schema  ***** "));
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
                    if(attribute.getAttScope().equals("PRODUCT_SCOPE")){
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
     * @param objectType  String
     * @param typeId  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String typeId, String objectType, Map criteriaMap) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records initialized ***** "+ typeId));
        SearchResults results = new SearchResults();
        FlexType flexType = null;
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        results = lcsMeasurements.findMeasurementsByCriteria(criteriaMap, flexType, null);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid by taking name of the record.
     * @param FlexType  flexType
     * @param Map criteria
     * @param String name
     * @Exception exception
     * @return return oid by taking name of the record of the flex object
     */
    public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
            //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        Collection < FlexObject > response = lcsMeasurements.findMeasurementsByCriteria(criteria, flexType, null).getResults();
        String oid = (String) response.iterator().next().get("LCSMEASUREMENTS.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.measurements.LCSMeasurements:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
    }

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param typeId  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public String getRecordsData(FlexType flexType) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by data ***** "));
        JSONObject object = new JSONObject();
        Map criteria = new HashMap();
        object.put("Measurements", lcsMeasurements.findMeasurementsByCriteria(criteria, flexType, null).getResults());
       object.put("POM", lcsPointsOfMeasureQuery.findPointsOfMeasureByCriteria(criteria, flexType, null, null, null, false, false).getResults());
      //  object.put("POM", lcsPointsOfMeasureQuery.findPointsOfMeasureByCriteria(null, flexType, null, null, null, false, false).getResults());
        return gson.toJson(object);
    }

    /**
     * This method is used to search schema object .
     * @param jsonObject is a JSONObject 
     * @param objectType  String
     * @param flexType  FlexType
     * @param criteriaMap  Map
     * @exception Exception
     * @return String  it returns schema object
     */
    public JSONObject searchSchemaObject(String objectType, FlexType flexType, Map criteriaMap) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Search Schema Object***** "));
        SearchResults results = new SearchResults();
        results = lcsMeasurements.findMeasurementsByCriteria(criteriaMap, flexType, null);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "VR:com.lcs.wc.measurements.LCSMeasurements:" + (String) flexObject.getString("LCSMEASUREMENTS.BRANCHIDITERATIONINFO");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return String  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSMeasurements lcsMeasurementsInput = (LCSMeasurements) LCSQuery.findObjectById(oid);
        LCSMeasurements lcsMeasurements = lcsMeasurementsInput;
        try{
            lcsMeasurements = (LCSMeasurements) VersionHelper.latestIterationOf(lcsMeasurementsInput);
        }catch(Exception e){

        }
        //provides product, souce, spec information
        Collection productList = new Vector();
        Collection specList = new Vector();
        Collection sourceList = new Vector();
        Collection seasonList = new Vector();
        
        if(lcsMeasurements != null && "INSTANCE".equals(lcsMeasurements.getMeasurementsType())){
            jSONObject.put("owner", ""+ util.getVR(LCSProductQuery.getProductVersion(lcsMeasurements.getProductMaster(), "A")));
        }

        
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsMeasurements.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsMeasurements.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("oid", util.getVR(lcsMeasurements));
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsMeasurements).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsMeasurements.getFlexType()));
        jSONObject.put("ORid", FormatHelper.getObjectId(lcsMeasurements).toString());
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsMeasurements.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsMeasurements));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsMeasurements));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        jSONObject.put("baseSize", lcsMeasurements.getSampleSize());
        jSONObject.put("measurementType", lcsMeasurements.getMeasurementsType());
        jSONObject.put("SizeRun", MOAHelper.getMOACollection(lcsMeasurements.getSizeRun()));
        Collection attributes = lcsMeasurements.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsMeasurements.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsMeasurements.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMeasurements.getFlexType()));    
    }

    

    /**
     * This method is used to fetch the record that matched with the given oid of this flex object with association flexObject records.
     * @param String  objectType which contains flexObject name
     * @param String oid 
     * @param String association which contains association(includes) flexObject name
     * @Exception exception
     * @return JSONObject  it returns the record that matched the given oid of this flex object with association flexObject records
     */
    public JSONObject getRecordByOid(String objectType, String oid, String association) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        
      	JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("POM")) {
            jSONObject.put("POM", findPOMs(oid));
        }else if (association.equalsIgnoreCase("associatedSpec")) {
            jSONObject.put("associatedSpec", findAssociatedSpec(oid));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the POM records of given measurementOid .
     * @param String measurementOid
     * @return JSONArray  it returns the POMs associated  in the form of array
     */
    public JSONArray findPOMs(String measurementOid) {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** find poms ***** "+ measurementOid));
        LCSMeasurementsQuery lcsMeasurementsQuery = new LCSMeasurementsQuery();
        PomModel pomModel = new PomModel();
        JSONArray pomArray = new JSONArray();
        String size;
        MeasurementValues values;
        try {
            LCSMeasurements lcsMeasurements = (LCSMeasurements) LCSQuery.findObjectById(measurementOid);
            Collection SizeRun = MOAHelper.getMOACollection(lcsMeasurements.getSizeRun());
            Collection pomCollection = lcsMeasurementsQuery.findPointsOfMeasure(lcsMeasurements);
            Iterator itr = pomCollection.iterator();
            Iterator itrSize = SizeRun.iterator();
            while (itr.hasNext()) {
                LCSPointsOfMeasure lcsPointsOfMeasure = (LCSPointsOfMeasure) itr.next();
                String pomOid = FormatHelper.getObjectId(lcsPointsOfMeasure);
                JSONObject pomObject = pomModel.getRecordByOid("POM", pomOid);
                JSONArray measurementArray = new JSONArray();
                
                Hashtable sizeMap = lcsPointsOfMeasure.getMeasurementValues();
                itrSize = SizeRun.iterator();
                while (itrSize.hasNext()) {
                    JSONObject measurementValue = new JSONObject();
                    size = (String) itrSize.next();
                     values = (MeasurementValues) sizeMap.get(size);
                     if(values!= null) {
                         measurementValue.put("Size",size);
                         measurementValue.put("ActualValue",values.getActualValue());
                         measurementValue.put("Grading",values.getGrading());
                         measurementValue.put("OverrideValue",values.getOverrideValue());
                         measurementValue.put("Value",values.getValue());
                     }else
                     {
                         measurementValue.put("Size",size);
                         measurementValue.put("ActualValue",0.0);
                         measurementValue.put("Grading",0.0);
                         measurementValue.put("OverrideValue",0.0);
                         measurementValue.put("Value",0.0);
                     }
                     measurementArray.add(measurementValue);
                     
                }
                pomObject.put("Sizes", measurementArray);
                pomArray.add(pomObject);
            }
        } catch (Exception e) {
            pomArray.add(util.getExceptionJson(e.getMessage()));
        }
        return pomArray;
    }

    
    public LCSMeasurementsClientModel imageAssignment(LCSMeasurementsClientModel measurementModel, JSONObject attrsJsonObject)throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** image assignment initialized ***** "));
    
    
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
           measurementModel.setPrimaryImageURL((String)attrsJsonObject.get("partPrimaryImageURL"));
          
            }
            else {
                   measurementModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
            
        return measurementModel;
    }

    
	public JSONArray findAssociatedSpec(String measurementOid) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find poms ***** " + measurementOid));
		JSONArray associatedSpecArray = new JSONArray();

		JSONObject jSONObject = new JSONObject();
		LCSMeasurementsQuery lcsMeasurementsQuery = new LCSMeasurementsQuery();
		LCSMeasurements lcsMeasurements;
		try {
			lcsMeasurements = (LCSMeasurements) LCSQuery.findObjectById(measurementOid);


			if (lcsMeasurements != null && "INSTANCE".equals(lcsMeasurements.getMeasurementsType())) {
				Collection whereUsed = FlexSpecQuery.componentWhereUsed(lcsMeasurements.getMaster());

				Iterator iterWhereUsed = whereUsed.iterator();
				FlexObject flexObj = null;
				while (iterWhereUsed.hasNext()) {
					flexObj = (FlexObject) iterWhereUsed.next();
					JSONObject associatedSpecJSON = new JSONObject();
/*
					if (FormatHelper.hasContent(flexObj.getString("FLEXSPECTOCOMPONENTLINK.COMPONENTPARENTID"))) {
						String parentId = flexObj.getString("FLEXSPECTOCOMPONENTLINK.COMPONENTPARENTID");
						associatedSpecJSON.put("parentOid", parentId);
					}
*/
					if (FormatHelper.hasContent(flexObj.getString("LCSPRODUCT.BRANCHIDITERATIONINFO"))) {
						String productDefNo = "VR:com.lcs.wc.product.LCSProduct:"
								+ flexObj.get("LCSPRODUCT.BRANCHIDITERATIONINFO");
						associatedSpecJSON.put("productOid", productDefNo);
					}

					if (FormatHelper.hasContent(flexObj.getString("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO"))) {
						String sourceDefNo = "VR:com.lcs.wc.sourcing.LCSSourcingConfig:"
								+ flexObj.get("LCSSOURCINGCONFIG.BRANCHIDITERATIONINFO");
						associatedSpecJSON.put("sourceOid", sourceDefNo);
					}

					if (FormatHelper
							.hasContent(flexObj.getString("LATESTITERFLEXSPECIFICATION.BRANCHIDITERATIONINFO"))) {
						String specDefNo = "VR:com.lcs.wc.specification.FlexSpecification:"
								+ flexObj.get("LATESTITERFLEXSPECIFICATION.BRANCHIDITERATIONINFO");
						associatedSpecJSON.put("specOid", specDefNo);
					}

					if (FormatHelper.hasContent(flexObj.getString("SPECTOLATESTITERSEASON.SEASONBRANCHID"))) {
						String seasonDefNo = "VR:com.lcs.wc.season.LCSSeason:"
								+ flexObj.get("SPECTOLATESTITERSEASON.SEASONBRANCHID");
						associatedSpecJSON.put("seasonOid", seasonDefNo);
					}
					
					associatedSpecArray.add(associatedSpecJSON);

				}
				jSONObject.put("Specss", associatedSpecArray);

			}
		} catch (WTException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		///
		return associatedSpecArray;
	}   
    
}