/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { GhostElement, Point } from '@eclipse-glsp/protocol';
import { CreateNodeOperation, GNode } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { TaskNode, TaskNodeBuilder } from '../graph-extension';
import { ModelTypes } from '../util/model-types';
import { CreateWorkflowNodeOperationHandler } from './create-workflow-node-operation-handler';

@injectable()
export abstract class CreateTaskHandler extends CreateWorkflowNodeOperationHandler {
    createNode(operation: CreateNodeOperation, relativeLocation?: Point): GNode | undefined {
        return this.builder(relativeLocation).build();
    }

    protected builder(point: Point = Point.ORIGIN, elementTypeId = this.elementTypeIds[0]): TaskNodeBuilder {
        return TaskNode.builder()
            .position(point ?? Point.ORIGIN)
            .name(this.label.replace(' ', '') + this.modelState.index.getAllByClass(TaskNode).length)
            .type(elementTypeId)
            .taskType(ModelTypes.toNodeType(elementTypeId))
            .children();
    }

    override createTriggerGhostElement(elementTypeId: string): GhostElement | undefined {
        return { template: this.serializer.createSchema(this.builder(undefined, elementTypeId).build()), dynamic: true };
    }
}
