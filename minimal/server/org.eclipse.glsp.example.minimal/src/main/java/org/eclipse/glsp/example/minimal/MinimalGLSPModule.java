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

import org.eclipse.glsp.api.diagram.DiagramConfiguration;
import org.eclipse.glsp.api.factory.ModelFactory;
import org.eclipse.glsp.api.handler.OperationHandler;
import org.eclipse.glsp.example.minimal.handler.MinimalCreateNodeOperationHandler;
import org.eclipse.glsp.server.di.DefaultGLSPModule;
import org.eclipse.glsp.server.di.MultiBindConfig;
import org.eclipse.glsp.server.model.JsonFileModelFactory;

public class MinimalGLSPModule extends DefaultGLSPModule {

   @Override
   protected void configureDiagramConfigurations(final MultiBindConfig<DiagramConfiguration> config) {
      config.add(MinimalDiagramConfiguration.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBindConfig<OperationHandler> config) {
      super.configureOperationHandlers(config);
      config.add(MinimalCreateNodeOperationHandler.class);
   }

   @Override
   protected Class<? extends ModelFactory> bindModelFactory() {
      return JsonFileModelFactory.class;
   }
}
