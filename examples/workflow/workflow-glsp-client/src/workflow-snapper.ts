/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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

import { GModelElement, GRoutingHandle, GridSnapper, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class WorkflowSnapper extends GridSnapper {
    override snap(position: Point, element: GModelElement): Point {
        // we snap our edges to the center of the elements and our elements to the grid,
        // so to allow for nicer angles and more fine-grained control, we allow routing points to be snapped half-grid
        return element instanceof GRoutingHandle
            ? Point.snapToGrid(position, Point.divideScalar(this.grid, 2))
            : super.snap(position, element);
    }
}
