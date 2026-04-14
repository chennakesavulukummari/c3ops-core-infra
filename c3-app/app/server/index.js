import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email API is running' });
});

// Send demo request email
app.post('/api/send-demo-request', async (req, res) => {
  const { name, email, company, message } = req.body;

  // Validate input
  if (!name || !email || !company) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and company are required fields.',
    });
  }

  try {
    // Email to C3Ops team
    await transporter.sendMail({
      from: `"C3Ops FinOps Platform" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_TO_EMAIL || 'info@c3ops.io',
      replyTo: email,
      subject: `🎯 New Demo Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2563eb; }
            .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 New Demo Request</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">🏢 Company</div>
                <div class="value">${company}</div>
              </div>
              ${message ? `
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value">${message}</div>
              </div>
              ` : ''}
              <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
                Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Demo Request

Name: ${name}
Email: ${email}
Company: ${company}
${message ? `Message: ${message}` : ''}

Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `"C3Ops FinOps Platform" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '✅ Thank You for Your Interest in C3Ops!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0 0;">We've received your demo request</p>
            </div>
            <div class="content">
              <h2 style="color: #2563eb;">✅ What's Next?</h2>
              <ul>
                <li>Our team will review your request</li>
                <li>We'll contact you within <strong>24 hours</strong></li>
                <li>Schedule a personalized demo</li>
                <li>Discuss how C3Ops can reduce your cloud costs by 10-30%</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://finops.c3ops.io" class="button">Explore C3Ops Platform</a>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #2563eb;">📞 Contact Us</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> info@c3ops.io</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> +91 9390361519</p>
                <p style="margin: 5px 0;"><strong>Website:</strong> www.c3ops.io</p>
              </div>

              <p style="margin-top: 20px; color: #6b7280; font-size: 12px; text-align: center;">
                C3Ops Technologies Private Limited<br>
                The Skyview 10, Hitech City, Hyderabad - 500081
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name},

Thank you for requesting a demo of C3Ops FinOps Platform!

What's Next?
- Our team will review your request
- We'll contact you within 24 hours
- Schedule a personalized demo
- Discuss how C3Ops can reduce your cloud costs by 10-30%

Platform: https://finops.c3ops.io

Contact Us:
Email: info@c3ops.io
Phone: +91 9390361519
Website: www.c3ops.io

Best regards,
The C3Ops Team

---
C3Ops Technologies Private Limited
The Skyview 10, Hitech City, Hyderabad - 500081
      `,
    });

    res.json({
      success: true,
      message: 'Demo request sent successfully. Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Email API server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

export default app;
