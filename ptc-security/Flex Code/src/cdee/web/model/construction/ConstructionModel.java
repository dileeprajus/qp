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
import com.lcs.wc.flextype.AttributeValueList;
import com.lcs.wc.flextype.FlexTypeAttribute;
import cdee.web.util.DataConversionUtil;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class ConstructionModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(ConstructionModel.class.getName());
    //private static final String CLASSNAME = ConstructionModel.class.getName();

    LCSConstructionQuery lcsConstructionQuery = new LCSConstructionQuery();
    LCSConstructionDetailsQuery lcsConstructionDetailQuery = new LCSConstructionDetailsQuery();
    Gson gson = new Gson();
    AppUtil util = new AppUtil();

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.construction.LCSConstructionInfo");
    }

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param typeId  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String typeId, String objectType, Map criteriaMap) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized  with get records***** "+ typeId));
        SearchResults results = new SearchResults();
        FlexType flexType = null;
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        results = lcsConstructionQuery.findConstructionInfoByCriteria(criteriaMap, flexType, false);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with search by name ***** "+ name));
        Collection < FlexObject > response = lcsConstructionQuery.findConstructionInfoByCriteria(criteria, flexType, false).getResults();
        String oid = (String) response.iterator().next().get("LCSCONSTRUCTIONINFO.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.construction.LCSConstructionInfo:" + oid;
        if (response.size() == 0) {
            return "no record";
        } else {
            return oid;
        }
    }

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param typeId  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public String getRecordsData(FlexType flexType) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records***** "));
        JSONObject object = new JSONObject();
        Map criteria = new HashMap();
        object.put("Construction Info", lcsConstructionQuery.findConstructionInfoByCriteria(criteria, flexType, false).getResults());
        object.put("Construction Detail", lcsConstructionDetailQuery.findConstructionDetailsByCriteria(null, flexType, null, false, false).getResults());
        return gson.toJson(object);
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
        return "VR:com.lcs.wc.construction.LCSConstructionInfo:" + (String) flexObject.getString("LCSCONSTRUCTIONINFO.BRANCHIDITERATIONINFO");
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