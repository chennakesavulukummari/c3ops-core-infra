# Backend Deployment Guide

Your frontend is deployed to S3, but the backend API needs to be hosted separately. Here are your options:

## Option 1: AWS Lambda + API Gateway (Recommended)

### Step 1: Install AWS SAM CLI
```bash
brew install aws-sam-cli
```

### Step 2: Create SAM Template
Create `template.yaml`:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Parameters:
  GmailUser:
    Type: String
    Default: info@c3ops.io
  GmailAppPassword:
    Type: String
    NoEcho: true
  GmailToEmail:
    Type: String
    Default: info@c3ops.io

Resources:
  EmailApi:
    Type: AWS::Serverless::Function
    Properties:
      Handler: handler.handler
      Runtime: nodejs18.x
      CodeUri: lambda/
      Environment:
        Variables:
          GMAIL_USER: !Ref GmailUser
          GMAIL_APP_PASSWORD: !Ref GmailAppPassword
          GMAIL_TO_EMAIL: !Ref GmailToEmail
      Events:
        SendEmail:
          Type: Api
          Properties:
            Path: /api/send-demo-request
            Method: post
        Options:
          Type: Api
          Properties:
            Path: /api/send-demo-request
            Method: options

Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
```

### Step 3: Deploy
```bash
cd /Users/ck/Documents/FinOps DrivenDevOps
sam build
sam deploy --guided
```

### Step 4: Update Frontend
After deployment, you'll get an API URL like:
`https://abc123.execute-api.us-east-1.amazonaws.com/Prod/`

Update `.env`:
```
VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/Prod
```

Rebuild and redeploy:
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Option 2: AWS EC2 (Traditional Server)

### Step 1: Launch EC2 Instance
- Choose Ubuntu Server 22.04 LTS
- Instance type: t2.micro (free tier)
- Security Group: Allow HTTP (80), HTTPS (443)

### Step 2: SSH and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone or upload your code
git clone your-repo
cd FinOps DrivenDevOps

# Install dependencies
npm install

# Set environment variables
echo "GMAIL_USER=info@c3ops.io" > .env
echo "GMAIL_APP_PASSWORD=your-app-password" >> .env
echo "GMAIL_TO_EMAIL=info@c3ops.io" >> .env
echo "PORT=3001" >> .env

# Start with PM2
pm2 start server/index.js --name c3ops-api
pm2 save
pm2 startup
```

### Step 3: Setup Nginx Reverse Proxy
```bash
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/c3ops-api

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/c3ops-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL with Let's Encrypt (Optional)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Step 5: Update Frontend
```bash
# Update .env
VITE_API_URL=https://your-domain.com

# Rebuild and redeploy
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Option 3: AWS Elastic Beanstalk

### Step 1: Install EB CLI
```bash
pip install awsebcli
```

### Step 2: Initialize and Deploy
```bash
cd /Users/ck/Documents/FinOps DrivenDevOps
eb init -p node.js c3ops-api --region us-east-1
eb create c3ops-api-env

# Set environment variables
eb setenv GMAIL_USER=info@c3ops.io GMAIL_APP_PASSWORD=your-password GMAIL_TO_EMAIL=info@c3ops.io

# Deploy
eb deploy
```

### Step 3: Get URL and Update Frontend
```bash
eb status  # Get the URL

# Update .env with the EB URL
VITE_API_URL=http://your-app.us-east-1.elasticbeanstalk.com

# Rebuild and redeploy
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Quick Test (Option 2 - Simplest)

If you just want to test quickly without AWS backend:

### Use a Free Backend Hosting Service

**Render.com (Free tier available):**
1. Go to https://render.com
2. Sign up and create a new "Web Service"
3. Connect your GitHub repo or upload code
4. Set build command: `npm install`
5. Set start command: `node server/index.js`
6. Add environment variables (GMAIL_USER, GMAIL_APP_PASSWORD, etc.)
7. Deploy

You'll get a URL like: `https://your-app.onrender.com`

Update `.env`:
```
VITE_API_URL=https://your-app.onrender.com
```

Rebuild and redeploy to S3:
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

---

## Current Issue

Your frontend at S3 is trying to call `http://localhost:3001` which doesn't exist in production. You need to:

1. Choose a backend hosting option above
2. Deploy the backend
3. Get the production API URL
4. Update `VITE_API_URL` in `.env`
5. Rebuild frontend: `npm run build`
6. Redeploy to S3: `aws s3 sync dist/ s3://your-bucket-name --delete`

**Recommended:** Use AWS Lambda + API Gateway for serverless, cost-effective backend.
