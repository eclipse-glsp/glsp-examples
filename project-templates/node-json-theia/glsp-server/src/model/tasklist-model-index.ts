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
import { GModelIndex } from '@eclipse-glsp/server-node';
import { injectable } from 'inversify';
import { Task, TaskList, Transition } from './tasklist-model';

@injectable()
export class TaskListModelIndex extends GModelIndex {
    protected idToTaskListElements = new Map<string, Task | Transition>();

    indexTaskList(taskList: TaskList): void {
        this.idToTaskListElements.clear();
        for (const element of [...taskList.tasks, ...taskList.transitions]) {
            this.idToTaskListElements.set(element.id, element);
        }
    }

    findTask(id: string): Task | undefined {
        const element = this.findTaskOrTransition(id);
        return Task.is(element) ? element : undefined;
    }

    findTransition(id: string): Transition | undefined {
        const element = this.findTaskOrTransition(id);
        return Transition.is(element) ? element : undefined;
    }

    findTaskOrTransition(id: string): Task | Transition | undefined {
        return this.idToTaskListElements.get(id);
    }
}
