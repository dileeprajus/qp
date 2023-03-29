/*
 * Created on 06/09/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.color;

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
import com.lcs.wc.color.LCSPaletteQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.color.LCSPalette;
import com.lcs.wc.color.LCSPaletteClientModel;
import cdee.web.model.color.PaletteMaterialLinkModel;
import cdee.web.model.color.PaletteToColorLinkModel;
import cdee.web.model.color.ColorModel;
import com.lcs.wc.util.MOAHelper;
import cdee.web.model.material.MaterialColorModel;
import cdee.web.model.material.MaterialSupplierModel;
import cdee.web.model.season.SeasonModel;
import com.lcs.wc.season.LCSSeason;
import wt.util.WTException;
import com.lcs.wc.color.LCSPaletteLogic;
import cdee.web.model.material.MaterialModel;
import com.lcs.wc.material.LCSMaterialColorQuery;
import com.lcs.wc.material.LCSMaterial;
import com.lcs.wc.material.LCSMaterialQuery;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.model.color.PaletteToColorLinkModel;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SubPaletteModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(PaletteModel.class.getName());
    //private static final String CLASSNAME = PaletteModel.class.getName();

    AppUtil util = new AppUtil();

    /**
     * This method is used to update the Palette flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Palette flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param colorJsonObject  Contains Palette data
     * @exception Exception
     * @return String  It returns OID of Palette object
     */
    public JSONObject updatePalette(String oid, String type, JSONObject paletteJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //{LOGGER.debug((Object) (CLASSNAME + "***** Update initialized with oid ***** "+ oid));
                        //LOGGER.debug((Object) (CLASSNAME + "***** Update Color initialized with type ***** "+ type));}
        JSONObject responseObject = new JSONObject();
        LCSPaletteClientModel paletteModel = new LCSPaletteClientModel();
        try {
            paletteModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(paletteJsonObject,type,FormatHelper.getObjectId(paletteModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(paletteModel, convertedAttrs);
            paletteModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(paletteModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Palette flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Palette flextype at a time.
     * @param type is a string 
     * @param colorDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Palette JSONArray object
     */
    public JSONObject createPalette(String type, JSONObject paletteDataList) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSPaletteClientModel paletteModel = new LCSPaletteClientModel();
        try {
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(paletteDataList,type,(String)paletteDataList.get("typeId"));
            AttributeValueSetter.setAllAttributes(paletteModel,convertedAttrs);
            paletteModel.save();
            String paletteOid = FormatHelper.getObjectId(paletteModel.getBusinessObject()).toString();
            responseObject = util.getInsertResponse(paletteOid, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Palette flex object that are  passed by using type as reference,
     * oid and array of different colors data 
     * Using this method we can insert/update several records of a Palette flextype at a time.
     * @param type String 
     * @param oid String
     * @param payloadJson  Contains of Palette data
     * @exception Exception
     * @return JSONObject  It returns Palette JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject searchJson,JSONObject payloadJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);

                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling updatePalette  *****"));
                    responseObject = updatePalette(list.get(2).toString(), type, payloadJson);
                    String paletteOid = list.get(2).toString();
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling createPalette  *****"));
                    responseObject = createPalette(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling updatePalette with oid  *****"+oid));
                responseObject = updatePalette(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the subpalette flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a subpalette flextype at a time.
     * @param type is a string 
     * @param subpaletteDataList  Contains attributes, typeId, oid(if existing)
     * @return JSONObject  It returns subpalette JSON object
     */
    public JSONObject createSubPalette(JSONObject paletteJson, String parentPaletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Sub Palette with parentPaletteOid ***** "+ parentPaletteOid));
        JSONObject responseObject = new JSONObject();
        LCSPaletteClientModel paletteModel = new LCSPaletteClientModel();
        try {
            String typeId = (String) paletteJson.get("typeId");
            AttributeValueSetter.setAllAttributes(paletteModel, util.getObjectAttributes(typeId, paletteJson));
            paletteModel.setParentPaletteId(parentPaletteOid);
            paletteModel.save();
            String paletteOid = FormatHelper.getObjectId(paletteModel.getBusinessObject()).toString();
            responseObject.put("oid", paletteOid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Palette of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSPalette colorPalatte = (LCSPalette) LCSQuery.findObjectById(oid);
            LCSPaletteLogic orderConfirmationLogic = new LCSPaletteLogic();
            orderConfirmationLogic.deletePalette(colorPalatte);
            responseObject = util.getDeleteResponseObject("Palette", oid, responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.color.LCSPalette");
    }

    /**
     * This method is used to get the schema for the given typeId of this flex object .
     * @param String  type
     * @param String typeId
     * @param JSONObject jsonAsscos
     * @Exception exception
     * @return JSONObject  it returns the schema for the given typeId of this flex object .
     */

    public JSONObject getFlexSchema(String type, String typeId) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized get Flex schema ***** "));
        JSONObject responseObject = new JSONObject();
        try{
            JSONObject jsonAsscos = util.getConfigureJSON();
            JSONObject configObject = (JSONObject) jsonAsscos.get(type);
            if(configObject!=null){
                JSONObject attributesObj = (JSONObject) configObject.get("properties");
                Collection attrsList = new ArrayList();
                Collection totalAttrs = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                  totalAttrs=FlexTypeCache.getFlexType(typeId).getAllAttributes();
                }else{
                  totalAttrs=FlexTypeCache.getFlexTypeRoot(type).getAllAttributes();
                }
                Iterator totalAttrsListItr = totalAttrs.iterator();
                while (totalAttrsListItr.hasNext()) {
                    FlexTypeAttribute attribute = (FlexTypeAttribute) totalAttrsListItr.next();
                    if (attribute.getAttScope().equals("PALETTE_SCOPE")) {
                        attrsList.add(attribute);
                    }
                }
                attributesObj = util.getAttributesData(attrsList, attributesObj);
                responseObject.put("properties", attributesObj);
                responseObject.put("type", "object");
                FlexType treeNodeFlexType = null;
                if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                  treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
                }else{
                  treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
                }
                String typeName = treeNodeFlexType.getFullNameDisplay(true);
                JSONObject basicDetails = new JSONObject();
                basicDetails.put("typeId", typeId);
                basicDetails.put("rootObjectName", type);
                basicDetails.put("typeName", typeName);
                responseObject.put("basicDetails", basicDetails);
                responseObject.put("transformation_kind", (JSONObject) configObject.get("transformation_kind"));
                responseObject.put("associations", (JSONObject) configObject.get("associations"));
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
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSPaletteQuery().findPalettesByCriteria(criteriaMap, flexType, null, null, null);
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
        Collection < FlexObject > response = new LCSPaletteQuery().findPalettesByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSPALETTE.IDA2A2");
        oid = "OR:com.lcs.wc.color.LCSPalette:" + oid;
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
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.color.LCSPalette:" + (String) flexObject.getString("LCSPALETTE.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Record initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSPalette lcsPaletteInput = (LCSPalette) LCSQuery.findObjectById(oid);
        LCSPalette lcsPalette = lcsPaletteInput;
        try{
            lcsPalette = (LCSPalette) VersionHelper.latestIterationOf(lcsPaletteInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsPalette.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsPalette.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsPalette.getFlexType()));
        jSONObject.put("flexName", objectType);
        //jSONObject.put("vid", FormatHelper.getVersionId(lcsPalette).toString());
        jSONObject.put("oid",FormatHelper.getObjectId(lcsPalette).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsPalette).toString());
        jSONObject.put("typeHierarchyName", lcsPalette.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsPalette));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsPalette.getFlexType().getAllAttributes();
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsPalette.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsPalette.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsPalette.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsPalette.getFlexType())); 
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
           //LOGGER.debug((Object) (CLASSNAME + "*****   initialized with get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if (association.equalsIgnoreCase("Color")) {
            jSONObject.put("Color", findColorsLinks(oid,"Color"));
        } else if (association.equalsIgnoreCase("Material Color")) {
            jSONObject.put("Material Color", findMaterialColors(oid));
        } else if (association.equalsIgnoreCase("Material Supplier")) {
            jSONObject.put("Material Supplier", findMaterialSuppliers(oid));
        } else if (association.equalsIgnoreCase("Season")) {
            jSONObject.put("Season", findSeasons(oid));
        } else if (association.equalsIgnoreCase("Sub Palette")) {
            jSONObject.put("Sub Palette", findSubPalettes(oid));
        } else if (association.equalsIgnoreCase("Material")) {
            jSONObject.put("Material", findMaterialLinks(oid,"Material"));
        }else if (association.equalsIgnoreCase("Palette Material Link")) {
            jSONObject.put("Palette Material Link", findMaterialLinks(oid,"PMLink"));
        }else if (association.equalsIgnoreCase("Palette Material Link With Material")) {
            jSONObject.put("Palette Material Link With Material", findMaterialLinks(oid,"Palette Material Link With Material"));
        }else if (association.equalsIgnoreCase("Palette Color Link")) {
            jSONObject.put("Palette Color Link", findColorsLinks(oid,"PCLink"));
        }else if (association.equalsIgnoreCase("Palette Color Link With Color")) {
            jSONObject.put("Palette Color Link With Color", findColorsLinks(oid,"Palette Color Link With Color"));
        }
        return jSONObject;
    }

    /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    /*public JSONArray findColors(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find colors associated with pallet id  ***** "+paletteOid));
        ColorModel colorModel = new ColorModel();
        JSONArray colorArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findColorsForPalette(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String colorOid = colorModel.getOid(flexObject);
                JSONObject colorObject = colorModel.getRecordByOid("Color", colorOid);
                colorArray.add(colorObject);
            }
        } catch (Exception e) {
            colorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return colorArray;
    }*/
     public JSONArray findColorsLinks(String paletteOid, String object) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find colors associated with palette id  ***** "+paletteOid));
        
        
        ColorModel colorModel = new ColorModel();
        PaletteToColorLinkModel pcLinkModel = new PaletteToColorLinkModel();
        JSONArray modelArray = new JSONArray();
        JSONObject subObject = new JSONObject();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findColorsForPalette(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                if (object.equalsIgnoreCase("Color")) {
                    modelArray.add(colorModel.getRecordByOid("Color", colorModel.getOid(flexObject)));
                }else if (object.equalsIgnoreCase("PCLink")){
                    modelArray.add(pcLinkModel.getRecordByOid("Palette Color Link", pcLinkModel.getOid(flexObject)));
                }else {
                    subObject = pcLinkModel.getRecordByOid("Palette Color Link", pcLinkModel.getOid(flexObject));
                    subObject.put("Color",colorModel.getRecordByOid("Color", colorModel.getOid(flexObject)) );
                    modelArray.add(subObject);
                }
            }
        } catch (Exception e) {
            modelArray.add(util.getExceptionJson(e.getMessage()));
        }
        return modelArray;
    }
     
     
     public JSONArray findMaterialLinks(String paletteOid, String object) {
         //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** Find materials associated with pallet id  ***** "+paletteOid));
         MaterialModel materialModel = new MaterialModel();
         PaletteMaterialLinkModel pmLinkModel = new PaletteMaterialLinkModel();
		/*
		 * ColorModel colorModel = new ColorModel(); PaletteToColorLinkModel pcLinkModel
		 * = new PaletteToColorLinkModel();
		 */
         JSONArray modelArray = new JSONArray();
         JSONObject subObject = new JSONObject();
         try {
             LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
             SearchResults results = new LCSMaterialQuery().findMaterialInfoByPalette(lcsPalette, new HashMap());
             Collection response = results.getResults();
             Iterator itr = response.iterator();
             while (itr.hasNext()) {
                 FlexObject flexObject = (FlexObject) itr.next();
                 if (object.equalsIgnoreCase("Material")) {
                     modelArray.add(materialModel.getRecordByOid("Material", materialModel.getOid(flexObject)));
                 }else if (object.equalsIgnoreCase("PMLink")){
                     modelArray.add(pmLinkModel.getRecordByOid("Palette Material Link", pmLinkModel.getOid(flexObject)));
                 }else {
                     subObject = pmLinkModel.getRecordByOid("Palette Material Link", pmLinkModel.getOid(flexObject));
                     subObject.put("Material",materialModel.getRecordByOid("Material", materialModel.getOid(flexObject)) );
                     modelArray.add(subObject);
                 }
             }
         } catch (Exception e) {
             modelArray.add(util.getExceptionJson(e.getMessage()));
         }
         
         
         return modelArray;
     }

    /**
     * This method is used to get the Material Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Material Color records in the form of array
     */
    public JSONArray findMaterialColors(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material colors associated with pallet id  ***** "+paletteOid));
        MaterialColorModel materialColorModel = new MaterialColorModel();
        JSONArray materialColorArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findMaterialColorsForPalette(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialColorOid = materialColorModel.getOid(flexObject);
                JSONObject materialColorObject = materialColorModel.getRecordByOid("Material Color", materialColorOid);
                materialColorArray.add(materialColorObject);
            }
        } catch (Exception e) {
            materialColorArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialColorArray;
    }

    /**
     * This method is used to get the Material Supplier records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Material Supplier records in the form of array
     */
    public JSONArray findMaterialSuppliers(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find material supplier associated with pallet id  ***** "+paletteOid));
        MaterialSupplierModel materialSupplierModel = new MaterialSupplierModel();
        JSONArray materialSupplierArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findMaterialSupplierForPalette(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialSupplierOid = materialSupplierModel.getOid(flexObject);
                JSONObject materialSupplierObject = materialSupplierModel.getRecordByOid("Material Supplier", materialSupplierOid);
                materialSupplierArray.add(materialSupplierObject);
            }
        } catch (Exception e) {
            materialSupplierArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialSupplierArray;
    }

    /**
     * This method is used to get the Seasons records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated season records in the form of array
     */
    public JSONArray findSeasons(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find seasons associated with pallet id  ***** "+paletteOid));
        SeasonModel seasonModel = new SeasonModel();
        JSONArray seasonResArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findSeasonsForPalette(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSSeason lcsSeason = (LCSSeason) itr.next();
                String seasonOid = FormatHelper.getObjectId(lcsSeason);
                JSONObject seasonResObject = seasonModel.getRecordByOid("Season", seasonOid);
                seasonResArray.add(seasonResObject);
            }
        } catch (Exception e) {
            seasonResArray.add(util.getExceptionJson(e.getMessage()));
        }
        return seasonResArray;
    }

    /**
     * This method is used to get the subPlatte records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated subpalettes records in the form of array
     */
    public JSONArray findSubPalettes(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find sub pallets associated with pallet id  ***** "+paletteOid));
        SeasonModel seasonModel = new SeasonModel();
        JSONArray paletteArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection response = new LCSPaletteQuery().findSubPalettes(lcsPalette);
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                LCSPalette palette = (LCSPalette) itr.next();
                String subPaletteOid = FormatHelper.getObjectId(palette);
                JSONObject paletteObject = getRecordByOid("Palette", subPaletteOid);
                paletteArray.add(paletteObject);
            }
        } catch (Exception e) {
            paletteArray.add(util.getExceptionJson(e.getMessage()));
        }
        return paletteArray;
    }

    /**
     * This method is used to get the Material records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Material records in the form of array
     */
    public JSONArray findMaterials(String paletteOid) {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find materials associated with pallet id  ***** "+paletteOid));
        MaterialModel materialModel = new MaterialModel();
        JSONArray materialArray = new JSONArray();
        try {
            LCSPalette lcsPalette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            SearchResults results = new LCSMaterialQuery().findMaterialInfoByPalette(lcsPalette, new HashMap());
            Collection response = results.getResults();
            Iterator itr = response.iterator();
            while (itr.hasNext()) {
                FlexObject flexObject = (FlexObject) itr.next();
                String materialOid = materialModel.getOid(flexObject);
                JSONObject materialObject = materialModel.getRecordByOid("Material", materialOid);
                materialArray.add(materialObject);
            }
        } catch (Exception e) {
            materialArray.add(util.getExceptionJson(e.getMessage()));
        }
        return materialArray;
    }

}