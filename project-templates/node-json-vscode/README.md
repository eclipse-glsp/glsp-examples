# Eclipse GLSP - Project Template: 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ VS Code

This folder contains a simple *project template* to get you started quickly for your diagram editor implementation based on [GLSP](https://github.com/eclipse-glsp/glsp).
It provides the initial setup of the package architecture and environment for a GLSP diagram editor that uses ...

*   🖥️ The [Node-based GLSP server framework](https://github.com/eclipse-glsp/glsp-server-node)
*   🗂️ A custom JSON format as source model
*   🖼️ The [VS Code integration](https://github.com/eclipse-glsp/glsp-vscode-integration) to make your editor available in VS Code

To explore alternative project templates or learn more about developing GLSP-based diagram editors, please refer to the [Getting Started](https://www.eclipse.org/glsp/documentation/gettingstarted) guide.

## Project structure

This project is structured as follows:

*   [`glsp-client`](glsp-client)
    *   [`tasklist-glsp`](glsp-client/tasklist-glsp): diagram client configuring the views for rendering and the user interface modules
    *   [`tasklist-vscode`](glsp-client/tasklist-vscode): glue code for integrating the editor into VS Code
        *   [`extension`](glsp-client/tasklist-vscode/extension): VS Code extension responsible for starting the glsp-server and registering the `webview` as a custom editor
        *   [`webview`](glsp-client/tasklist-vscode/webview): integration of the `tasklist-glsp` diagram as webview
    *   [`workspace`](glsp-client/workspace): contains an example file that can be opened with this diagram editor
*   [`glsp-server`](glsp-server)
    *   [`src/diagram`](glsp-server/src/diagram): dependency injection module of the server and diagram configuration
    *   [`src/handler`](glsp-server/src/handler): handlers for the diagram-specific actions
    *   [`src/model`](glsp-server/src/model): all source model, graphical model and model state related files

The most important entry points are:

*   [`glsp-client/tasklist-glsp/src/di.config.ts`](glsp-client/tasklist-glsp/src/di.config.ts): dependency injection module of the client
*   [`glsp-client/tasklist-vscode/extension/package.json`](glsp-client/tasklist-vscode/extension/package.json): VS Code extension entry point
*   [`glsp-server/src/diagram/tasklist-diagram-module.ts`](glsp-server/src/diagram/tasklist-diagram-module.ts): dependency injection module of the server

## Prerequisites

The following libraries/frameworks need to be installed on your system:

*   [Node.js](https://nodejs.org/en/) `>= 12.14.1`
*   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`

## VS Code workspace

To work with the source code and debug the example in VS Code a dedicated [VS Code Workspace](node-vscode-json.code-workspace) is provided.
These workspace include both the `glsp-client` and `glsp-server` sources and offer dedicated launch configurations for debugging purposes.

To open the workspace start a VS Code instance and use the `Open Workspace from File..` entry from the `File` menu.
Then navigate to the directory containing the workspace file  and open the `node-vscode-json.code-workspace` file.

For a smooth development experience we recommend a set of useful VS Code extensions. When the workspace is first opened VS Code will ask you wether you want to install those recommended extensions.
Alternatively, you can also open the `Extension View` (Ctrl + Shift + X) and type `@recommended` into the search field to see the list of `Workspace Recommendations`.

## Building the example

The server component and the client component have to be built using yarn. A convenience script to build both is provided.
To build all components execute the following in the directory containing this README:

```bash
yarn build
```

In addition, it is also possible to build each component individually:

```bash
# Build only the glsp-client
yarn build:client

# Build only glsp-server
yarn build:server
```

## Running the examples

To start the example open a the corresponding [VS Code workspace](node-vscode-json.code-workspace) and then navigate to the Run and Debug view (Ctrl + Shift + D).
Here you can choose between four different debug configurations:

*   `Launch Tasklist Diagram Extension`: <br>
    This config can be used to launch a second VS Code runtime instance that has the `Tasklist Diagram Extension` installed.
    It will automatically open an example workspace that contains a `example.tasklist` file. Double-click the file in the `Explorer` to open it with the `Tasklist Diagram Editor`.
    This launch config will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
*   `Launch Tasklist Diagram Extension (External GLSP Server)`<br>
    Similar to the `Launch Tasklist Diagram Extension` but does not start the GLSP server as embedded process.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch Tasklist GLSP Server` config.
*   `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the `Tasklist GLSP Server` node process.
    Breakpoints the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the `Tasklist Diagram Extension` has to be launched in `External` server mode.
*   `Launch Tasklist Diagram extension with external GLSP Server`<br>
    This is a convenience compound config that launches both the `Tasklist Diagram Extension` in external server mode and the
    `Tasklist GLSP server` process.
    Enables debugging of both the `glsp-client` and `glsp-server`code simultaneously.

## Next steps

Once you are up and running with this project template, we recommend to refer to the [Getting Started](https://www.eclipse.org/glsp/documentation) to learn how to

*   ➡️ Add your custom [source model](https://www.eclipse.org/glsp/documentation/sourcemodel) instead of using the example model
*   ➡️ Define the diagram elements to be generated from the source model into the [graphical model](https://www.eclipse.org/glsp/documentation/gmodel)
*   ➡️ Make the diagram look the way you want by adjusting the [diagram rendering and styling](https://www.eclipse.org/glsp/documentation/rendering)

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
