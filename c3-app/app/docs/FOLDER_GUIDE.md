# Project Structure Guide

## Overview

The C3Ops website is organized following industry-standard best practices for React applications. The project structure separates concerns, improves maintainability, and enables scalable development.

## Directory Structure

```
c3ops-website/
├── public/                          # Static assets
│   ├── images/                      # Image files
│   ├── manifest.json               # PWA manifest
│   ├── robots.txt                  # SEO robots file
│   └── sitemap.xml                 # SEO sitemap
├── src/                            # Application source code
│   ├── api/                        # API client and integration
│   │   └── client.js              # Centralized API client
│   ├── components/                 # Reusable React components
│   │   ├── common/                # Generic reusable components
│   │   │   ├── PricingPlans.jsx   # Pricing cards component
│   │   │   └── TypeformModal.jsx  # Typeform integration modal
│   │   ├── features/              # Feature-specific components
│   │   │   ├── IndexNow.tsx       # IndexNow SEO integration
│   │   │   ├── OpenGraphTags.tsx  # Meta tags for social sharing
│   │   │   ├── SearchConsoleIntegration.tsx  # GSC integration
│   │   │   ├── StructuredDataSchema.tsx     # JSON-LD schema
│   │   │   └── AdminDashboard.jsx # Admin features
│   │   └── layouts/               # Page layout components
│   │       ├── SiteHeader.jsx     # Navigation header
│   │       └── SiteFooter.jsx     # Footer component
│   ├── constants/                 # Application constants
│   │   └── index.js              # Configuration, routes, endpoints
│   ├── hooks/                     # Custom React hooks
│   │   └── useGoogleAnalytics.tsx # GA4 analytics hook
│   ├── pages/                     # Page components (route-based)
│   │   ├── Platform.jsx
│   │   ├── Pricing.jsx
│   │   ├── Contact.jsx
│   │   ├── Documentation.jsx
│   │   ├── Blog.jsx
│   │   ├── CaseStudies.jsx
│   │   ├── AboutUs.jsx
│   │   ├── Careers.jsx
│   │   ├── Testimonials.jsx
│   │   ├── OurDifferentiators.jsx
│   │   ├── Whitepapers.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Terms.jsx
│   │   ├── Cookies.jsx
│   │   ├── Deck.jsx
│   │   ├── DocumentationTest.jsx
│   │   ├── knowledge/            # Knowledge base pages
│   │   │   └── KnowledgePage.jsx
│   ├── services/                 # External service integrations
│   │   └── emailService.js      # Email service (EmailJS)
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Global types and interfaces
│   ├── utils/                    # Utility functions
│   │   └── index.js             # Helper functions, validators
│   ├── App.jsx                  # Root application component
│   ├── App.css                  # Application-wide styles
│   ├── index.css                # Global CSS
│   ├── main.jsx                 # React entry point
│   └── vite-env.d.ts           # Vite environment types
├── server/                       # Backend Express server
│   ├── api/                     # API route handlers
│   ├── middleware/              # Express middleware
│   ├── utils/                   # Server utilities
│   ├── config/                  # Server configuration
│   ├── index.js                # Main server file
│   └── lambda.js               # AWS Lambda handler
├── lambda/                       # Lambda functions
│   ├── handler.js              # Main Lambda handler
│   ├── typeform-handler.js     # Typeform webhook handler
│   ├── index.py                # Python Lambda
│   └── package.json            # Lambda dependencies
├── terraform/                    # Infrastructure as Code
│   ├── api_gateway.tf          # API Gateway configuration
│   ├── dynamodb.tf             # DynamoDB tables
│   ├── ...                     # Other Terraform files
├── scripts/                      # Build and deployment scripts
│   ├── deploy/                 # Deployment scripts
│   ├── setup/                  # Setup scripts
│   └── seo-setup.sh           # SEO configuration
├── docs/                         # Documentation
│   ├── SECURITY.md             # Security guidelines
│   ├── ARCHITECTURE.md         # Technical architecture
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   ├── MULTIPLE_GITHUB_PROFILES.md
│   └── ...                     # Other documentation
├── config/                       # Application configuration
├── .husky/                       # Git hooks
├── .prettierrc.json             # Prettier formatting config
├── .prettierignore              # Prettier ignore rules
├── .eslintrc.cjs                # ESLint configuration
├── .gitignore                   # Git ignore rules
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
└── index.html                  # HTML entry point
```

## Directory Purposes

### `/src/components`

Reusable React components organized by type:

- **common/**: Generic components used across multiple features (PricingPlans, TypeformModal)
- **features/**: Feature-specific components with special functionality (SEO, Analytics, Admin)
- **layouts/**: Page layout components (Header, Footer) used across pages

### `/src/pages`

Page components corresponding to routes. Each page typically:
- Imports layout components
- Uses custom hooks for data
- Composes multiple feature/common components

### `/src/api`

Centralized API client and integration:
- `client.js`: Base API client with GET, POST, PUT, DELETE methods
- Handles base URL configuration from environment variables
- Provides error handling and response parsing

### `/src/constants`

Application-wide constants:
- App configuration (name, version, contact info)
- API endpoints
- Route definitions
- Feature flags
- Social media links

### `/src/hooks`

Custom React hooks:
- `useGoogleAnalytics.tsx`: Analytics tracking
- Can be extended with useAuth, useForm, etc.

### `/src/utils`

Helper functions:
- String utilities: capitalize, truncate, slugify
- Object utilities: deepClone, mergeObjects
- Array utilities: unique, groupBy
- Validation: isEmail, isValidUrl
- Number formatting: formatCurrency
- Local storage management

### `/src/types`

TypeScript type definitions:
- API response types
- User and domain types
- Component prop types
- Environment variable types
- Form state types

### `/server`

Backend Express application:
- **api/**: Route handlers and controllers
- **middleware/**: Express middleware (CORS, auth, logging)
- **utils/**: Server utilities (database, email)
- **config/**: Configuration files

### `/terraform`

Infrastructure as Code for AWS:
- API Gateway setup
- DynamoDB tables
- Lambda functions
- S3 buckets
- CloudFront distribution

### `/scripts`

Build and deployment automation:
- **deploy/**: Deployment scripts (S3, CloudFront, Lambda)
- **setup/**: Initial setup scripts (AWS credentials, Terraform)

## Development Workflow

### Running the Application

```bash
# Development server
npm run dev

# Full stack (frontend + backend)
npm run dev:full

# Build for production
npm run build

# Preview production build
npm run preview

# Start backend server
npm run server
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## Naming Conventions

### Components
- Use PascalCase for component names: `MyComponent.jsx`
- Use consistent suffixes: `*Page.jsx` for pages, `*Card.jsx` for cards

### Hooks
- Prefix with `use`: `useGoogleAnalytics.tsx`

### Files
- Use `.jsx` for React components (JavaScript + JSX)
- Use `.ts`/`.tsx` for TypeScript files
- Use `.js` for utility/helper files

### Functions & Variables
- Use camelCase: `getUserData()`, `isValidEmail`
- Constants in UPPERCASE: `API_ENDPOINT`, `MAX_RETRIES`

## Import Organization

```javascript
// 1. External dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Local components
import SiteHeader from '../components/layouts/SiteHeader';
import { PricingPlans } from '../components/common';

// 3. Utilities & hooks
import { apiClient } from '../api/client';
import { useGoogleAnalytics } from '../hooks';
import { slugify } from '../utils';

// 4. Constants
import { ROUTES, API_ENDPOINTS } from '../constants';

// 5. Styles
import styles from './MyComponent.css';
```

## Environment Variables

Configure in `.env` and `.env.local`:

```
VITE_API_ENDPOINT=https://api.example.com
VITE_API_URL=https://api.example.com
VITE_GOOGLE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXX
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
VITE_INDEXNOW_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Best Practices

1. **Single Responsibility**: Each component/function should have one clear purpose
2. **Reusability**: Create common components for repeated UI patterns
3. **Type Safety**: Use TypeScript for better type checking
4. **Error Handling**: Always handle API errors and edge cases
5. **Performance**: Use React.memo for expensive components, lazy load pages
6. **Accessibility**: Use semantic HTML, ARIA labels where needed
7. **Testing**: Write tests for utilities, hooks, and critical components

## Adding New Features

1. Create page in `/src/pages` if route-based
2. Create reusable components in `/src/components/{common,features}`
3. Add constants in `/src/constants` if needed
4. Add utilities in `/src/utils` for helper functions
5. Define types in `/src/types` if TypeScript
6. Update routing in `App.jsx`
7. Update tests if applicable

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture decisions
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](./SECURITY.md) - Security practices
