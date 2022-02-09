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

import static org.eclipse.glsp.graph.util.GraphUtil.bounds;

import java.util.Arrays;
import java.util.Optional;

import org.eclipse.glsp.example.workflow.wfgraph.TaskNode;
import org.eclipse.glsp.graph.GBounds;
import org.eclipse.glsp.graph.GHtmlRoot;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GPreRenderedElement;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.server.features.popup.PopupModelFactory;
import org.eclipse.glsp.server.features.popup.RequestPopupModelAction;
import org.eclipse.glsp.server.model.GModelState;

public class WorkflowPopupFactory implements PopupModelFactory {

   private String generateTitle(final TaskNode task) {
      return task.getName();
   }

   private String generateBody(final TaskNode task) {
      return String.format(NL + "Type: %s" + NL + "Duration: %s" + NL + " Reference: %s" + NL, task.getTaskType(),
         task.getDuration(), task.getReference());
   }

   private static final String NL = "<br>";

   @Override
   public Optional<GHtmlRoot> createPopupModel(final GModelElement element, final RequestPopupModelAction action,
      final GModelState modelState) {
      if (element != null && element instanceof TaskNode) {
         TaskNode task = (TaskNode) element;
         GHtmlRoot root = GraphFactory.eINSTANCE.createGHtmlRoot();
         GBounds bounds = action.getBounds();
         root.setCanvasBounds(bounds(bounds.getX(), bounds.getY(), bounds.getWidth(), bounds.getHeight()));
         root.setType("html");
         root.setId("sprotty-popup");
         GPreRenderedElement p1 = GraphFactory.eINSTANCE.createGPreRenderedElement();
         p1.setType("pre-rendered");
         p1.setId("popup-title");
         p1.setCode("<div class=\"sprotty-popup-title\">" + generateTitle(task) + "</div>");

         GPreRenderedElement p2 = GraphFactory.eINSTANCE.createGPreRenderedElement();
         p2.setType("pre-rendered");
         p2.setId("popup-body");
         p2.setCode("<div class=\"sprotty-popup-body\">" + generateBody(task) + "</div>");
         root.getChildren().addAll(Arrays.asList(p1, p2));
         return Optional.of(root);
      }
      return Optional.empty();

   }

}
