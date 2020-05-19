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
import { GLSPClientContribution } from "@eclipse-glsp/theia-integration/lib/browser";
import { CommandContribution } from "@theia/core";
import { FrontendApplicationContribution, OpenHandler, WidgetFactory } from "@theia/core/lib/browser";
import { ContainerModule, interfaces } from "inversify";
import { DiagramConfiguration, DiagramManager, DiagramManagerProvider } from "sprotty-theia";

import { WorkflowDiagramConfiguration } from "./diagram/workflow-diagram-configuration";
import { WorkflowDiagramManager } from "./diagram/workflow-diagram-manager";
import { WorkflowGLSPDiagramClient } from "./diagram/workflow-glsp-diagram-client";
import { ExampleNavigationCommandContribution } from "./external-navigation-example/external-navigation-example";
import { WorkflowGLSPClientContribution } from "./language/workflow-glsp-client-contribution";

export default new ContainerModule((bind: interfaces.Bind) => {
    bind(WorkflowGLSPClientContribution).toSelf().inSingletonScope();
    bind(GLSPClientContribution).toService(WorkflowGLSPClientContribution);

    bind(WorkflowGLSPDiagramClient).toSelf().inSingletonScope();

    bind(DiagramConfiguration).to(WorkflowDiagramConfiguration).inSingletonScope();
    bind(WorkflowDiagramManager).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(WorkflowDiagramManager);
    bind(OpenHandler).toService(WorkflowDiagramManager);
    bind(WidgetFactory).toService(WorkflowDiagramManager);
    bind(DiagramManagerProvider).toProvider<DiagramManager>((context) => {
        return () => {
            return new Promise<DiagramManager>((resolve) => {
                const diagramManager = context.container.get<WorkflowDiagramManager>(WorkflowDiagramManager);
                resolve(diagramManager);
            });
        };
    });

    // Example for a command that navigates to an element in a diagram with a query resolved by the server
    bind(CommandContribution).to(ExampleNavigationCommandContribution).inSingletonScope();
});
