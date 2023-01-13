/********************************************************************************
 * Copyright (c) 2023-2024 EclipseSource and others.
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
import { GLSPActionDispatcher, GModelRoot, TYPES } from '@eclipse-glsp/client';
import { GlspSelectionData, GlspSelectionDataService } from '@eclipse-glsp/theia-integration/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';

@injectable()
export class CustomGlspSelectionDataService extends GlspSelectionDataService {
    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: GLSPActionDispatcher;

    async getSelectionData(_root: Readonly<GModelRoot>, selectedElementIds: string[]): Promise<GlspSelectionData> {
        const map = new Map<string, any>();

        if (selectedElementIds.length === 0) {
            selectedElementIds[0] = '';
        }

        map.set(selectedElementIds[0], {
            // could be some additional element information, e.g. fetched from the server
        });
        return { selectionDataMap: map };
    }
}
