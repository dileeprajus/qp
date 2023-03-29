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
package cdee.web.model.document;

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
import com.lcs.wc.document.LCSDocumentToObjectLink;
import cdee.web.util.DataConversionUtil;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class DocumentObjectLinkModel extends GenericObjectService {
    //private static final Logger LOGGER = LogR.getLogger(DocumentObjectLinkModel.class.getName());
    //private static final String CLASSNAME = DocumentObjectLinkModel.class.getName();
    AppUtil util = new AppUtil();

    

    /**
     * This method is used to get the records of this flex object .
     * @param objectType  String
     * @param criteriaMap  Map
     * @exception Exception
     * @return JSONObject  it returns all the records of this flex object in the form of json
     */
    public JSONObject getRecords(String objectType, Map criteriaMap) throws Exception {
        return null;
    }

    /**
     * This method is used to get the oid of this flex object .
     * @param FlexObject  flexObject
     * @return String  it returns the oid of this flex object in the form of String
     */
    public String getOid(FlexObject flexObject) {
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
    public String searchByName(Map criteria, FlexType flexType, String name) throws Exception {
        
        return null;
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
           //LOGGER.debug((Object) (CLASSNAME + "***** initialized with get records by oid ***** "+oid));
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("oid", oid);
        return jsonObj;
    }

    /**
     * This method is used to get hierarchy of this flex object
     * @Exception exception
     * @return return hierarychy of this flex object in the form of FlexTypeClassificationTreeLoader
     */
    public FlexTypeClassificationTreeLoader getFlexTypeHierarchy() throws Exception {
        return null;
    }

}