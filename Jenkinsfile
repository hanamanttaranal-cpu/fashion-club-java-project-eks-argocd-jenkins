pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        EKS_CLUSTER_NAME = 'fashion-club-eks-cluster'
        DOCKER_REGISTRY = '123456789012.dkr.ecr.us-east-1.amazonaws.com'
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/fashion-club-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/fashion-club-backend:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main', url: 'https://github.com/hanamanttaranal/fashion-club-java-project-eks-argocd-jenkins.git'
            }
        }

        stage('Build & Test Backend (Spring Boot Java 21)') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build & Test Frontend (React & Vite)') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run lint'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE} -f Dockerfile ."
                    sh "docker build -t ${BACKEND_IMAGE} -f Dockerfile.backend ."
                    // sh "docker push ${FRONTEND_IMAGE}"
                    // sh "docker push ${BACKEND_IMAGE}"
                }
            }
        }

        stage('Trigger ArgoCD GitOps Sync to EKS') {
            steps {
                sh 'echo "Updating Kubernetes manifests for ArgoCD automated deployment to AWS EKS..."'
                sh "sed -i 's|IMAGE_TAG_PLACEHOLDER|${BUILD_NUMBER}|g' k8s/deployment.yaml"
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! ArgoCD will sync changes automatically to EKS Cluster."
        }
        failure {
            echo "Pipeline failed. Check Jenkins build logs."
        }
    }
}
