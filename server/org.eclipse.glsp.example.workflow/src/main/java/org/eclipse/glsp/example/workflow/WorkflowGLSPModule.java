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
import org.eclipse.glsp.api.di.MultiBindings;
import org.eclipse.glsp.api.diagram.DiagramConfiguration;
import org.eclipse.glsp.api.factory.PopupModelFactory;
import org.eclipse.glsp.api.handler.OperationHandler;
import org.eclipse.glsp.api.handler.ServerCommandHandler;
import org.eclipse.glsp.api.jsonrpc.GLSPServer;
import org.eclipse.glsp.api.labeledit.LabelEditValidator;
import org.eclipse.glsp.api.layout.ILayoutEngine;
import org.eclipse.glsp.api.markers.ModelValidator;
import org.eclipse.glsp.api.model.ModelElementOpenListener;
import org.eclipse.glsp.api.model.ModelExpansionListener;
import org.eclipse.glsp.api.model.ModelSelectionListener;
import org.eclipse.glsp.api.provider.CommandPaletteActionProvider;
import org.eclipse.glsp.api.provider.ContextMenuItemProvider;
import org.eclipse.glsp.api.provider.OperationHandlerProvider;
import org.eclipse.glsp.api.provider.ServerCommandHandlerProvider;
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
import org.eclipse.glsp.graph.GraphExtension;
import org.eclipse.glsp.server.di.DefaultGLSPModule;

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
   protected void configureDiagramConfigurations(
      final MultiBindings<DiagramConfiguration> bindings) {
      bindings.add(WorkflowDiagramConfiguration.class);
   }

   @Override
   protected void configureServerCommandHandlers(final MultiBindings<ServerCommandHandler> bindings) {
      super.configureServerCommandHandlers(bindings);
      bindings.add(SimulateCommandHandler.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBindings<OperationHandler> bindings) {
      super.configureOperationHandlers(bindings);
      bindings.add(CreateAutomatedTaskHandler.class);
      bindings.add(CreateManualTaskHandler.class);
      bindings.add(CreateDecisionNodeHandler.class);
      bindings.add(CreateMergeNodeHandler.class);
      bindings.add(CreateForkNodeHandler.class);
      bindings.add(CreateJoinNodeHandler.class);
      bindings.add(CreateEdgeHandler.class);
      bindings.add(CreateWeightedEdgeHandler.class);

   }

   @Override
   protected Class<? extends GraphExtension> bindGraphExtension() {
      return WFGraphExtension.class;
   }

   @Override
   protected Class<? extends OperationHandlerProvider> bindOperatioHandlerProvider() {
      // TODO Auto-generated method stub
      return super.bindOperatioHandlerProvider();
   }

   @Override
   protected Class<? extends ServerCommandHandlerProvider> bindServerCommandHandlerProvider() {
      // TODO Auto-generated method stub
      return super.bindServerCommandHandlerProvider();
   }

   @Override
   public Class<? extends PopupModelFactory> bindPopupModelFactory() {
      return WorkflowPopupFactory.class;
   }

   @Override
   public Class<? extends ModelSelectionListener> bindModelSelectionListener() {
      return WorkflowServerListener.class;
   }

   @Override
   public Class<? extends ModelElementOpenListener> bindModelElementOpenListener() {
      return WorkflowServerListener.class;
   }

   @Override
   public Class<? extends ModelExpansionListener> bindModelExpansionListener() {
      return WorkflowServerListener.class;
   }

   @Override
   protected Class<? extends CommandPaletteActionProvider> bindCommandPaletteActionProvider() {
      return WorkflowCommandPaletteActionProvider.class;
   }

   @Override
   protected Class<? extends ContextMenuItemProvider> bindContextMenuItemProvider() {
      return WorkflowContextMenuItemProvider.class;
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

}
