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
    ArgsUtil,
    GCompartment,
    GCompartmentBuilder,
    GEdge,
    GEdgeBuilder,
    GLabel,
    GLabelBuilder,
    GNode,
    GNodeBuilder
} from '@eclipse-glsp/server';
import { ModelTypes } from './util/model-types';

export class ActivityNode extends GNode {
    nodeType: string;

    static override builder(): ActivityNodeBuilder {
        return new ActivityNodeBuilder(ActivityNode);
    }
}

export class ActivityNodeBuilder<T extends ActivityNode = ActivityNode> extends GNodeBuilder<T> {
    nodeType(nodeType: string): this {
        this.proxy.nodeType = nodeType;
        return this;
    }
}

export class TaskNode extends GNode {
    name: string;
    duration: number;
    taskType: string;
    references: string;

    static override builder(): TaskNodeBuilder {
        return new TaskNodeBuilder(TaskNode).layout('vbox').addArgs(ArgsUtil.cornerRadius(5)).addCssClass('task');
    }
}

export class TaskNodeBuilder<T extends TaskNode = TaskNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    duration(duration: number): this {
        this.proxy.duration = duration;
        return this;
    }

    taskType(tasktype: string): this {
        this.proxy.taskType = tasktype;
        return this;
    }

    references(references: string): this {
        this.proxy.references = references;
        return this;
    }

    children(): this {
        return this;
    }

    override build(): T {
        this.layout('hbox').addLayoutOption('paddingRight', 10).add(this.createCompartmentIcon()).add(this.createCompartmentHeader());
        return super.build();
    }

    protected createCompartmentHeader(): GLabel {
        return new GLabelBuilder(GLabel)
            .type(ModelTypes.LABEL_HEADING)
            .id(this.proxy.id + '_classname')
            .text(this.proxy.name)
            .build();
    }

    protected createCompartmentIcon(): GCompartment {
        return GCompartment.builder()
            .id(this.proxy.id + '_icon')
            .type(ModelTypes.ICON)
            .build();
    }
}

export class WeightedEdge extends GEdge {
    probability?: string;

    static override builder(): WeightedEdgeBuilder {
        return new WeightedEdgeBuilder(WeightedEdge).type(ModelTypes.WEIGHTED_EDGE);
    }
}

export class WeightedEdgeBuilder<E extends WeightedEdge = WeightedEdge> extends GEdgeBuilder<E> {
    probability(probability: string): this {
        this.proxy.probability = probability;
        return this;
    }
}

export class Category extends ActivityNode {
    name: string;

    static override builder(): CategoryNodeBuilder {
        return new CategoryNodeBuilder(Category)
            .layout('vbox')
            .addLayoutOptions({ hAlign: 'center', hGrab: false, vGrab: false })
            .addCssClass('category');
    }
}

export class CategoryNodeBuilder<T extends Category = Category> extends ActivityNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    children(): this {
        this.proxy.children.push(this.createLabelCompartment());
        this.proxy.children.push(this.createStructCompartment());
        return this;
    }

    protected createLabelCompartment(): GCompartment {
        const layoutOptions: Args = {};
        return new GCompartmentBuilder(GCompartment)
            .type(ModelTypes.COMP_HEADER)
            .id(this.proxy.id + '_header')
            .layout('hbox')
            .addLayoutOptions(layoutOptions)
            .add(this.createCompartmentHeader())
            .build();
    }

    protected createCompartmentHeader(): GLabel {
        return new GLabelBuilder(GLabel)
            .type(ModelTypes.LABEL_HEADING)
            .id(this.proxy.id + '_classname')
            .text(this.proxy.name)
            .build();
    }

    protected createStructCompartment(): GCompartment {
        return new GCompartmentBuilder(GCompartment)
            .type(ModelTypes.STRUCTURE)
            .id(this.proxy.id + '_struct')
            .layout('freeform')
            .addLayoutOptions({ hAlign: 'left', hGrab: true, vGrab: true })
            .build();
    }
}
