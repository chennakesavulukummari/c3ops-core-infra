import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaLinkedin, 
  FaInstagram, FaCalendarAlt, FaRocket, FaUsers, FaHeadset,
  FaBuilding, FaDollarSign, FaChartLine
} from 'react-icons/fa';
import TypeformModal from '../components/common/TypeformModal';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

const Contact = () => {
  const [isTypeformOpen, setIsTypeformOpen] = useState(false);
  const [typeformAction, setTypeformAction] = useState('');
  
  const openTypeform = (actionType) => {
    setTypeformAction(actionType);
    setIsTypeformOpen(true);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    cloudProvider: '',
    monthlyCost: '',
    challenge: '',
    urgency: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '', email: '', company: '', role: '', phone: '',
          cloudProvider: '', monthlyCost: '', challenge: '', urgency: '', message: ''
        });
        setFormStatus('');
      }, 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl text-green-600" />,
      title: "Email Us",
      primary: "info@c3ops.io",
      // secondary: "sales@c3ops.io",
      description: "Get in touch for consultations and support"
    },
    {
      icon: <FaPhone className="text-2xl text-green-600" />,
      title: "Call Us",
      primary: "+91 9390361519",
      description: "Mon-Fri, 9AM-6PM (IST & PST)"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-green-600" />,
      title: "Visit Us",
      primary: "Hyderabad",
      secondary: "Telangana, India",
      description: "Our global office"
    },
    {
      icon: <FaCalendarAlt className="text-2xl text-green-600" />,
      title: "Schedule a Call",
      primary: "Book a Free Consultation",
      secondary: "30-min FinOps Assessment",
      description: "Available Monday through Friday"
    }
  ];

  const services = [
    {
      icon: <FaChartLine className="text-3xl text-green-600" />,
      title: "FinOps Assessment",
      description: "Comprehensive analysis of your cloud spend and optimization opportunities",
      duration: "2-4 weeks",
      price: "Free initial assessment"
    },
    {
      icon: <FaRocket className="text-3xl text-green-600" />,
      title: "Platform Implementation",
      description: "Deploy our FinOps platform with custom dashboards and automation",
      duration: "6-12 weeks",
      price: "Starting at $25K"
    },
    {
      icon: <FaUsers className="text-3xl text-green-600" />,
      title: "Team Training",
      description: "Comprehensive FinOps certification and best practices training",
      duration: "4-8 weeks",
      price: "Starting at $15K"
    },
    {
      icon: <FaHeadset className="text-3xl text-green-600" />,
      title: "Ongoing Support",
      description: "24/7 monitoring, optimization recommendations, and expert guidance",
      duration: "Ongoing",
      price: "Custom pricing"
    }
  ];

  const offices = [
    {
      city: "Hyderabad",
      country: "India",
      address: "HITEC City, Cyberabad",
      timezone: "IST (UTC +5:30)",
      phone: "+91 9390361519",
      email: "info@c3ops.io"
    }
    // {
    //   city: "San Francisco", 
    //   country: "USA",
    //   address: "SOMA District, CA",
    //   timezone: "PST (UTC -8)",
    //   phone: "+1 (555) 123-4567",
    //   email: "usa@c3ops.com"
    // }
  ];

  const cloudProviders = ['AWS', 'Microsoft Azure', 'Google Cloud', 'Multi-cloud', 'Other'];
  const monthlyCosts = ['< $10K', '$10K - $50K', '$50K - $200K', '$200K - $1M', '$1M+'];
  const challenges = ['High costs', 'Lack of visibility', 'No governance', 'Team training', 'All of the above'];
  const urgencyLevels = ['ASAP (Within 30 days)', 'Soon (1-3 months)', 'Planning (3-6 months)', 'Exploring (6+ months)'];

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
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Optimize</span> Together
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your cloud economics? Get in touch with our FinOps experts for a free consultation 
              and discover how much you could be saving.
            </p>
          </motion.div>

          {/* Quick Contact Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                <div className="text-green-600 font-semibold mb-1">{info.primary}</div>
                <div className="text-gray-600 text-sm mb-2">{info.secondary}</div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Free</span> FinOps Assessment
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Click the button below to start your free FinOps assessment. We'll get back to you within 24 hours with a customized cost optimization strategy.
              </p>

              <button
                onClick={() => openTypeform('assessment')}
                className="inline-block py-4 px-12 rounded-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105"
              >
                Get Your Free FinOps Assessment
              </button>
            </motion.div>

            {/* Services Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Our</span> Services
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-start gap-4">
                      <div>{service.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600 font-semibold">Duration: {service.duration}</span>
                          <span className="text-gray-700 font-semibold">{service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
                <h4 className="font-bold text-gray-900 mb-4 text-center">Follow Us</h4>
                <div className="flex gap-4 justify-center">
                  <a 
                    href="https://www.linkedin.com/company/c3ops/?viewAsMember=true" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A66C2] p-4 rounded-xl text-white hover:bg-[#004182] transition-all shadow-lg hover:shadow-xl hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-3xl" />
                  </a>
                  <a 
                    href="https://www.instagram.com/finops.c3ops/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-4 rounded-xl text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-3xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commented Form Section
                <h3 className="text-xl font-bold text-gray-900 mb-4">Or Contact Us Directly</h3>
                <p className="text-gray-600 mb-6">
                  Prefer to reach out directly? Fill out this form and we'll get back to you within 24 hours.
                </p>
              </div>

              {formStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <strong>Success!</strong> Your message has been sent. We'll contact you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role/Title *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., CTO, Cloud Architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Cloud Provider *
                    </label>
                    <select
                      name="cloudProvider"
                      value={formData.cloudProvider}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select provider</option>
                      {cloudProviders.map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Cloud Spend *
                    </label>
                    <select
                      name="monthlyCost"
                      value={formData.monthlyCost}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select range</option>
                      {monthlyCosts.map(cost => (
                        <option key={cost} value={cost}>{cost}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Challenge *
                    </label>
                    <select
                      name="challenge"
                      value={formData.challenge}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select challenge</option>
                      {challenges.map(challenge => (
                        <option key={challenge} value={challenge}>{challenge}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timeline *
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      {urgencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us more about your specific requirements or challenges..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                    formStatus === 'sending' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Get Free Assessment'}
                </button>
              </form> 
      End Commented Form Section */}

      

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "How quickly can we see cost savings?",
                a: "Most clients see initial savings within 30 days, with significant optimization results typically achieved within 90 days of implementation."
              },
              {
                q: "Do you work with all cloud providers?",
                a: "Yes, we support AWS, Microsoft Azure, Google Cloud Platform, and multi-cloud environments. Our expertise covers all major cloud providers."
              },
              {
                q: "What's included in the free assessment?",
                a: "Our free assessment includes current spend analysis, identification of optimization opportunities, potential savings estimation, and a customized optimization roadmap."
              },
              {
                q: "How does pricing work?",
                a: "We offer flexible pricing models including project-based, monthly retainers, and success-fee arrangements. Pricing depends on your cloud spend and requirements."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-green-50 p-6 rounded-xl border border-green-100"
              >
                <h4 className="font-bold text-gray-900 mb-3">{faq.q}</h4>
                <p className="text-gray-700">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Typeform Modal */}
      <TypeformModal 
        isOpen={isTypeformOpen} 
        onClose={() => setIsTypeformOpen(false)} 
        actionType={typeformAction}
      />

      <SiteFooter />
    </div>
  );
};

export default Contact;