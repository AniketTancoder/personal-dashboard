pipeline {
    agent any
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY = 'backend-api'
        K8S_NAMESPACE = 'ci-cd-demo'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test Backend') {
            when {
                changeset "backend/**"
            }
            steps {
                sh 'cd backend && npm install'
                sh 'cd backend && npm test'
            }
        }
        stage('Test Frontend') {
            when {
                changeset "frontend/**"
            }
            steps {
                sh 'cd frontend && npm install'
                sh 'cd frontend && npm test -- --watchAll=false'
            }
        }
        stage('Build and Push Backend') {
            when {
                changeset "backend/**"
                branch "main"
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    sh "cd backend && docker build -t ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.GIT_COMMIT} ."
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${env.GIT_COMMIT}"
                }
            }
        }
        stage('Build and Push Frontend') {
            when {
                changeset "frontend/**"
                branch "main"
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    sh "cd frontend && npm run build"
                    sh "cd frontend && docker build -t ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend-app:${env.GIT_COMMIT} ."
                    sh "docker push ${env.AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend-app:${env.GIT_COMMIT}"
                }
            }
        }
        stage('Deploy to EKS') {
            when {
                branch "main"
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh "aws eks update-kubeconfig --name ${env.EKS_CLUSTER_NAME}"
                    sh "sed -i 's|<AWS_ACCOUNT_ID>|${env.AWS_ACCOUNT_ID}|g' k8s/backend-deployment.yaml"
                    sh "sed -i 's|<REGION>|${AWS_REGION}|g' k8s/backend-deployment.yaml"
                    sh "sed -i 's|<AWS_ACCOUNT_ID>|${env.AWS_ACCOUNT_ID}|g' k8s/frontend-deployment.yaml"
                    sh "sed -i 's|<REGION>|${AWS_REGION}|g' k8s/frontend-deployment.yaml"
                    sh "kubectl apply -f k8s/namespace.yaml"
                    sh "kubectl apply -f k8s/backend-deployment.yaml"
                    sh "kubectl apply -f k8s/frontend-deployment.yaml"
                    sh "kubectl apply -f k8s/ingress.yaml"
                    sh "kubectl rollout status deployment/backend-api -n ${K8S_NAMESPACE}"
                    sh "kubectl rollout status deployment/frontend-app -n ${K8S_NAMESPACE}"
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: '#ci-cd', message: "Build Successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: '#ci-cd', message: "Build Failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}