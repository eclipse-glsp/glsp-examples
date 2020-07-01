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

import java.util.Optional;

import org.eclipse.glsp.api.operation.kind.CreateNodeOperation;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operationhandler.CreateNodeOperationHandler;

public abstract class CreateWorkflowNodeOperationHandler extends CreateNodeOperationHandler {
   public static final double GRID_X = 10.0;
   public static final double GRID_Y = 10.0;

   public CreateWorkflowNodeOperationHandler(final String elementTypeId) {
      super(elementTypeId);
   }

   @Override
   protected Optional<GPoint> getLocation(final CreateNodeOperation operation) {
      return super.getLocation(operation).map(this::snapToGrid);
   }

   protected GPoint snapToGrid(final GPoint point) {
      double snappedX = Math.round(point.getX() / GRID_X) * GRID_X;
      double snappedY = Math.round(point.getY() / GRID_Y) * GRID_Y;
      return GraphUtil.point(snappedX, snappedY);
   }

}
