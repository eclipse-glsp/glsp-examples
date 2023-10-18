# Eclipse GLSP - Project Template:<br> 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ Theia

This folder contains a simple _project template_ to get you started quickly for your diagram editor implementation based on [GLSP](https://github.com/eclipse-glsp/glsp).
It provides the initial setup of the package architecture and environment for a GLSP diagram editor that uses ...

-   🖥️ The [Node-based GLSP server framework](https://github.com/eclipse-glsp/glsp-server-node)
-   🗂️ A custom JSON format as source model
-   🖼️ The [Theia integration](https://github.com/eclipse-glsp/glsp-theia-integration) to make your editor available in a Theia browser application

To explore alternative project templates or learn more about developing GLSP-based diagram editors, please refer to the [Getting Started](https://www.eclipse.org/glsp/documentation/gettingstarted) guide.

## Project structure

This project is structured as follows:

-   [`tasklist-browser-app`](./tasklist-browser-app): browser client application that integrates the basic Theia plugins and the tasklist specific glsp plugins
-   [`tasklist-glsp-client`](./tasklist-glsp-client): diagram client configuring the views for rendering and the user interface modules
-   [`tasklist-theia`](./tasklist-theia): glue code for integrating the editor into Theia
-   [`workspace`](./workspace): contains an example file that can be opened with this diagram editor
-   [`tasklist-glsp-server`](./tasklist-glsp-server):
    -   [`src/diagram`](./tasklist-glsp-server/src/diagram): dependency injection module of the server and diagram configuration
    -   [`src/handler`](./tasklist-glsp-server/src/handler): handlers for the diagram-specific actions
    -   [`src/model`](./tasklist-glsp-server/src/model): all source model, graphical model and model state related files

The most important entry points are:

-   [`tasklist-glsp-client/src/tasklist-diagram-module.ts`](./tasklist-glsp-client/src/tasklist-diagram-module.ts): dependency injection module of the client
-   [`tasklist-browser-app/package.json`](tasklist-browser-app/package.json): Theia browser application definition
-   [`tasklist-glsp-server/src/diagram/tasklist-diagram-module.ts`](./tasklist-glsp-server/src/diagram/tasklist-diagram-module.ts): dependency injection module of the server

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=16.11.0`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0 <2.x.x"`

The examples are heavily interweaved with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Theia Version compatibility

This project template is compatible with Theia `>=1.39.0`.

## Building the example

The server component and the client component have to be built using `yarn`.
A convenience script to build both is provided.
To build all components execute the following in the directory containing this README:

```bash
yarn
```

## Running the example

To start the Theia browser application with the integrated tasklist server, execute

```bash
yarn start
```

This will launch the example in the browser with an embedded GLSP server on [localhost:3000](http://localhost:3000).

It's also possible to start the Theia browser application in external mode. This means the `TaskList` GLSP server will not be started as an embedded process and is expected to be already running. This can be used for debugging purposes, where you first start the GLSP server in debug mode and let the Theia application connect to it:

```bash
yarn start:external
```

## Debugging the example

To debug the involved components launch configs are available in the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch TaskList Theia Backend (External GLSP Server)`<br>
    This config launches the Theia browser backend application but does not start the GLSP server as embedded process.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch TaskList GLSP Server` config.
-   `Launch TaskList Theia backed with external GLSP Server`<br>
    This is a convenience compound config that launches both the Tasklist Theia backend in external server mode and the Tasklist GLSP server process. Enables debugging of both the glsp-client and glsp-server code simultaneously.
-   `Launch Theia Frontend`<br>
    Launches a Google chrome instance, opens the Theia browser application at `http://localhost:3000` and will automatically open an example workspace that contains a `example.tasklist` file.
    Double-click the file in the `Explorer` to open it with the `Tasklist Diagram Editor`.
    Breakpoints in the source files of the `glsp-client/**/browser` directories will be picked up.
-   `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the TaskList GLSP Server node process. Breakpoints in the source files of the `tasklist-glsp-server` package will be picked up. In order to use this config, the Theia application backend has to be launched in External server mode (see `Launch TaskList Theia Backend (External GLSP Server)`).

## Watching the example

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them execute:

```bash
yarn watch
```

## Next steps

Once you are up and running with this project template, we recommend to refer to the [Getting Started](https://www.eclipse.org/glsp/documentation) to learn how to

-   ➡️ Add your custom [source model](https://www.eclipse.org/glsp/documentation/sourcemodel) instead of using the example model
-   ➡️ Define the diagram elements to be generated from the source model into the [graphical model](https://www.eclipse.org/glsp/documentation/gmodel)
-   ➡️ Make the diagram look the way you want by adjusting the [diagram rendering and styling](https://www.eclipse.org/glsp/documentation/rendering)

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
