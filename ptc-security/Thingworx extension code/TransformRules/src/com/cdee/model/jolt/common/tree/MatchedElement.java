/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
/*

 * Copyright 2016 Bazaarvoice, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.cdee.model.jolt.common.tree;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.cdee.model.jolt.common.pathelement.BasePathElement;
import com.cdee.model.jolt.common.pathelement.EvaluatablePathElement;

/**
 * MatchedElement is the result of a "match" between a spec PathElement and some input data.
 *
 * MatchedElements are not thread safe, and should instead be stack / single Thread/Transform specific.
 *
 * This mutability was specifically added for the the HashCount functionality, which allows Shiftr
 *  to transform data form maps to lists.
 */
public class MatchedElement extends BasePathElement implements EvaluatablePathElement {

    private final List<String> subKeys;

    private int hashCount = 0;

    public MatchedElement( String key ) {
        super(key);

        List<String> keys = new ArrayList<>(1);
        keys.add( key ); // always add the full key to index 0

        this.subKeys = Collections.unmodifiableList( keys );
    }

    public MatchedElement( String key, List<String> subKeys ) {
        super(key);

        if ( subKeys == null ) {
            throw new IllegalArgumentException( "MatchedElement for key:" + key + " got null list of subKeys" );
        }

        List<String> keys = new ArrayList<>( 1 + subKeys.size() );
        keys.add( key ); // always add the full key to index 0
        keys.addAll( subKeys );

        this.subKeys = Collections.unmodifiableList( keys );
    }

    @Override
    public String evaluate( WalkedPath walkedPath ) {
        return getRawKey();
    }

    @Override
    public String getCanonicalForm() {
        return getRawKey();
    }

    public String getSubKeyRef( int index ) {
        if ((index < 0) || (index >= this.subKeys.size())) {
            throw new IndexOutOfBoundsException( "MatchedElement "+ this.subKeys +" cannot be indexed with index "+index );
        }
        return subKeys.get( index );
    }

    public int getSubKeyCount(){
        return subKeys.size();
    }

    public int getHashCount() {
        return hashCount;
    }

    /**
     * Here be mutability...
     */
    public void incrementHashCount() {
        hashCount++;
    }
}
