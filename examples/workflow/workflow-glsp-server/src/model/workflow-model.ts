/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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

export interface WorkflowModel {
    id: string;
    nodes: {
        tasks?: TaskModelNode[];
        activities?: ActivityModelNode[];
    };
    edges: {
        simple?: SimpleModelEdge[];
        weighted?: WeightedModelEdge[];
    };
    categories?: CategoryModelNode[];
}

export interface ModelElement {}

export interface CategoryModelNode extends ModelElement {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
    children?: (StructModelElement | CompHeaderModelElement)[];
}

export interface TaskModelNode extends ModelElement {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
    children?: (IconModelElement | LabelModelElement)[];
}

export interface ModelSubElement extends ModelElement {
    id: string;
    type: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export interface IconModelElement extends ModelSubElement {}

export interface LabelModelElement extends ModelSubElement {
    alignment: { x: number; y: number };
    text: string;
}

export interface CompHeaderModelElement extends ModelSubElement {
    label: LabelModelElement;
}

export interface StructModelElement extends ModelSubElement {
    tasks?: TaskModelNode[];
    activities?: ActivityModelNode[];
}

export interface ActivityModelNode extends ModelElement {
    id: string;
    type: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export interface SimpleModelEdge extends ModelElement {
    routingPoints: RoutingPointModelElement[];
    id: string;
    sourceId: string;
    targetId: string;
}

export interface RoutingPointModelElement extends ModelElement {
    kind: string;
    x: number;
    y: number;
    pointIndex: number;
}

export interface WeightedModelEdge extends SimpleModelEdge {
    probabilty?: string;
}
