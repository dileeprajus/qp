/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
/*

 * Copyright 2013 Bazaarvoice, Inc.
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
package com.cdee.model.jolt.common.pathelement;

import com.cdee.model.jolt.common.Optional;
import com.cdee.model.jolt.common.tree.ArrayMatchedElement;
import com.cdee.model.jolt.common.tree.MatchedElement;
import com.cdee.model.jolt.common.tree.WalkedPath;

/**
 * PathElement for the lone "*" wildcard.   In this case we can avoid doing any
 *  regex or string comparison work at all.
 */
public class StarAllPathElement implements StarPathElement {

    public StarAllPathElement( String key ) {
        if ( ! "*".equals( key ) ) {
            throw new IllegalArgumentException( "StarAllPathElement key should just be a single '*'.  Was: " + key );
        }
    }

    /**
     * @param literal test to see if the provided string will match this Element's regex
     * @return true if the provided literal will match this Element's regex
     */
    @Override
    public boolean stringMatch( String literal ) {
        return true;
    }

    @Override
    public MatchedElement match( String dataKey, WalkedPath walkedPath ) {
        Optional<Integer> origSizeOptional = walkedPath.lastElement().getOrigSize();
        if(origSizeOptional.isPresent()) {
            return new ArrayMatchedElement( dataKey, origSizeOptional.get() );
        }
        else {
            return new MatchedElement( dataKey );
        }
    }

    @Override
    public String getCanonicalForm() {
        return "*";
    }

    @Override
    public String getRawKey() {
        return "*";
    }
}
