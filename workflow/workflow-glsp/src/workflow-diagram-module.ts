/********************************************************************************
 * Copyright (c) 2019-2023 EclipseSource and others.
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
    ConsoleLogger,
    ContainerConfiguration,
    DefaultTypes,
    DeleteElementContextMenuItemProvider,
    DiamondNodeView,
    GCompartment,
    GCompartmentView,
    GEdge,
    GGraph,
    GLSPProjectionView,
    GLabel,
    GLabelView,
    GridSnapper,
    LogLevel,
    RectangularNodeView,
    RevealNamedElementActionProvider,
    RoundedCornerNodeView,
    StructureCompartmentView,
    TYPES,
    bindAsService,
    bindOrRebind,
    configureDefaultModelElements,
    configureModelElement,
    editLabelFeature,
    initializeDiagramContainer
} from '@eclipse-glsp/client';
import 'balloon-css/balloon.min.css';
import { Container, ContainerModule } from 'inversify';
import 'sprotty/css/edit-label.css';
import '../css/diagram.css';
import { directTaskEditor } from './direct-task-editing/di.config';
import { ActivityNode, CategoryNode, Icon, TaskNode, WeightedEdge } from './model';
import { IconView, WorkflowEdgeView } from './workflow-views';

export const workflowDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    bindOrRebind(context, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    bindOrRebind(context, TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(TYPES.ISnapper).to(GridSnapper);
    bindAsService(context, TYPES.ICommandPaletteActionProvider, RevealNamedElementActionProvider);
    bindAsService(context, TYPES.IContextMenuItemProvider, DeleteElementContextMenuItemProvider);

    configureDefaultModelElements(context);
    configureModelElement(context, 'task:automated', TaskNode, RoundedCornerNodeView);
    configureModelElement(context, 'task:manual', TaskNode, RoundedCornerNodeView);
    configureModelElement(context, 'label:heading', GLabel, GLabelView, { enable: [editLabelFeature] });
    configureModelElement(context, 'comp:comp', GCompartment, GCompartmentView);
    configureModelElement(context, 'comp:header', GCompartment, GCompartmentView);
    configureModelElement(context, 'label:icon', GLabel, GLabelView);
    configureModelElement(context, DefaultTypes.EDGE, GEdge, WorkflowEdgeView);
    configureModelElement(context, 'edge:weighted', WeightedEdge, WorkflowEdgeView);
    configureModelElement(context, 'icon', Icon, IconView);
    configureModelElement(context, 'activityNode:merge', ActivityNode, DiamondNodeView);
    configureModelElement(context, 'activityNode:decision', ActivityNode, DiamondNodeView);
    configureModelElement(context, 'activityNode:fork', ActivityNode, RectangularNodeView);
    configureModelElement(context, 'activityNode:join', ActivityNode, RectangularNodeView);
    configureModelElement(context, DefaultTypes.GRAPH, GGraph, GLSPProjectionView);
    configureModelElement(context, 'category', CategoryNode, RoundedCornerNodeView);
    configureModelElement(context, 'struct', GCompartment, StructureCompartmentView);
});

export function createWorkflowDiagramContainer(...containerConfiguration: ContainerConfiguration): Container {
    return initializeWorkflowDiagramContainer(new Container(), ...containerConfiguration);
}

export function initializeWorkflowDiagramContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
    return initializeDiagramContainer(container, workflowDiagramModule, directTaskEditor, ...containerConfiguration);
}
