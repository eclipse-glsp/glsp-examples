/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import {
    ActivityModelNode,
    CategoryModelNode,
    CompHeaderModelElement,
    IconModelElement,
    LabelModelElement,
    ModelElement,
    SimpleModelEdge,
    StructModelElement,
    TaskModelNode,
    WeightedModelEdge,
    WorkflowModel
} from '../model/workflow-model';
import { WorkflowModelState } from '../model/workflow-model-state';
import { GCompartment, GEdge, GLabel, GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from './model-types';
import { ActivityNode, Category, TaskNode, WeightedEdge } from '../graph-extension';

export namespace WorkflowSerializer {
    export function serializeModel(modelState: WorkflowModelState): string {
        return JSON.stringify(transformModel(modelState), undefined, 2);
    }

    export function transformModel(modelState: WorkflowModelState): WorkflowModel {
        const gmodel = modelState.root;
        const result: WorkflowModel = { id: gmodel.id, nodes: { tasks: [], activities: [] }, edges: { simple: [], weighted: [] } };

        result.id = gmodel.id;

        gmodel.children.forEach(child => {
            switch (child.type) {
                case ModelTypes.MANUAL_TASK:
                case ModelTypes.AUTOMATED_TASK: {
                    result.nodes.tasks!.push(transformChild(child) as TaskModelNode);
                    break;
                }
                case ModelTypes.DECISION_NODE:
                case ModelTypes.JOIN_NODE:
                case ModelTypes.FORK_NODE:
                case ModelTypes.MERGE_NODE: {
                    result.nodes.activities!.push(transformChild(child) as ActivityModelNode);
                    break;
                }
                case 'edge': {
                    result.edges.simple!.push(transformChild(child) as SimpleModelEdge);
                    break;
                }
                case ModelTypes.WEIGHTED_EDGE: {
                    result.edges.weighted!.push(transformChild(child) as WeightedModelEdge);
                    break;
                }
                case ModelTypes.CATEGORY: {
                    result.categories = result.categories ?? [];
                    result.categories.push(transformChild(child) as CategoryModelNode);
                }
            }
        });

        return result;
    }

    function transformChild(child: GModelElement): ModelElement {
        switch (child.type) {
            case ModelTypes.MANUAL_TASK:
            case ModelTypes.AUTOMATED_TASK: {
                const element = child as TaskNode;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size,
                    name: element.name,
                    children: element.children.map(c => transformChild(c))
                } as TaskModelNode;
            }
            case ModelTypes.ICON: {
                const element = child as GCompartment;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size
                } as IconModelElement;
            }
            case ModelTypes.LABEL_HEADING: {
                const element = child as GLabel;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size,
                    alignment: element.alignment,
                    text: element.text
                } as LabelModelElement;
            }
            case ModelTypes.DECISION_NODE:
            case ModelTypes.JOIN_NODE:
            case ModelTypes.FORK_NODE:
            case ModelTypes.MERGE_NODE: {
                const element = child as ActivityNode;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size
                } as ActivityModelNode;
            }
            case ModelTypes.CATEGORY: {
                const element = child as Category;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size,
                    name: element.name,
                    children: element.children.map(c => transformChild(c))
                } as CategoryModelNode;
            }
            case ModelTypes.COMP_HEADER: {
                const element = child as GCompartment;
                const label = element.children.find(c => c.type === ModelTypes.LABEL_HEADING);
                if (!label) {
                    throw new Error('COMP_HEADER without label!');
                }
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size,
                    label: transformChild(label)
                } as CompHeaderModelElement;
            }
            case ModelTypes.STRUCTURE: {
                const element = child as GCompartment;
                return {
                    id: element.id,
                    type: element.type,
                    position: element.position,
                    size: element.size,
                    tasks: child.children.filter(c => c.type.startsWith(ModelTypes.TASK)).map(c => transformChild(c)),
                    activities: child.children.filter(c => c.type.startsWith(ModelTypes.ACTIVITY_NODE)).map(c => transformChild(c))
                } as StructModelElement;
            }
            case 'edge': {
                const element = child as GEdge;
                return {
                    id: element.id,
                    routingPoints: element.routingPoints,
                    sourceId: element.sourceId,
                    targetId: element.targetId
                } as SimpleModelEdge;
            }
            case ModelTypes.WEIGHTED_EDGE: {
                const element = child as WeightedEdge;
                return {
                    id: element.id,
                    routingPoints: element.routingPoints,
                    sourceId: element.sourceId,
                    targetId: element.targetId,
                    probabilty: element.probability
                } as WeightedModelEdge;
            }
            default: {
                throw new Error("Unknown model type can't be serialized!");
            }
        }
    }
}
