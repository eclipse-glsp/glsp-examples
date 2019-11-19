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

import java.util.Optional;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.api.action.kind.AbstractOperationAction;
import org.eclipse.glsp.api.action.kind.RerouteConnectionOperationAction;
import org.eclipse.glsp.api.handler.OperationHandler;
import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelIndex;
import org.eclipse.glsp.graph.GPoint;

public class RerouteEdgeHandler implements OperationHandler {

   @Override
   public Class<?> handlesActionType() {
      return RerouteConnectionOperationAction.class;
   }

   @Override
   public String getLabel(final AbstractOperationAction action) {
      return "Reconnect edge";
   }

   @Override
   public void execute(final AbstractOperationAction operationAction, final GraphicalModelState modelState) {
      if (!(operationAction instanceof RerouteConnectionOperationAction)) {
         throw new IllegalArgumentException("Unexpected action " + operationAction);
      }

      // check for null-values
      final RerouteConnectionOperationAction action = (RerouteConnectionOperationAction) operationAction;
      if (action.getConnectionElementId() == null || action.getRoutingPoints() == null) {
         throw new IllegalArgumentException("Incomplete reconnect connection action");
      }

      // check for existence of matching elements
      GModelIndex index = modelState.getIndex();
      Optional<GEdge> edge = index.findElementByClass(action.getConnectionElementId(), GEdge.class);
      if (!edge.isPresent()) {
         throw new IllegalArgumentException("Invalid edge: edge ID " + action.getConnectionElementId());
      }

      // reroute
      EList<GPoint> routingPoints = edge.get().getRoutingPoints();
      routingPoints.clear();
      routingPoints.addAll(action.getRoutingPoints());
   }
}
