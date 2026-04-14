# Documentation Index

Welcome to C3OPS documentation! This is your central hub for all project information.

## 🚀 Quick Start

New to the project? Start here:
- **[Getting Started](setup/QUICK_START.md)** - Set up your development environment
- **[Architecture Overview](ARCHITECTURE.md)** - Understand the project structure
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

## 📚 Documentation by Topic

### 🔧 Setup & Development
- [Quick Start Guide](setup/QUICK_START.md) - Get up and running in 15 minutes
- [Development Environment](setup/DEVELOPMENT_SETUP.md) - Detailed setup instructions
- [Environment Variables](setup/ENVIRONMENT_VARIABLES.md) - Configure your environment

### 🚀 Deployment
- [AWS Deployment Guide](deployment/AWS_DEPLOYMENT.md) - Deploy to AWS
- [Lambda Deployment](deployment/LAMBDA_DEPLOYMENT.md) - Deploy serverless functions
- [Terraform Guide](deployment/TERRAFORM_GUIDE.md) - Infrastructure as Code
- [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md) - Pre-deployment verification

### 📘 Guides & How-Tos
- [Email Integration](guides/EMAIL_SETUP.md) - Set up email services
- [SEO Implementation](guides/SEO_IMPLEMENTATION.md) - Optimize for search engines
- [Backend Setup](guides/BACKEND_SETUP.md) - Configure backend services
- [API Integration](guides/API_INTEGRATION.md) - Connect to external APIs

### 🏗️ Infrastructure
- [Infrastructure Overview](infrastructure/INFRASTRUCTURE_OVERVIEW.md) - System architecture
- [CloudFormation Setup](infrastructure/CLOUDFORMATION.md) - AWS CloudFormation templates
- [Database Configuration](infrastructure/DATABASE_SETUP.md) - DynamoDB setup
- [Infrastructure Security](infrastructure/SECURITY.md) - Security best practices

### 🔌 API Documentation
- [API Overview](api/README.md) - API endpoints and usage
- [Authentication](api/AUTHENTICATION.md) - Authentication methods
- [Endpoints Reference](api/ENDPOINTS.md) - Complete endpoint documentation
- [Error Handling](api/ERROR_HANDLING.md) - Error codes and handling

### 🔐 Security
- [Security Guidelines](SECURITY.md) - Security best practices
- [Credential Management](SECURITY.md#-credential-rotation) - Handling sensitive data
- [Security Audit](SECURITY.md#-security-audit-checklist) - Security checklist

## 📋 Common Tasks

| Task | Reference |
|------|-----------|
| Set up project locally | [Quick Start](setup/QUICK_START.md) |
| Deploy to production | [Deployment Guide](deployment/AWS_DEPLOYMENT.md) |
| Write new component | [Contributing](CONTRIBUTING.md#code-standards) |
| Configure environment | [Environment Variables](setup/ENVIRONMENT_VARIABLES.md) |
| Integrate email service | [Email Setup](guides/EMAIL_SETUP.md) |
| Set up CI/CD pipeline | [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md) |
| Report security issue | [Security Guidelines](SECURITY.md#-report-security-issues) |

## 🏗️ Project Structure

```
c3ops-website/
├── docs/                    # 📚 You are here
│   ├── setup/              # Setup guides
│   ├── deployment/         # Deployment docs
│   ├── guides/             # How-to guides
│   ├── infrastructure/     # Infrastructure docs
│   ├── api/                # API documentation
│   └── README.md           # This file
├── src/                    # React frontend source
├── server/                 # Backend server
├── lambda/                 # AWS Lambda functions
├── terraform/              # Infrastructure as Code
└── public/                 # Static assets
```

See [Architecture Documentation](ARCHITECTURE.md) for complete structure.

## 🤝 Contributing

Want to contribute? Great!
1. Read [Contributing Guide](CONTRIBUTING.md)
2. Check [Architecture Overview](ARCHITECTURE.md)
3. Review [Security Guidelines](SECURITY.md)
4. Submit pull request

## 🔍 Search Tips

Looking for something specific?
- **Setup questions** → `setup/` directory
- **How-to guides** → `guides/` directory
- **Deployment issues** → `deployment/` directory
- **Infrastructure** → `infrastructure/` directory
- **API usage** → `api/` directory
- **Security concerns** → `SECURITY.md`

## 📞 Getting Help

- **Documentation**: Check the relevant directory above
- **Code Issues**: See [Contributing Guide](CONTRIBUTING.md#issues-and-bugs)
- **Security**: See [Security Guidelines](SECURITY.md#-report-security-issues)
- **Architecture**: Read [Architecture Documentation](ARCHITECTURE.md)

## 📝 Document Versions

Last updated: March 19, 2026

For version history, check git history:
```bash
git log --oneline docs/
```

## 🔄 Contributing to Documentation

Found an error or want to improve docs?
1. Make your changes
2. Follow [Contributing Guide](CONTRIBUTING.md)
3. Ensure clarity and accuracy
4. Submit pull request

---

**Happy coding! 🚀**
