# Eclipse GLSP - Project Template:<br> 🖥️ Java ● 🗂️ EMF ● 🖼️ Eclipse

This folder contains a simple _project template_ to get you started quickly for your diagram editor implementation based on [GLSP](https://github.com/eclipse-glsp/glsp).
It provides the initial setup of the package architecture and environment for a GLSP diagram editor that uses ...

-   🖥️ The [Java GLSP server framework](https://github.com/eclipse-glsp/glsp-server)
-   🗂️ An [EMF](https://www.eclipse.org/modeling/emf/)-based source model
-   🖼️ The [Eclipse integration](https://github.com/eclipse-glsp/glsp-eclipse-integration) to make your editor available in Eclipse RCP

To explore alternative project templates or learn more about developing GLSP-based diagram editors, please refer to the [Getting Started](https://www.eclipse.org/glsp/documentation/gettingstarted) guide.

## Project structure

This project is structured as follows:

-   [`glsp-client`](glsp-client)
    -   [`tasklist-glsp`](glsp-client/tasklist-glsp): diagram client configuring the views for rendering and the user interface modules
    -   [`tasklist-eclipse`](glsp-client/tasklist-eclipse): glue code for integrating the editor into Eclipse
-   [`glsp-server`](glsp-server)
    -   [`org.eclipse.glsp.example.javaemf.server`](glsp-server/org.eclipse.glsp.example.javaemf.server/): GLSP server for the Tasklist diagram language
        -   [`src`](glsp-server/org.eclipse.glsp.example.javaemf.server/src/org/eclipse/glsp/example/javaemf/server/): dependency injection module of the server and diagram configuration
        -   [`src/handler`](glsp-server/org.eclipse.glsp.example.javaemf.server/src/org/eclipse/glsp/example/javaemf/server/handler/): handlers for the diagram-specific actions
        -   [`src/model`](glsp-server/org.eclipse.glsp.example.javaemf.server/src/org/eclipse/glsp/example/javaemf/server/model): all source model, graphical model and model state related files
        -   [`src/launch`](glsp-server/org.eclipse.glsp.example.javaemf.server/src/org/eclipse/glsp/example/javaemf/server/launch): contains the Java GLSP server launcher
        -   [`src/palette`](glsp-server/org.eclipse.glsp.example.javaemf.server/src/org/eclipse/glsp/example/javaemf/server/palette/): custom palette item provider
    -   [`org.eclipse.glsp.example.javaemf.editor](glsp-server/org.eclipse.glsp.example.javaemf.editor/): plugin providing the Eclipse Tasklist diagram editor
    -   [`workspace/TaskListExample](glsp-server/workspace/TaskListExample/) A sample eclipse project containing a Tasklist diagram.

The most important entry points are:

-   [`glsp-client/tasklist-glsp/src/tasklist-diagram-module.ts`](glsp-client/tasklist-glsp/src/tasklist-diagram-module.ts) dependency injection module of the client
-   [`glsp-client/tasklist-eclipse/src/app`](glsp-client/tasklist-eclipse/src/app.ts): Browser application bundle
-   [`glsp-server/org.eclipse.glsp.example.javaemf.editor/src/org/eclipse/glsp/example/javaemf/editor/TaskListEclipseDiagramModule.java`](glsp-server/org.eclipse.glsp.example.javaemf.editor/src/org/eclipse/glsp/example/javaemf/editor/TaskListEclipseDiagramModule.java): dependency injection module of the Eclipse ide integration
-   [`glsp-server/org.eclipse.glsp.example.javaemf.editor/src/org/eclipse/glsp/example/javaemf/editor/TaskListServerManager.java`](glsp-server/org.eclipse.glsp.example.javaemf.editor/src/org/eclipse/glsp/example/javaemf/editor/TaskListServerManager.java): the server manager counterpart for the Tasklist editor
-   [`glsp-server/org.eclipse.glsp.example.javaemf.editor/plugin.xml`](glsp-server/org.eclipse.glsp.example.javaemf.editor/plugin.xml): plugin definition declaring the diagram editor extensions.
-   [`glsp-server/org.eclipse.glsp.example.javaemf.target/r2021-03.targe`](glsp-server/org.eclipse.glsp.example.javaemf.target/r2021-03.target): the target platform definition

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=20`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0 < 2`
-   [Java](https://adoptium.net/temurin/releases) `>=17`
-   [Maven](https://maven.apache.org/) `>=3.6.0`

## VS Code workspace

For the client part of this example we use [Visual Studio Code](https://code.visualstudio.com/).
It is of course possible to use the [Eclipse IDE](https://www.eclipse.org/ide/) for the server or any other IDE or text editor.

To open the client code start a VS Code instance and use the `Open Folder...` entry from the `File` menu.
Then open the [`glsp-client`](glsp-client/) directory.

For a smooth development experience we recommend a set of useful VS Code extensions. When the workspace is first opened VS Code will ask you wether you want to install those recommended extensions.
Alternatively, you can also open the `Extension View` (Ctrl + Shift + X) and type `@recommended` into the search field to see the list of `Workspace Recommendations`.

## Eclipse workspace

The server/editor part consists of a set of [Eclipse](https://www.eclipse.org/ide/) plugins that have to be imported into your Eclipse IDE workspace.
Open an Eclipse instance and workspace of your choice then open the import menu (`File -> Import...`).
Choose `Maven -> Existing Maven Projects` and click `Next >`.
Select the parent directory of this README as `Root Directory`. Make sure that all
projects are selected and click finish.

To resolve all compilation errors you have to set the correct target platform.
Got to the preferences (`Window -> Preferences`) and navigate to the target platform options (`Plug-in Development -> Target Platform`)-
Selected the `2023-09-Release` target definition and click `Apply`.
Once the target platform has been resolved there should be no more compilation errors.

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

Or you can use the available VS Code tasks configured in the [glsp-client](glsp-client/) (via Menu _Terminal > Run Task..._)

-   `Build TaskList GLSP Client example`
-   `Copy TaskList GLSP Client bundle`

## Running/Debugging the example

To test the Tasklist diagram editor a launch configuration is provided. In your [Eclipse Workspace](#eclipse-workspace) navigate to the
`org.eclipse.glsp.example.javaemf.editor` plugin. Start or debug the example by via right-clicking on the `TaskListEditor.launch` file (`Run as -> TaskListEditor`).

This opens a second instance of Eclipse, which has the GLSP task list editor plugins preinstalled.
Import the provided [`example project`](glsp-server/workspace/TaskListExample/) into this workspace and double click on the `example.tasklist` file to open the diagram editor.

## Next steps

Once you are up and running with this project template, we recommend to refer to the [Getting Started](https://www.eclipse.org/glsp/documentation) to learn how to

-   ➡️ Add your custom [source model](https://www.eclipse.org/glsp/documentation/sourcemodel) instead of using the example model
-   ➡️ Define the diagram elements to be generated from the source model into the [graphical model](https://www.eclipse.org/glsp/documentation/gmodel)
-   ➡️ Make the diagram look the way you want by adjusting the [diagram rendering and styling](https://www.eclipse.org/glsp/documentation/rendering)

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
