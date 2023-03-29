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
package cdee.web.model.construction;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import com.lcs.wc.construction.LCSConstructionQuery;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.construction.LCSConstructionDetailsQuery;
import com.google.gson.Gson;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.construction.LCSConstructionInfo;
import com.lcs.wc.construction.LCSConstructionInfoClientModel;
import wt.util.WTException;
import com.lcs.wc.construction.LCSConstructionLogic;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
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

public class ConstructionInfoModel extends GenericObjectService{
  //private static final Logger LOGGER = LogR.getLogger(ConstructionInfoModel.class.getName());
    //private static final String CLASSNAME = ConstructionInfoModel.class.getName();

	LCSConstructionQuery lcsConstructionQuery = new LCSConstructionQuery();
	LCSConstructionDetailsQuery lcsConstructionDetailQuery = new LCSConstructionDetailsQuery();
 	Gson gson= new Gson();
	AppUtil util = new AppUtil();

  
  /**
      * This method is used to insert the ConstructionInfo flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a ConstructionInfo flextype at a time.
      * @param type is a string 
      * @param constructionInfoDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns ConstructionInfo JSONArray object
      */  

    public JSONObject createConstructionInfo(String type, JSONObject constructionInfoDataList){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create ConstructionInfo initialized ***** "+ type));
      JSONObject responseObject = new JSONObject();
      try{
        LCSConstructionInfoClientModel consInfoModel = new LCSConstructionInfoClientModel();
        DataConversionUtil datConUtil=new DataConversionUtil();
        Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(constructionInfoDataList,type,(String)constructionInfoDataList.get("typeId"));
        convertedAttrs.put("constructionType","TEMPLATE");
        AttributeValueSetter.setAllAttributes(consInfoModel,convertedAttrs);
        
        if(constructionInfoDataList.containsKey("base64File") && constructionInfoDataList.containsKey("base64FileName") && constructionInfoDataList.containsKey("imageKey") )
            consInfoModel = imageAssignment (consInfoModel,constructionInfoDataList);       
        
        /*End*/
        consInfoModel.save();
        responseObject = util.getInsertResponse(FormatHelper.getVersionId(consInfoModel.getBusinessObject()).toString(), type, responseObject);
      } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
      }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
  }  

    /**
      * This method is used to update the ConstructionInfo flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a ConstructionInfo flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param constructionInfoJsonObject  Contains ConstructionInfo data
      * @exception Exception
      * @return String  It returns OID of ConstructionInfo object
      */

    public JSONObject updateConstructionInfo(String oid,String type ,JSONObject constructionInfoJsonObject) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update ConstructionInfo initialized with oid ***** "+ oid));
       JSONObject responseObject = new JSONObject();
       LCSConstructionInfoClientModel consInfoModel = new LCSConstructionInfoClientModel();
       try{
         consInfoModel.load(oid);
         DataConversionUtil datConUtil=new DataConversionUtil();
         Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(constructionInfoJsonObject,type,FormatHelper.getObjectId(consInfoModel.getFlexType()));
         AttributeValueSetter.setAllAttributes(consInfoModel, convertedAttrs);
        
          if(constructionInfoJsonObject.containsKey("base64File") && constructionInfoJsonObject.containsKey("base64FileName") && constructionInfoJsonObject.containsKey("imageKey") )
            consInfoModel = imageAssignment (consInfoModel,constructionInfoJsonObject);       
               
         /*End*/
         consInfoModel.save();
         responseObject = util.getUpdateResponse(FormatHelper.getVersionId(consInfoModel.getBusinessObject()).toString(), type, responseObject);
       }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
       }
       return responseObject;
       }


 public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"----oid------"+ oid)); 
      JSONObject responseObject = new JSONObject();
      try{
          if(oid == null){
              ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
              if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                  responseObject = updateConstructionInfo(list.get(2).toString(),type,payloadJson);
              } else {
                  responseObject = createConstructionInfo(type, payloadJson);
              }
          } else {
            responseObject = updateConstructionInfo(oid,type,payloadJson);
          }
      } catch (Exception e) {
          responseObject = util.getExceptionJson(e.getMessage());
      }
      return responseObject;
    }

    /**
    * This method is used delete Construction Info of given oid,
    * @param oid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String oid)throws Exception{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSConstructionInfo lcsConstructionInfo= (LCSConstructionInfo) LCSQuery.findObjectById(oid);
        LCSConstructionLogic lcsConstructionLogic = new LCSConstructionLogic();
        lcsConstructionLogic.deleteConstructionInfo(lcsConstructionInfo);
        responseObject=util.getDeleteResponseObject("Construction Info",oid,responseObject);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.construction.LCSConstructionInfo"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized by get records ***** "));
        FlexType flexType = null;
        String typeId=(String)criteriaMap.get("typeId");
        if(typeId == null){
            flexType = FlexTypeCache.getFlexTypeRoot("Construction");
        }else{
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSConstructionQuery().findConstructionInfoByCriteria(criteriaMap,flexType,false);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with Search by Name***** "+ name));
    Collection<FlexObject> response = lcsConstructionQuery.findConstructionInfoByCriteria(criteria,flexType,false).getResults();
    String oid = (String) response.iterator().next().get("LCSCONSTRUCTIONINFO.BRANCHIDITERATIONINFO");
    oid = "VR:com.lcs.wc.construction.LCSConstructionInfo:"+oid;
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
      return "VR:com.lcs.wc.construction.LCSConstructionInfo:"+(String)flexObject.getString("LCSCONSTRUCTIONINFO.BRANCHIDITERATIONINFO"); 
	
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSConstructionInfo lcsConstructionInfoInput = (LCSConstructionInfo) LCSQuery.findObjectById(oid);
        LCSConstructionInfo lcsConstructionInfo = lcsConstructionInfoInput;
        try{
            lcsConstructionInfo = (LCSConstructionInfo) VersionHelper.latestIterationOf(lcsConstructionInfoInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsConstructionInfo.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsConstructionInfo.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("oid", util.getVR(lcsConstructionInfo));
        jSONObject.put("image", null);
        //jSONObject.put("oid",oid);
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsConstructionInfo).toString());
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsConstructionInfo.getFlexType()));
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",lcsConstructionInfo.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsConstructionInfo));
        jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsConstructionInfo));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = lcsConstructionInfo.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(lcsConstructionInfo.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,lcsConstructionInfo.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsConstructionInfo.getFlexType()));	
    }

    public LCSConstructionInfoClientModel imageAssignment(LCSConstructionInfoClientModel consInfoModel, JSONObject attrsJsonObject)throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Image assignment initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
           consInfoModel.setPrimaryImageURL((String)attrsJsonObject.get("partPrimaryImageURL"));
          
            }
            else {
                   consInfoModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
            
        return consInfoModel;
    }


    /*public JSONObject findThumbnailData(String oid) {
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
            LCSConstructionInfo lcsConstructionInfoInput = (LCSConstructionInfo) LCSQuery.findObjectById(oid);
            imageThumbnail = lcsConstructionInfoInput.getThumbnailLocation();
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ imageThumbnail));
            if (FormatHelper.hasContent(imageThumbnail)) {
                imageType = imageThumbnail.substring(imageThumbnail.lastIndexOf("/") + 1, imageThumbnail.length());
                imageThumbnail = imageThumbnail.trim();
                String inputImage = lcsConstructionInfoInput.getThumbnailLocation();
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
       
    }*/
}