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
/* eslint-disable max-len */
import { AbstractStreamParsingChatAgent, ChatRequestModelImpl, SystemMessageDescription } from '@theia/ai-chat/lib/common';
import { Agent, isLanguageModelParsedResponse, LanguageModelRegistry, LanguageModelRequirement, PromptService } from '@theia/ai-core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { z } from 'zod';
// eslint-disable-next-line import/no-named-as-default
import zodToJsonSchema from 'zod-to-json-schema';
import { GetDocumentation } from './tools';
import { WorkflowDiagramProvider } from './workflow-diagram-provider';

export const CLASSIFICATION_PROMPT = {
    id: 'workflow-classification-prompt',
    template: `
Classify a user request targeted at an AI assistant for workflow diagrams to determine if answering the user request necessitates providing the AI assistant with the current diagram, accompanying documentation, and code 

# Categories

## Workflow diagrams
Workflow diagrams consists of manual and automated task nodes, decision nodes, fork nodes and edges connect nodes. Task nodes have a label. More detailed information on tasks, conditions, etc. is defined in the accompanying documentation. The logic of each node is implemented in manually written code that is located alongside the diagram file.

## Documentation
Each diagram has an accompanying documentation, which is a markdown files, providing explanations about the used terminology, the overall goal and domain of this workflow, details about the respective steps, such as parameters, etc.

## Code
The code is located in separate files alongside the diagram. There is a function for each automated task node located in a file that is named <task-label>.task. These functions are implemented with a textual domain-specific language.

# Steps

1. Analyze the user request to determine if it involves understanding, modifying, or generating a workflow diagram.
2. Identify if the current diagram, the documentation, or the code is necessary to fulfill the request.
3. Identify any optional search terms or the code file that might help refine or aid the request processing.
4. Provide a clear rationale for your classification based on the analysis above.

# Output Format

Provide the result in the following JSON format without wrapping it in code blocks:
\`\`\`json
{
  "rationale": "Your reasoning for the classification here.",
  "requiredContext": [ "diagram", "documentation", "code", "other" ],
  "searchTerms": "Optional search terms, code file names, or null if not applicable."
}
\`\`\`

# Notes

- Focus on understanding the nature of the request to decide which context is actually required.
- If the request is vague, prioritize providing the current diagram.
- Search terms are optional and should only be included if they add value to processing the request.
`
};

const Classification = z.object({
    rationale: z.string(),
    userRequestClass: z.enum(['diagram', 'documentation', 'code', 'other']),
    searchTerms: z.string()
});
export type Classification = z.infer<typeof Classification>;

@injectable()
export class ClassificationAgent implements Agent {
    id = 'workflow-request-classification';
    name = 'Workflow Request Classification';
    description = 'Classifies user requests regarding the required context';
    promptTemplates = [CLASSIFICATION_PROMPT];
    languageModelRequirements: LanguageModelRequirement[] = [
        {
            purpose: 'classification',
            identifier: 'openai/gpt-4o-2024-08-06'
        }
    ];
    variables = [];
    agentSpecificVariables = [];
    functions = [];

    @inject(LanguageModelRegistry)
    protected languageModelRegistry: LanguageModelRegistry;

    @inject(PromptService)
    protected promptService: PromptService;

    async classifyRequest(request: ChatRequestModelImpl): Promise<Classification> {
        const languageModel = await this.languageModelRegistry.selectLanguageModel({
            agent: this.id,
            ...this.languageModelRequirements[0]
        });
        if (!languageModel) {
            throw new Error('Language model not available');
        }

        const systemPrompt = await this.promptService.getPrompt(CLASSIFICATION_PROMPT.id);
        if (!systemPrompt) {
            throw new Error('Prompt not available');
        }

        const progress = request.response.addProgressMessage({
            content: 'Identifying relevant context information',
            status: 'inProgress'
        });

        const conversation = request.session
            .getRequests()
            .slice(-10)
            .map(r => 'User: ' + r.request.text + '\n' + 'Assistant:' + r.response.response.asString())
            .join('\n');

        try {
            const classificationResult = await languageModel.request({
                messages: [
                    {
                        actor: 'ai',
                        type: 'text',
                        query: systemPrompt.text
                    },
                    {
                        actor: 'user',
                        type: 'text',
                        query: conversation
                    }
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'classification',
                        description: 'The classification of the user request regarding the required context',
                        schema: zodToJsonSchema(Classification)
                    }
                }
            });

            if (isLanguageModelParsedResponse(classificationResult)) {
                const parsedResult = Classification.safeParse(classificationResult.parsed);
                if (parsedResult.success) {
                    request.response.updateProgressMessage({
                        ...progress,
                        status: 'completed'
                    });
                    return parsedResult.data;
                }
            }
        } catch (error: unknown) {
            console.error('Failed to classify request', error);
        }

        request.response.updateProgressMessage({
            ...progress,
            status: 'failed'
        });
        throw new Error('Classification failed');
    }
}

export const SYSTEM_PROMPT = {
    id: 'workflow-system-prompt3',
    template: `
    You are an assistant helping users creating and modifying "workflow diagrams".
    The graphical workflow diagram language is implemented with Eclipse GLSP.
    You are embedded within the workflow diagram editor.
    
    ## General diagramming
    Diagrams consist of typed nodes and edges. Nodes and edges have a unique identifier,
    a type, a size and a position with x and y values in a two-dimensional canvas.
    The origin of the x and y coordinate system is the top-left corner. The x and y values
    increase going down (y) and going right (x). Nodes have a size. Edges have exactly one source
    and one target node.
    
    ## Workflow diagrams
    Workflow diagrams feature the following node types:
    * Manual tasks are nodes (type: task:manual, orange boxes) and denote tasks performed by a user. Manual tasks have a human-readable label describing the task.
    * Automated tasks are nodes (type: task:automated, turquoise boxes) and denote tasks performed by a machine or software. Automated tasks have a human-readable label describing the task.
    * Decisions are nodes (type: activityNode:decision, diamond shape) and denote a branch point into optional flows. Decision nodes have exactly one incoming edge and an arbitrary number of outgoing edges, whereas each outgoing edge denotes an optional flow that depends on a certain condition. Thus decisions typically cover cases where one would describe: "If A then B, otherwise C".
    * Merge nodes (type: activityNode:merge, diamond shape) are merging back multiple optional flows into a single flow.
    * Fork nodes (type: activityNode:fork, vertical rectangles) denote a branch point into parallel flows. Fork nodes have exactly one incoming edge and an arbitrary number of outgoing edges, whereas each outgoing edge denotes a parallel flow. Thus forks typically cover cases where one would describe: "After A do B and C in parallel".
    * Merge nodes (type: activityNode:join, vertical rectangles) are merging back multiple parallel flows into a single flow.
    
    Workflow diagrams have two edge types:
    * Flows are edges (type: edge) and denote the execution flow from task to task. Their source and target can be any other node.
    * Weighted flows are edges (type: edge:weighted). Their source node must be a decision node (type: activityNode:decision). Weighted flows carry an optional property probability indicating the likelihood of going this flow. Their targets can be any other type of nodes.
    
    ## Instructions for your replies
    Answer brief and don't repeat the state of the diagram.
`
};

@injectable()
export class WorkflowAgent3 extends AbstractStreamParsingChatAgent {
    override id = 'Workflow3';
    name = 'Workflow3';
    description = 'Simple chat agent for workflow diagrams with classification for relevant context.';
    promptTemplates = [CLASSIFICATION_PROMPT, SYSTEM_PROMPT];

    @inject(ClassificationAgent)
    protected classificationAgent: ClassificationAgent;

    @inject(WorkflowDiagramProvider)
    protected readonly workflowProvider: WorkflowDiagramProvider;

    @inject(GetDocumentation)
    protected readonly documentationProvider: GetDocumentation;

    override languageModelRequirements: LanguageModelRequirement[] = [
        {
            purpose: 'chat',
            identifier: 'openai/gpt-4o'
        }
    ];

    protected override async getSystemMessageDescription(): Promise<SystemMessageDescription | undefined> {
        const resolvedPrompt = await this.promptService.getPrompt(SYSTEM_PROMPT.id);
        return resolvedPrompt ? resolvedPrompt : undefined;
    }

    override async invoke(request: ChatRequestModelImpl): Promise<void> {
        const classification = await this.classificationAgent.classifyRequest(request);

        const context = await this.retrieveContext(classification);

        const lastRequest = request.session.getRequests().slice(-1)[0];
        lastRequest.message.parts.push({
            kind: 'text',
            promptText: context,
            text: '',
            range: { start: 0, endExclusive: 0 }
        });

        return super.invoke(request);
    }

    protected async retrieveContext(classification: Classification): Promise<string> {
        let context = '';
        if (classification.userRequestClass.includes('diagram')) {
            context += `\n## Workflow Diagram\n${JSON.stringify(this.workflowProvider.getModelDescription(), undefined, 2)}\n`;
        }
        if (classification.userRequestClass.includes('documentation')) {
            context += `\n## Documentation\n${(await this.documentationProvider.getDocumentation()).content}\n`;
        }
        if (classification.userRequestClass.includes('code')) {
            context += '\n## Code map\nopenCan()\nenableLed()\nheatPump()\n';
        }
        return context;
    }
}
