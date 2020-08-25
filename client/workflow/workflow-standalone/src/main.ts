/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
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
import "reflect-metadata";
import "sprotty-theia/css/theia-sprotty.css";

import {
    BaseJsonrpcGLSPClient,
    EnableToolPaletteAction,
    GLSPDiagramServer,
    JsonrpcGLSPClient,
    RequestTypeHintsAction
} from "@eclipse-glsp/client";
import { join, resolve } from "path";
import { IActionDispatcher, RequestModelAction, TYPES } from "sprotty";

import createContainer from "./di.config";

const port = 8081;
const id = "workflow";
const name = "workflow";
const websocket = new WebSocket(`ws://localhost:${port}/${id}`);
const container = createContainer();

const loc = window.location.pathname;
const currentDir = loc.substring(0, loc.lastIndexOf('/'));
const examplePath = resolve(join(currentDir, '..', '..', 'workspace', 'example1.wf'));

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
const actionDispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);

websocket.onopen = () => {
    const connectionProvider = JsonrpcGLSPClient.createWebsocketConnectionProvider(websocket);
    const glspClient = new BaseJsonrpcGLSPClient({ id, name, connectionProvider });
    diagramServer.connect(glspClient).then(client => {
        actionDispatcher.dispatch(new RequestModelAction({
            sourceUri: `file://${examplePath}`,
            diagramType: "workflow-diagram",
        }));
        actionDispatcher.dispatch(new RequestTypeHintsAction("workflow-diagram"));
        actionDispatcher.dispatch(new EnableToolPaletteAction());
    });
};

