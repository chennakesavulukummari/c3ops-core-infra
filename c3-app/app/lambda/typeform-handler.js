const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-2' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'ap-south-2' });

const TABLE_NAME = process.env.DYNAMODB_TABLE;
// IMPORTANT: Always use info@c3ops.io - Never use info@c3ops.in
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@c3ops.io';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@c3ops.io';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Email templates
const getEmailTemplates = (formData, actionType) => {
  const { name, email, company, role, monthlyCloudSpend, primaryGoal, timeline } = formData;
  
  // Email to user (confirmation)
  const userEmailSubject = `Thank you for your interest in C3Ops FinOps Platform - ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`;
  
  let userEmailBody = `
Dear ${name},

Thank you for your interest in the C3Ops FinOps Platform! We've received your ${actionType} request and our team will be in touch within 24 hours.

Your Information:
• Name: ${name}
• Email: ${email}
• Company: ${company}
• Role: ${role || 'Not specified'}
• Monthly Cloud Spend: ${monthlyCloudSpend || 'Not specified'}
• Primary Goal: ${primaryGoal || 'Not specified'}
• Timeline: ${timeline || 'Not specified'}
`;

  switch (actionType) {
    case 'assessment':
      userEmailBody += `
Next Steps:
✅ Our FinOps experts will review your requirements
📞 We'll schedule a free 30-minute assessment call
📊 You'll receive a customized cost optimization report
💰 We'll identify 20-30% potential savings opportunities

`;
      break;
    case 'trial':
      userEmailBody += `
Next Steps:
✅ We'll set up your free trial environment
📧 You'll receive login credentials within 24 hours  
🎯 Our team will provide a guided onboarding session
📈 Start seeing cost optimization insights immediately

`;
      break;
    case 'contact':
      userEmailBody += `
Next Steps:
✅ Our sales team will contact you within 24 hours
💬 We'll discuss your specific FinOps requirements
📋 You'll receive a customized proposal
🤝 We'll explore how C3Ops can help optimize your cloud costs

`;
      break;
  }

  userEmailBody += `
About C3Ops FinOps Platform:
• Multi-cloud cost optimization (AWS, Azure, GCP)
• Real-time cost tracking and alerts
• Automated rightsizing recommendations
• FinOps best practices implementation
• Enterprise-grade security and compliance

If you have any immediate questions, please don't hesitate to contact us at info@c3ops.io or visit our website at https://c3ops.io

Best regards,
The C3Ops Team
---
C3Ops Technologies Private Limited
Email: info@c3ops.io
Website: https://c3ops.io
`;

  // Email to internal team
  const internalEmailSubject = `New ${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Request - ${company} (${name})`;
  
  const internalEmailBody = `
New ${actionType} request received from the website:

CONTACT INFORMATION:
• Name: ${name}
• Email: ${email}
• Company: ${company}
• Role: ${role || 'Not specified'}
• Phone: ${formData.phone || 'Not provided'}

REQUIREMENTS:
• Monthly Cloud Spend: ${monthlyCloudSpend || 'Not specified'}
• Cloud Providers: ${Array.isArray(formData.cloudProviders) ? formData.cloudProviders.join(', ') : 'Not specified'}
• Primary Goal: ${primaryGoal || 'Not specified'}
• Timeline: ${timeline || 'Not specified'}
• Additional Message: ${formData.message || 'None'}

ACTION REQUIRED:
${actionType === 'assessment' ? '📞 Schedule FinOps assessment call' : 
  actionType === 'trial' ? '🚀 Set up free trial environment' : 
  '💬 Schedule sales call'}

Lead Priority: ${monthlyCloudSpend && (monthlyCloudSpend.includes('$200K') || monthlyCloudSpend.includes('$1M')) ? 'HIGH' : 'MEDIUM'}

Submitted: ${new Date().toISOString()}
Action Type: ${actionType}

---
This is an automated notification from the C3Ops website typeform.
`;

  return {
    userEmail: {
      subject: userEmailSubject,
      body: userEmailBody
    },
    internalEmail: {
      subject: internalEmailSubject,
      body: internalEmailBody
    }
  };
};

// Send email function
const sendEmail = async (toEmail, subject, body) => {
  const params = {
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Body: {
        Text: { Data: body }
      },
      Subject: { Data: subject }
    },
    Source: FROM_EMAIL
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));
    console.log(`Email sent successfully to ${toEmail}:`, result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
    return { success: false, error: error.message };
  }
};

exports.submitTypeform = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Validate required fields
    const { name, email, company, actionType } = body;
    if (!name || !email || !company || !actionType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: name, email, company, actionType',
        }),
      };
    }

    // Create the item to store in DynamoDB
    const timestamp = new Date().toISOString();
    const item = {
      id: `${actionType}_${email}_${Date.now()}`, // Unique ID
      email,
      name,
      company,
      actionType, // 'assessment', 'trial', or 'contact'
      role: body.role || '',
      monthlyCloudSpend: body.monthlyCloudSpend || '',
      cloudProviders: body.cloudProviders || [],
      primaryGoal: body.primaryGoal || '',
      timeline: body.timeline || '',
      phone: body.phone || '',
      message: body.message || '',
      submittedAt: timestamp,
      status: 'new', // Can be used for lead qualification workflow
      source: 'website_typeform',
      // Add some metadata
      userAgent: event.headers?.['User-Agent'] || '',
      ip: event.requestContext?.identity?.sourceIp || '',
    };

    // Store in DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };

    console.log('Storing item:', JSON.stringify(item, null, 2));
    
    await docClient.send(new PutCommand(params));

    // Send emails
    console.log('Sending emails...');
    const emailTemplates = getEmailTemplates(body, actionType);
    
    const emailResults = await Promise.allSettled([
      sendEmail(email, emailTemplates.userEmail.subject, emailTemplates.userEmail.body),
      sendEmail(ADMIN_EMAIL, emailTemplates.internalEmail.subject, emailTemplates.internalEmail.body)
    ]);

    const userEmailResult = emailResults[0];
    const internalEmailResult = emailResults[1];

    console.log('Email results:', {
      userEmail: userEmailResult.status === 'fulfilled' ? userEmailResult.value : userEmailResult.reason,
      internalEmail: internalEmailResult.status === 'fulfilled' ? internalEmailResult.value : internalEmailResult.reason
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Typeform submission stored and emails sent successfully',
        id: item.id,
        emailStatus: {
          userEmailSent: userEmailResult.status === 'fulfilled' && userEmailResult.value.success,
          internalEmailSent: internalEmailResult.status === 'fulfilled' && internalEmailResult.value.success
        }
      }),
    };

  } catch (error) {
    console.error('Error processing typeform submission:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

// Function to get all submissions (useful for admin dashboard)
exports.getSubmissions = async (event) => {
  console.log('Getting submissions:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      ScanIndexForward: false, // Sort by newest first
    };

    // Add filters if provided in query parameters
    const { actionType, status, limit } = event.queryStringParameters || {};
    
    if (actionType) {
      params.FilterExpression = '#actionType = :actionType';
      params.ExpressionAttributeNames = { '#actionType': 'actionType' };
      params.ExpressionAttributeValues = { ':actionType': actionType };
    }

    if (status) {
      if (params.FilterExpression) {
        params.FilterExpression += ' AND #status = :status';
        params.ExpressionAttributeNames['#status'] = 'status';
      } else {
        params.FilterExpression = '#status = :status';
        params.ExpressionAttributeNames = { '#status': 'status' };
      }
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ':status': status,
      };
    }

    if (limit) {
      params.Limit = parseInt(limit, 10);
    }

    const result = await docClient.send(new ScanCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: result.Items.length,
        items: result.Items,
      }),
    };

  } catch (error) {
    console.error('Error fetching submissions:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};