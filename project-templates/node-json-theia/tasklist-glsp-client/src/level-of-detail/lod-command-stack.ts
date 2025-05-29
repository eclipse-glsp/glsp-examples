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
    BoundsAwareViewportCommand,
    GLSPCommandStack,
    GModelRoot,
    ICommand,
    SetModelCommand,
    UpdateModelCommand
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { LoDViewportHandler } from './lod-viewport-handler';

/**
 * Small customization for the command stack to be able to react to viewport changes
 * that might be triggered by `CenterAction` or `FitToScreenAction` (i.e. actions that trigger a `BoundsAwareViewportCommand`).
 * ( see also https://github.com/eclipse-glsp/glsp/issues/1531)
 */
@injectable()
export class LodCommandStack extends GLSPCommandStack {
    override async execute(command: ICommand): Promise<GModelRoot> {
        const result = await super.execute(command);
        if (command instanceof SetModelCommand || command instanceof UpdateModelCommand) {
            this.notifyListeners(result);
        } else if (command instanceof BoundsAwareViewportCommand && command.newViewport) {
            this.lazyInjector.get(LoDViewportHandler).handleZoomChange(command.newViewport.zoom);
        }
        return result;
    }
}
