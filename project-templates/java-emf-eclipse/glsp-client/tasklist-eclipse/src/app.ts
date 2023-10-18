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
import 'reflect-metadata';

import {
    DiagramLoader,
    GLSPActionDispatcher,
    GLSPWebSocketProvider,
    MessageAction,
    StatusAction,
    TYPES
} from '@eclipse-glsp/client';
import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient } from '@eclipse-glsp/protocol';
import { Container } from 'inversify';
import { MessageConnection } from 'vscode-jsonrpc';
import { createContainer } from './di.config';

const urlParameters = getParameters();
const filePath = urlParameters.path;

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port, 10);
const applicationId = urlParameters.application;
const id = 'tasklist';
const diagramType = 'tasklist-diagram';

const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
setWidgetId(widgetId);
let container: Container;

const webSocketUrl = `ws://localhost:${port}/${id}`;

let glspClient: GLSPClient;
const wsProvider = new GLSPWebSocketProvider(webSocketUrl);

wsProvider.listen({ onConnection: initialize, onReconnect: reconnect, logger: console });

async function initialize(connectionProvider: MessageConnection, isReconnecting = false): Promise<void> {
    glspClient = new BaseJsonrpcGLSPClient({ id, connectionProvider });

    // Java's URLEncoder.encode encodes spaces as plus sign but decodeURI expects spaces to be encoded as %20.
    // See also https://en.wikipedia.org/wiki/Query_string#URL_encoding for URL encoding in forms vs generic URL encoding.
    const sourceUri =  decodeURI(filePath.replace(/\+/g, '%20'));

    const glspClientProvider: () => Promise<GLSPClient> = async () => glspClient;

    container = createContainer({ clientId, diagramType, glspClientProvider, sourceUri });

    const diagramLoader = container.get(DiagramLoader);
    await diagramLoader.load({
        requestModelOptions: { isReconnecting },
        initializeParameters: { applicationId },
        enableNotifications: false
    });

    const actionDispatcher: GLSPActionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);

    if (isReconnecting) {
        const message = `Connection to the ${id} glsp server got closed. Connection was successfully re-established.`;
        const timeout = 5000;
        const severity = 'WARNING';
        actionDispatcher.dispatchAll([StatusAction.create(message, { severity, timeout }), MessageAction.create(message, { severity })]);
        return;
    }
}

async function reconnect(connectionProvider: MessageConnection): Promise<void> {
    glspClient.stop();
    initialize(connectionProvider, true /* isReconnecting */);
}

function setWidgetId(mainWidgetId: string): void {
    const mainWidget = document.getElementById('sprotty');
    if (mainWidget) {
        mainWidget.id = mainWidgetId;
    }
}
