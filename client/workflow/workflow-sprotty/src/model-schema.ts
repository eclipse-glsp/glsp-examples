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
import { SEdgeSchema, SNodeSchema } from "@eclipse-glsp/client/lib";

export namespace ActivityNodeSchema {
    export namespace Type {
        export const INITIAL = 'initalNode';
        export const FINAL = 'finalNode';
        export const DECISION = 'decisionNode';
        export const MERGE = 'mergeNode';
        export const JOIN = 'joinNode';
        export const FORK = 'forkNode';
        export const UNDEFINED = "undefined";
    }
}

export interface TaskNodeSchema extends SNodeSchema {
    name?: string
    duration?: number
    taskType?: string
    reference?: string
}

export interface WeightedEdgeSchema extends SEdgeSchema {
    probability?: string
}

export interface ActivityNodeSchema extends SNodeSchema {
    nodeType: string
}
