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

import { ChangeBoundsOperation, Dimension, GNode, MaybePromise, OperationHandler, Point } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { TaskListModelState } from '../model/tasklist-model-state';

@injectable()
export class TaskListChangeBoundsHandler implements OperationHandler {
    readonly operationType = ChangeBoundsOperation.KIND;

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    execute(operation: ChangeBoundsOperation): MaybePromise<void> {
        for (const element of operation.newBounds) {
            this.changeElementBounds(element.elementId, element.newSize, element.newPosition);
        }
    }
    protected changeElementBounds(elementId: string, newSize: Dimension, newPosition?: Point): void {
        const index = this.modelState.index;
        const taskNode = index.findByClass(elementId, GNode);
        const task = taskNode ? index.findTask(taskNode.id) : undefined;
        if (task) {
            task.size = newSize;
            if (newPosition) {
                task.position = newPosition;
            }
        }
    }
}
