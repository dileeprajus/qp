/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.common;

import static com.cdee.model.jolt.common.SpecStringParser.fixLeadingBracketSugar;
import static com.cdee.model.jolt.common.SpecStringParser.parseDotNotation;
import static com.cdee.model.jolt.common.SpecStringParser.removeEscapeChars;
import static com.cdee.model.jolt.common.SpecStringParser.removeEscapedValues;
import static com.cdee.model.jolt.common.SpecStringParser.stringIterator;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.cdee.model.jolt.common.pathelement.AmpPathElement;
import com.cdee.model.jolt.common.pathelement.ArrayPathElement;
import com.cdee.model.jolt.common.pathelement.AtPathElement;
import com.cdee.model.jolt.common.pathelement.DollarPathElement;
import com.cdee.model.jolt.common.pathelement.HashPathElement;
import com.cdee.model.jolt.common.pathelement.LiteralPathElement;
import com.cdee.model.jolt.common.pathelement.MatchablePathElement;
import com.cdee.model.jolt.common.pathelement.PathElement;
import com.cdee.model.jolt.common.pathelement.StarAllPathElement;
import com.cdee.model.jolt.common.pathelement.StarDoublePathElement;
import com.cdee.model.jolt.common.pathelement.StarRegexPathElement;
import com.cdee.model.jolt.common.pathelement.StarSinglePathElement;
import com.cdee.model.jolt.common.pathelement.TransposePathElement;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.utils.StringTools;

/**
 * Static utility class that creates PathElement(s) given a string key from a json spec document
 */
public class PathElementBuilder {

    private PathElementBuilder() {}

    /**
     * Create a path element and ensures it is a Matchable Path Element
     */
    public static MatchablePathElement buildMatchablePathElement(String rawJsonKey) {
        PathElement pe = PathElementBuilder.parseSingleKeyLHS( rawJsonKey );

        if ( ! ( pe instanceof MatchablePathElement ) ) {
            throw new SpecException( "Spec LHS key=" + rawJsonKey + " is not a valid LHS key." );
        }

        return (MatchablePathElement) pe;
    }

    /**
     * Visible for Testing.
     *
     * Inspects the key in a particular order to determine the correct sublass of
     *  PathElement to create.
     *
     * @param origKey String that should represent a single PathElement
     * @return a concrete implementation of PathElement
     */
    public static PathElement parseSingleKeyLHS( String origKey )  {

        String elementKey;  // the String to use to actually make Elements
        String keyToInspect;  // the String to use to determine which kind of Element to create

        if ( origKey.contains( "\\" ) ) {
            // only do the extra work of processing for escaped chars, if there is one.
            keyToInspect = removeEscapedValues( origKey );
            elementKey = removeEscapeChars( origKey );
        }
        else {
            keyToInspect = origKey;
            elementKey = origKey;
        }

        //// LHS single values
        if ( "@".equals( keyToInspect ) ) {
            return new AtPathElement( elementKey );
        }
        else if ( "*".equals( keyToInspect ) ) {
            return new StarAllPathElement( elementKey );
        }
        else if ( keyToInspect.startsWith( "[" ) ) {

            if ( StringTools.countMatches( keyToInspect, "[" ) != 1 || StringTools.countMatches(keyToInspect, "]") != 1 ) {
                throw new SpecException( "Invalid key:" + origKey + " has too many [] references.");
            }

            return new ArrayPathElement( elementKey );
        }
        //// LHS multiple values
        else if ( keyToInspect.startsWith("@") || keyToInspect.contains( "@(" ) ) {
            // The traspose path element gets the origKey so that it has it's escapes.
            return TransposePathElement.parse( origKey );
        }
        else if ( keyToInspect.contains( "@" ) ) {
            throw new SpecException( "Invalid key:" + origKey  + " can not have an @ other than at the front." );
        }
        else if ( keyToInspect.contains("$") ) {
            return new DollarPathElement( elementKey );
        }
        else if ( keyToInspect.contains("[") ) {

            if ( StringTools.countMatches(keyToInspect, "[") != 1 || StringTools.countMatches(keyToInspect, "]") != 1 ) {
                throw new SpecException( "Invalid key:" + origKey + " has too many [] references.");
            }

            return new ArrayPathElement( elementKey );
        }
        else if ( keyToInspect.contains( "&" ) ) {

            if ( keyToInspect.contains("*") )
            {
                throw new SpecException( "Invalid key:" + origKey + ", Can't mix * with & ) ");
            }
            return new AmpPathElement( elementKey );
        }
        else if ( keyToInspect.contains("*" ) ) {

            int numOfStars = StringTools.countMatches(keyToInspect, "*");

            if(numOfStars == 1){
                return new StarSinglePathElement( elementKey );
            }
            else if(numOfStars == 2){
                return new StarDoublePathElement( elementKey );
            }
            else {
                return new StarRegexPathElement( elementKey );
            }
        }
        else if ( keyToInspect.contains("#" ) ) {
            return new HashPathElement( elementKey );
        }
        else {
            return new LiteralPathElement( elementKey );
        }
    }

    /**
     * Parse the dotNotation of the RHS.
     */
    public static List<PathElement> parseDotNotationRHS( String dotNotation ) {
        String fixedNotation = fixLeadingBracketSugar( dotNotation );
        List<String> pathStrs = parseDotNotation( new LinkedList<String>(), stringIterator( fixedNotation ), dotNotation );

        return parseList( pathStrs, dotNotation );
    }

    /**
     * @param refDotNotation the original dotNotation string used for error messages
     * @return List of PathElements based on the provided List<String> keys
     */
    public static List<PathElement> parseList( List<String> keys, String refDotNotation ) {
        ArrayList<PathElement> paths = new ArrayList<>();

        for( String key: keys ) {
            PathElement path = parseSingleKeyLHS( key );
            if ( path instanceof AtPathElement ) {
                throw new SpecException( "'.@.' is not valid on the RHS: " + refDotNotation );
            }
            paths.add( path );
        }

        return paths;
    }
}
