/*******************************************************************************
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
 ******************************************************************************/
package org.eclipse.glsp.example.workflow;

import org.apache.log4j.Logger;
import org.eclipse.glsp.api.action.kind.CollapseExpandAction;
import org.eclipse.glsp.api.action.kind.CollapseExpandAllAction;
import org.eclipse.glsp.api.action.kind.OpenAction;
import org.eclipse.glsp.api.action.kind.SelectAction;
import org.eclipse.glsp.api.action.kind.SelectAllAction;
import org.eclipse.glsp.api.model.ModelElementOpenListener;
import org.eclipse.glsp.api.model.ModelExpansionListener;
import org.eclipse.glsp.api.model.ModelSelectionListener;

public class WorkflowServerListener
   implements ModelSelectionListener, ModelExpansionListener, ModelElementOpenListener {
   private static Logger log = Logger.getLogger(WorkflowServerListener.class);

   @Override
   public void elementOpened(final OpenAction action) {
      log.info("HANDLE: OpenAction for element: " + action.getElementId());

   }

   @Override
   public void expansionChanged(final CollapseExpandAction action) {
      log.info("HANDLE: CollapseExpandAction for elements: " + action.getCollapseIds());

   }

   @Override
   public void expansionChanged(final CollapseExpandAllAction action) {
      log.info("HANDLE: CollapseExpandAllAction");

   }

   @Override
   public void selectionChanged(final SelectAction action) {
      log.info("HANDLE: SelectAction for elements: " + String.join(", ", action.getSelectedElementsIDs()));

   }

   @Override
   public void selectionChanged(final SelectAllAction action) {
      log.info("HANDLE: SelectAllAction");

   }

}
