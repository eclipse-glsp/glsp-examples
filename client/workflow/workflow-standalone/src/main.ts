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

import { GLSPWebsocketDiagramServer, RequestOperationsAction, RequestTypeHintsAction } from "@eclipse-glsp/client/lib";
import { join, resolve } from "path";
import { IActionDispatcher, RequestModelAction, TYPES } from "sprotty";

import createContainer from "./di.config";

const container = createContainer();

const websocket = new WebSocket("ws://localhost:8081/workflow");
const loc = window.location.pathname;
const currentDir = loc.substring(0, loc.lastIndexOf('/'));
const examplePath = resolve(join(currentDir, '..', '..', 'workspace', 'example1.wf'));

const diagramServer = container.get<GLSPWebsocketDiagramServer>(TYPES.ModelSource);
diagramServer.listen(websocket);
const actionDispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);
websocket.addEventListener('open', event => {
    actionDispatcher.dispatch(new RequestModelAction({
        sourceUri: `file://${examplePath}`,
        diagramType: "workflow-diagram",
    }));
    actionDispatcher.dispatch(new RequestOperationsAction());
    actionDispatcher.dispatch(new RequestTypeHintsAction("workflow-diagram"));
});
