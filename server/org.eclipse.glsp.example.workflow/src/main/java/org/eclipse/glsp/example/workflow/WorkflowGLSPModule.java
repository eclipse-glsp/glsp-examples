/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
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

import org.eclipse.glsp.api.configuration.ServerConfiguration;
import org.eclipse.glsp.api.diagram.DiagramConfiguration;
import org.eclipse.glsp.api.factory.ModelFactory;
import org.eclipse.glsp.api.factory.PopupModelFactory;
import org.eclipse.glsp.api.handler.OperationHandler;
import org.eclipse.glsp.api.handler.ServerCommandHandler;
import org.eclipse.glsp.api.jsonrpc.GLSPServer;
import org.eclipse.glsp.api.labeledit.LabelEditValidator;
import org.eclipse.glsp.api.layout.ILayoutEngine;
import org.eclipse.glsp.api.markers.ModelValidator;
import org.eclipse.glsp.api.model.NavigationTargetResolver;
import org.eclipse.glsp.api.provider.CommandPaletteActionProvider;
import org.eclipse.glsp.api.provider.ContextActionsProvider;
import org.eclipse.glsp.api.provider.ContextEditValidator;
import org.eclipse.glsp.api.provider.ContextMenuItemProvider;
import org.eclipse.glsp.api.provider.NavigationTargetProvider;
import org.eclipse.glsp.example.workflow.handler.CreateAutomatedTaskHandler;
import org.eclipse.glsp.example.workflow.handler.CreateDecisionNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateEdgeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateForkNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateJoinNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateManualTaskHandler;
import org.eclipse.glsp.example.workflow.handler.CreateMergeNodeHandler;
import org.eclipse.glsp.example.workflow.handler.CreateWeightedEdgeHandler;
import org.eclipse.glsp.example.workflow.handler.SimulateCommandHandler;
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
import org.eclipse.glsp.server.di.DefaultGLSPModule;
import org.eclipse.glsp.server.di.MultiBindConfig;

public class WorkflowGLSPModule extends DefaultGLSPModule {

   @Override
   protected Class<? extends GLSPServer> bindGLSPServer() {
      return WorkflowGLSPServer.class;
   }

   @Override
   protected Class<? extends ServerConfiguration> bindServerConfiguration() {
      return WorkflowServerConfiguration.class;
   }

   @Override
   protected void configureContextActionsProviders(final MultiBindConfig<ContextActionsProvider> config) {
      super.configureContextActionsProviders(config);
      config.add(TaskEditContextActionProvider.class);
   }

   @Override
   protected void configureContextEditValidators(final MultiBindConfig<ContextEditValidator> config) {
      super.configureContextEditValidators(config);
      config.add(TaskEditValidator.class);
   }

   @Override
   protected void configureDiagramConfigurations(final MultiBindConfig<DiagramConfiguration> config) {
      config.add(WorkflowDiagramConfiguration.class);
   }

   @Override
   protected void configureServerCommandHandlers(final MultiBindConfig<ServerCommandHandler> config) {
      super.configureServerCommandHandlers(config);
      config.add(SimulateCommandHandler.class);
   }

   @Override
   protected void configureNavigationTargetProviders(final MultiBindConfig<NavigationTargetProvider> config) {
      super.configureNavigationTargetProviders(config);
      config.add(NextNodeNavigationTargetProvider.class);
      config.add(PreviousNodeNavigationTargetProvider.class);
      config.add(NodeDocumentationNavigationTargetProvider.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBindConfig<OperationHandler> config) {
      super.configureOperationHandlers(config);
      config.add(CreateAutomatedTaskHandler.class);
      config.add(CreateManualTaskHandler.class);
      config.add(CreateDecisionNodeHandler.class);
      config.add(CreateMergeNodeHandler.class);
      config.add(CreateForkNodeHandler.class);
      config.add(CreateJoinNodeHandler.class);
      config.add(CreateEdgeHandler.class);
      config.add(CreateWeightedEdgeHandler.class);
      config.add(EditTaskOperationHandler.class);
      config.add(ApplyTaskEditOperationHandler.class);
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
}
