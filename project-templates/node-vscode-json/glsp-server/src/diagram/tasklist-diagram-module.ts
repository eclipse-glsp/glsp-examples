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
    ActionHandlerConstructor,
    ComputedBoundsActionHandler,
    DiagramConfiguration,
    DiagramModule,
    GModelFactory,
    GModelIndex,
    InstanceMultiBinding,
    LabelEditValidator,
    ModelState,
    OperationHandlerConstructor,
    SourceModelStorage
} from '@eclipse-glsp/server-node';
import { BindingTarget } from '@eclipse-glsp/server-node/lib/di/binding-target';
import { injectable } from 'inversify';
import { CreateTaskHandler } from '../handler/create-task-node-handler';
import { TasklistApplyLabelEditHandler } from '../handler/tasklist-apply-label-edit-handler';
import { TasklistChangeBoundsHandler } from '../handler/tasklist-change-bounds-handler';
import { TasklistDeleteHandler } from '../handler/tasklist-delete-handler';
import { TasklistLabelEditValidator } from '../handler/tasklist-label-edit-validator';
import { TasklistGModelFactory } from '../model/tasklist-gmodel-factory';
import { TasklistModelIndex } from '../model/tasklist-model-index';
import { TasklistModelState } from '../model/tasklist-model-state';
import { TasklistStorage } from '../model/tasklist-storage';
import { TasklistDiagramConfiguration } from './tasklist-diagram-configuration';

@injectable()
export class TasklistDiagramModule extends DiagramModule {
    readonly diagramType = 'minimal-diagram';

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return TasklistDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return TasklistStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(TasklistModelState).toSelf().inSingletonScope();
        return { service: TasklistModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return TasklistGModelFactory;
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        binding.add(ComputedBoundsActionHandler);
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(CreateTaskHandler);
        binding.add(TasklistChangeBoundsHandler);
        binding.add(TasklistApplyLabelEditHandler);
        binding.add(TasklistDeleteHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(TasklistModelIndex).toSelf().inSingletonScope();
        return { service: TasklistModelIndex };
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return TasklistLabelEditValidator;
    }
}
