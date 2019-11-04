/**
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
 */
package org.eclipse.glsp.example.workflow.wfgraph;

import org.eclipse.glsp.graph.GCompartment;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Icon</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link org.eclipse.glsp.example.workflow.wfgraph.Icon#getCommandId <em>Command Id</em>}</li>
 * </ul>
 *
 * @see org.eclipse.glsp.example.workflow.wfgraph.WfgraphPackage#getIcon()
 * @model
 * @generated
 */
public interface Icon extends GCompartment {
   /**
    * Returns the value of the '<em><b>Command Id</b></em>' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Command Id</em>' attribute.
    * @see #setCommandId(String)
    * @see org.eclipse.glsp.example.workflow.wfgraph.WfgraphPackage#getIcon_CommandId()
    * @model
    * @generated
    */
   String getCommandId();

   /**
    * Sets the value of the '{@link org.eclipse.glsp.example.workflow.wfgraph.Icon#getCommandId <em>Command Id</em>}' attribute.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Command Id</em>' attribute.
    * @see #getCommandId()
    * @generated
    */
   void setCommandId(String value);

} // Icon
