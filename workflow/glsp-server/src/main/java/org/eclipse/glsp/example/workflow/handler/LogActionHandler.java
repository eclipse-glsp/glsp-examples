/********************************************************************************
 * Copyright (c) 2020-2022 EclipseSource and others.
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

import java.util.Collections;
import java.util.List;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.example.workflow.action.LogAction;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.types.Severity;

public class LogActionHandler extends AbstractActionHandler<LogAction> {
   private static Logger LOGGER = LogManager.getLogger(LogActionHandler.class);

   @Override
   protected List<Action> executeAction(final LogAction action) {
      LOGGER.log(toLevel(action.getSeverity()), action.getMessage());
      return Collections.emptyList();
   }

   private static Level toLevel(final Severity severity) {
      return Level.toLevel(severity.toString(), Level.DEBUG);
   }

}
