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
import { ArgsUtil, CreateNodeOperation, GNode, Point } from '@eclipse-glsp/server';
import { Category, CategoryNodeBuilder } from '../graph-extension';
import { ModelTypes } from '../util/model-types';
import { CreateWorkflowNodeOperationHandler } from './create-workflow-node-operation-handler';

export class CreateCategoryHandler extends CreateWorkflowNodeOperationHandler {
    elementTypeIds = [ModelTypes.CATEGORY];
    label = 'Category';

    createNode(operation: CreateNodeOperation, relativeLocation?: Point): GNode | undefined {
        return this.builder(relativeLocation).build();
    }

    protected builder(point: Point | undefined): CategoryNodeBuilder {
        return Category.builder()
            .type(this.elementTypeIds[0])
            .position(point ?? Point.ORIGIN)
            .name(this.label.replace(' ', '') + this.modelState.index.getAllByClass(Category).length)
            .addArgs(ArgsUtil.cornerRadius(5))
            .children();
    }
}
