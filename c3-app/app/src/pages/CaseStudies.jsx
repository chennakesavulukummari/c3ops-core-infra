import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaFileAlt, FaChartLine, FaDollarSign, FaClock,
  FaUsers, FaCloud, FaDownload, FaExternalLinkAlt, FaTrophy
} from 'react-icons/fa';

const CaseStudies = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  const industries = [
    { id: 'all', name: 'All Industries', count: 6 },
    { id: 'technology', name: 'Technology', count: 2 },
    { id: 'fintech', name: 'FinTech', count: 2 },
    { id: 'ecommerce', name: 'E-commerce', count: 1 },
    { id: 'healthcare', name: 'Healthcare', count: 1 }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'TechFlow Solutions: 45% Cost Reduction in 6 Months',
      company: 'TechFlow Solutions',
      industry: 'technology',
      companySize: '500-1000 employees',
      cloudProvider: 'AWS',
      challenge: 'Exponential cloud cost growth without visibility',
      solution: 'Comprehensive FinOps implementation with automated optimization',
      results: {
        costReduction: 45,
        monthlySavings: 120000,
        timeToValue: '3 months',
        efficiency: 85
      },
      timeline: '6 months',
      technologies: ['AWS', 'Kubernetes', 'Terraform'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '45%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$120K', trend: 'positive' },
        { label: 'Efficiency Score', value: '85%', trend: 'positive' },
        { label: 'ROI', value: '400%', trend: 'positive' }
      ],
      testimonial: {
        quote: "C3Ops transformed our cloud cost management. We went from having no visibility to achieving 45% cost reduction in just 6 months.",
        author: "Sarah Johnson",
        role: "CTO, TechFlow Solutions"
      },
      featured: true
    },
    {
      id: 2,
      title: 'FinanceFirst: Multi-Cloud Cost Optimization Success',
      company: 'FinanceFirst',
      industry: 'fintech',
      companySize: '200-500 employees',
      cloudProvider: 'AWS + Azure',
      challenge: 'Managing costs across multiple cloud providers',
      solution: 'Unified multi-cloud cost management and governance',
      results: {
        costReduction: 38,
        monthlySavings: 85000,
        timeToValue: '4 months',
        efficiency: 80
      },
      timeline: '8 months',
      technologies: ['AWS', 'Azure', 'Multi-Cloud'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '38%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$85K', trend: 'positive' },
        { label: 'Efficiency Score', value: '80%', trend: 'positive' },
        { label: 'ROI', value: '320', trend: 'positive' }
      ],
      testimonial: {
        quote: "The multi-cloud visibility and optimization strategies provided by C3Ops gave us unprecedented control over our cloud spending.",
        author: "Michael Chen",
        role: "CFO, FinanceFirst"
      },
      featured: true
    },
    {
      id: 3,
      title: 'ShopSmart: E-commerce Platform Cost Optimization',
      company: 'ShopSmart',
      industry: 'ecommerce',
      companySize: '100-200 employees',
      cloudProvider: 'GCP',
      challenge: 'Seasonal traffic spikes causing unpredictable costs',
      solution: 'Dynamic scaling and predictive cost management',
      results: {
        costReduction: 35,
        monthlySavings: 45000,
        timeToValue: '2 months',
        efficiency: 75
      },
      timeline: '4 months',
      technologies: ['GCP', 'Kubernetes', 'Auto-scaling'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '35%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$45K', trend: 'positive' },
        { label: 'Efficiency Score', value: '75%', trend: 'positive' },
        { label: 'ROI', value: '280%', trend: 'positive' }
      ],
      testimonial: {
        quote: "C3Ops helped us handle seasonal traffic efficiently while keeping costs predictable. Game-changer for our business.",
        author: "Lisa Rodriguez",
        role: "VP Engineering, ShopSmart"
      },
      featured: false
    },
    {
      id: 4,
      title: 'HealthTech Innovations: Compliance-First Cost Management',
      company: 'HealthTech Innovations',
      industry: 'healthcare',
      companySize: '300-500 employees',
      cloudProvider: 'Azure',
      challenge: 'Balancing compliance requirements with cost optimization',
      solution: 'HIPAA-compliant cost optimization framework',
      results: {
        costReduction: 28,
        monthlySavings: 65000,
        timeToValue: '5 months',
        efficiency: 70
      },
      timeline: '7 months',
      technologies: ['Azure', 'Compliance', 'Security'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '28%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$65K', trend: 'positive' },
        { label: 'Efficiency Score', value: '70%', trend: 'positive' },
        { label: 'ROI', value: '250%', trend: 'positive' }
      ],
      testimonial: {
        quote: "C3Ops understood our compliance needs and delivered cost optimization without compromising security or regulatory requirements.",
        author: "Dr. James Wilson",
        role: "CTO, HealthTech Innovations"
      },
      featured: false
    },
    {
      id: 5,
      title: 'DataDrive Analytics: AI/ML Workload Cost Optimization',
      company: 'DataDrive Analytics',
      industry: 'technology',
      companySize: '150-300 employees',
      cloudProvider: 'AWS',
      challenge: 'High GPU costs for machine learning training',
      solution: 'ML workload optimization and spot instance management',
      results: {
        costReduction: 52,
        monthlySavings: 95000,
        timeToValue: '3 months',
        efficiency: 88
      },
      timeline: '5 months',
      technologies: ['AWS', 'ML/AI', 'GPU Optimization'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '52%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$95K', trend: 'positive' },
        { label: 'Efficiency Score', value: '88%', trend: 'positive' },
        { label: 'ROI', value: '450%', trend: 'positive' }
      ],
      testimonial: {
        quote: "Our ML training costs were out of control. C3Ops helped us optimize GPU usage and implement spot instances effectively.",
        author: "Rachel Kim",
        role: "Head of AI, DataDrive Analytics"
      },
      featured: false
    },
    {
      id: 6,
      title: 'PaySecure: Scaling FinTech Infrastructure Efficiently',
      company: 'PaySecure',
      industry: 'fintech',
      companySize: '50-100 employees',
      cloudProvider: 'AWS + GCP',
      challenge: 'Rapid growth leading to inefficient resource allocation',
      solution: 'Growth-optimized cost management and resource planning',
      results: {
        costReduction: 42,
        monthlySavings: 38000,
        timeToValue: '2 months',
        efficiency: 82
      },
      timeline: '6 months',
      technologies: ['AWS', 'GCP', 'Auto-scaling'],
      keyMetrics: [
        { label: 'Cost Reduction', value: '42%', trend: 'positive' },
        { label: 'Monthly Savings', value: '$38K', trend: 'positive' },
        { label: 'Efficiency Score', value: '82%', trend: 'positive' },
        { label: 'ROI', value: '360%', trend: 'positive' }
      ],
      testimonial: {
        quote: "C3Ops enabled us to scale efficiently while maintaining cost discipline. Essential for our growth phase.",
        author: "Alex Thompson",
        role: "Founder & CEO, PaySecure"
      },
      featured: false
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => 
    selectedIndustry === 'all' || study.industry === selectedIndustry
  );

  const featuredCaseStudies = filteredCaseStudies.filter(study => study.featured);
  const regularCaseStudies = filteredCaseStudies.filter(study => !study.featured);

  const getIndustryColor = (industry) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700',
      fintech: 'bg-green-100 text-green-700',
      ecommerce: 'bg-purple-100 text-purple-700',
      healthcare: 'bg-red-100 text-red-700'
    };
    return colors[industry] || 'bg-gray-100 text-gray-700';
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
              <span className="font-bold text-gray-900">Case Studies</span>
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
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Success Stories</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover how organizations across industries have transformed their cloud cost management 
              and achieved significant savings with C3Ops FinOps solutions.
            </p>
          </motion.div>

          {/* Industry Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedIndustry === industry.id
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {industry.name} ({industry.count})
              </button>
            ))}
          </div>

          {/* Success Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-accent-600 mb-2">45%</div>
              <div className="text-gray-600 font-medium">Average Cost Reduction</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-accent-600 mb-2">$2.8M+</div>
              <div className="text-gray-600 font-medium">Total Savings Achieved</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-primary-600 mb-2">3.2</div>
              <div className="text-gray-600 font-medium">Months Avg Time to Value</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-black text-orange-600 mb-2">350%</div>
              <div className="text-gray-600 font-medium">Average ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-8 px-4">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Featured Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredCaseStudies.map((study) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCaseStudy(study)}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getIndustryColor(study.industry)}`}>
                        {industries.find(ind => ind.id === study.industry)?.name}
                      </span>
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                        FEATURED
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors">
                      {study.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.keyMetrics.map((metric, index) => (
                        <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-black text-accent-600">{metric.value}</div>
                          <div className="text-xs text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <blockquote className="border-l-4 border-accent-500 pl-4 mb-4">
                      <p className="text-gray-700 italic">"{study.testimonial.quote}"</p>
                      <footer className="text-sm text-gray-500 mt-2">
                        — {study.testimonial.author}, {study.testimonial.role}
                      </footer>
                    </blockquote>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {study.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCloud />
                        {study.cloudProvider}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Case Studies */}
      <section className="py-8 px-4 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Case Studies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedCaseStudy(study)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getIndustryColor(study.industry)}`}>
                    {industries.find(ind => ind.id === study.industry)?.name}
                  </span>
                  <FaChartLine className="text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {study.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-lg font-black text-accent-600">{study.results.costReduction}%</div>
                    <div className="text-xs text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-lg font-black text-primary-600">${study.results.monthlySavings/1000}K</div>
                    <div className="text-xs text-gray-600">Monthly Savings</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{study.companySize}</span>
                  <span>{study.timeline}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-accent-100 border-t-2 border-accent-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-black mb-4 text-gray-900">Ready to Write Your Success Story?</h2>
          <p className="text-lg mb-8 text-gray-700">
            Join these industry leaders and start your FinOps transformation journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 transition-all duration-300"
            >
              Get Started Today
            </Link>
            <button className="inline-flex items-center gap-2 border-2 border-accent-600 text-accent-600 font-bold py-3 px-8 rounded-lg hover:bg-accent-600 hover:text-white transition-all duration-300">
              <FaDownload />
              Download All Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCaseStudy.title}</h2>
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Challenge</h3>
                  <p className="text-gray-700 mb-6">{selectedCaseStudy.challenge}</p>
                  
                  <h3 className="font-bold text-gray-900 mb-4">Solution</h3>
                  <p className="text-gray-700">{selectedCaseStudy.solution}</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Key Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCaseStudy.keyMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-black text-accent-600">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="border-l-4 border-accent-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                <p className="text-gray-700 italic text-lg">"{selectedCaseStudy.testimonial.quote}"</p>
                <footer className="text-gray-600 mt-3">
                  — {selectedCaseStudy.testimonial.author}, {selectedCaseStudy.testimonial.role}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;