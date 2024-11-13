// *****************************************************************************
// Copyright (C) 2024 EclipseSource GmbH.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
import { CommandContribution, CommandRegistry } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { ApplicationShell } from '@theia/core/lib/browser';

@injectable()
export class ClipiContribution implements CommandContribution {
    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(
            {
                id: 'clipi:open',
                label: 'Enable Future Mode'
            },
            {
                execute: () => {

                    this.shell.getWidgetById('chat-view-widget')?.close();

                    const clipiContainer = document.createElement('div');

                    clipiContainer.classList.add('clipi-container');
                    const speechBubble = document.createElement('div');
                    speechBubble.classList.add('clipi-speech-bubble');
                    speechBubble.textContent = 'Hello, I am Clipi! How can I help you today?';
                    clipiContainer.appendChild(speechBubble);

                    const clipiInput = document.createElement('input');
                    clipiInput.classList.add('clipi-input');
                    clipiInput.classList.add('theia-input');
                    clipiInput.placeholder = 'Type your message here...';
                    speechBubble.appendChild(clipiInput);

                    window.document.body.appendChild(clipiContainer);

                    clipiInput.focus();
                }
            }
        );
    }
}
