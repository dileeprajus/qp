/*
 * Created on 06/28/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.color;

import java.util.Collection;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.color.LCSColorClientModel;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.color.LCSColorQuery;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.color.LCSPaletteMaterialLink;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.material.LCSMaterialMaster;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.color.LCSPaletteMaterialLink;
import com.lcs.wc.color.LCSPaletteClientModel;
import com.lcs.wc.material.LCSMaterialMaster;
import com.lcs.wc.material.LCSMaterialSupplierMaster;
import com.lcs.wc.material.LCSMaterialSupplier;
import com.lcs.wc.color.LCSPalette;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.color.LCSPaletteQuery;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import cdee.web.model.material.MaterialModel;
import cdee.web.model.material.MaterialSupplierModel;
import com.lcs.wc.util.MultiObjectHelper;
import java.util.HashMap;
import com.lcs.wc.color.LCSColorHelper;
import com.lcs.wc.material.LCSMaterialSupplierQuery;
import com.lcs.wc.supplier.LCSSupplierMaster;

public class PaletteMaterialLinkModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(PaletteMaterialLinkModel.class.getName());
    //private static final String CLASSNAME = PaletteMaterialLinkModel.class.getName();

    AppUtil util = new AppUtil();
    Gson gson = new Gson();


    
    /**
     * This method is used to update the Color flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Color flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param colorJsonObject  Contains Color data
     * @exception Exception
     * @return String  It returns OID of Color object
     */
    public String updatePaletteMaterial(Map paletteMaterialLinkScopeAttrs, String paletteMaterialOid) throws WTException {

        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "*****update PaletteColor  initialized ***** "+ paletteMaterialOid));
        String oid = "";
        try{
        String dataString = createPackagedStringfromRequest(paletteMaterialLinkScopeAttrs,paletteMaterialOid);
        HashMap<?,?> results = LCSColorHelper.service.bulkUpdatePaletteData(dataString);
        String failedRows = (String) results.get("failedRows");
        failedRows = FormatHelper.removeCharacter(failedRows, "[");
        failedRows = FormatHelper.removeCharacter(failedRows, "]");

    }catch (Exception ex) {
        //LOGGER.debug((Object) (CLASSNAME + "***** updatePaletteMaterial Exception ***** "+ ex));        
        oid = "Exception:" ;
        }

       
        oid = paletteMaterialOid;
        return oid;
    }

    /**
     * This method is used to insert the Color flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Color flextype at a time.
     * @param type is a string 
     * @param colorDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Color JSONArray object
     */

    public JSONObject createPaletteMaterial(String type, JSONObject paletteMaterialJsonObject) throws Exception  {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteMaterial initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSPaletteClientModel paletteModel = new LCSPaletteClientModel();
        try {
          
            String mSupplierOid = (String) paletteMaterialJsonObject.get("materialSupplierOid");
            String paletteOid = (String) paletteMaterialJsonObject.get("paletteOid");
             //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteMaterial paletteOid ***** "+ paletteOid +"****materialSupplierOid "+mSupplierOid));
            
            LCSMaterialSupplier materialSup = (LCSMaterialSupplier) LCSQuery.findObjectById(mSupplierOid);
            LCSPalette palette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            paletteModel.load(paletteOid); 
            LCSMaterialSupplierMaster materialSupplierMaster = (LCSMaterialSupplierMaster)materialSup.getMaster();
            String mSupplierMasterOid = FormatHelper.getObjectId(materialSupplierMaster);
            Collection<String> ids = MOAHelper.getMOACollection(mSupplierMasterOid);
            paletteModel.addMaterials(ids);
            LCSPaletteMaterialLink paletteMaterialLink = (LCSPaletteMaterialLink)LCSPaletteQuery.findPaletteMaterialLink(palette, materialSupplierMaster);
            String paletteMaterialOid = FormatHelper.getObjectId(paletteMaterialLink);
            //if (LOGGER.isDebugEnabled())            
            //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteMaterial paletteMaterialOid ***** "+ paletteMaterialOid ));
            String paletteMaterialLinkid = updatePaletteMaterial(paletteMaterialJsonObject, paletteMaterialOid);
            //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteMaterial paletteMaterialLinkid ***** "+ paletteMaterialLinkid ));
            responseObject = util.getInsertResponse(paletteMaterialLinkid, type, responseObject);
          
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
        
    }

    /**
     * This method is used either insert or update the Color flex object that are  passed by using type as reference,
     * oid and array of different colors data 
     * Using this method we can insert/update several records of a Color flextype at a time.
     * @param type String 
     * @param oid String
     * @param colorJSONArray  Contains array of colors data
     * @exception Exception
     * @return JSONArray  It returns Color JSONArray object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJSONData,JSONObject payloadJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
       JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling createPaletteMaterial *****")); 
                responseObject = createPaletteMaterial(type, payloadJson);

            } else {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling updatePaletteMaterial *****")); 
              String paletteMaterialOid = updatePaletteMaterial( payloadJson, oid);
               responseObject = util.getUpdateResponse(paletteMaterialOid, type, responseObject);
               JSONObject objectData = getRecordByOid(type, oid);
				if(objectData.containsKey("statusCode"))
				{
					String statusCode =(String) objectData.get("objectData");
					if (statusCode.equalsIgnoreCase("400"))
					{
						responseObject = util.getExceptionJson((String) objectData.get("message"));
					}
				}
               
               
            }
        } catch (Exception e) {
            //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate exception raised *****"+e.getMessage())); 
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.color.LCSPaletteMaterialLink");
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
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized by get Flex schema***** "));
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
                        if (attribute.getAttScope().equals("PALETTE_MATERIAL_SCOPE")) {
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
     * This method is used to get the oid by taking name of the record.
     * @param FlexType  flexType
     * @param Map criteria
     * @param String name
     * @Exception exception
     * @return return oid by taking name of the record of the flex object
     */
    public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
        return null;
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.color.LCSPaletteMaterialLink:" + (String) flexObject.getString("LCSPALETTEMATERIALLINK.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "*****initialized by get Records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSPaletteMaterialLink lcsPaletteMaterialLinkInput = (LCSPaletteMaterialLink) LCSQuery.findObjectById(oid);
        LCSPaletteMaterialLink lcsPaletteMaterialLink = lcsPaletteMaterialLinkInput;
        try{
            lcsPaletteMaterialLink = (LCSPaletteMaterialLink) VersionHelper.latestIterationOf(lcsPaletteMaterialLinkInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsPaletteMaterialLink.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsPaletteMaterialLink.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsPaletteMaterialLink.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("image", null);
        LCSMaterialMaster materialMaster = lcsPaletteMaterialLink.getMaterialMaster();
        LCSMaterial material = (LCSMaterial) VersionHelper.latestIterationOf(materialMaster);
        String materialOid = FormatHelper.getObjectId(material);
        LCSPalette palette = null;
        palette = lcsPaletteMaterialLink.getPalette();
        String palleteOid = FormatHelper.getObjectId(palette);
        jSONObject.put("materialOid", materialOid);
        jSONObject.put("paletteOid", palleteOid);
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsPaletteMaterialLink).toString());
        jSONObject.put("oid",FormatHelper.getObjectId(lcsPaletteMaterialLink).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsPaletteMaterialLink).toString());
        jSONObject.put("typeHierarchyName", lcsPaletteMaterialLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsPaletteMaterialLink));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsPaletteMaterialLink.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsPaletteMaterialLink.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsPaletteMaterialLink.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsPaletteMaterialLink.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsPaletteMaterialLink.getFlexType()));    
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
           //LOGGER.debug((Object) (CLASSNAME + "*****   initialized with get record with association oid ***** "+ oid+"association *** "+association));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Material")) {
            jSONObject.put("Material", findMaterial(oid));
        }  else if (association.equalsIgnoreCase("Palette")) {
            jSONObject.put("Palette", findPalette(oid));
        } else if (association.equalsIgnoreCase("Material Supplier")) {
            jSONObject.put("Material Supplier", findMaterialSupplier(oid));
        } 
        return jSONObject;
    }

    /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    public JSONArray findMaterial(String paletteMaterialOid) {
        JSONArray materialObjectArray = new JSONArray();
        
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findMaterial associated with paletteMaterialOid id  ***** "+paletteMaterialOid));
        MaterialModel materialModel = new MaterialModel();
        JSONObject materialObject = new JSONObject();
        try {
            LCSPaletteMaterialLink lcsPaletteMaterialLinkInput = (LCSPaletteMaterialLink) LCSQuery.findObjectById(paletteMaterialOid);
            LCSMaterialMaster materialMaster = lcsPaletteMaterialLinkInput.getMaterialMaster();
            LCSMaterial material = (LCSMaterial) VersionHelper.latestIterationOf(materialMaster);
            String materialOid = FormatHelper.getObjectId(material);            
            materialObject = materialModel.getRecordByOid("Material", materialOid);
                
           
        } catch (Exception e) {
            materialObject.put("error",util.getExceptionJson(e.getMessage()));
        }
        materialObjectArray.add(materialObject);
        return materialObjectArray;
    }

    /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    public JSONArray findMaterialSupplier(String paletteMaterialOid) {
        JSONArray materialsupObjectArray = new JSONArray();
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findMaterialSupplier associated with paletteMaterialOid id  ***** "+paletteMaterialOid));
        MaterialSupplierModel materialsupModel = new MaterialSupplierModel();
        JSONObject materialsupObject = new JSONObject();
        try {
            LCSPaletteMaterialLink lcsPaletteMaterialLinkInput = (LCSPaletteMaterialLink) LCSQuery.findObjectById(paletteMaterialOid);
            LCSMaterialMaster materialMaster = lcsPaletteMaterialLinkInput.getMaterialMaster();
            

            LCSSupplierMaster supplierMaster = (LCSSupplierMaster) lcsPaletteMaterialLinkInput.getSupplierMaster();

            LCSMaterialSupplier lcsMaterialSupplier = LCSMaterialSupplierQuery.findMaterialSupplier(materialMaster,supplierMaster);
            String materialSupplierOid = FormatHelper.getVersionId(lcsMaterialSupplier);
       
              
            materialsupObject = materialsupModel.getRecordByOid("Material Supplier", materialSupplierOid);
                
           
        } catch (Exception e) {
            materialsupObject.put("error",util.getExceptionJson(e.getMessage()));
        }
        materialsupObjectArray.add(materialsupObject);
        return materialsupObjectArray;
    }

     /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    public JSONArray findPalette(String paletteMaterialOid) {
        JSONArray palletObjectArray = new JSONArray();
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findPalette associated with paletteMaterialOid id  ***** "+paletteMaterialOid));
        PaletteModel paletteModel = new PaletteModel();
        JSONObject palleteObject = new JSONObject();
        try {
            LCSPaletteMaterialLink lcsPaletteMaterialLinkInput = (LCSPaletteMaterialLink) LCSQuery.findObjectById(paletteMaterialOid);

            LCSPalette palette = null;
            palette = lcsPaletteMaterialLinkInput.getPalette();
            String palleteOid = FormatHelper.getObjectId(palette);
            
            palleteObject = paletteModel.getRecordByOid("Palette", palleteOid);
                
        } catch (Exception e) {
            palleteObject.put("error",util.getExceptionJson(e.getMessage()));
        }
        palletObjectArray.add(palleteObject);
        return palletObjectArray;
    }


    public static String createPackagedStringfromRequest(Map map,String oid)
  {

    String dataString ="ID|&^&|LCSPALETTEMATERIALLINK$6217126|-()-|commitmentAmount|&^&|78.0|-()-|rowId|&^&|6232824|-()-|requestLocale|&^&|en_US|-()-||!#!|";

    StringBuffer buffer = new StringBuffer();
    StringBuffer values = new StringBuffer();
    Iterator params = map.keySet().iterator();
    String paramName = "";
    String paramVal = "";
    String id = oid;
    id= id.substring(id.lastIndexOf(":")+1);
    values.append("ID" + "|&^&|" + "LCSPALETTEMATERIALLINK"+"$"+id + "|-()-|");
    while (params.hasNext())
    {
         paramName = (String)params.next();
         paramVal = FormatHelper.format((String)map.get(paramName));
         //paramVal = FormatHelper.format((String)map.get(paramName);
         values.append(paramName + "|&^&|" + paramVal + "|-()-|");

  }
  buffer.append(values.toString() + "rowId|&^&||-()-|requestLocale|&^&|en_US|-()-||!#!|");
  //if (LOGGER.isDebugEnabled()) {
      //LOGGER.debug("buffer.toString():  " + buffer.toString());
  //  }
    return buffer.toString();
}


}