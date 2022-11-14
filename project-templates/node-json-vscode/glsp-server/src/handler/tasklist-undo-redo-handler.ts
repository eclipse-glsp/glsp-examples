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
import {
    Action,
    ActionHandler,
    DirtyStateChangeReason,
    MaybePromise,
    ModelSubmissionHandler,
    RedoOperation,
    UndoOperation
} from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { TaskList } from '../model/tasklist-model';
import { TaskListModelState } from '../model/tasklist-model-state';
import { TaskListMemento } from './tasklist-memento';

@injectable()
export class TaskListUndoRedoActionHandler implements ActionHandler {
    @inject(TaskListMemento)
    protected memento: TaskListMemento;

    @inject(ModelSubmissionHandler)
    protected modelSubmissionHandler: ModelSubmissionHandler;

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    readonly actionKinds = [UndoOperation.KIND, RedoOperation.KIND];

    execute(action: Action): MaybePromise<Action[]> {
        if (UndoOperation.is(action)) {
            return this.undo();
        } else if (RedoOperation.is(action)) {
            return this.redo();
        }
        return [];
    }

    protected undo(): Action[] {
        const newTaskList = this.memento.undo();
        return newTaskList ? this.updateModel(newTaskList, 'undo') : [];
    }

    protected redo(): Action[] {
        const newTaskList = this.memento.redo();
        return newTaskList ? this.updateModel(newTaskList, 'redo') : [];
    }

    protected updateModel(newTaskList: TaskList, reason: DirtyStateChangeReason): Action[] {
        this.modelState.taskList = newTaskList;
        this.modelState.isDirty = this.memento.isDirty;
        return this.modelSubmissionHandler.submitModel(reason);
    }
}
