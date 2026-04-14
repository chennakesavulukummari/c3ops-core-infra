import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaFileAlt, FaDownload, FaEye, FaCalendar, FaUser,
  FaFilter, FaSearch, FaChartLine, FaCloud, FaRobot, FaCogs
} from 'react-icons/fa';

const Whitepapers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Papers', count: 8 },
    { id: 'finops-strategy', name: 'FinOps Strategy', count: 3 },
    { id: 'cloud-optimization', name: 'Cloud Optimization', count: 2 },
    { id: 'ai-ml-costs', name: 'AI/ML Costs', count: 2 },
    { id: 'governance', name: 'Governance', count: 1 }
  ];

  const whitepapers = [
    {
      id: 1,
      title: 'The Complete Guide to FinOps Transformation: From Strategy to Implementation',
      description: 'A comprehensive 45-page guide covering the end-to-end FinOps transformation journey, including frameworks, best practices, and real-world implementation strategies.',
      category: 'finops-strategy',
      author: 'C3Ops Research Team',
      publishDate: '2025-02-01',
      pages: 45,
      downloads: 2847,
      featured: true,
      tags: ['FinOps', 'Transformation', 'Strategy', 'Implementation'],
      abstract: 'This comprehensive whitepaper provides organizations with a complete roadmap for FinOps transformation. It covers strategic planning, organizational change management, technology implementation, and success measurement frameworks. Based on insights from over 100 successful FinOps implementations, this guide offers practical, actionable strategies for achieving sustainable cloud cost optimization.',
      keyTopics: [
        'FinOps Maturity Assessment Framework',
        'Organizational Change Management for FinOps',
        'Technology Stack Selection and Implementation',
        'KPI Definition and Success Measurement',
        'Common Pitfalls and How to Avoid Them'
      ]
    },
    {
      id: 2,
      title: 'Multi-Cloud Cost Optimization: Strategies for AWS, Azure, and GCP',
      description: 'Navigate the complexities of managing costs across multiple cloud providers with proven strategies and architectural patterns.',
      category: 'cloud-optimization',
      author: 'Sarah Chen & Michael Rodriguez',
      publishDate: '2025-01-25',
      pages: 32,
      downloads: 1923,
      featured: true,
      tags: ['Multi-Cloud', 'AWS', 'Azure', 'GCP', 'Cost Optimization'],
      abstract: 'As organizations increasingly adopt multi-cloud strategies, managing costs across different providers becomes complex. This whitepaper provides detailed strategies for unified cost management, cross-cloud optimization techniques, and governance frameworks that work across AWS, Azure, and GCP environments.',
      keyTopics: [
        'Unified Cost Visibility Across Clouds',
        'Cross-Cloud Resource Optimization',
        'Multi-Cloud Governance Frameworks',
        'Vendor-Specific Optimization Strategies',
        'Tools and Technologies for Multi-Cloud Management'
      ]
    },
    {
      id: 3,
      title: 'AI/ML Cost Management: Optimizing GPU Utilization and Training Costs',
      description: 'Essential strategies for managing the high costs associated with AI and machine learning workloads in cloud environments.',
      category: 'ai-ml-costs',
      author: 'Dr. Priya Sharma',
      publishDate: '2025-01-18',
      pages: 28,
      downloads: 1654,
      featured: false,
      tags: ['AI/ML', 'GPU', 'Training Costs', 'Optimization'],
      abstract: 'AI and ML workloads represent some of the highest cloud costs for modern organizations. This paper explores advanced techniques for optimizing GPU utilization, managing training costs, and implementing cost-effective ML pipelines while maintaining performance and reliability.',
      keyTopics: [
        'GPU Cost Optimization Techniques',
        'Spot Instance Strategies for ML Training',
        'ML Pipeline Cost Modeling',
        'Resource Scheduling for AI Workloads',
        'Cost-Performance Trade-off Analysis'
      ]
    },
    {
      id: 4,
      title: 'Container Cost Optimization: Kubernetes Resource Management at Scale',
      description: 'Best practices for optimizing costs in containerized environments, focusing on Kubernetes resource management and scaling strategies.',
      category: 'cloud-optimization',
      author: 'David Kim',
      publishDate: '2025-01-10',
      pages: 35,
      downloads: 1456,
      featured: false,
      tags: ['Kubernetes', 'Containers', 'Resource Management', 'Scaling'],
      abstract: 'Kubernetes environments can quickly become cost-inefficient without proper resource management. This whitepaper provides comprehensive strategies for optimizing container costs, including resource requests and limits, auto-scaling configurations, and cluster optimization techniques.',
      keyTopics: [
        'Resource Requests and Limits Optimization',
        'Horizontal and Vertical Pod Autoscaling',
        'Cluster Cost Optimization Strategies',
        'Monitoring and Alerting for Container Costs',
        'Cost Allocation in Kubernetes Environments'
      ]
    },
    {
      id: 5,
      title: 'FinOps Culture: Building Cost-Conscious Engineering Teams',
      description: 'How to transform engineering culture to embrace cost consciousness while maintaining innovation and velocity.',
      category: 'finops-strategy',
      author: 'Jennifer Park & Alex Thompson',
      publishDate: '2025-01-03',
      pages: 26,
      downloads: 2156,
      featured: false,
      tags: ['Culture', 'Engineering', 'Cost Consciousness', 'Team Building'],
      abstract: 'Technical excellence and cost efficiency are not mutually exclusive. This paper explores how to build and maintain cost-conscious engineering cultures that drive both innovation and efficiency. Based on case studies from high-performing engineering teams across various industries.',
      keyTopics: [
        'Cost Awareness in Engineering Practices',
        'Incentive Alignment for Cost Optimization',
        'Training and Education Programs',
        'Measuring Cultural Change Success',
        'Sustaining Cost-Conscious Behaviors'
      ]
    },
    {
      id: 6,
      title: 'Advanced FinOps Analytics: Predictive Cost Modeling and Forecasting',
      description: 'Leverage advanced analytics and machine learning for accurate cost forecasting and predictive optimization.',
      category: 'ai-ml-costs',
      author: 'Dr. Amit Patel',
      publishDate: '2024-12-28',
      pages: 39,
      downloads: 987,
      featured: false,
      tags: ['Analytics', 'Forecasting', 'Machine Learning', 'Predictive Modeling'],
      abstract: 'Move beyond reactive cost management to predictive optimization. This paper details advanced analytical techniques for cost forecasting, anomaly detection, and predictive optimization using machine learning and statistical methods.',
      keyTopics: [
        'Time Series Forecasting for Cloud Costs',
        'Anomaly Detection Algorithms',
        'Predictive Resource Planning',
        'Cost Impact Modeling',
        'Advanced Analytics Implementation'
      ]
    },
    {
      id: 7,
      title: 'FinOps Governance: Policies, Controls, and Compliance Framework',
      description: 'Establish robust governance frameworks for cloud cost management, including policies, controls, and compliance mechanisms.',
      category: 'governance',
      author: 'Lisa Wang',
      publishDate: '2024-12-20',
      pages: 33,
      downloads: 1234,
      featured: false,
      tags: ['Governance', 'Policies', 'Compliance', 'Controls'],
      abstract: 'Effective FinOps requires strong governance frameworks. This whitepaper provides templates, policies, and frameworks for establishing comprehensive cloud cost governance that aligns with organizational objectives and compliance requirements.',
      keyTopics: [
        'FinOps Policy Framework Development',
        'Cost Control Mechanisms',
        'Compliance and Audit Requirements',
        'Risk Management in Cloud Spending',
        'Governance Maturity Models'
      ]
    },
    {
      id: 8,
      title: 'The ROI of FinOps: Measuring and Communicating Business Value',
      description: 'Quantify the business impact of FinOps initiatives and effectively communicate value to stakeholders and executives.',
      category: 'finops-strategy',
      author: 'Rajesh Kumar',
      publishDate: '2024-12-15',
      pages: 24,
      downloads: 1876,
      featured: false,
      tags: ['ROI', 'Business Value', 'Metrics', 'Communication'],
      abstract: 'Demonstrating the business value of FinOps is crucial for continued investment and organizational support. This paper provides frameworks for measuring FinOps ROI, establishing value metrics, and communicating results to various stakeholder groups.',
      keyTopics: [
        'FinOps ROI Calculation Methods',
        'Value Metrics and KPI Frameworks',
        'Stakeholder Communication Strategies',
        'Business Case Development',
        'Continuous Value Demonstration'
      ]
    }
  ];

  const filteredWhitepapers = whitepapers.filter(paper => {
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPapers = filteredWhitepapers.filter(paper => paper.featured);
  const regularPapers = filteredWhitepapers.filter(paper => !paper.featured);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'finops-strategy':
        return <FaChartLine />;
      case 'cloud-optimization':
        return <FaCloud />;
      case 'ai-ml-costs':
        return <FaRobot />;
      case 'governance':
        return <FaCogs />;
      default:
        return <FaFileAlt />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'finops-strategy': 'bg-blue-100 text-blue-700',
      'cloud-optimization': 'bg-green-100 text-green-700',
      'ai-ml-costs': 'bg-purple-100 text-purple-700',
      'governance': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/c3ops-logo-full-light.svg" 
                alt="C3Ops - FinOps Platform" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-gray-900">Whitepapers</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              FinOps <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Research</span> & Insights
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Access our comprehensive library of research papers, strategic guides, and industry insights 
              to advance your FinOps knowledge and implementation success.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search whitepapers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-accent-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Download Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-accent-600 mb-2">14,000+</div>
              <div className="text-gray-600 font-medium">Total Downloads</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-primary-600 mb-2">8</div>
              <div className="text-gray-600 font-medium">Research Papers</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-accent-600 mb-2">250+</div>
              <div className="text-gray-600 font-medium">Pages of Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Whitepapers */}
      {featuredPapers.length > 0 && (
        <section className="py-8 px-4">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Research</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPapers.map((paper) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(paper.category)}`}>
                      {categories.find(cat => cat.id === paper.category)?.name}
                    </span>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                      FEATURED
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                    {paper.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{paper.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Topics:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {paper.keyTopics.slice(0, 3).map((topic, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FaUser />
                        {paper.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {new Date(paper.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span>{paper.pages} pages</span>
                      <span className="flex items-center gap-1">
                        <FaDownload />
                        {paper.downloads}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium">
                      <FaDownload />
                      Download PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaEye />
                      Preview
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Whitepapers */}
      <section className="py-8 px-4 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Research Library</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(paper.category)}`}>
                    {categories.find(cat => cat.id === paper.category)?.name}
                  </span>
                  <div className="text-2xl text-gray-400 group-hover:text-indigo-600 transition-colors">
                    {getCategoryIcon(paper.category)}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {paper.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{paper.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{paper.author}</span>
                  <span>{paper.pages} pages</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {paper.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-white text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm">
                    <FaDownload />
                    Download
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm">
                    <FaEye />
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-accent-100 border-t-2 border-accent-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-black mb-4 text-gray-900">Get Notified of New Research</h2>
          <p className="text-lg mb-8 text-gray-700">
            Be the first to access our latest whitepapers and research insights on FinOps and cloud cost optimization.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-accent-200 focus:ring-2 focus:ring-accent-500 focus:outline-none bg-white"
            />
            <button className="bg-accent-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-accent-700 transition-all duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No spam. Unsubscribe at any time. Privacy policy applies.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Whitepapers;