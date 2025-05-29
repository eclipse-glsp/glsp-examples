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
    GChildElement,
    HBoxLayouterExt,
    HBoxLayoutOptionsExt,
    isLayoutableChild,
    isLayoutContainer,
    VBoxLayouterExt,
    VBoxLayoutOptionsExt
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

/**
 * Workaround to fix https://github.com/eclipse-glsp/glsp/issues/1530
 */

@injectable()
export class FixedVBoxLayouter extends VBoxLayouterExt {
    protected override getChildLayoutOptions(child: GChildElement, containerOptions: VBoxLayoutOptionsExt): VBoxLayoutOptionsExt {
        if (!isLayoutableChild(child) && !isLayoutContainer(child)) {
            return containerOptions;
        }

        return super.getChildLayoutOptions(child, this.filterContainerOptions(containerOptions)) as VBoxLayoutOptionsExt;
    }
}

@injectable()
export class FixedHboxLayouter extends HBoxLayouterExt {
    protected override getChildLayoutOptions(child: GChildElement, containerOptions: HBoxLayoutOptionsExt): HBoxLayoutOptionsExt {
        if (!isLayoutableChild(child) && !isLayoutContainer(child)) {
            return containerOptions;
        }

        return super.getChildLayoutOptions(child, this.filterContainerOptions(containerOptions)) as HBoxLayoutOptionsExt;
    }
}
