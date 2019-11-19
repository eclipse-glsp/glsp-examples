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

import static org.eclipse.glsp.server.util.GModelUtil.IS_CONNECTABLE;

import java.util.Optional;

import org.eclipse.glsp.api.action.Action;
import org.eclipse.glsp.api.action.kind.AbstractOperationAction;
import org.eclipse.glsp.api.action.kind.ReconnectConnectionOperationAction;
import org.eclipse.glsp.api.handler.OperationHandler;
import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelIndex;

public class ReconnectEdgeHandler implements OperationHandler {

   @Override
   public Class<? extends Action> handlesActionType() {
      return ReconnectConnectionOperationAction.class;
   }

   @Override
   @SuppressWarnings("checkstyle:CyclomaticComplexity")
   public void execute(final AbstractOperationAction operationAction, final GraphicalModelState modelState) {
      if (!(operationAction instanceof ReconnectConnectionOperationAction)) {
         throw new IllegalArgumentException("Unexpected action " + operationAction);
      }

      // check for null-values
      final ReconnectConnectionOperationAction action = (ReconnectConnectionOperationAction) operationAction;
      if (action.getConnectionElementId() == null || action.getSourceElementId() == null
         || action.getTargetElementId() == null) {
         throw new IllegalArgumentException("Incomplete reconnect connection action");
      }

      // check for existence of matching elements
      GModelIndex index = modelState.getIndex();
      Optional<GEdge> edge = index.findElementByClass(action.getConnectionElementId(), GEdge.class);
      Optional<GModelElement> source = index.findElement(action.getSourceElementId(), IS_CONNECTABLE);
      Optional<GModelElement> target = index.findElement(action.getTargetElementId(), IS_CONNECTABLE);
      if (!edge.isPresent() || !source.isPresent() || !target.isPresent()) {
         throw new IllegalArgumentException(
            "Invalid edge, source or target ID: edge ID " + action.getConnectionElementId() + ", source ID "
               + action.getSourceElementId() + " and target ID " + action.getTargetElementId());
      }

      // reconnect
      edge.get().setSourceId(source.get().getId());
      edge.get().setTargetId(target.get().getId());
      edge.get().getRoutingPoints().clear();
   }

   @Override
   public String getLabel(final AbstractOperationAction action) {
      return "Reconnect edge";
   }
}
