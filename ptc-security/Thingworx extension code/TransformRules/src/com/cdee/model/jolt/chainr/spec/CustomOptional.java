/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;

import com.bazaarvoice.jolt.JsonUtils;
import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.Transform;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.exception.TransformException;
import com.cdee.model.jolt.modifier.function.Function;
import com.cdee.util.CustomUtils;
import com.thingworx.logging.LogUtilities;

public class CustomOptional implements SpecDriven, Transform {
	
	//private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(CustomOptional.class);

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
     * @throws SpecException for a malformed spec or if there are issues
     */
    @Inject
    public CustomOptional( Object spec ) {
        String rootString = "root";
        {
            Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
            rootSpec.put( rootString, spec );
            mapRoot = Key.parseSpec( rootSpec ).iterator().next();
        }
        {
            Map<String, Object> rootSpec = new LinkedHashMap<String, Object>();
            rootSpec.put( rootString + WildCards.ARRAY, spec );
            Key tempKey = null;
            try {
                tempKey = Key.parseSpec( rootSpec ).iterator().next();
            }
            catch ( NumberFormatException nfe ) {
            }
            arrayRoot = tempKey;
        }
    }

    /**
     * Top level standalone Defaultr method.
     *
     * @param input JSON object to have defaults applied to. This will be modified.
     * @return the modified input
     */
    
    public Object transform( Object input ) {
        if ( input == null ) {
            input = new HashMap();
        }
        if ( input instanceof List ) {
            if  ( arrayRoot == null ) {
                throw new TransformException( "The Spec provided can not handle input that is a top level Json Array." );
            }
            arrayRoot.applyChildren( input );
        }
        else {
            mapRoot.applyChildren( input );
        }

        return input;
    }
    
   
	public static final class optionalList extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			String output = null;
			String inputSearch = argList.get(0).toString();
			String optionsList = argList.get(1).toString(); // "[[A,0],[R,1],[P,2],[*,3]]";

			Map<String, String> resultsMap = com.cdee.util.CustomUtils.parseOptionalList(optionsList);
			if (resultsMap.containsKey(inputSearch)) {
				output = resultsMap.get(inputSearch).toString();
			} else if (resultsMap.containsKey("*")) {
				output = resultsMap.get("*").toString();
			}

			return Optional.<Object> of(output);
		}
	}
    
   
	public static final class multiOptionalList extends Function.ListFunction {
		@Override
		protected Optional<Object> applyList(final List<Object> argList) {
			String inputSearch = argList.get(0).toString(); // "[A,P,B]"; //

			String optionsList = argList.get(1).toString(); // "[[A,0],[R,1],[P,2],[*,3]]";

			List<Object> searchList = com.cdee.util.CustomUtils.parseInputList(inputSearch);

			ArrayList<String> outputList = new ArrayList<String>();
			Map<String, String> resultsMap = com.cdee.util.CustomUtils.parseOptionalList(optionsList);
			for (int i = 0; i < searchList.size(); i++) {
				String temp = searchList.get(i).toString();

				if (resultsMap.containsKey(temp)) {
					outputList.add(resultsMap.get(temp).toString());
				}
			}
			if (outputList.size() == 0) {
				if (resultsMap.containsKey("*")) {
					outputList.add(resultsMap.get("*").toString());
				} else {
					outputList.add(null);
				}

			}

			return Optional.<Object> of(outputList);
		}
	}  
}
