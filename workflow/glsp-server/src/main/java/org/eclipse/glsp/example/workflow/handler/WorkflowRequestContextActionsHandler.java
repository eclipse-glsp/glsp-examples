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
package org.eclipse.glsp.example.workflow.handler;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.example.workflow.action.LogAction;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.features.contextactions.RequestContextActions;
import org.eclipse.glsp.server.features.contextactions.RequestContextActionsHandler;
import org.eclipse.glsp.server.features.contextactions.SetContextActions;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.types.Severity;

public class WorkflowRequestContextActionsHandler extends RequestContextActionsHandler {
   @Override
   public List<Action> executeAction(final RequestContextActions action, final GModelState modelState) {
      List<Action> actions = new ArrayList<>(super.executeAction(action, modelState));
      actions.stream()
         .filter(SetContextActions.class::isInstance)
         .map(SetContextActions.class::cast)
         .findAny()
         .ifPresent(response -> actions.add(createLogAction(action, response)));
      return actions;
   }

   private LogAction createLogAction(final RequestContextActions request, final SetContextActions response) {
      return new LogAction(Severity.OK,
         "create " + response.getActions().size() + " server actions for " + request.getContextId() + ".");
   }
}
