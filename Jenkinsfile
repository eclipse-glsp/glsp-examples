def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: ci
    image: eclipseglsp/ci:0.0.4
    tty: true
    resources:
      limits:
        memory: "4Gi"
        cpu: "2"
      requests:
        memory: "4Gi"
        cpu: "2"
    command:
    - cat
    env:
    - name: "MAVEN_OPTS"
      value: "-Duser.home=/home/jenkins"
    volumeMounts:
    - mountPath: "/home/jenkins"
      name: "jenkins-home"
      readOnly: false
    - mountPath: "/.yarn"
      name: "yarn-global"
      readOnly: false
    - name: settings-xml
      mountPath: /home/jenkins/.m2/settings.xml
      subPath: settings.xml
      readOnly: true
    - name: m2-repo
      mountPath: /home/jenkins/.m2/repository
  volumes:
  - name: "jenkins-home"
    emptyDir: {}
  - name: "yarn-global"
    emptyDir: {}
  - name: settings-xml
    secret:
      secretName: m2-secret-dir
      items:
      - key: settings.xml
        path: settings.xml
  - name: m2-repo
    emptyDir: {}
"""
pipeline {
    agent {
        kubernetes {
            label 'glsp-agent-pod'
            yaml kubernetes_config
        }
    }
    options {
        buildDiscarder logRotator(numToKeepStr: '15')
    }

    environment {
        YARN_CACHE_FOLDER = "${env.WORKSPACE}/yarn-cache"
        SPAWN_WRAP_SHIM_ROOT = "${env.WORKSPACE}"
        JAR_FILE="org.eclipse.glsp.example.minimal-0.8.0-glsp.jar"
        GLSP_SERVER_PATH= "${env.WORKSPACE}/server-build/${env.JAR_FILE}"

    }
    
    stages {
      stage('Build Minimal example server'){
            steps{
                container('ci'){
                    timeout(30){
                        dir('minimal/server/org.eclipse.glsp.example.minimal'){
                            sh 'mvn clean verify -DskipTests -B'
                            sh "mkdir ${env.WORKSPACE}/server-build"
                            sh "cp ./target/${env.JAR_FILE} ${env.GLSP_SERVER_PATH}"
                        }
                    }
                }
            }
        }

        stage('Build Minimal Example') {
            steps {
                container('ci') {
                    timeout(30){
                        dir('minimal/client') {
                            sh "cp ${env.GLSP_SERVER_PATH} ../server/org.eclipse.glsp.example.minimal/target/${env.JAR_FILE}"
                            sh 'yarn  install --ignore-engines'
                        }
                    }
                }
            }
        }
    }
}
