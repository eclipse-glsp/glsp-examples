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

import {
    FeatureModule,
    HBoxLayouterExt,
    SetViewportAction,
    TYPES,
    VBoxLayouterExt,
    boundsModule,
    configureActionHandler,
    configureCommand,
    configureModelElement,
    viewportModule
} from '@eclipse-glsp/client';
import { FixedHboxLayouter, FixedVBoxLayouter } from './layouter-fix';
import { LodCommandStack } from './lod-command-stack';
import { LodCompartment } from './lod-model';
import { LodCompartmentView } from './lod-view';
import { LoDViewportHandler, UpdateLodCommand } from './lod-viewport-handler';

export const levelOfDetailModule = new FeatureModule(
    (bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        bind(LoDViewportHandler).toSelf().inSingletonScope();
        rebind(TYPES.ICommandStack).to(LodCommandStack).inSingletonScope();
        configureCommand(context, UpdateLodCommand);
        configureActionHandler(context, SetViewportAction.KIND, LoDViewportHandler);

        configureModelElement(context, 'comp:lod', LodCompartment, LodCompartmentView);

        // Workaround/local fix for https://github.com/eclipse-glsp/glsp/issues/1530
        rebind(VBoxLayouterExt).to(FixedVBoxLayouter).inSingletonScope();
        rebind(HBoxLayouterExt).to(FixedHboxLayouter).inSingletonScope();
    },
    { featureId: Symbol('levelOfDetail'), requires: [viewportModule, boundsModule] }
);
