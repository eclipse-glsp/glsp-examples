# Eclipse GLSP - Project Template:<br> 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ VS Code

## GLSP Client

This directory provides the initial setup of the package architecture and environment for a GLSP Client that is integrated into a VSCode extension.
It is based on the `TaskList` example diagram language.

For more detailed instructions and information please checkout the [general README](../README.md) in the parent directory.

## Building

To build all GLSP client packages simply execute the following in the `glsp-client` directory:

```bash
yarn
```

## Running the examples

To start the example open the corresponding [VS Code workspace](node-json-vscode.code-workspace) and then navigate to the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch TaskList Diagram Extension`: <br>
    This config can be used to launch a second VS Code runtime instance that has the `Tasklist Diagram Extension` installed.
    It will automatically open an example workspace that contains a `example.tasklist` file. Double-click the file in the `Explorer` to open it with the `TaskList Diagram Editor`.
    This launch config will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
-   `Launch TaskList Diagram Extension (External GLSP Server)`<br>
    Similar to the `Launch TaskList Diagram Extension` but does not start the GLSP server as embedded process.
    It expects that the GLSP Server process is already running and has been started externally.

## Watching the example

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them execute:

```bash
yarn watch
```

## Using preconfigured tasks

Alternatively to executing these commands manually, you can also use the preconfigured VSCode tasks (via Menu _Terminal > Run Task..._):

-   `Build TaskList Diagram Extension`
-   `Watch TaskList Diagram Extension`

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
