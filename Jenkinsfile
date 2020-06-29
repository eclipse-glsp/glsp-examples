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
        CHROME_BIN="/usr/bin/google-chrome"
        GLSP_SERVER_PATH= "${env.WORKSPACE}/server-build/org.eclipse.glsp.example.workflow-0.8.0-SNAPSHOT-glsp.jar"
    }
    
    stages {
        stage('Build client') {
            steps {
                container('ci') {
                    timeout(30){
                        dir('client') {
                            sh 'yarn  install'
                        }
                    }
                }
            }
        }

        stage('Build server'){
            steps{
                container('ci'){
                    timeout(30){
                        dir('server'){
                            sh 'mvn clean verify -DskipTests --batch-mode package'
                            sh "mkdir ${env.WORKSPACE}/server-build"
                            sh "cp ./org.eclipse.glsp.example.workflow/target/org.eclipse.glsp.example.workflow-0.8.0-SNAPSHOT-glsp.jar ${env.GLSP_SERVER_PATH}"
                        }
                    }
                }
            }
        }
        
        stage('Run e2e tests'){
            steps{
                container('ci'){
                    timeout(30){
                        dir('client'){
                            script{
                                withEnv(['JENKINS_NODE_COOKIE=dontkill']) {
                                    sh "java -jar ${env.GLSP_SERVER_PATH} > ${env.WORKSPACE}/server-build/server.log &"
                                }
                            }   
                                sh "lsof -i:5007"
                                sh "yarn run ui-tests"
                                
                        }
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

    post {
        always {
             archiveArtifacts artifacts: 'server-build/**', onlyIfSuccessful: false
             
        }
    }
}
