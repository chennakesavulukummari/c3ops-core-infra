import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaBlog, FaCalendar, FaUser, FaClock, FaTags,
  FaSearch, FaArrowRight, FaChartLine, FaCloud, FaRobot
} from 'react-icons/fa';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'finops', name: 'FinOps', count: 5 },
    { id: 'cloud-optimization', name: 'Cloud Optimization', count: 4 },
    { id: 'ai-ml', name: 'AI/ML Costs', count: 2 },
    { id: 'case-studies', name: 'Case Studies', count: 1 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Complete Guide to FinOps Implementation in 2025',
      excerpt: 'Learn how to successfully implement FinOps practices in your organization with our comprehensive step-by-step guide covering people, processes, and technology.',
      category: 'finops',
      author: 'Rajesh Kumar',
      date: '2025-02-15',
      readTime: '12 min read',
      tags: ['FinOps', 'Implementation', 'Best Practices'],
      featured: true,
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'AWS Cost Optimization: 15 Proven Strategies That Save 40%+ on Your Bill',
      excerpt: 'Discover the most effective AWS cost optimization techniques used by top companies to reduce their cloud spending significantly.',
      category: 'cloud-optimization',
      author: 'Sarah Chen',
      date: '2025-02-10',
      readTime: '15 min read',
      tags: ['AWS', 'Cost Optimization', 'Savings'],
      featured: true,
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Managing AI/ML Workload Costs: A Practical Guide for 2025',
      excerpt: 'AI and ML workloads can be expensive. Learn how to optimize GPU utilization, manage training costs, and implement cost-effective ML pipelines.',
      category: 'ai-ml',
      author: 'Dr. Priya Sharma',
      date: '2025-02-05',
      readTime: '18 min read',
      tags: ['AI/ML', 'GPU Optimization', 'Cost Management'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Multi-Cloud Cost Management: Strategies for AWS, Azure, and GCP',
      excerpt: 'Managing costs across multiple cloud providers presents unique challenges. Here\'s how to create a unified approach to multi-cloud financial management.',
      category: 'cloud-optimization',
      author: 'Michael Rodriguez',
      date: '2025-01-28',
      readTime: '14 min read',
      tags: ['Multi-Cloud', 'AWS', 'Azure', 'GCP'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Building a Cost-Conscious Engineering Culture',
      excerpt: 'Transform your engineering organization with proven strategies to embed cost awareness into daily development practices and decision-making.',
      category: 'finops',
      author: 'Jennifer Park',
      date: '2025-01-22',
      readTime: '10 min read',
      tags: ['Culture', 'Engineering', 'Cost Awareness'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Azure Reserved Instances vs Savings Plans: Which Should You Choose?',
      excerpt: 'A detailed comparison of Azure\'s commitment-based discount programs to help you make the right choice for your workloads.',
      category: 'cloud-optimization',
      author: 'Alex Thompson',
      date: '2025-01-18',
      readTime: '8 min read',
      tags: ['Azure', 'Reserved Instances', 'Savings Plans'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 7,
      title: 'Container Cost Optimization: Kubernetes Resource Management',
      excerpt: 'Optimize your Kubernetes clusters for cost efficiency with proper resource requests, limits, and scaling strategies.',
      category: 'cloud-optimization',
      author: 'David Kim',
      date: '2025-01-15',
      readTime: '16 min read',
      tags: ['Kubernetes', 'Containers', 'Resource Management'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 8,
      title: 'FinOps KPIs: Metrics That Matter for Cloud Financial Management',
      excerpt: 'Identify and track the most important FinOps metrics to measure success and drive continuous improvement in your cloud cost management.',
      category: 'finops',
      author: 'Lisa Wang',
      date: '2025-01-12',
      readTime: '11 min read',
      tags: ['KPIs', 'Metrics', 'Financial Management'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 9,
      title: 'Machine Learning Cost Forecasting: Predicting Your AI Spend',
      excerpt: 'Use machine learning techniques to forecast and optimize your AI/ML infrastructure costs with predictive analytics.',
      category: 'ai-ml',
      author: 'Dr. Amit Patel',
      date: '2025-01-08',
      readTime: '13 min read',
      tags: ['ML', 'Forecasting', 'Predictive Analytics'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 10,
      title: 'Case Study: How TechCorp Reduced Cloud Costs by 45% in 6 Months',
      excerpt: 'A detailed case study of how a mid-size tech company achieved dramatic cost savings through strategic FinOps implementation.',
      category: 'case-studies',
      author: 'Rajesh Kumar',
      date: '2025-01-05',
      readTime: '20 min read',
      tags: ['Case Study', 'Success Story', 'Cost Reduction'],
      featured: false,
      image: '/api/placeholder/400/250'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'finops':
        return <FaChartLine />;
      case 'cloud-optimization':
        return <FaCloud />;
      case 'ai-ml':
        return <FaRobot />;
      default:
        return <FaBlog />;
    }
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
              <span className="font-bold text-gray-900">Blog</span>
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
              FinOps <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Insights</span> & Expertise
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Stay ahead with the latest FinOps strategies, cloud optimization techniques, and cost management best practices from our experts.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
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
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-8 px-4">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <div className="text-6xl text-accent-600 opacity-30">
                      {getCategoryIcon(post.category)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <span className="text-amber-500 text-xs font-bold">FEATURED</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendar />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-8 px-4 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-4xl text-gray-400">
                    {getCategoryIcon(post.category)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-accent-100 border-t-2 border-accent-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-black mb-4 text-gray-900">Stay Updated with FinOps Trends</h2>
          <p className="text-lg mb-8 text-gray-700">
            Get the latest cloud cost optimization insights and FinOps best practices delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-accent-200 focus:ring-2 focus:ring-accent-500 focus:outline-none bg-white"
            />
            <button className="bg-accent-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-accent-700 transition-all duration-300 flex items-center gap-2">
              Subscribe <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;