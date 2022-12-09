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

import { DefaultTypes } from '@eclipse-glsp/client';
import { GLSPCommandHandler, GLSPContextMenu } from '@eclipse-glsp/theia-integration';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { IncreaseTaskDifficultyOperation, MyCustomAction } from './actions';

@injectable()
export class TaskListContribution implements CommandContribution, MenuContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;

    static HELLO_WORLD_COMMAND = { id: 'glsp-say-hello', label: 'Say hello from GLSP' };
    static MY_CUSTOM_ACTION_COMMAND = { id: 'glsp-custom-action', label: 'My Custom Action' };
    static INCREASE_DIFFICULTY_COMMAND = { id: 'glsp-increase-difficulty', label: 'Increase Task Difficulty' };

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TaskListContribution.HELLO_WORLD_COMMAND, { execute: () => console.log('Hello world') });
        commands.registerCommand(
            TaskListContribution.MY_CUSTOM_ACTION_COMMAND,
            new GLSPCommandHandler(this.shell, {
                actions: context => [MyCustomAction.create(context.selectedElements[0].id)],
                isEnabled: context => context.selectedElements.length === 1 && context.selectedElements[0].type === DefaultTypes.NODE
            })
        );
        commands.registerCommand(
            TaskListContribution.INCREASE_DIFFICULTY_COMMAND,
            new GLSPCommandHandler(this.shell, {
                actions: context => [IncreaseTaskDifficultyOperation.create(context.selectedElements[0].id)],
                isEnabled: context => context.selectedElements.length === 1 && context.selectedElements[0].type === DefaultTypes.NODE
            })
        );
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(GLSPContextMenu.MENU_PATH.concat('edit'), {
            commandId: TaskListContribution.HELLO_WORLD_COMMAND.id,
            label: 'Menu: Say hello from GLSP'
        });
        menus.registerMenuAction(GLSPContextMenu.MENU_PATH.concat('edit'), {
            commandId: TaskListContribution.MY_CUSTOM_ACTION_COMMAND.id,
            label: TaskListContribution.MY_CUSTOM_ACTION_COMMAND.label
        });
        menus.registerMenuAction(GLSPContextMenu.MENU_PATH.concat('edit'), {
            commandId: TaskListContribution.INCREASE_DIFFICULTY_COMMAND.id,
            label: TaskListContribution.INCREASE_DIFFICULTY_COMMAND.label
        });
    }
}
