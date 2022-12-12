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
import {
    BaseGLSPTool,
    CursorCSS,
    cursorFeedbackAction,
    DrawFeedbackEdgeAction,
    EdgeCreationTool,
    EdgeCreationToolMouseListener,
    EnableDefaultToolsAction,
    EnableToolsAction,
    FeedbackEdgeEndMovingMouseListener,
    findParentByFeature,
    isSelectable,
    KeyListener,
    MouseListener,
    SModelElement
} from '@eclipse-glsp/client';
import { Action, DefaultTypes, TriggerEdgeCreationAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';

@injectable()
export class DirectConnectEnablementTool extends BaseGLSPTool {
    static ID = 'tasklist.direct-connect-enablement-tool';

    protected mouseListener = new DirectConnectEnablementMouseListener();

    get id(): string {
        return DirectConnectEnablementTool.ID;
    }

    enable(): void {
        this.mouseTool.register(this.mouseListener);
    }

    disable(): void {
        this.mouseTool.deregister(this.mouseListener);
    }
}

@injectable()
export class DirectConnectEnablementMouseListener extends MouseListener {
    override mouseDown(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
        if (event.altKey && findParentByFeature(target, isSelectable)?.type === DefaultTypes.NODE) {
            return [EnableToolsAction.create(['tasklist.direct-connect-tool'])];
        }
        return [];
    }
}

@injectable()
export class DirectConnectTool extends EdgeCreationTool {
    protected disablementKeyListener = new DirectConnectDisablementKeyListener();

    override get id(): string {
        return 'tasklist.direct-connect-tool';
    }

    override enable(): void {
        this.triggerAction = TriggerEdgeCreationAction.create(DefaultTypes.EDGE);
        this.creationToolMouseListener = new DirectConnectMouseListener(this.triggerAction, this);
        this.mouseTool.register(this.creationToolMouseListener);
        this.feedbackEndMovingMouseListener = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry);
        this.mouseTool.register(this.feedbackEndMovingMouseListener);
        this.keyTool.register(this.disablementKeyListener);
        this.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    }

    override disable(): void {
        super.disable();
        this.keyTool.deregister(this.disablementKeyListener);
    }
}

@injectable()
export class DirectConnectMouseListener extends EdgeCreationToolMouseListener {
    override nonDraggingMouseUp(element: SModelElement, event: MouseEvent): Action[] {
        if (!this.isSourceSelected()) {
            this.source = element.id;
            this.tool.dispatchFeedback([
                DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId: this.source })
            ]);
        }
        return super.nonDraggingMouseUp(element, event);
    }
}

@injectable()
export class DirectConnectDisablementKeyListener extends KeyListener {
    override keyUp(element: SModelElement, event: KeyboardEvent): Action[] {
        if (event.altKey) {
            return [];
        }
        return [EnableDefaultToolsAction.create()];
    }
}
