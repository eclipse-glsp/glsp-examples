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

import { WorkflowDiagramModule, WorkflowMockModelStorage, WorkflowServerModule } from '@eclipse-glsp-examples/workflow-server/browser';
import { LogLevel, WorkerServerLauncher, createAppModule } from '@eclipse-glsp/server/browser';
import { Container } from 'inversify';

export async function launch(argv?: string[]): Promise<void> {
    const appContainer = new Container();
    appContainer.load(createAppModule({ logLevel: LogLevel.info }));

    const launcher = appContainer.resolve(WorkerServerLauncher);

    const serverModule = new WorkflowServerModule().configureDiagramModule(new WorkflowDiagramModule(() => WorkflowMockModelStorage));

    launcher.configure(serverModule);

    await launcher.start({});
}

launch().catch(error => console.error('Error in workflow server launcher:', error));
