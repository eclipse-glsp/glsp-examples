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

import { GLSPContextMenu } from '@eclipse-glsp/theia-integration';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';

@injectable()
export class TaskListContribution implements CommandContribution, MenuContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;

    static HELLO_WORLD_COMMAND = { id: 'glsp-say-hello', label: 'Say hello from GLSP' };

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TaskListContribution.HELLO_WORLD_COMMAND, { execute: () => console.log('Hello world') });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(GLSPContextMenu.MENU_PATH.concat('edit'), {
            commandId: TaskListContribution.HELLO_WORLD_COMMAND.id,
            label: 'Menu: Say hello from GLSP'
        });
    }
}
