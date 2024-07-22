/********************************************************************************
 * Copyright (c) 2020-2024 EclipseSource and others.
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
import { isTaskNode } from '@eclipse-glsp-examples/workflow-glsp/lib/model';
import { NavigateAction } from '@eclipse-glsp/client';
import { GLSPCommandHandler, GLSPContextMenu } from '@eclipse-glsp/theia-integration';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core';
import { ApplicationShell, QuickInputService } from '@theia/core/lib/browser';
import { WebSocketConnectionSource } from '@theia/core/lib/browser/messaging/ws-connection-source';
import { inject, injectable } from '@theia/core/shared/inversify';

export namespace WorkflowNavigationCommands {
    export const NEXT_NODE = 'glsp-workflow-next-node';
    export const PREVIOUS_NODE = 'glsp-workflow-previous-node';
    export const DOCUMENTATION = 'glsp-workflow-documentation';
}

const reconnectCommand: Command = {
    id: 'test.reconnect',
    label: 'Test frontend reconnect'
};

@injectable()
export class WorkflowNavigationCommandContribution implements CommandContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;

    @inject(WebSocketConnectionSource)
    protected connectionProvider: WebSocketConnectionSource;

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;

    @inject(MessageService)
    protected readonly messageService: MessageService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(
            { id: WorkflowNavigationCommands.NEXT_NODE, label: 'Go to Next Node' },
            new GLSPCommandHandler(this.shell, {
                actions: () => [NavigateAction.create('next')],
                isEnabled: context => context.selectedElements.filter(isTaskNode).length === 1
            })
        );
        commands.registerCommand(
            { id: WorkflowNavigationCommands.PREVIOUS_NODE, label: 'Go to Previous Node' },
            new GLSPCommandHandler(this.shell, {
                actions: () => [NavigateAction.create('previous')],
                isEnabled: context => context.selectedElements.filter(isTaskNode).length === 1
            })
        );
        commands.registerCommand(
            { id: WorkflowNavigationCommands.DOCUMENTATION, label: 'Go to Documentation' },
            new GLSPCommandHandler(this.shell, {
                actions: () => [NavigateAction.create('documentation')],
                isEnabled: context => context.selectedElements.filter(isTaskNode).length === 1
            })
        );
        commands.registerCommand(reconnectCommand, {
            execute: async () => {
                const timeoutString = await this.quickInputService.input({
                    value: '500',
                    validateInput: input => Promise.resolve(Number.parseInt(input, 10) === undefined ? 'not an integer' : undefined)
                });
                if (timeoutString) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.connectionProvider as any).socket.disconnect();
                    setTimeout(
                        () => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (this.connectionProvider as any).socket.connect();
                        },
                        Number.parseInt(timeoutString, 10)
                    );
                }
            }
        });
    }
}

@injectable()
export class WorkflowNavigationMenuContribution implements MenuContribution {
    static readonly NAVIGATION = GLSPContextMenu.MENU_PATH.concat('navigate');
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(WorkflowNavigationMenuContribution.NAVIGATION.concat('n'), {
            commandId: WorkflowNavigationCommands.NEXT_NODE,
            label: 'Next node'
        });
        menus.registerMenuAction(WorkflowNavigationMenuContribution.NAVIGATION.concat('n'), {
            commandId: WorkflowNavigationCommands.PREVIOUS_NODE,
            label: 'Previous node'
        });
        menus.registerMenuAction(WorkflowNavigationMenuContribution.NAVIGATION.concat('z'), {
            commandId: WorkflowNavigationCommands.DOCUMENTATION,
            label: 'Documentation'
        });
    }
}
