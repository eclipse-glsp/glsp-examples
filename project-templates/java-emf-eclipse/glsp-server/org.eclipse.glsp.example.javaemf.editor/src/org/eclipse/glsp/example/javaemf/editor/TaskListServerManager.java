/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
package org.eclipse.glsp.example.javaemf.editor;

import java.net.URL;

import org.eclipse.glsp.ide.editor.GLSPServerManager;
import org.eclipse.glsp.ide.editor.di.IdeServerModule;
import org.eclipse.glsp.server.di.ServerModule;

public class TaskListServerManager extends GLSPServerManager {

   public TaskListServerManager() {}

   @Override
   public ServerModule configureServerModule() {
      return new IdeServerModule().configureDiagramModule(new TaskListEclipseDiagramModule());
   }

   @Override
   public URL getResourceURL() { return Activator.getDefault().getBundle().getResource("diagram"); }

   @Override
   public String getGlspId() { return "tasklist"; }
}
