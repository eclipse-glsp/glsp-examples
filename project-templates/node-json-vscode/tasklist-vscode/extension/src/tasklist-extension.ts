/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import {
    configureDefaultCommands,
    GlspSocketServerLauncher,
    GlspVscodeConnector,
    SocketGlspVscodeServer
} from '@eclipse-glsp/vscode-integration/node';
import * as path from 'path';
import * as process from 'process';
import 'reflect-metadata';
import * as vscode from 'vscode';
import TaskListEditorProvider from './tasklist-editor-provider';
const MODULE_PATH = require.resolve('tasklist-glsp-server');
export const LOG_DIR = path.join(__dirname, '..', '..', 'logs');

const DEFAULT_SERVER_PORT = '0';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // Start server process using quickstart component
    let serverProcess: GlspSocketServerLauncher | undefined;

    if (process.env.TASKLIST_SERVER_DEBUG !== 'true') {
        serverProcess = new GlspSocketServerLauncher({
            executable: MODULE_PATH,
            socketConnectionOptions: { port: JSON.parse(process.env.TASKLIST_SERVER_PORT || DEFAULT_SERVER_PORT) },
            additionalArgs: ['--no-consoleLog', '--fileLog', '--logDir', LOG_DIR],
            logging: true
        });
        context.subscriptions.push(serverProcess);
        await serverProcess.start();
    }

    // Wrap server with quickstart component
    const minimalServer = new SocketGlspVscodeServer({
        clientId: 'glsp.tasklist',
        clientName: 'tasklist',
        connectionOptions: { port: serverProcess?.getPort() || JSON.parse(process.env.TASKLIST_SERVER_PORT || DEFAULT_SERVER_PORT) }
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
