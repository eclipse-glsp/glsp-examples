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
import { DefaultTypes, EdgeTypeHint, ShapeTypeHint } from '@eclipse-glsp/protocol';
import {
    DiagramConfiguration,
    GCompartment,
    GEdge,
    GLabel,
    GModelElementConstructor,
    ServerLayoutKind,
    getDefaultMapping
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ActivityNode, Category, TaskNode } from './graph-extension';
import { ModelTypes as types } from './util/model-types';

@injectable()
export class WorkflowDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(types.LABEL_HEADING, GLabel);
        mapping.set(types.LABEL_TEXT, GLabel);
        mapping.set(types.COMP_HEADER, GCompartment);
        mapping.set(types.LABEL_ICON, GLabel);
        mapping.set(types.WEIGHTED_EDGE, GEdge);
        mapping.set(types.ICON, GCompartment);
        mapping.set(types.ACTIVITY_NODE, ActivityNode);
        mapping.set(types.TASK, TaskNode);
        mapping.set(types.CATEGORY, Category);
        mapping.set(types.STRUCTURE, GCompartment);
        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            createDefaultShapeTypeHint(types.MANUAL_TASK),
            createDefaultShapeTypeHint(types.AUTOMATED_TASK),
            createDefaultShapeTypeHint({ elementTypeId: types.FORK_NODE, resizable: false }),
            createDefaultShapeTypeHint({ elementTypeId: types.JOIN_NODE, resizable: false }),
            createDefaultShapeTypeHint(types.DECISION_NODE),
            createDefaultShapeTypeHint(types.MERGE_NODE),
            createDefaultShapeTypeHint({
                elementTypeId: types.CATEGORY,
                containableElementTypeIds: [types.TASK, types.ACTIVITY_NODE, types.CATEGORY]
            })
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [
            createDefaultEdgeTypeHint(DefaultTypes.EDGE),
            createDefaultEdgeTypeHint({
                elementTypeId: types.WEIGHTED_EDGE,
                dynamic: true,
                sourceElementTypeIds: [types.ACTIVITY_NODE],
                targetElementTypeIds: [types.TASK, types.ACTIVITY_NODE]
            })
        ];
    }

    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;
}

export function createDefaultShapeTypeHint(template: { elementTypeId: string } & Partial<ShapeTypeHint>): ShapeTypeHint;
export function createDefaultShapeTypeHint(elementId: string): ShapeTypeHint;
export function createDefaultShapeTypeHint(
    elementIdOrTemplate: string | ({ elementTypeId: string } & Partial<ShapeTypeHint>)
): ShapeTypeHint {
    const template = typeof elementIdOrTemplate === 'string' ? { elementTypeId: elementIdOrTemplate } : elementIdOrTemplate;
    return { repositionable: true, deletable: true, resizable: true, reparentable: true, ...template };
}

export function createDefaultEdgeTypeHint(template: { elementTypeId: string } & Partial<EdgeTypeHint>): EdgeTypeHint;
export function createDefaultEdgeTypeHint(elementId: string): EdgeTypeHint;
export function createDefaultEdgeTypeHint(elementIdOrTemplate: string | ({ elementTypeId: string } & Partial<EdgeTypeHint>)): EdgeTypeHint {
    const template = typeof elementIdOrTemplate === 'string' ? { elementTypeId: elementIdOrTemplate } : elementIdOrTemplate;
    return {
        repositionable: true,
        deletable: true,
        routable: true,
        sourceElementTypeIds: [
            types.MANUAL_TASK,
            types.AUTOMATED_TASK,
            types.DECISION_NODE,
            types.MERGE_NODE,
            types.FORK_NODE,
            types.JOIN_NODE,
            types.CATEGORY
        ],
        targetElementTypeIds: [
            types.MANUAL_TASK,
            types.AUTOMATED_TASK,
            types.DECISION_NODE,
            types.MERGE_NODE,
            types.FORK_NODE,
            types.JOIN_NODE,
            types.CATEGORY
        ],
        ...template
    };
}
