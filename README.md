# Personal Dashboard

A full-stack personal dashboard application featuring a React frontend and Node.js backend, deployed on AWS EKS with automated CI/CD pipelines.

## 🚀 Features

- **Real-time Clock**: Displays current time with live updates
- **Weather Widget**: Shows weather information (mock data)
- **Todo List**: Interactive task management
- **News Feed**: Latest news updates (mock data)
- **Responsive Design**: Works on desktop and mobile devices

## Project URL(AWS Deployment): 
a852ccb63580d4fd28e765900eeb1069-1549834109.us-east-1.elb.amazonaws.com

## 🛠 Tech Stack

### Frontend
- React 18
- React Router
- CSS Modules
- Nginx (production)

### Backend
- Node.js
- Express.js
- Jest (testing)
- RESTful APIs

### Infrastructure
- Docker
- Kubernetes (EKS)
- AWS ECR
- GitHub Actions (CI/CD)
- Terraform (IaC)

## 📁 Project Structure

```
.
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # Node.js API server
│   ├── src/
│   ├── __tests__/
│   └── Dockerfile
├── k8s/              # Kubernetes manifests
├── infra/            # Terraform configuration
├── .github/workflows/ # GitHub Actions CI/CD
└── README.md
```

## 📋 Prerequisites

- Node.js 16+
- Docker
- kubectl
- AWS CLI
- Terraform (optional)

## 🏃‍♂️ Local Development

### Frontend
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:8080
```

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

## 🚢 CI/CD Pipeline

The project uses GitHub Actions for automated testing, building, and deployment:

### Triggers
- Push to `main` or `master` branch
- Pull requests to `main`/`master`

### Pipeline Steps
1. **Test**: Run frontend and backend test suites
2. **Build**: Create Docker images with commit SHA tags
3. **Push**: Upload images to AWS ECR
4. **Deploy**: Update Kubernetes deployments
5. **Restart**: Force pod restarts to pull new images
6. **Verify**: Run smoke tests on deployed application

### Manual Triggers
Workflows can also be run manually from the GitHub Actions tab.

## ☁️ AWS Deployment

### Prerequisites
1. AWS account with EKS cluster
2. ECR repositories created
3. GitHub secrets configured:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_ACCOUNT_ID`
   - `EKS_CLUSTER_NAME`

### Deploy Infrastructure
```bash
cd infra
terraform init
terraform plan
terraform apply
```

### Access Application
After deployment, access the application via the ALB URL provided in the EKS ingress.

## 🔧 Configuration

### Environment Variables
Backend supports configuration via environment variables:
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 8080)

### Kubernetes
Deployments are configured for:
- 2 replicas each
- Resource limits and requests
- Health checks and probes
- Rolling updates


## 📝 API Documentation

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

### Weather
```
GET /api/weather
Response: Mock weather data
```

### Todos
```
GET /api/todos
POST /api/todos
PUT /api/todos/:id
DELETE /api/todos/:id
```

### News
```
GET /api/news
Response: Mock news articles
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainers.