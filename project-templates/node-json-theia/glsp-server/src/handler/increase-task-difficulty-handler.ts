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

import { MaybePromise, Operation, OperationHandler } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { TaskListModelState } from '../model/tasklist-model-state';

export interface IncreaseTaskDifficultyOperation extends Operation {
    elementId: string;
}

@injectable()
export class IncreaseTaskDifficultyOperationHandler implements OperationHandler {
    readonly operationType = 'increaseTaskDifficulty';

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    execute(operation: IncreaseTaskDifficultyOperation): MaybePromise<void> {
        const task = this.modelState.index.findTask(operation.elementId);
        if (!task) {
            throw new Error(`Cannot find task with id ${operation.elementId}`);
        }

        switch (task.difficulty) {
            case undefined:
                task.difficulty = 'low';
                break;
            case 'low':
                task.difficulty = 'medium';
                break;
            case 'medium':
                task.difficulty = 'hard';
                break;
            case 'hard':
        }
    }
}
