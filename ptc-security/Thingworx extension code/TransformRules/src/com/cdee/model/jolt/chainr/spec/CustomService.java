/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.chainr.spec;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.cdee.model.jolt.ContextualTransform;
import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.common.tree.MatchedElement;
import com.cdee.model.jolt.common.tree.WalkedPath;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.modifier.OpMode;
import com.cdee.model.jolt.modifier.TemplatrSpecBuilder;
import com.cdee.model.jolt.modifier.function.Function;
import com.cdee.model.jolt.modifier.function.Strings;
import com.cdee.model.jolt.modifier.spec.ModifierCompositeSpec;

public class CustomService implements SpecDriven, ContextualTransform   {
	
	 private static final Map<String, Function> STOCK_FUNCTIONS = new HashMap<String, Function>(  );

	    static {
	        STOCK_FUNCTIONS.put( "toLower", new Strings.toLowerCase() );
	        STOCK_FUNCTIONS.put( "toUpper", new Strings.toUpperCase() );
	        STOCK_FUNCTIONS.put( "concat", new com.cdee.model.jolt.chainr.spec.CustomConcat.concatS() );
	        STOCK_FUNCTIONS.put( "min", new com.cdee.model.jolt.chainr.spec.CustomConcat.min() );
	        STOCK_FUNCTIONS.put( "max", new com.cdee.model.jolt.chainr.spec.CustomConcat.max() );
	        STOCK_FUNCTIONS.put( "join", new Strings.join() );
	        STOCK_FUNCTIONS.put( "fetchRemoteValue", new com.cdee.model.jolt.chainr.spec.CustomProduct.GetProduct() );
	        STOCK_FUNCTIONS.put( "multiOptionalList", new com.cdee.model.jolt.chainr.spec.CustomOptional.multiOptionalList() );
	        STOCK_FUNCTIONS.put( "optionalList", new com.cdee.model.jolt.chainr.spec.CustomOptional.optionalList() );
	        //STOCK_FUNCTIONS.put( "placeHolder", new com.cdee.model.jolt.chainr.spec.CustomConcat.placeHolder() );
	       // STOCK_FUNCTIONS.put( "customScript", new com.cdee.model.jolt.chainr.spec.CustomOperations.evalJS() );
	       STOCK_FUNCTIONS.put( "customScript", new com.cdee.model.jolt.chainr.spec.CallThingService.callEvalJS() );
	       STOCK_FUNCTIONS.put( "initiateAsync", new com.cdee.model.jolt.chainr.spec.CallThingService.initiateTrigger() );
	       STOCK_FUNCTIONS.put( "getAPIService", new com.cdee.model.jolt.chainr.spec.CallThingService.getServiceapi() );
	       
	    }
	    
	    private final Key mapRoot;
	    private final Key arrayRoot;
	    
	    private final ModifierCompositeSpec rootSpec;
	
	    @SuppressWarnings( "unchecked" )
	    private CustomService( Object spec, OpMode opMode, Map<String, Function> functionsMap ) {
	    	mapRoot = null;
	    	arrayRoot = null;
	        if ( spec == null ){
	            throw new SpecException( opMode.name() + " expected a spec of Map type, got 'null'." );
	        }
	        if ( ! ( spec instanceof Map ) ) {
	            throw new SpecException( opMode.name() + " expected a spec of Map type, got " + spec.getClass().getSimpleName() );
	        }

	        if(functionsMap == null || functionsMap.isEmpty()) {
	            throw new SpecException( opMode.name() + " expected a populated functions' map type, got " + (functionsMap == null?"null":"empty") );
	        }

	        functionsMap = Collections.unmodifiableMap( functionsMap );
	        TemplatrSpecBuilder templatrSpecBuilder = new TemplatrSpecBuilder( opMode, functionsMap );
	        rootSpec = new ModifierCompositeSpec( ROOT_KEY, (Map<String, Object>) spec, opMode, templatrSpecBuilder );
	    }	
	
	public static class Customization extends CustomService {

        public Customization( final Object spec ) {
            this( spec, STOCK_FUNCTIONS );
        }

        public Customization( Object spec, Map<String, Function> functionsMap ) {
            super( spec, OpMode.OVERWRITR, functionsMap );
        }
    }
	
    public Object transform( final Object input, final Map<String, Object> context ) {
        Map<String, Object> contextWrapper = new HashMap<String, Object>(  );
        contextWrapper.put( ROOT_KEY, context );

        MatchedElement rootLpe = new MatchedElement( ROOT_KEY );
        WalkedPath walkedPath = new WalkedPath();
        walkedPath.add( input, rootLpe );
        rootSpec.apply( ROOT_KEY, Optional.of( input), walkedPath, null, contextWrapper );
        return input;
    }
	
	}
