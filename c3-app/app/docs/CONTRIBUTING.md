# Contributing to C3OPS

## 🤝 Welcome Contributors!

This guide will help you get started with contributing to the C3OPS platform.

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Code Standards](#code-standards)
7. [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Report security issues privately (don't open public issues)
- No harassment or discrimination

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React and JavaScript/TypeScript

### Fork and Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/c3ops-website.git
cd c3ops-website

# Add upstream remote
git remote add upstream https://github.com/c3ops/c3ops-website.git
```

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### 3. Start Development Server
```bash
# Frontend (port 5173)
npm run dev

# Backend (port 3000) - in another terminal
npm run server

# Or both together
npm run dev:full
```

### 4. Verify Setup
- Open http://localhost:5173
- Frontend should load without errors
- Check console for any warnings

## Making Changes

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

#### Frontend Changes
- Add components to `src/components/` or `src/pages/`
- Add styles with Tailwind CSS classes
- Use existing components as examples
- Test on multiple screen sizes

#### Backend Changes
- Update `server/` or `lambda/` files
- Test Lambda functions locally
- Update API Gateway routes if needed

#### Documentation Changes
- Update relevant docs in `/docs/`
- Keep docs clear and concise
- Include code examples where helpful

### 3. Test Your Changes
```bash
# Lint code
npm run lint

# Build production version
npm run build

# Test locally
npm run dev
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: Add new feature description"
```

## Submitting Changes

### 1. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request
- Go to GitHub and click "New Pull Request"
- Fill in the PR template with:
  - **Title**: Clear, concise description
  - **Description**: What changes and why
  - **Related Issues**: Link to any related issues
  - **Testing**: How you tested the changes
  - **Checklist**: Mark completed items

### 3. PR Review Process
- Project maintainers will review your code
- Respond to feedback and make requested changes
- Once approved, your PR will be merged!

## Code Standards

### File Structure
```
src/
├── components/           # Reusable components
├── pages/               # Full pages
├── services/            # API services
├── assets/              # Static files
└── hooks/               # Custom React hooks
```

### Naming Conventions
- **Files**: PascalCase for components (`.jsx`), camelCase for utilities (`.js`)
- **Components**: PascalCase (e.g., `HeaderNav.jsx`)
- **Functions**: camelCase (e.g., `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)

### Component Example
```jsx
import React from 'react';

export const MyComponent = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white p-4 rounded-lg">
      <button onClick={handleToggle}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
```

### Styling
- Use Tailwind CSS classes (no custom CSS unless necessary)
- Follow existing design patterns
- Maintain responsive design
- Check contrast ratios for accessibility

### JavaScript/TypeScript
- Use modern ES6+ syntax
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names
- Avoid `var`, prefer `const` and `let`

### Testing
- Test locally before submitting PR
- Verify responsive design
- Check browser console for errors
- Test with different screen sizes

## Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactor without feature changes
- `perf`: Performance improvement
- `test`: Add or update tests
- `chore`: Maintenance tasks

### Examples
```
feat(components): Add new card component
fix(header): Fix navigation menu alignment
docs: Update installation instructions
refactor(services): Simplify API client
```

## 🔐 Security Considerations

### Before Committing
- ✅ Check that no `.env` files are staged
- ✅ Verify no AWS credentials in code
- ✅ Ensure no API keys in strings
- ✅ Review git diff: `git diff --staged`

### What NOT to Commit
- `.env` files or credentials
- `aws-c3opsio-creds.md`
- API keys, tokens, or secrets
- `node_modules/`
- Build artifacts (`/dist`, `/build`)

## Issues and Bugs

### Reporting Bugs
1. Check existing issues first
2. Provide clear reproduction steps
3. Include expected vs. actual behavior
4. Add screenshots if applicable

### Suggesting Features
1. Check for related issues
2. Explain the use case
3. Describe the proposed solution
4. Consider performance implications

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Git Workflow](https://git-scm.com)
- [Architecture Doc](./ARCHITECTURE.md)

## 🙏 Thank You!

Thank you for contributing to C3OPS! Your efforts help make this platform better for everyone.

## Questions?

- Check existing documentation in `/docs`
- Ask in GitHub discussions (when available)
- Email: contributors@c3ops.io

---

**Happy coding! 🚀**
