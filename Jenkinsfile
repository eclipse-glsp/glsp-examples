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
    }
    
    stages {
        stage('Build Examples (Server)'){
            steps{
                timeout(30){
                    container('ci') {
                        dir('minimal/glsp-server/'){
                            sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                        }
                        dir('workflow/glsp-server/'){
                            sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                        }
                    }
                }
            }
        }

        stage('Build Examples (Client)') {
            steps {
                timeout(30){
                    container('ci') {
                        dir('minimal/glsp-client') {
                            sh 'yarn build'
                        }
                         dir('workflow/glsp-client') {
                            sh 'yarn build'
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
                        dir('minimal/glsp-server'){
                            sh 'mvn checkstyle:check'
                        } 

                        dir('workflow/glsp-server'){
                            sh 'mvn checkstyle:check'
                        } 

                        // Execute eslint checks
                        dir('minimal/glsp-client') {
                            sh 'yarn lint -o eslint.xml -f checkstyle'
                        }    

                        dir('workflow/glsp-client') {
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
            tools: [esLint(pattern: '**/glsp-client/node_modules/**/*/eslint.xml')], 
            qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

            // Record maven,java warnings
            recordIssues enabledForFailure: true, skipPublishingChecks:true, tools: [mavenConsole(), java()]    
            }
        }
    }
}
