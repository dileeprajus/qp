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
package cdee.web.model.material;

import com.lcs.wc.material.LCSMaterial;
import cdee.web.model.bom.BOMLinkModel;
import cdee.web.model.bom.BOMModel;
import cdee.web.model.document.DocumentModel;
import cdee.web.model.supplier.SupplierModel;
import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import cdee.web.util.DataConversionUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.db.PreparedQueryStatement;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.document.LCSDocumentQuery;
import com.lcs.wc.flexbom.FlexBOMLink;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.flexbom.LCSFlexBOMQuery;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.material.LCSMaterialClientModel;
import com.lcs.wc.material.LCSMaterialLogic;
import com.lcs.wc.material.LCSMaterialQuery;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.material.LCSMaterialSupplierQuery;
import com.lcs.wc.material.LCSMaterialSupplierClientModel;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import com.lcs.wc.util.MOAHelper;
import wt.enterprise.RevisionControlled;
import cdee.web.model.color.PaletteModel;
import com.lcs.wc.color.LCSPalette;
import com.lcs.wc.material.LCSMaterialColor;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import java.io.FileOutputStream;
import com.lcs.wc.util.DeleteFileHelper;
import wt.vc.wip.Workable;
import wt.vc.Mastered;
import wt.fc.WTObject;
import wt.vc.wip.WorkInProgressHelper;
import com.lcs.wc.flexbom.BOMOwner;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class MaterialModel extends GenericObjectService{
    //private static final Logger LOGGER = LogR.getLogger(MaterialModel.class.getName());
    //private static final String CLASSNAME = MaterialModel.class.getName();
    AppUtil util = new AppUtil();


      

    /**
      * This method is used to update the Material flex object that are  passed by using OID as reference.
      * @param oid   oid of an item(type) to update
      * @param type
      * @param attrsJsonObject Contains Material data
      * @exception Exception
      * @return JSONObject  It returns Material JSONObject object
      */
        
    public JSONObject updateMaterial(String oid,String type, JSONObject attrsJsonObject) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update material initialized with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSMaterialClientModel materialModel = new LCSMaterialClientModel();
        try{
            materialModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(attrsJsonObject,type,FormatHelper.getObjectId(materialModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(materialModel, convertedAttrs);
            /*Set thumnail to ProductObject*/
            String thumbnailOld = materialModel.getPrimaryImageURL();
            if(attrsJsonObject.containsKey("partPrimaryImageURL")){
                 materialModel.setPrimaryImageURL((String)attrsJsonObject.get("partPrimaryImageURL"));
            }
            if(attrsJsonObject.containsKey("base64File") && attrsJsonObject.containsKey("base64FileName") && attrsJsonObject.containsKey("imageKey") ){
            materialModel = imageAssignment (materialModel,attrsJsonObject);   
           
            }
                   
            /*End*/
            materialModel.save();
            responseObject=util.getUpdateResponse(FormatHelper.getVersionId(materialModel.getBusinessObject()).toString(),type,responseObject);
        }catch(Exception e){
            materialModel.save();
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }    



    /**
      * This method is used to insert the material flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a material flextype at a time.
      * @param type is a string 
      * @param materialJson
      * @exception Exception
      * @return JSONObject  It returns Material JSONObject object
      */  
    public JSONObject createMaterials(String type, JSONObject materialJson){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create materials initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSMaterialClientModel materialClientModel = new LCSMaterialClientModel();
        try{
          //for testing
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(materialJson,type,(String)materialJson.get("typeId"));
            AttributeValueSetter.setAllAttributes(materialClientModel,convertedAttrs);
            
            if(materialJson.containsKey("base64File") && materialJson.containsKey("base64FileName") && materialJson.containsKey("imageKey") )
            materialClientModel = imageAssignment (materialClientModel,materialJson);
        
            materialClientModel.save();
            String materialoid = FormatHelper.getVersionId(materialClientModel.getBusinessObject());
            responseObject=util.getInsertResponse(FormatHelper.getVersionId(materialClientModel.getBusinessObject()).toString(),type,responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }   

    /**
      * This method is used either insert or update the Material flex object that are  passed by using type as reference,
      * oid and array of different Materials data 
      * Using this method we can insert/update several records of a material flextype at a time.
      * @param type String 
      * @param oid String
      * @param materialJsonData  Contains object of materials data
      * @exception Exception
      * @return JSONObject  It returns material JSONObject object
      */
    public JSONObject saveOrUpdate(String type,String oid, JSONObject materialJsonData,JSONObject payloadJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"-----oid------"+ oid)); 
        JSONObject responseObject = new JSONObject();
        try{
            if(oid == null){
                ArrayList list = util.getOidFromSeachCriteria(type,materialJsonData,payloadJson);
                if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    responseObject=updateMaterial(list.get(2).toString(),type,payloadJson);
                }else{
                    responseObject=createMaterials(type, payloadJson);
                }
            }else {
                responseObject=updateMaterial(oid,type,payloadJson);
            }
        }catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

     /**
    * This method is used delete Material of given oid,
    * @param materialOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String materialOid)throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+materialOid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSFlexBOMQuery lCSFlexBOMQuery = new LCSFlexBOMQuery();
        LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
        try{
            Collection lcsMaterialSuppliers = new LCSMaterialSupplierQuery().findMaterialSuppliers(lcsMaterial).getResults();
            Iterator matSuppItr = lcsMaterialSuppliers.iterator();
            MaterialSupplierModel matSupplierModel=new MaterialSupplierModel();
            while(matSuppItr.hasNext()) {
              FlexObject matSuppFlexObj = (FlexObject) matSuppItr.next();
              String matSupplierOid  = matSupplierModel.getOid(matSuppFlexObj);
              matSupplierModel.delete(matSupplierOid);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        try{
          Collection response = lCSFlexBOMQuery.findBOMPartsForOwner(lcsMaterial);
          Iterator itr = response.iterator();
          while(itr.hasNext()) {
            FlexBOMPart  flexBOMPart = (FlexBOMPart)itr.next();
            String flexBOMPartOid = FormatHelper.getObjectId(flexBOMPart);
            BOMModel bomModel=new BOMModel();
            bomModel.delete(flexBOMPartOid);
          }
        }catch(Exception e){
            e.printStackTrace();
        }
        LCSMaterialLogic materialLogic = new LCSMaterialLogic();
        materialLogic.deleteMaterial(lcsMaterial, false);
        responseObject=util.getDeleteResponseObject("Material",materialOid,responseObject);
      }catch(WTException wte){
        responseObject=util.getExceptionJson(wte.getMessage());
      }
      return responseObject;
    }

   

    /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.material.LCSMaterial"); 
    } 

   /**
   * This method is used to get the schema for the given typeId of this flex object .
   * @param String  type
   * @param String typeId
   * @Exception exception
   * @return JSONObject  it returns the schema for the given typeId of this flex object .
   */

    public JSONObject getFlexSchema(String type,String typeId) throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** GetFlexSchema initialized with type ***** "+type));
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
                    if(attribute.getAttScope().equals("MATERIAL")){
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
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSMaterialQuery().findMaterialsByCriteria(criteriaMap,flexType,null,null,null);
        return util.getResponseFromResults(results,objectType);
    }

  /**
    * This method is used to search the object by name
    * @param Map  criteria
    * @param FlexType flexType
    * @param String name
    * @Exception exception
    * @return String  it returns the oid of the object if exists with given name .
    */
    public String searchByName(Map criteria,FlexType flexType,String name) throws Exception{
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with search by name ***** "+ name));
        LCSMaterialQuery lcsMaterialQuery=new LCSMaterialQuery();
        Collection<FlexObject> response = lcsMaterialQuery.findMaterialsByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSMATERIAL.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.material.LCSMaterial:"+oid;
        if(response.size() == 0){
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
        return "VR:com.lcs.wc.material.LCSMaterial:"+(String)flexObject.getString("LCSMATERIAL.BRANCHIDITERATIONINFO");
    } 

    /**
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return JSONObject  it returns the records that matched the given oid of this flex object
    */ 
    public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSMaterial lcsMaterialInput = (LCSMaterial) LCSQuery.findObjectById(oid);
        LCSMaterial lcsMaterial = lcsMaterialInput;
        try{
            lcsMaterial = (LCSMaterial)VersionHelper.latestIterationOf(lcsMaterialInput);
        }catch(Exception e){
            
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsMaterial.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsMaterial.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",lcsMaterial.getPrimaryImageURL());
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsMaterial.getFlexType()));
        jSONObject.put("flexName",objectType);Object o = LCSQuery.findObjectById(oid);
        Object latest = VersionHelper.latestIterationOf((Mastered)((RevisionControlled) o).getMaster());
        String latestOid = FormatHelper.getObjectId((WTObject) latest);
        String latestVid = FormatHelper.getVersionId((RevisionControlled) latest);

        if (WorkInProgressHelper.isWorkingCopy((Workable) latest) ) {
            latestOid = FormatHelper.getObjectId((WTObject) VersionHelper.getOriginalCopy((Workable) latest));
            latestVid = FormatHelper.getVersionId((RevisionControlled) VersionHelper.getOriginalCopy((Workable) latest));
        }
        jSONObject.put("oid",latestVid);
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsMaterial).toString());
       
        jSONObject.put("typeHierarchyName",lcsMaterial.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsMaterial));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsMaterial));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsMaterial.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while(it.hasNext()){
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try{
                if(lcsMaterial.getValue(attKey) == null){
                  jSONObject.put(attKey,"");
                }
                else{
                  jSONObject.put(attKey,lcsMaterial.getValue(attKey));
                }
            }catch(Exception e){               
            }
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
     //   datConUtil.getSystemData(lcsMaterial,util.getVR(lcsMaterial));
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMaterial.getFlexType()));
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if(association.equalsIgnoreCase("Material Supplier")){
          jSONObject.put("Material Supplier",findMaterialSuppliers(oid));
        }else if(association.equalsIgnoreCase("BOM")){
          jSONObject.put("BOM",findBOMs(oid));
        }else if(association.equalsIgnoreCase("Image Page")){
          jSONObject.put("Image Page",findImagePages(oid));
        }else if(association.equalsIgnoreCase("Reference Document")){
          jSONObject.put("Reference Document",findReferenceDocs(oid));
        }else if(association.equalsIgnoreCase("Palette")){
          jSONObject.put("Palette",findPalettes(oid));
        }else if(association.equalsIgnoreCase("Material Color")){
          jSONObject.put("Material Color",findMaterialColors(oid));
        }
        return jSONObject;
    }

     /**
     * This method is used to get the Material Supplier records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the material Supplier records associated with Material   in the form of array
     */
    public JSONArray findMaterialSuppliers(String materialOid) throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material supplier associated with  materialOid  ***** "+materialOid));
        MaterialSupplierModel materialSupplierModel = new MaterialSupplierModel();
        JSONArray materialSupplierArray = new JSONArray();
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            SearchResults searchResults = new LCSMaterialSupplierQuery().findMaterialSuppliers(lcsMaterial);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();        
            while(itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialSupplierOid  = materialSupplierModel.getOid(flexObject);
                JSONObject supplierObject = materialSupplierModel.getRecordByOid("Material Supplier",materialSupplierOid);
                materialSupplierArray.add(supplierObject);
            }
        }catch(Exception e){
            materialSupplierArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialSupplierArray;
    }

    
     /**
     * This method is used to get the BOM records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the BOM records associated with Material   in the form of array
     */
    public JSONArray findBOMs(String materialOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find BOM  associated with  materialOid  ***** "+materialOid));
        BOMModel bomModel = new BOMModel();
        JSONArray flexBOMPartArray = new JSONArray();
        FlexBOMPart bomPart = null;
        JSONObject flexBOMPartObject = new JSONObject();   
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            PreparedQueryStatement filteredQueryStatement = LCSFlexBOMQuery.findBOMPartsForOwnerQuery((BOMOwner)lcsMaterial.getMaster(), "A", "MAIN", null, null, false, null);
            SearchResults accessOnlyResults = LCSQuery.runDirectQuery(filteredQueryStatement);
            int accessOnlyResultsCount = accessOnlyResults.getResultsFound();
            if (accessOnlyResultsCount>0) { 
                 Collection bomList = new ArrayList();
                 bomList = LCSQuery.getObjectsFromResults(accessOnlyResults, "VR:com.lcs.wc.flexbom.FlexBOMPart:", "FLEXBOMPART.BRANCHIDITERATIONINFO");
                 bomPart = (FlexBOMPart) bomList.iterator().next();
                 String flexBOMPartOid = FormatHelper.getObjectId(bomPart);
                 flexBOMPartObject = bomModel.getRecordByOid("BOM", flexBOMPartOid);
                 flexBOMPartArray.add(flexBOMPartObject);
            }
        }catch(Exception e){
            flexBOMPartArray.add(util.getExceptionJson(e.getMessage())); 
        }
        return flexBOMPartArray;
    }

     /**
     * This method is used to get the ImagePages records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the ImagePages records associated with Material   in the form of array
     */
    public JSONArray findImagePages(String materialOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find Image pages associated with  materialOid  ***** "+materialOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentArray = new JSONArray();
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            Collection response = new LCSMaterialQuery().getMaterialImages(lcsMaterial);
            Iterator itr = response.iterator();
            while (itr.hasNext()){
                LCSDocument lcsDocument = (LCSDocument)itr.next();
                String documentOid = FormatHelper.getObjectId(lcsDocument);
                JSONObject documentObject = documentModel.getRecordByOid("Document",documentOid);
                documentArray.add(documentObject);
            }
        }catch(Exception e){
            documentArray.add(util.getExceptionJson(e.getMessage()));
        }
        return documentArray;
    }

    /**
     * This method is used to get the Reference Docs records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the  associated Reference Documents records in the form of array
     */
    public JSONArray findReferenceDocs(String materialOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find Reference documents associated with  materialOid  ***** "+materialOid));
        DocumentModel documentModel = new DocumentModel();
        JSONArray documentArray = new JSONArray();
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            Collection response = new LCSDocumentQuery().findPartDocReferences(lcsMaterial);
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

    /**
     * This method is used to get the Palette records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the  associated Palette records in the form of array
     */

    public JSONArray findPalettes(String materialOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find pallets associated with  materialOid  ***** "+materialOid));
        PaletteModel paletteModel = new PaletteModel();
        JSONArray paletteArray = new JSONArray();
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            Collection response = new LCSMaterialQuery().findPalettesForMaterial(lcsMaterial);
            Iterator itr = response.iterator();
            while (itr.hasNext()){
                LCSPalette lcsPalette = (LCSPalette)itr.next();
                String paletteOid =  FormatHelper.getObjectId(lcsPalette);
                JSONObject paletteObject = paletteModel.getRecordByOid("Palette",paletteOid);
                paletteArray.add(paletteObject);
            }
        }catch(Exception e){
            paletteArray.add(util.getExceptionJson(e.getMessage()));
        }
        return paletteArray;
    }

    /**
     * This method is used to get the Material Color records of given mayerialOid .
     * @param String materialOid
     * @return JSONArray  it returns the  associated Material Color records in the form of array
     */

    public JSONArray findMaterialColors(String materialOid){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material color associated with  materialOid  ***** "+materialOid));
        MaterialColorModel materialColorModel = new MaterialColorModel();
        JSONArray materialColorArray = new JSONArray();
        try{
            LCSMaterial lcsMaterial = (LCSMaterial) LCSQuery.findObjectById(materialOid);
            SearchResults searchResults = new LCSMaterialQuery().findMaterialColorData(lcsMaterial);
            Collection response = searchResults.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()){
                FlexObject flexObject = (FlexObject)itr.next();
                String materialColorOid = materialColorModel.getOid(flexObject);
                JSONObject materialColorObject = materialColorModel.getRecordByOid("Material Color",materialColorOid);
                materialColorArray.add(materialColorObject);
            }
        }catch(Exception e){
            materialColorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialColorArray;
    }

    public LCSMaterialClientModel imageAssignment(LCSMaterialClientModel materialModel, JSONObject attrsJsonObject)throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Image asignment initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
            materialModel.setPrimaryImageURL(util.setImage(fileName, thumbnail));
            }
            else {
                   materialModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
            
        return materialModel;
    }
}
