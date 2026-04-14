#!/bin/bash

# 🔐 C3OPS.io AWS Credentials Setup
# Secure credential management for Terraform

set -e

echo "=========================================="
echo "🔐 C3OPS.io AWS Credentials Setup"
echo "=========================================="
echo ""

# ⚠️  SECURITY WARNING
cat <<'EOF'
⚠️  SECURITY WARNING:
════════════════════════════════════════════════════════════════════════════

Your AWS credentials have been exposed in plain text. You MUST:

1. ✅ IMMEDIATELY rotate these credentials in AWS Console
   https://console.aws.amazon.com/iam/

2. ✅ DELETE this script after setup (contains sensitive info)

3. ✅ NEVER commit .aws/credentials to Git

4. ✅ Use AWS profiles instead of environment variables

5. ✅ Enable MFA on your AWS root account

6. ✅ Audit IAM user permissions (svc-c3ops.io)

════════════════════════════════════════════════════════════════════════════
EOF

echo ""
read -p "I understand and will rotate credentials immediately. Press Enter to continue: " confirm

# Create AWS credentials file securely
AWS_CREDS_DIR="$HOME/.aws"
mkdir -p "$AWS_CREDS_DIR"

# Set restrictive permissions
chmod 700 "$AWS_CREDS_DIR"

# Backup existing credentials
if [ -f "$AWS_CREDS_DIR/credentials" ]; then
    echo ""
    echo "📋 Backing up existing credentials..."
    cp "$AWS_CREDS_DIR/credentials" "$AWS_CREDS_DIR/credentials.backup.$(date +%s)"
    chmod 600 "$AWS_CREDS_DIR/credentials.backup."*
    echo "✅ Backup created"
fi

# Create credentials file
echo ""
echo "📝 Writing credentials to ~/.aws/credentials..."

cat >> "$AWS_CREDS_DIR/credentials" <<EOF

[c3ops-io]
aws_access_key_id = [YOUR_AWS_ACCESS_KEY_ID]
aws_secret_access_key = [YOUR_AWS_SECRET_ACCESS_KEY]
region = ap-south-2
EOF

# Set restrictive permissions on credentials file
chmod 600 "$AWS_CREDS_DIR/credentials"
echo "✅ Credentials written securely"

# Create config file
if [ ! -f "$AWS_CREDS_DIR/config" ]; then
    cat > "$AWS_CREDS_DIR/config" <<EOF
[profile c3ops-io]
region = ap-south-2
output = json
EOF
    chmod 600 "$AWS_CREDS_DIR/config"
    echo "✅ AWS config created"
fi

# Verify credentials
echo ""
echo "🔍 Verifying credentials..."

export AWS_PROFILE=c3ops-io

if aws sts get-caller-identity > /dev/null 2>&1; then
    echo "✅ Credentials verified!"
    echo ""
    aws sts get-caller-identity --output table
else
    echo "❌ Failed to verify credentials"
    exit 1
fi

# File permissions check
echo ""
echo "🔐 Checking file permissions..."
CREDENTIALS_PERMS=$(stat -f %OLp "$AWS_CREDS_DIR/credentials" 2>/dev/null || stat -c %a "$AWS_CREDS_DIR/credentials" 2>/dev/null)
if [ "$CREDENTIALS_PERMS" = "600" ]; then
    echo "✅ Credentials file permissions are secure (600)"
else
    echo "⚠️  WARNING: Credentials file has permissive permissions: $CREDENTIALS_PERMS"
    chmod 600 "$AWS_CREDS_DIR/credentials"
    echo "✅ Fixed to 600"
fi

# Setup Terraform environment
echo ""
echo "🚀 Setting up Terraform environment..."

# Create .env file (for reference, don't commit)
cat > ".env.c3ops-io" <<EOF
# C3OPS.io AWS Configuration
# NEVER commit this file to Git!

export AWS_PROFILE=c3ops-io
export AWS_REGION=ap-south-2
export TERRAFORM_VAR_aws_region=ap-south-2

# For manual use (not recommended):
# export AWS_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY_ID]
# export AWS_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_ACCESS_KEY]
EOF

chmod 600 ".env.c3ops-io"
echo "✅ Created .env.c3ops-io (add to .gitignore)"

# Add to .gitignore
if ! grep -q "\.env\.c3ops-io" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# AWS Credentials" >> .gitignore
    echo ".env.c3ops-io" >> .gitignore
    echo ".aws/credentials" >> .gitignore
    echo ".aws/config" >> .gitignore
    echo "terraform/terraform.tfvars" >> .gitignore
    echo "terraform/tfplan*" >> .gitignore
    echo "✅ Updated .gitignore"
fi

# Usage instructions
echo ""
echo "=========================================="
echo "✅ SETUP COMPLETE"
echo "=========================================="
echo ""
echo "📌 Next Steps:"
echo ""
echo "1. Rotate AWS credentials:"
echo "   https://console.aws.amazon.com/iam/"
echo ""
echo "2. Use AWS profile for all commands:"
echo "   export AWS_PROFILE=c3ops-io"
echo ""
echo "3. Or source the environment file:"
echo "   source .env.c3ops-io"
echo ""
echo "4. Initialize Terraform:"
echo "   cd terraform"
echo "   terraform init"
echo ""
echo "5. Plan deployment:"
echo "   terraform plan"
echo ""
echo "⚠️  IMPORTANT SECURITY REMINDERS:"
echo "   ❌ Never share your credentials"
echo "   ❌ Never commit .aws/credentials to Git"
echo "   ❌ Never use credentials in code"
echo "   ✅ Rotate credentials quarterly"
echo "   ✅ Use AWS profiles instead of env vars"
echo "   ✅ Enable MFA on AWS account"
echo "   ✅ Monitor IAM user activity"
echo ""
echo "📚 Documentation:"
echo "   - Terraform: terraform/README.md"
echo "   - Deployment: TERRAFORM_DEPLOYMENT_GUIDE.md"
echo "   - AWS IAM: https://docs.aws.amazon.com/iam/"
echo ""
echo "=========================================="
echo ""

# Final warning
echo "🔐 SECURITY CHECKLIST:"
echo ""
echo "Before deploying to production:"
echo "  [ ] Credentials rotated in AWS Console"
echo "  [ ] .aws/credentials has 600 permissions"
echo "  [ ] .env.c3ops-io added to .gitignore"
echo "  [ ] MFA enabled on AWS account"
echo "  [ ] Backup created"
echo "  [ ] IAM permissions reviewed (least privilege)"
echo "  [ ] CloudTrail enabled for audit logging"
echo ""
