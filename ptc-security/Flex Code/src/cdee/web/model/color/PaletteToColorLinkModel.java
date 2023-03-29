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
import com.lcs.wc.color.LCSPaletteToColorLink;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import wt.util.WTException;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;

import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import com.lcs.wc.color.LCSPaletteToColorLinkClientModel;
import com.lcs.wc.color.LCSPaletteClientModel;
import com.lcs.wc.color.LCSColor;
import com.lcs.wc.color.LCSPalette;
import com.lcs.wc.util.MOAHelper;
import com.lcs.wc.color.LCSPaletteQuery;

public class PaletteToColorLinkModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(PaletteToColorLinkModel.class.getName());
    //private static final String CLASSNAME = PaletteToColorLinkModel.class.getName();

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
    public String updatePaletteColor(Map paletteColorLinkScopeAttrs, String paletteColorOid) throws WTException {

        //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "*****update PaletteColor  initialized ***** "+ paletteColorOid));
        String oid = "";
        LCSPaletteToColorLinkClientModel paletteColorLinkModel = new LCSPaletteToColorLinkClientModel();
        try {
            paletteColorLinkModel.load(paletteColorOid);
            AttributeValueSetter.setAllAttributes(paletteColorLinkModel, paletteColorLinkScopeAttrs);
            paletteColorLinkModel.save();
            oid = FormatHelper.getObjectId(paletteColorLinkModel.getBusinessObject());
        } catch (Exception ex) {
            //oid = "Exception:" + msupplieroid;
        }
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

    public JSONObject createPaletteColor(String type, JSONObject paletteColorJsonObject) throws Exception  {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteColor  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSPaletteClientModel paletteModel = new LCSPaletteClientModel();
        try {
          
            String colorOid = (String) paletteColorJsonObject.get("colorOid");
            String paletteOid = (String) paletteColorJsonObject.get("paletteOid");
            //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** createPaletteColor paletteOidd"+paletteOid +"colorOid.."+colorOid));
            LCSColor color = (LCSColor) LCSQuery.findObjectById(colorOid);
            LCSPalette palette = (LCSPalette) LCSQuery.findObjectById(paletteOid);
            Collection<String> ids = MOAHelper.getMOACollection(colorOid);
            
            paletteModel.load(paletteOid); 
            paletteModel.addColors(ids, paletteOid);

            LCSPaletteToColorLink parentColorLink = (LCSPaletteToColorLink)LCSPaletteQuery.findPaletteToColorLinkDataForPaletteAndColor(palette, color).iterator().next();
            
            String palletColorOid = FormatHelper.getObjectId(parentColorLink);            
            String palletColorLinkid = updatePaletteColor(util.getAttributesFromScope("SKU-PALETTE_COLOR_SCOPE", paletteColorJsonObject), palletColorOid);
            responseObject = util.getInsertResponse(palletColorLinkid, type, responseObject);

        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
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

    public JSONObject saveOrUpdate(String type, String oid, JSONObject skuSeasonJSONData,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling createPaletteColor *****")); 
                responseObject = createPaletteColor(type, payloadJson);

            } else {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate before calling updatePaletteColor *****")); 
               String paleteColorOid = updatePaletteColor(util.getAttributesFromScope("SKU-PALETTE_COLOR_SCOPE", payloadJson), oid);
               responseObject = util.getUpdateResponse(paleteColorOid, type, responseObject);
               
               
            }
        } catch (Exception e) {
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.color.LCSPaletteToColorLink");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get Flex schema ***** "));
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
                        if (attribute.getAttScope().equals("PALETTE_COLOR_SCOPE")) {
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
        return "OR:com.lcs.wc.color.LCSPaletteToColorLink:" + (String) flexObject.getString("LCSPALETTETOCOLORLINK.IDA2A2");
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
        LCSPaletteToColorLink lcsPaletteToColorLinkInput = (LCSPaletteToColorLink) LCSQuery.findObjectById(oid);
        LCSPaletteToColorLink lcsPaletteToColorLink = lcsPaletteToColorLinkInput;
        try{
            lcsPaletteToColorLink = (LCSPaletteToColorLink) VersionHelper.latestIterationOf(lcsPaletteToColorLinkInput);
        }catch(Exception e){

        }
        LCSColor color = lcsPaletteToColorLink.getColor();
        String colorOid = FormatHelper.getObjectId(color);
        LCSPalette palette = null;
        palette = lcsPaletteToColorLink.getPalette();
        String palleteOid = FormatHelper.getObjectId(palette);
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsPaletteToColorLink.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsPaletteToColorLink.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsPaletteToColorLink.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("image", null);
        jSONObject.put("colorOid", colorOid);
        jSONObject.put("paletteOid", palleteOid);
        //jSONObject.put("vid", FormatHelper.getVersionId(lcsPaletteToColorLink).toString());
        jSONObject.put("oid",FormatHelper.getObjectId(lcsPaletteToColorLink).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsPaletteToColorLink).toString());
        jSONObject.put("typeHierarchyName", lcsPaletteToColorLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsPaletteToColorLink));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsPaletteToColorLink.getFlexType().getAllAttributes();
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsPaletteToColorLink.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsPaletteToColorLink.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsPaletteToColorLink.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsPaletteToColorLink.getFlexType()));    
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
            jSONObject.put("Color", findColor(oid));
        }  else if (association.equalsIgnoreCase("Palette")) {
            jSONObject.put("Palette", findPalette(oid));
        } 
        return jSONObject;
    }

     /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    public JSONArray findColor(String paletteColorOid) {
        JSONArray colorObjectArray = new JSONArray();
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find colors associated with palletColorLinkid id  ***** "+paletteColorOid));
        ColorModel colorModel = new ColorModel();
        JSONObject colorObject = new JSONObject();
        try {
            LCSPaletteToColorLink lcsPaletteToColorLinkInput = (LCSPaletteToColorLink) LCSQuery.findObjectById(paletteColorOid);
            LCSColor color = lcsPaletteToColorLinkInput.getColor();
            String colorOid = FormatHelper.getObjectId(color);
            colorObject = colorModel.getRecordByOid("Color", colorOid);
                
           
        } catch (Exception e) {
            colorObject.put("error",util.getExceptionJson(e.getMessage()));
        }
        colorObjectArray.add(colorObject);
        return colorObjectArray;
    }

     /**
     * This method is used to get the Color records of given paletteOid .
     * @param String paletteOid
     * @return JSONArray  it returns the palette associated Color records in the form of array
     */
    public JSONArray findPalette(String paletteColorOid) {
        JSONArray palletObjectArray = new JSONArray();
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find palette associated with palletColorLinkid id  ***** "+paletteColorOid));
        PaletteModel paletteModel = new PaletteModel();
        JSONObject palleteObject = new JSONObject();
        try {
            LCSPaletteToColorLink lcsPaletteToColorLinkInput = (LCSPaletteToColorLink) LCSQuery.findObjectById(paletteColorOid);

            LCSPalette palette = null;
            palette = lcsPaletteToColorLinkInput.getPalette();
            String palleteOid = FormatHelper.getObjectId(palette);
            
            palleteObject = paletteModel.getRecordByOid("Palette", palleteOid);
        } catch (Exception e) {
            palleteObject.put("error",util.getExceptionJson(e.getMessage()));
        }
        palletObjectArray.add(palleteObject);
        return palletObjectArray;
    }

}