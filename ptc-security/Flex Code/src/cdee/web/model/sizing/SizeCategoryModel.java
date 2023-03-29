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
package cdee.web.model.sizing;

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
import com.lcs.wc.planning.PlanQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.planning.FlexPlan;
import com.lcs.wc.planning.PlanClientModel;
import com.lcs.wc.sizing.SizeCategoryClientModel;
import com.lcs.wc.sizing.SizingQuery;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import wt.util.WTException;
import com.lcs.wc.sizing.ProductSizingLogic;
import com.lcs.wc.sizing.ProductSizeCategory;
import com.lcs.wc.sizing.SizeCategory;
import com.lcs.wc.sizing.ProductSizeCategory;
import cdee.web.exceptions.TypeIdNotFoundException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import java.io.FileNotFoundException;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class SizeCategoryModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(SizeCategoryModel.class.getName());
//private static final String CLASSNAME = SizeCategoryModel.class.getName();

    AppUtil util = new AppUtil();


    /**
     * This method is used to insert the Size Category flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Size Category flextype at a time.
     * @param type is a string 
     * @param sizeCategoryJson  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONObject  It returns Size Category JSONObject
     */


    public JSONObject createSizeCategory(String type, JSONObject sizeCategoryJson) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Size Category with type and sizeCategoryJson ***** "));
        JSONObject responseObject = new JSONObject();
        JSONObject responseObjectData = new JSONObject();
        try {
            SizeCategoryClientModel sizeCategoryClientModel = new SizeCategoryClientModel();
            Map sizeCategoryAttrs = new HashMap();
            String name = (String) sizeCategoryJson.get("name");
            sizeCategoryAttrs.put("name", name);
            sizeCategoryAttrs.put("typeId", (String) sizeCategoryJson.get("typeId"));
            AttributeValueSetter.setAllAttributes(sizeCategoryClientModel, sizeCategoryAttrs);
            sizeCategoryClientModel.save();
            String sizeCategoryoid = FormatHelper.getObjectId(sizeCategoryClientModel.getBusinessObject());
            SizingQuery query = new SizingQuery();
            Collection < FlexObject > response = null;
            response = query.findSizeCategoriesByName((String) sizeCategoryJson.get("name")).getResults();
            responseObjectData.put("objectData", response);
            responseObject.put("SizeCategory", responseObjectData);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to update the Size Category flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Size Category flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param sizeCategoryJson  Contains Size Category data
     * @exception Exception
     * @return String  It returns OID of Size Category object
     */

    public JSONObject updateSizeCategory(String oid, String type, JSONObject sizeCategoryJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Size Category with oid an type and sizeCategoryJson ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        SizeCategoryClientModel sizeCategoryClientModel = new SizeCategoryClientModel();
        try {
            sizeCategoryClientModel.load(oid);
            Map sizeCategoryAttrs = new HashMap();
            sizeCategoryAttrs.put("name", (String) sizeCategoryJson.get("name"));
            AttributeValueSetter.setAllAttributes(sizeCategoryClientModel, sizeCategoryAttrs);
            sizeCategoryClientModel.save();
            String sizeCategoryoid = FormatHelper.getObjectId(sizeCategoryClientModel.getBusinessObject());
            responseObject.put("SizeCategoryOid", sizeCategoryoid);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the Size Category(Size Definition) flex object that are  passed by using type as reference,
     * oid and object of different Size Category data 
     * Using this method we can insert/update record of a Sample flextype at a time.
     * @param type String 
     * @param oid String
     * @param sizeCategoryJsonData  Contains Size Category data
     * @exception Exception
     * @return JSONObject  It returns Size Category JSONObject object
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
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSizeCategory with criteria ***** "));
                    responseObject = updateSizeCategory(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSizeCategory with criteria ***** "));
                    responseObject = createSizeCategory(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSizeCategory with oid ***** "));
                responseObject = updateSizeCategory(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used delete Size category of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            ProductSizeCategory productSizeCategory = (ProductSizeCategory) LCSQuery.findObjectById(oid);
            ProductSizingLogic productSizingLogic = new ProductSizingLogic();
            productSizingLogic.delete(productSizeCategory);
            responseObject = util.getDeleteResponseObject("Size Category", oid, responseObject);
        } catch (WTException wte) {
            //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Exception in delete with oid ***** "+ wte.getMessage()));
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
        return null;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get Flex schema with SIZING_SCOPE ***** "));
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
                        if (attribute.getAttScope().equals("SIZING_SCOPE")) {
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

    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Get records by objectType and criteriaMap ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot("Size Definition");
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new SizingQuery().findSizeCategories();
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by Name with flexType and name ***** "+ name));
        Collection < FlexObject > response = null;
        String oid = "";
        SizingQuery query = new SizingQuery();
        response = query.findSizeCategoriesByName(name).getResults();
        oid = "OR:com.lcs.wc.sizing.SizeCategory:"+(String) response.iterator().next().get("SIZECATEGORY.IDA2A2");
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
        return "OR:com.lcs.wc.sizing.SizeCategory:" + (String) flexObject.getString("SIZECATEGORY.IDA2A2");
    }

    /**
     * This method is used to get the record that matched with the given oid of this flex object .
     * @param String  objectType
     * @param String oid
     * @Exception exception
     * @return String  it returns the records that matched the given oid of this flex object
     */
    public JSONObject getRecordByOid(String objectType, String oid) throws Exception {
        return null;
    }
}