# Backend Deployment Guide

## Option 1: AWS Lambda + API Gateway (Recommended - Serverless)

### Prerequisites
- AWS CLI configured
- Node.js installed

### Steps

1. **Install Serverless Framework**
```bash
npm install -g serverless
```

2. **Create `serverless.yml` in project root**
3. **Deploy to AWS**
```bash
serverless deploy
```

4. **Update Frontend with API URL**
- Copy the API Gateway endpoint URL from deployment output
- Update `.env` file: `VITE_API_URL=https://your-api-gateway-url`
- Rebuild and redeploy frontend

---

## Option 2: AWS EC2 (Traditional Server)

### Steps

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier eligible)
   - Allow HTTP/HTTPS in security group

2. **SSH into EC2 and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone your code or upload
git clone your-repo
cd FinOps DrivenDevOps

# Install dependencies
npm install

# Create .env file with your Gmail credentials
nano .env

# Start server with PM2
pm2 start server/index.js --name c3ops-api
pm2 startup
pm2 save
```

3. **Configure Nginx (Optional but recommended)**
```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/c3ops-api

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location / {
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

4. **Update Frontend**
- Update `.env`: `VITE_API_URL=http://your-ec2-ip` or `https://your-domain.com`
- Rebuild and redeploy

---

## Option 3: AWS Elastic Beanstalk (Easiest)

### Steps

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
cd /path/to/FinOps DrivenDevOps
eb init -p node.js-18 c3ops-api --region us-east-1
```

3. **Create `.ebextensions/environment.config`**
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    GMAIL_USER: info@c3ops.io
    GMAIL_APP_PASSWORD: "[YOUR_GMAIL_APP_PASSWORD]"
    GMAIL_TO_EMAIL: info@c3ops.io
    PORT: 8080
```

4. **Deploy**
```bash
eb create c3ops-api-env
```

5. **Update Frontend**
- Get EB URL: `eb status`
- Update `.env`: `VITE_API_URL=http://your-eb-url`
- Rebuild and redeploy

---

## Quick Comparison

| Option | Cost | Complexity | Scalability | Best For |
|--------|------|------------|-------------|----------|
| Lambda + API Gateway | ~$0-5/mo | Medium | Excellent | Low-medium traffic |
| EC2 | ~$8-15/mo | Low | Manual | Predictable traffic |
| Elastic Beanstalk | ~$15-30/mo | Very Low | Automatic | Quick deployment |

---

## Current Issue

Your S3-hosted frontend is trying to connect to `http://localhost:3001`, which only exists on your local machine. Browsers can't access localhost from a deployed website.

**Solution:** Deploy the backend using one of the options above, then update your frontend's API URL and redeploy.
