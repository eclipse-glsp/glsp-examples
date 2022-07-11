# Eclipse GLSP - Project Template:<br> 🖥️ Java ● 🗂️ EMF ● 🖼️ Theia

This folder contains a simple _project template_ to get you started quickly for your diagram editor implementation based on [GLSP](https://github.com/eclipse-glsp/glsp).
It provides the initial setup of the package architecture and environment for a GLSP diagram editor that uses ...

-   🖥️ The [Java GLSP server framework](https://github.com/eclipse-glsp/glsp-server)
-   🗂️ An [EMF](https://www.eclipse.org/modeling/emf/)-based source model
-   🖼️ The [Theia integration](https://github.com/eclipse-glsp/glsp-theia-integration) to make your editor available as Theia application

To explore alternative project templates or learn more about developing GLSP-based diagram editors, please refer to the [Getting Started](https://www.eclipse.org/glsp/documentation/gettingstarted) guide.

## Project structure

This project is structured as follows:

-   [`glsp-client`](glsp-client)
    -   [`tasklist-browser-app`](glsp-client/tasklist-browser-app): browser client application that integrates the basic Theia plugins and the tasklist specific glsp plugins
    -   [`tasklist-glsp`](glsp-client/tasklist-glsp): diagram client configuring the views for rendering and the user interface modules
    -   [`tasklist-theia`](glsp-client/tasklist-theia): glue code for integrating the editor into Theia
    -   [`workspace`](glsp-client/workspace): contains an example file that can be opened with this diagram editor
-   [`glsp-server`](glsp-server)
    -   [`src`](glsp-server/src): dependency injection module of the server and diagram configuration
    -   [`src/handler`](glsp-server/src/handler): handlers for the diagram-specific actions
    -   [`src/model`](glsp-server/src/model): all source model, graphical model and model state related files
    -   [`src/launch`](glsp-server/src/launch): contains the Java GLSP server launcher
    -   [`src/palette`](glsp-server/src/launch): custom palette item provider

The most important entry points are:

-   [`glsp-client/tasklist-glsp/src/di.config.ts`](glsp-client/tasklist-glsp/src/di.config.ts): dependency injection module of the client
-   [`glsp-client/tasklist-browser-app/package.json`](glsp-client/tasklist-browser-app/package.json): Theia browser application definition
-   [`glsp-server/src/main/java/org/eclipse/glsp/example/javaemf/TaskListDiagramModule.java`](glsp-server/src/main/java/org/eclipse/glsp/example/javaemf/TaskListDiagramModule.java): dependency injection module of the server

> **_NOTE:_**&nbsp; Due to bug [GLSP-666](https://github.com/eclipse-glsp/glsp/issues/666) the launch configurations for the `Theia Backend` might not work as expected when using Windows. Unfortunately there is currently no work-around and if you encounter this bug you won't be able to debug the Theia backed.

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>= 12.14.1`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`
-   [Java](https://adoptium.net/temurin/releases) `>=11`
-   [Maven](https://maven.apache.org/) `>=3.6.0`

The examples are heavily interweaved with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Theia Version compatibility

This project template is implemented in `1.25.0` (and compatible with Theia `<=1.26.0`). Versions `>=1.27.0` are currently not supported, but we are working to provide a fix as soon as possible (for more information please see <https://github.com/eclipse-glsp/glsp-theia-integration>).

## VS Code workspace

For both the client and the server part of this example we use [Visual Studio Code](https://code.visualstudio.com/).
It is of course possible to use the [Eclipse IDE](https://www.eclipse.org/ide/) for the server or any other IDE or text editor.

To work with and debug the source code in VS Code a dedicated [VS Code Workspace](java-emf-theia-example.code-workspace) is provided.
This workspace includes both the `glsp-client` and `glsp-server` sources and offers dedicated launch configurations to run and debug the example application.

To open the workspace start a VS Code instance and use the `Open Workspace from File..` entry from the `File` menu.
Then navigate to the directory containing the workspace file and open the `java-emf-theia-example.code-workspace` file.

For a smooth development experience we recommend a set of useful VS Code extensions. When the workspace is first opened VS Code will ask you wether you want to install those recommended extensions.
Alternatively, you can also open the `Extension View` (Ctrl + Shift + X) and type `@recommended` into the search field to see the list of `Workspace Recommendations`.

## Building the example

The server component is built with `maven` and the client component is built with `yarn`.
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

Or you can use the available VSCode tasks configured in the [workspace](java-emf-theia-example.code-workspace) (via Menu _Terminal > Run Task..._)

-   `Build TaskList GLSP Server`
-   `Build TaskList GLSP Client example`

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

To debug the involved components, the [VS Code workspace](java-emf-theia-example.code-workspace) offers launch configs, available in the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the `Tasklist GLSP Server` java process.
    Breakpoints in the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the Theia application backend has to be launched in `External` server mode (see `Launch TaskList Theia Backend (External GLSP Server)`).
    If the GLSP server is started via this launch config, it is possible to consume code changes immediately in the running instance via `Hot Code Replace` in the Debug toolbar.
-   `Launch TaskList Theia Backend (External GLSP Server)`<br>
    This config launches the Theia browser backend application but does not start the GLSP server as embedded process.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch Tasklist GLSP Server` config.
-   `Launch TaskList Theia Backend (Embedded GLSP Server)`<br>
    This config launches the Theia browser backend application and will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
-   `Launch TaskList Theia backed with external GLSP Server`<br>
    This is a convenience compound config that launches both the TaskList Theia backend in external server mode and the TaskList GLSP server process. Enables debugging of both the glsp-client and glsp-server code simultaneously.
-   `Launch Theia Frontend`<br>
    Launches a Google chrome instance, opens the Theia browser application at `http://localhost:3000` and will automatically open an example workspace that contains a `example.tasklist` file.
    Double-click the file in the `Explorer` to open it with the `Tasklist Diagram Editor`.
    Breakpoints in the source files of the `glsp-client/**/browser` directories will be picked up.

### Watch the TypeScript packages

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them via CLI:

```bash
yarn watch
```

or the VSCode task `Watch TaskList GLSP Client example`.

## Next steps

Once you are up and running with this project template, we recommend to refer to the [Getting Started](https://www.eclipse.org/glsp/documentation) to learn how to

-   ➡️ Add your custom [source model](https://www.eclipse.org/glsp/documentation/sourcemodel) instead of using the example model
-   ➡️ Define the diagram elements to be generated from the source model into the [graphical model](https://www.eclipse.org/glsp/documentation/gmodel)
-   ➡️ Make the diagram look the way you want by adjusting the [diagram rendering and styling](https://www.eclipse.org/glsp/documentation/rendering)

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
