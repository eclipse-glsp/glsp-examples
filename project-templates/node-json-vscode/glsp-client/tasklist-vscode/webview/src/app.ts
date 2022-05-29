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
import { createTaskListDiagramContainer } from '@eclipse-glsp-examples/tasklist-glsp';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';

class TaskListStarter extends GLSPStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        return createTaskListDiagramContainer(diagramIdentifier.clientId);
    }
}

export function launch(): void {
    new TaskListStarter();
}
