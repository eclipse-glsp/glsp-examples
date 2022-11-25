# Eclipse GLSP - Project Template:<br> 🖥️ Java ● 🗂️ EMF ● 🖼️ Eclipse

## GLSP Client

This directory provides the initial setup of the package architecture and environment for a GLSP Client that is integrated into an Eclipse IDE.
It is based on the `TaskList` example diagram language.

For more detailed instructions and information please confer to the [README](../README.md) in the parent directory.

## Building

To build all GLSP client packages simply execute the following in the `glsp-client` directory:

```bash
yarn
```

At the of the build step the [bundled frontend code](./tasklist-eclipse/app/) will be copied to the [org.eclipse.glsp.example.javaemf.editor](../glsp-server/org.eclipse.glsp.example.javaemf.editor/diagram/)
Eclipse plugin

## Using preconfigured tasks

Alternatively to executing these commands manually, you can also use the preconfigured VSCode tasks (via Menu _Terminal > Run Task..._):

-   `Build TaskList GLSP Client example`
-   `Copy TaskList GLSP Client bundle`

## More information

For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
If you have questions, please raise them in the [discussions](https://github.com/eclipse-glsp/glsp/discussions) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).
