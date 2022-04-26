# Eclipse GLSP - Node/JSON Model/VSCOde Integration Example

TODO Intro

TODO: short video clip

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>= 12.14.1`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`

### VSCode workspace

To work with the source code and debug the example in VS Code a dedicated [VSCode Workspace](node-vscode-json.code-workspace) is provided.
These workspace include both the `glsp-client` and `glsp-server` sources and offer dedicated launch configurations for debugging purposes.

To open the workspace simply start a VS Code instance and use the `Open Workspace from File..` entry from the `File` menu.
Then navigate to the directory containing the workspace file  and open the `node-vscode-json.code-workspace` file.

For a smooth development experience we recommend a set of useful VS Code extensions. When the workspace is first opened VS Code will ask you wether you want to install those recommended extensions.
Alternatively, you can also open the `Extension View`(Ctrl + Shift + X) and type `@recommended` into the search field to see the list of `Workspace Recommendations`.

## Building the example

The server component and the client component have to be built using yarn. A convenience script to build both is provided.
To build all components simply execute the following in the directory containing this README:

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

To start the example open a the corresponding [VSCode workspace](node-vscode-json.code-workspace) and then navigate to the Run and Debug view (Ctrl + Shift + D).
Here you can choose between four different debug configurations:

- `Launch Tasklist Diagram Extension`: <br>
    This config can be used to launch a second VSCode runtime instance that has the `Tasklist Diagram Extension` installed. 
    It will automatically open an example workspace that contains a `example.tasklist` file. Simply double click on the file in the `Explorer` to open the `Tasklist Diagram Editor`.
    This launch config will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
- `"Launch Tasklist Diagram Extension (External GLSP Server)`<br>
    Similar to the `Launch Tasklist Diagram Extension` but does not start the GLSP server as embedded process.
    It expects that the GLSP Server process is already running and has been started externally with the `Launch Tasklist GLSP Server` config.
- `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the `Tasklist GLSP Server` node process.
    Breakpoints the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the `Tasklist Diagram Extension` has to be launched in `External` server mode.
- `Launch Tasklist Diagram extension with external GLSP Server`<br>
    This is a convenience compound config that launches both the `Tasklist Diagram Extension` in external server mode and the
    `Tasklist GLSP server` process.
    Enables debugging of both the `glsp-client` and `glsp-server`code simultaneously.

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
