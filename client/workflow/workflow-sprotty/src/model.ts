/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
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
    Bounds,
    boundsFeature,
    CommandExecutor,
    connectableFeature,
    deletableFeature,
    DiamondNode,
    executeCommandFeature,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutableChildFeature,
    LayoutContainer,
    layoutContainerFeature,
    moveFeature,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    SEdge,
    selectFeature,
    SShapeElement,
    WithEditableLabel,
    withEditLabelFeature
} from "@eclipse-glsp/client/lib";

import { ActivityNodeSchema } from "./model-schema";

export class TaskNode extends RectangularNode implements Nameable, WithEditableLabel {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature];
    name: string = "";
    duration?: number;
    taskType?: string;
    reference?: string;

    get editableLabel() {
        const headerComp = this.children.find(element => element.type === 'comp:header');
        if (headerComp) {
            const label = headerComp.children.find(element => element.type === 'label:heading');
            if (label && isEditableLabel(label)) {
                return label;
            }
        }
        return undefined;
    }
}

export class WeightedEdge extends SEdge {
    probability?: string;
}

export class ActivityNode extends DiamondNode {
    nodeType: string = ActivityNodeSchema.Type.UNDEFINED;
    size = {
        width: 32,
        height: 32
    };
    strokeWidth = 1;
}


export class Icon extends SShapeElement implements LayoutContainer, CommandExecutor {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, layoutableChildFeature, fadeFeature, executeCommandFeature];

    commandId: string;
    layout: string;
    layoutOptions?: { [key: string]: string | number | boolean; };
    bounds: Bounds;
    size = {
        width: 32,
        height: 32
    };
}
