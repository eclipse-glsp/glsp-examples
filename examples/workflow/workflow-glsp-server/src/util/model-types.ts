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
/* eslint-disable @typescript-eslint/padding-line-between-statements */
export namespace ModelTypes {
    export const LABEL_HEADING = 'label:heading';
    export const LABEL_TEXT = 'label:text';
    export const COMP_HEADER = 'comp:header';
    export const LABEL_ICON = 'label:icon';
    export const WEIGHTED_EDGE = 'edge:weighted';
    export const ICON = 'icon';
    export const ACTIVITY_NODE = 'activityNode';
    export const DECISION_NODE = `${ACTIVITY_NODE}:decision`;
    export const MERGE_NODE = `${ACTIVITY_NODE}:merge`;
    export const FORK_NODE = `${ACTIVITY_NODE}:fork`;
    export const JOIN_NODE = `${ACTIVITY_NODE}:join`;
    export const TASK = 'task';
    export const MANUAL_TASK = `${TASK}:manual`;
    export const AUTOMATED_TASK = `${TASK}:automated`;
    export const CATEGORY = 'category';
    export const STRUCTURE = 'struct';

    export function toNodeType(type: string): string {
        switch (type) {
            case DECISION_NODE:
                return 'decisionNode';
            case MERGE_NODE:
                return 'mergeNode';
            case FORK_NODE:
                return 'forkNode';
            case JOIN_NODE:
                return 'joinNode';
            case MANUAL_TASK:
                return 'manual';
            case AUTOMATED_TASK:
                return 'automated';
            case CATEGORY:
                return 'category';
            default:
                return 'unknown';
        }
    }
}
