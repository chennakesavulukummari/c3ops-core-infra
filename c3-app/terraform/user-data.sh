#!/bin/bash
set -e

# Log all output
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user-data script..."

# Update system packages
yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install git
yum install -y git

# Create application directory
mkdir -p /opt/app
cd /opt/app

# Clone application code from CodeCommit (adjust repository URL as needed)
# This is a placeholder - update with your actual repository
# git clone https://git-codecommit.${region}.amazonaws.com/v1/repos/c3ops-website .

# Install dependencies
npm install

# Create .env file with placeholder values
cat > /opt/app/.env << EOF
NODE_ENV=production
PORT=3000
AWS_REGION=${region}
APP_NAME=${app_name}
ENVIRONMENT=${environment}
EOF

# Build the application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "${app_name}" -- start
pm2 startup
pm2 save

# Install and start CloudWatch agent (optional)
# This helps with monitoring application logs

echo "User-data script completed successfully!"
