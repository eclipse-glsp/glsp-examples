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

import {
    Action,
    AnimationFrameSyncer,
    CommandExecutionContext,
    CommandReturn,
    Dimension,
    EditorContextService,
    FeedbackCommand,
    IActionDispatcher,
    IActionHandler,
    ICommand,
    LocalRequestBoundsAction,
    Point,
    SetViewportAction,
    TYPES,
    addCssClasses,
    forEachElement,
    hasStringProp,
    removeCssClasses,
    toTypeGuard
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { LevelOfDetail, LodCompartment, LodGGraph } from './lod-model';

/**
 * Viewport handler that reacts to zoom changes and updates the level of detail accordingly.
 */
@injectable()
export class LoDViewportHandler implements IActionHandler {
    @inject(EditorContextService)
    protected readonly editorContextService: EditorContextService;

    @inject(TYPES.IActionDispatcher)
    protected readonly actionDispatcher: IActionDispatcher;

    @inject(TYPES.AnimationFrameSyncer)
    protected readonly animationFrameSyncer: AnimationFrameSyncer;

    protected currentLevel: LevelOfDetail = LevelOfDetail.DEFAULT;
    protected currentZoom?: number;

    handle(action: Action): void | Action | ICommand {
        if (SetViewportAction.is(action)) {
            this.handleZoomChange(action.newViewport.zoom);
        }
    }

    get levelOfDetail(): LevelOfDetail {
        return this.currentLevel;
    }

    handleZoomChange(zoom: number): void {
        if (this.currentZoom === zoom) {
            return;
        }
        this.currentZoom = zoom;
        let newLod: LevelOfDetail = LevelOfDetail.DEFAULT;
        if (zoom > 2.5) {
            newLod = LevelOfDetail.DETAIL;
        } else if (zoom < 0.4) {
            newLod = LevelOfDetail.OVERVIEW;
        }

        if (newLod !== this.currentLevel) {
            this.currentLevel = newLod;
            this.actionDispatcher.dispatchAll([
                UpdateCurrentLodAction.create(this.currentLevel),
                LocalRequestBoundsAction.create(this.editorContextService.modelRoot)
            ]);
        }
    }
}

/**
 *  Action to update the current level of detail in the model and on the server.
 */
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
 *  Sets the current level of detail in the model and updates the CSS classes accordingly.
 */
@injectable()
export class UpdateLodCommand extends FeedbackCommand {
    static readonly KIND: string = UpdateCurrentLodAction.KIND;

    constructor(@inject(TYPES.Action) readonly action: UpdateCurrentLodAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandReturn {
        const model = context.root;
        if (model instanceof LodGGraph) {
            model.levelOfDetail = this.action.levelOfDetail;
            removeCssClasses(model, ['lod-overview', 'lod-detail', 'lod-default']);
            addCssClasses(model, [`lod-${this.action.levelOfDetail}`]);

            // Reset size of all lod compartments to ensure correct layouting
            forEachElement(model.index, toTypeGuard(LodCompartment), (compartment: LodCompartment) => {
                compartment.size = Dimension.EMPTY;
                compartment.position = Point.ORIGIN;
            });

            return model;
        }

        return { model, modelChanged: false };
    }
}
