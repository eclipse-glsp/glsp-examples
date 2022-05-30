# Eclipse GLSP - Project Template:<br> 🖥️ Java ● 🗂️ EMF ● 🖼️ Theia

## GLSP Client

This directory provides the initial setup of the package architecture and environment for a GLSP Client that is integrated into a Theia browser application.
It is based on the `TaskList` example diagram language.

For more detailed instructions and information please confer to the [README](../README.md) in the parent directory.

## Building

To build all GLSP client packages simply execute the following in the `glsp-client` directory:

```bash
yarn
```

## Running the example

To start the Theia browser application with the integrated `TaskList` example execute:

```bash
yarn start
```

It's also possible to start the Theia browser application in external mode.
This means the `TaskList` GLSP server will not be started as an embedded process and is expected to be already running.
This can be used for debugging purposes, where you first start the GLSP server in debug mode and let the Theia application connect to it:

```bash
yarn start:external
```

## Debugging the example

To debug the involved components launch configs are available in the `Run and Debug` view (Ctrl + Shift + D).
Here you can choose between four different launch configurations:

-   `Launch TaskList Theia Backend (Embedded GLSP Server)`<br>
    This config launches the Theia browser backend application and will start the GLSP server as embedded process which means you won't be able to debug the GLSP Server source code.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
-   `Launch TaskList Theia Backend (External GLSP Server)`<br>
    This config launches the Theia browser backend application but does not start the GLSP server as embedded process.
    Breakpoints in the source files of the `glsp-client/**/node` directories will be picked up.
    It expects that the GLSP Server process is already running and has been started externally.
-   `Launch Theia Frontend`<br>
    Launches a Google chrome instance, opens the Theia browser application at `http://localhost:3000` and will automatically open an example workspace that contains a `example.tasklist` file.
    Double-click the file in the `Explorer` to open it with the `TaskList Diagram Editor`.
    Breakpoints in the source files of the `glsp-client/**/browser` directories will be picked up.

> **_NOTE:_**&nbsp; Due to bug [GLSP-666](https://github.com/eclipse-glsp/glsp/issues/666) the launch configurations for the `Theia Backend` might not work as expected when using Windows. Unfortunately there is currently no work-around and if you encounter this bug you won't be able to debug the Theia backed.

## Watching the example

To run TypeScript in watch-mode so that TypeScript files are compiled as you modify them execute:

```bash
yarn watch
```

## Using preconfigured tasks

Alternatively to executing these commands manually, you can also use the preconfigured VSCode tasks (via Menu _Terminal > Run Task..._):

-   `Build TaskList GLSP Client example`
-   `Watch TaskList GLSP Client example`
-   `Start TaskList Example Theia Backend (Embedded GLSP Server)`
-   `Start TaskList Example Backend (External GLSP Server)`

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
