/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
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
package org.eclipse.glsp.example.minimal;

import org.eclipse.glsp.example.minimal.handler.MinimalCreateNodeOperationHandler;
import org.eclipse.glsp.server.DefaultGLSPModule;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.factory.JsonFileModelFactory;
import org.eclipse.glsp.server.factory.ModelFactory;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.utils.MultiBinding;

public class MinimalGLSPModule extends DefaultGLSPModule {

   @Override
   protected void configureDiagramConfigurations(final MultiBinding<DiagramConfiguration> binding) {
      binding.add(MinimalDiagramConfiguration.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> binding) {
      super.configureOperationHandlers(binding);
      binding.add(MinimalCreateNodeOperationHandler.class);
   }

   @Override
   protected Class<? extends ModelFactory> bindModelFactory() {
      return JsonFileModelFactory.class;
   }

}
