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

import java.util.List;

import org.eclipse.glsp.api.action.Action;
import org.eclipse.glsp.api.action.kind.RequestEditValidationAction;
import org.eclipse.glsp.api.action.kind.SetEditValidationResultAction;
import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.api.types.ValidationStatus;
import org.eclipse.glsp.server.actionhandler.BasicActionHandler;

public class TaskEditValidator extends BasicActionHandler<RequestEditValidationAction> {

   @Override
   protected List<Action> executeAction(final RequestEditValidationAction action,
      final GraphicalModelState modelState) {
      String text = action.getText();
      if (text.startsWith(TaskEditContextActionProvider.DURATION_PREFIX)) {
         String durationString = text.substring(TaskEditContextActionProvider.DURATION_PREFIX.length());
         try {
            int duration = Integer.parseInt(durationString);
            if (duration < 0 || duration > 100) {
               return listOf(new SetEditValidationResultAction(
                  ValidationStatus.warning("'" + durationString + "' should be between 0 and 100.")));
            }
         } catch (NumberFormatException e) {
            return listOf(new SetEditValidationResultAction(
               ValidationStatus.error("'" + durationString + "' is not a valid number.")));
         }
      } else if (text.startsWith(TaskEditContextActionProvider.TYPE_PREFIX)) {
         String typeString = text.substring(TaskEditContextActionProvider.TYPE_PREFIX.length());
         if (!typeString.equals("automated") && !typeString.equals("manual")) {
            return listOf(new SetEditValidationResultAction(
               ValidationStatus
                  .error("Type of task can only be manual or automatic. You entered '" + typeString + "'.")));
         }
      }
      return listOf(new SetEditValidationResultAction(ValidationStatus.ok()));
   }

}
