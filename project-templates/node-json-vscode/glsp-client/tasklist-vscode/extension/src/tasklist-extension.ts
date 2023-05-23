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
import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import {
    configureDefaultCommands,
    GlspServerLauncher,
    SocketGlspVscodeServer
} from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as path from 'path';
import * as process from 'process';
import * as vscode from 'vscode';
import TaskListEditorProvider from './tasklist-editor-provider';

const DEFAULT_SERVER_PORT = '5007';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // Start server process using quickstart component
    if (process.env.TASKLIST_SERVER_DEBUG !== 'true') {
        const serverProcess = new GlspServerLauncher({
            executable: path.join(__dirname, '../pack/tasklist-glsp-server-packed.js'),
            socketConnectionOptions: { port: JSON.parse(process.env.TASKLIST_SERVER_PORT || DEFAULT_SERVER_PORT) },
            additionalArgs: ['--no-consoleLog'],
            logging: true,
            serverType: 'node'
        });

        context.subscriptions.push(serverProcess);
        await serverProcess.start();
    }

    // Wrap server with quickstart component
    const minimalServer = new SocketGlspVscodeServer({
        clientId: 'glsp.tasklist',
        clientName: 'tasklist',
        serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT)
    });

    // Initialize GLSP-VSCode connector with server wrapper
    const glspVscodeConnector = new GlspVscodeConnector({
        server: minimalServer,
        logging: true
    });

    const customEditorProvider = vscode.window.registerCustomEditorProvider(
        'tasklist.glspDiagram',
        new TaskListEditorProvider(context, glspVscodeConnector),
        {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false
        }
    );

    context.subscriptions.push(minimalServer, glspVscodeConnector, customEditorProvider);
    minimalServer.start();

    configureDefaultCommands({ extensionContext: context, connector: glspVscodeConnector, diagramPrefix: 'tasklist' });
}
