/********************************************************************************
 * Copyright (c) 2023-2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { hasObjectProp, hasStringProp } from '@eclipse-glsp/client';
import { Action, RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

export const REQUEST_ELEMENT_DATA_ACTION_ID = 'requestElementData';

export interface RequestElementDataAction extends RequestAction<SetElementDataAction> {
    kind: typeof REQUEST_ELEMENT_DATA_ACTION_ID;
    elementId: string;
}

export function isRequestElementDataAction(object: any): object is RequestElementDataAction {
    return Action.hasKind(object, REQUEST_ELEMENT_DATA_ACTION_ID) && hasStringProp(object, 'elementId');
}

export function createRequestElementDataAction(elementId: string): RequestElementDataAction {
    return {
        kind: REQUEST_ELEMENT_DATA_ACTION_ID,
        requestId: RequestAction.generateRequestId(),
        elementId
    };
}

export const SET_ELEMENT_DATA_ACTION_ID = 'setElementData';

export interface ElementData {
    elementName: string;
}

export interface SetElementDataAction extends Action, ResponseAction {
    kind: typeof SET_ELEMENT_DATA_ACTION_ID;
    elementData: ElementData;
}

export function isSetElementDataAction(object: any): object is SetElementDataAction {
    return Action.hasKind(object, SET_ELEMENT_DATA_ACTION_ID) && hasObjectProp(object, 'elementData');
}
