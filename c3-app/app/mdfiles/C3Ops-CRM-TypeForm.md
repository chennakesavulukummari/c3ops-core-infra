# **C3Ops CRM Integration with TypeForm API**

## **Objective**
Integrate the existing TypeForm API (`https://bx6zjexr3k.execute-api.ap-south-2.amazonaws.com/dev`) with C3Ops CRM to display website form submissions under a "Website" menu.

## **Current API Architecture**
- **Endpoint**: `https://bx6zjexr3k.execute-api.ap-south-2.amazonaws.com/dev/demo-request`
- **Method**: POST
- **Storage**: AWS DynamoDB
- **Lambda**: `typeform-handler.js`
- **Data Flow**: Website → API Gateway → Lambda → DynamoDB + SES

## **Required CRM Integration Steps**

### **1. Backend API Extensions** (Add to existing Lambda)

```javascript
// Add to typeform-handler.js

// GET /leads - Retrieve all website leads
exports.getWebsiteLeads = async (event) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: '#source = :source',
    ExpressionAttributeNames: { '#source': 'source' },
    ExpressionAttributeValues: { ':source': 'website' }
  };
  
  const result = await docClient.scan(params).promise();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      leads: result.Items,
      count: result.Count
    })
  };
};

// GET /leads/{id} - Get specific lead
exports.getWebsiteLead = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };
  
  const result = await docClient.get(params).promise();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      lead: result.Item
    })
  };
};

// PUT /leads/{id}/status - Update lead status
exports.updateLeadStatus = async (event) => {
  const { id } = event.pathParameters;
  const { status, assignedTo, notes } = JSON.parse(event.body);
  
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET #status = :status, #assignedTo = :assignedTo, #notes = :notes, #lastUpdated = :lastUpdated',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#assignedTo': 'assignedTo',
      '#notes': 'notes',
      '#lastUpdated': 'lastUpdated'
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':assignedTo': assignedTo,
      ':notes': notes,
      ':lastUpdated': new Date().toISOString()
    }
  };
  
  await docClient.update(params).promise();
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true })
  };
};
```

### **2. CRM Frontend Integration**

**File Structure**:
```
src/
├── pages/crm/
│   ├── WebsiteLeads.jsx
│   ├── LeadDetail.jsx
│   └── LeadsList.jsx
├── services/
│   └── crmApi.js
├── components/crm/
│   ├── LeadCard.jsx
│   ├── LeadFilters.jsx
│   └── LeadStatusModal.jsx
```

### **3. API Service Layer** (`src/services/crmApi.js`)

```javascript
const CRM_API_BASE = 'https://bx6zjexr3k.execute-api.ap-south-2.amazonaws.com/dev';

export const crmApi = {
  // Get all website leads
  getWebsiteLeads: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${CRM_API_BASE}/leads?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth if needed
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    
    return response.json();
  },
  
  // Get specific lead
  getLead: async (leadId) => {
    const response = await fetch(`${CRM_API_BASE}/leads/${leadId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch lead');
    }
    
    return response.json();
  },
  
  // Update lead status
  updateLeadStatus: async (leadId, updateData) => {
    const response = await fetch(`${CRM_API_BASE}/leads/${leadId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead');
    }
    
    return response.json();
  },
  
  // Get lead statistics
  getLeadStats: async () => {
    const response = await fetch(`${CRM_API_BASE}/leads/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    return response.json();
  }
};
```

### **4. CRM Website Leads Page** (`src/pages/crm/WebsiteLeads.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBuilding, FaEnvelope, FaPhone, FaCalendar, FaTag } from 'react-icons/fa';
import { crmApi } from '../../services/crmApi';

const WebsiteLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30d',
    formType: 'all'
  });

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await crmApi.getWebsiteLeads(filters);
      setLeads(response.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await crmApi.getLeadStats();
      setStats(response.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await crmApi.updateLeadStatus(leadId, { 
        status: newStatus,
        assignedTo: 'current-user-id',
        notes: `Status changed to ${newStatus}`
      });
      fetchLeads(); // Refresh the list
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const LeadCard = ({ lead }) => {
    const statusColors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              {lead.name}
            </h3>
            <p className="text-gray-600 flex items-center gap-2">
              <FaBuilding className="text-gray-400" />
              {lead.company}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
              {lead.status}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {lead.formType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="text-gray-400" />
            {lead.email}
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaPhone className="text-gray-400" />
              {lead.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCalendar className="text-gray-400" />
            {new Date(lead.timestamp).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaTag className="text-gray-400" />
            {lead.monthlyCloudSpend || 'Not specified'}
          </div>
        </div>

        {lead.primaryGoal && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Goal:</strong> {lead.primaryGoal}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {lead.status === 'new' && (
            <button
              onClick={() => updateLeadStatus(lead.id, 'contacted')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Mark Contacted
            </button>
          )}
          {lead.status === 'contacted' && (
            <button
              onClick={() => updateLeadStatus(lead.id, 'qualified')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Mark Qualified
            </button>
          )}
          <button
            onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Email
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Leads</h1>
        <p className="text-gray-600">Manage leads from website forms</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.new || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Qualified</h3>
          <p className="text-2xl font-bold text-green-600">{stats.qualified || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.conversionRate || '0%'}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <select 
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>

        <select 
          value={filters.formType}
          onChange={(e) => setFilters({...filters, formType: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">All Forms</option>
          <option value="assessment">Assessment</option>
          <option value="demo">Demo</option>
          <option value="consultation">Consultation</option>
        </select>

        <select 
          value={filters.dateRange}
          onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>

        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Leads List */}
      {!loading && (
        <div className="grid gap-4">
          {leads.length > 0 ? (
            leads.map(lead => (
              <LeadCard key={lead.id} lead={lead} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No leads found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebsiteLeads;
```

### **5. Data Structure Enhancement**

**Update DynamoDB Schema**:
```javascript
// Add to typeform-handler.js submission
const leadRecord = {
  id: generateId(),
  timestamp: new Date().toISOString(),
  source: 'website',
  formType: actionType, // 'assessment', 'demo', etc.
  
  // Contact Info
  name: formData.name,
  email: formData.email,
  company: formData.company,
  role: formData.role,
  phone: formData.phone,
  
  // Business Info  
  monthlyCloudSpend: formData.monthlyCloudSpend,
  cloudProviders: formData.cloudProviders,
  primaryGoal: formData.primaryGoal,
  timeline: formData.timeline,
  message: formData.message,
  
  // CRM Fields
  status: 'new',
  assignedTo: null,
  priority: 'medium',
  tags: [],
  notes: [],
  lastContacted: null,
  
  // Metadata
  ipAddress: event.requestContext?.identity?.sourceIp,
  userAgent: event.headers?.['User-Agent'],
  referrer: formData.referrer || 'direct',
  
  // Tracking
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

### **6. CRM Menu Integration**

```jsx
// Add to CRM navigation
const crmMenuItems = [
  { path: '/crm/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { 
    path: '/crm/website', 
    label: 'Website', 
    icon: 'web', 
    badge: newLeadsCount,
    description: 'Website form submissions'
  },
  { path: '/crm/contacts', label: 'Contacts', icon: 'contacts' },
  { path: '/crm/deals', label: 'Deals', icon: 'deals' },
  { path: '/crm/reports', label: 'Reports', icon: 'reports' }
];

// Navigation Component
const CRMNavigation = ({ activeItem }) => {
  return (
    <nav className="space-y-2">
      {crmMenuItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeItem === item.path 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <i className={`icon-${item.icon}`} />
          {item.label}
          {item.badge && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
```

### **7. Real-time Updates** (Optional)

```javascript
// WebSocket or polling for real-time updates
const useRealtimeLeads = () => {
  const [leads, setLeads] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await crmApi.getWebsiteLeads({ 
          updatedSince: lastUpdate.toISOString() 
        });
        
        if (response.leads.length > 0) {
          setLeads(prev => {
            const newLeads = [...prev];
            response.leads.forEach(newLead => {
              const existingIndex = newLeads.findIndex(l => l.id === newLead.id);
              if (existingIndex >= 0) {
                newLeads[existingIndex] = newLead;
              } else {
                newLeads.unshift(newLead);
              }
            });
            return newLeads;
          });
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [lastUpdate]);
  
  return leads;
};
```

### **8. Lambda Route Configuration**

Update your Lambda handler to support the new CRM endpoints:

```javascript
// In your main Lambda handler
exports.handler = async (event) => {
  const { httpMethod, path, pathParameters } = event;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Existing endpoint
    if (path === '/demo-request' && httpMethod === 'POST') {
      return await handleDemoRequest(event);
    }
    
    // New CRM endpoints
    if (path === '/leads' && httpMethod === 'GET') {
      return await exports.getWebsiteLeads(event);
    }
    
    if (path.startsWith('/leads/') && httpMethod === 'GET') {
      return await exports.getWebsiteLead(event);
    }
    
    if (path.endsWith('/status') && httpMethod === 'PUT') {
      return await exports.updateLeadStatus(event);
    }
    
    if (path === '/leads/stats' && httpMethod === 'GET') {
      return await exports.getLeadStats(event);
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### **9. Implementation Checklist**

- [ ] **Backend Extensions**
  - [ ] Extend Lambda with CRM endpoints (`/leads`, `/leads/{id}`, `/leads/{id}/status`, `/leads/stats`)
  - [ ] Update DynamoDB schema with CRM fields
  - [ ] Add authentication middleware
  - [ ] Implement error handling and logging
  
- [ ] **Frontend Development**
  - [ ] Create CRM API service layer (`crmApi.js`)
  - [ ] Build Website Leads page component
  - [ ] Create LeadCard component for individual leads
  - [ ] Add filtering and search functionality
  - [ ] Implement status update actions
  
- [ ] **CRM Integration**
  - [ ] Add "Website" menu item to CRM navigation
  - [ ] Create lead management dashboard
  - [ ] Add lead detail view
  - [ ] Implement notification system for new leads
  
- [ ] **Testing & Deployment**
  - [ ] Test API endpoints with Postman
  - [ ] Test frontend components
  - [ ] Deploy updated Lambda functions
  - [ ] Update API Gateway routes
  - [ ] Test end-to-end flow

- [ ] **Monitoring & Analytics**
  - [ ] Add CloudWatch logging
  - [ ] Implement lead conversion tracking
  - [ ] Create performance dashboards
  - [ ] Set up alerts for new leads

### **10. Security Considerations**

- **Authentication**: Add JWT token validation for CRM endpoints
- **Authorization**: Implement role-based access control (RBAC)
- **Data Validation**: Sanitize and validate all input data
- **Rate Limiting**: Add API rate limiting to prevent abuse
- **Data Encryption**: Encrypt sensitive data in DynamoDB
- **CORS**: Configure proper CORS headers for production

### **11. Environment Variables**

Add these to your Lambda environment:
```
DYNAMODB_TABLE=your-leads-table
FROM_EMAIL=info@c3ops.io
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-crm-domain.com
```

This comprehensive integration will create a seamless flow from website form submissions directly into your CRM system, allowing your team to efficiently track, manage, and follow up on leads.

---

## **Brand Consistency: Color Palette & Logo Integration**

### **Color Palette (Copy from Website Codebase)**

The C3Ops CRM should use the same professional color palette as the website for brand consistency. Copy the following Tailwind CSS configuration:

```javascript
// tailwind.config.js - Add to your CRM project
colors: {
  // Primary: Professional Slate Blue (2026 Enterprise Standard)
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Accent: Emerald Green - PRIMARY for CTAs/Money/Savings (FinOps Hero Color)
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Trust: Navy Blue for Enterprise Credibility & Security
  trust: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Tech: Teal/Cyan for Cloud Technology Features (Secondary)
  tech: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  
  // Success: Keep for positive metrics (aliased to accent for consistency)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning: Amber for Budget Alerts
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Danger: Rose for Overspend/Critical
  danger: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
}
```

### **Brand Color Usage Guidelines**

- **Primary (Slate Blue)**: Main navigation, headers, text
- **Accent (Emerald Green)**: CTAs, success states, savings indicators
- **Trust (Navy Blue)**: Security features, enterprise elements
- **Tech (Teal)**: Cloud technology features, technical indicators
- **Warning (Amber)**: Budget alerts, caution states
- **Danger (Rose)**: Critical alerts, overspend warnings

### **Logo Assets to Copy**

Copy the entire logos folder from the website codebase to your CRM project:

```
From: /website-codebase/public/logos/
To: /crm-codebase/public/assets/logos/
```

**Required Logo Files Structure:**
```
public/assets/logos/
├── New_Logos/ (PRIORITY - Latest branding)
│   ├── c3ops-logo-full-light.svg          # Main logo - light theme
│   ├── c3ops-logo-full-dark.svg           # Main logo - dark theme
│   ├── c3ops-app-icon-light.svg           # App icon - light
│   ├── c3ops-app-icon-dark.svg            # App icon - dark
│   ├── c3ops-icon-only.svg                # Icon without text
│   ├── c3ops-favicon.svg                  # Favicon
│   ├── c3ops-favicon-green.svg            # Green favicon
│   ├── c3ops-logo-mono-white.svg          # Monochrome white
│   ├── c3ops-logo-mono-black.svg          # Monochrome black
│   ├── c3ops-logo-mono-green.svg          # Monochrome green
│   ├── c3ops-logo-mono-navy.svg           # Monochrome navy
│   ├── c3ops-logo-clean.svg               # Clean version
│   └── c3ops-social-og.svg                # Social media/OG image
├── 1 Blue Background/
│   └── Png's/
│       ├── 1. Website Header.png          # Header logo PNG
│       ├── 2. Website footer.png          # Footer logo PNG
│       ├── 6.Favicon 64x64.png           # 64x64 favicon
│       └── 5. presentation.png            # Presentation logo
└── [Other color variants...]
```

### **Logo Usage in CRM Components**

**1. CRM Header Component:**
```jsx
// Header logo usage
import logo from '/assets/logos/New_Logos/c3ops-logo-full-light.svg';

const CRMHeader = () => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <img 
        src={logo} 
        alt="C3Ops" 
        className="h-8 w-auto"
      />
      {/* Rest of header */}
    </div>
  </header>
);
```

**2. Sidebar/Navigation Logo:**
```jsx
// Compact logo for sidebar
import iconOnly from '/assets/logos/New_Logos/c3ops-icon-only.svg';

const Sidebar = ({ collapsed }) => (
  <aside className="bg-primary-900 text-white">
    <div className="p-4">
      <img 
        src={collapsed ? iconOnly : logo} 
        alt="C3Ops" 
        className={collapsed ? "h-8 w-8" : "h-8 w-auto"}
      />
    </div>
  </aside>
);
```

**3. Login/Auth Pages:**
```jsx
// Full logo for auth pages
import fullLogo from '/assets/logos/New_Logos/c3ops-logo-full-light.svg';

const LoginPage = () => (
  <div className="min-h-screen bg-primary-50">
    <div className="flex flex-col items-center pt-12">
      <img 
        src={fullLogo} 
        alt="C3Ops CRM" 
        className="h-12 w-auto mb-8"
      />
      {/* Login form */}
    </div>
  </div>
);
```

### **CSS Component Styles to Copy**

Copy these base styles from the website's `src/index.css`:

```css
/* Add to CRM's global CSS */
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg;
  }
  
  .btn-accent {
    @apply bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-all duration-300;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg;
  }
  
  .status-new {
    @apply bg-trust-100 text-trust-800 px-2 py-1 rounded-full text-xs font-medium;
  }
  
  .status-contacted {
    @apply bg-warning-100 text-warning-800 px-2 py-1 rounded-full text-xs font-medium;
  }
  
  .status-qualified {
    @apply bg-success-100 text-success-800 px-2 py-1 rounded-full text-xs font-medium;
  }
  
  .status-closed {
    @apply bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium;
  }
}
```

### **Font Configuration**

Add the same font family to your CRM:

```javascript
// tailwind.config.js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

And include the Inter font in your HTML head:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### **Updated WebsiteLeads Component with Brand Colors**

```jsx
// Updated component using brand colors
const WebsiteLeads = () => {
  // ... existing logic

  const LeadCard = ({ lead }) => {
    const statusColors = {
      'new': 'status-new',
      'contacted': 'status-contacted', 
      'qualified': 'status-qualified',
      'closed': 'status-closed'
    };

    return (
      <motion.div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
              <FaUser className="text-trust-500" />
              {lead.name}
            </h3>
            <p className="text-primary-600 flex items-center gap-2">
              <FaBuilding className="text-primary-400" />
              {lead.company}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={statusColors[lead.status]}>
              {lead.status}
            </span>
            <span className="bg-tech-100 text-tech-800 px-2 py-1 rounded-full text-xs font-medium">
              {lead.formType}
            </span>
          </div>
        </div>

        {/* ... rest of component with updated colors */}
        
        <div className="flex gap-2">
          {lead.status === 'new' && (
            <button className="btn-primary text-sm py-2 px-4">
              Mark Contacted
            </button>
          )}
          {lead.status === 'contacted' && (
            <button className="btn-accent text-sm py-2 px-4">
              Mark Qualified
            </button>
          )}
          <button className="btn-secondary text-sm py-2 px-4">
            Email
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-primary-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Website Leads</h1>
        <p className="text-primary-600">Manage leads from website forms</p>
      </div>

      {/* Stats with brand colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-primary-500">Total Leads</h3>
          <p className="text-2xl font-bold text-primary-900">{stats.total || 0}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-primary-500">New Leads</h3>
          <p className="text-2xl font-bold text-trust-600">{stats.new || 0}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-primary-500">Qualified</h3>
          <p className="text-2xl font-bold text-accent-600">{stats.qualified || 0}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-primary-500">Conversion Rate</h3>
          <p className="text-2xl font-bold text-tech-600">{stats.conversionRate || '0%'}</p>
        </div>
      </div>
      
      {/* ... rest of component */}
    </div>
  );
};
```

### **Assets Copy Checklist**

- [ ] **Copy Logo Folder**: Copy entire `/logos/` directory from website to CRM
- [ ] **Update Tailwind Config**: Add all brand colors to CRM's tailwind.config.js
- [ ] **Add Font**: Include Inter font family in CRM project
- [ ] **Copy CSS Components**: Add button and card styles to CRM's global CSS
- [ ] **Update Components**: Replace generic colors with brand colors in all CRM components
- [ ] **Test Logo Display**: Verify all logo variants display correctly in different themes
- [ ] **Favicon**: Update CRM favicon to match brand
- [ ] **Brand Guidelines**: Document color usage for future development

This ensures complete brand consistency between your website and CRM system.