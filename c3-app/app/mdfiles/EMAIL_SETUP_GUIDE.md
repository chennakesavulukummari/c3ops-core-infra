# Email Setup Guide for C3Ops Demo Request Form

This guide will help you set up email functionality for the demo request form using EmailJS.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## Step 2: Add Email Service

1. Go to **Email Services** in the EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (if info@c3ops.io is a Gmail account)
   - **Outlook/Office365** (if it's a Microsoft account)
   - **Other SMTP** (for custom email servers)
4. Connect your **info@c3ops.io** account
5. Note down the **Service ID** (e.g., `service_xyz123`)

## Step 3: Create Email Template for Demo Requests

1. Go to **Email Templates** in the EmailJS dashboard
2. Click **Create New Template**
3. Use this template for demo requests to C3Ops:

**Template Name:** Demo Request Notification

**Subject:** New Demo Request from {{from_name}}

**Content:**
```
Hello C3Ops Team,

You have received a new demo request:

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Message: {{message}}

Please follow up with this lead as soon as possible.

---
This is an automated message from the C3Ops website.
```

4. Click **Save** and note the **Template ID** (e.g., `template_abc456`)

## Step 4: Create Confirmation Email Template

1. Create another template for user confirmation
2. Click **Create New Template**

**Template Name:** Demo Request Confirmation

**Subject:** Thank you for your interest in C3Ops!

**Content:**
```
Hello {{to_name}},

Thank you for requesting a demo of C3Ops FinOps Platform!

We've received your request and our team will reach out to you within 24 hours to schedule a personalized demo.

In the meantime, feel free to explore our platform at https://finops.c3ops.io

If you have any urgent questions, please contact us:
- Email: info@c3ops.io
- Phone: +91 9390361519

Best regards,
The C3Ops Team

---
C3Ops Technologies Private Limited
The Skyview 10, Sy No 83/1, 2nd Floor,
Hitech City Main Road, Raidurgam
Hyderabad, Telangana - 500081
```

3. Click **Save** and note the **Template ID** (e.g., `template_def789`)

## Step 5: Get Your Public Key

1. Go to **Account** > **General** in EmailJS dashboard
2. Find your **Public Key** (e.g., `user_abcdefgh123456`)
3. Copy this key

## Step 6: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual IDs:

```env
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_demo_request_template_id_here
VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID=your_confirmation_template_id_here
```

Example:
```env
VITE_EMAILJS_PUBLIC_KEY=user_abcdefgh123456
VITE_EMAILJS_SERVICE_ID=service_xyz123
VITE_EMAILJS_TEMPLATE_ID=template_abc456
VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID=template_def789
```

## Step 7: Test the Form

1. Restart your development server:
```bash
npm run dev
```

2. Fill out the demo request form on your website
3. Check that:
   - You receive an email at **info@c3ops.io** with the demo request details
   - The user receives a confirmation email at their provided email address
   - Success message appears on the website

## Step 8: Production Deployment

When deploying to production:

1. Add the same environment variables to your hosting platform:
   - **Vercel:** Project Settings > Environment Variables
   - **Netlify:** Site Settings > Build & Deploy > Environment
   - **AWS Amplify:** App Settings > Environment Variables

2. Make sure to add your production domain to EmailJS allowed origins:
   - Go to **Account** > **General** in EmailJS
   - Add your domain (e.g., `www.c3ops.io`) to the allowed list

## Troubleshooting

### Emails not sending?

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Ensure EmailJS service is connected and active
4. Check EmailJS dashboard for any errors or quota limits
5. Verify template IDs match exactly

### Emails going to spam?

1. Add a custom domain in EmailJS (paid plan)
2. Set up SPF and DKIM records for your domain
3. Ask recipients to whitelist info@c3ops.io

### Rate limiting?

- Free tier: 200 emails/month
- Upgrade to paid plan if you need more

## Alternative: Backend Solution

If you prefer a backend solution instead of EmailJS, you can:

1. Create a Node.js/Express API endpoint
2. Use Nodemailer with your SMTP credentials
3. Deploy the API to AWS Lambda, Vercel Functions, or similar
4. Update the form to call your API instead of EmailJS

Let me know if you need help with the backend implementation!

## Support

For more information:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Support: support@emailjs.com
