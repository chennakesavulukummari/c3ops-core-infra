#!/bin/bash

# C3OPS SEO Setup Wizard
# This script guides you through setting up IndexNow, Google Search Console, and Bing Webmaster Tools
# Run: bash scripts/seo-setup.sh

set -e

echo "================================"
echo "C3OPS SEO Setup Wizard"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: IndexNow Setup
echo -e "${BLUE}Step 1: IndexNow Setup${NC}"
echo "IndexNow allows you to instantly notify search engines when you add new content."
echo ""
echo "To generate your IndexNow key:"
echo "  1. Visit: https://www.indexnow.org"
echo "  2. Click 'Get your key'"
echo "  3. Enter your domain and email"
echo "  4. You'll receive a 40-character key"
echo ""
read -p "Enter your IndexNow key: " INDEXNOW_KEY

if [ -z "$INDEXNOW_KEY" ]; then
  echo -e "${YELLOW}Skipping IndexNow key (can be added later)${NC}"
else
  # Update .env.local
  if [ -f ".env.local" ]; then
    # Update existing key
    sed -i '' "s/^VITE_INDEXNOW_KEY=.*/VITE_INDEXNOW_KEY=$INDEXNOW_KEY/" .env.local
  else
    echo "VITE_INDEXNOW_KEY=$INDEXNOW_KEY" > .env.local
  fi
  
  # Update public/.well-known/indexnow file
  echo "$INDEXNOW_KEY" > public/.well-known/indexnow
  
  echo -e "${GREEN}✓ IndexNow key configured${NC}"
fi

echo ""

# Step 2: Google Search Console Setup
echo -e "${BLUE}Step 2: Google Search Console Setup${NC}"
echo "Get your verification code from Google Search Console:"
echo "  1. Go to: https://search.google.com/search-console"
echo "  2. Add property for your domain"
echo "  3. Choose 'Meta tag' verification method"
echo "  4. Copy the content value from: <meta name=\"google-site-verification\" content=\"...\">"
echo ""
read -p "Enter your Google Site Verification code (or press Enter to skip): " GOOGLE_VERIFY

if [ -n "$GOOGLE_VERIFY" ]; then
  if [ -f ".env.local" ]; then
    sed -i '' "s/^VITE_GOOGLE_SITE_VERIFICATION=.*/VITE_GOOGLE_SITE_VERIFICATION=$GOOGLE_VERIFY/" .env.local
  else
    echo "VITE_GOOGLE_SITE_VERIFICATION=$GOOGLE_VERIFY" >> .env.local
  fi
  echo -e "${GREEN}✓ Google verification code configured${NC}"
else
  echo -e "${YELLOW}Skipping Google verification (can be added later)${NC}"
fi

echo ""

# Step 3: Bing Webmaster Tools Setup
echo -e "${BLUE}Step 3: Bing Webmaster Tools Setup${NC}"
echo "Get your verification code from Bing Webmaster Tools:"
echo "  1. Go to: https://www.bing.com/webmaster"
echo "  2. Add your domain"
echo "  3. Choose 'Meta tag' verification method"
echo "  4. Copy the content value from: <meta name=\"msvalidate.01\" content=\"...\">"
echo ""
read -p "Enter your Bing Verification code (or press Enter to skip): " BING_VERIFY

if [ -n "$BING_VERIFY" ]; then
  if [ -f ".env.local" ]; then
    sed -i '' "s/^VITE_BING_SITE_VERIFICATION=.*/VITE_BING_SITE_VERIFICATION=$BING_VERIFY/" .env.local
  else
    echo "VITE_BING_SITE_VERIFICATION=$BING_VERIFY" >> .env.local
  fi
  echo -e "${GREEN}✓ Bing verification code configured${NC}"
else
  echo -e "${YELLOW}Skipping Bing verification (can be added later)${NC}"
fi

echo ""

# Step 4: Additional Configuration
echo -e "${BLUE}Step 4: Optional Analytics Setup${NC}"
echo ""
read -p "Enter your Google Analytics ID (optional, or press Enter to skip): " GA_ID

if [ -n "$GA_ID" ]; then
  if [ -f ".env.local" ]; then
    sed -i '' "s/^VITE_GOOGLE_GA_ID=.*/VITE_GOOGLE_GA_ID=$GA_ID/" .env.local
  else
    echo "VITE_GOOGLE_GA_ID=$GA_ID" >> .env.local
  fi
fi

read -p "Enter your Google Tag Manager ID (optional, or press Enter to skip): " GTM_ID

if [ -n "$GTM_ID" ]; then
  if [ -f ".env.local" ]; then
    sed -i '' "s/^VITE_GTM_ID=.*/VITE_GTM_ID=$GTM_ID/" .env.local
  else
    echo "VITE_GTM_ID=$GTM_ID" >> .env.local
  fi
fi

echo ""

# Step 5: Summary
echo -e "${BLUE}Step 5: Configuration Summary${NC}"
echo ""
echo "✓ SEO setup complete!"
echo ""
echo "Next steps:"
echo "  1. Build your application: npm run build"
echo "  2. Deploy to your hosting"
echo "  3. Verify in Google Search Console and Bing Webmaster Tools"
echo "  4. Submit your sitemap to both consoles"
echo "  5. Monitor search performance"
echo ""
echo "Configuration stored in: .env.local"
echo ""
echo -e "${GREEN}Setup Complete!${NC}"
echo ""
echo "📚 For more information, see:"
echo "  - SEO-IMPLEMENTATION-SUMMARY.md"
echo "  - SEO-DIGITAL-MARKETING-COMPLETE-GUIDE.md"
echo "  - SEO-CHECKLIST-AND-TIMELINE.md"
