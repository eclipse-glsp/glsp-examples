/********************************************************************************
 * Copyright (c) 2020-2023 EclipseSource and others.
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
    Action,
    AutoCompleteWidget,
    DOMHelper,
    EditorContextService,
    GLSPAbstractUIExtension,
    GLSPActionDispatcher,
    GModelRoot,
    ILogger,
    LabeledAction,
    ModelIndexImpl,
    Operation,
    RequestContextActions,
    RequestEditValidationAction,
    SetContextActions,
    SetEditValidationResultAction,
    TYPES,
    ValidationDecorator,
    ValidationStatus,
    ViewerOptions,
    getAbsoluteClientBounds,
    hasStringProp,
    toActionArray
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { TaskNode, isTaskNode } from '../model';

/**
 * Is send from the {@link TaskEditor} to the GLSP server
 * to update a feature from a specified task.
 */
export interface EditTaskOperation extends Operation {
    kind: typeof EditTaskOperation.KIND;

    /**
     * Id of the task that should be edited
     */
    taskId: string;

    /**
     * The feature that is to be updated
     */
    feature: 'duration' | 'taskType';

    /**
     * The new feature value
     */
    value: string;
}

export namespace EditTaskOperation {
    export const KIND = 'editTask';

    export function is(object: any): object is EditTaskOperation {
        return (
            Action.hasKind(object, KIND) &&
            hasStringProp(object, 'taskId') &&
            hasStringProp(object, 'feature') &&
            hasStringProp(object, 'value')
        );
    }

    export function create(options: { taskId: string; feature: 'duration' | 'taskType'; value: string }): EditTaskOperation {
        return {
            kind: KIND,
            isOperation: true,
            ...options
        };
    }
}

@injectable()
export class TaskEditor extends GLSPAbstractUIExtension {
    static readonly ID = 'task-editor';
    readonly autoSuggestionSettings = {
        noSuggestionsMessage: 'No suggestions available',
        suggestionsClass: 'command-palette-suggestions',
        debounceWaitMs: 50,
        showOnFocus: true
    };

    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher: GLSPActionDispatcher;

    @inject(EditorContextService)
    protected editorContextService: EditorContextService;

    @inject(TYPES.ViewerOptions)
    protected viewerOptions: ViewerOptions;

    @inject(TYPES.DOMHelper)
    protected domHelper: DOMHelper;

    @inject(TYPES.ILogger)
    protected override logger: ILogger;

    protected task: TaskNode;
    protected autoSuggestion: AutoCompleteWidget;

    id(): string {
        return TaskEditor.ID;
    }
    containerClass(): string {
        return 'command-palette';
    }

    protected initializeContents(containerElement: HTMLElement): void {
        this.autoSuggestion = new AutoCompleteWidget(
            this.autoSuggestionSettings,
            { provideSuggestions: input => this.retrieveSuggestions(input) },
            { executeFromSuggestion: input => this.executeFromSuggestion(input) },
            () => this.hide(),
            this.logger
        );
        this.autoSuggestion.configureValidation(
            { validate: input => this.validateInput(input) },
            new ValidationDecorator(containerElement)
        );
        this.autoSuggestion.configureTextSubmitHandler({
            executeFromTextOnlyInput: (input: string) => this.executeFromTextOnlyInput(input)
        });
        this.autoSuggestion.initialize(containerElement);
    }

    override show(root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
        super.show(root, ...contextElementIds);
        this.autoSuggestion.open(root);
    }

    protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
        this.task = getTask(contextElementIds, root.index)[0];
        this.autoSuggestion.inputField.value = '';
        this.setPosition(containerElement);
    }

    protected setPosition(containerElement: HTMLElement): void {
        let x = 0;
        let y = 0;

        if (this.task) {
            const bounds = getAbsoluteClientBounds(this.task, this.domHelper, this.viewerOptions);
            x = bounds.x + 5;
            y = bounds.y + 5;
        }

        containerElement.style.left = `${x}px`;
        containerElement.style.top = `${y}px`;
        containerElement.style.width = '200px';
    }

    protected async retrieveSuggestions(input: string): Promise<LabeledAction[]> {
        const response = await this.actionDispatcher.request(
            RequestContextActions.create({ contextId: TaskEditor.ID, editorContext: this.editorContextService.get({ ['text']: input }) })
        );
        if (SetContextActions.is(response)) {
            return response.actions;
        }
        return Promise.reject();
    }

    protected async validateInput(input: string): Promise<ValidationStatus> {
        const response = await this.actionDispatcher.request(
            RequestEditValidationAction.create({ contextId: TaskEditor.ID, modelElementId: this.task.id, text: input })
        );
        if (SetEditValidationResultAction.is(response)) {
            return response.status;
        }
        return Promise.reject();
    }

    protected executeFromSuggestion(input: LabeledAction | Action[] | Action): void {
        this.actionDispatcher.dispatchAll(toActionArray(input));
    }

    protected executeFromTextOnlyInput(input: string): void {
        if (input.startsWith('duration:')) {
            const value = input.substring('duration:'.length);
            const action = EditTaskOperation.create({ taskId: this.task.id, feature: 'duration', value });
            this.actionDispatcher.dispatch(action);
        } else if (input.startsWith('taskType:')) {
            const value = input.substring('taskType:'.length);
            const action = EditTaskOperation.create({ taskId: this.task.id, feature: 'taskType', value });
            this.actionDispatcher.dispatch(action);
        } else {
            throw new Error('Unsupported Task Editing: ' + input);
        }
    }

    override hide(): void {
        this.autoSuggestion.dispose();
        super.hide();
    }
}

function getTask(ids: string[], index: ModelIndexImpl): TaskNode[] {
    return ids.map(id => index.getById(id)).filter(element => element && isTaskNode(element)) as TaskNode[];
}
