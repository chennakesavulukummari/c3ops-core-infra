# Security Guidelines

## 🔐 Protecting Sensitive Data

This document outlines security best practices for the C3OPS repository.

## ⚠️ Critical: Never Commit

### Never commit these to the repository:
- ✗ AWS Access Keys or Secret Keys
- ✗ API tokens or authentication tokens
- ✗ Database passwords or connection strings
- ✗ Private encryption keys
- ✗ JWT secrets or signing keys
- ✗ Third-party API keys
- ✗ OAuth credentials
- ✗ Email service passwords
- ✗ SSH keys
- ✗ Hosted zone IDs (Route53)

### Sensitive File Patterns (Automatically Ignored)
These files are in `.gitignore` and must never be checked in:
```
.env
.env.local
.env.*.local
aws-c3opsio-creds.md
terraform.tfvars
*.pem
*.key
```

## 🔒 Secure Practices

### 1. Environment Variables
```bash
# ✅ CORRECT - Use environment variables
const apiKey = process.env.VITE_API_KEY;
const dbUrl = process.env.DATABASE_URL;

# ✗ WRONG - Never hardcode secrets
const apiKey = "sk-1234567890abcdef";
```

### 2. AWS Credentials Management
```bash
# ✅ Store credentials in ~/.aws/credentials
[c3ops-io]
aws_access_key_id = YOUR_KEY
aws_secret_access_key = YOUR_SECRET

# Use AWS profiles instead of hardcoding
export AWS_PROFILE=c3ops-io
aws s3 ls

# ✗ Never put credentials in:
# - Code files
# - .env files (if committed to git)
# - Documentation
# - Chat logs or emails
```

### 3. Configuration Files
```javascript
// ✅ CORRECT - Read from environment
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  awsRegion: import.meta.env.VITE_AWS_REGION,
};

// ✗ WRONG - Hardcoded values
const config = {
  apiUrl: "https://api.c3ops.io",
  awsKey: "[EXAMPLE_KEY_FORMAT_AKIA...]",
};
```

## 📋 Pre-Commit Checklist

Before committing, verify:
- [ ] No `.env` files are staged
- [ ] No credentials in code comments
- [ ] No API keys in strings
- [ ] No AWS account IDs in documentation
- [ ] `.gitignore` includes all sensitive patterns
- [ ] Run `git diff --staged` to review changes

### Git Commands for Safety
```bash
# Review staged changes before committing
git diff --staged

# Unstage accidentally staged files
git reset HEAD filename

# Check for sensitive patterns
git grep -i "password\|secret\|api.key" HEAD

# View what will be committed
git status
```

## 🚨 If You Accidentally Commit a Secret

### Immediate Actions:
1. **Don't push yet!** Stop before pushing to remote.

2. **Reset the commit** (if not pushed):
   ```bash
   git reset --soft HEAD~1
   git reset HEAD filename  # Unstage the file
   ```

3. **Remove from history** (if already pushed):
   ```bash
   # Using git-filter-repo (recommended)
   git filter-repo --invert-paths --path PATH/TO/SECRETFILE
   
   # Or BFG Repo-Cleaner
   bfg --delete-files filename
   ```

4. **If pushed to GitHub**:
   - Immediately rotate the credentials
   - Review AWS CloudTrail for unauthorized access
   - Contact security team
   - Force push cleaned history: `git push origin main --force`

5. **Verify removal**:
   ```bash
   git log --all -- PATH/TO/FILE
   # Should show no results
   ```

## 🛡️ Securing Different File Types

### TypeScript/JavaScript Files
```typescript
// ✅ Good
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// ✗ Bad
const API_KEY = "sk_live_51234567890";
```

### Terraform Files
```hcl
# ✅ Good - Use terraform.tfvars.example
# terraform.tfvars (ignored by git)
aws_access_key = var.aws_access_key

# ✗ Bad - Never include credentials in code
resource "aws_s3_bucket" "example" {
  bucket = "my-bucket-[ACCESS_KEY_ID_EXAMPLE]"
}
```

### Documentation Files
```markdown
# ✅ Good
AWS Account ID: [REDACTED]
API Key: See ~/.aws/credentials

# ✗ Bad (Example)
AWS Account ID: 123456789012
Access Key: [EXAMPLE_FORMAT_AKIA...]
Secret Key: [EXAMPLE_FORMAT_...]
```

## 🔄 Credential Rotation

### Rotate AWS Credentials
1. Go to AWS IAM Console
2. Create new Access Key
3. Update `.aws/credentials`
4. Deactivate old key (wait 24 hours)
5. Delete old key after verification

### Rotate Other Secrets
- API keys: Generate new ones in service dashboard
- OAuth tokens: Revoke old ones
- Database passwords: Update all connection strings
- API secrets: Generate new secrets

## 📊 Security Audit Checklist

- [ ] `.gitignore` includes all sensitive file patterns
- [ ] No hardcoded API keys in codebase
- [ ] All `.env` files in `.gitignore`
- [ ] `terraform.tfvars` in `.gitignore`
- [ ] AWS credentials in `~/.aws/credentials`, not code
- [ ] No credentials in commit history
- [ ] Environment variables documented in `.env.example`
- [ ] Third-party API keys stored securely
- [ ] SSH/PEM keys in `~/.ssh`, not repo
- [ ] Documentation redacts sensitive IDs

## 🔗 Related Resources

- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Git Security](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)

## 📞 Report Security Issues

Found a security vulnerability?
- **Do NOT** open a public GitHub issue
- Email: security@c3ops.io
- Include: Description, severity, reproduction steps
- Allow 48 hours for response before disclosure

---

**Remember: Security is everyone's responsibility! 🔐**
