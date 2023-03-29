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

/**
 * Marker interface for PathElements that contain the "*" wildcard.
 *
 * Three subclasses were created for performance reasons.
 */
public interface StarPathElement extends MatchablePathElement {

    /**
     * Method to see if a candidate key would match this PathElement.
     *
     * @return true if the provided literal will match this Element's regex
     */
    public boolean stringMatch( String literal );
}
