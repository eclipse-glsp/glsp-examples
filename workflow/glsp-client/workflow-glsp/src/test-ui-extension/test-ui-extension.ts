/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
    AbstractUIExtension,
    ActionDispatcher,
    EditModeListener,
    EditorContextService,
    SetUIExtensionVisibilityAction,
    SModelRoot,
    TYPES
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, postConstruct } from 'inversify';

@injectable()
export class MyUIExtension extends AbstractUIExtension implements EditModeListener, SelectionListener {
    static readonly ID = 'test-extension';

    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: ActionDispatcher;

    @inject(EditorContextService)
    protected editorContext: EditorContextService;

    @inject(SelectionService)
    protected selectionService: SelectionService;

    @postConstruct()
    postConstruct(): void {
        this.editorContext.register(this);
        this.selectionService.register(this);
    }

    id(): string {
        return MyUIExtension.ID;
    }

    containerClass(): string {
        return 'test-extension';
    }

    protected initializeContents(containerElement: HTMLElement): void {
        const div = document.createElement('div');
        div.innerHTML = 'hello world';
        containerElement.appendChild(div);
    }

    selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
        console.log('selection change  received:', root, selectedElements);
    }

    editModeChanged(_oldValue: string, _newValue: string): void {
        console.log('...bin in editModeChanged: ' + _newValue);
        this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(MyUIExtension.ID, !this.editorContext.isReadonly));
    }
}
