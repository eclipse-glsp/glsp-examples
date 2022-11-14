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
import { inject, injectable } from 'inversify';
import { TaskList } from '../model/tasklist-model';
import { TaskListModelState } from '../model/tasklist-model-state';

/**
 * A simple memento that is used to memorize
 * the state of the tasklist source model before executing an operation.
 * In addition, this memento provides undo/redo support.
 */
@injectable()
export class TaskListMemento {
    protected history: string[] = [];
    protected redoStack: string[] = [];

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    /**
     * Take a snapshot of the current  and add it to the mementos history.
     */
    snapshot(): void {
        // To avoid the need for deep copying the original source model we store it in serialized format.
        const serialized = JSON.stringify(this.modelState.taskList);
        this.history.push(serialized);
        // Clear the redoStack
        this.redoStack = [];
    }

    undo(): TaskList | undefined {
        const snapshotToRestore = this.history.pop();
        if (snapshotToRestore) {
            // Push the current state onto the redo stack
            this.redoStack.push(JSON.stringify(this.modelState.taskList));
            return this.restore(snapshotToRestore);
        }
        return undefined;
    }

    redo(): TaskList | undefined {
        const snapshotToRestore = this.redoStack.pop();
        if (snapshotToRestore) {
            // Push the current state onto the undo history stack
            this.history.push(JSON.stringify(this.modelState.taskList));
            return this.restore(snapshotToRestore);
        }
        return undefined;
    }

    get isDirty(): boolean {
        return this.history.length > 0;
    }

    getCurrent(): string | undefined {
        if (this.history.length > 0) {
            return this.history[this.history.length - 1];
        }
        return undefined;
    }

    clear(): void {
        this.history = [];
        this.redoStack = [];
    }

    protected restore(snapshot: string): TaskList | undefined {
        return JSON.parse(snapshot);
    }
}
