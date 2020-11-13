def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.6.2-jdk-11
    tty: true
    resources:
      limits:
        memory: "1Gi"
        cpu: "0.5"
      requests:
        memory: "1Gi"
        cpu: "0.5"
    command:
    - cat
  - name: node
    image: node:12.14.1
    tty: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1.3"
      requests:
        memory: "2Gi"
        cpu: "1.3"
    command:
    - cat
    volumeMounts:
    - mountPath: "/home/jenkins"
      name: "jenkins-home"
      readOnly: false
    - mountPath: "/.yarn"
      name: "yarn-global"
      readOnly: false
  volumes:
  - name: "jenkins-home"
    emptyDir: {}
  - name: "yarn-global"
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
    }
    
    stages {
        stage('Build Minimal Example') {
            steps {
                container('node') {
                    timeout(30){
                        dir('minimal/client') {
                            sh 'yarn  install --ignore-engines'
                        }
                    }
                }
            }
        }

        stage('Build Minimal example server'){
            steps{
                container('maven'){
                    timeout(30){
                        dir('minimal/server/org.eclipse.glsp.example.minimal'){
                            sh 'mvn clean verify -DskipTests --batch-mode package'
                        }
                    }
                }
            }
        }
    }
}
