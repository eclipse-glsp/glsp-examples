/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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
import { JsonFormsPropertyViewWidget } from '@eclipse-emfcloud/jsonforms-property-view';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { JsonFormsStyleContext, vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers';
import { injectable } from 'inversify';
import * as React from 'react';

@injectable()
export class CustomPropertyViewWidget extends JsonFormsPropertyViewWidget {
    static readonly ID = 'glsp-property-view';
    static readonly LABEL = 'GLSP Element Property View';

    protected currentSelectedElementId: string;

    protected override renderForms(
        properties: object | undefined,
        typeSchema: JsonSchema | undefined,
        uiSchema: UISchemaElement | undefined
    ): void {
        this.hostRoot.render(
            <JsonFormsStyleContext.Provider value={this.getStyleContext()}>
                <JsonForms
                    data={properties}
                    schema={typeSchema}
                    uischema={uiSchema}
                    cells={vanillaCells}
                    renderers={vanillaRenderers}
                    onChange={this.jsonFormsOnChange}
                    // validationMode={...}
                />
            </JsonFormsStyleContext.Provider>
        );
    }
}
