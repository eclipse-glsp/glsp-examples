# Eclipse GLSP - Workflow Example

This example shows a consistent example provided by all GLSP components.
It implements a simple flow chart diagram editor with different types of nodes and edges.
The `Workflow Example` is the main example used for development and integrates all GLSP features.

<https://user-images.githubusercontent.com/588090/154459938-849ca684-11b3-472c-8a59-98ea6cb0b4c1.mp4>

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=16.11.0`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0<2.x.x`
-   [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) `>=17`
-   [Maven](https://maven.apache.org/) `>=3.6.0`

The examples are heavily interweaved with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

The examples has been developed using [Visual Studio Code](https://code.visualstudio.com/).

## Theia Version compatibility

This project template is compatible with Theia `>=1.49.1`.

## Building the example

The example can be built with:

```bash
yarn
```

## Running the example

To start the Theia web app with the integrated workflow example simply run

```bash
yarn start
```

This will launch the example in the browser on [localhost:3000](http://localhost:3000).

It's also possible to start the Theia browser application in external mode. This means the `Workflow` GLSP server will not be started as an embedded process and is expected to be already running. This can be used for debugging purposes, where you first start the GLSP server in debug mode and let the Theia application connect to it:

```bash
yarn start:external
```

## Debugging the example

To debug the involved components launch configs are available in the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch Workflow Theia Backend (Embedded GLSP Server)`<br>
    This config launches the Theia browser backend application and will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
-   `Launch Workflow Theia Backend (External GLSP Server)`<br>
    This config launches the Theia browser backend application but does not start the GLSP server as embedded process.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch Workflow GLSP Server` config.
-   `Launch Theia Frontend`<br>
    Launches a Google chrome instance, opens the Theia browser application at `http://localhost:3000` and will automatically open an example workspace that contains a `example.wf` file.
    Double-click the file in the `Explorer` to open it with the `Workflow Diagram Editor`.
-   `Launch Workflow GLSP Server`<br>
    This config can be used to manually launch the TaskList GLSP Server node process. Breakpoints in the source files of the `workflow-server` package will be picked up. In order to use this config, the Theia application backend has to be launched in External server mode (see `Launch Workflow Theia Backend (External GLSP Server)`).

## Watching the example

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them execute:

```bash
yarn watch
```
