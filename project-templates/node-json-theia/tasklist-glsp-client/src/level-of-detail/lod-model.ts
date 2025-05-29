/********************************************************************************
 * Copyright (c) 2025 EclipseSource and others.
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

import { GCompartment, GGraph, layoutContainerFeature, layoutableChildFeature } from '@eclipse-glsp/client';

export type LevelOfDetail = (typeof LevelOfDetail)[keyof typeof LevelOfDetail];
export const LevelOfDetail = {
    OVERVIEW: 'overview', // < 0.40
    DETAIL: 'detail', // > 2.5
    DEFAULT: 'default' // otherwise
} as const;

/**
 *  A graph that also stores the current level of detail.
 */
export class LodGGraph extends GGraph {
    levelOfDetail: LevelOfDetail = LevelOfDetail.DEFAULT;
}

/**
 * A compartment that is only visible in certain levels of detail.
 * This is used to hide compartments that are not relevant in the current level of detail.
 */
export class LodCompartment extends GCompartment {
    visibleIn: LevelOfDetail[] = [LevelOfDetail.DEFAULT, LevelOfDetail.OVERVIEW, LevelOfDetail.DETAIL];

    isVisible(): boolean {
        const root = this.root;
        if (!(root instanceof LodGGraph)) {
            return true;
        }
        if (this.visibleIn.includes(root.levelOfDetail)) {
            return true;
        }

        return false;
    }

    // Return false for layoutableChildFeature and layoutContainerFeature if the contribution is not visible
    // This ensures correct client-side layouting
    override hasFeature(feature: symbol): boolean {
        const result = super.hasFeature(feature);
        if (feature === layoutableChildFeature || feature === layoutContainerFeature) {
            return result && this.isVisible();
        }
        return result;
    }
}
