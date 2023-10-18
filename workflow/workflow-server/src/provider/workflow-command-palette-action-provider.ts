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
import {
    Args,
    CommandPaletteActionProvider,
    CreateEdgeOperation,
    CreateNodeOperation,
    DefaultTypes,
    DeleteElementOperation,
    GModelElement,
    GNode,
    LabeledAction,
    ModelState,
    Point
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { TaskNode } from '../graph-extension';
import { ModelTypes } from '../util/model-types';

@injectable()
export class WorkflowCommandPaletteActionProvider extends CommandPaletteActionProvider {
    @inject(ModelState)
    protected override modelState: ModelState;

    getPaletteActions(selectedElementIds: string[], selectedElements: GModelElement[], position: Point, args?: Args): LabeledAction[] {
        const actions: LabeledAction[] = [];
        if (this.modelState.isReadonly) {
            return actions;
        }
        const index = this.modelState.index;
        // Create actions
        const location = position ?? Point.ORIGIN;
        actions.push(
            {
                label: 'Create Automated Task',
                actions: [CreateNodeOperation.create(ModelTypes.AUTOMATED_TASK, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Manual Task',
                actions: [CreateNodeOperation.create(ModelTypes.MANUAL_TASK, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Merge Node',
                actions: [CreateNodeOperation.create(ModelTypes.MERGE_NODE, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Decision Node',
                actions: [CreateNodeOperation.create(ModelTypes.DECISION_NODE, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Category',
                actions: [CreateNodeOperation.create(ModelTypes.CATEGORY, { location })],
                icon: 'fa-plus-square'
            }
        );
        // Create edge action between two nodes
        if (selectedElements.length === 1) {
            const element = selectedElements[0];
            if (element instanceof GNode) {
                actions.push(...this.createEdgeActions(element, index.getAllByClass(TaskNode)));
            }
        } else if (selectedElements.length === 2) {
            const source = selectedElements[0];
            const target = selectedElements[1];
            if (source instanceof TaskNode && target instanceof TaskNode) {
                actions.push(
                    this.createEdgeAction(`Create Edge from ${this.getLabel(source)} to ${this.getLabel(target)}`, source, target)
                );
                actions.push(
                    this.createWeightedEdgeAction(
                        `Create Weighted Edge from ${this.getLabel(source)} to ${this.getLabel(target)}`,
                        source,
                        target
                    )
                );
            }
        }
        // Delete action

        const label = selectedElementIds.length === 1 ? 'Delete' : 'Delete All';
        actions.push({ label, actions: [DeleteElementOperation.create(selectedElementIds)], icon: 'fa-minus-square' });

        return actions;
    }

    protected createEdgeActions(source: GNode, targets: GNode[]): LabeledAction[] {
        const actions: LabeledAction[] = [];
        targets.forEach(node => actions.push(this.createEdgeAction(`Create Edge to ${this.getLabel(node)}`, source, node)));
        targets.forEach(node =>
            actions.push(this.createWeightedEdgeAction(`Create Weighted Edge to ${this.getLabel(node)}`, source, node))
        );
        return actions;
    }

    protected createWeightedEdgeAction(label: string, source: GNode, node: GNode): LabeledAction {
        return {
            label,
            actions: [
                CreateEdgeOperation.create({
                    elementTypeId: ModelTypes.WEIGHTED_EDGE,
                    sourceElementId: source.id,
                    targetElementId: node.id
                })
            ],
            icon: 'fa-plus-square'
        };
    }

    protected createEdgeAction(label: string, source: GNode, node: GNode): LabeledAction {
        return {
            label,
            actions: [
                CreateEdgeOperation.create({ elementTypeId: DefaultTypes.EDGE, sourceElementId: source.id, targetElementId: node.id })
            ],
            icon: 'fa-plus-square'
        };
    }

    protected getLabel(node: GNode): string {
        if (node instanceof TaskNode) {
            return node.name;
        }
        return node.id;
    }
}
