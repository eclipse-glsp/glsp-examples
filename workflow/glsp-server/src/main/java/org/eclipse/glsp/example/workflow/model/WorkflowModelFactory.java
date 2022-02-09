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
package org.eclipse.glsp.example.workflow.model;

import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.features.core.model.JsonFileModelFactory;
import org.eclipse.glsp.server.features.core.model.RequestModelAction;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.utils.ServerMessageUtil;
import org.eclipse.glsp.server.utils.ServerStatusUtil;

import com.google.inject.Inject;

public class WorkflowModelFactory extends JsonFileModelFactory {

   @Inject
   private ActionDispatcher actionDispatcher;

   @Override
   public GModelRoot loadModel(final RequestModelAction action, final GModelState modelState) {
      String clientId = modelState.getClientId();
      actionDispatcher.dispatch(clientId, ServerStatusUtil.info("Model loading in progress!"));
      actionDispatcher.dispatch(clientId, ServerMessageUtil.info("Model loading in progress!"));

      GModelRoot modelRoot = super.loadModel(action, modelState);

      actionDispatcher.dispatch(clientId, ServerStatusUtil.clear());
      actionDispatcher.dispatch(clientId, ServerMessageUtil.clear());

      return modelRoot;
   }

}
