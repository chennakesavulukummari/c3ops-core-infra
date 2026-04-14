# C3Ops Website - FinOps Driven DevOps

A modern, dynamic, and aesthetic React website for C3Ops, showcasing the multi-cloud cost optimization platform.

## 🚀 Features

- **Modern React Application** with smooth animations using Framer Motion
- **Fully Responsive Design** optimized for all devices
- **SEO Optimized** with meta tags and Open Graph support
- **Professional UI/UX** designed to build trust and drive conversions
- **Multi-Cloud Integration** showcasing AWS, Azure, and GCP capabilities
- **4 Core Modules** prominently featured
- **Customer Testimonials** to build credibility
- **Contact Form** for lead generation with email notifications
- **Email Confirmations** sent to users after demo requests
- **Automated Email System** using EmailJS integration

## 📋 Prerequisites

**Important: This project requires Node.js version 20.19+ or 22.3+**

You are currently using Node.js v18.14.0, which is not compatible with the latest Vite version.

### How to Upgrade Node.js

#### Option 1: Using nvm (Node Version Manager) - Recommended

```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Set Node.js 20 as default
nvm alias default 20
```

#### Option 2: Download from nodejs.org

Visit [https://nodejs.org/](https://nodejs.org/) and download the LTS version (20.x or higher).

#### Option 3: Using Homebrew (macOS)

```bash
brew update
brew install node@20
brew link node@20
```

## 🛠️ Installation

After upgrading Node.js, follow these steps:

```bash
# Navigate to the project directory
cd /Users/ck/Documents/FinOps DrivenDevOps

# Install dependencies
npm install

# Set up email configuration (see EMAIL_SETUP_GUIDE.md for detailed instructions)
cp .env.example .env
# Edit .env and add your EmailJS credentials

# Start development server
npm run dev
```

## 📧 Email Configuration

The website includes automated email functionality for demo requests using **AWS SES** (recommended) or **Gmail SMTP**.

### Option 1: AWS SES (Recommended for Production)

**Benefits**: Professional, scalable, excellent deliverability, 62,000 free emails/month first year

1. Read the detailed guide: `AWS_SES_SETUP_GUIDE.md`
2. Set up AWS SES and verify your email
3. Create IAM user with SES permissions
4. Update `.env` with AWS credentials

**Required Environment Variables:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
SES_FROM_EMAIL=info@c3ops.io
SES_TO_EMAIL=info@c3ops.io
VITE_API_URL=http://localhost:3001
PORT=3001
```

### Option 2: Gmail SMTP (Quick Setup for Testing)

**Benefits**: Quick setup, no AWS account needed, free up to 500 emails/day

1. Read the guide: `GMAIL_SMTP_SETUP_GUIDE.md`
2. Enable Gmail App Password
3. Update `.env` with Gmail credentials

**Required Environment Variables:**
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_password
GMAIL_TO_EMAIL=info@c3ops.io
VITE_API_URL=http://localhost:3001
PORT=3001
```

## 📦 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Website Sections

1. **Hero Section** - Eye-catching introduction with CTA buttons
2. **Benefits Section** - Key statistics and value propositions
3. **Features Section** - Why choose C3Ops
4. **Modules Section** - Detailed overview of 4 MVP modules:
   - Single Source of Truth (Inventory)
   - FinOps Excellence
   - Infrastructure Automation (DevOps)
   - Security Essentials
5. **Testimonials** - Customer success stories
6. **CTA Section** - Strong call-to-action to drive conversions
7. **Contact Section** - Contact information and demo request form
8. **Footer** - Complete navigation and company information

## 🎨 Design Features

- **Animations**: Smooth transitions and hover effects using Framer Motion
- **Color Scheme**: Professional blue gradient with accent green
- **Typography**: Clean and modern Inter font family
- **Icons**: React Icons for consistent iconography
- **Layout**: Responsive grid system with Tailwind CSS

## 📱 Responsive Design

The website is fully optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Technologies Used

- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Router** - Client-side routing
- **EmailJS** - Email service integration

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# Or connect your GitHub repo to Netlify for automatic deployments
```

### Deploy to Azure Static Web Apps

```bash
# Build the project
npm run build

# Use Azure Static Web Apps CLI or Azure Portal
```

## 📞 Contact Information

**C3Ops Technologies Private Limited**

- Address: The Skyview 10, Sy No 83/1, 2nd Floor,, Hitech City Main Road, Raidurgam, Hyderabad, Telangana - 500081
- Email: info@c3ops.io
- Phone: +91 9390361519
- Website: www.c3ops.io
- Application: finops.c3ops.io

## 📄 License

© 2026 C3Ops Technologies Private Limited. All rights reserved.

## 🤝 Support

For support, email info@c3ops.io or call +91 9390361519.

---

**Note**: After upgrading your Node.js version, you'll be able to run the development server and see your beautiful new website! 🎉

## 

How to Reframe the Four Pillars

Our integrated platform combines four core capabilities to optimize your entire cloud operation

Single Source of Truth — Unified visibility across all clouds
FinOps Culture — Data-driven cost optimization
Automation DevOps — Intelligent infrastructure management
Security DevSecOps — Built-in compliance & risk management


```
Install Google Tag Manager
Copy the code below and paste it on to every page of your website.
1. Paste this code as high in the <head> of the page as possible:

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PFN429QC');</script>
<!-- End Google Tag Manager -->

2. Paste this code immediately after the opening <body> tag:

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFN429QC"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

3. Test your website (optional):

https://www.c3ops.io


8924836

window.lintrk('track', { conversion_id: 24618196 });

24618196
```