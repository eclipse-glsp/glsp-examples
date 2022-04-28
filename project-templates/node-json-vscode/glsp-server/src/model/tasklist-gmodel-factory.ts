/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
import { GGraph, GLabel, GModelFactory, GNode } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { Task } from './tasklist-model';
import { TasklistModelState } from './tasklist-model-state';

@injectable()
export class TasklistGModelFactory implements GModelFactory {
    @inject(TasklistModelState)
    protected modelState: TasklistModelState;

    createModel(): void {
        const taskList = this.modelState.taskList;
        this.modelState.index.indexTaskList(taskList);
        const childNodes = taskList.tasks.map(task => this.createTaskNode(task));
        this.modelState.root = GGraph.builder().id(taskList.id).addChildren(childNodes).build();
    }

    protected createTaskNode(task: Task): GNode {
        const builder = GNode.builder() //
            .id(task.id)
            .addCssClass('tasklist-node')
            .add(GLabel.builder().text(task.name).id(`${task.id}_label`).build())
            .layout('hbox')
            .addLayoutOption('paddingLeft', 5)
            .position(task.position);

        if (task.size) {
            builder.addLayoutOptions({ prefWidth: task.size.width, prefHeight: task.size.height });
        }

        return builder.build();
    }
}
