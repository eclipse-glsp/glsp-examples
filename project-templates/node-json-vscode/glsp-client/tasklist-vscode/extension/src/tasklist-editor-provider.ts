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
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.01
 ********************************************************************************/
import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { GlspEditorProvider } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as vscode from 'vscode';

export default class TaskListEditorProvider extends GlspEditorProvider {
    diagramType = 'tasklist-diagram';

    constructor(
        protected readonly extensionContext: vscode.ExtensionContext,
        protected override readonly glspVscodeConnector: GlspVscodeConnector
    ) {
        super(glspVscodeConnector);
    }

    setUpWebview(
        _document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken,
        clientId: string
    ): void {
        const webview = webviewPanel.webview;
        const extensionUri = this.extensionContext.extensionUri;
        const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'pack', 'webview.js'));
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );

        webviewPanel.webview.options = {
            enableScripts: true
        };

        webviewPanel.webview.html = `
             <!DOCTYPE html>
             <html lang="en">
                 <head>
                     <meta charset="UTF-8">
                     <meta name="viewport" content="width=device-width, height=device-height">
                     <meta http-equiv="Content-Security-Policy" content="
                 default-src http://*.fontawesome.com  ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                 ">
                 <link href="${codiconsUri}" rel="stylesheet" />
 
                 </head>
                 <body>
                     <div id="${clientId}_container" style="height: 100%;"></div>
                     <script src="${webviewScriptSourceUri}"></script>
                 </body>
             </html>`;
    }
}
