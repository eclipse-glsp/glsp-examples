/********************************************************************************
 * Copyright (c) 2019-2023 EclipseSource and others.
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
import { CreateNodeOperation, getAbsolutePosition } from '@eclipse-glsp/client';
import { Message } from '@phosphor/messaging/lib';

import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { TreeWidgetSelection } from '@theia/core/lib/browser/tree/tree-widget-selection';
import { injectable } from '@theia/core/shared/inversify';
import { FILE_NAVIGATOR_ID, FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';

import { FileNode } from '@theia/filesystem/lib/browser';

@injectable()
export class WorkflowDiagramWidget extends GLSPDiagramWidget {
    protected override onAfterAttach(msg: Message): void {
        // Add a DOM listener for the drop event on this node.
        // See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        // and  https://developer.mozilla.org/en-US/docs/Web/Events for more details and possible events.
        this.addEventListener(this.node, 'drop', evt => this.onDrop(evt), true);
        super.onAfterAttach(msg);
    }

    protected onDrop(event: DragEvent): void {
        const selectedFilePaths = this.getSelectedFilePaths(event);
        if (selectedFilePaths.length > 0) {
            event.stopPropagation();
            const position = getAbsolutePosition(this.editorContext.modelRoot, event);
            this.actionDispatcher.dispatch(CreateNodeOperation.create('task:automated', { location: position }));
        }
    }

    protected getSelectedFilePaths(event: DragEvent): string[] {
        // the data-key is defined in the tree implementation of Theia but not as a constant
        const data = event.dataTransfer?.getData('selected-tree-nodes');
        if (!data) {
            return [];
        }
        const selectedNodeIds: string[] = JSON.parse(data);

        const currentSelection = this.theiaSelectionService.selection;
        if (TreeWidgetSelection.is(currentSelection) && currentSelection.source.id === FILE_NAVIGATOR_ID) {
            const source = currentSelection.source as FileNavigatorWidget;
            const selectedFileNodes = selectedNodeIds.map(id => source.model.getNode(id)).filter(FileNode.is);
            return selectedFileNodes.map(node => node.uri.path.fsPath());
        }
        return [];
    }
}
