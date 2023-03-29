/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;

import com.cdee.model.jolt.JoltSample;
import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.Transform;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.exception.TransformException;
import com.cdee.model.jolt.modifier.function.Function;
import com.thingworx.entities.utils.ThingUtilities;
import com.thingworx.logging.LogUtilities;
import com.thingworx.things.Thing;
import com.thingworx.types.InfoTable;
import com.thingworx.types.collections.ValueCollection;

public class CustomProduct implements SpecDriven, Transform {

	public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(JoltSample.class);

	public interface WildCards {
		public static final String STAR = "*";
		public static final String OR = "|";
		public static final String ARRAY = "[]";
	}

	private final Key mapRoot;
	private final Key arrayRoot;

	/**
	 * Configure an instance of Defaultr with a spec.
	 *
	 * @throws SpecException
	 *             for a malformed spec or if there are issues
	 */
	@Inject
	public CustomProduct(Object spec) {
		String rootString = "root";
		{
			Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
			rootSpec.put(rootString, spec);
			mapRoot = Key.parseSpec(rootSpec).iterator().next();
		}
		{
			Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
			rootSpec.put(rootString + WildCards.ARRAY, spec);
			Key tempKey = null;
			try {
				tempKey = Key.parseSpec(rootSpec).iterator().next();
			} catch (NumberFormatException nfe) {
			}
			arrayRoot = tempKey;
		}
	}

	/**
	 * Top level standalone Defaultr method.
	 *
	 * @param input
	 *            JSON object to have defaults applied to. This will be
	 *            modified.
	 * @return the modified input
	 */

	public Object transform(Object input) {
		if (input == null) {
			input = new HashMap();
		}
		if (input instanceof List) {
			if (arrayRoot == null) {
				throw new TransformException("The Spec provided can not handle input that is a top level Json Array.");
			}
			arrayRoot.applyChildren(input);
		} else {
			mapRoot.applyChildren(input);
		}
		return input;
	}

	public static final class GetProduct extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			StringBuilder sb = new StringBuilder();
			try {
				System.out.println(argList.get(1).toString());
				Thing thing = ThingUtilities.findThing(argList.get(0).toString());
				ValueCollection collection = new ValueCollection();
				_logger.error("tables : " + argList.get(1).toString());
				org.json.JSONObject jsonObject = new org.json.JSONObject(argList.get(1).toString());
				_logger.error("tables : " + jsonObject.toString());
				collection.SetJSONValue("Data", jsonObject);
				InfoTable table = thing.processServiceRequest("GetInputData", collection);
				//_logger.error("table : " + table.toJSON().toString());
				//_logger.error("table : " + table.getFirstRow().getStringValue("result"));
				String json = table.getFirstRow().getStringValue("result");
				org.json.JSONObject jsonO = new org.json.JSONObject(json);
				String str = argList.get(2).toString();
				String[] arr = str.split("\\.");
				org.json.JSONObject object = (org.json.JSONObject) jsonO.get(arr[0]);
				_logger.error(object.toString());
				for (int i = 1; i < arr.length-1; i++) {
					 object = (org.json.JSONObject) object.get(arr[i]);
					 _logger.error(object.toString());
				}
				_logger.error(arr[arr.length-1].toString() + " : " + object.get(arr[arr.length-1]).toString());
				sb.append(object.get(arr[arr.length-1]));
			} catch (Exception e) {
				_logger.error("Service request failed : " + e.getMessage());
				e.printStackTrace();
			}
			return Optional.<Object> of(sb.toString());
		}
	}
}