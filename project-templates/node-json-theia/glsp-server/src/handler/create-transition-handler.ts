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
import { CreateEdgeOperation, CreateOperationHandler, DefaultTypes } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { Transition } from '../model/tasklist-model';
import { TaskListModelState } from '../model/tasklist-model-state';

@injectable()
export class CreateTransitionHandler extends CreateOperationHandler {
    readonly elementTypeIds = [DefaultTypes.EDGE];

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    get operationType(): string {
        return CreateEdgeOperation.KIND;
    }

    execute(operation: CreateEdgeOperation): void {
        const transition: Transition = {
            id: uuid.v4(),
            sourceTaskId: operation.sourceElementId,
            targetTaskId: operation.targetElementId
        };
        this.modelState.taskList.transitions.push(transition);
    }

    get label(): string {
        return 'Transition';
    }
}
