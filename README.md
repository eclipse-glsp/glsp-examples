# Eclipse GLSP Examples ![build-status](https://img.shields.io/jenkins/build?jobUrl=https%3A%2F%2Fci.eclipse.org%2Fglsp%2Fjob%2Feclipse-glsp%2Fjob%2Fglsp-examples%2Fjob%2Fmaster%2F)

This repository contains code examples that demonstrates how build diagram editors with the [Graphical Language Server Platform (GLSP)](https://github.com/eclipse-glsp/glsp). The examples are focused on the integration of GLSP editors with the cloud-based [Eclipse Theia IDE](https://github.com/theia-ide/theia) using the [GLSP theia integration](https://github.com/eclipse-glsp/glsp-theia-integration).

Each examples is self-contained and provides both, a example diagram client and its corresponding GLSP server. 

## Prerequisites
The following libraries/frameworks need to be installed on your system:
- [Node.js](https://nodejs.org/en/) `>= 12.14.1 AND < 13`
- [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`
- [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) `>=11`
- [Maven](https://maven.apache.org/) `>=3.6.0`

 The examples are heavily interweaved with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

The web-based/client part of the examples has been developed using [Visual Studio Code](https://code.visualstudio.com/) and the server/java part has been developed with the [Eclipse IDE](https://www.eclipse.org/ide/). However, it's of course also possible to use any other IDE or text editor.

## Usage
- `git clone https://github.com/eclipse-glsp/glsp-examples.git`
- `cd <any-example-folder>`
- `cd client && yarn && cd ..` (build client)
- `cd server && mvn clean install && cd ..` (build server)

## Structure
- [Minimal Example](https://github.com/eclipse-glsp/glsp-examples/tree/master/minimal): A very simple GLSP Editor for rectangular nodes. This demonstrates the core concepts and basic client-server integration into Theia.


For more information, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/). If you have questions, contact us on our [spectrum chat](https://spectrum.chat/glsp/) and have a look at our [communication and support options](https://www.eclipse.org/glsp/contact/).

![alt](https://www.eclipse.org/glsp/images/diagramanimated.gif)
