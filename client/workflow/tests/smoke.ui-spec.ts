/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
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
import { expect } from "chai";

import FileExplorerView from "./common/file-explorer-view";
import { getWorkspaceRoot } from "./common/util";


describe('Smoke test', () => {
    before(() => {
        FileExplorerView.openView();
        FileExplorerView.openFile(getWorkspaceRoot(), 'example1.wf');
    });
    it('initial model is correct', () => {
        const editor = browser.$('#workflow-diagram_0.sprotty');
        const graph = editor.$('.sprotty-graph');

        const nodes = graph.$$('.sprotty-node');
        const edges = graph.$$('g.sprotty-edge');

        expect(nodes.length).to.be.equal(14, 'Number of Nodes does not match!');
        expect(edges.length).to.be.equal(16, 'Number of Edges does not match!');
    });

    it('can create a task', () => {
        const editor = browser.$('#workflow-diagram_0.sprotty');
        const toolPalette = editor.$('.tool-palette');
        toolPalette.$('.tool-button').click();

        const graph = editor.$('.sprotty-graph');
        const nodesInitial = graph.$$('.sprotty-node');

        graph.moveTo({ xOffset: 100, yOffset: 400 });
        graph.click();

        browser.waitUntil(() => graph.$$('.sprotty-node').length > nodesInitial.length);

        const nodes = graph.$$('.sprotty-node');

        expect(nodes.length).to.be.equal(nodesInitial.length + 1, 'Number of Nodes after creation should does not match!');
    });

    it('can rename a task', () => {
        const editor = browser.$('#workflow-diagram_0.sprotty');

        const graph = editor.$('.sprotty-graph');

        const nodeGroup = graph.$('#workflow-diagram_0_task0');
        nodeGroup.doubleClick();

        browser.waitUntil(() => editor.$('.label-edit').isDisplayed());

        const input = editor.$('.label-edit > input');
        input.setValue('Foo');
        browser.keys('Enter');

        browser.waitUntil(() => !editor.$('.label-edit').isDisplayed());

        const nodeText = nodeGroup.$('#workflow-diagram_0_task0_classname').getHTML(false);
        expect(nodeText).to.be.equal('Foo', 'The rename of the node failed!');
    });
});
