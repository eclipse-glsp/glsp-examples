# Eclipse GLSP - Project Template:<br> 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ Theia

## GLSP Server

This directory provides the initial setup of the package architecture and environment for a node based GLSP Server.
It is based on the `TaskList` example diagram language.

For more detailed instructions and information please confer to the [README](../README.md) in the parent directory.

## Building

To build the server package execute the following in the `glsp-server` directory:

```bash
yarn
```

## Running the example

To start the `TaskList` server process execute:

```bash
yarn start
```

## Debugging the example

To debug the GLSP Server a launch configuration is available in the `Run and Debug` view (Ctrl + Shift + D).

-   `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the `TaskList GLSP Server` node process.
    Breakpoints in the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the Theia application backend has to be launched in `External` server mode (see `Launch TaskList Theia Backend (External GLSP Server)`).

## Watching the example

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them execute:

```bash
yarn watch
```

## Using preconfigured tasks

Alternatively to executing these commands manually, you can also use the preconfigured VSCode tasks (via Menu _Terminal > Run Task..._):

-   `Build TaskList GLSP Server`
-   `Watch TaskList GLSP Server`
-   `StartTaskList GLSP Server`

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
