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
package cdee.web.model.logEntry;


import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.Map;
import java.util.Iterator;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import com.lcs.wc.foundation.LCSLogEntryClientModel;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.AttributeValueSetter;
import cdee.web.util.AppUtil;
import com.lcs.wc.flextype.FlexType;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.foundation.LCSLogEntryQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.color.LCSColor;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.foundation.LCSLogEntry;
import com.lcs.wc.flextype.AttributeValueList;
import com.google.gson.Gson;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.util.RequestHelper;
import javax.servlet.http.HttpServletRequest; 
import com.lcs.wc.db.Criteria;
import com.lcs.wc.db.PreparedQueryStatement;
import com.lcs.wc.db.QueryColumn;
import com.lcs.wc.db.QueryStatement;
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.report.FiltersList;
import java.util.Collection;
import com.lcs.wc.util.LCSProperties;
import wt.util.WTException;
import com.lcs.wc.foundation.LCSLogEntryLogic;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class LogEntryModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(LogEntryModel.class.getName());
    //private static final String CLASSNAME = LogEntryModel.class.getName();
    LCSLogEntryQuery logEntryQuery = new LCSLogEntryQuery();
    AppUtil util = new AppUtil();
    Gson gson = new Gson();
private static final boolean CASE_INSENSITIVE_SORT = LCSProperties.getBoolean((String)"com.lcs.wc.foundation.LCSLogEntryQuery.caseInsensitiveSort");


    /**
     * This method is used to update the LogEntry Object flex object that are  passed by using OID as reference.
     * @param oid   oid of an item(type) to update
     * @param type
     * @param boJsonObject  Contains LogEntry Object data
     * @exception Exception
     * @return JSONObject  It returns OID of LogEntry Object
     */

    public JSONObject updateLogEntry(String oid, String type, JSONObject boJsonObject) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update Log Entry initialized with oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        
        try {
            LCSLogEntry logEntry = (LCSLogEntry) LCSQuery.findObjectById(oid);
            if (logEntry == null)
                return responseObject;
            
            DataConversionUtil datConUtil = new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(boJsonObject,type,(String)boJsonObject.get("typeId"));
            AttributeValueSetter.setAllAttributes(logEntry,convertedAttrs);
            
            logEntry =  new LCSLogEntryLogic().saveLog(logEntry);
            responseObject = util.getUpdateResponse(FormatHelper.getObjectId(logEntry).toString(), type, responseObject);
        } catch (Exception e) {

            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    public JSONObject delete(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Delete initialized with oid ***** "+oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSLogEntry lcsLogEntry = (LCSLogEntry) LCSQuery.findObjectById(oid);
            LCSLogEntryLogic lcsLogEntryLogic = new LCSLogEntryLogic();
            lcsLogEntryLogic.deleteLog(lcsLogEntry);
            responseObject = util.getDeleteResponseObject("Log Entry", oid, responseObject);
        } catch (WTException wte) {
            responseObject = util.getExceptionJson(wte.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the LogEntry Object flex object that are  passed by using type as reference.
     * @param type is a string 
     * @param boDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONObject  It returns LogEntry Object JSONObject 
     */

    public JSONObject createLogEntry(String type, JSONObject boDataList) {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Log Entry initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSLogEntryClientModel logEntryClientModel = new LCSLogEntryClientModel();
        try {
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(boDataList,type,(String)boDataList.get("typeId"));
            LCSLogEntry logEntry = LCSLogEntry.newLCSLogEntry();
            logEntry.setFlexType(FlexTypeCache.getFlexTypeFromPath((String)boDataList.get("typeHierarchyName")));
            AttributeValueSetter.setAllAttributes(logEntry,convertedAttrs);
            
            logEntry =  new LCSLogEntryLogic().saveLog(logEntry);
            responseObject = util.getInsertResponse(FormatHelper.getObjectId(logEntry), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used either insert or update the LogEntry Object flex object that are  passed by using type as reference,
     * Using this method we can insert/update several records of a LogEntry Object flextype at a time.
     * @param type String 
     * @param oid String
     * @param boJSONObject  Contains LogEntry Object data
     * @exception Exception
     * @return JSONObject  It returns Bussiness Object JSONObject object
     */
    public JSONObject saveOrUpdate(String type, String oid,JSONObject searchJson,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type + "---oid------" + oid)); 
        JSONObject responseObject = new JSONObject();
        try { 
            if (oid == null) {
                 ArrayList list = util.getOidFromSeachCriteria(type, searchJson,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateLogEntry with creteria***** "));
                    responseObject = updateLogEntry(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createLogEntry ***** "));
                    responseObject = createLogEntry(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateLogEntry with oid***** "+oid));
                responseObject = updateLogEntry(oid, type, payloadJson);
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.foundation.LCSLogEntry");
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
           //LOGGER.debug((Object) (CLASSNAME + "*****  initialized with search by name***** "+ name));
        Collection < FlexObject > response = findLogEntriesByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = oid = (String) response.iterator().next().get("LCSLOGENTRY.IDA2A2");
        oid = "OR:com.lcs.wc.foundation.LCSLogEntry:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = findLogEntriesByCriteria(criteriaMap, flexType, null, null, null);
        return util.getResponseFromResults(results, objectType);
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "OR:com.lcs.wc.foundation.LCSLogEntry:" + (String) flexObject.getString("LCSLOGENTRY.IDA2A2");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Get RecordByOid initialized with oid ***** "+oid));
        JSONObject jSONObject = new JSONObject();
        LCSLogEntry lcsLogEntryInput = (LCSLogEntry) LCSQuery.findObjectById(oid);
        LCSLogEntry lcsLogEntry = lcsLogEntryInput;
        try{
            lcsLogEntry = (LCSLogEntry) VersionHelper.latestIterationOf(lcsLogEntryInput);
        }catch(Exception e){
        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsLogEntry.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsLogEntry.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsLogEntry.getFlexType()));
        //jSONObject.put("created By", lcsLogEntry.getCreatorFullName());
        jSONObject.put("flexName", objectType);
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsLogEntry).toString());
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsLogEntry).toString());
        jSONObject.put("typeHierarchyName", lcsLogEntry.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsLogEntry));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        //required here
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        String updated = sdf.format(lcsLogEntry.getModifyTimestamp());
        jSONObject.put("orderingTimestamp",updated);
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsLogEntry.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsLogEntry.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsLogEntry.getValue(attKey).toString());
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsLogEntry.getFlexType()));    
    }
    
    public SearchResults findLogEntriesByCriteria(Map request, FlexType type, Collection attCols, FiltersList filter, Collection oidList) throws WTException {
         //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Find log entries By criteria ***** "));
        String sortParam;
        PreparedQueryStatement statement = new PreparedQueryStatement();
        statement.appendFromTable(LCSLogEntry.class);
        statement.appendSelectColumn(new QueryColumn(LCSLogEntry.class, "thePersistInfo.theObjectIdentifier.id"));
        //LCSLogEntryQuery.determineRanges(request, (QueryStatement)statement);
        LCSLogEntryQuery.addFlexTypeInformation(request, (FlexType)type, (Collection)attCols, (FiltersList)filter, (PreparedQueryStatement)statement, LCSLogEntry.class, (String)"LCSLogEntry");

        if (filter != null && !FiltersList.TEMPLATE_FILTER_TYPE.equals(filter.getFilterType())) {
            filter.addFilterCriteria(statement);
        }
        if (oidList != null) {
            Iterator it = oidList.iterator();
            statement.appendAndIfNeeded();
            statement.appendOpenParen();
            while (it.hasNext()) {
                String numeric = FormatHelper.getNumericFromOid((String)((String)it.next()));
                statement.appendOrIfNeeded();
                statement.appendCriteria(new Criteria(new QueryColumn(LCSLogEntry.class, "thePersistInfo.theObjectIdentifier.id"), "?", "="), (Object)new Long(numeric));
            }
            statement.appendClosedParen();
        }

        SearchResults results = null;
        results = LCSLogEntryQuery.runDirectQuery((QueryStatement)statement);
        return results;
    }

}