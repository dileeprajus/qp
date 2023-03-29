/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.util;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

public class RecursiveJSON {

	public JSONObject removeAllOccurancesOfKey(JSONObject jsonObj, String remKey) throws Exception {
		Iterator iterator = jsonObj.keys();
		while (iterator.hasNext()) {
			String inputKey = (iterator.next().toString());
			if (jsonObj.get(inputKey) instanceof JSONObject) {
				removeAllOccurancesOfKey(jsonObj.getJSONObject(inputKey), remKey);
			} else if (jsonObj.get(inputKey) instanceof JSONArray) {
				if (inputKey.equalsIgnoreCase(remKey)) {
					iterator.remove();
				} else {
					JSONArray jsonArray = (JSONArray) jsonObj.get(inputKey);
					for (int i = 0; i < jsonArray.length(); i++) {
						if (jsonArray.get(i) instanceof JSONObject) {
							removeAllOccurancesOfKey(jsonArray.getJSONObject(i), remKey);
						}
					}
				}
			} else if (inputKey.equalsIgnoreCase(remKey)) {
				iterator.remove();
			}
		}
		return jsonObj;
	}

	public static void main(String[] args) throws Exception {
		RecursiveJSON jx = new RecursiveJSON();
		String str = "{\"lastName\": \"test\",\"country\": \"Brasil\",\"currentIndustry\": \"aaaaaaaaaaaaa\",\"internal\": {\"firstName\": \"tet\",\"firstNam1e\": \"tet\",\"second\": {\"firstName\": \"tet\",\"firstNam1e\": \"tet\"},\"name\": \"firstName\"},\"otherIndustry\": \"aaaaaaaaaaaaa\",\"currentOrganization\": \"test\",\"salary\": \"1234567\",\"employeeid\": \"160915848\",\"firstName\": [\"Singh\", \"Sandeep\"],\"firstName1e\": [\"firstName\", \"Singh\", \"Sandeep\"],\"email\": {\"third\": [{\"firstName\": \"tet\",\"firstNam1e\": [{\"firstName\": \"tet\",\"firstNam1e\": \"tet\"}]}],\"id\": \"test@email.com\"}}";

		JSONObject j = new JSONObject(str);
		//System.out.println(j);
		JSONObject aa = jx.removeAllOccurancesOfKey(j, "firstName");
		//System.out.println(aa);
	}

}