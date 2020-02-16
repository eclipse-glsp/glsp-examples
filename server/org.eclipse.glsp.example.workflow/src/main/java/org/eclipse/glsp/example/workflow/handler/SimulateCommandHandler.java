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
package org.eclipse.glsp.example.workflow.handler;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.apache.log4j.Logger;
import org.eclipse.glsp.api.action.Action;
import org.eclipse.glsp.api.handler.ServerCommandHandler;
import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.api.utils.ClientOptions;
import org.eclipse.glsp.graph.GModelElement;

public class SimulateCommandHandler implements ServerCommandHandler {
   private static Logger logger = Logger.getLogger(SimulateCommandHandler.class);
   public static final String SIMULATE_COMMAND_ID = "simulate-command";
   public static final String OPTIONS_INVOKER_ID = "invokerId";

   @Override
   public List<Action> execute(final String commandId, final Map<String, String> options,
      final GraphicalModelState modelState) {
      if (SIMULATE_COMMAND_ID.equals(commandId)) {
         ClientOptions.getValue(options, OPTIONS_INVOKER_ID).ifPresent(id -> {
            Optional<GModelElement> invoker = modelState.getIndex().get(id);
            if (!invoker.isPresent()) {
               logger.info("Start simulation of " + invoker.get().getId());
               double duration = ThreadLocalRandom.current().nextDouble(0d, 10d);
               logger.info("Task simulation finished within " + duration + " seconds");
            }
         });
      }
      return Collections.emptyList();
   }

   @Override
   public List<String> handledCommandIds() {
      return Arrays.asList(SIMULATE_COMMAND_ID);
   }

}
