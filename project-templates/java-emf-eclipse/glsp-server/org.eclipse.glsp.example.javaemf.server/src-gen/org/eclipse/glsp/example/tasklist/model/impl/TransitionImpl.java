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
package org.eclipse.glsp.example.tasklist.model.impl;

import org.eclipse.emf.common.notify.Notification;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;

import org.eclipse.emf.ecore.impl.ENotificationImpl;

import org.eclipse.glsp.example.tasklist.model.ModelPackage;
import org.eclipse.glsp.example.tasklist.model.Task;
import org.eclipse.glsp.example.tasklist.model.Transition;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Transition</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * </p>
 * <ul>
 *   <li>{@link org.eclipse.glsp.example.tasklist.model.impl.TransitionImpl#getSource <em>Source</em>}</li>
 *   <li>{@link org.eclipse.glsp.example.tasklist.model.impl.TransitionImpl#getTarget <em>Target</em>}</li>
 * </ul>
 *
 * @generated
 */
public class TransitionImpl extends IdentifiableImpl implements Transition {
   /**
    * The cached value of the '{@link #getSource() <em>Source</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getSource()
    * @generated
    * @ordered
    */
   protected Task source;

   /**
    * The cached value of the '{@link #getTarget() <em>Target</em>}' reference.
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @see #getTarget()
    * @generated
    * @ordered
    */
   protected Task target;

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   protected TransitionImpl() {
      super();
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   protected EClass eStaticClass() {
      return ModelPackage.Literals.TRANSITION;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Task getSource() {
      if (source != null && source.eIsProxy()) {
         InternalEObject oldSource = (InternalEObject)source;
         source = (Task)eResolveProxy(oldSource);
         if (source != oldSource) {
            if (eNotificationRequired())
               eNotify(new ENotificationImpl(this, Notification.RESOLVE, ModelPackage.TRANSITION__SOURCE, oldSource, source));
         }
      }
      return source;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public Task basicGetSource() {
      return source;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setSource(Task newSource) {
      Task oldSource = source;
      source = newSource;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, ModelPackage.TRANSITION__SOURCE, oldSource, source));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Task getTarget() {
      if (target != null && target.eIsProxy()) {
         InternalEObject oldTarget = (InternalEObject)target;
         target = (Task)eResolveProxy(oldTarget);
         if (target != oldTarget) {
            if (eNotificationRequired())
               eNotify(new ENotificationImpl(this, Notification.RESOLVE, ModelPackage.TRANSITION__TARGET, oldTarget, target));
         }
      }
      return target;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   public Task basicGetTarget() {
      return target;
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void setTarget(Task newTarget) {
      Task oldTarget = target;
      target = newTarget;
      if (eNotificationRequired())
         eNotify(new ENotificationImpl(this, Notification.SET, ModelPackage.TRANSITION__TARGET, oldTarget, target));
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public Object eGet(int featureID, boolean resolve, boolean coreType) {
      switch (featureID) {
         case ModelPackage.TRANSITION__SOURCE:
            if (resolve) return getSource();
            return basicGetSource();
         case ModelPackage.TRANSITION__TARGET:
            if (resolve) return getTarget();
            return basicGetTarget();
      }
      return super.eGet(featureID, resolve, coreType);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void eSet(int featureID, Object newValue) {
      switch (featureID) {
         case ModelPackage.TRANSITION__SOURCE:
            setSource((Task)newValue);
            return;
         case ModelPackage.TRANSITION__TARGET:
            setTarget((Task)newValue);
            return;
      }
      super.eSet(featureID, newValue);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public void eUnset(int featureID) {
      switch (featureID) {
         case ModelPackage.TRANSITION__SOURCE:
            setSource((Task)null);
            return;
         case ModelPackage.TRANSITION__TARGET:
            setTarget((Task)null);
            return;
      }
      super.eUnset(featureID);
   }

   /**
    * <!-- begin-user-doc -->
    * <!-- end-user-doc -->
    * @generated
    */
   @Override
   public boolean eIsSet(int featureID) {
      switch (featureID) {
         case ModelPackage.TRANSITION__SOURCE:
            return source != null;
         case ModelPackage.TRANSITION__TARGET:
            return target != null;
      }
      return super.eIsSet(featureID);
   }

} //TransitionImpl
