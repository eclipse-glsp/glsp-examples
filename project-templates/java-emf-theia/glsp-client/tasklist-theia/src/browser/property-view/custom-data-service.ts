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
import { GlspSelection } from '@eclipse-glsp/theia-integration';
import { PropertyDataService } from '@theia/property-view/lib/browser/property-data-service';
import { injectable } from 'inversify';

@injectable()
export class GlspPropertyDataService implements PropertyDataService {
    readonly id = 'glsp-property-data-service';
    readonly label = 'GlspPropertyDataService';

    canHandleSelection(selection: any): number {
        return GlspSelection.is(selection) ? 1 : 0;
    }

    async providePropertyData(selection: any): Promise<string | undefined> {
        if (selection && GlspSelection.is(selection) && selection.selectedElementsIDs) {
            if (selection.additionalSelectionData) {
                return selection.selectedElementsIDs.length === 1 ? selection.selectedElementsIDs[0] : '';
            }
        }
        return Promise.reject();
    }
}
