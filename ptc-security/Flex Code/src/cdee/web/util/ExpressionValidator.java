package cdee.web.util;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import org.json.simple.JSONObject;
import com.ptc.core.lwc.common.JepHelper;
import com.ptc.core.meta.common.FloatingPoint;
import com.ptc.core.meta.container.common.LWCFormula;
import com.singularsys.jep.Jep;
import com.singularsys.jep.JepException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import org.json.simple.JSONArray;
import java.util.HashMap;

import com.singularsys.jep.EvaluationException;

import com.singularsys.jep.ParseException;


import wt.util.WTException;

public class ExpressionValidator {

	public boolean execute(String formula, JSONObject inputObject)
			throws WTException, JsonParseException, JsonMappingException, IOException, JepException {

		boolean returnValue = false;
		
		Jep jep = LWCFormula.getLWCFormulaJep();
		Map<String, Object> map = new ObjectMapper().readValue(inputObject.toString(),
				new TypeReference<Map<String, Object>>() {
				});
	
		Set<String> allVariableNames = JepHelper.getVariables(formula);
		for (String varName : allVariableNames) {
			String[] allVarnames = LWCFormula.getVarNames(varName);
			for (String varname : allVarnames) {
				Object value = map.get(varName);
				if (value instanceof Number && !(value instanceof Long)) {
					value = new FloatingPoint(((Number) value).doubleValue(), 6);
				}
				jep.addVariable(varname, value);
			}
		}
		jep.parse(formula);
		Object value = jep.evaluate();
		returnValue = (boolean) value;
		return returnValue;
	}
	
	public boolean executeJ(String formula, JSONObject jinputObject,String objectType) throws WTException, ParseException, EvaluationException, JsonParseException, JsonMappingException, IOException
	{
		Jep jep = LWCFormula.getLWCFormulaJep();
		// Pass the formula string
	
		JSONObject objectData = (JSONObject)jinputObject.get("objectData");
		//
		
		Object intervention = objectData.get(objectType);
		JSONArray  interventionJsonArray = null;
		JSONObject interventionObject= null;
		if (intervention instanceof JSONArray) {
		    // It's an array
		    interventionJsonArray = (JSONArray)intervention;
		}
		else if (intervention instanceof JSONObject) {
		    // It's an object
		    interventionObject = (JSONObject)intervention;
		}
		//
		JSONObject inputObject = new JSONObject();
		//JSONObject inputObject = (JSONObject)objectData.get(objectType);
		if(interventionJsonArray!=null)
			inputObject = (JSONObject)interventionJsonArray.get(0);
		else
			inputObject = interventionObject;
		
		
	    Map<String,String> map = new HashMap<String,String>();
	    ObjectMapper mapper = new ObjectMapper();

	    map = mapper.readValue(inputObject.toString(), new TypeReference<HashMap>(){});

		final Set<String> unwrapped_varnames = JepHelper.getVariables(formula);
		// run a loop based on above Set
		 for (final String unwrapped_varname : unwrapped_varnames) {
			 final String[] all_varnames = LWCFormula.getVarNames(unwrapped_varname);
			  for (final String varname  : all_varnames) {
				  final String bound_value = map.get(unwrapped_varname).toString();
			
				  try {
					jep.addVariable(varname, bound_value);
				} catch (JepException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			  }
		 }
		 jep.parse(formula);
		 Object value = jep.evaluate();
		return (boolean) value;
	}

}
