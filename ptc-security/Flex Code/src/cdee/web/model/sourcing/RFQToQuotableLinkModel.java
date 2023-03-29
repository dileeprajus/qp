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
package cdee.web.model.sourcing;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.google.gson.Gson;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.specification.FlexSpecQuery;
import com.lcs.wc.sourcing.LCSSourcingConfigQuery;
import com.lcs.wc.part.LCSPartMaster;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.db.FlexObject;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.sourcing.RFQToQuotableLink;
import cdee.web.util.DataConversionUtil;
import java.io.FileNotFoundException;
import wt.util.WTException;
import cdee.web.exceptions.FlexObjectNotFoundException;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class RFQToQuotableLinkModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(RFQToQuotableLinkModel.class.getName());
//private static final String CLASSNAME = RFQToQuotableLinkModel.class.getName();

	AppUtil util = new AppUtil();
 	Gson gson= new Gson();


	/**
      * This method is used either insert or update the SourcingConfiguration flex object that are  passed by using type as reference,
      * oid and array of different SourcingConfiguration data 
      * Using this method we can insert/update several records of a SourcingConfiguration flextype at a time.
      * @param type String 
      * @param oid String
      * @param SourcingConfigurationJSONArray  Contains array of SourcingConfiguration data
      * @exception Exception
      * @return JSONArray  It returns SourcingConfiguration JSONArray object
      */

  

  public JSONArray saveOrUpdate(String type,String oid, JSONArray sourcingConfigJSONArray) throws Exception {
   //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type)); 
    JSONArray responseArray = new JSONArray();   
    return null;
  }

    /**
      * This method is used to insert the SourcingConfiguration flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a SourcingConfiguration flextype at a time.
      * @param type is a string 
      * @param sourcingConfigurationDataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns SourcingConfiguration JSONArray object
      */  

    public JSONObject createSourcingConfig(String type, ArrayList sourcingConfigDataList){
      
    return null;
  } 

    /**
      * This method is used to update the SourcingConfiguration flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a SourcingConfiguration flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param sourcingConfigurationJsonObject  Contains SourcingConfiguration data
      * @exception Exception
      * @return String  It returns OID of SourcingConfiguration object
     
      */

    public JSONObject updateSourcingConfig(String oid, JSONObject sourcingConfigJsonObject) throws Exception{
    
    return null;
  }

  /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.sourcing.RFQToQuotableLink"); 
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get flex schema with type and typeId ***** "));
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
                        if (attribute.getAttScope().equals("REQUEST_LINEITEM_SCOPE")) {
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
    * This method is used to get the records of this flex object .
    * @param objectType  String
    * @param typeId  String
    * @param criteriaMap  Map
    * @exception Exception
    * @return JSONObject  it returns all the records of this flex object in the form of json
    */  
  	public JSONObject getRecords(String typeId,String objectType, Map criteriaMap) throws Exception{
    		return null;
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
            return "no record";
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
       return null;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get record by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        RFQToQuotableLink rfqToQuotableLinkInput = (RFQToQuotableLink) LCSQuery.findObjectById(oid);
        RFQToQuotableLink rfqToQuotableLink = rfqToQuotableLinkInput;
         try{
            rfqToQuotableLink = (RFQToQuotableLink) VersionHelper.latestIterationOf(rfqToQuotableLinkInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(rfqToQuotableLink.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(rfqToQuotableLink.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image",null);
        jSONObject.put("typeId",FormatHelper.getObjectId(rfqToQuotableLink.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(rfqToQuotableLink).toString());
        jSONObject.put("flexName",objectType);
        jSONObject.put("typeHierarchyName",rfqToQuotableLink.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(rfqToQuotableLink));
        String typeHierarchyName=(String)jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName",typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\")+1));
        Collection attributes = rfqToQuotableLink.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
     	  while(it.hasNext()){
        	FlexTypeAttribute att = (FlexTypeAttribute) it.next();
        	String attKey = att.getAttKey();
        	try{
          		if(rfqToQuotableLink.getValue(attKey) == null){
           		 	jSONObject.put(attKey,"");
          		}
          		else{
           			jSONObject.put(attKey,rfqToQuotableLink.getValue(attKey).toString());
         		}
       		}catch(Exception e){
           	}
    	}
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(rfqToQuotableLink.getFlexType()));	
    }
}