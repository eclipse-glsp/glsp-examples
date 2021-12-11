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
package org.eclipse.glsp.example.workflow.taskedit;

import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.BasicOperationHandler;
import org.eclipse.glsp.server.protocol.GLSPServerException;

import com.google.inject.Inject;

public class ApplyTaskEditOperationHandler extends BasicOperationHandler<ApplyTaskEditOperation> {

   @Inject
   private ActionDispatcher actionProcessor;

   @Override
   protected void executeOperation(final ApplyTaskEditOperation operation, final GModelState modelState) {
      String text = operation.getExpression();
      if (text.startsWith(TaskEditContextActionProvider.DURATION_PREFIX)) {
         String durationString = text.substring(TaskEditContextActionProvider.DURATION_PREFIX.length());
         actionProcessor.dispatch(modelState.getClientId(),
            new EditTaskOperation(operation.getTaskId(), "duration", durationString));
      } else if (text.startsWith(TaskEditContextActionProvider.TYPE_PREFIX)) {
         String typeString = text.substring(TaskEditContextActionProvider.TYPE_PREFIX.length());
         actionProcessor.dispatch(modelState.getClientId(),
            new EditTaskOperation(operation.getTaskId(), "taskType", typeString));
      } else {
         throw new GLSPServerException(
            "Cannot process 'ApplyTaskEditOperation' expression: " + operation.getExpression());
      }
   }

}
