import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';
import { 
  FaArrowLeft, FaBook, FaCloud, FaChartLine, FaCogs, FaDatabase,
  FaSearch, FaDownload, FaExternalLinkAlt, FaPlay, FaFileAlt
} from 'react-icons/fa';

const Documentation = () => {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <FaPlay className="text-lg" />,
      description: 'Quick start guides and setup instructions'
    },
    {
      id: 'platform',
      name: 'Platform Guide',
      icon: <FaCloud className="text-lg" />,
      description: 'Complete platform documentation'
    },
    {
      id: 'finops-framework',
      name: 'FinOps Framework',
      icon: <FaChartLine className="text-lg" />,
      description: 'FinOps methodology and best practices'
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: <FaCogs className="text-lg" />,
      description: 'Connect with AWS, Azure, GCP and other tools'
    },
    {
      id: 'api',
      name: 'API Reference',
      icon: <FaDatabase className="text-lg" />,
      description: 'Complete API documentation'
    }
  ];

  const documentationSections = {
    'getting-started': [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with C3Ops in 15 minutes',
        type: 'guide',
        readTime: '10 min',
        content: `
## Quick Start Guide

Welcome to C3Ops! This guide will help you get started with our FinOps platform in just 15 minutes.

### Prerequisites
- AWS, Azure, or GCP account with billing access
- Administrative permissions to create IAM roles/service principals
- Basic understanding of cloud cost management

### Step 1: Account Setup
1. Sign up at [finops.c3ops.io](https://finops.c3ops.io)
2. Verify your email address
3. Complete the onboarding wizard

### Step 2: Connect Your Cloud Accounts
**AWS Connection:**
\`\`\`bash
# Create IAM role with required permissions
aws iam create-role --role-name C3OpsRole --assume-role-policy-document file://trust-policy.json
aws iam attach-role-policy --role-name C3OpsRole --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
\`\`\`

**Azure Connection:**
\`\`\`bash
# Create service principal
az ad sp create-for-rbac --name "C3Ops" --role "Cost Management Reader" --scopes /subscriptions/{subscription-id}
\`\`\`

### Step 3: Initial Configuration
- Set up cost allocation tags
- Configure billing alerts
- Create your first dashboard

### Step 4: Start Monitoring
Your data will begin appearing within 24-48 hours. Start with:
- Cost trends analysis
- Resource utilization review
- Initial optimization recommendations
        `
      },
      {
        title: 'Installation Requirements',
        description: 'System requirements and setup prerequisites',
        type: 'reference',
        readTime: '5 min',
        content: `
## Installation Requirements

### Cloud Provider Requirements
AWS:
- Cost and Billing Reports (CUR) enabled
- IAM permissions for cost management
- CloudWatch access for metrics

Azure:
- Cost Management API access
- Service Principal with appropriate permissions
- Resource Graph access

GCP:
- Billing Export to BigQuery enabled
- Service Account with billing viewer permissions
- Cloud Monitoring access

### Network Requirements
- Outbound HTTPS (443) access
- API rate limits: 1000 requests/hour
- Data retention: 13 months

### Supported Integrations
- Terraform Cloud/Enterprise
- Jenkins CI/CD
- Slack/Microsoft Teams
- JIRA Service Management
        `
      },
      {
        title: 'First Steps Checklist',
        description: 'Complete this checklist to ensure proper setup',
        type: 'checklist',
        readTime: '15 min',
        content: `
## First Steps Checklist

Complete these steps to get the most value from C3Ops:

### ✅ Account & Access Setup
- [ ] Create C3Ops account
- [ ] Connect primary cloud provider
- [ ] Invite team members
- [ ] Set up SSO (if required)

### ✅ Data Foundation
- [ ] Configure cost allocation tags
- [ ] Set up department/project mappings
- [ ] Enable detailed billing (if not already)
- [ ] Verify data ingestion (24-48 hours)

### ✅ Initial Configuration
- [ ] Create first cost dashboard
- [ ] Set up budget alerts
- [ ] Configure anomaly detection
- [ ] Review optimization recommendations

### ✅ Team Enablement
- [ ] Schedule FinOps training session
- [ ] Establish cost review cadence
- [ ] Create cost accountability process
- [ ] Document cost optimization procedures
        `
      }
    ],
    'platform': [
      {
        title: 'Dashboard Overview',
        description: 'Understanding your C3Ops dashboard and key metrics',
        type: 'guide',
        readTime: '12 min',
        content: `
## Dashboard Overview

The C3Ops dashboard provides a comprehensive view of your cloud costs and optimization opportunities.

### Executive Dashboard
- Total Cloud Spend: Current month vs. previous periods
- Savings Achieved: Realized savings from implemented recommendations
- Cost Trends: 12-month cost trajectory with forecasting
- Top Spenders: Resources and services consuming the most budget

### Detailed Analytics
- Service Breakdown: Cost distribution across cloud services
- Regional Costs: Geographic cost distribution
- Account/Subscription View: Multi-account cost visibility
- **Tag-based Allocation:** Department and project cost attribution

### Key Performance Indicators
- **Cost per User/Customer:** Unit economics tracking
- **Cloud Efficiency Score:** Overall optimization rating
- **Waste Percentage:** Identified unused or underutilized resources
- **Savings Rate:** Monthly savings as percentage of total spend
        `
      },
      {
        title: 'Cost Allocation Engine',
        description: 'Advanced tagging and cost allocation strategies',
        type: 'guide',
        readTime: '20 min',
        content: `
## Cost Allocation Engine

Proper cost allocation is fundamental to FinOps success. Our engine supports multiple allocation methods.

### Tagging Strategy
Mandatory Tags:
- \`Environment\` (prod, staging, dev)
- \`Department\` (engineering, marketing, sales)
- \`Project\` (project-alpha, project-beta)
- \`Owner\` (team or individual responsible)

### Allocation Methods
1. Direct Allocation: Resources directly tagged to cost centers
2. Proportional: Shared resources allocated based on usage
3. **Equal Split:** Common services split equally across departments
4. **Usage-Based:** Dynamic allocation based on consumption metrics

### Implementation Example
\`\`\`terraform
# AWS Resource Tagging
resource "aws_instance" "app_server" {
  tags = {
    Environment = "production"
    Department  = "engineering"
    Project     = "customer-portal"
    Owner       = "platform-team"
    CostCenter  = "eng-infrastructure"
  }
}
\`\`\`
        `
      }
    ],
    'finops-framework': [
      {
        title: 'FinOps Principles',
        description: 'Core principles of successful FinOps implementation',
        type: 'guide',
        readTime: '15 min',
        content: `
## FinOps Principles

The FinOps Foundation defines six core principles for cloud financial management:

### 1. Teams need to collaborate
FinOps requires cross-functional collaboration between Finance, Engineering, and Business teams.

Key Practices:
- Regular cost review meetings
- Shared responsibility for cost optimization
- Clear communication channels
- Joint decision-making processes

### 2. Everyone takes ownership for their cloud usage
Individual teams and engineers must be accountable for their cloud spending.

**Implementation:**
- Real-time cost visibility by team
- Cost budgets and alerts
- Regular cost review cadence
- Cost-aware engineering practices

### 3. A centralized team drives FinOps
A dedicated FinOps team enables and promotes cloud financial management practices.

**FinOps Team Responsibilities:**
- Establish governance and policies
- Provide training and enablement
- Drive optimization initiatives
- Report on cost and efficiency metrics

### 4. FinOps data should be accessible and timely
Cost data must be available when decisions are made, not weeks later.

**Data Requirements:**
- Real-time or near-real-time visibility
- Granular resource-level detail
- Consistent allocation and tagging
- Automated reporting and alerting

### 5. Decisions are driven by business value of cloud
Cost optimization should align with business value and outcomes.

**Value-Based Decisions:**
- Consider performance impact
- Evaluate feature delivery speed
- Assess customer experience
- Balance cost vs. business benefit

### 6. Take advantage of the variable cost model of cloud
Embrace cloud's pay-as-you-go model for maximum efficiency.

**Variable Cost Strategies:**
- Rightsize resources regularly
- Use auto-scaling capabilities
- Leverage spot/preemptible instances
- Implement scheduling for dev/test
        `
      },
      {
        title: 'FinOps Maturity Model',
        description: 'Assess and advance your FinOps capabilities',
        type: 'assessment',
        readTime: '10 min',
        content: `
## FinOps Maturity Model

Understand where your organization stands in FinOps maturity and plan your advancement.

### Crawl Phase (Initial)
Characteristics: 
- Basic cost visibility
- Manual reporting processes
- Limited automation
- Reactive cost management

Key Activities:
- Establish basic cost monitoring
- Implement fundamental tagging
- Create initial dashboards
- Begin team education

### Walk Phase (Developing)
Characteristics: 
- Automated reporting
- Proactive monitoring
- Some optimization automation
- Regular cost review processes

Key Activities:
- Implement advanced analytics
- Establish cost governance
- Deploy automated policies
- Expand team capabilities

### Run Phase (Advanced)
Characteristics: 
- Fully automated FinOps processes
- Predictive analytics and forecasting
- Business value optimization
- Cultural embedding of cost awareness

Key Activities:
- Advanced ML-driven optimization
- Continuous cost innovation
- Cross-cloud optimization
- Strategic business alignment

### Maturity Assessment
Rate your organization (1-5 scale):

**Visibility & Allocation:** ___/5
**Optimization:** ___/5
**Governance:** ___/5
**Culture:** ___/5
**Automation:** ___/5

**Total Score:** ___/25
- 5-10: Crawl Phase
- 11-18: Walk Phase
- 19-25: Run Phase
        `
      }
    ]
  };

  const filteredDocs = documentationSections[selectedCategory]?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pt-24">
      <SiteHeader />

      <div className="container-custom px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-accent-50 border-accent-200 border text-accent-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      {category.icon}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">{category.description}</p>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </h1>
                <p className="text-gray-600 mb-8">
                  {categories.find(cat => cat.id === selectedCategory)?.description}
                </p>

                {/* Documentation Items */}
                <div className="space-y-6">
                  {filteredDocs.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-accent-500 pl-6 py-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaFileAlt />
                            {doc.type}
                          </span>
                          <span>{doc.readTime}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{doc.description}</p>
                      
                      {/* Content Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="prose prose-sm max-w-none text-gray-700">
                          {doc.content.split('\n').slice(0, 15).map((line, idx) => {
                            if (line.startsWith('## ')) {
                              return <h2 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                              return <h3 key={idx} className="text-base font-semibold text-gray-800 mt-3 mb-2">{line.replace('### ', '')}</h3>;
                            }
                            if (line.trim() === '') {
                              return <br key={idx} />;
                            }
                            return <p key={idx} className="text-gray-700 mb-2">{line}</p>;
                          })}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
                          <FaBook />
                          Read Full Guide
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <FaDownload />
                          Download PDF
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Documentation;