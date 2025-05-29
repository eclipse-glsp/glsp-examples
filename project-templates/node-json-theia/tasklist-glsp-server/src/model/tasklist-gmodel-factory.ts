/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
import { ArgsUtil, GCompartment, GEdge, GLabel, GModelFactory, GNode } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { getLod, LodCompartment, LodGraph } from '../level-of-detail/model';
import { Task, Transition } from './tasklist-model';
import { TaskListModelState } from './tasklist-model-state';

@injectable()
export class TaskListGModelFactory implements GModelFactory {
    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    createModel(): void {
        const taskList = this.modelState.sourceModel;
        this.modelState.index.indexTaskList(taskList);
        const childNodes = taskList.tasks.map(task => this.createTaskNode(task));
        const childEdges = taskList.transitions.map(transition => this.createTransitionEdge(transition));
        // Retrieve the current level of detail (LoD) from the model state and apply it to the graph
        const lod = getLod(this.modelState);
        const newRoot = LodGraph.builder() //
            .id(taskList.id)
            .addChildren(childNodes)
            .addChildren(childEdges)
            .levelOfDetail(lod)
            .addCssClasses(`lod-${lod}`)
            .build();
        this.modelState.updateRoot(newRoot);
    }

    protected createTaskNode(task: Task): GNode {
        const builder = GNode.builder()
            .id(task.id)
            .addCssClass('tasklist-node')
            .layout('vbox')
            .addLayoutOptions(ArgsUtil.cornerRadius(5))
            .addLayoutOptions({
                prefWidth: task.size.width,
                prefHeight: task.size.height
            })
            // Add a generic label compartment visible in all Lods
            .add(
                LodCompartment.builder()
                    .visibleIn(['overview', 'default', 'detail'])
                    .id(`${task.id}_comp_default`)
                    .layout('hbox')
                    .add(GLabel.builder().text(task.name).id(`${task.id}_label`).type('label:editable').build())
                    .addLayoutOptions({ vGrab: true })
                    .build()
            )
            // Add a compartment that is only visible in the detail level
            .add(
                LodCompartment.builder()
                    .visibleIn(['detail'])
                    .id(`${task.id}_comp_details`)
                    .layout('vbox')
                    .add(this.createFormCompartment(task, 'ID', task.id, 0))
                    .add(this.createFormCompartment(task, 'Description', 'Foo', 1))
                    .add(this.createFormCompartment(task, 'Due date', 'none', 2))
                    .build()
            )

            .position(task.position);

        return builder.build();
    }

    protected createFormCompartment(task: Task, label: string, text: string, index: number): GCompartment {
        return GCompartment.builder()
            .id(`${task.id}_form_${index}`)
            .layout('hbox')
            .addLayoutOptions({ hGap: 5 }) //
            .add(
                GLabel.builder()
                    .id(`${task.id}_form_${index}_label`)
                    .text(label + ':')
                    .build()
            )
            .add(GLabel.builder().id(`${task.id}_form_${index}_text`).text(text).build())
            .build();
    }

    protected createTransitionEdge(transition: Transition): GEdge {
        return GEdge.builder() //
            .id(transition.id)
            .addCssClass('tasklist-transition')
            .sourceId(transition.sourceTaskId)
            .targetId(transition.targetTaskId)
            .build();
    }
}
