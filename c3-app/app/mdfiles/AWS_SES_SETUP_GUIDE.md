# AWS SES Email Setup Guide

This guide will help you set up email functionality using AWS SES (Simple Email Service) for the C3Ops demo request form.

## 🚀 Why AWS SES?

- ✅ **Professional & Reliable** - Enterprise-grade email delivery
- ✅ **Cost-Effective** - $0.10 per 1,000 emails (62,000 free emails/month for first 12 months)
- ✅ **No Third-Party Dependencies** - Direct AWS integration
- ✅ **High Deliverability** - Better inbox placement
- ✅ **Scalable** - Handle unlimited emails
- ✅ **Your Own Domain** - Send from info@c3ops.io directly

## 📋 Prerequisites

- AWS Account (create at https://aws.amazon.com)
- Access to info@c3ops.io email (for verification)
- Basic AWS knowledge (we'll guide you through)

---

## Step 1: Set Up AWS SES

### 1.1 Sign in to AWS Console

1. Go to https://console.aws.amazon.com
2. Sign in to your AWS account
3. Select your preferred region (e.g., **us-east-1** - US East N. Virginia)

### 1.2 Verify Your Email Address

1. Navigate to **SES (Simple Email Service)** in AWS Console
2. Go to **Verified identities** in the left sidebar
3. Click **Create identity**
4. Choose **Email address**
5. Enter: `info@c3ops.io`
6. Click **Create identity**
7. Check your email inbox at info@c3ops.io
8. Click the verification link in the email from AWS

✅ Your email is now verified!

### 1.3 Move Out of Sandbox Mode (Important!)

By default, SES is in sandbox mode (can only send to verified emails).

**To send to any email address:**

1. In SES Console, go to **Account dashboard**
2. Look for **Sending status**: "In sandbox"
3. Click **Request production access**
4. Fill out the form:
   - **Mail Type**: Transactional
   - **Website URL**: www.c3ops.io
   - **Use case description**: 
     ```
     We are C3Ops Technologies, a FinOps Platform provider.
     We need to send transactional emails including:
     - Demo request confirmations to potential customers
     - Notifications to our team at info@c3ops.io when demo requests are received
     Expected volume: ~100-200 emails per month
     ```
   - **Compliance**: Confirm you have a process to handle bounces
5. Submit the request

**Note**: Approval usually takes 24 hours. Until then, you can test by adding test email addresses to verified identities.

---

## Step 2: Create IAM User for SES Access

### 2.1 Create IAM User

1. Go to **IAM** service in AWS Console
2. Click **Users** → **Create user**
3. Username: `c3ops-ses-sender`
4. Click **Next**

### 2.2 Attach SES Permissions

1. Select **Attach policies directly**
2. Search for: `AmazonSESFullAccess`
3. Check the box next to it
4. Click **Next** → **Create user**

### 2.3 Create Access Keys

1. Click on the newly created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys**
4. Click **Create access key**
5. Choose **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT**: Copy both:
   - Access key ID (e.g., `AKIAIOSFODNN7EXAMPLE`)
   - Secret access key (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

⚠️ **Save these keys securely!** You won't be able to see the secret key again.

---

## Step 3: Configure Your Application

### 3.1 Update .env File

Open the `.env` file in your project root and update:

```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_actual_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key_here
SES_FROM_EMAIL=info@c3ops.io
SES_TO_EMAIL=info@c3ops.io

# API Configuration
VITE_API_URL=http://localhost:3001

# Port for backend server
PORT=3001
```

**Replace:**
- `your_actual_access_key_id_here` → Your IAM Access Key ID
- `your_actual_secret_access_key_here` → Your IAM Secret Access Key

### 3.2 Example Configuration

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
SES_FROM_EMAIL=info@c3ops.io
SES_TO_EMAIL=info@c3ops.io
VITE_API_URL=http://localhost:3001
PORT=3001
```

---

## Step 4: Start Your Application

### 4.1 Start Backend Server

Open a terminal and run:

```bash
npm run server
```

You should see:
```
✅ Email API server running on http://localhost:3001
✅ Health check: http://localhost:3001/api/health
```

### 4.2 Start Frontend (New Terminal)

Open a **new terminal** and run:

```bash
npm run dev
```

### 4.3 Or Start Both Together

```bash
npm run dev:full
```

---

## Step 5: Test the Email Functionality

### 5.1 Test Backend API Health

Open browser and go to:
```
http://localhost:3001/api/health
```

You should see:
```json
{"status":"ok","message":"Email API is running"}
```

### 5.2 Test Demo Request Form

1. Go to http://localhost:5175 (or your dev server port)
2. Scroll to "Request a Demo" section
3. Fill in the form with test data
4. Click "Request Demo"

### 5.3 Verify Emails

Check these two places:

1. **Your inbox at info@c3ops.io** - Should receive demo request notification
2. **Test user's inbox** - Should receive confirmation email

---

## 🎯 Email Templates

### Email 1: Demo Request (to C3Ops)

**Subject**: 🎯 C3Ops FinOps Platform - New Demo Request from [Name]

**Contains**:
- Full Name
- Email Address
- Company
- Message (if provided)
- Timestamp

### Email 2: Confirmation (to User)

**Subject**: ✅ Thank You for Your Interest in C3Ops!

**Contains**:
- Personalized greeting
- What happens next (24-hour response)
- Links to C3Ops platform
- Contact information
- Company details

---

## 🔒 Security Best Practices

### 1. Never Commit .env File
Already added to `.gitignore`, but verify:
```bash
cat .gitignore | grep .env
```

### 2. Use IAM Policies with Least Privilege
The user only has SES access, nothing else.

### 3. Rotate Access Keys Regularly
- Rotate every 90 days
- Create new key → Update .env → Delete old key

### 4. Monitor SES Usage
- Check AWS CloudWatch for bounces/complaints
- Set up billing alerts

### 5. Production Deployment
Never hardcode credentials. Use:
- **Vercel**: Environment Variables in dashboard
- **AWS Amplify**: Environment Variables
- **Heroku**: Config Vars
- **Netlify**: Environment Variables

---

## 📊 AWS SES Pricing

### Free Tier (First 12 Months)
- 62,000 outbound emails/month **FREE**
- Perfect for your demo requests!

### After Free Tier
- $0.10 per 1,000 emails
- Example: 1,000 emails/month = $0.10/month
- Example: 10,000 emails/month = $1.00/month

### Receiving Emails (Optional)
- $0.10 per 1,000 emails received

**Very affordable for business use!**

---

## 🚨 Troubleshooting

### "MessageRejected: Email address is not verified"

**Solution**: Verify email in SES Console (Step 1.2)

### "Missing credentials in config"

**Solution**: Check .env file has correct AWS keys

### "Cannot connect to server"

**Solution**: Make sure backend is running (`npm run server`)

### "CORS error"

**Solution**: Backend already configured with CORS, but ensure both frontend and backend are running

### Emails going to spam

**Solutions**:
1. Set up SPF record for your domain
2. Set up DKIM in SES
3. Request production access (Step 1.3)
4. Warm up your sending (gradually increase volume)

### Still in sandbox mode

- Can only send to verified emails
- Add test email addresses in SES → Verified identities
- Request production access (takes ~24 hours)

---

## 🎨 Customizing Email Templates

Edit `server/index.js` to customize:

1. **Subject lines** - Line ~50 and ~130
2. **HTML design** - Lines 55-110 (demo request), 135-220 (confirmation)
3. **Plain text** - For email clients that don't support HTML

**Tip**: Test with different email clients (Gmail, Outlook, Apple Mail)

---

## 📱 Production Deployment

### For Backend API:

**Option 1: AWS Lambda + API Gateway** (Serverless)
- No server management
- Pay per request
- Scales automatically

**Option 2: AWS Elastic Beanstalk**
- Easy deployment
- Auto-scaling
- Load balancing

**Option 3: Vercel/Netlify Functions**
- Serverless functions
- Easy integration with frontend
- Free tier available

### Update Frontend for Production:

Change in `.env.production`:
```env
VITE_API_URL=https://your-api-domain.com
```

---

## 📚 Additional Resources

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [SES Sending Authorization](https://docs.aws.amazon.com/ses/latest/dg/sending-authorization.html)
- [SES Best Practices](https://docs.aws.amazon.com/ses/latest/dg/best-practices.html)
- [Email Deliverability](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html)

---

## ✅ Checklist

- [ ] AWS account created
- [ ] SES service accessed
- [ ] info@c3ops.io email verified
- [ ] Production access requested (optional for testing)
- [ ] IAM user created with SES permissions
- [ ] Access keys generated and saved
- [ ] .env file updated with AWS credentials
- [ ] Backend server starts successfully
- [ ] Frontend connects to backend
- [ ] Test email sent and received
- [ ] Confirmation email received by test user

---

## 🆘 Need Help?

If you encounter any issues:

1. Check AWS CloudWatch Logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure SES email is verified
5. Check AWS SES sending statistics

**Contact**: For AWS-specific issues, use AWS Support in the console.

---

**You're all set! Your professional email system is ready to handle demo requests! 🚀**
