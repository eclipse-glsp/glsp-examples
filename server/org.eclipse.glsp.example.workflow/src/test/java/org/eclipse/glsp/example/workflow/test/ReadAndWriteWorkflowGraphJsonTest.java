/*******************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ******************************************************************************/
package org.eclipse.glsp.example.workflow.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileReader;
import java.io.IOException;
import java.util.Optional;

import org.eclipse.glsp.api.factory.GraphGsonConfiguratorFactory;
import org.eclipse.glsp.example.workflow.WorkflowGLSPModule;
import org.eclipse.glsp.example.workflow.utils.ModelTypes;
import org.eclipse.glsp.example.workflow.wfgraph.Icon;
import org.eclipse.glsp.example.workflow.wfgraph.TaskNode;
import org.eclipse.glsp.example.workflow.wfgraph.WfgraphFactory;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GLayoutOptions;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.gson.GGraphGsonConfigurator;
import org.eclipse.glsp.graph.util.GConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.google.inject.Guice;
import com.google.inject.Injector;

class ReadAndWriteWorkflowGraphJsonTest {

   private static final String RESOURCE_PATH = "src/test/resources/";

   private GGraphGsonConfigurator gsonConfigurator;

   @BeforeEach
   void initializeGsonConfigurator() {
      Injector injector = Guice.createInjector(new WorkflowGLSPModule());
      gsonConfigurator = injector.getInstance(GraphGsonConfiguratorFactory.class).create();
   }

   @Test
   void testReadingExampleWorkflowGraph() throws IOException {
      GGraph graph = loadResource("example.wf");

      TaskNode push = (TaskNode) getChildById(graph, "task1").get();
      assertEquals("Push", push.getName());
      assertEquals(30, push.getDuration());

      GCompartment pushHeader = (GCompartment) getChildById(push, "task1_header").get();
      Icon iconCompartement = (Icon) getChildById(pushHeader, "task1_icon").get();
      assertEquals("simulate-command", iconCompartement.getCommandId());
      assertEquals("center", iconCompartement.getLayoutOptions().getHAlign());
      assertEquals(false, iconCompartement.getLayoutOptions().isResizeContainer());

      GLabel labelIcon = (GLabel) getChildById(iconCompartement, "task1_ticon").get();
      assertEquals("M", labelIcon.getText());

      TaskNode chkWt = (TaskNode) getChildById(graph, "task2").get();
      assertEquals("ChkWt", chkWt.getName());
      assertEquals(10, chkWt.getDuration());
      assertEquals(200.0, chkWt.getPosition().getX());
      assertEquals(200.0, chkWt.getPosition().getY());
   }

   private Optional<GModelElement> getChildById(final GModelElement element, final String id) {
      return element.getChildren().stream().filter(e -> id.equals(e.getId())).findFirst();
   }

   private GGraph loadResource(final String file) throws IOException {
      Gson gson = gsonConfigurator.configureGsonBuilder(new GsonBuilder()).create();
      JsonReader jsonReader = new JsonReader(new FileReader(RESOURCE_PATH + file));
      return gson.fromJson(jsonReader, GGraph.class);
   }

   @Test
   void testWritingExampleWorkflowGraph() throws IOException {
      GGraph graph = GraphFactory.eINSTANCE.createGGraph();
      graph.setRevision(42);
      graph.setId("graphId");
      graph.setType("graph");

      TaskNode push = WfgraphFactory.eINSTANCE.createTaskNode();
      push.setId("task1");
      push.setName("Push");
      push.setExpanded(true);
      push.setDuration(30);
      push.setTaskType("manual");
      push.setLayout(GConstants.Layout.VBOX);
      GPoint pos = GraphFactory.eINSTANCE.createGPoint();
      pos.setX(10);
      pos.setY(200);
      push.setPosition(pos);
      push.setType(ModelTypes.AUTOMATED_TASK);

      GCompartment compHeader = GraphFactory.eINSTANCE.createGCompartment();
      compHeader.setType(ModelTypes.COMP_HEADER);
      compHeader.setLayout(GConstants.Layout.HBOX);
      compHeader.setId("task1_header");

      Icon icon = WfgraphFactory.eINSTANCE.createIcon();
      icon.setLayout("stack");
      GLayoutOptions layoutOptions = GraphFactory.eINSTANCE.createGLayoutOptions();
      layoutOptions.setResizeContainer(false);
      layoutOptions.setHAlign("center");
      icon.setLayoutOptions(layoutOptions);
      icon.setType(ModelTypes.ICON);
      compHeader.getChildren().add(icon);

      push.getChildren().add(compHeader);

      graph.getChildren().add(push);

      String expectedJson = "{"
         + "\"id\":\"graphId\","//
         + "\"children\":"//
         + "["//
         + "{\"name\":\"Push\","//
         + "\"expanded\":true,"//
         + "\"duration\":30,"//
         + "\"taskType\":\"manual\""//
         + ",\"id\":\"task1\""//
         + ",\"children\":"//
         + "["//
         + "{\"id\":\"task1_header\","//
         + "\"children\":"//
         + "["//
         + "{\"type\":\"icon\","//
         + "\"layout\":\"stack\","//
         + "\"layoutOptions\":"//
         + "{\"resizeContainer\":false,"//
         + "\"hAlign\":\"center\""//
         + "}"//
         + "}"//
         + "],"//
         + "\"type\":\"comp:header\","//
         + "\"layout\":\"hbox\""//
         + "}"//
         + "],"//
         + "\"type\":\"task:automated\","//
         + "\"position\":"//
         + "{\"x\":10.0,"//
         + "\"y\":200.0"//
         + "},"//
         + "\"layout\":\"vbox\"}],"//
         + "\"type\":\"graph\""//
         + ",\"revision\":42"//
         + "}";//

      JsonObject jsonGraph = writeToJson(graph).getAsJsonObject();
      assertEquals(new JsonParser().parse(expectedJson), jsonGraph);
   }

   private JsonElement writeToJson(final GGraph graph) {
      Gson gson = gsonConfigurator.configureGsonBuilder(new GsonBuilder()).create();
      return gson.toJsonTree(graph);
   }

}
