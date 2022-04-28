/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
package org.eclipse.glsp.example.javaemf.model;

import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.glsp.example.tasklist.model.ModelPackage;
import org.eclipse.glsp.server.emf.notation.EMFNotationSourceModelStorage;

public class TaskListSourceModelStorage extends EMFNotationSourceModelStorage {
   @Override
   protected ResourceSet setupResourceSet(final ResourceSet resourceSet) {
      resourceSet.getPackageRegistry().put(ModelPackage.eINSTANCE.getNsURI(), ModelPackage.eINSTANCE);
      return super.setupResourceSet(resourceSet);
   }
}
