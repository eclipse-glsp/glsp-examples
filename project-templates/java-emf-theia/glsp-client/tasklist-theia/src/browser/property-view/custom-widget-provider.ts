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
import { DefaultPropertyViewWidgetProvider } from '@theia/property-view/lib/browser/property-view-widget-provider';
import { injectable } from 'inversify';
import { GlspPropertyDataService } from './custom-data-service';
import { GlspPropertyViewWidget } from './custom-widget';

@injectable()
export class GlspPropertyViewWidgetProvider extends DefaultPropertyViewWidgetProvider {
    override readonly id = 'glsp-property-view-provider';
    override readonly label = 'GlspPropertyViewWidgetProvider';

    private glspPropertyViewWidget: GlspPropertyViewWidget;

    constructor() {
        super();
        this.glspPropertyViewWidget = new GlspPropertyViewWidget();
    }

    override canHandle(selection: any): number {
        return GlspSelection.is(selection) ? 1 : 0;
    }

    override provideWidget(_selection: any): Promise<GlspPropertyViewWidget> {
        return Promise.resolve(this.glspPropertyViewWidget);
    }

    override updateContentWidget(selection: any): void {
        this.getPropertyDataService(selection).then(service => {
            if (service instanceof GlspPropertyDataService) {
                this.glspPropertyViewWidget.updatePropertyViewContent(service, selection);
            }
        });
    }
}
