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
import { JsonFormsPropertyDataService } from '@eclipse-emfcloud/jsonforms-property-view';
import { IActionDispatcher } from '@eclipse-glsp/client';
import { GLSPDiagramWidget, GlspSelection } from '@eclipse-glsp/theia-integration';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from 'inversify';
import { createRequestElementDataAction, isSetElementDataAction } from 'tasklist-glsp/lib/actions/element-data-action';

@injectable()
export class GlspPropertyDataService implements JsonFormsPropertyDataService {
    readonly id = 'glsp-property-data-service';
    readonly label = 'GlspPropertyDataService';

    @inject(ApplicationShell) protected shell: ApplicationShell;

    canHandleSelection(selection: any): number {
        return GlspSelection.is(selection) && this.actionDispatcher ? 1 : 0;
    }

    protected get actionDispatcher(): IActionDispatcher | undefined {
        const widget = this.shell.activeWidget || this.shell.currentWidget;
        if (widget instanceof GLSPDiagramWidget) {
            return widget.actionDispatcher;
        }
        return undefined;
    }

    async providePropertyData(selection: any): Promise<object | undefined> {
        if (selection && GlspSelection.is(selection) && selection.selectedElementsIDs) {
            if (selection.additionalSelectionData && this.actionDispatcher) {
                const response = await this.actionDispatcher.request(createRequestElementDataAction(selection.selectedElementsIDs[0]));
                if (isSetElementDataAction(response)) {
                    return response.elementData;
                }
            }
        }
        return Promise.reject();
    }

    async getSchema(_selection: any, _properties?: any): Promise<JsonSchema | undefined> {
        // let JsonForms generate the type schema
        return undefined;
    }

    async getUiSchema(_selection: any, _properties?: any): Promise<UISchemaElement | undefined> {
        // let JsonForms generate the UI Schema
        return undefined;
    }
}
