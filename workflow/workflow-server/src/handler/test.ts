/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { GModelElement, GNode, Marker, MarkerKind, ModelState, ModelValidator } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';

@injectable()
export class CustomModelValidator implements ModelValidator {
    @inject(ModelState)
    protected readonly modelState: ModelState;

    validate(elements: GModelElement[]): Marker[] {
        const markers: Marker[] = [];
        for (const element of elements) {
            if (element instanceof GNode) {
                markers.push(this.validateGNode(element));
            }
            if (element.children) {
                markers.push(...this.validate(element.children));
            }
        }
        return markers;
    }

    protected validateGNode(element: GNode): Marker {
        return {
            kind: MarkerKind.INFO,
            description: 'This graphical element is a node',
            elementId: element.id,
            label: 'Node'
        };
    }
}

