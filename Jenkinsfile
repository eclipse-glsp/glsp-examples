def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: ci
    image: eclipseglsp/ci:alpine-v3.1
    tty: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1"
      requests:
        memory: "2Gi"
        cpu: "1"
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
        EMAIL_TO= "tortmayr+eclipseci@eclipsesource.com"
    }
    
    stages {

         stage('Build Workflow Example') {
            stages {
                stage('Build Server') {
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('workflow/glsp-server/'){
                                    sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                                }
                            }
                        }
                    }
                }
                stage('Build Client') {
                    steps {
                        timeout(30){
                            container('ci') {
                                dir('workflow/glsp-client/') {
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                     }
                }
            }
        }
       
        stage('Build java-emf-theia template') {
            stages {
                stage('Build server'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/java-emf-theia/glsp-server/'){
                                    sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                                }
                            }
                        }
                    }
                }
                stage('Build client'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/java-emf-theia/glsp-client') {
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build node-json-theia template') {
            stages {
                stage('Build server'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-theia/glsp-server/'){
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
                stage('Build client'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-theia/glsp-client') {
                                     sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build node-json-vscode template') {
            stages {
                stage('Build server'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-vscode/glsp-server/'){
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
                stage('Build client'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-vscode/glsp-client') {
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build java-emf-eclipse template') {
            stages {
                stage('Build client'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/java-emf-eclipse/glsp-client') {
                                    sh 'yarn --unsafe-perm'
                                }
                            }
                        }
                    }
                }
                stage('Build server'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/java-emf-eclipse/glsp-server/'){
                                    sh "mvn clean verify -DskipTests -B -Dcheckstyle.skip"
                                }
                            }
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
                        dir('workflow/glsp-server'){
                            sh 'mvn checkstyle:check'
                        }
                        dir('project-templates/java-emf-theia/glsp-server/'){
                             sh 'mvn checkstyle:check'
                        }

                        dir('project-templates/java-emf-eclipse/glsp-server/'){
                             sh 'mvn checkstyle:check'
                        }
                        // Execute eslint checks
                        dir('workflow/glsp-client') {
                            sh 'yarn lint -o eslint.xml -f checkstyle'
                        } 
                        dir('project-templates/java-emf-theia/glsp-client/'){
                            sh 'yarn lint -o eslint.xml -f checkstyle'
                        }
                        dir('project-templates/node-json-theia/glsp-client/'){
                            sh 'yarn lint -o eslint.xml -f checkstyle'
                        }
                        dir('project-templates/node-json-vscode/glsp-client/'){
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
            failure {
            script {
                    if (env.BRANCH_NAME == 'master') {
                        echo "Build result FAILURE: Send email notification to ${EMAIL_TO}"
                        emailext attachLog: true,
                        body: 'Job: ${JOB_NAME}<br>Build Number: ${BUILD_NUMBER}<br>Build URL: ${BUILD_URL}',
                        mimeType: 'text/html', subject: 'Build ${JOB_NAME} (#${BUILD_NUMBER}) FAILURE', to: "${EMAIL_TO}"
                    }
                }
            }
            unstable {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        echo "Build result UNSTABLE: Send email notification to ${EMAIL_TO}"
                        emailext attachLog: true,
                        body: 'Job: ${JOB_NAME}<br>Build Number: ${BUILD_NUMBER}<br>Build URL: ${BUILD_URL}',
                        mimeType: 'text/html', subject: 'Build ${JOB_NAME} (#${BUILD_NUMBER}) UNSTABLE', to: "${EMAIL_TO}"
                    }
                }
            }
            fixed {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        echo "Build back to normal: Send email notification to ${EMAIL_TO}"
                        emailext attachLog: false,
                        body: 'Job: ${JOB_NAME}<br>Build Number: ${BUILD_NUMBER}<br>Build URL: ${BUILD_URL}',
                        mimeType: 'text/html', subject: 'Build ${JOB_NAME} back to normal (#${BUILD_NUMBER})', to: "${EMAIL_TO}"
                    }
                }
            }
        }
    }
}
