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
import {
    CreateNodeOperation,
    GCompartment,
    GModelCreateNodeOperationHandler,
    GModelElement,
    ModelState,
    Point
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Category } from '../graph-extension';
import { ModelTypes } from '../util/model-types';
import { GridSnapper } from './grid-snapper';

@injectable()
export abstract class CreateWorkflowNodeOperationHandler extends GModelCreateNodeOperationHandler {
    @inject(ModelState)
    protected override modelState: ModelState;

    override getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    override getContainer(operation: CreateNodeOperation): GModelElement | undefined {
        const container = super.getContainer(operation);

        if (container instanceof Category) {
            const structComp = this.getCategoryCompartment(container);
            if (structComp) {
                return structComp;
            }
        }
        return container;
    }

    getCategoryCompartment(category: Category): GCompartment | undefined {
        return category.children
            .filter(child => child instanceof GCompartment)
            .map(child => child as GCompartment)
            .find(comp => ModelTypes.STRUCTURE === comp.type);
    }
}
