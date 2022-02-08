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

import java.util.concurrent.CompletableFuture;

import org.apache.log4j.Logger;
import org.eclipse.glsp.server.jsonrpc.DefaultGLSPServer;

public class WorkflowGLSPServer extends DefaultGLSPServer<WorkflowInitializeOptions> {
   private static final Logger LOGGER = Logger.getLogger(WorkflowGLSPServer.class);

   public WorkflowGLSPServer() {
      super(WorkflowInitializeOptions.class);
   }

   @Override
   public CompletableFuture<Boolean> handleOptions(final WorkflowInitializeOptions options) {
      if (options != null) {
         LOGGER.debug(options.getTimestamp() + ": " + options.getMessage());
      }
      return CompletableFuture.completedFuture(true);
   }
}
