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
import { ArgsUtil, GCompartment, GEdge, GGraph, GLabel, GModelFactory } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { WorkflowModelState } from './workflow-model-state';
import {
    ActivityModelNode,
    CategoryModelNode,
    CompHeaderModelElement,
    IconModelElement,
    LabelModelElement,
    SimpleModelEdge,
    StructModelElement,
    TaskModelNode,
    WeightedModelEdge
} from './workflow-model';
import { ActivityNode, Category, TaskNode, WeightedEdge } from '../graph-extension';
import { ModelTypes } from '../util/model-types';

@injectable()
export class WorkflowGModelFactory implements GModelFactory {
    @inject(WorkflowModelState)
    protected modelState: WorkflowModelState;

    createModel(): void {
        // Only create the gmodel after the initial load
        // All other changes will automatically be applied to the gmodel in memory
        if (this.modelState.root) {
            console.log(this.modelState.root);
            return;
        }

        const workflowModel = this.modelState.sourceModel;
        const tasks = workflowModel.nodes.tasks?.map(task => this.createTaskNode(task)) ?? [];
        const activities = workflowModel.nodes.activities?.map(activity => this.createActivityNode(activity)) ?? [];
        const simpleEdges = workflowModel.edges.simple?.map(edge => this.createSimpleEdge(edge)) ?? [];
        const weightedEdges = workflowModel.edges.weighted?.map(edge => this.createWeightedEdge(edge)) ?? [];
        const categories = workflowModel.categories?.map(category => this.createCategory(category)) ?? [];
        const newRoot = GGraph.builder()
            .id(workflowModel.id)
            .addChildren(tasks)
            .addChildren(activities)
            .addChildren(simpleEdges)
            .addChildren(weightedEdges)
            .addChildren(categories)
            .build();
        this.modelState.updateRoot(newRoot);
        console.log(this.modelState.root);
    }

    protected createTaskNode(task: TaskModelNode): TaskNode {
        const builder = TaskNode.builder().id(task.id).name(task.name).type(task.type).position(task.position);

        if (task.size) {
            builder.addLayoutOptions({ prefWidth: task.size.width, prefHeight: task.size.height }).size(task.size);
        }

        const taskType = ModelTypes.toNodeType(task.type);
        builder.addCssClass(taskType).taskType(taskType);

        task.children?.forEach(child => {
            if (child.type === ModelTypes.ICON) {
                builder.add(this.createIcon(child));
            } else if (child.type === ModelTypes.LABEL_HEADING) {
                builder.add(this.createLabel(child as LabelModelElement));
            }
        });

        return builder.build();
    }

    protected createIcon(icon: IconModelElement): GCompartment {
        return GCompartment.builder()
            .id(icon.id)
            .type(icon.type)
            .position(icon.position)
            .size(icon.size?.width ?? 0, icon.size?.height ?? 0)
            .build();
    }

    protected createLabel(label: LabelModelElement): GLabel {
        return GLabel.builder()
            .id(label.id)
            .type(label.type)
            .position(label.position)
            .size(label.size?.width ?? 0, label.size?.height ?? 0)
            .alignment(label.alignment)
            .text(label.text)
            .build();
    }

    protected createActivityNode(activity: ActivityModelNode): ActivityNode {
        const builder = ActivityNode.builder()
            .id(activity.id)
            .type(activity.type)
            .position(activity.position)
            .size(activity.size?.width ?? 0, activity.size?.height ?? 0)
            .nodeType(ModelTypes.toNodeType(activity.type));

        switch (activity.type) {
            case ModelTypes.DECISION_NODE: {
                builder.addCssClass('decision');
                break;
            }
            case ModelTypes.MERGE_NODE: {
                builder.addCssClass('merge');
                break;
            }
            case ModelTypes.JOIN_NODE:
            case ModelTypes.FORK_NODE: {
                builder.addCssClass('forkOrJoin');
            }
        }

        return builder.build();
    }

    protected createCategory(category: CategoryModelNode): Category {
        const builder = Category.builder()
            .id(category.id)
            .name(category.name)
            .type(category.type)
            .position(category.position)
            .addArgs(ArgsUtil.cornerRadius(5));

        if (category.size) {
            builder.addLayoutOptions({ prefWidth: category.size.width, prefHeight: category.size.height }).size(category.size);
        }

        category.children?.forEach(child => {
            if (child.type === ModelTypes.COMP_HEADER) {
                builder.add(this.createCompHeader(child as CompHeaderModelElement));
            } else if (child.type === ModelTypes.STRUCTURE) {
                builder.add(this.createStruct(child as StructModelElement));
            }
        });

        return builder.build();
    }

    protected createCompHeader(header: CompHeaderModelElement): GCompartment {
        return GCompartment.builder()
            .id(header.id)
            .position(header.position)
            .type(header.type)
            .layout('hbox')
            .size(header.size?.width ?? 0, header.size?.height ?? 0)
            .add(this.createLabel(header.label))
            .build();
    }

    protected createStruct(struct: StructModelElement): GCompartment {
        const builder = GCompartment.builder()
            .id(struct.id)
            .position(struct.position)
            .type(struct.type)
            .layout('freeform')
            .addLayoutOptions({ hAlign: 'left', hGrab: true, vGrab: true })
            .size(struct.size?.width ?? 0, struct.size?.height ?? 0);

        if (struct.tasks) {
            builder.addChildren(struct.tasks.map(t => this.createTaskNode(t)));
        }
        if (struct.activities) {
            builder.addChildren(struct.activities.map(a => this.createActivityNode(a)));
        }

        return builder.build();
    }

    protected createSimpleEdge(edge: SimpleModelEdge): GEdge {
        return GEdge.builder()
            .id(edge.id)
            .type('edge')
            .addRoutingPoints(edge.routingPoints)
            .sourceId(edge.sourceId)
            .targetId(edge.targetId)
            .build();
    }

    protected createWeightedEdge(edge: WeightedModelEdge): GEdge {
        return WeightedEdge.builder()
            .id(edge.id)
            .type(ModelTypes.WEIGHTED_EDGE)
            .addRoutingPoints(edge.routingPoints)
            .sourceId(edge.sourceId)
            .targetId(edge.targetId)
            .probability(edge.probabilty ?? 'medium')
            .addCssClass(edge.probabilty ?? 'medium')
            .build();
    }
}
