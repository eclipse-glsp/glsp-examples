/**
 *  Copyright (c) 2019-2021 EclipseSource and others.
 * 
 *  This program and the accompanying materials are made available under the
 *  terms of the Eclipse Public License v. 2.0 which is available at
 *  https://www.eclipse.org/legal/epl-2.0.
 * 
 *  This Source Code may also be made available under the following Secondary
 *  Licenses when the conditions for such availability set forth in the Eclipse
 *  Public License v. 2.0 are satisfied: GNU General Public License, version 2
 *  with the GNU Classpath Exception which is available at
 *  https://www.gnu.org/software/classpath/license.html.
 *  SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 *  
 */
package org.eclipse.glsp.example.workflow.wfgraph.impl;

import org.eclipse.emf.ecore.EClass;

import org.eclipse.glsp.example.workflow.wfgraph.Icon;
import org.eclipse.glsp.example.workflow.wfgraph.WfgraphPackage;

import org.eclipse.glsp.graph.impl.GCompartmentImpl;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Icon</b></em>'.
 * <!-- end-user-doc -->
 *
 * @generated
 */
public class IconImpl extends GCompartmentImpl implements Icon {
   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   protected IconImpl() {
      super();
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   protected EClass eStaticClass() {
      return WfgraphPackage.Literals.ICON;
   }

} //IconImpl
