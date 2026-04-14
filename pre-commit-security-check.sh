#!/bin/bash
# Pre-commit security verification script
# Run this before pushing to GitHub to ensure no sensitive data will be exposed

set -e

echo "🔐 Running Pre-Commit Security Verification..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize counters
ERRORS=0
WARNINGS=0

echo "📋 Checking for sensitive patterns in staged files..."
echo ""

# Function to check for patterns
check_pattern() {
    local pattern=$1
    local description=$2
    echo -n "  Checking for $description... "
    
    if git diff --staged | grep -i "$pattern" > /dev/null; then
        echo -e "${RED}❌ FOUND${NC}"
        echo "    ⚠️  Sensitive pattern detected: $pattern"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅${NC}"
    fi
}

# Check for common sensitive patterns
check_pattern "aws_access_key" "AWS Access Keys"
check_pattern "aws_secret_access_key" "AWS Secret Keys"
check_pattern "AKIA" "AWS Key Format"
check_pattern "password\s*=" "Hardcoded Passwords"
check_pattern "api.key\|apikey\|api_key" "API Keys"
check_pattern "BEGIN RSA PRIVATE KEY\|BEGIN PRIVATE KEY\|BEGIN OPENSSH PRIVATE KEY" "Private Keys"
check_pattern "Authorization:\|Bearer\|token\s*=" "Auth Tokens"

echo ""
echo "🔍 Checking .gitignore effectiveness..."
echo ""

# Check critical files are gitignored
check_gitignored() {
    local file=$1
    echo -n "  Checking $file is ignored... "
    if git check-ignore "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        if [ -f "$file" ]; then
            echo -e "${RED}❌ NOT IGNORED${NC}"
            WARNINGS=$((WARNINGS + 1))
        else
            echo -e "${GREEN}✅${NC} (file doesn't exist)"
        fi
    fi
}

check_gitignored ".env"
check_gitignored "terraform.tfvars"
check_gitignored ".aws/credentials"

echo ""
echo "📁 Checking for untracked sensitive files..."
echo ""

# Check for sensitive files in working directory
find_sensitive() {
    local pattern=$1
    local description=$2
    if git ls-files --others --exclude-standard | grep -i "$pattern" > /dev/null; then
        echo -e "  ${YELLOW}⚠️  Warning: Untracked $description files found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
}

find_sensitive "\.env" "environment variable"
find_sensitive "\.pem\|\.key" "key file"
find_sensitive "credentials" "credential"
find_sensitive "secrets" "secret"

echo ""
echo "📊 Staged Files Summary:"
echo ""

# Count changes by type
echo "  Modified files:"
git diff --staged --name-only | grep -v "^$" | wc -l | xargs echo "   -"

echo "  Untracked files:"
git ls-files --others --exclude-standard | wc -l | xargs echo "   -"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final verdict
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ SECURITY CHECK PASSED${NC}"
    echo ""
    echo "Your code is ready to commit safely to GitHub!"
    echo ""
    echo "Next steps:"
    echo "  git commit -m 'Deploy C3OPS infrastructure with app'"
    echo "  git push"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  SECURITY CHECK PASSED WITH WARNINGS${NC}"
    echo ""
    echo "Warnings found: $WARNINGS"
    echo "Please review them before proceeding."
    echo ""
    exit 0
else
    echo -e "${RED}❌ SECURITY CHECK FAILED${NC}"
    echo ""
    echo "Critical issues found: $ERRORS"
    echo "Please fix these issues before committing:"
    echo ""
    echo "1. Remove sensitive data from staged files"
    echo "2. Run: git reset HEAD <file> to unstage"
    echo "3. Review SECURITY_COMMIT_CHECKLIST.md for guidance"
    echo ""
    exit 1
fi
