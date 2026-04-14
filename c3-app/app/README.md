# C3OPS Application Source Code

Complete C3OPS website source code has been copied to this directory.

## Directory Structure

```
c3-app/app/
├── src/                        # React source code
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   └── App.jsx                 # Main app component
│
├── server/                     # Express backend server
│   ├── index.js                # Server entry point
│   ├── lambda.js               # Lambda handler
│   └── handlers/               # Request handlers
│
├── public/                     # Static assets served directly
├── dist/                       # Built production assets
├── node_modules/               # NPM dependencies
│
├── package.json               # Node.js dependencies & scripts
├── vite.config.js             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── eslint.config.js           # ESLint configuration
│
├── lambda/                    # AWS Lambda functions
│   ├── index.py               # Python Lambda handler
│   ├── index.js               # Node.js Lambda handler
│   └── typeform-handler.js    # Typeform integration
│
├── terraform/                 # Infrastructure as Code (existing)
├── scripts/                   # Build and deployment scripts
├── docs/                      # Documentation files
├── mdfiles/                   # Markdown content
│
└── README files               # Various documentation
```

## Key Files

| File | Size | Purpose |
|------|------|---------|
| package.json | 1.5K | Project dependencies & npm scripts |
| vite.config.js | 161B | Vite bundler configuration |
| server/index.js | 6.8K | Express backend server |
| src/ | - | React frontend source code |
| dist/ | - | Built production files |
| node_modules/ | - | Installed NPM packages |

## Application Details

**Framework:** React 18 + Vite
**Backend:** Node.js Express server
**Build Tool:** Vite
**Styling:** Tailwind CSS
**Package Manager:** npm

## Useful Commands

```bash
# Navigate to app directory
cd /Users/ck/c3ops-repos/c3ops-core-infra/c3-app/app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run backend server
npm run server

# Run both frontend and backend
npm run dev:full

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Build & Deployment

The buildspec.yml in the parent directory (`../deployment/buildspec.yml`) uses this source code to:

1. Install dependencies
2. Build the React app (`npm run build`)
3. Create deployment artifacts
4. Deploy to EC2 instances via Auto Scaling Group

## Size Information

Total copied: **1.2 GB** (includes node_modules)

To reduce size for deployments:
- Remove `node_modules/` before packaging
- Clean build artifacts with `npm run clean` (if available)
- Use `.gitignore` to exclude heavy directories

## Integration with Infrastructure

This source code is integrated with the Terraform infrastructure:
- EC2 instances will download and build this code
- user-data.sh script installs Node.js and PM2
- Application runs on port 3000
- ALB routes traffic to this application
- CloudWatch logs capture application output

## Next Steps

1. Review application code in `src/` directory
2. Check `server/index.js` for backend configuration
3. Update environment variables as needed
4. Deploy infrastructure using Terraform
5. Monitor application via CloudWatch logs

See [../deployment/README.md](../deployment/README.md) for deployment instructions.
