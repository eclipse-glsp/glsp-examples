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
import { DeleteElementOperation, GNode, MaybePromise, OperationHandler, remove, toTypeGuard } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { TaskListModelState } from '../model/tasklist-model-state';

@injectable()
export class DeleteTaskNodeHandler implements OperationHandler {
    readonly operationType = DeleteElementOperation.KIND;

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    execute(operation: DeleteElementOperation): MaybePromise<void> {
        operation.elementIds.forEach(elementId => this.deleteTask(elementId));
    }

    protected deleteTask(elementId: string): void {
        const index = this.modelState.index;
        let task = index.findTask(elementId);
        if (!task) {
            const taskNode = index.findParentElement(elementId, toTypeGuard(GNode));
            if (taskNode) {
                task = index.findTask(taskNode.id);
            }
        }
        if (task) {
            remove(this.modelState.taskList.tasks, task);
        }
    }
}
