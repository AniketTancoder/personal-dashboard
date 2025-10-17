#!/bin/bash

# Local deployment script for development
set -e

echo "🚀 Starting local deployment..."

# Build and start services
echo "📦 Building and starting services with Docker Compose..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test backend health
echo "🏥 Testing backend health..."
curl -f http://localhost:8080/api/health || echo "Backend health check failed"

# Test frontend
echo "🌐 Testing frontend..."
curl -f http://localhost:3000 || echo "Frontend check failed"

echo "✅ Deployment completed successfully!"
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080/api/health"