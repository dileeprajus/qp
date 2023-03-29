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
package cdee.web.services.schema;

import java.util.Collection;
import java.util.Map;
import java.util.Vector;
import java.util.Iterator;
import java.util.HashMap;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.flextype.FlexTypeCache;
import wt.util.WTException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.util.FormatHelper;
import com.google.gson.Gson;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.classification.TreeNode;
import cdee.web.model.testSpecification.TestSpecificationModel;
import cdee.web.model.construction.ConstructionModel;
import cdee.web.model.measurements.MeasurementsModel;
import cdee.web.model.sizing.SizingModel;
import java.io.FileReader;
import wt.util.WTProperties;
import java.util.*;
import java.io.*;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.last.*;
import com.lcs.wc.foundation.LCSQuery;
import wt.enterprise.RevisionControlled;
import wt.fc.WTObject;
import java.io.File;
import java.io.FileReader;
import wt.util.WTProperties;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.LCSProductQuery;
import com.lcs.wc.db.SearchResults;
import cdee.web.model.product.ProductModel;
import com.lcs.wc.flextype.*;
import cdee.web.exceptions.*;
import cdee.web.model.material.MaterialSupplierModel;
import com.lcs.wc.util.FileLocation;
import java.util.Base64;
import java.io.File;
import java.io.FileInputStream;
import com.lcs.wc.util.LCSProperties;
import cdee.web.util.TRCCache;
import wt.log4j.LogR;
import wt.util.WTException;
import wt.vc.Iterated;
import wt.vc.VersionControlHelper;
import wt.vc.VersionControlService;
//import org.apache.log4j.Logger;

public class CreateFlexSchemaService {
//private static final Logger LOGGER = LogR.getLogger(CreateFlexSchemaService.class.getName());
//private static final String CLASSNAME = CreateFlexSchemaService.class.getName();

    AppUtil util = new AppUtil();
    Gson gson = new Gson();

    public String getFlexLinks(String parseInputData) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** GetFlexLinks initialized  ***** "));
        JSONObject responseObject = new JSONObject();
        try{
            JSONObject jsonData = getParseJSONObject(parseInputData);
            JSONArray inputArray = (JSONArray) jsonData.get("inputs");
            Iterator itr = inputArray.iterator();
            while (itr.hasNext()) {
                JSONObject jSONObject = (JSONObject) itr.next();
                for (Object o: jSONObject.keySet()) {
                    String objectType = (String) o;
                    JSONObject rootObject = (JSONObject) jSONObject.get(objectType);
                    JSONObject propertiesObject = getConfigurePropertiesJSON(objectType);
                    responseObject = GenericObjectService.getModelInstance(objectType).getFlexLinkInfo(objectType, rootObject,propertiesObject);
                }
            }
        }catch(FlexObjectNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return gson.toJson(responseObject);
    }

     public String searchByCriteria(String objectType, JSONObject searchJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create flex service initialized by search by criteria on object type ***** "+ objectType));
        Map criteria = new HashMap();
        FlexType flexType = null;
        String respString = "";
        String type=objectType;
        try {
            if (objectType.equalsIgnoreCase("Size Category")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Size Definition");
            }else if (objectType.equalsIgnoreCase("Construction Info")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Construction");
            } else if (objectType.equalsIgnoreCase("Full Size Range")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Size Definition");
            } else if (objectType.equalsIgnoreCase("Test Condition")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Test Specification");
            }else if (objectType.equalsIgnoreCase("Test Property")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Test Specification");
            }else if (objectType.equalsIgnoreCase("Test Standard")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Test Specification");
            }else if (objectType.equalsIgnoreCase("Test Details")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Test Specification");
            }else if (objectType.equalsIgnoreCase("Test Method")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Test Specification");
            }else if (objectType.equalsIgnoreCase("Colorway")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Product");
            }
            else {
                flexType = FlexTypeCache.getFlexTypeFromPath(objectType);
            }
            
            String typeID = FormatHelper.getObjectId(flexType);
                        
            if (searchJson.containsKey("typeHierarchyName"))
            {
                            type=(String)searchJson.get("typeHierarchyName");
                            flexType = FlexTypeCache.getFlexTypeFromPath(type);
                            typeID = FormatHelper.getObjectId(flexType);
            }else if (searchJson.containsKey("typeId"))
            {
            typeID=(String)searchJson.get("typeId");
                        flexType = FlexTypeCache.getFlexType(typeID);
                        }
            
            criteria.put("typeId", typeID);
          //  for(Object o : searchJson.keySet()){
          //          String key = (String)o;
          //          if (!key.equalsIgnoreCase("typeHierarchyName")&& !key.equalsIgnoreCase("typeId")){
                    	
          //           criteria.put(flexType.getAttribute(key).getSearchCriteriaIndex(), searchJson.get(key));
             
           //      }
           // }
            criteria=setSearchAttrsFromSchema(objectType,searchJson,criteria);
       
            return GenericObjectService.getModelInstance(objectType).searchByName(criteria, flexType, "");
        } catch (Exception ex) {

            respString = "no record";
        }
        return respString;
    }    




    /**
     * This method is used to get the flex object records with all associations of given type
     * @param parseInputData contains flexObject information and thier associations information
     * @exception Exception
     * @return JSONObject  It returns all the records of given flexObjects with all associations.
     */
    public JSONObject getFlexObjectAssociations(String parseInputData) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations with  input ***** "+ parseInputData));
        
        JSONObject objectData = new JSONObject();
        JSONObject exObject = new JSONObject();
        try{
            JSONObject jsonData = getParseJSONObject(parseInputData);
            if(jsonData.containsKey("inputs")){
                JSONArray array = (JSONArray) jsonData.get("inputs");
                Iterator it = array.iterator();
                while (it.hasNext()) {
                    JSONObject obj = (JSONObject) it.next();
                    for (Object o: obj.keySet()) {
                        String objectType = (String) o;
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations objectType ***** "+ objectType));
                        JSONObject rootObject = (JSONObject) obj.get(objectType);
                        JSONObject attributesObject = null;
                        if (rootObject.containsKey("attributes")) {
                            attributesObject = (JSONObject) rootObject.get("attributes");
                        }
                        String mediaType = null;
                        if (rootObject.containsKey("mediaType")) {
                            mediaType = (String) rootObject.get("mediaType");
                        }
                        String fromIndex = "";
                        if (rootObject.containsKey("fromIndex")) {
                            fromIndex = (String) rootObject.get("fromIndex");
                        } else {
                            fromIndex = "0";
                        }
                        String toIndex = "";
                        if (rootObject.containsKey("toIndex")) {
                            toIndex = (String) rootObject.get("toIndex");
                        } else {
                            toIndex = "0";
                        }
                        String rootOid = "";
                        if (rootObject.containsKey("oid")) {
                            rootOid = (String) rootObject.get("oid");
                        }
                        try{
                            if((objectType != null) && !("".equalsIgnoreCase(objectType))){
                                JSONObject associationsObject = getConfigureJSON(objectType);
                                JSONArray responseArray = new JSONArray();
                                //if (LOGGER.isDebugEnabled())
                                    //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations rootOid ***** "+ rootOid));
                                if ((rootOid != null) && !("".equalsIgnoreCase(rootOid))) {
                                    JSONObject recJsonObject = GenericObjectService.getModelInstance(objectType).getRecordByOid(objectType, rootOid);
                                    AppUtil appUtil=new AppUtil();
                                    recJsonObject=appUtil.getEncodedImage(recJsonObject,mediaType);
                                    if(!recJsonObject.containsKey("oid"))
                                        recJsonObject.put("oid", rootOid);
                                    responseArray.add(recJsonObject);
                                    objectData.put(objectType, responseArray);
                                } else {
                                    objectData = getRecords(objectType, attributesObject, fromIndex,mediaType,toIndex);
                                }
                                if (rootObject.containsKey("includes")) {
                                    JSONObject rootIncludes = (JSONObject) rootObject.get("includes");
                                    recursiveIncludeRecords(objectData, rootIncludes, associationsObject, objectType);
                                }
                            }else{
                                throw new FlexObjectNotFoundException("Enter a valid flexObject");
                            }
                        } catch (FlexObjectNotFoundException fe) {
                            //if (LOGGER.isDebugEnabled())
                                    //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations Exception caused ***** "+ fe));
                            objectData = util.getExceptionJson(fe.getMessage());
                        } catch (WTException we) {
                            //if (LOGGER.isDebugEnabled())
                                    //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations Exception caused ***** "+ we));
                            objectData = util.getExceptionJson(we.getMessage());
                        } catch (Exception e) {
                           //if (LOGGER.isDebugEnabled())
                                    //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations Exception caused ***** "+ e));
                            objectData = util.getExceptionJson(e.getMessage());
                        }
                    }
                }
            }else{
                throw new InputValidationException("Enter a valid Input");
            }
        }catch(InputValidationException Ie){
           throw Ie;
        }catch(Exception e){
        }
        return objectData;
    }


    /** This method is used to recursively call the flexObject inside(includes) flexObject and append to root JsonObject.
     * @param array contains given flexObject includes associations information
     * @param associationsObject contains associations of given flexObject
     * @param rootFlexObject contains FlexObject name
     * @param parseInputData contains flexObject information and thier associations information
     * @exception Exception
     */
        public void recursiveIncludeRecords(JSONObject rootObject, JSONObject includesObject, JSONObject associationsObject,
            String rootFlexObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
        {
                //LOGGER.debug((Object) (CLASSNAME + "***** recursiveIncludeRecords ***** "));
                //LOGGER.debug((Object) (CLASSNAME + "*****Include Method :rootObject : (1):"+rootObject));
                //LOGGER.debug((Object) (CLASSNAME + "*****Include Method :includesObject : (1):"+includesObject));
                //LOGGER.debug((Object) (CLASSNAME + "*****Include Method :associationsObject : (1):"+associationsObject));
                //LOGGER.debug((Object) (CLASSNAME + "*****Include Method :rootFlexObject : (1):"+rootFlexObject));
            }
        int abc = 0;
        for (Object o : includesObject.keySet()) {
            abc++;

            String objectType = (String) o;
            JSONObject subIncludeObject = (JSONObject) includesObject.get(objectType);
            JSONObject responseObject = new JSONObject();
            JSONObject associationConfigObject = (JSONObject) associationsObject.get(objectType);
            String type = (String) associationConfigObject.get("type");
            if (associationsObject.containsKey(objectType)) {
                JSONArray recordsArray = (JSONArray) rootObject.get(rootFlexObject);
                Iterator itr = recordsArray.iterator();
                while (itr.hasNext()) {
                    try {
                        JSONObject object = (JSONObject) itr.next();
                        String oid = (String) object.get("oid");
                        responseObject = GenericObjectService.getModelInstance(rootFlexObject)
                                .getRecordByOid(rootFlexObject, oid, objectType);
                        
                        if (type.equalsIgnoreCase("array")) {
                            object.put(objectType, (JSONArray) responseObject.get(objectType));
                        }else {
                            JSONArray res = (JSONArray) responseObject.get(objectType);
                            if (res.size() > 1) {
                                JSONObject exceptionObject = new JSONObject();
                                exceptionObject.put("Exeption",
                                        objectType + "" + "conatins Multiple records But its type is Object");
                                object.put(objectType, exceptionObject);
                            } else {
                                object.put(objectType, res.get(0));
                            }
                        }
                        if (subIncludeObject.containsKey("includes")) {
                            JSONObject subIncludesObject = (JSONObject) subIncludeObject.get("includes");
                            //LOGGER.debug((Object) (CLASSNAME + "*****Include Method :subIncludeObject : (7):"+subIncludesObject));

                            JSONObject associationsObject1 = getConfigureJSON(objectType);
                            recursiveIncludeRecords(responseObject, subIncludesObject, associationsObject1,
                                    objectType);
                        }
                    } catch (FlexObjectNotFoundException e) {
                        throw new FlexObjectNotFoundException("Enter a valid flexObject");
                    } catch (Exception e) {
                    }
                }
            } else {
                throw new FlexObjectNotFoundException("Enter a valid FlexObject");
            }
        }
    }

    

    /**
     * This method is used to get the hierarchy for the given flex object
     * @param parseData String
     * @exception Exception,WTException
     * @return String  returns the hierarchy in the form of string
     **/
    public String getFlexTypeHierarchy(String parseData) throws InputValidationException,WTException, Exception {
        //if (LOGGER.isDebugEnabled())
        {
                //LOGGER.debug((Object) (CLASSNAME + "***** getFlexTypeHierarchy ***** "));
                
        }
        JSONObject responseData = new JSONObject();
        try{
            JSONObject jsonData = getParseJSONObject(parseData);
            if(jsonData.containsKey("inputs")){
                JSONArray array = (JSONArray) jsonData.get("inputs");
                if(!array.isEmpty()){
                    FlexTypeClassificationTreeLoader loader = null;
                    Iterator it = array.iterator();
                    while (it.hasNext()) {
                        JSONObject response = new JSONObject();
                        String flexType = "";
                        try {
                            flexType = (String) it.next();
                            if((flexType!=null) && !("".equalsIgnoreCase(flexType))){
                                loader = GenericObjectService.getModelInstance(flexType).getFlexTypeHierarchy();
                                loader.constructTree();
                                TreeNode rootNode = (TreeNode) loader.getRootNode();
                                Collection childNodes = rootNode.getAllChildren();
                                for (Iterator iterator = childNodes.iterator(); iterator.hasNext();) {
                                    TreeNode treeNode = (TreeNode) iterator.next();
                                    String treeNodeId = treeNode.getId();
                                    FlexType treeNodeFlexType = FlexTypeCache.getFlexType(treeNodeId);
                                    String rootChildName = treeNodeFlexType.getFullNameDisplay(true);
                                    String treeNodeTypeId = FormatHelper.getObjectId(treeNodeFlexType);
                                    JSONObject typeDetailsObject = new JSONObject();
                                    typeDetailsObject.put("typeId", treeNodeTypeId);
                                    typeDetailsObject.put("isCreatable", treeNodeFlexType.isTypeActive());
                                    response.put(rootChildName, treeNodeTypeId);
                                }  
                            }else{
                                throw new FlexObjectNotFoundException("you are not entered any flexObject in inputJson");
                            }
                        } catch (FlexObjectNotFoundException fe) {
                            response = util.getExceptionJson(fe.getMessage());
                        } catch (WTException we) {
                            response = util.getExceptionJson(we.getMessage());
                        }
                        responseData.put(flexType, response);
                    }
                }else{
                    throw new JSONArrayNotFoundException("Enter Atleast One flexObject in inputs Array");
                }
            }else{
                throw new InputValidationException("key Should be inputs");
            }
        }catch(JSONArrayNotFoundException je){
           throw je;
        }catch(InputValidationException Ie){
           throw Ie;
        }catch(Exception e){
            throw e;
        }
        return gson.toJson(responseData);
    }


    /**
     * This method is used to get the flex schema for the given type and typeId,
     * @param oid String
     * @param typeId String
     * @param jsonAsscos JSONObject
     * @exception Exception
     * @return JSONObject  It returns response  object
     */

    public String getFlexSchema(String parseData) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema initialized with ***** "+ parseData));
        JSONObject responseObject = new JSONObject();
        try{
            JSONObject jsonData = getParseJSONObject(parseData);
            if(jsonData.containsKey("inputs")){
                JSONArray array = (JSONArray) jsonData.get("inputs");
                Iterator it = array.iterator();
                while (it.hasNext()) {
                    JSONObject obj = (JSONObject) it.next();
                    JSONObject attrsObject = new JSONObject();
                    try{
                        String type = (String) obj.get("flexObject");
                        if((type!=null) && !("".equalsIgnoreCase(type))){
                            String typeId = (String) obj.get("typeId");
                            attrsObject = GenericObjectService.getModelInstance(type).getFlexSchema(type, typeId);
                            FlexType treeNodeFlexType = null;
                            if((typeId!=null) && !("".equalsIgnoreCase(typeId))){
                                treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
                            }else{
                                treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
                            }
                            String rootChildName = treeNodeFlexType.getFullNameDisplay(true);
                            attrsObject.put("title", rootChildName);
                            responseObject = attrsObject;
                        }else{
                            throw new FlexObjectNotFoundException("you are not entered any flexObject in inputJson");
                        }
                    } catch (NumberFormatException ne) {
                        responseObject = util.getExceptionJson(ne.getMessage());
                    } catch (FlexObjectNotFoundException fe) {
                        responseObject = util.getExceptionJson(fe.getMessage());
                    } catch (TypeIdNotFoundException te) {
                        responseObject = util.getExceptionJson(te.getMessage());
                    }
                }
            }else{
                throw new InputValidationException("key Should be inputs");
            }
        }catch(WTException we){
           throw we;
        }catch(InputValidationException Ie){
           throw Ie;
        }catch(Exception e){
            e.printStackTrace();
        }
        return gson.toJson(responseObject);
    }


    JSONObject mainAssociationFlexObjects = new JSONObject(); 

    /**
     * This method is used to get the associations from configuration.json file
     * @param flexObject contains flexObject name
     * @exception Exception
     * @return JSONObject  conatins associations of given flexObject 
     */
    public JSONObject getConfigureJSON(String flexObject) throws IOException, Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** getConfigureJSON ***** "));
      
        if (!TRCCache.isInitialized()) 
            TRCCache.refresh();
        JSONObject jsonConfiguration = TRCCache.getRelationCache();
        JSONObject associationsJSON = new JSONObject();
        if (jsonConfiguration.containsKey(flexObject)) {
            JSONObject flexObject1 = (JSONObject) jsonConfiguration.get(flexObject);
            associationsJSON = (JSONObject) flexObject1.get("associations");
        }
        return associationsJSON;
    }


    /**
     * This method is used to get the associations from configuration.json file
     * @param flexObject contains flexObject name
     * @exception Exception
     * @return JSONObject  conatins associations of given flexObject 
     */
    public JSONObject getConfigurePropertiesJSON(String flexObject) throws IOException, Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** getConfigurePropertiesJSON ***** "));
        JSONObject associationsJSON = new JSONObject();
        try{
            if (!TRCCache.isInitialized()) 
            TRCCache.refresh();
            JSONObject jsonConfiguration = TRCCache.getRelationCache();
            if (jsonConfiguration.containsKey(flexObject)) {
                JSONObject flexObject1 = (JSONObject) jsonConfiguration.get(flexObject);
                associationsJSON = (JSONObject) flexObject1.get("properties");
            }
        }catch(Exception e){
            throw e;
        }
        return associationsJSON;
    }


    public JSONObject getAssociationObjData(String assoObj, JSONObject associationFlexObjects) throws Exception {
        //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** GetAssociationObjData ***** "));
        JSONObject associateObj = new JSONObject();
        if (associationFlexObjects.containsKey(assoObj)) {
            associateObj = (JSONObject) associationFlexObjects.get(assoObj);
        }
        return associateObj;
    }


    public String getRefObjList(String parseData) throws Exception {
         //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** GetRefObjList ***** "));
        JSONObject responseObject = new JSONObject();
        JSONObject jsonData = getParseJSONObject(parseData);
        String attrName = (String) jsonData.get("attributeName");
        String typeId = (String) jsonData.get("typeId");
        responseObject = util.getObjectRefAttributeList(typeId, attrName);
        return gson.toJson(responseObject);
    }

    /**
     * @description This Method is used to get the flexObjects of through out
     *              application.
     * @method GET
     * @return String It returns flexObjects
     */
    public String getFlexObjects() throws Exception {
        return gson.toJson(util.getFlexObjects());
    }
    
    /**
     * @description This Method is used to get the flexlinkObjects of through out
     *              application.
     * @method GET
     * @return String It returns flexObjects
     */
    public String getLinkObjects() throws Exception {
        return gson.toJson(util.getFlexLinkObjects());
    }


    /**
     * This method is used to get the records for given criteria,
     * @param typeId String
     * @param objectType String
     * @param fromIndex String
     * @exception Exception
     * @return JSONObject  It returns response  object
     **/
    public String getRecordsData(String parseData) throws Exception {
        JSONObject jsonData = getParseJSONObject(parseData);
        String response = null;
        JSONObject objectData = (JSONObject) jsonData.get("inputs");
        String type = (String) objectData.get("flexObject");
        String typeId = (String) objectData.get("typeId");
        FlexType flexType = FlexTypeCache.getFlexType(typeId);
         //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** GetRecordsData type ***** "+type));
        if (type.equalsIgnoreCase("Test Specification")) {
            TestSpecificationModel tscs = new TestSpecificationModel();
            if (typeId != null) {
                response = tscs.getRecordsData(flexType);
            }
        } else if (type.equalsIgnoreCase("Construction")) {
            ConstructionModel ccs = new ConstructionModel();
            if (typeId != null) {
                response = ccs.getRecordsData(flexType);
            }
        } else if (type.equalsIgnoreCase("Measurements")) {
            MeasurementsModel mcs = new MeasurementsModel();
            if (typeId != null) {
                response = mcs.getRecordsData(flexType);
            }
        } else if (type.equalsIgnoreCase("Size Definition")) {
            SizingModel scs = new SizingModel();
            if (typeId != null) {
                response = scs.getRecordsData(flexType);
            }
        }
        return response;
    }


    /**
     * This method is used to get the object data for the given type and oid,
     * @param oid String
     * @param objectType String
     * @exception Exception
     * @return JSONObject  It returns response  object
     */
    public JSONObject getRecordByOid(String objectType, String oid, String mediaType) throws Exception {
        JSONObject responseObject = new JSONObject();
     
        try{
            JSONObject recJsonObject = GenericObjectService.getModelInstance(objectType).getRecordByOid(objectType, oid);
            AppUtil appUtil=new AppUtil();
            recJsonObject=appUtil.getEncodedImage(recJsonObject,mediaType);
            if(!recJsonObject.containsKey("oid"))
            recJsonObject.put("oid", oid);
            responseObject.put(objectType, recJsonObject);
        }catch(FlexObjectNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    private Map setSearchAttrsFromSchema(String objectType,JSONObject attrs,Map criteriaMap)throws FlexObjectNotFoundException,WTException,Exception{

        String type=objectType;
        FlexType flexType = null;
        if (objectType.equalsIgnoreCase("Colorway")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Product");
            }
        else if ((objectType.equalsIgnoreCase("Cost Sheet Product"))||(objectType.equalsIgnoreCase("Cost Sheet Colorway")) ){

                flexType = FlexTypeCache.getFlexTypeFromPath("Cost Sheet");
            }
        else
          flexType = FlexTypeCache.getFlexTypeFromPath(type);
        String typeID = FormatHelper.getObjectId(flexType);
        if (attrs.containsKey("typeHierarchyName"))
        {
            type=(String)attrs.get("typeHierarchyName");
            flexType = FlexTypeCache.getFlexTypeFromPath(type);
            typeID = FormatHelper.getObjectId(flexType);
        }
            else if (attrs.containsKey("typeId"))
        {
        typeID=(String)attrs.get("typeId");
        }
        
        JSONObject flexSchema=GenericObjectService.getModelInstance(objectType).getFlexSchema(objectType, typeID);
        JSONObject schemaProperties=(JSONObject)flexSchema.get("properties");
        for (Object str: attrs.keySet()) {
            String attrKey=(String)str;
            String attrValue=attrs.get(attrKey).toString();
            if(schemaProperties.containsKey(attrKey)){
                JSONObject singleProperty=(JSONObject)schemaProperties.get(attrKey);
                if(singleProperty.containsKey("searchCriteriaIndex")){
                    Object searchCriteriaObject=singleProperty.get("searchCriteriaIndex");
                    if(searchCriteriaObject instanceof JSONArray){
                        JSONArray arraySearchItem=(JSONArray)searchCriteriaObject;
                        JSONObject searchItemObject=(JSONObject)arraySearchItem.get(0);
                        criteriaMap.put(searchItemObject.get("to"), attrValue);
                        criteriaMap.put(searchItemObject.get("from"), attrValue);
                    }else{
                        criteriaMap.put((String)searchCriteriaObject, attrValue);
                    }
                }
            }
            else
                {
                     criteriaMap.put(attrKey, attrValue);
                }
        }
        criteriaMap.put("typeId", typeID);
        return criteriaMap;
    }

    /**
     * This method is used to get the records for given criteria,
     * @param typeId String
     * @param objectType String
     * @param fromIndex String
     * @exception Exception,WTException
     * @return JSONObject  It returns response  object
     **/
    public JSONObject getRecords(String objectType, JSONObject parseData, String fromIndex, String mediaType, String toIndex) throws WTException, Exception {
        JSONObject responseObject = new JSONObject();
        JSONObject objectData = new JSONObject();
        try{
            Map criteriaMap = getCriteria(Integer.parseInt(fromIndex),Integer.parseInt(toIndex));
            if (parseData != null) {
              
                criteriaMap=setSearchAttrsFromSchema(objectType,parseData,criteriaMap);

            }
            responseObject = GenericObjectService.getModelInstance(objectType).getRecords(objectType, criteriaMap);
            if (responseObject.containsKey("statusCode")) {
                return responseObject;
            }
            JSONArray responseArray = new JSONArray();
            
            if (objectType.equalsIgnoreCase("Full SizeRange")) {
                return responseObject;
            }
            if (objectType.equalsIgnoreCase("Size Category")) {
                return responseObject;
            }
            if (objectType.equalsIgnoreCase("BOM")) {
                return responseObject;
            }
            if (objectType.equalsIgnoreCase("Sourcing Configuration")) {
                return responseObject;
            }
            if (objectType.equalsIgnoreCase("Cost Sheet Colorway")) {
                return responseObject;
            }
            Vector responseData = (Vector) responseObject.get(objectType);
            Iterator itr = responseData.iterator();
            while (itr.hasNext()) {
                try{

                    FlexObject object = (FlexObject) itr.next();
                    String oid = GenericObjectService.getModelInstance(objectType).getOid(object);
                    JSONObject recJsonObject = GenericObjectService.getModelInstance(objectType).getRecordByOid(objectType, oid);
                    AppUtil appUtil=new AppUtil();
                    recJsonObject=appUtil.getEncodedImage(recJsonObject,mediaType);
                    if(!recJsonObject.containsKey("oid"))
                    recJsonObject.put("oid", oid);
                    responseArray.add(recJsonObject);
                }catch(Exception e){
                    
                }
                
            }
            objectData.put(objectType, responseArray);
            objectData.put("TotalRecords", (int) responseObject.get("TotalRecords"));
            objectData.put("FromIndex", (int) responseObject.get("FromIndex"));
            objectData.put("ToIndex", (int) responseObject.get("ToIndex"));
        }catch(FlexObjectNotFoundException foe){
            objectData = util.getExceptionJson(foe.getMessage());
        }catch(JSONObjectNotFoundException je){
            objectData = util.getExceptionJson(je.getMessage());
        }catch(Exception e){
            objectData = util.getExceptionJson(e.getMessage());
        }
        return objectData;
    }

    /**
     * This method is used to search the flex objects for the given object type
     * @param parseData String
     * @param objectType String
     * @param fromIndex String
     * @exception Exception,WTException
     * @return JSONObject  It returns response  object
     **/
    public JSONObject searchFlexObjects(String objectType, String parseData, String fromIndex, String toIndex) throws WTException, Exception {
        JSONObject responseObject = new JSONObject();
        JSONObject jsonObject = getParseJSONObject(parseData);
        Map criteriaMap = getCriteria(Integer.parseInt(fromIndex),Integer.parseInt(toIndex));
        FlexType flexType = FlexTypeCache.getFlexType(jsonObject.get("typeId").toString());
        String typeId = (String) jsonObject.get("typeId");
        if (!"".equalsIgnoreCase(typeId)) {
            flexType = FlexTypeCache.getFlexType(typeId);
            if (jsonObject != null) {
                for (Object str: jsonObject.keySet()) {
                    criteriaMap.put(str.toString(), (String) jsonObject.get(str.toString()));
                }
            }
        } else {
            flexType = FlexTypeCache.getFlexTypeFromPath(objectType);
        }
        responseObject = GenericObjectService.getModelInstance(objectType).searchSchemaObject(objectType, flexType, criteriaMap);
        Vector responseData = (Vector) responseObject.get(objectType);
        Iterator itr = responseData.iterator();
        JSONArray responseArray = new JSONArray();
        JSONObject objectData = new JSONObject();
        while (itr.hasNext()) {
            FlexObject object = (FlexObject) itr.next();
            String oid = GenericObjectService.getModelInstance(objectType).getOid(object);
            JSONObject recJsonObject = GenericObjectService.getModelInstance(objectType).getRecordByOid(objectType, oid);
            recJsonObject.put("oid", oid);
            responseArray.add(recJsonObject);
        }
        objectData.put(objectType, responseArray);
        objectData.put("TotalRecords", (int) responseObject.get("TotalRecords"));
        objectData.put("FromIndex", (int) responseObject.get("FromIndex"));
        objectData.put("ToIndex", (int) responseObject.get("ToIndex"));
        return objectData;
    }

    /**
     * This method is used to search the flex object by name
     * @param name String
     * @param objectType String
     * @exception Exception
     * @return String  It returns response  object
     **/
    public String searchByName(String objectType, String name) throws Exception {
    
        Map criteria = new HashMap();
        FlexType flexType = null;
        String respString = "";
        try {
            if (objectType.equalsIgnoreCase("Size Category")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Size Definition");
            } else if (objectType.equalsIgnoreCase("Full Size Range")) {
                flexType = FlexTypeCache.getFlexTypeFromPath("Size Definition");
            } else {
                flexType = FlexTypeCache.getFlexTypeFromPath(objectType);
            }
            criteria.put(flexType.getAttribute("name").getSearchCriteriaIndex(), name);
            return GenericObjectService.getModelInstance(objectType).searchByName(criteria, flexType, name);
        } catch (Exception ex) {
            respString = "no record";
        }
        return respString;
    }

    

    /**
     * This method is used to Set the criteria baesd on index
     * @param fromIndex int which contains fromIndex value
     * @return Map  returns the 100 records based on fromIndex
     **/
    private Map getCriteria(int fromIndex, int toIndex) {
        Map criteria = new HashMap();
        int maxRecords = 100;
        criteria.put("fromIndex", fromIndex);
        if (fromIndex > toIndex){
            criteria.put("toIndex", fromIndex + maxRecords);
        }else{
            criteria.put("toIndex", toIndex);
        }
        return criteria;
    }

    /**
     * This method is used to Convert string formated data to Json formate
     * @param parseData String
     * @return JSONObject  Converted JSONObject
     **/

    private JSONObject getParseJSONObject(String parseData) {
        JSONParser parser = new JSONParser();
        try {
            return (JSONObject) parser.parse(parseData);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * This method is used to get the records by the given oid for the flex objects associations
     * @param objectType String
     * @param oid String
     * @param association String
     * @exception Exception
     * @return JSONObject  returns the record in the form of JSON object
     **/
    public JSONObject getRecordByOid(String objectType, String oid, String association,String mediaType) throws Exception {
        JSONParser parser = new JSONParser();
        
        JSONObject recJsonObject = new JSONObject();
        try{
            if (!TRCCache.isInitialized()) 
            TRCCache.refresh();
            JSONObject jsonAsscos = TRCCache.getRelationCache();
            if(jsonAsscos.containsKey(objectType)){
                JSONObject objectConfig = (JSONObject) jsonAsscos.get(objectType);
                JSONObject objectAssoc = (JSONObject) objectConfig.get("associations");
                if (objectAssoc.containsKey(association)) {
                    recJsonObject = GenericObjectService.getModelInstance(objectType).getRecordByOid(objectType, oid, association);
                }else{ 
                    throw new FlexObjectNotFoundException("Enter a valid association flexObject name");
                }
            }else {
                throw new FlexObjectNotFoundException("Enter a valid flexObject");
            }
        }catch(FlexObjectNotFoundException foe){
            recJsonObject = util.getExceptionJson(foe.getMessage());
        }catch(FileNotFoundException fe){
            recJsonObject = util.getExceptionJson(fe.getMessage());
        }catch(Exception e){
            recJsonObject = util.getExceptionJson(e.getMessage());
        }
                              
        return recJsonObject;
    }

    public String getFlexSchemaInfo(String parseData) throws Exception {
        JSONObject responseObject = new JSONObject();
        JSONObject jsonData = getParseJSONObject(parseData);
        JSONArray array = (JSONArray) jsonData.get("inputs");
        Iterator it = array.iterator();
        while (it.hasNext()) {
            JSONObject flexObj = (JSONObject) it.next();
            responseObject = getSchema(flexObj, "inputs", responseObject, "");
        }

        return gson.toJson(responseObject);
    }

    private void recursiveInclude(JSONObject includesArray, JSONObject responseObject, String parentType) throws Exception {
        getSchema(includesArray, "includes", responseObject, parentType);
    }
    //JSONObject mainAssociationFlexObjects = new JSONObject();

    private JSONObject getSchema(JSONObject flexObj, String inputValue, JSONObject responseObject, String parentType) throws Exception {
        JSONObject responseObject1 = new JSONObject();
        java.util.Set flexObjKeys = flexObj.keySet();
        for (Object selectedFlexObj: flexObjKeys) {
            String type = selectedFlexObj.toString();
            JSONObject subSelection = (JSONObject) flexObj.get(type);
            String typeId = (String) subSelection.get("typeId");
            if (GenericObjectService.getModelInstance(type) != null) {
                JSONObject attrsObject = GenericObjectService.getModelInstance(type).getFlexSchema(type, typeId);
                FlexType treeNodeFlexType = null;
                if ((typeId != null) && !("".equalsIgnoreCase(typeId))) {
                    treeNodeFlexType = FlexTypeCache.getFlexType(typeId);
                } else {
                    treeNodeFlexType = FlexTypeCache.getFlexTypeRoot(type);
                }
                String rootChildName = treeNodeFlexType.getFullNameDisplay(true);
                attrsObject.put("title", rootChildName);
                if ("inputs".equalsIgnoreCase(inputValue)) {
                    responseObject = attrsObject;
                    parentType = type;
                    getChildObjects(flexObj, attrsObject, parentType);
                    if ("includes".equalsIgnoreCase(inputValue)) {
                        responseObject.put(type + "AssociationsChild", attrsObject);
                    }
                }
                mainAssociationFlexObjects = getConfigureJSON(parentType);
                if (!mainAssociationFlexObjects.isEmpty()) {
                    JSONObject temp = (JSONObject) mainAssociationFlexObjects.get(type);
                    if (!"inputs".equalsIgnoreCase(inputValue)) {
                        String assoType = temp.get("type").toString();
                        if ("array".equalsIgnoreCase(assoType)) {
                            JSONObject arrayObj = new JSONObject();
                            arrayObj.put("required", temp.get("required"));
                            arrayObj.put("associationType", temp.get("type"));
                            arrayObj.put("items", attrsObject);
                            getChildObjects(flexObj, attrsObject, parentType);
                            if ("includes".equalsIgnoreCase(inputValue)) {
                                responseObject.put(type + "AssociationsChild", arrayObj);
                            }
                        } else {
                            attrsObject.put("required", temp.get("required"));
                            attrsObject.put("associationType", temp.get("type"));
                            getChildObjects(flexObj, attrsObject, parentType);
                            if ("includes".equalsIgnoreCase(inputValue)) {
                                responseObject.put(type + "AssociationsChild", attrsObject);
                            }
                        }
                    }
                }
            }

        }



        return responseObject;
    }

    private void getChildObjects(JSONObject obj, JSONObject responseObject, String parentType) throws Exception {

        java.util.Set keysObj = obj.keySet();
        for (Object tempKey: keysObj) {
            JSONObject jObj = (JSONObject) obj.get(tempKey.toString());

            if (jObj.containsKey("includes")) {
                JSONObject includesInsideArray = (JSONObject) jObj.get("includes");
                parentType = tempKey.toString();
                recursiveInclude(includesInsideArray, responseObject, parentType);
            }
        }
    }


    /**
     * This method is used to get the object data for the given type and oid,
     * @param oid String
     * @param objectType String
     * @exception Exception
     * @return JSONObject  It returns response  object
     */
    public JSONObject getThumbnail(String objectType, String oid) throws Exception {
        JSONObject responseObject = new JSONObject();
     
        try{
            JSONObject recJsonObject = GenericObjectService.getModelInstance(objectType).findThumbnailData(oid);
            //AppUtil appUtil=new AppUtil();
            //recJsonObject=appUtil.getEncodedImage(recJsonObject,mediaType);
            //if(!recJsonObject.containsKey("oid"))
            //recJsonObject.put("oid", oid);
            responseObject.put(objectType, recJsonObject);
        }catch(FlexObjectNotFoundException fe){
            responseObject = util.getExceptionJson(fe.getMessage());
        }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }
    
    public JSONObject getRecordByOid(String objectType, String oid,boolean getPreviousIterationOid, String mediaType) throws Exception {
		JSONObject jSONObject = new JSONObject();
		if(getPreviousIterationOid){
        
			
         Object obj = LCSQuery.findObjectById(oid);
			jSONObject.put("ORid", FormatHelper.getObjectId((WTObject)obj).toString());
			if((obj instanceof Iterated) && VersionControlHelper.hasPredecessor((Iterated) obj)){
				obj  = VersionControlHelper.service.predecessorOf((Iterated) obj);
             jSONObject.put("previoudORid", FormatHelper.getObjectId((WTObject)obj).toString());
             }
				} else{
				jSONObject = getRecordByOid(objectType,oid,mediaType);
				}
			return jSONObject;

 }


}