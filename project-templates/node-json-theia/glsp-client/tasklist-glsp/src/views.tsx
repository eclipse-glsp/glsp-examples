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
import { getSubType, isEdgeLayoutable, RenderingContext, setAttr, ShapeView, SLabel, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class TaskLabelView extends ShapeView {
    render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
        if (!isEdgeLayoutable(label) && !this.isVisible(label, context)) {
            return undefined;
        }
        const vnode = <text class-sprotty-label={true}>{label.text}</text>;
        const subType = getSubType(label);
        if (subType) {
            setAttr(vnode, 'class', subType);
        }
        return vnode;
    }
}

@injectable()
export class DifficultyLabelView extends ShapeView {
    render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(label, context)) {
            return undefined;
        }
        return (
            <g>
                <text class-sprotty-label={true}>-{label.text}-</text>
                <line x1={-(label.size.width / 2) - 4.5} y1='4' x2={label.size.width / 2 + 4.7} y2='4' stroke='black' />
            </g>
        );
    }
}
