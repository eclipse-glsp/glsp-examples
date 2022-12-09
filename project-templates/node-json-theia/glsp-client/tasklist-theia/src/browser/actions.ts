/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
import { Action, hasStringProp, Operation } from '@eclipse-glsp/client';

/*********************************************
 * MY CUSTOM ACTION
 *********************************************/
export interface MyCustomAction extends Action {
    kind: typeof MyCustomAction.KIND;
    elementId: string;
}

export namespace MyCustomAction {
    export const KIND = 'myCustomAction';

    export function is(object: any): object is MyCustomAction {
        return Operation.hasKind(object, KIND) && hasStringProp(object, 'elementId');
    }

    export function create(elementId: string): MyCustomAction {
        return {
            kind: KIND,
            elementId
        };
    }
}

/*********************************************
 * MY CUSTOM OPERATION
 *********************************************/
export interface IncreaseTaskDifficultyOperation extends Operation {
    kind: typeof IncreaseTaskDifficultyOperation.KIND;
    elementId: string;
}

export namespace IncreaseTaskDifficultyOperation {
    export const KIND = 'increaseTaskDifficulty';

    export function is(object: any): object is IncreaseTaskDifficultyOperation {
        return Operation.hasKind(object, KIND) && hasStringProp(object, 'elementId');
    }

    export function create(elementId: string): IncreaseTaskDifficultyOperation {
        return {
            kind: KIND,
            isOperation: true,
            elementId
        };
    }
}
