/********************************************************************************
 * Copyright (c) 2019-2021 EclipseSource and others.
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
package org.eclipse.glsp.example.workflow.layout;

import org.eclipse.elk.alg.layered.options.FixedAlignment;
import org.eclipse.elk.alg.layered.options.LayeredOptions;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.layout.GLSPLayoutConfigurator;
import org.eclipse.glsp.server.model.GModelState;

import com.google.inject.Inject;

public class WorkflowLayoutEngine extends ElkLayoutEngine {

   @Inject
   protected GModelState modelState;

   @Override
   public void layout() {
      if (modelState.getRoot() instanceof GGraph) {
         GLSPLayoutConfigurator configurator = new GLSPLayoutConfigurator();
         configurator.configureByType("graph")
            .setProperty(LayeredOptions.NODE_PLACEMENT_BK_FIXED_ALIGNMENT,
               FixedAlignment.BALANCED);

         layout((GGraph) modelState.getRoot(), configurator);

         // Remove all bend points
         modelState.getIndex().getStream(modelState.getRoot())
            .filter(GEdge.class::isInstance)
            .map(GEdge.class::cast)
            .forEach(edge -> edge.getRoutingPoints().clear());
      }
   }

}
