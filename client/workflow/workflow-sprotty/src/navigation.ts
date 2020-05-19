/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
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
    GLSP_TYPES,
    IContextMenuItemProvider,
    isSelected,
    LabeledAction,
    NavigateAction,
    Point,
    SModelRoot
} from "@eclipse-glsp/client";
import { SelectionService } from "@eclipse-glsp/client/lib/features/select/selection-service";
import { inject, injectable } from "inversify";

import { isTaskNode } from "./model";

@injectable()
export class GotoContextMenuItemProvider implements IContextMenuItemProvider {
    @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
    getItems(root: Readonly<SModelRoot>, lastMousePosition?: Point | undefined): Promise<LabeledAction[]> {
        const selection = Array.from(root.index.all().filter(isSelected));
        const selectedTaskNodes = selection.filter(isTaskNode);
        this.selectionService.updateSelection(root, selection.map(s => s.id), Array.from(root.index.all().map(s => s.id)));
        return Promise.resolve([
            {
                id: 'navigate-to-next-marker',
                parentId: "navigate",
                label: "Next node",
                sortString: "n",
                group: "task",
                actions: [new NavigateAction('next')],
                isEnabled: () => selectedTaskNodes.length === 1
            },
            {
                id: 'navigate-to-previous-marker',
                parentId: "navigate",
                label: "Previous node",
                sortString: "p",
                group: "task",
                actions: [new NavigateAction('previous')],
                isEnabled: () => selectedTaskNodes.length === 1
            },
            {
                id: 'navigate-to-doc',
                parentId: "navigate",
                label: "Documentation",
                sortString: "z",
                group: "z-docs",
                actions: [new NavigateAction('documentation')],
                isEnabled: () => selectedTaskNodes.length === 1
            }
        ]);
    }
}
