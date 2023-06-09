/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
/*
 * Copyright 2014 Bazaarvoice, Inc.
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
package com.cdee.model.jolt.common;

import java.util.List;

import com.cdee.model.jolt.traversr.SimpleTraversr;
import com.cdee.model.jolt.traversr.Traversr;

/**
 * The TransposeReader uses a PathEvaluatingTraversal with a SimpleTraversr.
 *
 * This means that as it walks a path in a tree structure (PathEvaluatingTraversal),
 * it uses the behavior of the SimpleTraversr for tree traversal operations like
 * get, set, and final set.
 */
public class TransposeReader extends PathEvaluatingTraversal {

    public TransposeReader( String dotNotation ) {
        super( dotNotation );
    }

    @Override
    protected Traversr createTraversr( List<String> paths ) {
        return new SimpleTraversr( paths );
    }
}
