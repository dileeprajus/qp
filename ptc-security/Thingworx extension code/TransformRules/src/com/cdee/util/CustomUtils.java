/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.bazaarvoice.jolt.JsonUtils;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.modifier.function.Objects;

public class CustomUtils {

	//private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(CustomUtils.class);

	private static Map convertStringToMap(String inputStr) {
		String value = inputStr.substring(1, inputStr.length() - 1);
		value = value.replace("[", "");
		value = value.replace("]", "");
		String[] keyValuePairs = value.split(",");
		Map<String, String> map = new HashMap<>();
		for (int i = 0; i < keyValuePairs.length; i = i + 2) {
			String key = keyValuePairs[i].trim();
			String kValue = keyValuePairs[i+1].trim();
			if(key.contains("\"")){
				key = key.replace("\"", "");
			}

			if(kValue.contains("\"")){
				kValue = kValue.replace("\"", "");
			}

			map.put(key, kValue);
		}
		return map;
	}

	private static ArrayList<String> convertStringToList(String inputStr) {
		String value = inputStr.substring(1, inputStr.length() - 1);
		String[] keyValuePairs = value.split(",");
		ArrayList<String> inputList = new ArrayList<String>();
		for (int i = 0; i < keyValuePairs.length; i = i + 1) {
			String key = keyValuePairs[i].toString();
			if(key.contains("\"")){
				key = key.replace("\"", "");
			}
			inputList.add(key);
		}
		return inputList;
	}

	// sample input inputSearch=[A,P,B] optionsList = [[A,0],[R,1],[P,2],[*,3]]
	public static ArrayList<String> selectedOptionsList(String optionsList, String inputSearch) {
		Map map = convertStringToMap(optionsList);
		ArrayList<String> searchList = convertStringToList(inputSearch);
		ArrayList<String> outputList = new ArrayList<String>();
		for (int i = 0; i < searchList.size(); i++) {
			String temp = searchList.get(i).toString();
			if (map.containsKey(temp)) {
				outputList.add(map.get(temp).toString());
			} else if (map.containsKey("*")) {
				outputList.add(map.get("*").toString());
			} else {
				outputList.add(null);
			}
		}
		return outputList;
	}

	// sample input inputSearch=A optionsList = [[A,0],[R,1],[P,2],[*,3]]
	public static String selectedOption(String optionsList, String inputSearch) {
		Map map = convertStringToMap(optionsList);
		String output = null;
		if (map.containsKey(inputSearch)) {
			output = map.get(inputSearch).toString();
		} else if (map.containsKey("*")) {
			output = map.get("*").toString();
		}
		//		_logger.error("Map : " + map);
		//		_logger.error("OutputSe : " + output);
		return output;
	}

	public static Object min(List<Object> args) {
		if (args == null || args.size() == 0) {
			return Optional.empty();
		}
		Integer minInt = Integer.MAX_VALUE;
		Double minDouble = Double.MAX_VALUE;
		Long minLong = Long.MAX_VALUE;
		boolean found = false;

		for (Object arg : args) {
			if (arg instanceof Integer) {
				minInt = java.lang.Math.min(minInt, (Integer) arg);
				found = true;
			} else if (arg instanceof Double) {
				minDouble = java.lang.Math.min(minDouble, (Double) arg);
				found = true;
			} else if (arg instanceof Long) {
				minLong = java.lang.Math.min(minLong, (Long) arg);
				found = true;
			} else if (arg instanceof String) {
				Optional<?> optional = Objects.toNumber(arg);
				if (optional.isPresent()) {
					arg = optional.get();
					if (arg instanceof Integer) {
						minInt = java.lang.Math.min(minInt, (Integer) arg);
						found = true;
					} else if (arg instanceof Double) {
						minDouble = java.lang.Math.min(minDouble, (Double) arg);
						found = true;
					} else if (arg instanceof Long) {
						minLong = java.lang.Math.min(minLong, (Long) arg);
						found = true;
					}
				}
			}
		}
		if (!found) {
			return Optional.empty();
		}
		// explicit getter method calls to avoid runtime autoboxing
		if (minInt.longValue() <= minDouble.longValue() && minInt.longValue() <= minLong) {
			return minInt;
		} else if (minLong <= minDouble.longValue()) {
			return minLong;
		} else {
			return minDouble;
		}
	}

	public static Object max(List<Object> args) {
		if (args == null || args.size() == 0) {
			return Optional.empty();
		}
		Integer maxInt = Integer.MIN_VALUE;
		Double maxDouble = -(Double.MAX_VALUE);
		Long maxLong = Long.MIN_VALUE;
		boolean found = false;

		for (Object arg : args) {
			if (arg instanceof Integer) {
				maxInt = java.lang.Math.max(maxInt, (Integer) arg);
				found = true;
			} else if (arg instanceof Double) {
				maxDouble = java.lang.Math.max(maxDouble, (Double) arg);
				found = true;
			} else if (arg instanceof Long) {
				maxLong = java.lang.Math.max(maxLong, (Long) arg);
				found = true;
			} else if (arg instanceof String) {
				Optional<?> optional = Objects.toNumber(arg);
				if (optional.isPresent()) {
					arg = optional.get();
					if (arg instanceof Integer) {
						maxInt = java.lang.Math.max(maxInt, (Integer) arg);
						found = true;
					} else if (arg instanceof Double) {
						maxDouble = java.lang.Math.max(maxDouble, (Double) arg);
						found = true;
					} else if (arg instanceof Long) {
						maxLong = java.lang.Math.max(maxLong, (Long) arg);
						found = true;
					}
				}
			}
		}
		if (!found) {
			return Optional.empty();
		}
		// explicit getter method calls to avoid runtime autoboxing
		if(maxInt.longValue() >= maxDouble.longValue() && maxInt.longValue() >= maxLong) {
			return maxInt;
		} else if (maxLong >= maxDouble.longValue()) {
			return maxLong;
		} else {
			return maxLong;
		}
	}

	// sample input inputSearch=[A,P,B] optionsList = [[A,0],[R,1],[P,2],[*,3]]
	public String concatJsScript(String inputSearch) {
		ArrayList<String> searchList = convertStringToList(inputSearch);
		String respnseStr ="";
		for (int i = 0; i < searchList.size(); i++) {
			respnseStr = respnseStr + searchList.get(i).toString();


		}
		return respnseStr;
	}

	public static Map<String, String> parseOptionalList(String inputList) {
		JSONParser parser = new JSONParser();
		Map<String, String> resultsMap = new HashMap<String, String>();
		try{
			Object scriptObj = parser.parse(inputList);
			JSONArray scriptarray = (JSONArray)scriptObj;

			for (int i = 0; i < scriptarray.size() ; i++)
			{
				JSONObject jsonObject = new JSONObject();
				List<Object> chainrSpecJSON = JsonUtils.jsonToList(scriptarray.get(i).toString());
				resultsMap.put(chainrSpecJSON.get(0).toString(), chainrSpecJSON.get(1).toString());

			}

		}catch(Exception ex){
			System.out.println(ex);
		}
		return resultsMap;
	}
	
	public static List parseInputList(String searchList) {
		JSONParser parser = new JSONParser();
		Map<String, String> resultsMap = new HashMap<String, String>();
		List<Object> list = new ArrayList<Object>();
		try{
			Object scriptObj = parser.parse(searchList);
			JSONArray scriptarray = (JSONArray)scriptObj;
				for (int i = 0; i < scriptarray.size() ; i++)
			{
				list.add(scriptarray.get(i));
			}
		}catch(Exception ex){
			System.out.println(ex);
		}

		return list;
	}


	public static void main(String[] args) {

		List a = new ArrayList();
		a.add("2.1");
		a.add(2.2);
		a.add(4);
		a.add(10);
		a.add(1);

		// Integer i = 10;
		// Optional.<Number>of(i);

		// Integer i = (Integer)min(a);
		//System.out.println(max(a));

	}

}
