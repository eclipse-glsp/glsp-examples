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

import org.eclipse.glsp.api.action.ActionProcessor;
import org.eclipse.glsp.api.action.kind.RequestModelAction;
import org.eclipse.glsp.api.model.GraphicalModelState;
import org.eclipse.glsp.api.utils.ServerMessageUtil;
import org.eclipse.glsp.api.utils.ServerStatusUtil;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.model.FileBasedModelFactory;

import com.google.inject.Inject;

public class WorkflowModelFactory extends FileBasedModelFactory {
   @Inject
   private ActionProcessor actionProcessor;

   @Override
   public GModelRoot loadModel(final RequestModelAction action, final GraphicalModelState modelState) {
      String clientId = modelState.getClientId();
      actionProcessor.send(clientId, ServerStatusUtil.info("Model loading in progress!"));
      actionProcessor.send(clientId, ServerMessageUtil.info("Model loading in progress!"));

      GModelRoot modelRoot = super.loadModel(action, modelState);

      actionProcessor.send(clientId, ServerStatusUtil.clear());
      actionProcessor.send(clientId, ServerMessageUtil.clear());
      return modelRoot;
   }
}
