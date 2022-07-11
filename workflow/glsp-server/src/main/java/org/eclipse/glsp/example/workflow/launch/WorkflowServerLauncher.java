/********************************************************************************
 * Copyright (c) 2019-2022 EclipseSource and others.
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
package org.eclipse.glsp.example.workflow.launch;

import org.apache.commons.cli.ParseException;
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider;
import org.eclipse.glsp.example.workflow.WorkflowDiagramModule;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.server.di.ServerModule;
import org.eclipse.glsp.server.launch.GLSPServerLauncher;
import org.eclipse.glsp.server.launch.SocketGLSPServerLauncher;
import org.eclipse.glsp.server.utils.LaunchUtil;
import org.eclipse.glsp.server.websocket.WebsocketServerLauncher;

public final class WorkflowServerLauncher {
   private WorkflowServerLauncher() {}

   @SuppressWarnings("uncommentedmain")
   public static void main(final String[] args) {
      String processName = "org.eclipse.glsp.example.workflow-X.X.X-glsp.jar";
      try {
         WorkflowCLIParser parser = new WorkflowCLIParser(args, processName);
         ElkLayoutEngine.initialize(new LayeredMetaDataProvider());

         int port = parser.parsePort();
         ServerModule workflowServerModule = new ServerModule()
            .configureDiagramModule(new WorkflowDiagramModule());

         GLSPServerLauncher launcher = parser.isWebsocket()
            ? new WebsocketServerLauncher(workflowServerModule, "/workflow", parser.parseWebsocketLogLevel())
            : new SocketGLSPServerLauncher(workflowServerModule);

         launcher.start("localhost", port, parser);

      } catch (ParseException ex) {
         ex.printStackTrace();
         System.out.println();
         LaunchUtil.printHelp(processName, WorkflowCLIParser.getDefaultOptions());
      }
   }
}
