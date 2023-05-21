/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
package org.eclipse.glsp.example.javaemf.editor;

import org.eclipse.glsp.ide.editor.ui.FocusAwareBrowser;
import org.eclipse.glsp.ide.editor.ui.GLSPDiagramEditor;
import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Composite;

public class TaskListEditor extends GLSPDiagramEditor {

   @Override
   protected Browser createBrowser(final Composite parent) {
      Browser browser = new FocusAwareBrowser(parent, SWT.NO_SCROLL | SWT.EDGE);
      browser.setLayoutData(new GridData(GridData.FILL, GridData.FILL, true, true));
      toDispose.add(browser::dispose);
      return browser;
   }
}
