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
import { DefaultModelState } from '@eclipse-glsp/server-node';
import { inject, injectable } from 'inversify';
import { TaskList } from './tasklist-model';
import { TaskListModelIndex } from './tasklist-model-index';

@injectable()
export class TaskListModelState extends DefaultModelState {
    @inject(TaskListModelIndex)
    override readonly index: TaskListModelIndex;

    protected _taskList: TaskList;

    get taskList(): TaskList {
        return this._taskList;
    }

    set taskList(taskList: TaskList) {
        this._taskList = taskList;
        this.index.indexTaskList(taskList);
    }
}
