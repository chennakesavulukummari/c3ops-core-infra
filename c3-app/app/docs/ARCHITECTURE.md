# C3OPS Repository Architecture

## 📁 Directory Structure Overview

```
c3ops-website/
├── docs/                          # 📚 Documentation hub
│   ├── ARCHITECTURE.md           # System design & overview
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── deployment/               # Deployment guides
│   ├── guides/                   # How-to guides
│   ├── infrastructure/           # Infrastructure docs
│   ├── setup/                    # Initial setup guides
│   └── api/                      # API documentation
├── src/                          # 🚀 React frontend
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   ├── assets/                   # Static assets
│   ├── App.jsx
│   └── main.jsx
├── public/                       # 📦 Static files
│   ├── assets/
│   │   ├── certifications/       # Certification badges
│   │   ├── presentations/        # Deck & PDFs
│   │   ├── badges/               # Status badges
│   │   ├── images/
│   │   └── logos/
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/                      # 🔧 Build & deploy scripts
│   ├── deploy/                   # Deployment scripts
│   ├── setup/                    # Setup scripts
│   └── utils/                    # Utility scripts
├── server/                       # 🖥️ Backend server
│   ├── index.js                  # Express server
│   └── lambda.js                 # Lambda handler
├── lambda/                       # ⚡ AWS Lambda functions
│   ├── handler.js
│   ├── index.js
│   └── package.json
├── terraform/                    # 🏗️ Infrastructure as Code
│   ├── main.tf
│   ├── api_gateway.tf
│   ├── dynamodb.tf
│   └── variables.tf
├── package.json                  # Node dependencies
├── vite.config.js               # Vite config
├── tailwind.config.js           # Tailwind CSS config
├── .env.example                 # Environment template
└── README.md                    # Main documentation
```

## 🔍 Key Directories Explained

### `/docs` - Documentation
Central hub for all documentation:
- **deployment/** - How to deploy to AWS, Lambda, etc.
- **guides/** - Feature guides, tutorials, how-tos
- **infrastructure/** - Infrastructure design, Terraform docs
- **setup/** - Getting started, environment setup
- **api/** - API endpoints, request/response examples

### `/src` - React Frontend
- **components/** - Reusable React components (Header, Footer, Cards, etc.)
- **pages/** - Full page components (Home, Pricing, Blog, etc.)
- **services/** - API calls and external service integrations
- **assets/** - Images, SVGs, and static frontend assets

### `/public` - Static Assets
- **assets/certifications/** - Team certifications (AWS, FinOps, etc.)
- **assets/presentations/** - Deck PDFs and presentations
- **assets/badges/** - SVG badges and icons
- **images/** & **logos/** - Brand images and logos

### `/scripts` - Automation
- **deploy/** - CloudFormation, Lambda, S3 deployment
- **setup/** - AWS credential setup, environment configuration
- **utils/** - Helper scripts for common tasks

### `/terraform` - Infrastructure as Code
Terraform configurations for AWS resources:
- Lambda functions
- API Gateway
- DynamoDB tables
- S3 buckets
- CloudFront distribution

## 🚀 Development Workflow

### 1. **Local Development**
```bash
# Install dependencies
npm install

# Start frontend dev server (port 5173)
npm run dev

# Start backend server (port 3000)
npm run server

# Run both together
npm run dev:full
```

### 2. **Build for Production**
```bash
# Build frontend
npm run build

# Output goes to /dist
```

### 3. **Deployment**
```bash
# Deploy to AWS using Terraform
cd terraform
terraform plan
terraform apply

# Deploy frontend to S3
npm run build
bash scripts/deploy/deploy-to-s3.sh
```

## 🔐 Security Practices

### Credentials Management
- ✅ All credentials in `~/.aws/credentials` (never in repo)
- ✅ Environment variables in `.env` (excluded from git)
- ✅ `.env.example` provided as template
- ✅ No hardcoded API keys or secrets

### File Security
- ✅ `.gitignore` prevents accidental credential commits
- ✅ Sensitive files marked with patterns: `*-creds.md`, `*-secret.md`
- ✅ Lambda deployment artifacts in `.gitignore`

## 📋 Component Organization

### Frontend Components (`src/components/`)
- `SiteHeader.jsx` - Navigation and branding
- `SiteFooter.jsx` - Footer with links
- `PricingPlans.jsx` - Pricing tier display
- `TypeformModal.jsx` - Form integration
- `SearchConsoleIntegration.tsx` - SEO integration
- `OpenGraphTags.tsx` - Social media sharing
- `StructuredDataSchema.tsx` - Schema.org markup

### Pages (`src/pages/`)
- `Home.jsx` - Landing page
- `Platform.jsx` - Product overview
- `Pricing.jsx` - Pricing page
- `Documentation.jsx` - Docs portal
- `Blog.jsx` - Blog posts
- `Contact.jsx` - Contact form
- `PrivacyPolicy.jsx`, `Terms.jsx`, `Cookies.jsx`

## 🗂️ Data Flow

```
API Requests
    ↓
    ├─→ src/services/emailService.js (API integration)
    ├─→ Lambda Functions (serverless backend)
    └─→ DynamoDB (data persistence)

Frontend
    ├─→ React Components (src/components/)
    ├─→ React Pages (src/pages/)
    └─→ Static Assets (public/assets/)

Deployment
    ├─→ npm run build → /dist
    ├─→ Terraform → AWS Resources
    └─→ Deploy scripts → S3 + CloudFront
```

## 📚 Documentation Files

Key documentation files:
- `README.md` - Main project overview
- `docs/ARCHITECTURE.md` - This file
- `docs/CONTRIBUTING.md` - How to contribute
- `docs/deployment/*.md` - Deployment guides
- `docs/guides/*.md` - Feature & setup guides
- `docs/infrastructure/*.md` - Infrastructure details

## 🔄 Contribution Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following project structure
3. Ensure no sensitive data is committed
4. Submit pull request with description
5. See `docs/CONTRIBUTING.md` for detailed guidelines

## 💡 Best Practices

### Code Organization
- Keep components focused and single-responsibility
- Use meaningful file and folder names
- Group related files together

### Deployment
- Always use Terraform for infrastructure changes
- Test locally before deploying
- Use `.env` for configuration

### Security
- Never commit credentials
- Review `.gitignore` before committing
- Use AWS IAM roles, not access keys where possible

## 🆘 Common Tasks

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for prod | `npm run build` |
| Run linter | `npm run lint` |
| Deploy frontend | `npm run build && bash scripts/deploy/deploy-to-s3.sh` |
| Deploy infrastructure | `cd terraform && terraform apply` |
| Check Terraform plan | `cd terraform && terraform plan` |

## 📞 Getting Help

- Documentation: See `/docs` directory
- Issues: GitHub issues (to be set up)
- Code examples: Check `/docs/guides`
- Architecture questions: See this file and `/docs/ARCHITECTURE.md`
