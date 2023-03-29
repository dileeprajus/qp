/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.Transform;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.exception.TransformException;
import com.cdee.model.jolt.modifier.function.Function;
import com.cdee.util.CustomUtils;

public class CustomOperations implements SpecDriven, Transform {

	//public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(CustomOperations.class);

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
	public CustomOperations(Object spec) {
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

	public static final class evalJS extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			StringBuilder sb = new StringBuilder();
			Object result = null;
			CustomUtils customutils = new CustomUtils();
			ScriptEngineManager mgr = new ScriptEngineManager();
			ScriptEngine jsEngine = mgr.getEngineByName("JavaScript");
			String jsScript = "";
			try {
				String input = argList.get(0).toString();

				String scriptinput = argList.get(1).toString();

				JSONParser parser = new JSONParser();
				Object scriptObj = parser.parse(scriptinput);
				JSONArray scriptarray = (JSONArray) scriptObj;

				for (int i = 0; i < scriptarray.size(); i++) {

					jsScript = "var input =";
					Object scriptObj1 = parser.parse(scriptarray.get(i).toString());
					JSONArray internalScript = (JSONArray) scriptObj1;
					JSONObject scriptobj = new JSONObject();
					for (int j = 0; j < internalScript.size(); j++) {
						scriptobj = (JSONObject) internalScript.get(j);

						String inputDataType = (String) scriptobj.get("inputdatatype");
						String inputVal = checkInputDataType(inputDataType, input);

						jsScript = jsScript + inputVal + ";" + scriptobj.get("script");

						result = convert(jsEngine.eval(jsScript));

						String outputDataType = (String) scriptobj.get("outputdatatype");
						String outputVal = checkInputDataType(outputDataType, result.toString());
						input = outputVal;
					}

				}

			} catch (Exception e) {
				e.printStackTrace();
			}
			// return Optional.<Object> of(sb.toString());
			return getOptionalVal(result);
		}
	}
	
	private static Object convert(final Object obj) {
		System.out.println("JAVASCRIPT OBJECT: {}" + obj.getClass());
		if (obj instanceof Bindings) {
			try {
				final Class<?> cls = Class.forName("jdk.nashorn.api.scripting.ScriptObjectMirror");
				System.out.println("Nashorn detected");
				if (cls.isAssignableFrom(obj.getClass())) {
					final Method isArray = cls.getMethod("isArray");
					final Object result = isArray.invoke(obj);
					if (result != null && result.equals(true)) {
						final Method values = cls.getMethod("values");
						final Object vals = values.invoke(obj);
						if (vals instanceof Collection<?>) {
							final Collection<?> coll = (Collection<?>) vals;
							return coll.toArray(new Object[0]);
						}
					}
				}
			} catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException
					| IllegalArgumentException | InvocationTargetException e) {
			}
		}
		if (obj instanceof List<?>) {
			final List<?> list = (List<?>) obj;
			return list.toArray(new Object[0]);
		}
		return obj;
	}

	public static String checkInputDataType(String dataType, String input) {
		if (dataType.equalsIgnoreCase("String")) {
			return "'"+input+"'";
		} else if (dataType.equalsIgnoreCase("array")) {
			System.out.println(">>>>>>>array>>>>> "+input.length());
			
			return "'"+input+"'";
		}else
		{
			return input;
		}
	}

	
	public static Optional<Object> getOptionalVal(Object value) {
		if (value == null) {
			return (Optional)Optional.empty();
		} else {
			return Optional.of( value );
		}
	}
	private static ArrayList<String> convertStringToList(String inputStr) {
		String value = inputStr.substring(1, inputStr.length() - 1);
		String[] keyValuePairs = value.split("],");
		ArrayList<String> inputList = new ArrayList<String>();
		for (int i = 0; i < keyValuePairs.length; i = i + 1) {
			String key = keyValuePairs[i].toString();
			System.out.println("...........key..."+key);
			if(key.contains("\"")){
				key = key.replace("\"", "");
			}
			if(i<keyValuePairs.length-1)
				key = key+"]";
			System.out.println(".....modi......key..."+key);

			inputList.add(key);
		}
		return inputList;
	}
}