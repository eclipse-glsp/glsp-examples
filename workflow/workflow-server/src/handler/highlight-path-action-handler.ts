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
import { Action, ActionHandler, MaybePromise, ModelState, ModelSubmissionHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

export interface HighlightPathAction extends Action {
    kind: typeof HighlightPathAction.KIND;
    elementId: string;
}

export namespace HighlightPathAction {
    export const KIND = 'highlightPath';

    export function is(object: unknown): object is HighlightPathAction {
        return Action.hasKind(object, KIND);
    }

    export function create(elementId: string): HighlightPathAction {
        return {
            kind: KIND,
            elementId
        };
    }
}

@injectable()
export class HighlightPathActionHandler implements ActionHandler {
    actionKinds = [HighlightPathAction.KIND];

    @inject(ModelState)
    protected modelState: ModelState;

    @inject(ModelSubmissionHandler)
    protected modelSub: ModelSubmissionHandler;

    execute(action: HighlightPathAction, ...args: unknown[]): MaybePromise<Action[]> {
        this.removeHighlight();
        this.highlightPath(action.elementId);
        this.modelState.updateRoot(this.modelState.root);
        return this.modelSub.submitModelDirectly();
    }

    protected removeHighlight(): void {
        this.modelState.index.getAllEdges().forEach(edge => (edge.cssClasses = edge.cssClasses.filter(cssClass => cssClass !== 'pulse')));
    }

    protected highlightPath(elementId: string): void {
        const element = this.modelState.index.find(elementId);
        if (!element) {
            return;
        }
        this.modelState.index.getIncomingEdges(element).forEach(edge => {
            edge.cssClasses.push('pulse');
            this.highlightPath(edge.sourceId);
        });
    }
}
