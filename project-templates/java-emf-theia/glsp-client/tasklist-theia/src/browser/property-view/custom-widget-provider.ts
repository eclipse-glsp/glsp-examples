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

import { JsonFormsPropertyViewWidgetProvider } from '@eclipse-emfcloud/jsonforms-property-view';
import { GlspSelection } from '@eclipse-glsp/theia-integration';
import { injectable, postConstruct } from 'inversify';
import { debounce } from 'lodash';

@injectable()
export class GlspPropertyViewWidgetProvider extends JsonFormsPropertyViewWidgetProvider {
    @postConstruct()
    override init(): void {
        super.init();
        this.registerWidgetChangeHandler();
    }

    protected registerWidgetChangeHandler(): void {
        this.jsonFormsWidget.onChange(
            debounce((jsonFormsData: object) => {
                this.handleChanges(jsonFormsData);
            }, 250)
        );
    }

    override canHandle(selection: any): number {
        return GlspSelection.is(selection) ? 1 : 0;
    }

    protected handleChanges(jsonFormsData: object | undefined): void {
        // handle the changed form data
        // e.g. change model via GLSP actions or your custom model management
    }
}
