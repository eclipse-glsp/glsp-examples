/********************************************************************************
 * Copyright (c) 2019-2023 EclipseSource and others.
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

import { BaseJsonrpcGLSPClient, DiagramLoader, GLSPClient, GLSPWebWorkerProvider } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import { MessageConnection } from 'vscode-jsonrpc';
import { createContainer } from './tasklist-diagram-module';

const id = 'tasklist';
const diagramType = 'tasklist-diagram';

const clientId = 'tasklist-client';

let glspClient: GLSPClient;
let container: Container;
// @ts-ignore
console.log(window.SERVER_URL);
// @ts-ignore
const wwProvider = new GLSPWebWorkerProvider(window.SERVER_URL);
wwProvider.listen({ onConnection: initialize, logger: console });

// This is only necessary in the integrated sandbox, in order to display the model file outside of the iframe.
// @ts-ignore
wwProvider.worker.addEventListener('message', ({ data }) => {
    if (data.isUpdatedModelFile) {
        window.parent.postMessage({ type: 'MODEL_FILE', data: data.modelFile }, '*');
    }
    if (data.jsonrpc && data.params?.action?.severity === 'ERROR') {
        throw new Error(data.params.action.details);
    }
});
// @ts-ignore
wwProvider.worker.addEventListener('error', error => {
    throw error;
});

async function initialize(connectionProvider: MessageConnection): Promise<void> {
    glspClient = new BaseJsonrpcGLSPClient({ id, connectionProvider });
    container = createContainer({
        clientId,
        diagramType,
        glspClientProvider: async () => glspClient,
        // @ts-ignore
        sourceUri: window.DATA_URL
    });
    const diagramLoader = container.get(DiagramLoader);
    await diagramLoader.load();
}
