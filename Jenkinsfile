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
        memory: "2Gi"
        cpu: "1.3"
      requests:
        memory: "2Gi"
        cpu: "1.3"
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
  volumes:
  - name: "jenkins-home"
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
    
    stages {
        stage('Build client & server') {
            steps {
                parallel(
                    client: {
                        container('node') {
                            dir('client') {
                                sh 'yarn  install'
                            }
                        }
                    },
                    server: {
                        container('maven'){
                            dir('server'){
                                sh 'mvn clean verify -DskipTests --batch-mode package'
                            }
                        }
                    }
                )
            }
        }

         stage('Deploy client & server (master only)') {
            when { branch 'master'}
            steps {
                parallel(
                    client: {
                        container('node') {
                            dir('client') {
                                withCredentials([string(credentialsId: 'npmjs-token', variable: 'NPM_AUTH_TOKEN')]) {
                                    sh 'printf "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}\n" >> /home/jenkins/.npmrc'
                                }
                                sh  'git config  user.email "eclipse-glsp-bot@eclipse.org"'
                                sh  'git config  user.name "eclipse-glsp-bot"'
                                sh 'yarn publish:next'
                            }
                        }
                    },
                    server: {
                       build 'deploy-m2-glsp-examples'
                    }
                )
            }
        } 
    }
}
