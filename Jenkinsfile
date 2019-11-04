def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:8.12
    tty: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1"
      requests:
        memory: "2Gi"
        cpu: "1"
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
        stage('Build package') {
            steps {
                container('node') {
                    sh "yarn  install"
                }
            }
        }
        stage('Deploy (master)') {
            when { branch 'master'}
            steps {
                sh 'echo "TODO deploy artifacts"'
            }
        }
    }
}
