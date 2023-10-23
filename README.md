# Eclipse GLSP Examples [![Build Status](https://ci.eclipse.org/glsp/job/eclipse-glsp/job/glsp-examples/job/master/badge/icon)](https://ci.eclipse.org/glsp/job/eclipse-glsp/job/glsp-examples/job/master/)

This repository contains code examples that demonstrate how to build diagram editors with the [Graphical Language Server Platform (GLSP)](https://github.com/eclipse-glsp/glsp).
The examples are focused on the integration of GLSP editors with the cloud-based [Eclipse Theia IDE](https://github.com/theia-ide/theia) using the [GLSP Theia integration](https://github.com/eclipse-glsp/glsp-theia-integration) and the Java based [GLSP Server Framework](https://github.com/eclipse-glsp/glsp-server).

Each example is self-contained and provides both, an example diagram client (`glsp-client` directory) and its corresponding GLSP server (`glsp-server` directory).

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=16.11.0`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0 < 2.x.x`
-   [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) `>=17`
-   [Maven](https://maven.apache.org/) `>=3.6.0`

The examples are heavily interwoven with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

The web-based/client part of the examples has been developed using [Visual Studio Code](https://code.visualstudio.com/) and the server/java part has been developed with the [Eclipse IDE](https://www.eclipse.org/ide/).
However, it's of course also possible to use any other IDE or text editor.

## Examples

-   [Project Templates](project-templates): The best starting point for your own diagram editor project.
    The project templates are available for several combinations of tool platform integrations (Theia, VS Code), source models (JSON, EMF) and servers (Node, Java). Please visit the [GLSP documentation](https://www.eclipse.org/glsp/documentation/gettingstarted/) for more information.

-   [Workflow Example](workflow): A consistent example provided by all GLSP components.
    It implements a simple flow chart diagram editor with different types of nodes and edges.
    The `Workflow Example` is the main example used for development and integrates all GLSP features

    https://user-images.githubusercontent.com/588090/154459938-849ca684-11b3-472c-8a59-98ea6cb0b4c1.mp4

## Building the examples & project templates

To build all examples & project templates simply execute the following in the repository root:

```bash
yarn build
```

In addition, it is also possible to build each example or template individually:

```bash
yarn build:workflow
yarn build:java-emf-theia
yarn build:node-json-theia
yarn build:node-json-vscode
yarn build:java-emf-eclipse
```

## Running & Debugging the examples

Each example and project template contains a dedicated README with detailed instructions on how to run und debug them.

### Debugging the Jave GLSP Server in Eclipse

All Java example GLSP servers are maven projects which can be imported directly into the Eclipse IDE.
In contrast to the Java support in VS Code, Eclipse also offers Ecore tooling which is required to manipulate or extend the graph Ecore models (e.g. [`workflow-graph.ecore`](workflow/glsp-server/src/main/resources/workflow-graph.ecore).

We recommend to use the [`Eclipse Modeling Tools`](https://www.eclipse.org/downloads/packages/release/2023-09/r/eclipse-modeling-tools) package as it already provides most needed plugins out of the box.
Only the [`M2E` plugin](https://github.com/eclipse-m2e/m2e-core/blob/master/README.md#-installation) has to be installed on top to enable maven support in Eclipse.

Use the file menu to import a `glsp-server` maven project into the Workspace ( File -> Import... -> Maven -> Existing Maven Projects).
The projects also contain a launch configuration (`<ExampleName>ServerLauncher.launch`) to enable debugging via the `Run` menu.

## Integration with other platforms

The general GLSP Client code is separated from the Theia specific glue code and located in a dedicated package with `-glsp` prefix (e.g. `workflow-glsp`).
This package can be easily reused when the package should be integrated with any other platform.
In addition to the Theia integration, GLSP provides the following glue code frameworks:

-   [GLSP VS Code Integration](https://github.com/eclipse-glsp/glsp-vscode-integration)
-   [GLSP Eclipse IDE Integration](https://github.com/eclipse-glsp/glsp-eclipse-integration)

For a reference implementation of a example specific glue code package please checkout the `project templates`.

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).

## License

-   [Eclipse Public License 2.0](LICENSE-EPL)
-   [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](LICENSE-GPL)
-   [一 (Secondary) MIT License](LICENSE-MIT)
