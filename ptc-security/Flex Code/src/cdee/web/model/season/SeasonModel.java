/*
 * Created on 06/10/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.model.season;

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
import com.lcs.wc.db.SearchResults;
import com.lcs.wc.season.LCSSeasonQuery;
import com.lcs.wc.db.FlexObject;
import java.util.Collection;
import cdee.web.services.GenericObjectService;
import com.lcs.wc.classification.FlexTypeClassificationTreeLoader;
import com.lcs.wc.flextype.FlexTypeCache;
import com.lcs.wc.foundation.LCSQuery;
import com.lcs.wc.flextype.FlexTypeAttribute;
import com.lcs.wc.season.LCSSeason;
import com.lcs.wc.season.LCSSeasonClientModel;
import wt.util.WTException;
import com.lcs.wc.season.LCSSeasonLogic;
import com.lcs.wc.classification.TreeNode;
import cdee.web.model.product.ProductModel;
import com.lcs.wc.product.LCSProduct;
import com.lcs.wc.product.LCSProductQuery;
import java.util.Vector;
import cdee.web.util.DataConversionUtil;
import cdee.web.exceptions.TypeIdNotFoundException;
import com.lcs.wc.util.VersionHelper;
import com.lcs.wc.season.LineSheetQuery;
import cdee.web.model.product.ProductModel;
import cdee.web.model.product.ColorwayModel;
import com.lcs.wc.db.FlexObject;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
 
public class SeasonModel extends GenericObjectService {
//private static final Logger LOGGER = LogR.getLogger(SeasonModel.class.getName());
//private static final String CLASSNAME = SeasonModel.class.getName();

    LCSSeasonQuery lcsSeasonQuery = new LCSSeasonQuery();
    AppUtil util = new AppUtil();

    /**
     * This method is used either insert or update the Season flex object that are  passed by using type as reference,
     * oid and array of different Season data 
     * Using this method we can insert/update several records of a Season flextype at a time.
     * @param type String 
     * @param oid String
     * @param SeasonJSONArray  Contains array of Season data
     * @exception Exception
     * @return JSONArray  It returns Season JSONArray object
     */
    public JSONObject saveOrUpdate(String type, String oid, JSONObject seasonJsonData,JSONObject payloadJson) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate initialized with type *****"+ type+"-----oid-------"+oid)); 
        JSONObject responseObject = new JSONObject();
        try {
            if (oid == null) {
                ArrayList list = util.getOidFromSeachCriteria(type, seasonJsonData,payloadJson);
                if (!(list.get(2).toString()).equalsIgnoreCase("no record")) {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSeason with criteria ***** "));
                    responseObject = updateSeason(list.get(2).toString(), type, payloadJson);
                } else {
                    //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling createSeason ***** "));
                    responseObject = createSeason(type, payloadJson);
                }
            } else {
                //if (LOGGER.isDebugEnabled())
                        //LOGGER.debug((Object) (CLASSNAME + "***** saveOrUpdate  calling updateSeason with oid ***** "));
                responseObject = updateSeason(oid, type, payloadJson);
            }
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }

    /**
     * This method is used to insert the Season flex object that are  passed by using type as reference.
     * Using this method we can insert several records of a Season flextype at a time.
     * @param type is a string 
     * @param seasonDataList  Contains attributes, typeId, oid(if existing)
     * @exception Exception
     * @return JSONArray  It returns Season JSONArray object
     */

    public JSONObject createSeason(String type, JSONObject seasonAttrsJSON) {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Create Season  initialized ***** "+ type));
        JSONObject responseObject = new JSONObject();
        LCSSeasonClientModel seasonClientModel = new LCSSeasonClientModel();
        try {
            String typeId = (String) seasonAttrsJSON.get("typeId");
            String prodTypeId = (String) seasonAttrsJSON.get("productTypeId");
            FlexType seasonType = FlexTypeCache.getFlexType(typeId);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormat(seasonAttrsJSON,type,(String)seasonAttrsJSON.get("typeId"));
            convertedAttrs.put("typeId", typeId);
            convertedAttrs.put("type", typeId);
            convertedAttrs.put("productTypeId", prodTypeId);
            AttributeValueSetter.setAllAttributes(seasonClientModel, convertedAttrs);
            seasonClientModel.save();
            responseObject = util.getInsertResponse(FormatHelper.getVersionId(seasonClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (TypeIdNotFoundException te) {
            responseObject = util.getExceptionJson(te.getMessage());
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used to update the Season flex object that are  passed by using OID as reference.
     * Using this method we can update several records of a Season flextype at a time.
     * @param oid   oid of an item(type) to update
     * @param seasonJsonObject  Contains Season data
     * @exception Exception
     * @return String  It returns OID of Season object
     */

    public JSONObject updateSeason(String oid, String type, JSONObject seasonJsonObject) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** Update sesaon  initialized ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        LCSSeasonClientModel seasonClientModel = new LCSSeasonClientModel();
        try {
            seasonClientModel.load(oid);
            DataConversionUtil datConUtil=new DataConversionUtil();
            Map convertedAttrs=datConUtil.convertJSONToFlexTypeFormatUpdate(seasonJsonObject,type,FormatHelper.getObjectId(seasonClientModel.getFlexType()));
            AttributeValueSetter.setAllAttributes(seasonClientModel, convertedAttrs);
            seasonClientModel.save();
            responseObject = util.getUpdateResponse(FormatHelper.getVersionId(seasonClientModel.getBusinessObject()).toString(), type, responseObject);
        } catch (Exception e) {
            responseObject = util.getExceptionJson(e.getMessage());
        }
        return responseObject;
    }


    /**
     * This method is used delete Season of given oid,
     * @param oid String 
     * @exception Exception
     * @return JSONObject  It returns response JSONObject object
     */
    public JSONObject delete(String oid) throws Exception {
       //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** delete using oid ***** "+ oid));
        JSONObject responseObject = new JSONObject();
        try {
            LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(oid);
            LCSSeasonLogic lcsSeasonLogic = new LCSSeasonLogic();
            lcsSeasonLogic.deleteSeason(lcsSeason);
            responseObject = util.getDeleteResponseObject("Season", oid, responseObject);
        } catch (WTException wte) {
             //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception in Delete  ***** "+wte.getMessage()));
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
        return new FlexTypeClassificationTreeLoader("com.lcs.wc.season.LCSSeason");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records ***** "));
        FlexType flexType = null;
        String typeId = (String) criteriaMap.get("typeId");
        if (typeId == null) {
            flexType = FlexTypeCache.getFlexTypeRoot(objectType);
        } else {
            flexType = FlexTypeCache.getFlexType(typeId);
        }
        SearchResults results = new LCSSeasonQuery().findByCriteria(criteriaMap, flexType, null, null, null);
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
           //LOGGER.debug((Object) (CLASSNAME + "***** Search by name ***** "+ name));
        Collection < FlexObject > response = lcsSeasonQuery.findByCriteria(criteria, flexType, null, null, null).getResults();
        String oid = (String) response.iterator().next().get("LCSSEASON.BRANCHIDITERATIONINFO");
        oid = "VR:com.lcs.wc.season.LCSSeason:" + oid;
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
        return "VR:com.lcs.wc.season.LCSSeason:" + (String) flexObject.getString("LCSSEASON.BRANCHIDITERATIONINFO");
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
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSSeason lcsSeasonInput = (LCSSeason) LCSQuery.findObjectById(oid);
        LCSSeason lcsSeason = lcsSeasonInput;
        try{
            lcsSeason = (LCSSeason) VersionHelper.latestIterationOf(lcsSeasonInput);
        }catch(Exception e){

        }
        jSONObject.put("createdOn", FormatHelper.applyFormat(lcsSeason.getCreateTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("modifiedOn", FormatHelper.applyFormat(lcsSeason.getModifyTimestamp(), "DATE_TIME_STRING_FORMAT"));
        jSONObject.put("image", null);
        //jSONObject.put("oid", FormatHelper.getVersionId(lcsSeason).toString());
        jSONObject.put("oid", util.getVR(lcsSeason));
        jSONObject.put("ORid",FormatHelper.getObjectId(lcsSeason).toString());
        jSONObject.put("typeId", FormatHelper.getObjectId(lcsSeason.getFlexType()));
        jSONObject.put("productTypeId", FormatHelper.getObjectId(lcsSeason.getProductType()));
        jSONObject.put("flexName", objectType);
        jSONObject.put("typeHierarchyName", lcsSeason.getFlexType().getFullNameDisplay(true));
        jSONObject.put("IDA2A2", FormatHelper.getNumericObjectIdFromObject(lcsSeason));
        jSONObject.put("BranchIdIterationInfo", FormatHelper.getNumericVersionIdFromObject(lcsSeason));
        String typeHierarchyName = (String) jSONObject.get("typeHierarchyName");
        jSONObject.put("hierarchyName", typeHierarchyName.substring(typeHierarchyName.lastIndexOf("\\") + 1));
        Collection attributes = lcsSeason.getFlexType().getAllAttributes();
        Iterator it = attributes.iterator();
        while (it.hasNext()) {
            FlexTypeAttribute att = (FlexTypeAttribute) it.next();
            String attKey = att.getAttKey();
            try {
                if (lcsSeason.getValue(attKey) == null) {
                    jSONObject.put(attKey, "");
                } else {
                    jSONObject.put(attKey, lcsSeason.getValue(attKey));
                }
            } catch (Exception e) {}
        }
        DataConversionUtil datConUtil=new DataConversionUtil();
        return datConUtil.convertFlexTypesToJSONFormat(jSONObject,objectType,FormatHelper.getObjectId(lcsSeason.getFlexType()));  
  }

    

   /**
    * This method retrives all active seasons for MOA
    * @Exception exception
    * @return return HAshmap active seasons
    */
  public Collection getActiveSeasons() throws Exception{
    //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get active seasons ***** "));
        Collection activeSeasons = new LCSSeasonQuery().findActiveSeasons().getResults();
        HashMap seasons = new HashMap();
        Collection seasonList = new Vector();
        FlexObject seasonObj;
        FlexType seasonType = FlexTypeCache.getFlexTypeRoot("Season");
        Iterator seasonIter = activeSeasons.iterator();
        while(seasonIter.hasNext()) {
          seasonObj = (FlexObject) seasonIter.next();
          seasons.put((String) seasonObj.get("LCSSEASON.BRANCHIDITERATIONINFO"),(String) seasonObj.get(seasonType.getAttribute("seasonName").getSearchResultIndex()));
          seasonList.add( "VR:com.lcs.wc.season.LCSSeason:"+(String) seasonObj.get("LCSSEASON.BRANCHIDITERATIONINFO"));
         }
        return seasonList; 
  } 


    public JSONObject getRecordByOid(String objectType, String oid, String association) throws Exception {
        //if (LOGGER.isDebugEnabled())
           //LOGGER.debug((Object) (CLASSNAME + "***** get records by oid ***** "+ oid));
        JSONObject jSONObject = new JSONObject();
        LCSSeason lcsSeason = (LCSSeason) LCSQuery.findObjectById(oid);
        try{
            if (association.equalsIgnoreCase("Product")) {
                jSONObject.put("Product", findProduct(lcsSeason));
            }else if (association.equalsIgnoreCase("Colorway")) {
                jSONObject.put("Colorway", findColorway(lcsSeason));
            }else if (association.equalsIgnoreCase("Product Season Link")) {
                jSONObject.put("Product Season Link", findProductSeasonLink(lcsSeason));
            }else if (association.equalsIgnoreCase("Colorway Season Link")) {
                jSONObject.put("Colorway Season Link", findColorwaySeasonLink(lcsSeason));
            }
        }catch(Exception e){
            
        }
        return jSONObject;
    }

	public JSONArray findProduct(LCSSeason lcsSeason) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find product with season***** "));
		JSONArray seasonArray = new JSONArray();
		try {

			Collection response = new LineSheetQuery().runSeasonProductReport(lcsSeason, false, new HashMap(), false,
					null, false, false, new Vector(), false, false);
			Iterator itr = response.iterator();
			while (itr.hasNext()) {
				FlexObject productFlexObject = (FlexObject) itr.next();
				String oid = "VR:com.lcs.wc.product.LCSProduct:" + FormatHelper.applyFormat(
						(String) productFlexObject.get("LCSPRODUCTSEASONLINK.PRODUCTSEASONREVID"),
						FormatHelper.LONG_FORMAT);
				JSONObject seasonObject = new ProductModel().getRecordByOid("Product", oid);
				seasonArray.add(seasonObject);
			}
		} catch (Exception e) {
			seasonArray.add(util.getExceptionJson(e.getMessage()));
		}
		return seasonArray;
	}

	public JSONArray findColorway(LCSSeason lcsSeason) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find colorway with season ***** "));
		JSONArray seasonArray = new JSONArray();
		try {

			Collection response = new LineSheetQuery().runSeasonProductReport(lcsSeason, true, new HashMap(), false,
					null, false, false, new Vector(), false, false);
			Iterator itr = response.iterator();
			while (itr.hasNext()) {
				FlexObject skuFlexObject = (FlexObject) itr.next();
				if (!FormatHelper.parseBoolean((String) skuFlexObject.get("LCSSKU.PLACEHOLDER"))) {
					String oid = "VR:com.lcs.wc.product.LCSSKU:" + FormatHelper.applyFormat(
							(String) skuFlexObject.get("LCSSKU.BRANCHIDITERATIONINFO"), FormatHelper.LONG_FORMAT);
					JSONObject seasonObject = new ColorwayModel().getRecordByOid("Colorway", oid);
					seasonArray.add(seasonObject);
				}
			}
		} catch (Exception e) {
			seasonArray.add(util.getExceptionJson(e.getMessage()));
		}
		return seasonArray;
	}

	public JSONArray findProductSeasonLink(LCSSeason lcsSeason) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find product with season***** "));
		JSONArray seasonArray = new JSONArray();
		try {

			Collection response = new LineSheetQuery().runSeasonProductReport(lcsSeason, false, new HashMap(), false,
					null, false, false, new Vector(), false, false);
			Iterator itr = response.iterator();
			while (itr.hasNext()) {
				FlexObject productFlexObject = (FlexObject) itr.next();
				String oid = "OR:com.lcs.wc.season.LCSProductSeasonLink:" + FormatHelper.applyFormat(
						(String) productFlexObject.get("LCSPRODUCTSEASONLINK.IDA2A2"), FormatHelper.LONG_FORMAT);
				JSONObject seasonObject = new ProductSeasonLinkModel().getRecordByOid("Product Season Link", oid);
				seasonArray.add(seasonObject);
			}
		} catch (Exception e) {
			seasonArray.add(util.getExceptionJson(e.getMessage()));
		}
		return seasonArray;
	}

	public JSONArray findColorwaySeasonLink(LCSSeason lcsSeason) {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug((Object) (CLASSNAME + "***** find colorway with season ***** "));
		JSONArray seasonArray = new JSONArray();
		try {

			Collection response = new LineSheetQuery().runSeasonProductReport(lcsSeason, true, new HashMap(), false,
					null, false, false, new Vector(), false, false);
			Iterator itr = response.iterator();
			while (itr.hasNext()) {
				FlexObject skuFlexObject = (FlexObject) itr.next();
				if (!FormatHelper.parseBoolean((String) skuFlexObject.get("LCSSKU.PLACEHOLDER"))) {
					String oid = "OR:com.lcs.wc.season.LCSSKUSeasonLink:" + FormatHelper.applyFormat(
							(String) skuFlexObject.get("LCSSKUSEASONLINK.IDA2A2"), FormatHelper.LONG_FORMAT);
					JSONObject seasonObject = new SkuSeasonLinkModel().getRecordByOid("Colorway Season Link", oid);
					seasonArray.add(seasonObject);
				}
			}
		} catch (Exception e) {
			seasonArray.add(util.getExceptionJson(e.getMessage()));
		}
		return seasonArray;
	}
    
}