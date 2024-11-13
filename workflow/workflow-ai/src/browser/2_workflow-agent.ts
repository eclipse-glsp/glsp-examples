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
import { AbstractStreamParsingChatAgent, SystemMessageDescription } from '@theia/ai-chat/lib/common';
import { LanguageModelRequirement } from '@theia/ai-core';
import { injectable } from '@theia/core/shared/inversify';

export const SYSTEM_PROMPT = {
    id: 'workflow-system-prompt2',
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

    {{workflow}}
`
};

@injectable()
export class WorkflowAgent2 extends AbstractStreamParsingChatAgent {
    override id = 'Workflow2';
    name = 'Workflow2';
    description = 'Simple chat agent for workflow diagrams with access to the diagram.';
    promptTemplates = [SYSTEM_PROMPT];

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
}
