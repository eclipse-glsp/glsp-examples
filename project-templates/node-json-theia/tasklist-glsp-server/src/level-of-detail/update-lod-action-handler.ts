/********************************************************************************
 * Copyright (c) 2025 EclipseSource and others.
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
import { Action, ActionHandler, hasStringProp, MaybePromise, ModelState } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { setLod } from './model';

export type LevelOfDetail = (typeof LevelOfDetail)[keyof typeof LevelOfDetail];
export const LevelOfDetail = {
    OVERVIEW: 'overview', // < 0.40
    DETAIL: 'detail', // > 2.5
    DEFAULT: 'default' // otherwise
} as const;

export interface UpdateCurrentLodAction extends Action {
    kind: typeof UpdateCurrentLodAction.KIND;
    levelOfDetail: LevelOfDetail;
}

export namespace UpdateCurrentLodAction {
    export const KIND = 'updateCurrentLod';

    export function is(object: any): object is UpdateCurrentLodAction {
        return Action.hasKind(object, KIND) && hasStringProp(object, 'levelOfDetail');
    }

    export function create(levelOfDetail: LevelOfDetail): UpdateCurrentLodAction {
        return {
            kind: KIND,
            levelOfDetail
        };
    }
}

/**
 * Reacts to `UpdateCurrentLodAction` received from the client and stores the lod in the model state.
 * This ensures that the correct lod can be applied to the graph in the `GmodelFactory` on model updates
 */
@injectable()
export class UpdateLodActionHandler implements ActionHandler {
    @inject(ModelState)
    protected readonly modelState: ModelState;

    readonly actionKinds = [UpdateCurrentLodAction.KIND];

    execute(action: UpdateCurrentLodAction): MaybePromise<Action[]> {
        setLod(this.modelState, action.levelOfDetail);
        return [];
    }
}
