/*
 * Created on 06/07/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.color;

import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.color.LCSColor;
import com.lcs.wc.color.LCSColorClientModel;
import com.lcs.wc.color.LCSColorLogic;
import com.lcs.wc.color.LCSColorQuery;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.util.AttributeValueSetter;
import com.lcs.wc.util.FormatHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.*;
import java.io.FileInputStream;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.load.LoadCommon;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;




public class ColorModel extends GenericObjectService {

    //private static final Logger LOGGER = LogR.getLogger(ColorModel.class.getName());
    //private static final String CLASSNAME = ColorModel.class.getName();

    AppUtil util = new AppUtil();

    /**
     * This method is used to update the Color flex object that are  passed by using OID as reference.
     * @param oid   oid of an item(type) to update
     * @param type 
     * @param attrsJsonObject Contains of Color data
     * @exception Exception
     * @return JSONObject  It returns OID of Color object
     */
    public JSONObject updateColor(String oid, String type, JSONObject attrsJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Color initialized with oid ***** "+ oid+ " **** type "+type));
        JSONObject responseObject = new JSONObject();
        LCSColorClientModel colorModel = new LCSColorClientModel();
        try {
            colorModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs = datConUtil.convertJSONToFlexTypeFormatUpdate(attrsJsonObject,type,FormatHelper.getObjectId(colorModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(colorModel, convertedAttrs);
            
            if (FormatHelper.hasContent(FormatHelper.format( (String)convertedAttrs.get("redValue")) + FormatHelper.format( (String)convertedAttrs.get("greenValue")) + FormatHelper.format((String)convertedAttrs.get("blueValue")))) {
                String hexValue = colorModel.toHex( (String)convertedAttrs.get("redValue"),  (String)convertedAttrs.get("greenValue"), (String)convertedAttrs.get("blueValue"));
                colorModel.setColorHexidecimalValue(hexValue.toUpperCase());
            }
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Color Checking condition for base64filename,   imageKey in payload***** " ));

            if(attrsJsonObject.containsKey("base64File") && attrsJsonObject.containsKey("base64FileName") && attrsJsonObject.containsKey("imageKey") ){
                colorModel = imageAssignment (colorModel,attrsJsonObject);  
                 }
            colorModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(colorModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Color flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Color flextype at a time.
     * @param type is a string 
     * @param colorDataList  Contains attributes, typeId, oid(if existing)
     * @return JSONObject  It returns Color JSON object
     */
    public JSONObject createColor(String type, JSONObject colorAttrs) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Color  initialized with type***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSColorClientModel colorClientModel = new LCSColorClientModel();
        try {
           // JSONObject colorAttrs = (JSONObject) colorDataList.get(0);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(colorAttrs,type,(String)colorAttrs.get("typeId"));
            AttributeValueSetter.setAllAttributes(colorClientModel,convertedAttrs);
            if (FormatHelper.hasContent(FormatHelper.format( (String)convertedAttrs.get("redValue")) + FormatHelper.format( (String)convertedAttrs.get("greenValue")) + FormatHelper.format((String)convertedAttrs.get("blueValue")))) {
                String hexValue = colorClientModel.toHex( (String)convertedAttrs.get("redValue"),  (String)convertedAttrs.get("greenValue"), (String)convertedAttrs.get("blueValue"));
                colorClientModel.setColorHexidecimalValue(hexValue.toUpperCase());
            }
            //LOGGER.debug((Object) (CLASSNAME + "***** Create Color Checking condition for base64filename,   imageKey in payload***** " ));
            /*Thmbnail Indertion code*/
             if(colorAttrs.containsKey("base64File") && colorAttrs.containsKey("base64FileName") && colorAttrs.containsKey("imageKey") ){
                colorClientModel = imageAssignment (colorClientModel,colorAttrs);  
                 }
            colorClientModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(colorClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Color flex object that are  passed by using type as reference,
     * @param type String 
     * @param oid String
     * @param colorJsonData  Contains of colors data
     * @exception Exception
     * @return JSONObject  It returns Color JSON object
     */
    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling updateColor"));
                    responseObject = updateColor(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling createColor"));
                    responseObject = createColor(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Color before calling updateColor with given oid **** "+oid));
                responseObject = updateColor(oid, type, payloadJson);
            }
        } catch (Exception e) {
            //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate Exception  **** "+e.getMessage()));
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Color of given oid,
     * @param colorOid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String colorOid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with colorOid ***** "+colorOid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSColorLogic colorLogic = new LCSColorLogic();
            LCSColor lcsColor = (LCSColor) LCSQuery.findObjectById(colorOid);
            colorLogic.deleteColor(lcsColor);
            responseObject = util.getDeleteResponseObject("Color", colorOid, responseObject);
        } catch (WTException wte) {
            //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** delete Color with Exception ***** "+wte));
            
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.color.LCSColor");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized get records***objectType** "+objectType +"**** criteriaMap"+criteriaMap));
       
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSColorQuery().findColorsByCriteria(criteriaMap, flexType, null, null, null);
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
          //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name with criteria ***** "+criteria));
        LCSColorQuery lcsColorQuery = new LCSColorQuery();
        Collection < FlexObject > response = lcsColorQuery.findColorsByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSCOLOR.IDA2A2");
        oid = "OR:com.lcs.wc.color.LCSColor:" + oid;
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
        return "OR:com.lcs.wc.color.LCSColor:" + (String) flexObject.getString("LCSCOLOR.IDA2A2");
    }

    
    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return JSONObject  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSColor lcsColorInput = (LCSColor) LCSQuery.findObjectById(oid);
        LCSColor lcsColor = lcsColorInput;
        try{
            lcsColor = (LCSColor) VersionHelper.latestIterationOf(lcsColorInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsColor.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsColor.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", lcsColor.getThumbnail());
        String imageURL=lcsColor.getThumbnail();
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsColor).toString());
        jSONObject.put("oid",FormatHelper.getObjectId(lcsColor).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsColor).toString());
        //jSONObject.put("created By", "createdBy");
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsColor.getFlexType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsColor.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsColor));
        try {
            String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
            jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
            String hexColor = lcsColor.getColorHexidecimalValue();
            LCSColorLogic logic = new LCSColorLogic();
            jSONObject.put("redValue", logic.toDex(hexColor.substring(0, 2)));
            jSONObject.put("greenValue", logic.toDex(hexColor.substring(2, 4)));
            jSONObject.put("blueValue", logic.toDex(hexColor.substring(4, 6)));
            jSONObject.put("colorHexValue", "#" + hexColor);
            jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsColor));
        } catch (Exception e) {}
        Collection attributes = lcsColor.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsColor.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsColor.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsColor.getFlexType()));
    }

    public LCSColorClientModel imageAssignment(LCSColorClientModel colorModel, JSONObject attrsJsonObject)throws Exception{
  //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Image Assignment initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
            colorModel.setThumbnail(util.setImage(fileName, thumbnail));
            }
            else {       
                 colorModel.setValue(imageKey, util.setImage(fileName, thumbnail));
                }
            
        return colorModel;
    }

    public JSONObject findThumbnailData(String oid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findThumbnails ***** "+ oid));
        JSONObject jsonObj = new JSONObject();
        Collection attributes = null;
        FlexTypeAttribute att = null;
        String attKey = "";
        String imageThumbnail = "";
        String imageString = "";
        JSONArray thumbArray = new JSONArray();
        String value = FileLocation.imageLocation + FileLocation.fileSeperator;
        String imageType = "jpg";
       
        try {
            LCSColor lcsColorInput = (LCSColor) LCSQuery.findObjectById(oid);
            imageThumbnail = lcsColorInput.getThumbnail();
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ imageThumbnail));
            if (FormatHelper.hasContent(imageThumbnail)) {
                imageType = imageThumbnail.substring(imageThumbnail.lastIndexOf("/") + 1, imageThumbnail.length());
                imageThumbnail = imageThumbnail.trim();
                String inputImage = lcsColorInput.getThumbnail();
                String stImage = "/images/";
                int indx = inputImage.lastIndexOf(stImage);
                if (indx > -1) {
                inputImage = inputImage.substring(indx + stImage.length());
                }
                inputImage = com.lcs.wc.util.FileLocation.imageLocation.concat(File.separator).concat(inputImage);
                //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* inputImage findThumbnails ***** "+ inputImage));
                //imageThumbnail = FileLocation.imageLocation.trim() + FileLocation.fileSeperator.trim() + imageThumbnail;
                File f = new File(inputImage);
                FileInputStream fis = new FileInputStream(f);
                byte byteArray[] = new byte[(int) f.length()];
                fis.read(byteArray);
                imageString = Base64.getEncoder().encodeToString(byteArray);
                jsonObj.put("imageEncoded", imageString);
                jsonObj.put("imageFileName", imageType);
               
                //thumbArray.add(jsonObj);
               
            }

        }

        catch(Exception ex) {
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "********* Exception  .." + ex));
        }
        
        return jsonObj;
       
    }

}