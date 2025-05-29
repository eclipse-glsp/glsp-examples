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

import { GCompartment, GCompartmentBuilder, GGraph, GGraphBuilder, ModelState } from '@eclipse-glsp/server';
import { LevelOfDetail } from './update-lod-action-handler';

export function setLod(modelState: ModelState, levelOfDetail: LevelOfDetail): void {
    modelState.set('levelOfDetail', levelOfDetail);
}

export function getLod(modelState: ModelState): LevelOfDetail {
    const lod = modelState.get<LevelOfDetail>('levelOfDetail');
    if (!lod) {
        modelState.set('levelOfDetail', LevelOfDetail.DEFAULT);
        return LevelOfDetail.DEFAULT;
    }
    return lod;
}

export class LodGraph extends GGraph {
    static override builder(): LodGraphBuilder {
        return new LodGraphBuilder(LodGraph);
    }

    levelOfDetail: LevelOfDetail = LevelOfDetail.DEFAULT;
}

export class LodGraphBuilder<T extends LodGraph = LodGraph> extends GGraphBuilder<T> {
    levelOfDetail(levelOfDetail: LevelOfDetail): this {
        this.proxy.levelOfDetail = levelOfDetail;
        return this;
    }
}

export class LodCompartment extends GCompartment {
    static readonly TYPE = 'comp:lod';
    static override builder(): LodCompartmentBuilder {
        return new LodCompartmentBuilder(LodCompartment);
    }
    override type = LodCompartment.TYPE;
    visibleIn: LevelOfDetail[] = [LevelOfDetail.DEFAULT, LevelOfDetail.OVERVIEW, LevelOfDetail.DETAIL];
}

export class LodCompartmentBuilder<T extends LodCompartment = LodCompartment> extends GCompartmentBuilder<T> {
    visibleIn(visibleIn: LevelOfDetail[]): this {
        this.proxy.visibleIn = Array.from(new Set(visibleIn));
        return this;
    }
}
