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

import com.cdee.model.jolt.SpecDriven;
import com.cdee.model.jolt.Transform;
import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.defaultr.Key;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.exception.TransformException;
import com.cdee.model.jolt.modifier.function.Function;
import com.cdee.util.CustomUtils;
import com.thingworx.logging.LogUtilities;

public class CustomConcat implements SpecDriven, Transform {
	
//	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(CustomConcat.class);

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
    public CustomConcat( Object spec ) {
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
    
    public static Optional<Object> getOptionalVal(Object value) {
    	if (value == null) {
    		return (Optional)Optional.empty();
    	} else if (value instanceof Integer) {
    		return (Optional)Optional.<Number>of((Integer)value);
    	} else if (value instanceof Double) {
    		return (Optional)Optional.<Number>of((Double)value);
    	} else  if (value instanceof Long) {
    		return (Optional)Optional.<Number>of((Long)value);
    	} else {
    		return (Optional)Optional.empty();
    	}
    }
    
    public static final class concatS extends Function.ListFunction {
        @Override
        protected Optional<Object> applyList( final List<Object> argList ) {
            StringBuilder sb = new StringBuilder(  );
            for(Object arg: argList ) {
                if ( arg != null ) {
                    sb.append(arg.toString() );
                }
            }
            
            return Optional.<Object>of(sb.toString());
        }
    }
    
    public static final class optionalList extends Function.ListFunction {
        @Override
        protected Optional<Object> applyList( final List<Object> argList ) {
        	String inputSearch = argList.get(0).toString();        	
    		String optionsList = argList.get(1).toString(); //"[[A,0],[R,1],[P,2],[*,3]]";
    		optionsList = optionsList.replace( "\\", "" );
    		System.out.println(".........inputSearch..........."+inputSearch);
    	//	_logger.error("Input : " + inputSearch);
    	//	_logger.error("Option : " + optionsList);
    		return Optional.<Object>of(CustomUtils.selectedOption(optionsList, inputSearch));
        }
    }
    
    @SuppressWarnings( "unchecked" )
    public static final class max extends Function.BaseFunction<Object> {
        @Override
        protected Optional<Object> applyList( final List argList ) {
            Object maxValue = com.cdee.util.CustomUtils.max( argList );
            return getOptionalVal(maxValue); 
        }

        @Override
        protected Optional<Object> applySingle( final Object arg ) {
            if(arg instanceof Number) {
                return Optional.of(arg);
            }
            else {
                return Optional.empty();
            }
        }
    }

    @SuppressWarnings( "unchecked" )
    public static final class min extends Function.BaseFunction<Object> {

        @Override
        protected Optional<Object> applyList( final List<Object> argList ) {
        	Object minValue =  com.cdee.util.CustomUtils.min( argList );
        	return getOptionalVal(minValue);
        }

        @Override
        protected Optional<Object> applySingle(Object arg) {
            if(arg instanceof Number) {
                return Optional.of(arg);
            }
            else {
                return Optional.empty();
            }
        }
    }
    
    public static final class multiOptionalList extends  Function.ListFunction{
    	@Override
        protected Optional<Object> applyList( final List<Object> argList ) {
    		String inputSearch =  argList.get(0).toString(); //"[A,P,B]"; //
    		String optionsList = argList.get(1).toString(); //"[[A,0],[R,1],[P,2],[*,3]]";
    		optionsList = optionsList.replace( "\\", "" );
    		inputSearch = inputSearch.replace( "\\", "" );
            return Optional.<Object>of(CustomUtils.selectedOptionsList(optionsList, inputSearch));
        }
    }    
    /**
     * Static value allocation method.
     *
     * @param input object to have defaults applied to. This will be modified.
     * @return the modified input
     */
    
    public static final class placeHolder extends Function.SingleFunction<String> {
        @Override
        protected Optional<String> applySingle( final Object arg ) {
            return arg == null ? Optional.<String>of( null ): Optional.of( arg.toString() );
        }
    }
}