const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Lambda function to handle demo requests:
 * 1. Validates request data
 * 2. Stores demo request in S3 as JSON
 * 3. Sends confirmation email via SES
 * 4. Returns success/error response
 */
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Parse request body
    let body;
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else {
      body = event.body;
    }

    // Validate required fields
    const { name, email, company, message } = body;
    if (!name || !email || !company) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: name, email, or company'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Create demo request object
    const demoRequestId = uuidv4();
    const timestamp = new Date().toISOString();
    const demoRequest = {
      id: demoRequestId,
      name,
      email,
      company,
      message: message || '',
      requestedAt: timestamp,
      status: 'pending'
    };

    // Store in S3
    const s3Key = `demo-requests/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${demoRequestId}.json`;
    await s3.putObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: JSON.stringify(demoRequest, null, 2),
      ContentType: 'application/json',
      Metadata: {
        'request-id': demoRequestId,
        'company': company,
        'email': email
      }
    }).promise();

    console.log(`Demo request stored in S3: s3://${process.env.S3_BUCKET_NAME}/${s3Key}`);

    // Send confirmation email to user
    await sendConfirmationEmail(email, name, demoRequestId);

    // Send notification email to admin
    await sendAdminNotification(name, email, company, message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Demo request received successfully! Check your email for confirmation.',
        requestId: demoRequestId,
        s3Location: `s3://${process.env.S3_BUCKET_NAME}/${s3Key}`
      })
    };

  } catch (error) {
    console.error('Error processing demo request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to process demo request. Please try again later.',
        error: error.message
      })
    };
  }
};

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(email, name, requestId) {
  const params = {
    Source: process.env.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Subject: {
        Data: 'Demo Request Confirmation - C3Ops FinOps Driven DevOps'
      },
      Body: {
        Html: {
          Data: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">Thank You for Your Demo Request!</h2>
                  
                  <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
                  
                  <p>We received your request for a demo of the <strong>C3Ops FinOps Platform</strong>.</p>
                  
                  <p>Our team will review your request and reach out to you shortly to schedule your personalized demo session.</p>
                  
                  <div style="background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Request Details:</strong></p>
                    <p>Request ID: <code>${requestId}</code></p>
                    <p>Submitted: ${new Date().toLocaleString()}</p>
                  </div>
                  
                  <h3 style="color: #2563eb;">What to Expect:</h3>
                  <ul>
                    <li>Personalized walkthrough of our platform</li>
                    <li>Live cost analysis of your cloud infrastructure</li>
                    <li>Recommendations for optimization</li>
                    <li>Q&A session with our experts</li>
                  </ul>
                  
                  <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    If you have any questions in the meantime, feel free to reach out to us at 
                    <a href="mailto:info@c3ops.io">info@c3ops.io</a> or call <strong>+91 9390361519</strong>
                  </p>
                  
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                  
                  <p style="font-size: 12px; color: #999;">
                    © 2025 C3Ops. All rights reserved.<br>
                    <a href="https://c3ops.io" style="color: #2563eb; text-decoration: none;">Visit our website</a>
                  </p>
                </div>
              </body>
            </html>
          `
        }
      }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to ${email}:`, error);
    throw error;
  }
}

/**
 * Send admin notification email
 */
async function sendAdminNotification(name, email, company, message) {
  const params = {
    Source: process.env.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [process.env.SES_ADMIN_EMAIL]
    },
    Message: {
      Subject: {
        Data: `New Demo Request from ${company}`
      },
      Body: {
        Html: {
          Data: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">New Demo Request</h2>
                  
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px;">
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Company:</strong> ${escapeHtml(company)}</p>
                    <p><strong>Message:</strong></p>
                    <p>${escapeHtml(message || 'N/A')}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                  
                  <p style="margin-top: 20px;">
                    <a href="https://console.aws.amazon.com/s3" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      View in S3
                    </a>
                  </p>
                </div>
              </body>
            </html>
          `
        }
      }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`Admin notification sent to ${process.env.SES_ADMIN_EMAIL}`);
  } catch (error) {
    console.error(`Failed to send admin notification:`, error);
    // Don't throw - admin notification failure shouldn't block user confirmation
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
