# Eclipse GLSP - Project Template:<br> 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ Theia

This folder contains a simple _project template_ to get you started quickly for your diagram editor implementation based on [GLSP](https://github.com/eclipse-glsp/glsp).
It provides the initial setup of the package architecture and environment for a GLSP diagram editor that uses ...

-   🖥️ The [Node-based GLSP server framework](https://github.com/eclipse-glsp/glsp-server-node)
-   🗂️ A custom JSON format as source model
-   🖼️ The [Theia integration](https://github.com/eclipse-glsp/glsp-theia-integration) to make your editor available in a Theia browser application

To explore alternative project templates or learn more about developing GLSP-based diagram editors, please refer to the [Getting Started](https://www.eclipse.org/glsp/documentation/gettingstarted) guide.

## Project structure

This project is structured as follows:

-   [`glsp-client`](glsp-client)
    -   [`tasklist-browser-app`](glsp-client/tasklist-browser-app): browser client application that integrates the basic Theia plugins and the tasklist specific glsp plugins
    -   [`tasklist-glsp`](glsp-client/tasklist-glsp): diagram client configuring the views for rendering and the user interface modules
    -   [`tasklist-theia`](glsp-client/tasklist-theia): glue code for integrating the editor into Theia
    -   [`workspace`](glsp-client/workspace): contains an example file that can be opened with this diagram editor
-   [`glsp-server`](glsp-server)
    -   [`src/diagram`](glsp-server/src/diagram): dependency injection module of the server and diagram configuration
    -   [`src/handler`](glsp-server/src/handler): handlers for the diagram-specific actions
    -   [`src/model`](glsp-server/src/model): all source model, graphical model and model state related files

The most important entry points are:

-   [`glsp-client/tasklist-glsp/src/di.config.ts`](glsp-client/tasklist-glsp/src/di.config.ts): dependency injection module of the client
-   [`glsp-client/tasklist-browser-app/package.json`](glsp-client/tasklist-browser-app/package.json): Theia browser application definition
-   [`glsp-server/src/diagram/tasklist-diagram-module.ts`](glsp-server/src/diagram/tasklist-diagram-module.ts): dependency injection module of the server

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=14.18.0`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`

The examples are heavily interweaved with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Theia Version compatibility

This project template is compatible with Theia `>=1.34.0`.

## VS Code workspace

To work with the source code and debug the example in VS Code a dedicated [VS Code Workspace](node-json-theia.code-workspace) is provided.
The workspace includes both the `glsp-client` and `glsp-server` sources and offers dedicated launch configurations to run and debug the example application.

To open the workspace start a VS Code instance and use the `Open Workspace from File..` entry from the `File` menu.
Then navigate to the directory containing the workspace file and open the `node-json-theia.code-workspace` file.

For a smooth development experience we recommend a set of useful VS Code extensions. When the workspace is first opened VS Code will ask you wether you want to install those recommended extensions.
Alternatively, you can also open the `Extension View` (Ctrl + Shift + X) and type `@recommended` into the search field to see the list of `Workspace Recommendations`.

## Building the example

The server component and the client component have to be built using `yarn`.
A convenience script to build both is provided.
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

## Running the example

To start the Theia browser application with the integrated tasklist example, navigate to the client directory

```bash
cd glsp-client
```

and then execute:

```bash
yarn start
```

This will launch the example in the browser with an embedded GLSP server on [localhost:3000](http://localhost:3000).

To debug the involved components, the [VS Code workspace](node-json-theia.code-workspace) offers launch configs, available in the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch TaskList GLSP Server`<br>
    This config can be used to manually launch the `TaskList GLSP Server` node process.
    Breakpoints in the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the Theia application backend has to be launched in `External` server mode (see `Launch TaskList Theia Backend (External GLSP Server)`).
-   `Launch TaskList Theia Backend (External GLSP Server)`<br>
    This config launches the Theia browser backend application but does not start the GLSP server as embedded process.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch TaskList GLSP Server` config.
-   `Launch TaskList Theia Backend (Embedded GLSP Server)`<br>
    This config launches the Theia browser backend application and will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
-   `Launch TaskList Theia backed with external GLSP Server`<br>
    This is a convenience compound config that launches both the Tasklist Theia backend in external server mode and the Tasklist GLSP server process. Enables debugging of both the glsp-client and glsp-server code simultaneously.
-   `Launch Theia Frontend`<br>
    Launches a Google chrome instance, opens the Theia browser application at `http://localhost:3000` and will automatically open an example workspace that contains a `example.tasklist` file.
    Double-click the file in the `Explorer` to open it with the `Tasklist Diagram Editor`.
    Breakpoints in the source files of the `glsp-client/**/browser` directories will be picked up.

## Next steps

Once you are up and running with this project template, we recommend to refer to the [Getting Started](https://www.eclipse.org/glsp/documentation) to learn how to

-   ➡️ Add your custom [source model](https://www.eclipse.org/glsp/documentation/sourcemodel) instead of using the example model
-   ➡️ Define the diagram elements to be generated from the source model into the [graphical model](https://www.eclipse.org/glsp/documentation/gmodel)
-   ➡️ Make the diagram look the way you want by adjusting the [diagram rendering and styling](https://www.eclipse.org/glsp/documentation/rendering)

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
