# Eclipse GLSP - Project Template:<br> 🖥️ Java ● 🗂️ EMF ● 🖼️ Theia

## GLSP Server

This directory provides the initial setup of the package architecture and environment for a node-based GLSP Server. 
It is based on the `TaskList` example diagram language.

For more detailed instructions and information please confer to the [README](../README.md) in the parent directory.

## Building

To build the server package execute the following in the `glsp-server` directory:

```bash
mvn clean verify
```

## Running the example

To start the `TaskList` server process execute:

```bash
java -jar target/org.eclipse.glsp.example.javaemf-0.10.0-glsp.jar
```

## Debugging the example

To debug the GLSP Server a launch configuration is available in the `Run and Debug` view (Ctrl + Shift + D).

-   `Launch Tasklist GLSP Server`<br>
    This config can be used to manually launch the `Tasklist GLSP Server` java process.
    Breakpoints in the source files of the `glsp-server` directory will be picked up.
    In order to use this config, the Theia application backend has to be launched in `External` server mode (see `Launch TaskList Theia Backend (External GLSP Server)`).
    If the GLSP server is started via this launch config, it is possible to consume code changes immediately in the running instance via `Hot Code Replace` in the Debug toolbar.

## Using preconfigured tasks

Alternatively to executing these commands manually, you can also use the preconfigured VSCode tasks (via Menu _Terminal > Run Task..._):

-   `Build TaskList GLSP Server`
-   `Start TaskList GLSP Server`

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
