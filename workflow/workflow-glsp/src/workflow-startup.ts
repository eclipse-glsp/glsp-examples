/********************************************************************************
 * Copyright (c) 2024-2026 EclipseSource and others.
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

import { IDiagramStartup, IGridManager, MaybePromise, TYPES } from '@eclipse-glsp/client';
import { inject, injectable, optional } from 'inversify';

/**
 * Injection symbol for the initial grid visibility applied by the {@link WorkflowStartup}.
 * Defaults to `true` (grid shown); rebind to override (e.g. the standalone app derives it from a url
 * parameter).
 */
export const GridDefaultVisible = Symbol('GridDefaultVisible');

@injectable()
export class WorkflowStartup implements IDiagramStartup {
    rank = -1;

    @inject(TYPES.IGridManager) @optional() protected gridManager?: IGridManager;

    @inject(GridDefaultVisible) @optional() protected gridDefaultVisible?: boolean;

    preRequestModel(): MaybePromise<void> {
        this.gridManager?.setGridVisible(this.gridDefaultVisible ?? true);
    }
}
