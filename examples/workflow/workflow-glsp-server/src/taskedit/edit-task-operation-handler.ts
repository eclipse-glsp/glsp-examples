/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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

import { Action, Command, getOrThrow, GModelOperationHandler, hasStringProp, MaybePromise, Operation } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { TaskNode } from '../graph-extension';
import { ModelTypes } from '../util/model-types';
/**
 * Is send from the {@link TaskEditor} to the GLSP server
 * to update a feature from a specified task.
 */
export interface EditTaskOperation extends Operation {
    kind: typeof EditTaskOperation.KIND;

    /**
     * Id of the task that should be edited
     */
    taskId: string;

    /**
     * The feature that is to be updated
     */
    feature: 'duration' | 'taskType';

    /**
     * The new feature value
     */
    value: string;
}

export namespace EditTaskOperation {
    export const KIND = 'editTask';

    export function is(object: any): object is EditTaskOperation {
        return (
            Action.hasKind(object, KIND) &&
            hasStringProp(object, 'taskId') &&
            hasStringProp(object, 'feature') &&
            hasStringProp(object, 'value')
        );
    }

    export function create(options: { taskId: string; feature: 'duration' | 'taskType'; value: string }): EditTaskOperation {
        return {
            kind: KIND,
            isOperation: true,
            ...options
        };
    }
}

@injectable()
export class EditTaskOperationHandler extends GModelOperationHandler {
    readonly operationType = EditTaskOperation.KIND;

    createCommand(operation: EditTaskOperation): MaybePromise<Command | undefined> {
        const task = getOrThrow(
            this.modelState.index.findByClass(operation.taskId, TaskNode),
            `Cannot find task with id '${operation.taskId}'`
        );
        switch (operation.feature) {
            case 'duration': {
                const duration = Number.parseInt(operation.value, 10);
                return duration !== task.duration //
                    ? this.commandOf(() => this.editDuration(task, duration))
                    : undefined;
            }
            case 'taskType': {
                return task.taskType !== operation.value //
                    ? this.commandOf(() => this.editTaskType(task, operation.value))
                    : undefined;
            }
        }
    }

    protected editDuration(task: TaskNode, duration: number): void {
        task.duration = duration;
    }

    protected editTaskType(task: TaskNode, type: string): void {
        task.taskType = type;
        if (type === 'manual' || type === 'automated') {
            const temp = this.createTempTask(type, task);
            const toAssign: Partial<TaskNode> = {
                taskType: temp.taskType,
                type: temp.type,
                children: temp.children,
                cssClasses: temp.cssClasses
            };
            Object.assign(task, toAssign);
            return;
        }
        throw new Error(`Could not edit task '${task.id}'. Invalid type: ${type}`);
    }

    protected createTempTask(type: 'automated' | 'manual', task: TaskNode): TaskNode {
        return TaskNode.builder() //
            .type(type === 'automated' ? ModelTypes.AUTOMATED_TASK : ModelTypes.MANUAL_TASK)
            .taskType(type)
            .name(task.name)
            .addCssClass(type)
            .children()
            .build();
    }
}
