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
import { BaseGLSPServerContribution, GLSPServerLaunchOptions, START_UP_COMPLETE_MSG } from '@eclipse-glsp/theia-integration/lib/node';
import * as fs from 'fs';
import { injectable } from 'inversify';
import * as net from 'net';
import * as path from 'path';
import { createSocketConnection, IConnection } from 'vscode-ws-jsonrpc/lib/server';
import { TasklistLanguage } from '../common/tasklist-language';
const DEFAULT_SERVER_PORT = '5007';
// Custom implementation until https://github.com/eclipse-glsp/glsp/issues/636 is resolved

export interface NodeSocketServerLaunchOptions extends GLSPServerLaunchOptions {
    /** Path to the location of the node module that should be launched as process */
    module: string;
    /** Socket connection options for new client connections */
    socketConnectionOptions: net.TcpSocketConnectOpts;
    /** Additional arguments that should be passed when starting the server process. */
    additionalArgs?: string[];
}

@injectable()
export class TasklistServerContribution extends BaseGLSPServerContribution {
    readonly id = TasklistLanguage.contributionId;
    protected resolveReady: (value?: void | PromiseLike<void> | undefined) => void;

    override launchOptions: NodeSocketServerLaunchOptions = {
        ...GLSPServerLaunchOptions.createDefaultOptions(),
        module: path.join(__dirname, '../../../../glsp-server/lib/index.js'),
        socketConnectionOptions: { port: JSON.parse(process.env.TASKLIST_SERVER_PORT || DEFAULT_SERVER_PORT) },
        additionalArgs: ['--no-consoleLog', '--fileLog', '--logDir', path.join(__dirname, '../../../../glsp-server/bundle/')]
    };

    createLaunchOptions?(): Partial<GLSPServerLaunchOptions>;

    onReady: Promise<void> = new Promise(resolve => (this.resolveReady = resolve));

    connect(clientConnection: IConnection): void {
        this.connectToSocketServer(clientConnection);
    }

    async launch(): Promise<void> {
        if (!fs.existsSync(this.launchOptions.module)) {
            throw new Error(`Could not launch GLSP server. The given node module is not valid: ${this.launchOptions.module}`);
        }
        if (isNaN(this.launchOptions.socketConnectionOptions.port)) {
            throw new Error(
                `Could not launch GLSP Server. The given server port is not a number: ${this.launchOptions.socketConnectionOptions.port}`
            );
        }
        let args = [this.launchOptions.module, '--port', `${this.launchOptions.socketConnectionOptions.port}`];

        if (this.launchOptions.additionalArgs) {
            args = [...args, ...this.launchOptions.additionalArgs];
        }

        await this.spawnProcessAsync('node', args, undefined);
        return this.onReady;
    }

    protected override processLogInfo(data: string | Buffer): void {
        if (data) {
            const message = data.toString();
            if (message.startsWith(START_UP_COMPLETE_MSG)) {
                this.resolveReady();
            }
        }
    }

    protected override processLogError(data: string | Buffer): void {
        // Override console logging of errors. To avoid a polluted client console.
    }

    protected connectToSocketServer(clientConnection: IConnection): void {
        if (isNaN(this.launchOptions.socketConnectionOptions.port)) {
            throw new Error(
                // eslint-disable-next-line max-len
                `Could not connect to to GLSP Server. The given server port is not a number: ${this.launchOptions.socketConnectionOptions.port}`
            );
        }
        const socket = new net.Socket();
        const serverConnection = createSocketConnection(socket, socket, () => {
            socket.destroy();
        });
        this.forward(clientConnection, serverConnection);
        socket.connect(this.launchOptions.socketConnectionOptions);
    }
}
