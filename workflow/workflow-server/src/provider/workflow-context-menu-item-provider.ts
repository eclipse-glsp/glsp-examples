/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { Action, Args, ContextMenuItemProvider, CreateNodeOperation, MenuItem, ModelState, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { GridSnapper } from '../handler/grid-snapper';
import { HighlightPathAction } from '../handler/highlight-path-action-handler';
import { ModelTypes } from '../util/model-types';

export interface SetUIExtensionVisibilityAction extends Action {
    kind: typeof SetUIExtensionVisibilityAction.KIND;
    extensionId: string;
    visible: boolean;
    contextElementsId: string[];
}
export namespace SetUIExtensionVisibilityAction {
    export const KIND = 'setUIExtensionVisibility';

    export function create(options: {
        extensionId: string;
        visible: boolean;
        contextElementsId?: string[];
    }): SetUIExtensionVisibilityAction {
        return {
            kind: KIND,
            extensionId: options.extensionId,
            visible: options.visible,
            contextElementsId: options.contextElementsId ?? []
        };
    }
}

@injectable()
export class WorkflowContextMenuItemProvider extends ContextMenuItemProvider {
    @inject(ModelState)
    protected modelState: ModelState;

    getItems(selectedElementIds: string[], position: Point, args?: Args): MenuItem[] {
        const showFilter: MenuItem = {
            id: 'showFilter',
            label: 'Show Filter',
            actions: [SetUIExtensionVisibilityAction.create({ extensionId: 'filter-ui', visible: true })]
        };

        if (selectedElementIds.length === 1) {
            const highlightPath: MenuItem = {
                id: 'highlightPath',
                label: 'Highlight Path',
                actions: [HighlightPathAction.create(selectedElementIds[0])]
            };
            return [highlightPath, showFilter];
        }

        if (this.modelState.isReadonly || selectedElementIds.length !== 0) {
            return [showFilter];
        }
        const snappedPosition = GridSnapper.snap(position);
        const newAutTask: MenuItem = {
            id: 'newAutoTask',
            label: 'Automated Task',
            actions: [CreateNodeOperation.create(ModelTypes.AUTOMATED_TASK, { location: snappedPosition })]
        };
        const newManTask: MenuItem = {
            id: 'newManualTask',
            label: 'Manual Task',
            actions: [CreateNodeOperation.create(ModelTypes.MANUAL_TASK, { location: snappedPosition })]
        };
        const newChildMenu: MenuItem = {
            id: 'new',
            label: 'New',
            actions: [],
            children: [newAutTask, newManTask],
            icon: 'add',
            group: '0_new'
        };

        return [newChildMenu, showFilter];
    }
}
