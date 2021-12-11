def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: ci
    image: eclipseglsp/ci:alpine
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
        stage('Build Examples (Server)'){
                steps{
                    timeout(30){
                        container('ci') {
                            dir('minimal/server/org.eclipse.glsp.example.minimal'){
                                sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                                sh "mkdir ${env.WORKSPACE}/server-build"
                                sh "cp ./target/${env.JAR_FILE} ${env.GLSP_SERVER_PATH}"
                            }
                        }
                    }
                }
            }

        stage('Build Examples (Client)') {
            steps {
                timeout(30){
                    container('ci') {
                        dir('minimal/client') {
                            sh "cp ${env.GLSP_SERVER_PATH} ../server/org.eclipse.glsp.example.minimal/target/${env.JAR_FILE}"
                            sh 'yarn build --ignore-engines'
                        }
                    }
                }
            }
        }

        stage('Codestyle') {
            steps {
                timeout(30){
                    container('ci') {
                        // Execute checkstyle checks
                        dir('minimal/server/org.eclipse.glsp.example.minimal'){
                            sh 'mvn checkstyle:check'
                        } 

                        // Execute eslint checks
                        dir('minimal/client') {
                            sh 'yarn lint -o eslint.xml -f checkstyle'
                        }     
                    }   
                }
            }
        }
    }

    post{
        always{
            container('ci') {
            // Record & publish checkstyle issues
            recordIssues  enabledForFailure: true, publishAllIssues: true, aggregatingResults: true, 
            tool: checkStyle(reportEncoding: 'UTF-8'),
            qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

            // Record & publish esLint issues
            recordIssues enabledForFailure: true, publishAllIssues: true, aggregatingResults: true, 
            tools: [esLint(pattern: 'minimal/client/node_modules/**/*/eslint.xml')], 
            qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

            // Record maven,java warnings
            recordIssues enabledForFailure: true, skipPublishingChecks:true, tools: [mavenConsole(), java()]    
            }
        }
    }
}
