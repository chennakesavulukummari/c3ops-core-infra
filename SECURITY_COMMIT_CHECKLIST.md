# Security & Git Commit Checklist

Before committing your code to GitHub, please review this checklist to ensure no sensitive information is exposed.

## ✅ Pre-Commit Security Checklist

### Environment Variables & Secrets
- [ ] No `.env` files are staged for commit
- [ ] No hardcoded API keys in any files
- [ ] No AWS access keys or secret keys in code
- [ ] No database passwords in files
- [ ] No API tokens or authentication tokens in code
- [ ] No OAuth credentials in files
- [ ] No JWT secrets or signing keys in code

### AWS & Cloud Credentials
- [ ] No AWS Access Key IDs hardcoded
- [ ] No AWS Secret Access Keys in files
- [ ] No AWS account IDs in code (only in comments as [REDACTED])
- [ ] No hosted zone IDs in non-documentation files
- [ ] No CloudFront distribution IDs in sensitive files
- [ ] Terraform state files (*.tfstate) not staged
- [ ] terraform.tfvars files not staged

### Private Keys & Certificates
- [ ] No *.pem files staged
- [ ] No *.key files staged
- [ ] No SSH keys (.ssh/) staged
- [ ] No SSL certificates staged
- [ ] No PGP/GPG keys staged

### Files & Patterns to Ignore
The following patterns are automatically ignored by .gitignore:
- `*.tfvars` and `*.tfvars.json` (Terraform variables)
- `.env`, `.env.local`, `.env.*.local` (Environment files)
- `*.pem`, `*.key` (Private keys)
- `*.tfstate`, `*.tfstate.*` (Terraform state)
- `aws-credentials.txt`, `*-creds.md` (Credentials)
- `node_modules/`, `dist/`, `build/` (Build artifacts)

## 🔒 Secure Development Practices

### 1. Using Environment Variables
```bash
# ✅ CORRECT - Read from .env file
const apiKey = process.env.VITE_API_KEY;

# ✗ WRONG - Never hardcode
const apiKey = "sk-1234567890abcdef";
```

### 2. AWS Credentials
```bash
# ✅ Store in ~/.aws/credentials
[c3ops-io]
aws_access_key_id = YOUR_KEY
aws_secret_access_key = YOUR_SECRET

# Use AWS profile
export AWS_PROFILE=c3ops-io

# ✗ Never in code or files
export AWS_ACCESS_KEY_ID="AKIA..."
```

### 3. Terraform Files
```hcl
# ✅ Use terraform.tfvars (git-ignored)
db_password = var.db_password

# ✗ Never hardcode
db_password = "MySecretPassword123"
```

## 📋 Git Commands for Safety

### Review changes before committing
```bash
# See all staged changes
git diff --staged

# See all unstaged changes
git diff

# Review file by file
git status
```

### Prevent accidental commits
```bash
# Don't stage all files blindly
git add .

# Instead, stage specific files
git add src/components/
git add package.json

# Use interactive staging
git add -p  # Review each change individually

# Unstage accidentally added files
git reset HEAD .env
git reset HEAD terraform.tfvars
```

### If you accidentally commit sensitive data
```bash
# Option 1: Amend the last commit (if not pushed)
git reset HEAD~1
git add . # Add only safe files
git commit -m "Fixed commit"

# Option 2: Remove from commit history
git filter-branch --tree-filter 'rm -f .env' HEAD
git push --force

# Option 3: Use git-filter-repo (recommended)
git filter-repo --path .env --invert-paths
```

## 🚨 If Sensitive Data Is Exposed

### Immediate Actions
1. **STOP all work** - Don't push anything else
2. **Identify** what was exposed (keys, passwords, tokens)
3. **ROTATE** all exposed credentials immediately
4. **REMOVE** from Git history
5. **AUDIT** access logs
6. **NOTIFY** security team

### AWS Credentials Compromise (CRITICAL)
```bash
1. Go to AWS IAM Console: https://console.aws.amazon.com/iam/
2. Delete the compromised access keys immediately
3. Create new access keys
4. Update ~/.aws/credentials with new keys
5. Review CloudTrail for unauthorized activity
6. Enable MFA if not already enabled
```

## 📚 Sensitive File Patterns to Avoid

### Never Commit These Files/Patterns:
- `.env*` - Environment variables
- `*.pem`, `*.key` - Private keys
- `*-creds.md`, `*-secret.md` - Credential documentation
- `terraform.tfvars` - Terraform variables
- `*.tfstate` - Terraform state
- `aws-credentials.txt` - AWS credential files
- `credentials.json`, `secrets.json` - Credential files
- `.aws/` - AWS configuration

### Use Example Files Instead:
- `.env.example` - Template for .env
- `terraform.tfvars.example` - Template for terraform.tfvars
- `config.example.json` - Template for config.json

## ✅ Final Security Check

Before pushing to GitHub:

```bash
# 1. Check for common patterns
git grep -i "password\|secret\|key\|token\|credential" -- '*.js' '*.ts' '*.py' '*.go'

# 2. Check for environment files
git status | grep -E "\.env|\.pem|\.key|credentials|secrets|tfvars"

# 3. Verify .gitignore is working
git check-ignore -v .env

# 4. Preview your push
git log origin/main..HEAD

# 5. Final safety check
git diff origin/main -- .
```

## 📞 Questions or Issues?

If you're unsure about whether a file should be committed:
- Assume it's sensitive if it contains configuration
- When in doubt, add it to .gitignore
- Review similar projects on GitHub
- Ask the security team

## 🔗 Resources

- [Git Security Documentation](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Terraform Security Best Practices](https://www.terraform.io/docs/cloud/security/index.html)

---

**Remember**: It's always better to be over-protective with secrets than to expose them! 🔒
