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

import java.io.IOException;

import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.server.launch.CLIParser;
import org.eclipse.glsp.server.launch.DefaultGLSPServerLauncher;
import org.eclipse.glsp.server.launch.GLSPServerLauncher;
import org.eclipse.glsp.server.utils.LaunchUtil;
import org.eclipse.glsp.server.websocket.WebsocketServerLauncher;

public final class WorkflowServerLauncher {
   private WorkflowServerLauncher() {}

   @SuppressWarnings("uncommentedmain")
   public static void main(final String[] args) {
      String processName = "WorkflowExampleGlspServer";
      Options cliOptions = CLIParser.getDefaultCLIOptions();
      cliOptions.addOption(new Option("w", "websocket", false, "Use websocket launcher instead of default"));

      try {
         CLIParser parser = new CLIParser(args, cliOptions, processName);
         if (parser.optionExists("h")) {
            parser.printHelp();
            System.exit(0);
         }

         LaunchUtil.configureLogger(parser);
         ElkLayoutEngine.initialize(new LayeredMetaDataProvider());

         int port = parser.parsePort();

         GLSPServerLauncher launcher = parser.optionExists("w")
            ? new WebsocketServerLauncher(new WorkflowGLSPModule(), "/workflow")
            : new DefaultGLSPServerLauncher(new WorkflowGLSPModule());

         launcher.start("localhost", port);

      } catch (ParseException | IOException ex) {
         System.out.println("Server start failed!");
         ex.printStackTrace();
         System.out.println();
         CLIParser.printHelp(processName, cliOptions);
      }
   }
}
