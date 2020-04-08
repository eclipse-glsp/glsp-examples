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
import BaseSidePanelView from "./base-sidepanel-view";
import { normalizeId } from "./util";


class FileExplorerView extends BaseSidePanelView {

    public get tabIconSelector(): string { return normalizeId('#shell-tab-explorer-view-container'); }

    private getWorkspaceNodeId(workspace: string): string {
        return normalizeId('#' + workspace + ':' + workspace);
    }

    private getFileNodeId(workspace: string, fileName: string): string {
        return this.getWorkspaceNodeId(workspace) + normalizeId('/' + fileName);
    }

    public openFile(workspace: string, fileName: string): void {
        const folders = fileName.split('/');
        folders.forEach((folder, index) => {
            if (index === folders.length - 1) {
                return;
            }
            const node = $(this.getFileNodeId(workspace, folder));
            node.waitForExist();
            node.click();
        });

        // open file
        const file = $(this.getFileNodeId(workspace, fileName));
        file.waitForExist();
        file.click();
        // wait for editor being initialized
        browser.pause(1500);
    }
}

export default new FileExplorerView();
