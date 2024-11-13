/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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
import { ChatAgent } from '@theia/ai-chat/lib/common';
import { ResponseContentMatcherProvider } from '@theia/ai-chat/lib/common/response-content-matcher';
import { Agent, AIVariableContribution, ToolProvider } from '@theia/ai-core/lib/common';
import { CommandContribution, MenuContribution } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import '../../src/browser/css/branding.css';
import { WorkflowAgent1 } from './1_workflow-agent';
import { WorkflowAgent2 } from './2_workflow-agent';
import { WorkflowVariableContribution } from './2_workflow-variable';
import { ClassificationAgent, WorkflowAgent3 } from './3_workflow-agent';
import { CreateCommandMatcherProvider, WorkflowAgent4 } from './4_workflow-agent';
import {
    ChangeNodeLabels,
    CreateEdges,
    CreateNodes,
    DeleteEdges,
    DeleteNodes,
    GetDiagram,
    GetDocumentation,
    MoveNodes,
    ShowNodes,
    UpdateDocumentation
} from './tools';
import { WorkflowAgent } from './workflow-agent';
import { WorkflowDiagramProvider } from './workflow-diagram-provider';
import { WorkflowFixContribution } from './workflow-fix-contribution';

export default new ContainerModule(bind => {
    bind(WorkflowAgent).toSelf().inSingletonScope();
    bind(Agent).toService(WorkflowAgent);
    bind(ChatAgent).toService(WorkflowAgent);

    bind(WorkflowDiagramProvider).toSelf().inSingletonScope();
    bind(ToolProvider).to(GetDiagram);
    bind(CreateNodes).toSelf().inSingletonScope();
    bind(ToolProvider).toService(CreateNodes);
    bind(ToolProvider).to(DeleteNodes);
    bind(ToolProvider).to(MoveNodes);
    bind(ToolProvider).to(ChangeNodeLabels);
    bind(ToolProvider).to(CreateEdges);
    bind(ToolProvider).to(DeleteEdges);
    bind(ToolProvider).to(ShowNodes);
    bind(GetDocumentation).toSelf().inSingletonScope();
    bind(ToolProvider).toService(GetDocumentation);
    bind(ToolProvider).to(UpdateDocumentation);

    bind(WorkflowFixContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(WorkflowFixContribution);
    bind(MenuContribution).toService(WorkflowFixContribution);

    bind(WorkflowAgent1).toSelf().inSingletonScope();
    bind(Agent).toService(WorkflowAgent1);
    bind(ChatAgent).toService(WorkflowAgent1);

    bind(WorkflowAgent2).toSelf().inSingletonScope();
    bind(Agent).toService(WorkflowAgent2);
    bind(ChatAgent).toService(WorkflowAgent2);
    bind(AIVariableContribution).to(WorkflowVariableContribution).inSingletonScope();

    bind(ClassificationAgent).toSelf().inSingletonScope();
    bind(Agent).toService(ClassificationAgent);
    bind(WorkflowAgent3).toSelf().inSingletonScope();
    bind(Agent).toService(WorkflowAgent3);
    bind(ChatAgent).toService(WorkflowAgent3);

    bind(ResponseContentMatcherProvider).to(CreateCommandMatcherProvider).inSingletonScope();
    bind(WorkflowAgent4).toSelf().inSingletonScope();
    bind(Agent).toService(WorkflowAgent4);
    bind(ChatAgent).toService(WorkflowAgent4);
});
