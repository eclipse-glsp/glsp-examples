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
package org.eclipse.glsp.example.workflow.provider;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.api.provider.NavigationTargetProvider;
import org.eclipse.glsp.api.types.EditorContext;
import org.eclipse.glsp.api.types.NavigationTarget;
import org.eclipse.glsp.api.utils.ClientOptions;
import org.eclipse.glsp.example.workflow.wfgraph.TaskNode;

/**
 * An example {@link NavigationTargetProvider} that opens an md file and selects a specified range.
 * <p>
 * If the selection in the GLSP workflow diagram has the element with id "task0", this navigation
 * target provider creates a navigation target for an md file and selects a specific range.
 */
public class NodeDocumentationNavigationTargetProvider implements NavigationTargetProvider {

   @Override
   public String getTargetTypeId() { return "documentation"; }

   @Override
   public List<? extends NavigationTarget> getTargets(final EditorContext editorContext,
      final GraphicalModelState modelState) {
      if (editorContext.getSelectedElementIds().size() == 1) {
         Optional<TaskNode> taskNode = modelState.getIndex()
            .findElementByClass(editorContext.getSelectedElementIds().get(0), TaskNode.class);
         if (taskNode.isEmpty() || !taskNode.get().getId().equals("task0")) {
            return Arrays.asList();
         }

         Optional<String> sourceUri = ClientOptions.getValue(modelState.getClientOptions(), ClientOptions.SOURCE_URI);
         if (sourceUri.isEmpty()) {
            return Arrays.asList();
         }

         String docUri = sourceUri.get().replace(".wf", ".md");
         Map<String, String> args = new HashMap<>();
         args.put(JSON_OPENER_OPTIONS, "{"
            + "\"selection\": { \"start\": { \"line\": 2, \"character\": 3 }, "
            + "\"end\": { \"line\": 2, \"character\": 7 } } "
            + "}");
         return Arrays.asList(new NavigationTarget(docUri, args));
      }
      return Arrays.asList();
   }

}
