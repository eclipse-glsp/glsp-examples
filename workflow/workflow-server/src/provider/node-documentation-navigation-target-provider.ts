/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { Args, EditorContext, NavigationTarget } from '@eclipse-glsp/protocol';
import { GLabel, JsonOpenerOptions, ModelState, NavigationTargetProvider } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { TaskNode } from '../graph-extension';

@injectable()
export class NodeDocumentationNavigationTargetProvider implements NavigationTargetProvider {
    targetTypeId = 'documentation';

    @inject(ModelState)
    protected readonly modelState: ModelState;

    getTargets(editorContext: EditorContext): NavigationTarget[] {
        if (editorContext.selectedElementIds.length === 1) {
            const taskNode = this.modelState.index.findByClass(editorContext.selectedElementIds[0], TaskNode);
            if (!taskNode || !taskNode.children.some(child => child instanceof GLabel && child.text === 'Push')) {
                return [];
            }

            const sourceUri = this.modelState.sourceUri;
            if (!sourceUri) {
                return [];
            }

            const docUri = sourceUri.replace('.wf', '.md');
            const args: Args = {};
            args['jsonOpenerOptions'] = new JsonOpenerOptions({
                start: { line: 2, character: 3 },
                end: { line: 2, character: 7 }
            }).toJson();
            return [{ uri: docUri, args: args }];
        }
        return [];
    }
}
