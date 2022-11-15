/**
 * Copyright (c) 2022 EclipseSource and others.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
package org.eclipse.glsp.example.tasklist.model;


/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Transition</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * </p>
 * <ul>
 *   <li>{@link org.eclipse.glsp.example.tasklist.model.Transition#getSource <em>Source</em>}</li>
 *   <li>{@link org.eclipse.glsp.example.tasklist.model.Transition#getTarget <em>Target</em>}</li>
 * </ul>
 *
 * @see org.eclipse.glsp.example.tasklist.model.ModelPackage#getTransition()
 * @model
 * @generated
 */
public interface Transition extends Identifiable {
   /**
    * Returns the value of the '<em><b>Source</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Source</em>' reference.
    * @see #setSource(Task)
    * @see org.eclipse.glsp.example.tasklist.model.ModelPackage#getTransition_Source()
    * @model required="true"
    * @generated
    */
   Task getSource();

   /**
    * Sets the value of the '{@link org.eclipse.glsp.example.tasklist.model.Transition#getSource <em>Source</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Source</em>' reference.
    * @see #getSource()
    * @generated
    */
   void setSource(Task value);

   /**
    * Returns the value of the '<em><b>Target</b></em>' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @return the value of the '<em>Target</em>' reference.
    * @see #setTarget(Task)
    * @see org.eclipse.glsp.example.tasklist.model.ModelPackage#getTransition_Target()
    * @model required="true"
    * @generated
    */
   Task getTarget();

   /**
    * Sets the value of the '{@link org.eclipse.glsp.example.tasklist.model.Transition#getTarget <em>Target</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @param value the new value of the '<em>Target</em>' reference.
    * @see #getTarget()
    * @generated
    */
   void setTarget(Task value);

} // Transition
