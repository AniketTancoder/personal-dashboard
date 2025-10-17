#!/bin/bash

# Kubernetes deployment script
set -e

echo "🚀 Deploying to Kubernetes..."

# Build images
echo "📦 Building Docker images..."
docker build -t dashboard-backend:latest ./backend
docker build -t dashboard-frontend:latest ./frontend

# Load images to kind (if using kind)
# kind load docker-image dashboard-backend:latest
# kind load docker-image dashboard-frontend:latest

# Apply Kubernetes manifests
echo "📋 Applying Kubernetes manifests..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-ingress.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/dashboard-backend -n personal-dashboard --timeout=180s
kubectl rollout status deployment/dashboard-frontend -n personal-dashboard --timeout=180s

echo "✅ Kubernetes deployment completed!"
echo "📊 Check pods: kubectl get pods -n personal-dashboard"
echo "🌐 Check services: kubectl get svc -n personal-dashboard"