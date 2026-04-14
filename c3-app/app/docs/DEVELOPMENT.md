# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use `nvm` for version management)
- npm 9+ or yarn
- Git with SSH configured (see [Multiple GitHub Profiles](./MULTIPLE_GITHUB_PROFILES.md) if using multiple accounts)
- AWS credentials configured (for backend/infrastructure work)

### Initial Setup

```bash
# Clone the repository (with c3ops SSH profile)
git clone git@github.com-c3ops:c3ops/c3ops-website.git
cd c3ops-website

# Install dependencies
npm install

# Create .env.local file (copy from .env.example)
cp .env.example .env.local

# Update .env.local with your local values
# Development: Use local API endpoint
# Production: Use AWS API Gateway URL
```

## Project Setup Commands

### Install Dependencies

```bash
npm install
```

This installs both frontend (React, Vite, Tailwind) and backend (Express, AWS SDK) dependencies.

### Environment Configuration

Create `.env.local` in project root:

```env
# API Configuration
VITE_API_ENDPOINT=http://localhost:5000/api
VITE_API_URL=http://localhost:5000

# Analytics
VITE_GOOGLE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXX

# Third-party Services
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
VITE_INDEXNOW_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Development Workflow

### Running Development Server

```bash
# Frontend only (Vite dev server)
npm run dev

# Frontend + Backend (separate processes)
npm run dev:full

# Backend only (Express server)
npm run server
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

### Building for Production

```bash
# Build frontend
npm run build

# Output in dist/ directory
```

### Code Quality

#### Linting

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

ESLint configuration: `.eslintrc.cjs`
Rules: `eslint:recommended`, `react/recommended`, `react-hooks/recommended`

#### Code Formatting

```bash
# Format code with Prettier
npm run format

# Check if code is formatted
npm run format:check
```

Prettier configuration: `.prettierrc.json`
Excluded files: `.prettierignore`

#### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

## Frontend Development

### Adding a New Page

1. Create page component in `src/pages/NewPage.jsx`:

```javascript
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

function NewPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Page content */}
      </main>
      <SiteFooter />
    </>
  );
}

export default NewPage;
```

2. Add route in `src/App.jsx`:

```javascript
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={<NewPage />} />
```

### Adding a Reusable Component

Create in `src/components/{common|features}/`:

```javascript
// src/components/common/MyComponent.jsx
function MyComponent({ title, children }) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default MyComponent;
```

Import in other components:

```javascript
import MyComponent from '../components/common/MyComponent';
```

### Using API Client

```javascript
import { apiClient } from '../api/client';

// In component:
const fetchData = async () => {
  try {
    const response = await apiClient.get('/api/data');
    console.log(response);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Using Utilities

```javascript
import { isEmail, slugify, formatCurrency } from '../utils';

// Validate email
if (isEmail(userEmail)) {
  // Valid email
}

// Create URL slug
const slug = slugify('My Blog Post Title'); // 'my-blog-post-title'

// Format currency
const price = formatCurrency(99.99); // '$99.99'
```

### Using Constants

```javascript
import { ROUTES, API_ENDPOINTS, APP_CONFIG } from '../constants';

// Navigate to pricing
navigate(ROUTES.PRICING);

// API call
const url = `${API_ENDPOINTS.DEMO_REQUEST}`;

// App info
console.log(APP_CONFIG.NAME); // 'C3Ops'
```

### Adding Custom Hooks

Create in `src/hooks/`:

```javascript
// src/hooks/useCustomHook.js
import { useState, useEffect } from 'react';

function useCustomHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return state;
}

export default useCustomHook;
```

Import and use:

```javascript
import useCustomHook from '../hooks/useCustomHook';

function MyComponent() {
  const data = useCustomHook();
  return <div>{data}</div>;
}
```

## Backend Development

### Backend Structure

```
server/
├── api/              # Route handlers and controllers
├── middleware/       # Express middleware
├── utils/           # Server utilities
├── config/          # Configuration files
├── index.js         # Express server entry
└── lambda.js        # AWS Lambda handler
```

### Running Backend Server

```bash
# Start development server
npm run server

# With Nodemon (auto-restart):
npx nodemon server/index.js
```

Backend runs on `http://localhost:5000`

### Adding New Routes

1. Create handler in `server/api/routes.js`:

```javascript
// server/api/routes.js
router.post('/api/new-endpoint', async (req, res) => {
  try {
    // Handle request
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

2. Use in Lambda or Express:

```javascript
// server/index.js
import routes from './api/routes.js';
app.use(routes);
```

## Git Workflow

### Branch Management

```bash
# List branches
git branch

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout live

# Delete branch
git branch -d feature/new-feature
```

### Making Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/new-feature
```

### Commit Message Convention

Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test updates
- `chore`: Build, dependencies, tooling

Examples:
```
feat: Add pricing calculator
fix: Resolve header alignment issue
docs: Update API documentation
refactor: Reorganize component structure
```

### Pushing Changes

With c3ops SSH profile:

```bash
# Ensure you're on the correct branch
git branch

# Push changes
git push origin feature/new-feature

# For live branch
git push origin live
```

See [Multiple GitHub Profiles](./MULTIPLE_GITHUB_PROFILES.md) for SSH setup.

## Testing

### Running Tests

```bash
npm run test
```

(Current: No test suite configured. Add Jest/Vitest as needed)

### Testing Types

- **Unit Tests**: Test individual utilities, functions
- **Component Tests**: Test React components
- **Integration Tests**: Test API integration
- **E2E Tests**: Test complete user flows

## Debugging

### Frontend Debugging

1. Use Chrome DevTools (F12)
2. React DevTools extension
3. Vue DevTools extension
4. Console for debugging:

```javascript
console.log('Value:', value);
console.error('Error:', error);
console.table(data); // Pretty print arrays/objects
```

### Backend Debugging

1. Node Inspector:
```bash
node --inspect server/index.js
```

2. VS Code Debugger configuration in `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

3. Console logging:
```javascript
console.log('Request:', req.body);
console.error('Error:', error.message);
```

## Deployment

### Frontend Deployment (S3 + CloudFront)

```bash
npm run build
# Upload dist/ to S3
# Invalidate CloudFront distribution
```

See [BACKEND_DEPLOYMENT_GUIDE.md](../BACKEND_DEPLOYMENT_GUIDE.md) for detailed steps.

### Backend Deployment (Lambda)

```bash
# Deploy to Lambda
serverless deploy

# Or manual: Build and upload to AWS Lambda
```

See [LAMBDA_DEPLOYMENT.md](../LAMBDA_DEPLOYMENT.md) for details.

## Troubleshooting

### Common Issues

**Port 5000 already in use:**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Git authentication failed:**
```bash
# Verify SSH configuration
ssh -T git@github.com-c3ops

# Ensure correct remote URL
git remote -v
git remote set-url origin git@github.com-c3ops:c3ops/c3ops-website.git
```

**ESLint errors:**
```bash
npm run lint:fix
```

**Prettier formatting issues:**
```bash
npm run format
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Express.js Documentation](https://expressjs.com)
- [AWS Documentation](https://docs.aws.amazon.com)
- [ESLint Documentation](https://eslint.org)
- [Prettier Documentation](https://prettier.io)

## Support

For questions or issues:
1. Check documentation files
2. Review existing code examples
3. Check GitHub Issues
4. Contact the development team
