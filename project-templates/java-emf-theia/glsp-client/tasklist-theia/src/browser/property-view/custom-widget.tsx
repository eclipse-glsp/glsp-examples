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
import { ReactWidget } from '@theia/core/lib/browser';
import { PropertyViewContentWidget } from '@theia/property-view/lib/browser/property-view-content-widget';
import * as React from 'react';
import { GlspPropertyDataService } from './custom-data-service';

export class GlspPropertyViewWidget extends ReactWidget implements PropertyViewContentWidget {
    static readonly ID = 'glsp-property-view';
    static readonly LABEL = 'GLSP Element Property View';

    protected currentSelectedElementId: string;

    constructor() {
        super();
        this.id = GlspPropertyViewWidget.ID;
        this.title.label = GlspPropertyViewWidget.LABEL;
        this.title.caption = GlspPropertyViewWidget.LABEL;
        this.title.closable = false;
        this.node.tabIndex = 0;
    }

    updatePropertyViewContent(propertyDataService?: GlspPropertyDataService, selection?: any): void {
        if (propertyDataService) {
            propertyDataService.providePropertyData(selection).then((selectedElementId: string | undefined) => {
                if (selectedElementId) {
                    this.currentSelectedElementId = selectedElementId;
                }
            });
        }
        this.update();
    }

    protected render(): React.ReactNode {
        return <div>{`Selected GLSP node: ${this.currentSelectedElementId}`}</div>;
    }
}
