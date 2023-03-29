/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.json.JSONObject;
import org.json.simple.parser.JSONParser;

import com.bazaarvoice.jolt.JsonUtils;
import org.slf4j.Logger;
import com.thingworx.logging.LogUtilities;

public class JoltSample {
	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(JoltSample.class);
	
	public static String CFCInfoJson ="";
	public static String TransactionJson ="";
	public static String MCCJson ="";

	public static void main(String[] args) {
		//String inputJson = "{\"people\" : [ {\"firstName\" : \"Bob\",\"lastName\" : \"Smith\",\"address\" : {\"state\" : null}},{\"firstName\" : \"Sterling\",\"lastName\" : \"Archer\" }]}";
		//String specJson = "[{\"operation\": \"cusConcat\",\"spec\": {\"people\": {\"*\": {\"fullName\": \"=concatS(@(1,firstName),' ',@(1,lastName))\",\"address?\": {\"state\": \"Texas\" }        }      }    }  }]";
		//String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=evalJS(Hi, '['println(Hi);', '10+5', 'println(Hello);']')\"      }      }    }  }]";
		//String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=evalJS(9, '[var x; var y; var z;, x = 7.0;, y = 6.9;, z = x + y;]')\"      }      }    }  }]";
		String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=customScript(9, '[[\\\"var num = 20;\\\",\\\" input*num;\\\"])\"      }      }    }  }]";
		//String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=evalJS(9, '[[\\\"var num = \\\"kiran20\\\";\\\",\\\" input+num;\\\"],[\\\"var num = \\\"10\\\";\\\",\\\"input+num;\\\"]]')\"      }      }    }  }]";
		//String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=customScript(\\\"k\\\", '[[\\\"var num = \\\"@@kiran20@@\\\";\\\",\\\" input+num;\\\"],[\\\"var num = \\\"@@10@@\\\";\\\",\\\"input+num;\\\"]]')\"      }      }    }  }]";
		//String specJson = "[{\"operation\": \"customTransformation\",\"spec\": {\"people\": {\"*\": {\"address?\": {\"state\": \"Texas\" },\"minAB\" : \"=min(@(1,a),@(1,b))\", \"maxAB\" : \"=max(@(1,a),@(1,b))\" ,\"optionalList\" : \"=optionalList(@(1,p),'[[A,0],[R,1],[P,2],[*,3]]')\" ,\"multiOptionalList\" : \"=multiOptionalList(@(1,s),'[[A,0],[R,1],[P,2],[*,3]]')\", \"evalJS\":\"=evalJS(9, '[[\\\"var num = \\\\\"kiran20\\\\\";\\\",\\\" input+num;\\\"],[\\\"var num = \\\\\"10\\\\\";\\\",\\\"input+num;\\\"]]')\"      }      }    }  }]";
	    String inputJson = "{\"people\" : [ {\"firstName\" : \"Bob\",\"lastName\" : \"Smith\",\"a\": \"5\", \"b\" : \"10\", \"p\" :\"A\",\"s\" :\"[R,B]\", \"prodName\" : \"hello\",\"address\" : {\"state\" : null}, \"id\" : 12},{\"firstName\" : \"Sterling\",\"lastName\" : \"Archer\",\"a\": \"7\", \"b\" : \"8\",\"p\" :\"B\",\"s\" :\"[P,R,B]\",\"prodName\" : \"hi\" }]}";
	    String CFCInfoJson = "{\"people\" : [ {\"oooo\" : \"888\",\"lastName\" : \"Smith\",\"a\": \"5\", \"b\" : \"10\", \"p\" :\"A\",\"s\" :\"[R,B]\", \"prodName\" : \"hello\",\"address\" : {\"state\" : null}, \"id\" : 12},{\"firstName\" : \"Sterling\",\"lastName\" : \"Archer\",\"a\": \"7\", \"b\" : \"8\",\"p\" :\"B\",\"s\" :\"[P,R,B]\",\"prodName\" : \"hi\" }]}";
	    String TransactionJson = "{\"people\" : [ {\"oooo\" : \"888\",\"lastName\" : \"Smith\",\"a\": \"5\", \"b\" : \"10\", \"p\" :\"A\",\"s\" :\"[R,B]\", \"prodName\" : \"hello\",\"address\" : {\"state\" : null}, \"id\" : 12},{\"firstName\" : \"Sterling\",\"lastName\" : \"Archer\",\"a\": \"7\", \"b\" : \"8\",\"p\" :\"B\",\"s\" :\"[P,R,B]\",\"prodName\" : \"hi\" }]}";
	    String MCCJson = "{\"people\" : [ {\"oooo\" : \"888\",\"lastName\" : \"Smith\",\"a\": \"5\", \"b\" : \"10\", \"p\" :\"A\",\"s\" :\"[R,B]\", \"prodName\" : \"hello\",\"address\" : {\"state\" : null}, \"id\" : 12},{\"firstName\" : \"Sterling\",\"lastName\" : \"Archer\",\"a\": \"7\", \"b\" : \"8\",\"p\" :\"B\",\"s\" :\"[P,R,B]\",\"prodName\" : \"hi\" }]}";
	    //String specJson = ""[{\"operation\":\"shift\",\"spec\":{\"schema\":{"":\"JOLT_TEMP.PrimaryKey\",\"array\":{\"*\":{\"id\":\".schema.data\"}}}}}]";
	    //String specJson = " [   {     \"operation\": \"customTransformation\",     \"spec\": {       \"schema\": {  \"fullName\": \"=concatS(@(1,ptcmaterialName),' ',@(1,season))\",       \"season\": \"=selectedOption(@(1,season),'[[1673943,3284920],[3284920,3172610], [*,3]]')\"       }     }   } ]}";
	    //String inputJson = "{   \"schema\": {     \"typeId\": \"consectetur ullamco\",     \"ptcmaterialName\": \"e\",     \"season\": 123   } }";
		try {
			getTransformJSON(inputJson, specJson,CFCInfoJson,TransactionJson,MCCJson);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/*public static void main(String[] args) {
		String delimeterStr = "name.lname";
		String[] arr = delimeterStr.split("\\.");
		System.out.println("...."+arr.length+"...."+Arrays.toString(arr));
		try{
			org.json.simple.JSONObject obj = new org.json.simple.JSONObject();
			
	      obj.put("name", "foo");
	      org.json.simple.JSONObject  objname = new org.json.simple.JSONObject() ;
	      objname.put("fname", new Integer(100));
	      objname.put("lname", new Double(1000.21));
	      obj.put("name", objname);
	      obj.put("num", new Integer(100));
	      obj.put("balance", new Double(1000.21));
	      obj.put("is_vip", new Boolean(true));
	      System.out.print(obj);
	      System.out.println("......"+arr[0]);
	      System.out.println("......"+obj.get("name"));
		org.json.simple.JSONObject object = (org.json.simple.JSONObject) obj.get(arr[0]);
		
		System.out.println("....object...."+object);
	
		for (int i = 1; i < arr.length-1; i++) {
			 object = (org.json.simple.JSONObject) object.get(arr[i]);
		}
		System.out.println(object.get(arr[arr.length-1]));
		}catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
	}*/

	public static Object getTransformJSON(String joltInput, String JoltSpec, String inputInfoJson, String transformJson, String mccJson) throws IOException {
		//_logger.warn("joltInput...." + joltInput);
		//_logger.warn("JoltSpec...." + JoltSpec);
		//_logger.warn("inputInfoJson...." + inputInfoJson);
		//_logger.warn("transformJson...." + transformJson);
		//_logger.warn("mccJson...." + mccJson);
		CFCInfoJson = inputInfoJson;
		TransactionJson = transformJson;
		MCCJson = mccJson;
		List chainrSpecJSON = JsonUtils.jsonToList(JoltSpec);
		Chainr chainr = Chainr.fromSpec(chainrSpecJSON);
		Object inputJSON = JsonUtils.jsonToObject(joltInput);
		Object transformedOutput = chainr.transform(inputJSON);
	//	_logger.warn("CFCInfoJson in jolt.........: " + CFCInfoJson);
		org.json.simple.JSONObject resultObject = new org.json.simple.JSONObject();
		JSONParser parser = new JSONParser();
		Object object = null;
		try {
			object = parser.parse(JsonUtils.toJsonString(transformedOutput));
			resultObject.put("Result", object);
			//System.out.println(resultObject.toString());
		} catch (Exception e) {
			e.printStackTrace();
			_logger.warn("error  " + e.getMessage());
			//System.out.println(e.getMessage());
		}
		return object;
	}
}