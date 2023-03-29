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
package cdee.web.model.document;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.document.LCSDocumentClientModel;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.document.LCSDocumentQuery;
import com.lcs.wc.flexbom.FlexBOMPart;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.specification.FlexSpecToComponentLink;
import com.lcs.wc.specification.FlexSpecification;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.document.LCSDocument;
import java.util.Vector;
import wt.util.WTException;
import com.lcs.wc.document.LCSDocumentLogic;
import wt.content.ApplicationData;
import wt.content.ContentHelper;
import com.lcs.wc.util.DownloadURLHelper;
import java.net.URLDecoder;
import com.lcs.wc.util.LCSProperties;
import java.net.URL;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.model.specification.SpecificationModel;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class DocumentModel extends GenericObjectService{
     //private static final Logger LOGGER = LogR.getLogger(DocumentModel.class.getName());
    //private static final String CLASSNAME = DocumentModel.class.getName();
    
    AppUtil util = new AppUtil();
    public static final String DEFAULT_ENCODING = LCSProperties.get("com.lcs.wc.util.CharsetFilter.Charset", "UTF-8");

    /**
      * This method is used to update the Document flex object that are  passed by using OID as reference.
      * @param oid   oid of an item(type) to update
      * @param type
      * @param documentJsonObject  Contains Document data
      * @exception Exception
      * @return JSONObject  It returns Document object
      */
    public JSONObject updateDocument(String oid,String type, JSONObject documentJsonObject) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Updating Documentwith oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSDocumentClientModel documentModel = new LCSDocumentClientModel();
        try{
            documentModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(documentJsonObject,type,FormatHelper.getObjectId(documentModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(documentModel, convertedAttrs);
            if(documentJsonObject.containsKey("base64File") && documentJsonObject.containsKey("base64FileName") && documentJsonObject.containsKey("imageKey") )
            documentModel = imageAssignment (documentModel,documentJsonObject);       
            documentModel.save();
            String documentOid = FormatHelper.getVersionId(documentModel.getBusinessObject()).toString();
            responseObject = util.getUpdateResponse(documentOid,type, responseObject);
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }                

    /**
      * This method is used to insert the Document flex object that are  passed by using type as reference.
      * @param type is a string 
      * @param documentDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONObject  It returns Document JSONObject object
      */  
    public JSONObject createDocument(String type, JSONObject documentDataList){
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Document initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSDocumentClientModel documentClientModel = new LCSDocumentClientModel();
        try{
            
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(documentDataList,type,(String)documentDataList.get("typeId"));
            AttributeValueSetter.setAllAttributes(documentClientModel,convertedAttrs);
           if(documentDataList.containsKey("base64File") && documentDataList.containsKey("base64FileName") && documentDataList.containsKey("imageKey") )
            documentClientModel = imageAssignment (documentClientModel,documentDataList); 
            documentClientModel.save();
            String documentOid = FormatHelper.getVersionId(documentClientModel.getBusinessObject()).toString();
            responseObject = util.getInsertResponse(documentOid, type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
      * This method is used either insert or update the Document flex object that are  passed by using type as reference,
      * @param type String 
      * @param oid String
      * @param payloadJson  Contains colors data
      * @exception Exception
      * @return JSONObject  It returns Document JSONObject object
      */
    public JSONObject saveOrUpdate(String type,String oid, JSONObject searchJson, JSONObject payloadJson) throws Exception {
           //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"-----oid-------"+ oid)); 
            JSONObject responseObject = new JSONObject();
            try{
                
                if(oid == null){
                    ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                    if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling updateDocument with criteria ***** "));
                        responseObject = updateDocument(list.get(2).toString(),type,payloadJson);
                    } else {
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling createDocument  ***** "));
                        responseObject = createDocument(type, payloadJson);
                    }
                } else {
                    //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate calling updateDocument with oid  ***** "+oid));
                    responseObject = updateDocument(oid,type,payloadJson);
                }
            } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
            }
            return responseObject;
    }

    /**
    * This method is used delete Document of given oid,
    * @param documentOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
    public JSONObject delete(String documentOid)throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** deleting with document oid ***** "+ documentOid));
      JSONObject responseObject=new JSONObject();
      try{
        LCSDocument lcsDocument = (LCSDocument) LCSQuery.findObjectById(documentOid);
        LCSDocumentLogic documentLogic = new LCSDocumentLogic();
        //documentLogic.deleteDocument(lcsDocument);
        responseObject=util.getDeleteResponseObject("Document",documentOid,responseObject);
      }catch(WTException wte){
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** Exception in delete  ***** "+wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.document.LCSDocument"); 
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
        SearchResults results = new LCSDocumentQuery().findByCriteria(criteriaMap,flexType,null,null,null);
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
           //LOGGER.debug((Object) (CLASSNAME + "**** initialized with search by name ***** "+ name));
        LCSDocumentQuery lcsDocumentQuery = new LCSDocumentQuery();
        Collection<FlexObject> response = lcsDocumentQuery.findByCriteria(criteria,flexType,null,null,null).getResults();
        String oid = (String) response.iterator().next().get("LCSDOCUMENT.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.document.LCSDocument:"+oid;
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
        return "VR:com.lcs.wc.document.LCSDocument:"+(String)flexObject.getString("LCSDOCUMENT.BRANCHIDITERATIONINFO"); 
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
        LCSDocument lcsDocumentInput = (LCSDocument) LCSQuery.findObjectById(oid);
        LCSDocument lcsDocument = lcsDocumentInput;
        try{
            lcsDocument = (LCSDocument) VersionHelper.latestIterationOf(lcsDocumentInput);
        }catch(Exception e){
        }
        Vector<FlexObject> primaryFiles = new Vector<FlexObject>();
        try{
            JSONObject appicationDataObject = new JSONObject();
            lcsDocument = (LCSDocument) ContentHelper.service.getContents(lcsDocument);
            ApplicationData primary = (ApplicationData) ContentHelper.getPrimary(lcsDocument);
            String primaryContent = "";
            FlexObject fo = null;
            String desc, urlString, filesize, updated, name;
            URL url = null;
            URL downloadUrl = null;
            URL preferedUrl = null;
            String authUrl = "";
            if (primary != null) {
                filesize = (new Float(primary.getFileSizeKB())).toString();
                updated = primary.getModifyTimestamp().toString();
                name = primary.getFileName();
                name = URLDecoder.decode(name, DEFAULT_ENCODING);
                primary.setFileName(name);
                desc = primary.getDescription();
                desc = (desc == null) ? "" : desc;
                //url = DownloadURLHelper.getMostPreferedURL(primary,lcsDocument,false);
                //downloadUrl = ContentHelper.getDownloadURL(lcsDocument, primary,false);
                preferedUrl = com.lcs.wc.util.DownloadURLHelper.getMostPreferedURL(primary,lcsDocument,false);
                authUrl =  DownloadURLHelper.getReusableAuthenticatedDownloadURL(primary,lcsDocument); 
                primaryContent = primary.toString();
                fo = new FlexObject();
                appicationDataObject.put("Name", name);
                appicationDataObject.put("appDataOid", FormatHelper.getObjectId(primary));
                //appicationDataObject.put("Url", url+"");
                //appicationDataObject.put("downloadUrl", downloadUrl+"");
                appicationDataObject.put("preferedUrl", preferedUrl+"");
                appicationDataObject.put("authUrl", authUrl+"");
                appicationDataObject.put("FileSize", filesize + "Kb");
                appicationDataObject.put("LastModified", updated);
                appicationDataObject.put("Description", desc);
                //appicationDataObject.put("ObjectReference", primaryContent);
                //appicationDataObject.put("AppId", FormatHelper.getNumericFromOid("OR:" + primaryContent));
                jSONObject.put("Primary Image",appicationDataObject);                
            }
            //Secondary File data
            
            JSONArray secondaryArray = new JSONArray();
            String secondaryContent = "";
           // FlexObject fo = null;
            String secondarydesc, secondaryurlString, secondaryfilesize, secondaryupdated, secondaryname;
            URL secondaryurl = null;
            URL secondarydownloadUrl = null;
            URL secondarypreferedUrl = null;
            String secondaryauthUrl = "";
            Vector appDatas = ContentHelper.getApplicationData(lcsDocument);
            Vector<?> contents = ContentHelper.getContentList(lcsDocument);
            for (int i = 0; i < contents.size(); i++)
            {
            	ApplicationData ad1 = (ApplicationData)appDatas.elementAt(i);
            }
            if (!appDatas.isEmpty()) {
            	 for (int i=0; i < appDatas.size(); i++) {
            		 JSONObject secondaryDataObject = new JSONObject();
            		 ApplicationData ad = (ApplicationData)appDatas.elementAt(i);
            		 
            		 secondaryfilesize = (new Float(ad.getFileSizeKB())).toString();
            		 secondaryupdated = ad.getModifyTimestamp().toString();
                     secondaryname = ad.getFileName();
                     secondaryname = URLDecoder.decode(secondaryname, DEFAULT_ENCODING);
                     //ad.setFileName(name);
                     secondarydesc = ad.getDescription();
                     secondarydesc = (secondarydesc == null) ? "" : secondarydesc;
                     //url = DownloadURLHelper.getMostPreferedURL(primary,lcsDocument,false);
                     //downloadUrl = ContentHelper.getDownloadURL(lcsDocument, primary,false);
                     secondarypreferedUrl = com.lcs.wc.util.DownloadURLHelper.getMostPreferedURL(ad,lcsDocument,false);
                     secondaryauthUrl =  DownloadURLHelper.getReusableAuthenticatedDownloadURL(ad,lcsDocument); 
                     secondaryContent = ad.toString();
                    
                     secondaryDataObject.put("Name", secondaryname);
                     secondaryDataObject.put("appDataOid", FormatHelper.getObjectId(ad));
                    
                     secondaryDataObject.put("preferedUrl", secondarypreferedUrl+"");
                     secondaryDataObject.put("authUrl", secondaryauthUrl+"");
                     secondaryDataObject.put("FileSize", secondaryfilesize + "Kb");
                     secondaryDataObject.put("LastModified", secondaryupdated);
                     secondaryDataObject.put("Description", secondarydesc);
                     secondaryArray.add(secondaryDataObject);
                     
            	 }
            	 jSONObject.put("Secondary Image",secondaryArray); 
            }
            
            //End
            jSONObject.put("createdOn",FormatHelper.applyFormat(lcsDocument.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
            jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsDocument.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
            jSONObject.put("image",null);
            jSONObject.put("oid", util.getVR(lcsDocument));
            //jSONObject.put("oid",FormatHelper.getVersionId(lcsDocument).toString());
            jSONObject.put("typeId",FormatHelper.getObjectId(lcsDocument.getFlexType()));
            jSONObject.put("ORid",FormatHelper.getObjectId(lcsDocument).toString());
            jSONObject.put("flexName",objectType);
            jSONObject.put("typeHierarchyName",lcsDocument.getFlexType().getFullNameDisplay(true));
            jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsDocument));
            jSONObject.put("BranchIdIterationInfo",FormatHelper.getNumericVersionIdFromObject(lcsDocument));
            String typeHierrName=(String)jSONObject.get("typeHierarchyName");
            jSONObject.put("hierarchyName",typeHierrName.substring(typeHierrName.lastIndexOf("\\")+1));
            Collection attributes = lcsDocument.getFlexType().getAllAttributes();
            Iterator it = attributes.iterator();
            while(it.hasNext()){
                FlexTypeAttribute att = (FlexTypeAttribute) it.next();
                String attKey = att.getAttKey();
                if(lcsDocument.getValue(attKey) == null){
                    jSONObject.put(attKey,"");
                }
                else{
                    jSONObject.put(attKey,lcsDocument.getValue(attKey));
                }
                
            }    
        }catch(Exception e){

        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsDocument.getFlexType()));
    }

    public JSONObject getRecordByOid(String objectType,String oid,String association) throws Exception {
          //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        if(association.equalsIgnoreCase("Specification")){
          jSONObject.put("Specification",getSpecification(oid));
        }
        return jSONObject;
    }

    
    public JSONArray getSpecification(String documentOid) throws Exception{
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Association get specification with documentOid***** "+ documentOid));
        SpecificationModel specificationModel = new SpecificationModel();
        LCSDocumentQuery query = new LCSDocumentQuery();
        JSONArray specArray = new JSONArray();
        try{
            LCSDocument lcsDocument = (LCSDocument) LCSQuery.findObjectById(documentOid);
            Collection response = query.getFlexSpecificationsReferencingDocAsReference(lcsDocument.getMaster());
            //getSpecToComponentLinks
            Collection response1 = query.getFlexSpecificationsReferencingDocAsDescribedBy(lcsDocument);
            Collection<?> specLinks = FlexSpecQuery.getObjectsFromResults(FlexSpecQuery.getSpecToComponentLinksForComponent(lcsDocument), 
                	"OR:com.lcs.wc.specification.FlexSpecToComponentLink:", "FLEXSPECTOCOMPONENTLINK.IDA2A2");
            Collection<?> links = FlexSpecQuery.getSpecToComponentLinks(lcsDocument, true);
            FlexSpecToComponentLink link = null;
            Iterator itr = links.iterator();        
            while(itr.hasNext()) {
              link = (FlexSpecToComponentLink)itr.next();
              FlexSpecification specification = (FlexSpecification)VersionHelper.latestIterationOf(link.getSpecificationMaster());
              String specificationOid  = FormatHelper.getObjectId(specification);
              JSONObject specObject = specificationModel.getRecordByOid("Specification",specificationOid);
              specArray.add(specObject);
          }
            
           
                
        }catch(Exception e){
            specArray.add(util.getExceptionJson(e.getMessage()));
        }
        return specArray;
    }    
    
    public LCSDocumentClientModel imageAssignment(LCSDocumentClientModel documentModel, JSONObject attrsJsonObject)throws Exception{
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** image assignment  initialized ***** "));
        String thumbnail = (String) attrsJsonObject.get("base64File");
        String fileName = (String) attrsJsonObject.get("base64FileName");
        String imageKey = (String) attrsJsonObject.get("imageKey");
        if (imageKey.equals("thumbnail")) {
            documentModel.setThumbnailLocation(util.setImage(fileName, thumbnail));
            }
            else {
             documentModel.setValue(imageKey, util.setImage(fileName, thumbnail));
             }
            
        return documentModel;
    }

    public JSONObject findThumbnailData(String docOid) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** findThumbnails ***** "+ docOid));
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
            LCSDocument lcsDocument = (LCSDocument) LCSQuery.findObjectById(docOid);
            imageThumbnail = lcsDocument.getThumbnailLocation();
            //if (LOGGER.isDebugEnabled())
                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ imageThumbnail));
            if (FormatHelper.hasContent(imageThumbnail)) {
                imageType = imageThumbnail.substring(imageThumbnail.lastIndexOf("/") + 1, imageThumbnail.length());
                imageThumbnail = imageThumbnail.trim();
                String inputImage = lcsDocument.getThumbnailLocation();
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