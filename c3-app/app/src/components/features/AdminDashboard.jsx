import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRefresh, FaDownload, FaEye, FaFilter } from 'react-icons/fa';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    actionType: 'all',
    status: 'all',
  });

  // Determine API URL based on environment
  const API_BASE_URL = import.meta.env.PROD 
    ? 'https://your-api-gateway-url.amazonaws.com' // Replace with your actual API Gateway URL
    : 'http://localhost:3000';

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/typeform/submissions?limit=100`;
      
      if (filter.actionType !== 'all') {
        url += `&actionType=${filter.actionType}`;
      }
      if (filter.status !== 'all') {
        url += `&status=${filter.status}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        setSubmissions(result.items || []);
      } else {
        console.error('Error fetching submissions:', result.error);
        alert('Error fetching submissions: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching submissions. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const exportToCsv = () => {
    if (submissions.length === 0) return;

    const csvHeaders = [
      'ID', 'Name', 'Email', 'Company', 'Role', 'Action Type', 
      'Monthly Cloud Spend', 'Cloud Providers', 'Primary Goal', 
      'Timeline', 'Phone', 'Message', 'Submitted At', 'Status'
    ];

    const csvData = submissions.map(item => [
      item.id,
      item.name,
      item.email,
      item.company,
      item.role,
      item.actionType,
      item.monthlyCloudSpend,
      Array.isArray(item.cloudProviders) ? item.cloudProviders.join('; ') : item.cloudProviders,
      item.primaryGoal,
      item.timeline,
      item.phone,
      item.message,
      item.submittedAt,
      item.status
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field || ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeform-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case 'assessment': return 'bg-blue-100 text-blue-800';
      case 'trial': return 'bg-green-100 text-green-800';
      case 'contact': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Typeform Submissions</h1>
              <p className="text-gray-600">Manage and view all form submissions</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                onClick={fetchSubmissions}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FaRefresh className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={exportToCsv}
                disabled={submissions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <FaFilter className="text-gray-500" />
            <div className="flex gap-4">
              <select
                value={filter.actionType}
                onChange={(e) => setFilter(prev => ({ ...prev, actionType: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Action Types</option>
                <option value="assessment">Assessment</option>
                <option value="trial">Trial</option>
                <option value="contact">Contact</option>
              </select>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
            <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Assessments</h3>
            <p className="text-3xl font-bold text-blue-600">
              {submissions.filter(s => s.actionType === 'assessment').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Trials</h3>
            <p className="text-3xl font-bold text-green-600">
              {submissions.filter(s => s.actionType === 'trial').length}
            </p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cloud Spend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="text-sm text-gray-500">
                              {submission.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.company}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(submission.actionType)}`}>
                          {submission.actionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.monthlyCloudSpend}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            // You can implement a detailed view modal here
                            console.log('View details:', submission);
                            alert('View details functionality - check console for data');
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;