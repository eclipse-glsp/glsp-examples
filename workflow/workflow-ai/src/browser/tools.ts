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
import { ToolProvider, ToolRequest } from '@theia/ai-core';
import { DiffService } from '@theia/workspace/lib/browser/diff-service';

import {
    ApplyLabelEditOperation,
    CenterAction,
    ChangeBoundsOperation,
    CreateEdgeOperation,
    CreateNodeOperation,
    DeleteElementOperation,
    GLSPActionDispatcher,
    GModelRoot,
    isBoundsAware,
    isParent,
    SelectAction,
    toArray
} from '@eclipse-glsp/client';
import { URI } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkflowDiagramProvider } from './workflow-diagram-provider';

export namespace WorkflowAi {
    export const GET_DIAGRAM_TOOL_ID = 'get_diagram';
    export const CREATE_NODES_TOOL_ID = 'create_nodes';
    export const DELETE_NODES_TOOL_ID = 'delete_nodes';
    export const MOVE_NODES_TOOL_ID = 'move_nodes';
    export const CHANGE_NODE_LABELS_TOOL_ID = 'change_node_labels';
    export const CREATE_EDGES_TOOL_ID = 'create_edges';
    export const DELETE_EDGES_TOOL_ID = 'delete_edges';
    export const SHOW_NODES_TOOL_ID = 'show_nodes';
    export const GET_DOCUMENTATION_TOOL_ID = 'get_documentation';
    export const UPDATE_DOCUMENTATION_TOOL_ID = 'update_documentation';
}

export interface ToolCallResult {
    status: 'OK' | 'Error';
    nodes?: { id: string; label: string }[];
    edges?: { id: string; source_node_id: string; target_node_id: string }[];
    diagram?: any;
    content?: string;
}

@injectable()
export abstract class WorkflowTool implements ToolProvider {
    @inject(WorkflowDiagramProvider)
    protected diagramProvider: WorkflowDiagramProvider;

    protected get modelState(): GModelRoot {
        const modelState = this.diagramProvider.getModelState();
        if (!modelState) {
            throw new Error('No diagram model state available');
        }
        return modelState;
    }

    protected get actionDispatcher(): GLSPActionDispatcher {
        const actionDispatcher = this.diagramProvider.getActionDispatcher();
        if (!actionDispatcher) {
            throw new Error('No action dispatcher state available');
        }
        return actionDispatcher;
    }

    protected awaitUpdate(): Promise<void> {
        return this.diagramProvider.awaitModelUpdate();
    }

    protected get sourceUri(): string {
        const resourceUri = this.diagramProvider.getWorkflowWidget()?.getResourceUri()?.toString();
        if (!resourceUri) {
            throw new Error('No source URI available');
        }
        return resourceUri;
    }

    abstract getTool(): ToolRequest;
}

@injectable()
export class GetDiagram extends WorkflowTool {
    static ID = WorkflowAi.GET_DIAGRAM_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.GET_DIAGRAM_TOOL_ID,
            name: WorkflowAi.GET_DIAGRAM_TOOL_ID,
            description: 'Returns the current state of the diagram in a JSON format consisting of typed nodes and edges for you.',
            handler: () => this.getDiagram()
        };
    }

    async getDiagram(): Promise<ToolCallResult> {
        return { status: 'OK', diagram: this.diagramProvider.getModelDescription() };
    }
}

@injectable()
export class CreateNodes extends WorkflowTool {
    static ID = WorkflowAi.CREATE_NODES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.CREATE_NODES_TOOL_ID,
            name: WorkflowAi.CREATE_NODES_TOOL_ID,
            description: 'Creates multiple nodes, each with specified type_id, label, and position',
            parameters: {
                type: 'object',
                properties: {
                    nodes: {
                        type: 'array',
                        description: 'Array of node specifications',
                        items: {
                            type: 'object',
                            properties: {
                                type_id: {
                                    type: 'string',
                                    description: 'Unique identifier for the node type.'
                                },
                                label: {
                                    type: 'string',
                                    description: 'Label for the node.'
                                },
                                position: {
                                    type: 'object',
                                    description: 'Coordinates of the node.',
                                    properties: {
                                        x: {
                                            type: 'number',
                                            description: 'X coordinate of the node.'
                                        },
                                        y: {
                                            type: 'number',
                                            description: 'Y coordinate of the node.'
                                        }
                                    },
                                    required: ['x', 'y']
                                }
                            },
                            required: ['type_id', 'position']
                        }
                    }
                }
            },
            handler: args => this.createNodes(JSON.parse(args || '{}'))
        };
    }

    async createNodes(args: any): Promise<ToolCallResult> {
        const nodes = [];
        for (const nodeToCreate of args.nodes) {
            const allIds = toArray(this.modelState.index.all().map(element => element.id));
            const location = nodeToCreate.position;
            await this.actionDispatcher.dispatch(CreateNodeOperation.create(nodeToCreate.type_id, { location }));
            await this.awaitUpdate();
            const newIds = toArray(
                this.modelState.index
                    .all()
                    .map(element => element.id)
                    .filter(id => !allIds.includes(id))
            );
            if (nodeToCreate.label && newIds[2]) {
                await this.actionDispatcher.dispatch(
                    ApplyLabelEditOperation.create({
                        labelId: newIds[2],
                        text: nodeToCreate.label
                    })
                );
            }
            nodes.push({ id: newIds[0], label: nodeToCreate.label });
        }
        return { status: 'OK', nodes };
    }
}

@injectable()
export class DeleteNodes extends WorkflowTool {
    static ID = WorkflowAi.DELETE_NODES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.DELETE_NODES_TOOL_ID,
            name: WorkflowAi.DELETE_NODES_TOOL_ID,
            description: 'Deletes the nodes with the specified array of node_ids',
            parameters: {
                type: 'object',
                properties: {
                    node_ids: {
                        type: 'array',
                        description: 'Unique identifiers of nodes to be deleted.',
                        items: {
                            type: 'string'
                        }
                    }
                }
            },
            handler: args => this.deleteNodes(JSON.parse(args || '{}'))
        };
    }

    async deleteNodes(args: any): Promise<ToolCallResult> {
        await this.actionDispatcher.dispatch(DeleteElementOperation.create(args.node_ids));
        return { status: 'OK' };
    }
}

@injectable()
export class MoveNodes extends WorkflowTool {
    static ID = WorkflowAi.MOVE_NODES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.MOVE_NODES_TOOL_ID,
            name: WorkflowAi.MOVE_NODES_TOOL_ID,
            description: 'Moves the nodes with the specified node_id to the specified position',
            parameters: {
                type: 'object',
                properties: {
                    moves: {
                        type: 'array',
                        description: 'Array of move specifications',
                        items: {
                            node_id: {
                                type: 'string',
                                description: 'Unique identifier of the node to be deleted.'
                            },
                            position: {
                                type: 'object',
                                description: 'New coordinates of the node.',
                                properties: {
                                    x: {
                                        type: 'number',
                                        description: 'X coordinate of the node.'
                                    },
                                    y: {
                                        type: 'number',
                                        description: 'Y coordinate of the node.'
                                    }
                                },
                                required: ['x', 'y']
                            }
                        },
                        required: ['node_id', 'position']
                    }
                }
            },
            handler: args => this.moveNodes(JSON.parse(args || '{}'))
        };
    }

    async moveNodes(args: any): Promise<ToolCallResult> {
        const moveOperations = [];
        const moves: { node_id: string; position: { x: number; y: number } }[] = args.moves;

        for (const move of moves) {
            const node = this.modelState.index.getById(move.node_id);
            if (!node || !isBoundsAware(node)) {
                return { status: 'Error' };
            }
            moveOperations.push({
                elementId: move.node_id,
                newSize: { width: node.bounds.width, height: node.bounds.height },
                newPosition: {
                    x: move.position.x,
                    y: move.position.y
                }
            });
        }

        await this.actionDispatcher.dispatch(ChangeBoundsOperation.create(moveOperations));
        return { status: 'OK' };
    }
}

@injectable()
export class ChangeNodeLabels extends WorkflowTool {
    static ID = WorkflowAi.CHANGE_NODE_LABELS_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.CHANGE_NODE_LABELS_TOOL_ID,
            name: WorkflowAi.CHANGE_NODE_LABELS_TOOL_ID,
            description: 'Changes the label of the nodes with the specified array of node_id to new_label',
            parameters: {
                type: 'object',
                properties: {
                    renames: {
                        type: 'array',
                        description: 'The array of rename operations',
                        items: {
                            node_id: {
                                type: 'string',
                                description: 'Unique identifier of the node to change the label.'
                            },
                            new_label: {
                                type: 'string',
                                description: 'The new label for the node.'
                            }
                        },
                        required: ['node_id', 'new_label']
                    }
                }
            },
            handler: args => this.changeLabels(JSON.parse(args || '{}'))
        };
    }

    async changeLabels(args: any): Promise<ToolCallResult> {
        const operations = [];
        for (const rename of args.renames) {
            const element = this.modelState.index.getById(rename.node_id);
            if (!element || !isParent(element)) {
                return { status: 'Error' };
            }
            const label = element?.children[1];
            if (!label) {
                return { status: 'Error' };
            }
            operations.push(
                ApplyLabelEditOperation.create({
                    labelId: label.id,
                    text: rename.new_label
                })
            );
        }
        await this.actionDispatcher.dispatchAll(operations);
        return { status: 'OK' };
    }
}

@injectable()
export class CreateEdges extends WorkflowTool {
    static ID = WorkflowAi.CREATE_EDGES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.CREATE_EDGES_TOOL_ID,
            name: WorkflowAi.CREATE_EDGES_TOOL_ID,
            description: 'Creates multiple edges, each connecting specified source and target nodes',
            parameters: {
                type: 'object',
                properties: {
                    edges: {
                        type: 'array',
                        description: 'Array of edge specifications',
                        items: {
                            type: 'object',
                            properties: {
                                source_node_id: {
                                    type: 'string',
                                    description: 'The ID of the source node'
                                },
                                target_node_id: {
                                    type: 'string',
                                    description: 'The ID of the target node'
                                }
                            },
                            required: ['source_node_id', 'target_node_id']
                        }
                    }
                }
            },
            handler: args => this.createEdges(JSON.parse(args || '{}'))
        };
    }

    async createEdges(args: any): Promise<ToolCallResult> {
        const edges = [];
        for (const edgeToCreate of args.edges) {
            const allIds = toArray(this.modelState.index.all().map(element => element.id));
            const { source_node_id, target_node_id } = edgeToCreate;
            await this.actionDispatcher.dispatch(
                CreateEdgeOperation.create({
                    elementTypeId: edgeToCreate.type_id ?? 'edge',
                    sourceElementId: edgeToCreate.source_node_id,
                    targetElementId: edgeToCreate.target_node_id
                })
            );
            await this.awaitUpdate();
            const newIds = toArray(
                this.modelState.index
                    .all()
                    .map(element => element.id)
                    .filter(id => !allIds.includes(id))
            );
            edges.push({ id: newIds[0], source_node_id, target_node_id });
        }
        return { status: 'OK', edges };
    }
}

@injectable()
export class DeleteEdges extends WorkflowTool {
    static ID = WorkflowAi.DELETE_EDGES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.DELETE_EDGES_TOOL_ID,
            name: WorkflowAi.DELETE_EDGES_TOOL_ID,
            description: 'Deletes the edges with the specified edge_ids',
            parameters: {
                type: 'object',
                properties: {
                    edge_ids: {
                        type: 'array',
                        description: 'Unique identifiers of the edges to be deleted.',
                        items: {
                            type: 'string'
                        }
                    }
                }
            },
            handler: args => this.deleteNodes(JSON.parse(args || '{}'))
        };
    }

    async deleteNodes(args: any): Promise<ToolCallResult> {
        await this.actionDispatcher.dispatch(DeleteElementOperation.create(args.edge_ids));
        return { status: 'OK' };
    }
}

@injectable()
export class ShowNodes extends WorkflowTool {
    static ID = WorkflowAi.SHOW_NODES_TOOL_ID;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.SHOW_NODES_TOOL_ID,
            name: WorkflowAi.SHOW_NODES_TOOL_ID,
            description: 'Centers the viewport (reveals) to make the node(s) visible and selects the node(s) with the specified node_ids',
            parameters: {
                type: 'object',
                properties: {
                    node_ids: {
                        type: 'array',
                        description: 'Unique identifiers of nodes to be centered and selected.',
                        items: {
                            type: 'string'
                        }
                    }
                }
            },
            handler: args => this.deleteNodes(JSON.parse(args || '{}'))
        };
    }

    async deleteNodes(args: any): Promise<ToolCallResult> {
        const ids: string[] = [];
        ids.push(...args.node_ids);
        for (const id of ids) {
            if (!this.modelState.index.getById(id)) {
                return { status: 'Error' };
            }
        }
        const toBeDeselected = toArray(
            this.modelState.index
                .all()
                .map(element => element.id)
                .filter(anId => !ids.includes(anId))
        );
        await this.actionDispatcher.dispatchAll([
            CenterAction.create(ids),
            SelectAction.create({ selectedElementsIDs: ids, deselectedElementsIDs: toBeDeselected })
        ]);
        return { status: 'OK' };
    }
}

@injectable()
export class GetDocumentation extends WorkflowTool {
    static ID = WorkflowAi.GET_DOCUMENTATION_TOOL_ID;

    @inject(FileService)
    protected fileService: FileService;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.GET_DOCUMENTATION_TOOL_ID,
            name: WorkflowAi.GET_DOCUMENTATION_TOOL_ID,
            description: 'Returns the documentation file content of the current diagram.',
            handler: args => this.getDocumentation()
        };
    }

    async getDocumentation(): Promise<ToolCallResult> {
        const sourceUri = this.sourceUri;
        if (!sourceUri) {
            return { status: 'Error' };
        }
        const docUri = sourceUri.replace('.wf', '.md');
        if (!this.fileService.exists(new URI(docUri))) {
            return { status: 'OK', content: '' };
        }
        const content = await this.fileService.read(new URI(docUri));
        return { status: 'OK', content: content.value };
    }
}

@injectable()
export class UpdateDocumentation extends WorkflowTool {
    static ID = WorkflowAi.UPDATE_DOCUMENTATION_TOOL_ID;

    @inject(FileService)
    protected fileService: FileService;

    @inject(DiffService)
    diffService: DiffService;

    getTool(): ToolRequest {
        return {
            id: WorkflowAi.UPDATE_DOCUMENTATION_TOOL_ID,
            name: WorkflowAi.UPDATE_DOCUMENTATION_TOOL_ID,
            description: 'Stores the provided content in the documentation file.',
            parameters: {
                type: 'object',
                properties: {
                    content: {
                        type: 'string',
                        description: 'The content to be stored in the documentation file.'
                    }
                }
            },
            handler: args => this.updateDocumentation(JSON.parse(args || '{}'))
        };
    }

    async updateDocumentation(args: any): Promise<ToolCallResult> {
        const content = args.content;
        const sourceUri = this.sourceUri;
        if (!sourceUri) {
            return { status: 'Error' };
        }
        let docUri = sourceUri.replace('.wf', '.md');
        docUri = (await this.fileService.exists(new URI(docUri))) ? docUri.replace('.md', '-updated.md') : docUri;
        await this.fileService.write(new URI(docUri), content);

        this.diffService.openDiffEditor(
            new URI(sourceUri.replace('.wf', '-updated.md')),
            new URI(sourceUri.replace('.wf', '.md')),
            'Updated Documentation',
            {
                diffWordWrap: 'on',
                originalEditable: true
            }
        );

        return { status: 'OK' };
    }
}
