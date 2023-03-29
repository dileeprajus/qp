/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.model.jolt.common;

import static com.cdee.model.jolt.common.PathElementBuilder.parseDotNotationRHS;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.cdee.model.jolt.common.pathelement.EvaluatablePathElement;
import com.cdee.model.jolt.common.pathelement.PathElement;
import com.cdee.model.jolt.common.tree.WalkedPath;
import com.cdee.model.jolt.exception.SpecException;
import com.cdee.model.jolt.traversr.Traversr;
import com.cdee.model.jolt.utils.StringTools;

/**
 * Combines a Traversr with the ability to evaluate References against a WalkedPath.
 *
 * Convenience class for path based off a single dot notation String,
 *  like "rating.&1(2).&.value".
 *
 * This processes the dot notation path into internal data structures, so
 *  that the String processing only happens once.
 */
public abstract class PathEvaluatingTraversal {

    private final List<EvaluatablePathElement> elements;
    private final Traversr traversr;

    public PathEvaluatingTraversal( String dotNotation ) {

        if ( ( dotNotation.contains("*") && ! dotNotation.contains( "\\*" ) ) ||
             ( dotNotation.contains("$") && ! dotNotation.contains( "\\$" ) ) ) {
                throw new SpecException("DotNotation (write key) can not contain '*' or '$' : write key: " + dotNotation );
        }

        List<PathElement> paths;
        Traversr trav;

        if ( StringTools.isNotBlank( dotNotation ) ) {

            // Compute the path elements.
            paths = parseDotNotationRHS( dotNotation );

            // Use the canonical versions of the path elements to create the Traversr
            List<String> traversrPaths = new ArrayList<>( paths.size() );
            for ( PathElement pe : paths ) {
                traversrPaths.add( pe.getCanonicalForm() );
            }
            trav = createTraversr( traversrPaths );
        }
        else {
            paths = Collections.emptyList();
            trav = createTraversr( Arrays.asList( "" ) );
        }

        List<EvaluatablePathElement> evalPaths = new ArrayList<>( paths.size() );
        for( PathElement pe : paths ) {
            if ( ! ( pe instanceof EvaluatablePathElement ) ) {
                throw new SpecException( "RHS key=" + pe.getRawKey() + " is not a valid RHS key." );
            }

            evalPaths.add( (EvaluatablePathElement) pe );
        }

        this.elements = Collections.unmodifiableList( evalPaths );
        this.traversr = trav;
    }

    protected abstract Traversr createTraversr(List<String> paths);

    /**
     * Use the supplied WalkedPath, in the evaluation of each of our PathElements to
     *  build a concrete output path.  Then use that output path to write the given
     *  data to the output.
     *
     * @param data data to write
     * @param output data structure we are going to write the data to
     * @param walkedPath reference used to lookup reference values like "&1(2)"
     */
    public void write( Object data, Map<String, Object> output, WalkedPath walkedPath ) {
        List<String> evaledPaths = evaluate( walkedPath );
        if ( evaledPaths != null ) {
            traversr.set( output, evaledPaths, data );
        }
    }

    public Optional<Object> read( Object data, WalkedPath walkedPath ) {
        List<String> evaledPaths = evaluate( walkedPath );
        if ( evaledPaths == null ) {
            return Optional.empty();
        }

        return traversr.get( data, evaledPaths );
    }

    /**
     * Use the supplied WalkedPath, in the evaluation of each of our PathElements.
     *
     * If our PathElements contained a TransposePathElement, we may return null.
     *
     * @param walkedPath used to lookup/evaluate PathElement references values like "&1(2)"
     * @return null or fully evaluated Strings, possibly with concrete array references like "photos.[3]"
     */
    // Visible for testing
    public List<String> evaluate( WalkedPath walkedPath ) {

        List<String> strings = new ArrayList<>( elements.size() );
        for ( EvaluatablePathElement pathElement : elements ) {

            String evaledLeafOutput = pathElement.evaluate( walkedPath );
            if ( evaledLeafOutput == null ) {
                // If this output path contains a TransposePathElement, and when evaluated,
                //  return null, then bail
                return null;
            }
            strings.add( evaledLeafOutput );
        }

        return strings;
    }

    public int size() {
        return elements.size();
    }

    public PathElement get( int index ) {
        return elements.get( index );
    }

    /**
     * Testing method.
     */
    public String getCanonicalForm() {
        StringBuilder buf = new StringBuilder();

        for ( PathElement pe : elements ) {
            buf.append( "." ).append( pe.getCanonicalForm() );
        }

        return buf.substring( 1 ); // strip the leading "."
    }
}
