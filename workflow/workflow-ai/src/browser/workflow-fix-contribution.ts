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

import { collectIssueMarkers, GModelElement, GParentElement, isParent } from '@eclipse-glsp/client';
import { getDiagramWidget, GLSPContextMenu } from '@eclipse-glsp/theia-integration';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { WorkflowAgent } from './workflow-agent';

const WORKFLOW_FIX_ID = 'workflow.fix-with-ai';

@injectable()
export class WorkflowFixContribution implements CommandContribution, MenuContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;
    @inject(WorkflowAgent) protected readonly agent: WorkflowAgent;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(
            {
                id: WORKFLOW_FIX_ID,
                label: 'Fix with AI',
                category: 'Workflow',
                iconClass: 'fa fa-wrench'
            },
            {
                execute: async () => {
                    const element = this.getSelectedElementWithMarker();
                    if (!element) {
                        return;
                    }
                    await this.agent.fixIssue(element);
                },
                isEnabled: () => this.getSelectedElementWithMarker() !== undefined
            }
        );
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(GLSPContextMenu.MENU_PATH.concat('fix'), {
            commandId: WORKFLOW_FIX_ID
        });
    }

    getSelectedElementWithMarker(): GModelElement | undefined {
        const editorContext = getDiagramWidget(this.shell)?.editorContext;
        if (!editorContext) {
            return undefined;
        }
        const selectedElements = editorContext.selectedElements;
        return selectedElements.find(element => isParent(element) && collectIssueMarkers(element as any as GParentElement).length > 0);
    }
}
