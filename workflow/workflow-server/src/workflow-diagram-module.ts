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
    BindingTarget,
    CommandPaletteActionProvider,
    ContextActionsProvider,
    ContextEditValidator,
    ContextMenuItemProvider,
    DiagramConfiguration,
    EdgeCreationChecker,
    GLSPServer,
    GModelDiagramModule,
    InstanceMultiBinding,
    LabelEditValidator,
    ModelValidator,
    MultiBinding,
    NavigationTargetProvider,
    NavigationTargetResolver,
    OperationHandlerConstructor,
    PopupModelFactory,
    ServerModule,
    SourceModelStorage
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { CreateAutomatedTaskHandler } from './handler/create-automated-task-handler';
import { CreateCategoryHandler } from './handler/create-category-handler';
import { CreateDecisionNodeHandler } from './handler/create-decision-node-handler';
import { CreateEdgeHandler } from './handler/create-edge-handler';
import { CreateForkNodeHandler } from './handler/create-fork-node-handler';
import { CreateJoinNodeHandler } from './handler/create-join-node-handler';
import { CreateManualTaskHandler } from './handler/create-manual-task-handler';
import { CreateMergeNodeHandler } from './handler/create-merge-node-handler';
import { CreateWeightedEdgeHandler } from './handler/create-weighted-edge-handler';
import { WorkflowLabelEditValidator } from './labeledit/workflow-label-edit-validator';
import { WorkflowModelValidator } from './marker/workflow-model-validator';
import { WorkflowNavigationTargetResolver } from './model/workflow-navigation-target-resolver';
import { NextNodeNavigationTargetProvider } from './provider/next-node-navigation-target-provider';
import { NodeDocumentationNavigationTargetProvider } from './provider/node-documentation-navigation-target-provider';
import { PreviousNodeNavigationTargetProvider } from './provider/previous-node-navigation-target-provider';
import { WorkflowCommandPaletteActionProvider } from './provider/workflow-command-palette-action-provider';
import { WorkflowContextMenuItemProvider } from './provider/workflow-context-menu-item-provider';
import { EditTaskOperationHandler } from './taskedit/edit-task-operation-handler';
import { TaskEditContextActionProvider } from './taskedit/task-edit-context-provider';
import { TaskEditValidator } from './taskedit/task-edit-validator';
import { WorkflowDiagramConfiguration } from './workflow-diagram-configuration';
import { WorkflowEdgeCreationChecker } from './workflow-edge-creation-checker';
import { WorkflowGLSPServer } from './workflow-glsp-server';
import { WorkflowPopupFactory } from './workflow-popup-factory';

@injectable()
export class WorkflowServerModule extends ServerModule {
    protected override bindGLSPServer(): BindingTarget<GLSPServer> {
        return WorkflowGLSPServer;
    }
}

@injectable()
export class WorkflowDiagramModule extends GModelDiagramModule {
    constructor(public bindSourceModelStorage: () => BindingTarget<SourceModelStorage>) {
        super();
    }

    get diagramType(): string {
        return 'workflow-diagram';
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(CreateAutomatedTaskHandler);
        binding.add(CreateManualTaskHandler);
        binding.add(CreateJoinNodeHandler);
        binding.add(CreateForkNodeHandler);
        binding.add(CreateEdgeHandler);
        binding.add(CreateWeightedEdgeHandler);
        binding.add(CreateMergeNodeHandler);
        binding.add(CreateDecisionNodeHandler);
        binding.add(CreateCategoryHandler);
        binding.add(EditTaskOperationHandler);
    }

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return WorkflowDiagramConfiguration;
    }

    protected override bindNavigationTargetResolver(): BindingTarget<NavigationTargetResolver> | undefined {
        return WorkflowNavigationTargetResolver;
    }

    protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
        return WorkflowContextMenuItemProvider;
    }

    protected override bindCommandPaletteActionProvider(): BindingTarget<CommandPaletteActionProvider> | undefined {
        return WorkflowCommandPaletteActionProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return WorkflowLabelEditValidator;
    }

    protected override bindPopupModelFactory(): BindingTarget<PopupModelFactory> | undefined {
        return WorkflowPopupFactory;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return WorkflowModelValidator;
    }

    protected override configureNavigationTargetProviders(binding: MultiBinding<NavigationTargetProvider>): void {
        super.configureNavigationTargetProviders(binding);
        binding.add(NextNodeNavigationTargetProvider);
        binding.add(PreviousNodeNavigationTargetProvider);
        binding.add(NodeDocumentationNavigationTargetProvider);
    }

    protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
        super.configureContextActionProviders(binding);
        binding.add(TaskEditContextActionProvider);
    }

    protected override configureContextEditValidators(binding: MultiBinding<ContextEditValidator>): void {
        super.configureContextEditValidators(binding);
        binding.add(TaskEditValidator);
    }

    protected override bindEdgeCreationChecker(): BindingTarget<EdgeCreationChecker> | undefined {
        return WorkflowEdgeCreationChecker;
    }
}
