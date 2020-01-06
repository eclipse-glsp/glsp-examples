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
import "../css/diagram.css";
import "balloon-css/balloon.min.css";
import "sprotty/css/edit-label.css";

import {
    boundsModule,
    buttonModule,
    commandPaletteModule,
    configureModelElement,
    ConsoleLogger,
    contextMenuModule,
    decorationModule,
    defaultGLSPModule,
    defaultModule,
    DeleteContextMenuItemProvider,
    DiamondNodeView,
    edgeLayoutModule,
    editLabelFeature,
    ExpandButtonView,
    expandModule,
    exportModule,
    fadeModule,
    GLSP_TYPES,
    glspCommandPaletteModule,
    glspContextMenuModule,
    glspEditLabelValidationModule,
    GLSPGraph,
    glspMouseToolModule,
    glspSelectModule,
    hoverModule,
    HtmlRoot,
    HtmlRootView,
    labelEditModule,
    labelEditUiModule,
    layoutCommandsModule,
    LogLevel,
    modelHintsModule,
    modelSourceModule,
    NoCollisionMovementRestrictor,
    openModule,
    overrideViewerOptions,
    paletteModule,
    PreRenderedElement,
    PreRenderedView,
    requestResponseModule,
    RevealNamedElementActionProvider,
    routingModule,
    saveModule,
    SButton,
    SCompartment,
    SCompartmentView,
    SEdge,
    SGraphView,
    SLabel,
    SLabelView,
    SRoutingHandle,
    SRoutingHandleView,
    toolFeedbackModule,
    TYPES,
    validationModule,
    viewportModule,
    zorderModule
} from "@eclipse-glsp/client/lib";
import executeCommandModule from "@eclipse-glsp/client/lib/features/execute/di.config";
import { Container, ContainerModule } from "inversify";

import { ActivityNode, Icon, TaskNode, WeightedEdge } from "./model";
import { ForkOrJoinNodeView, IconView, TaskNodeView, WeightedEdgeView, WorkflowEdgeView } from "./workflow-views";

const workflowDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(GLSP_TYPES.IMovementRestrictor).to(NoCollisionMovementRestrictor).inSingletonScope();
    bind(TYPES.ICommandPaletteActionProvider).to(RevealNamedElementActionProvider);
    bind(TYPES.IContextMenuItemProvider).to(DeleteContextMenuItemProvider);
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', GLSPGraph, SGraphView);
    configureModelElement(context, 'task:automated', TaskNode, TaskNodeView);
    configureModelElement(context, 'task:manual', TaskNode, TaskNodeView);
    configureModelElement(context, 'label:heading', SLabel, SLabelView, { enable: [editLabelFeature] });
    configureModelElement(context, 'comp:comp', SCompartment, SCompartmentView);
    configureModelElement(context, 'comp:header', SCompartment, SCompartmentView);
    configureModelElement(context, 'label:icon', SLabel, SLabelView);
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView);
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView);
    configureModelElement(context, 'button:expand', SButton, ExpandButtonView);
    configureModelElement(context, 'routing-point', SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, 'volatile-routing-point', SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, 'edge', SEdge, WorkflowEdgeView);
    configureModelElement(context, 'edge:weighted', WeightedEdge, WeightedEdgeView);
    configureModelElement(context, 'icon', Icon, IconView);
    configureModelElement(context, 'activityNode:merge', ActivityNode, DiamondNodeView);
    configureModelElement(context, 'activityNode:decision', ActivityNode, DiamondNodeView);
    configureModelElement(context, 'activityNode:fork', ActivityNode, ForkOrJoinNodeView);
    configureModelElement(context, 'activityNode:join', ActivityNode, ForkOrJoinNodeView);
});

export default function createContainer(widgetId: string): Container {
    const container = new Container();

    container.load(decorationModule, validationModule, defaultModule, glspMouseToolModule, defaultGLSPModule, glspSelectModule, boundsModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule, labelEditModule, labelEditUiModule, glspEditLabelValidationModule,
        workflowDiagramModule, saveModule, executeCommandModule, toolFeedbackModule, modelHintsModule, contextMenuModule, glspContextMenuModule,
        commandPaletteModule, glspCommandPaletteModule, paletteModule, requestResponseModule, routingModule, edgeLayoutModule, zorderModule,
        layoutCommandsModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + "_hidden",
        needsClientLayout: true
    });

    return container;
}
