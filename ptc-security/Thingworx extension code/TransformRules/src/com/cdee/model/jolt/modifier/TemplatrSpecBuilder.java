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

package com.cdee.model.jolt.modifier;

import java.util.Map;

import com.cdee.model.jolt.common.spec.SpecBuilder;
import com.cdee.model.jolt.modifier.function.Function;
import com.cdee.model.jolt.modifier.spec.ModifierCompositeSpec;
import com.cdee.model.jolt.modifier.spec.ModifierLeafSpec;
import com.cdee.model.jolt.modifier.spec.ModifierSpec;

public class TemplatrSpecBuilder extends SpecBuilder<ModifierSpec> {

    public static final String CARET = "^";
    public static final String AT = "@";
    public static final String FUNCTION = "=";

    private final OpMode opMode;
    private final Map<String, Function> functionsMap;


    public TemplatrSpecBuilder( OpMode opMode, Map<String, Function> functionsMap ) {
        this.opMode = opMode;
        this.functionsMap = functionsMap;
    }

    @Override
    @SuppressWarnings( "unchecked" )
    public ModifierSpec createSpec( final String lhs, final Object rhs ) {
        if( rhs instanceof Map  && (!( (Map) rhs ).isEmpty())) {
            return new ModifierCompositeSpec(lhs, (Map)rhs, opMode, this );
        }
        else {
            return new ModifierLeafSpec( lhs, rhs, opMode, functionsMap );
        }
    }
}
