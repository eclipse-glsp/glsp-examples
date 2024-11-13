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

import {
    AIVariable,
    AIVariableContext,
    AIVariableContribution,
    AIVariableResolutionRequest,
    AIVariableResolver,
    AIVariableService,
    ResolvedAIVariable
} from '@theia/ai-core';
import { MaybePromise } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { WorkflowDiagramProvider } from './workflow-diagram-provider';

export const WORKFLOW_VARIABLE: AIVariable = {
    id: 'workflow-provider',
    description: 'Provides the current workflow diagram model',
    name: 'workflow',
    args: []
};

@injectable()
export class WorkflowVariableContribution implements AIVariableContribution, AIVariableResolver {
    @inject(WorkflowDiagramProvider)
    protected readonly workflowProvider: WorkflowDiagramProvider;

    registerVariables(service: AIVariableService): void {
        service.registerResolver(WORKFLOW_VARIABLE, this);
    }

    canResolve(request: AIVariableResolutionRequest, context: AIVariableContext): MaybePromise<number> {
        if (request.variable.name === WORKFLOW_VARIABLE.name) {
            return 1;
        }
        return -1;
    }

    async resolve(request: AIVariableResolutionRequest, context: AIVariableContext): Promise<ResolvedAIVariable | undefined> {
        if (request.variable.name !== WORKFLOW_VARIABLE.name) {
            return undefined;
        }
        return {
            variable: WORKFLOW_VARIABLE,
            value: `

## Workflow Diagram
${JSON.stringify(this.workflowProvider.getModelDescription(), undefined, 2)}
`
        };
    }
}
