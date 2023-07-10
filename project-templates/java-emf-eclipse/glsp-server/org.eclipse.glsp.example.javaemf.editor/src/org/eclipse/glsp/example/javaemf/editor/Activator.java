/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
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

import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Plugin;
import org.eclipse.core.runtime.Status;
import org.osgi.framework.BundleContext;

public class Activator extends Plugin {
   // The plug-in ID
   public static final String PLUGIN_ID = "org.eclipse.glsp.example.javaemf.editor"; //$NON-NLS-1$

   // The shared instance
   private static Activator instance;

   @Override
   public void start(final BundleContext context) throws Exception {
      super.start(context);
      instance = this;
   }

   @Override
   public void stop(final BundleContext context) throws Exception {
      instance = null;
      super.stop(context);
   }

   public static void error(final String msg, final Throwable e) {
      Activator.getDefault().getLog().log(new Status(IStatus.ERROR, PLUGIN_ID, IStatus.OK, msg, e));

   }

   /**
    * Returns the shared instance.
    *
    * @return the shared instance
    */
   public static Activator getDefault() { return instance; }

}
