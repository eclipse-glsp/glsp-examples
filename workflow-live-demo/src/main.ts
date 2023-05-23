/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
import 'reflect-metadata';
import '../css/diagram.css';

import { createWorkflowDiagramContainer } from '@eclipse-glsp-examples/workflow-glsp';
import {
    ApplicationIdProvider,
    BaseJsonrpcGLSPClient,
    ConsoleLogger,
    EnableToolPaletteAction,
    GLSPActionDispatcher,
    GLSPClient,
    GLSPDiagramServer,
    LogLevel,
    RequestModelAction,
    RequestTypeHintsAction,
    TYPES,
    bindAsService,
    bindOrRebind,
    configureServerActions
} from '@eclipse-glsp/client';
import { BrowserMessageReader, BrowserMessageWriter, MessageConnection, createMessageConnection } from 'vscode-jsonrpc/browser';
const START_UP_COMPLETE_MSG = '[GLSP-Server]:Startup completed';

function createServerConnection(): Promise<MessageConnection> {
    const serverWorker = new Worker(
        new URL(
            './server-worker',
            // @ts-expect-error (TS1343)
            // We compile to CommonJS but `import.meta` is still available in the browser
            import.meta.url
        )
    );
    return new Promise((resolve, reject) => {
        serverWorker.addEventListener(
            'message',
            message => {
                if (message.data.includes(START_UP_COMPLETE_MSG)) {
                    const reader = new BrowserMessageReader(serverWorker);
                    const writer = new BrowserMessageWriter(serverWorker);
                    resolve(createMessageConnection(reader, writer));
                } else {
                    reject(`Unexpected message received: ${message.data}`);
                }
            },
            { once: true }
        );
    });
}

async function launch(): Promise<void> {
    const clientId = 'livedemo';
    const diagramType = 'workflow-diagram';

    // Setup container
    const container = createWorkflowDiagramContainer('sprotty');
    bindAsService(container, TYPES.ModelSource, GLSPDiagramServer);
    bindOrRebind(container, TYPES.ModelSource).toService(GLSPDiagramServer);
    bindOrRebind(container, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.warn);
    container.bind(TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });

    const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
    diagramServer.clientId = clientId;

    const connection = await createServerConnection();

    const client = new BaseJsonrpcGLSPClient({
        id: diagramType,
        connectionProvider: connection
    });

    await diagramServer.connect(client);
    const result = await client.initializeServer({
        applicationId: ApplicationIdProvider.get(),
        protocolVersion: GLSPClient.protocolVersion
    });
    await configureServerActions(result, diagramType, container);

    const actionDispatcher = container.get(GLSPActionDispatcher);

    await client.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
    actionDispatcher.dispatch(
        RequestModelAction.create({
            options: {
                sourceUri: 'mock://',
                diagramType
            }
        })
    );
    actionDispatcher.dispatch(RequestTypeHintsAction.create());
    await actionDispatcher.onceModelInitialized();
    actionDispatcher.dispatch(EnableToolPaletteAction.create());
}

launch().catch(err => console.error(err));
