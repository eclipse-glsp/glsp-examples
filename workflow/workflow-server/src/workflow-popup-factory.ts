/********************************************************************************
 * Copyright (c) 2022-2024 STMicroelectronics and others.
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
import { GModelElement, GModelRoot, GPreRenderedElement, PopupModelFactory, RequestPopupModelAction } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { TaskNode } from './graph-extension';

const NL = '<br/>';

@injectable()
export class WorkflowPopupFactory implements PopupModelFactory {
    createPopupModel(element: GModelElement, action: RequestPopupModelAction): GModelRoot | undefined {
        if (element && element instanceof TaskNode) {
            const popupTitle = GPreRenderedElement.builder()
                .id('popup-title')
                .code(`<div class="sprotty-popup-title">${element.name}</div>`)
                .build();

            const popupBody = GPreRenderedElement.builder()
                .id('popup-body')
                .code(`<div class="sprotty-popup-body">${this.generateBody(element)}</div>`)
                .build();

            return GModelRoot.builder().type('html').canvasBounds(action.bounds).id('sprotty-popup').add(popupTitle).add(popupBody).build();
        }
        return undefined;
    }

    protected generateBody(task: TaskNode): string {
        return `Type: ${task.taskType} ${NL}
            Duration: ${task.duration} ${NL}
            Reference: ${task.references} ${NL}`;
    }
}
