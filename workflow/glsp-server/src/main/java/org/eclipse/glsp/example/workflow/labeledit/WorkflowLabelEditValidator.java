/********************************************************************************
 * Copyright (c) 2019-2020 EclipseSource and others.
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
package org.eclipse.glsp.example.workflow.labeledit;

import java.util.Set;

import org.eclipse.glsp.example.workflow.wfgraph.TaskNode;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.glsp.server.model.GModelState;

public class WorkflowLabelEditValidator implements LabelEditValidator {

   @Override
   public ValidationStatus validate(final GModelState modelState, final String label, final GModelElement element) {
      if (label.length() < 1) {
         return ValidationStatus.error("Name must not be empty");
      }

      Set<TaskNode> taskNodes = modelState.getIndex().getAllByClass(TaskNode.class);
      boolean hasDuplicate = taskNodes.stream()
         .filter(e -> !e.getId().equals(element.getId()))
         .map(TaskNode::getName).anyMatch(name -> name.equals(label));
      if (hasDuplicate) {
         return ValidationStatus.warning("Name should be unique");
      }

      return ValidationStatus.ok();
   }

}
