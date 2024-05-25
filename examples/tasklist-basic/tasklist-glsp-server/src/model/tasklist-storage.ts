/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { Logger, MaybePromise, RequestModelAction, SaveModelAction, SourceModelStorage } from '@eclipse-glsp/server/browser';
import { inject, injectable } from 'inversify';
import { TaskListModelState } from './tasklist-model-state';

@injectable()
export class TaskListStorage implements SourceModelStorage {
    @inject(Logger)
    protected logger: Logger;

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    loadSourceModel(action: RequestModelAction): MaybePromise<void> {
        return fetch(action.options!.sourceUri.toString())
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.modelState.updateSourceModel(data);
                this.postModelForMonacoDisplay();
            });
    }

    saveSourceModel(action: SaveModelAction): MaybePromise<void> {
        this.postModelForMonacoDisplay();
    }

    private postModelForMonacoDisplay(): void {
        // This is only for transmitting the saved model back to the client, since we need it for display outside of the iframe.
        // Outside of the integrated sandbox, this is not necessary and it therefore presents a unique situation, not supposed to be handled via GLSP protocol.
        self.postMessage({ isUpdatedModelFile: true, modelFile: JSON.stringify(this.modelState.sourceModel, undefined, 2) });
    }
}
