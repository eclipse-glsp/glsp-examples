/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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
import {
    Action,
    ActionHandler,
    GModelRoot,
    LayoutEngine,
    ModelState,
    ModelSubmissionHandler,
    SetEditModeAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ModelTypes } from '../util/model-types';

export interface FilterAction extends Action {
    kind: typeof FilterAction.KIND;
    type?: string;
}

export namespace FilterAction {
    export const KIND = 'filter';

    export function is(object: unknown): object is FilterAction {
        return Action.hasKind(object, KIND);
    }

    export function create(options: { type?: string } = {}): FilterAction {
        return {
            kind: KIND,
            ...options
        };
    }
}

@injectable()
export class FilterActionHandler implements ActionHandler {
    actionKinds = [FilterAction.KIND];

    @inject(ModelState)
    protected modelState: ModelState;

    @inject(LayoutEngine)
    protected layoutEngine: LayoutEngine;

    @inject(ModelSubmissionHandler)
    protected modelSub: ModelSubmissionHandler;

    async execute(action: FilterAction, ...args: unknown[]): Promise<Action[]> {
        if (action.type !== 'reset') {
            this.modelState.set('model', deepCopy(this.modelState.root));
            this.filter();
            this.modelState.root.cssClasses.push('filtered');
            await this.layoutEngine.layout();
            return [...(await this.modelSub.submitModelDirectly()), SetEditModeAction.create('readonly')];
        }

        this.modelState.root.children = (this.modelState.get('model') as GModelRoot).children;
        this.modelState.set('model', undefined);

        return [...(await this.modelSub.submitModelDirectly()), SetEditModeAction.create('editable')];
    }

    protected filter(): void {
        const decisionNodes = this.modelState.index.getElements(ModelTypes.DECISION_NODE);
        const incomingAndOutgoingEdges = decisionNodes.flatMap(node => [
            ...this.modelState.index.getIncomingEdges(node),
            ...this.modelState.index.getOutgoingEdges(node)
        ]);
        const incomingAndOutgoingEdgeIds = incomingAndOutgoingEdges.map(edge => edge.id);

        const sourcesAndTargetsOfIncomingAndOutgoingEdges = incomingAndOutgoingEdges.flatMap(edge => [edge.sourceId, edge.targetId]);

        this.modelState.root.children = this.modelState.root.children.filter(
            element => sourcesAndTargetsOfIncomingAndOutgoingEdges.includes(element.id) || incomingAndOutgoingEdgeIds.includes(element.id)
        );
    }
}

function deepCopy<T>(obj: T, visited = new WeakMap()): T {
    // eslint-disable-next-line no-null/no-null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (visited.has(obj)) {
        return visited.get(obj);
    }

    const copy = Array.isArray(obj) ? [] : ({} as T);
    visited.set(obj, copy);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            (copy as any)[key] = deepCopy((obj as any)[key], visited);
        }
    }

    return copy as T;
}
