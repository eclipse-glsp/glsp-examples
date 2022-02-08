/********************************************************************************
 * Copyright (c) 2019-2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
package org.eclipse.glsp.example.workflow;

import org.eclipse.glsp.example.workflow.handler.CreateAutomatedTaskHandler;
import org.eclipse.glsp.example.workflow.handler.CreateDecisionNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateEdgeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateForkNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateJoinNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateManualTaskHandler;
import org.eclipse.glsp.example.workflow.handler.CreateMergeNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateWeightedEdgeHandler;
import org.eclipse.glsp.example.workflow.handler.LogActionHandler;
import org.eclipse.glsp.example.workflow.handler.WorkflowRequestContextActionsHandler;
import org.eclipse.glsp.example.workflow.labeledit.WorkflowLabelEditValidator;
import org.eclipse.glsp.example.workflow.layout.WorkflowLayoutEngine;
import org.eclipse.glsp.example.workflow.marker.WorkflowModelValidator;
import org.eclipse.glsp.example.workflow.model.WorkflowModelFactory;
import org.eclipse.glsp.example.workflow.model.WorkflowNavigationTargetResolver;
import org.eclipse.glsp.example.workflow.provider.NextNodeNavigationTargetProvider;
import org.eclipse.glsp.example.workflow.provider.NodeDocumentationNavigationTargetProvider;
import org.eclipse.glsp.example.workflow.provider.PreviousNodeNavigationTargetProvider;
import org.eclipse.glsp.example.workflow.provider.WorkflowCommandPaletteActionProvider;
import org.eclipse.glsp.example.workflow.provider.WorkflowContextMenuItemProvider;
import org.eclipse.glsp.example.workflow.taskedit.ApplyTaskEditOperationHandler;
import org.eclipse.glsp.example.workflow.taskedit.EditTaskOperationHandler;
import org.eclipse.glsp.example.workflow.taskedit.TaskEditContextActionProvider;
import org.eclipse.glsp.example.workflow.taskedit.TaskEditValidator;
import org.eclipse.glsp.graph.GraphExtension;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.DefaultGLSPModule;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.features.commandpalette.CommandPaletteActionProvider;
import org.eclipse.glsp.server.features.contextactions.ContextActionsProvider;
import org.eclipse.glsp.server.features.contextactions.RequestContextActionsHandler;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.core.model.ModelFactory;
import org.eclipse.glsp.server.features.directediting.ContextEditValidator;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.modelsourcewatcher.FileWatcher;
import org.eclipse.glsp.server.features.modelsourcewatcher.ModelSourceWatcher;
import org.eclipse.glsp.server.features.navigation.NavigationTargetProvider;
import org.eclipse.glsp.server.features.navigation.NavigationTargetResolver;
import org.eclipse.glsp.server.features.popup.PopupModelFactory;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.layout.ILayoutEngine;
import org.eclipse.glsp.server.layout.ServerLayoutConfiguration;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.protocol.GLSPServer;
import org.eclipse.glsp.server.utils.MultiBinding;

public class WorkflowGLSPModule extends DefaultGLSPModule {

   @Override
   @SuppressWarnings("rawtypes")
   protected Class<? extends GLSPServer> bindGLSPServer() {
      return WorkflowGLSPServer.class;
   }

   @Override
   protected Class<? extends ServerLayoutConfiguration> bindServerLayoutConfiguration() {
      return WorkflowServerLayoutConfiguration.class;
   }

   @Override
   protected void configureContextActionsProviders(final MultiBinding<ContextActionsProvider> binding) {
      super.configureContextActionsProviders(binding);
      binding.add(TaskEditContextActionProvider.class);
   }

   @Override
   protected void configureContextEditValidators(final MultiBinding<ContextEditValidator> binding) {
      super.configureContextEditValidators(binding);
      binding.add(TaskEditValidator.class);
   }

   @Override
   protected void configureDiagramConfigurations(final MultiBinding<DiagramConfiguration> binding) {
      binding.add(WorkflowDiagramConfiguration.class);
   }

   @Override
   protected void configureNavigationTargetProviders(final MultiBinding<NavigationTargetProvider> binding) {
      super.configureNavigationTargetProviders(binding);
      binding.add(NextNodeNavigationTargetProvider.class);
      binding.add(PreviousNodeNavigationTargetProvider.class);
      binding.add(NodeDocumentationNavigationTargetProvider.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> binding) {
      super.configureOperationHandlers(binding);
      binding.add(CreateAutomatedTaskHandler.class);
      binding.add(CreateManualTaskHandler.class);
      binding.add(CreateDecisionNodeHandler.class);
      binding.add(CreateMergeNodeHandler.class);
      binding.add(CreateForkNodeHandler.class);
      binding.add(CreateJoinNodeHandler.class);
      binding.add(CreateEdgeHandler.class);
      binding.add(CreateWeightedEdgeHandler.class);
      binding.add(EditTaskOperationHandler.class);
      binding.add(ApplyTaskEditOperationHandler.class);
   }

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> binding) {
      super.configureActionHandlers(binding);
      binding.rebind(RequestContextActionsHandler.class, WorkflowRequestContextActionsHandler.class);
      binding.add(LogActionHandler.class);
   }

   @Override
   protected Class<? extends GraphExtension> bindGraphExtension() {
      return WFGraphExtension.class;
   }

   @Override
   public Class<? extends PopupModelFactory> bindPopupModelFactory() {
      return WorkflowPopupFactory.class;
   }

   @Override
   protected Class<? extends ModelValidator> bindModelValidator() {
      return WorkflowModelValidator.class;
   }

   @Override
   protected Class<? extends LabelEditValidator> bindLabelEditValidator() {
      return WorkflowLabelEditValidator.class;
   }

   @Override
   protected Class<? extends ILayoutEngine> bindLayoutEngine() {
      return WorkflowLayoutEngine.class;
   }

   @Override
   protected Class<? extends ContextMenuItemProvider> bindContextMenuItemProvider() {
      return WorkflowContextMenuItemProvider.class;
   }

   @Override
   protected Class<? extends CommandPaletteActionProvider> bindCommandPaletteActionProvider() {
      return WorkflowCommandPaletteActionProvider.class;
   }

   @Override
   protected Class<? extends NavigationTargetResolver> bindNavigationTargetResolver() {
      return WorkflowNavigationTargetResolver.class;
   }

   @Override
   protected Class<? extends ModelFactory> bindModelFactory() {
      return WorkflowModelFactory.class;
   }

   @Override
   protected Class<? extends ModelSourceWatcher> bindModelSourceWatcher() {
      return FileWatcher.class;
   }
}
