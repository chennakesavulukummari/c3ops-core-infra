# Quick Start: EmailJS Setup in 5 Minutes

## 🚀 Quick Setup Steps

### Step 1: Sign Up (1 minute)
```
1. Visit: https://www.emailjs.com
2. Click "Sign Up"
3. Use info@c3ops.io or your personal email
4. Verify your email
```

### Step 2: Add Email Service (2 minutes)
```
1. Dashboard → "Email Services"
2. Click "Add New Service"
3. Choose Gmail/Outlook/Other (depending on info@c3ops.io provider)
4. Follow connection wizard
5. Copy the SERVICE ID (e.g., service_abc123)
```

### Step 3: Create Templates (2 minutes)

#### Template A - Demo Request (to C3Ops)
```
Name: Demo Request
To Email: info@c3ops.io
Subject: 🎯 New Demo Request from {{from_name}}

Body:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEW DEMO REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: {{from_name}}
📧 Email: {{from_email}}
🏢 Company: {{company}}

💬 Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Received: {{current_time}}
```

Copy TEMPLATE ID #1: _______________

#### Template B - User Confirmation
```
Name: Demo Confirmation
To Email: {{to_email}}
Subject: ✅ Thank You for Your Interest in C3Ops!

Body:
Hello {{to_name}},

Thank you for requesting a demo of C3Ops FinOps Platform!

✅ We've received your request
📞 Our team will contact you within 24 hours
🎯 We'll schedule a personalized demo

Platform: https://finops.c3ops.io

Questions? Contact us:
📧 info@c3ops.io
📱 +91 9390361519

Best regards,
C3Ops Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C3Ops Technologies Private Limited
The Skyview 10, Sy No 83/1, 2nd Floor,
Hitech City Main Road, Raidurgam
Hyderabad, Telangana - 500081
```

Copy TEMPLATE ID #2: _______________

### Step 4: Get Public Key
```
1. Dashboard → Account → General
2. Find "Public Key"
3. Copy it (e.g., user_xyz789)
```

Copy PUBLIC KEY: _______________

### Step 5: Update .env File
```bash
# Open terminal
cd /Users/ck/Documents/FinOps DrivenDevOps

# Edit .env file
nano .env
# Or use: code .env
```

Paste your values:
```env
VITE_EMAILJS_PUBLIC_KEY=paste_your_public_key_here
VITE_EMAILJS_SERVICE_ID=paste_your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=paste_demo_template_id_here
VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID=paste_confirmation_template_id_here
```

Save and close (Ctrl+X, Y, Enter for nano)

### Step 6: Test It! 🎉
```bash
# Make sure dev server is running
npm run dev

# Open browser: http://localhost:5174
# Fill the demo form
# Click "Request Demo"
# Check both emails!
```

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Email service connected (info@c3ops.io)
- [ ] Demo request template created
- [ ] Confirmation template created
- [ ] Public key copied
- [ ] All IDs copied
- [ ] .env file updated with all 4 values
- [ ] Dev server restarted
- [ ] Test form submitted
- [ ] Email received at info@c3ops.io
- [ ] User confirmation email received

## 🆘 Common Issues

**"Failed to send email"**
→ Check if all 4 env variables are set correctly
→ Restart dev server after changing .env

**"Service not found"**
→ Verify SERVICE_ID is correct
→ Make sure email service is connected and active

**"Template not found"**
→ Verify both TEMPLATE IDs are correct
→ Check templates are saved in EmailJS

**Emails not arriving**
→ Check spam folder
→ Verify email service is properly connected
→ Check EmailJS dashboard for error logs

**"Invalid public key"**
→ Copy public key exactly (no spaces)
→ Restart dev server

## 📱 Quick Test Command

After setup, test with:
```bash
# Restart server
npm run dev

# Check console for any errors
# Open browser dev tools (F12)
# Submit form
# Watch console for success/error messages
```

## 🎯 Success Indicators

You'll know it's working when:
1. Form shows "Sending..." button
2. Success message appears (green)
3. Form clears automatically
4. Email arrives at info@c3ops.io within 30 seconds
5. User receives confirmation email within 30 seconds

## 📞 Need Help?

1. Check EMAIL_SETUP_GUIDE.md for detailed instructions
2. Check EMAIL_IMPLEMENTATION.md for technical details
3. EmailJS docs: https://www.emailjs.com/docs/
4. EmailJS support: support@emailjs.com

---

**That's it! You're ready to receive demo requests! 🚀**
