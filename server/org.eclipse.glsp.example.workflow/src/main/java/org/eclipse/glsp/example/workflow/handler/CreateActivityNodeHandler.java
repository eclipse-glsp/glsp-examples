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

import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.example.workflow.utils.ModelTypes;
import org.eclipse.glsp.example.workflow.utils.WorkflowBuilder.ActivityNodeBuilder;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.operationhandler.CreateNodeOperationHandler;

public abstract class CreateActivityNodeHandler extends CreateNodeOperationHandler {

   private final String label;
   private final String elementTypeId;

   public CreateActivityNodeHandler(final String elementTypeId, final String label) {
      super(elementTypeId);
      this.elementTypeId = elementTypeId;
      this.label = label;
   }

   protected String getElementTypeId() { return elementTypeId; }

   @Override
   protected GNode createNode(final Optional<GPoint> point, final GraphicalModelState modelState) {
      String nodeType = ModelTypes.toNodeType(getElementTypeId());
      return new ActivityNodeBuilder(getElementTypeId(), nodeType) //
         .position(point.orElse(null)) //
         .build();
   }

   @Override
   public String getLabel() { return label; }

}
