/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
import { AbstractUIExtension, Action, GLSPActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import '../../css/filter-ui.css';

export class FilterAction implements Action {
    static readonly KIND = 'filter';
    readonly kind = FilterAction.KIND;
    constructor(readonly type: string) {}
}

@injectable()
export class FilterUi extends AbstractUIExtension {
    static readonly ID = 'filter-ui';

    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: GLSPActionDispatcher;

    protected switcher: HTMLInputElement;

    id(): string {
        return FilterUi.ID;
    }
    containerClass(): string {
        return FilterUi.ID;
    }

    protected initializeContents(containerElement: HTMLElement): void {
        this.switcher = document.createElement('input');
        this.switcher.id = 'switcher';
        this.switcher.type = 'checkbox';
        this.switcher.className += 'checkbox';

        this.switcher.onclick = event =>
            this.switcher.checked
                ? this.actionDispatcher.dispatch(new FilterAction('decisions-only'))
                : this.actionDispatcher.dispatch(new FilterAction('reset'));

        const label = document.createElement('label');
        label.htmlFor = this.switcher.id;
        label.className += 'toggle';

        const labelContents = document.createElement('p');
        labelContents.textContent = 'Show decisions only';
        label.appendChild(labelContents);

        containerElement.appendChild(this.switcher);
        containerElement.appendChild(label);
    }
}
