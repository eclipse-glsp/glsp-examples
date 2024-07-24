def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: ci
    image: eclipseglsp/ci:alpine-v5.0
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
        EMAIL_TO= "glsp-build@eclipse.org"
        PUPPETEER_SKIP_DOWNLOAD="true"
    }
    
    stages {

         stage('Build Workflow Example') {
            when {
                expression {  
                    sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^workflow/"') == 0
                }
            }
            stages {
                stage('Build') {
                    steps {
                        timeout(30){
                            container('ci') {
                                dir('workflow') {
                                    sh 'yarn install --unsafe-perm'
                                }
                            }
                        }
                     }
                }
            }
        }
       
        stage('Build java-emf-theia template') {
            when {
                expression {  
                    sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/java-emf-theia/\\(glsp-client\\|glsp-server\\)"') == 0
                }
            }
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
                                    sh 'yarn install --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build node-json-theia template') {
            when {
                expression {  
                    sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/node-json-theia/"') == 0
                }
            }
            stages {
                stage('Build'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-theia') {
                                     sh 'yarn install --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build node-json-vscode template') {
            when {
                expression {  
                    sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/node-json-vscode/"') == 0
                }
            }
            stages {
                stage('Build'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/node-json-vscode') {
                                    sh 'yarn install --unsafe-perm'
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Build java-emf-eclipse template') {
            when {
                expression {  
                    sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/java-emf-eclipse/\\(glsp-client\\|glsp-server\\)"') == 0
                }
            }
            stages {
                stage('Build client'){
                    steps{
                        timeout(30){
                            container('ci') {
                                dir('project-templates/java-emf-eclipse/glsp-client') {
                                    sh 'yarn install --unsafe-perm'
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
            stages {
                stage ('Lint workflow example') {
                    when {
                        expression {  
                            sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^workflow/"') == 0
                        }
                    }
                    steps {
                        timeout(30) {
                            container('ci') {
                                dir('workflow') {
                                    sh 'yarn lint -o eslint.xml -f checkstyle'
                                }
                            }
                        }
                    }
                }

                stage ('Lint java-emf-theia') {
                    when {
                        expression {  
                            sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/java-emf-theia/\\(glsp-client\\|glsp-server\\)"') == 0
                        }
                    }
                    steps {
                        timeout(30) {
                            container('ci') {
                                dir('project-templates/java-emf-theia/glsp-server/'){
                                    sh 'mvn checkstyle:check'
                                }
                                dir('project-templates/java-emf-theia/glsp-client/'){
                                    sh 'yarn lint:ci'
                                }
                            }
                        }
                    }
                }


                stage ('Lint java-emf-eclipse') {
                    when {
                        expression {  
                            sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/java-emf-eclipse/\\(glsp-client\\|glsp-server\\)"') == 0
                        }
                    }
                    steps {
                        timeout(30) {
                            container('ci') {
                                dir('project-templates/java-emf-eclipse/glsp-server/'){
                                    sh 'mvn checkstyle:check'
                                }
                                dir('project-templates/java-emf-eclipse/glsp-client/'){
                                    sh 'yarn lint:ci'
                                }
                            }
                        }
                    }
                }

                stage ('Lint node-json-theia') {
                    when {
                        expression {  
                            sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/node-json-theia/"') == 0
                        }
                    }
                    steps {
                        timeout(30) {
                            container('ci') {
                                dir('project-templates/node-json-theia/'){
                                    sh 'yarn lint:ci'
                                }
                            }
                        }
                    }
                }

                stage ('Lint node-json-vscode') {
                    when {
                        expression {  
                            sh(returnStatus: true, script: 'git diff --name-only HEAD^ | grep --quiet "^project-templates/node-json-vscode/"') == 0
                        }
                    }
                    steps {
                        timeout(30) {
                            container('ci') {
                                dir('project-templates/node-json-vscode/'){
                                    sh 'yarn lint:ci'
                                }
                            }
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
            tools: [esLint(pattern: '**/node_modules/**/*/eslint.xml')], 
            qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]
            
            // Record maven,java warnings
            recordIssues enabledForFailure: true, skipPublishingChecks:true, tools: [mavenConsole(), java()]    
            }
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
