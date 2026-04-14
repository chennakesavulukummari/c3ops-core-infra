import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaStar, FaQuoteLeft, FaPlay, FaUsers, FaBuilding,
  FaChartLine, FaAward, FaFilter, FaIndustry, FaGlobe
} from 'react-icons/fa';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

const Testimonials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const categories = [
    { id: 'all', name: 'All Testimonials', count: 24 },
    { id: 'cost-savings', name: 'Cost Savings', count: 12 },
    { id: 'process-improvement', name: 'Process Improvement', count: 8 },
    { id: 'team-training', name: 'Team Training', count: 6 },
    { id: 'platform-implementation', name: 'Platform Implementation', count: 10 }
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Financial Services' },
    { id: 'retail', name: 'Retail & E-commerce' },
    { id: 'manufacturing', name: 'Manufacturing' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechFlow Solutions",
      industry: "technology",
      category: "cost-savings",
      rating: 5,
      quote: "C3Ops helped us reduce our AWS costs by 65% in just 6 months. Their FinOps expertise and automated optimization tools delivered results beyond our expectations.",
      fullTestimonial: "When we engaged C3Ops, our cloud costs were spiraling out of control. Within the first month, their team identified over $2.3M in potential savings. The implementation of their FinOps framework not only cut our costs by 65% but also gave us complete visibility into our spending patterns. The best part? Our engineering productivity actually increased because we could focus on building instead of managing infrastructure costs.",
      savings: "$2.3M annually",
      timeline: "6 months",
      companySize: "500-1000 employees",
      cloudProvider: "AWS",
      video: false,
      featured: true
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "CTO",
      company: "HealthTech Innovations",
      industry: "healthcare",
      category: "platform-implementation",
      rating: 5,
      quote: "The FinOps platform implementation was seamless. We now have real-time cost visibility across all departments and our teams make cost-conscious decisions automatically.",
      fullTestimonial: "Implementing FinOps practices across our multi-cloud environment seemed daunting until we partnered with C3Ops. Their structured approach and proven methodology made the transformation smooth. The platform they deployed gives us granular cost insights and automated governance. Our development teams now consider cost implications in every architectural decision.",
      savings: "$1.8M annually",
      timeline: "4 months",
      companySize: "200-500 employees",
      cloudProvider: "Multi-cloud",
      video: true,
      featured: true
    },
    {
      id: 3,
      name: "Jennifer Park",
      role: "CFO",
      company: "Global Retail Corp",
      industry: "retail",
      category: "process-improvement",
      rating: 5,
      quote: "C3Ops transformed our cloud cost management from reactive to proactive. We now have predictable budgets and clear cost allocation across business units.",
      fullTestimonial: "Before C3Ops, our cloud spending was unpredictable and cost allocation was a monthly nightmare. Their team established clear governance processes, implemented automated cost controls, and trained our teams on FinOps best practices. Now we have accurate forecasting and each business unit owns their cloud costs.",
      savings: "$3.2M annually",
      timeline: "8 months",
      companySize: "1000+ employees",
      cloudProvider: "Azure + AWS",
      video: false,
      featured: true
    },
    {
      id: 4,
      name: "David Kumar",
      role: "Head of Cloud Operations",
      company: "FinanceSecure Bank",
      industry: "finance",
      category: "team-training",
      rating: 5,
      quote: "The FinOps training program was exceptional. Our entire cloud team is now certified and we've seen a 40% improvement in cost optimization initiatives.",
      fullTestimonial: "C3Ops provided comprehensive FinOps training for our 50-person cloud operations team. The curriculum was tailored to our banking environment and regulatory requirements. Post-training, our team's ability to identify and implement cost optimizations improved dramatically. The certification program ensured everyone had consistent knowledge and practices.",
      savings: "$900K annually",
      timeline: "3 months",
      companySize: "5000+ employees",
      cloudProvider: "AWS",
      video: false,
      featured: false
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Director of IT",
      company: "ManufactureTech Solutions",
      industry: "manufacturing",
      category: "cost-savings",
      rating: 5,
      quote: "Incredible results! Our IoT infrastructure costs dropped by 55% while scaling operations 200%. The ROI was evident within the first quarter.",
      fullTestimonial: "As a manufacturing company with massive IoT deployments, our cloud costs were becoming prohibitive. C3Ops analyzed our usage patterns, implemented right-sizing strategies, and optimized our data storage approach. The result was a 55% cost reduction while we actually scaled our operations 200%. Their expertise in industrial IoT cost optimization is unmatched.",
      savings: "$1.5M annually",
      timeline: "5 months",
      companySize: "200-500 employees",
      cloudProvider: "GCP + AWS",
      video: true,
      featured: false
    },
    {
      id: 6,
      name: "Robert Kim",
      role: "VP of Technology",
      company: "StartupUnicorn",
      industry: "technology",
      category: "process-improvement",
      rating: 5,
      quote: "From startup chaos to enterprise-grade cost management. C3Ops scaled with us and their processes adapted perfectly to our rapid growth.",
      fullTestimonial: "When we were scaling from Series A to Series C, our cloud costs were growing faster than our revenue. C3Ops implemented scalable FinOps processes that grew with us. Their governance framework and automated policies ensured we maintained cost discipline even during aggressive expansion phases. Essential for any growing startup.",
      savings: "$800K annually",
      timeline: "6 months",
      companySize: "100-200 employees",
      cloudProvider: "AWS",
      video: false,
      featured: false
    }
  ];

  const stats = [
    { icon: <FaUsers />, value: "3+", label: "Happy Clients" },
    { icon: <FaStar />, value: "4.9/5", label: "Average Rating" },
    { icon: <FaChartLine />, value: "68%", label: "Average Cost Reduction" },
    { icon: <FaAward />, value: "98%", label: "Client Satisfaction" }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const categoryMatch = selectedCategory === 'all' || testimonial.category === selectedCategory;
    const industryMatch = selectedIndustry === 'all' || testimonial.industry === selectedIndustry;
    return categoryMatch && industryMatch;
  });

  const featuredTestimonials = testimonials.filter(t => t.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pt-24">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Success Stories</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Discover how organizations across industries have transformed their cloud economics with C3Ops. 
              Real results, real savings, real impact.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-100"
              >
                <div className="text-3xl text-green-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Featured</span> Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how leading organizations have transformed their cloud economics with measurable results.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  {testimonial.video && (
                    <div className="bg-green-600 text-white p-2 rounded-full">
                      <FaPlay className="text-sm" />
                    </div>
                  )}
                </div>
  
                        <FaQuoteLeft className="text-2xl text-green-600 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-green-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-green-600 font-semibold">{testimonial.role}</div>
                      <div className="text-sm text-gray-600">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-green-600 font-semibold">Savings</div>
                      <div className="font-bold">{testimonial.savings}</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold">Timeline</div>
                      <div className="font-bold">{testimonial.timeline}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & All Testimonials */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Testimonials</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse testimonials by category and industry to find stories relevant to your organization.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <div className="flex items-center gap-2">
                <FaFilter className="text-green-600" />
                <span className="font-semibold text-gray-700">Category:</span>
              </div>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <FaIndustry className="text-green-600" />
                <span className="font-semibold text-gray-700">Industry:</span>
              </div>
              {industries.map(industry => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    selectedIndustry === industry.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                  }`}
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      testimonial.industry === 'technology' ? 'bg-blue-100 text-blue-700' :
                      testimonial.industry === 'healthcare' ? 'bg-red-100 text-red-700' :
                      testimonial.industry === 'finance' ? 'bg-green-100 text-green-700' :
                      testimonial.industry === 'retail' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {industries.find(i => i.id === testimonial.industry)?.name}
                    </span>
                    {testimonial.video && (
                      <div className="bg-green-600 text-white p-1 rounded-full">
                        <FaPlay className="text-xs" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-green-600 font-semibold">{testimonial.role}</div>
                      <div className="text-xs text-gray-600">{testimonial.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{testimonial.companySize}</div>
                      <div className="text-xs font-semibold text-blue-600">{testimonial.cloudProvider}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-green-600 font-semibold">Savings</div>
                      <div className="font-bold">{testimonial.savings}</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold">Timeline</div>
                      <div className="font-bold">{testimonial.timeline}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Success Stories?</h2>
            <p className="text-xl mb-8 text-green-100">
              Start your FinOps transformation today and achieve measurable cost savings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </Link>
              <Link 
                to="/case-studies" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default Testimonials;