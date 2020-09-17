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
package org.eclipse.glsp.example.minimal.handler;

import java.util.Optional;

import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.server.operationhandler.CreateNodeOperationHandler;

public class MinimalCreateNodeOperationHandler extends CreateNodeOperationHandler {

   public MinimalCreateNodeOperationHandler() {
      super(DefaultTypes.NODE);
   }

   @Override
   protected GNode createNode(final Optional<GPoint> point, final GraphicalModelState modelState) {
      GNodeBuilder builder = new GNodeBuilder(DefaultTypes.NODE)
         .size(40, 20)
         .addCssClass("minimal-node");
      point.ifPresent(builder::position);
      return builder.build();
   }

   @Override
   public String getLabel() { return "Minimal Node"; }

}
