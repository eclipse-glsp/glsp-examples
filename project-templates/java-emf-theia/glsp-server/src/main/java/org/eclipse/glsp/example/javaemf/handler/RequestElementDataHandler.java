/********************************************************************************
 * Copyright (c) 2023-2024 EclipseSource and others.
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
package org.eclipse.glsp.example.javaemf.handler;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.glsp.example.javaemf.action.ElementData;
import org.eclipse.glsp.example.javaemf.action.RequestElementDataAction;
import org.eclipse.glsp.example.javaemf.action.SetElementDataAction;
import org.eclipse.glsp.example.tasklist.model.Identifiable;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.emf.notation.EMFNotationModelState;

import com.google.inject.Inject;

public class RequestElementDataHandler extends AbstractActionHandler<RequestElementDataAction> {

    @Inject
    protected EMFNotationModelState modelState;

    @Override
    public List<Action> executeAction(final RequestElementDataAction action) {
        String elementId = action.getElementId();
        if (elementId.isEmpty()) {
            // if canvas is selected, fetch root element data
            elementId = "root";
        }
        Identifiable semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            Identifiable.class,
            "Could not find element for id '" + elementId + "', no delete operation executed.");

        return listOf(new SetElementDataAction(new ElementData(semanticElement.getName())));
    }

}
