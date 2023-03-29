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
package cdee.web.model.moa;

import cdee.web.services.GenericObjectService;
import cdee.web.util.AppUtil;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
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
import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import wt.util.WTException;
import com.lcs.wc.moa.LCSMOAObjectQuery;
import com.lcs.wc.moa.LCSMOAObject;
import com.lcs.wc.moa.LCSMOACollectionClientModel;
import javax.servlet.http.HttpServletRequest;
import java.util.Set;
import javax.ws.rs.core.Context;
import javax.servlet.http.HttpServletRequest;
import java.util.Vector;
import com.google.gson.Gson;
//import com.vrd.reports.VRDMOAObjectQuery ;
//import com.vrd.reports.LCSMOAObjectQuery ;
import cdee.web.model.material.MaterialModel;
import cdee.web.model.season.SeasonModel;
import com.lcs.wc.util.MOAHelper;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import wt.log4j.LogR;
import com.lcs.wc.util.RequestHelper;
//import org.apache.log4j.Logger;

public class MOAModel extends GenericObjectService{
//private static final Logger LOGGER = LogR.getLogger(MOAModel.class.getName());
 //private static final String CLASSNAME = MOAModel.class.getName();
  AppUtil util = new AppUtil();

  /**
      * This method is used to update the MOA flex object that are  passed by using OID as reference.
      * Using this method we can update several records of a MOA flextype at a time.
      * @param oid   oid of an item(type) to update
      * @param MOAJsonObject  Contains MOA data
      * @exception Exception
      * @return String  It returns OID of MOA object
      */
  public JSONObject updateMOA(String oid,String type, JSONObject attrsJsonObject) throws Exception{
  //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update MOA ***** "+ oid));
    JSONObject responseObject = new JSONObject();
    
    return responseObject;
  }                
    /**
      * This method is used to insert the MOA flex object that are  passed by using type as reference.
      * Using this method we can insert several records of a MOA flextype at a time.
      * @param type is a string 
      * @param MOADataList  Contains attributes, typeId, oid(if existing)
      * @exception Exception
      * @return JSONArray  It returns Last JSONArray object
      */ 
    
    public JSONObject createMOA(String type, ArrayList moaDataList){
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create MOA ***** "));
    JSONObject responseObject = new JSONObject();
    LCSMOACollectionClientModel moaModel = new LCSMOACollectionClientModel();
    try{
            JSONObject colorAttrs=(JSONObject) moaDataList.get(0);
            //String dataString=(String)colorAttrs.get("colorAttrs");
            String dataString=attrsToSatastring(colorAttrs);
            String owmerOid=(String)colorAttrs.get("oid");
            String attributeOid=(String)colorAttrs.get("attribute");
            moaModel.load(owmerOid, attributeOid);
            moaModel.updateMOACollection(dataString);
   
    }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
    }
    return responseObject;
  }

    private String attrsToSatastring(JSONObject moaAttrs){
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** attrsToSatastring ***** "));
        String dataString="";
        String typeId=(String)moaAttrs.get("typeId");
        Collection attrsList=new ArrayList();
        try{
            attrsList =FlexTypeCache.getFlexType(typeId).getAllAttributes();
        }catch(Exception e){}
        Iterator attrsListItr = attrsList.iterator();
        ArrayList arrayList = new ArrayList();
        arrayList.add("sortingNumber");
        arrayList.add("ID");
        arrayList.add("DROPPED");
        while(attrsListItr.hasNext()){
            FlexTypeAttribute attribute=(FlexTypeAttribute)attrsListItr.next();
            arrayList.add(attribute.getAttKey());
        }
        Iterator iterator = arrayList.iterator();
        // while loop
        while (iterator.hasNext()) {
            String key=(String)iterator.next();
            String value="";
            if(moaAttrs.containsKey(key)){
                value=(String)moaAttrs.get(key);
            }
            dataString=dataString+key+"|&^&|"+value+"|-()-|";
        }

        return dataString+"|!#!|";
    }
    /**
      * This method is used either insert or update the Media flex object that are  passed by using type as reference,
      * oid and array of different Media data 
      * Using this method we can insert/update several records of a Media flextype at a time.
      * @param type String 
      * @param oid String
      * @param documentJSONArray  Contains array of colors data
      * @exception Exception
      * @return JSONArray  It returns Media JSONArray object
      */
  
  public JSONObject saveOrUpdate(String type,String oid, JSONObject colorJsonData) throws Exception {
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type +"-----oid--------"+ oid)); 
    JSONObject responseObject = new JSONObject();
    try{
      
      if(oid == null){
        ArrayList list = util.getOidFromName(type,colorJsonData);
        if(!(list.get(2).toString()).equalsIgnoreCase("no record")) {
          //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMOA with criteria ***** "));
          responseObject=updateMOA(list.get(2).toString(),type,colorJsonData);
        } else {
           //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createMOA  ***** "));
          responseObject=createMOA(type, list);
        }
      } else {
         //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateMOA with oid ***** "));
        responseObject=updateMOA(oid,type,colorJsonData);
      }
    }catch(Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
    }
    return responseObject;
  }

    /**
    * This method is used delete MOA of given oid,
    * @param MOAOid String 
    * @exception Exception
    * @return JSONObject  It returns response JSONObject object
    */
public JSONObject delete(String colorOid)throws Exception{
     //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using coor oid  initialized ***** "+ colorOid));
      JSONObject responseObject=new JSONObject();
      /*try{
        LCSColorLogic colorLogic=new LCSColorLogic();
    LCSColor lcsColor = (LCSColor) LCSQuery.findObjectById(colorOid);
    colorLogic.deleteColor(lcsColor);
        responseObject=util.getDeleteResponseObject("Color",colorOid,responseObject);
      }catch(WTException wte){
        responseObject=util.getExceptionJson(wte.getMessage());
      }*/
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
       JSONObject responseObject=new JSONObject();
     

         return responseObject;
    }

    /**
    * This method is used to get the oid of this flex object .
    * @param FlexObject  flexObject
    * @return String  it returns the oid of this flex object in the form of String
    */ 
    public String getOid(FlexObject flexObject){
        return "OR:com.lcs.wc.moa.LCSMOAObject:"+(String)flexObject.getString("LCSMOAOBJECT.IDA2A2"); 
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
    * This method is used to get the record that matched with the given oid of this flex object .
    * @param String  objectType
    * @param String oid
    * @Exception exception
    * @return JSONObject  it returns the records that matched the given oid of this flex object
    */ 
  public JSONObject getRecordByOid(String objectType,String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSMOAObject lcsMoaObjectInput = (LCSMOAObject) LCSQuery.findObjectById(oid);
        LCSMOAObject lcsMoaObject = lcsMoaObjectInput;
        try{
            lcsMoaObject = (LCSMOAObject) VersionHelper.latestIterationOf (lcsMoaObjectInput);
        }catch(Exception e){
            
        }
        jSONObject.put("createdOn",FormatHelper.applyFormat(lcsMoaObject.getCreateTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn",FormatHelper.applyFormat(lcsMoaObject.getModifyTimestamp(),"DATE_TIME_STRING_FORMAT"));
        jSONObject.put("typeId",FormatHelper.getObjectId(lcsMoaObject.getFlexType()));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsMoaObject).toString());
       //jSONObject.put("image", lcsMoaObject.getThumbnail());
        //jSONObject.put("oid",FormatHelper.getVersionId(lcsMoaObject).toString());
        jSONObject.put("oid",FormatHelper.getObjectId(lcsMoaObject).toString());
        jSONObject.put("IDA2A2",FormatHelper.getNumericObjectIdFromObject(lcsMoaObject));
        Collection attributes = lcsMoaObject.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
      while(it.hasNext()){
          FlexTypeAttribute att = (FlexTypeAttribute) it.next();
          String attKey = att.getAttKey();
          try{
              if(lcsMoaObject.getValue(attKey) == null){
                jSONObject.put(attKey,"");
              }
              else{
                jSONObject.put(attKey,lcsMoaObject.getValue(attKey).toString());
            }
          }catch(Exception e){
            }
      }
      DataConversionUtil datConUtil=new DataConversionUtil();
      return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsMoaObject.getFlexType()));  }

  /**
    * This method is used to get hierarchy of this flex object
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */
  public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception{
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.moa.LCSMOAObject"); 
  }

  /**
    * This method is used to get all MOA data and its objects
    * @Exception exception
    * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
    */

 /* public String getReportData( HttpServletRequest req, String objectType) throws WTException{
      //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get report data ***** "));
        Gson gson = new Gson();
        String records="Empty";
        JSONArray flexMOALinkArray = new JSONArray();
        JSONObject jsonObj = new JSONObject();
         MaterialModel materialModel = new MaterialModel();
         SeasonModel seasonModel = new SeasonModel();
    try{
        if(objectType.equalsIgnoreCase("Multi-Object")) {
            //VRDMOAObjectQuery lcsMOAObjectQuery=new VRDMOAObjectQuery();
            LCSMOAObjectQuery lcsMOAObjectQuery=new LCSMOAObjectQuery();
            FlexType moaType = FlexTypeCache.getFlexTypeFromPath("Multi-Object\\Material Aggregation");
            HashMap additionalCriteria = new HashMap();
            Collection activeSeasons = seasonModel.getActiveSeasons();
            String selectedSeasonsIds = "";
            Iterator activeSeasonsIter = activeSeasons.iterator();
            while(activeSeasonsIter.hasNext())
            {
              String activeSeason = (String) activeSeasonsIter.next();
              selectedSeasonsIds = FormatHelper.getNumericFromOid(activeSeason)+MOAHelper.DELIM;
              additionalCriteria.put(moaType.getAttribute("vrdSeasonRef"),selectedSeasonsIds);  
              JSONObject  flexSeasonObject = seasonModel.getRecordByOid("Season",activeSeason);
              //changes flexk
               Map criteria = RequestHelper.hashRequest(req);
              SearchResults  searchRecords=lcsMOAObjectQuery.findMOAByCriteria(criteria,moaType,null,additionalCriteria);
             // SearchResults results = query.findMOAByCriteria(criteria, flexType, attList, filter);
              Collection moaResponse = searchRecords.getResults();
              Iterator itrs = moaResponse.iterator();
              JSONArray flexMOASeasonArray = new JSONArray();
              while(itrs.hasNext()) {
              FlexObject data = (FlexObject) itrs.next();
              String flexMOAOid  = getOid(data);
              LCSMOAObject lcsMoaObject=(LCSMOAObject) LCSQuery.findObjectById(flexMOAOid);
              FlexType moaFlexType = lcsMoaObject.getFlexType();
              if(moaFlexType.getTypeName().equalsIgnoreCase("Material Aggregation"))
              {
                JSONObject  flexMOALinkObject = getRecordByOid("Multi-Object\\Material Aggregation",flexMOAOid);
                String materialOid = (String)flexMOALinkObject.get("vrdMaterialRef");
                JSONObject materialObject =  new JSONObject();
                if(!materialOid.equalsIgnoreCase(""))
                {
                  materialObject = materialModel.getRecordByOid("Material",materialOid);
                }
                flexMOALinkObject.put("Material",materialObject);
                flexMOASeasonArray.add(flexMOALinkObject);
               }
        
            }

            flexSeasonObject.put("MOA",flexMOASeasonArray);
            flexMOALinkArray.add(flexSeasonObject);
          }

        }
        else{
            records="Type not found";
        }
        }
        catch(Exception e){
        flexMOALinkArray.add(util.getExceptionJson(e.getMessage()));
        }
        jsonObj.put("MOA SEASON",flexMOALinkArray);
        records = gson.toJson(jsonObj);
        return records;
    }
*/
}