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
    image: node:10.17.0
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
        stage('Build client') {
            steps {
                container('node') {
                    dir('client') {
                        sh 'yarn  install'
                    }
                }
            }
        }

        stage('Build server'){
            steps{
                container('maven'){
                        dir('server'){
                            sh 'mvn clean verify -DskipTests --batch-mode package'
                        }
                }
            }
        }
        

         stage('Deploy client & server (master only)') {
            when { branch 'master'}
            steps {
                 build job: 'deploy-npm-glsp-examples', wait: false
                 build job: 'deploy-m2-glsp-examples', wait: false
            }
        } 
    }
}
