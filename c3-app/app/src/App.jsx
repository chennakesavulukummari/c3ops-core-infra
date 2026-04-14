import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloud, FaChartLine, FaShieldAlt, FaCogs, FaDatabase, 
  FaAws, FaMicrosoft, FaGoogle, FaCheckCircle, FaArrowRight,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaBars, FaTimes,
  FaLinkedin, FaTwitter, FaInstagram, FaStar, FaUsers, FaRocket, FaTrophy, FaArrowDown, FaLevelDownAlt,
  FaEye, FaBullseye, FaSyncAlt, FaChartBar, FaLock, FaAward,
  FaExclamationTriangle, FaClock, FaBolt, FaCoins
} from 'react-icons/fa';
import { SiAmazonaws, SiMicrosoftazure, SiGooglecloud, SiKubernetes } from 'react-icons/si';
import { MdTrendingDown, MdSpeed } from 'react-icons/md';
import { sendDemoRequestEmail, sendConfirmationEmail } from './services/emailService';
import TypeformModal from './components/common/TypeformModal';
import './index.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTypeformOpen, setIsTypeformOpen] = useState(false);
  const [typeformAction, setTypeformAction] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // (Typeform embed temporarily removed)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open typeform modal
  const openTypeform = (actionType) => {
    setTypeformAction(actionType);
    setIsTypeformOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.company) {
        setFormStatus({
          type: 'error',
          message: 'Please fill in all required fields.'
        });
        setIsSubmitting(false);
        return;
      }

      // Send demo request email to C3Ops (includes confirmation email to user)
      const response = await sendDemoRequestEmail(formData);

      // Success
      setFormStatus({
        type: 'success',
        message: response.message || 'Thank you! We\'ve received your demo request. Check your email for confirmation.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });

      // Clear success message after 8 seconds
      setTimeout(() => {
        setFormStatus({ type: '', message: '' });
      }, 8000);

    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your request. Please contact us directly at info@c3ops.io or call +91 9390361519'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to section function for footer links
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const modules = [
    {
      icon: <FaDatabase className="text-4xl" />,
      title: "Inform: Visibility & Allocation",
      description: "Connect AWS, Azure, and GCP. Normalize costs. Show spending by team, application, and environment in one dashboard.",
      features: ["Multi-cloud cost aggregation", "Tagging & cost allocation", "Shared dashboards for eng & finance", "Real-time spend tracking"]
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Optimize: Recommendations & Modeling",
      description: "Identify waste and model savings. Rightsizing, reservations, scheduling, storage tiers—every recommendation backed by data.",
      features: ["Rightsizing compute resources", "Reserved capacity planning", "Storage optimization", "Modeled ROI per action"]
    },
    {
      icon: <FaCogs className="text-4xl" />,
      title: "Operate: Automation & Governance",
      description: "Continuous monitoring with automated actions. Set guardrails, get alerts, and track savings over time—not just once.",
      features: ["Automated scheduling", "Policy-driven governance", "Anomaly detection & alerts", "FinOps KPI tracking"]
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Integrate: DevOps + FinOps",
      description: "Embed cost signals into CI/CD and architecture decisions. Engineering sees cost impact before deployment, not after.",
      features: ["Cost visibility in pipelines", "Budget guardrails", "Team accountability", "FinOps best practices"]
    }
  ];

  const benefits = [
    { stat: "25-35%", label: "Average Cost Reduction", description: "Typical savings in first year", icon: <MdTrendingDown />, gradient: "from-green-500 to-emerald-600" },
    { stat: "100%", label: "Multi-Cloud Visibility", description: "AWS, Azure, and GCP unified", icon: <FaCloud />, gradient: "from-blue-500 to-cyan-600" },
    { stat: "Ongoing", label: "Continuous Optimization", description: "Not just one-time audits", icon: <FaRocket />, gradient: "from-purple-500 to-pink-600" },
    { stat: "<1 Quarter", label: "Time to ROI", description: "First savings delivered quickly", icon: <FaCheckCircle />, gradient: "from-orange-500 to-red-600" }
  ];

  const cloudProviders = [
    { name: "AWS", icon: <FaAws className="text-6xl" />, color: "text-orange-500" },
    { name: "Azure", icon: <FaMicrosoft className="text-6xl" />, color: "text-blue-500" },
    { name: "GCP", icon: <FaGoogle className="text-6xl" />, color: "text-red-500" }
  ];

  const finopsKnowledge = [
    { question: "What is FinOps?", slug: "what-is-finops" },
    { question: "Why FinOps?", slug: "why-finops" },
    { question: "FinOps Culture", slug: "finops-culture" },
    { question: "FinOps Framework", slug: "finops-framework" },
    { question: "Cost Optimization", slug: "cost-optimization" },
    { question: "FinOps for AI", slug: "finops-for-ai" },
    { question: "AI for FinOps", slug: "ai-for-finops" }
  ];

  // (Accordion state removed — Knowledge now lives in footer links)

  const testimonials = [
    {
      name: "Sarah Joseph",
      role: "Platform Owner, SparkNZ",
      company: "SparkNZ",
      content: "C3Ops reduced our cloud spending by 28% in the first quarter. The insights are invaluable!",
      rating: 5,
      metric: "28% cost reduction in Q1"
    },
    {
      name: "Steve Williams",
      role: "Portfolio Manager, NN Group",
      company: "NN Group",
      content: "Finally, a platform that combines FinOps with DevOps seamlessly. Game changer for our team.",
      rating: 5,
      metric: "100% multi-cloud visibility"
    },
    {
      name: "Emily Rodriguez",
      role: "Director of Cloud Operations, GoDataFlow Inc",
      company: "GoDataFlow Inc",
      content: "The visibility into our multi-cloud infrastructure has transformed how we manage costs.",
      rating: 5,
      metric: "$45K monthly savings"
    }
  ];

  const integrations = [
    { name: "AWS Cost Explorer", category: "Native Integration" },
    { name: "Azure Cost Management", category: "Native Integration" },
    { name: "GCP Cloud Billing", category: "Native Integration" },
    { name: "Terraform", category: "IaC Integration" },
    { name: "Kubernetes", category: "Container Platform" },
    { name: "Jenkins", category: "CI/CD" },
    { name: "GitHub Actions", category: "CI/CD" },
    { name: "Slack", category: "Notifications" },
    { name: "PagerDuty", category: "Alerting" },
    { name: "Jira", category: "Project Management" },
    { name: "ServiceNow", category: "ITSM" },
    { name: "Datadog", category: "Monitoring" }
  ];

  const certifications = [
    { name: "FinOps Certified Practitioner", org: "FinOps Foundation" },
    { name: "FinOps Certified Engineer", org: "FinOps Foundation" },
    { name: "FinOps Certified FOCUS Analyst", org: "FinOps Foundation" },
    { name: "AWS Certified Solutions Architect", org: "Amazon Web Services" },
    { name: "Azure DevOps Engineer Expert", org: "Microsoft" },
    { name: "Google Cloud Professional Architect", org: "Google Cloud" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-white shadow-md transition-all duration-300 overflow-visible border-b-2 border-accent-200"
      >
        <div className="container-custom">
          <div className="flex justify-between items-center py-2">
            <a href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center cursor-pointer"
              >
                <img 
                  src="/c3ops-logo-full-light.svg" 
                  alt="C3Ops - FinOps Platform" 
                  className="h-10 w-auto"
                />
              </motion.div>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="flex items-center space-x-4">
                <a 
                  href="#home" 
                  className="text-gray-700 hover:text-accent-600 transition-colors font-medium cursor-pointer text-sm"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                >
                  Home
                </a>
                <Link 
                  to="/platform" 
                  className="text-gray-700 hover:text-accent-600 transition-colors font-medium cursor-pointer text-sm"
                >
                  Platform
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-700 hover:text-accent-600 transition-colors font-medium cursor-pointer text-sm"
                >
                  Pricing
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-accent-600 transition-colors font-medium cursor-pointer text-sm"
                >
                  Contact
                </Link>
              </div>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://finops.c3ops.io"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm cursor-pointer"
              >
                Launch App
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-800 p-2 hover:bg-accent-50 rounded-lg transition-colors z-50 relative"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Menu button clicked, current state:', isMenuOpen);
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              type="button"
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-accent-200 shadow-lg overflow-hidden"
              style={{ position: 'relative', zIndex: 40 }}
            >
              <div className="w-full py-4 px-6 space-y-2">
                <a 
                  href="#home" 
                  className="block text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-colors font-medium py-3 px-4 rounded-lg active:bg-accent-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  Home
                </a>
                <Link 
                  to="/platform" 
                  className="block text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-colors font-medium py-3 px-4 rounded-lg active:bg-accent-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Platform
                </Link>
                <Link 
                  to="/pricing" 
                  className="block text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-colors font-medium py-3 px-4 rounded-lg active:bg-accent-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-gray-700 hover:text-accent-600 hover:bg-accent-50 transition-colors font-medium py-3 px-4 rounded-lg active:bg-accent-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <a
                  href="https://finops.c3ops.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md text-center mt-2 cursor-pointer"
                >
                  Launch App
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-gray-50 to-white overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full border border-gray-300 shadow-sm"
              >
                <span className="text-sm font-semibold text-gray-800">Enterprise FinOps Platform + Expert Services</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight"
              >
                <span className="text-slate-900">Reduce cloud costs by </span>
                <span className="text-accent-600 font-extrabold">20–30%</span>
                <span className="text-slate-900"> with </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">
                FinOps automation.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                Multi-cloud cost optimization for engineering and finance teams. Get visibility, recommendations, and automated savings.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTypeform('assessment')}
                  className="group bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-bold py-3 px-6 md:py-3 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                >
                  <span>Book a FinOps Assessment</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Cloud Provider Logos */}
              {/* Cloud Provider Logos */}
              <div className="flex justify-center items-center gap-8 md:gap-12 mb-8 flex-wrap">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <SiAmazonaws className="w-12 h-12 md:w-16 md:h-16 text-orange-500" />
                  <p className="text-sm font-semibold text-gray-700 mt-2">AWS</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <SiMicrosoftazure className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
                  <p className="text-sm font-semibold text-gray-700 mt-2">Azure</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <SiGooglecloud className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
                  <p className="text-sm font-semibold text-gray-700 mt-2">GCP</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col items-center"
                >
                  <SiKubernetes className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700 mt-2">Kubernetes</p>
                </motion.div>
              </div>

              <img 
                src="/hero-page-c3ops-dashboard.png" 
                alt="C3Ops FinOps Platform Dashboard" 
                className="w-full rounded-3xl shadow-2xl border-2 border-gray-200"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FinOps Certifications Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-semibold text-gray-600 mb-8 tracking-wide">FINOPS CERTIFIED & PARTNER</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">Industry Certifications & Trust</h2>
            <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="bg-slate-50 p-6 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300 h-40 w-40 md:h-48 md:w-48 flex items-center justify-center">
                  <img 
                    src="/FinOps_Certified_Practitioner.png" 
                    alt="FinOps Certified Practitioner" 
                    className="h-32 w-32 md:h-40 md:w-40 object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-4 text-center">FinOps Certified<br/>Practitioner</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center group"
              >
                <div className="bg-slate-50 p-6 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300 h-40 w-40 md:h-48 md:w-48 flex items-center justify-center">
                  <img 
                    src="/FinOps_Certified_FOCUS_Analyst.png" 
                    alt="FinOps Certified FOCUS Analyst" 
                    className="h-32 w-32 md:h-40 md:w-40 object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-4 text-center">FinOps Certified<br/>FOCUS Analyst</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center group"
              >
                <div className="bg-slate-50 p-6 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300 h-40 w-40 md:h-48 md:w-48 flex items-center justify-center">
                  <img 
                    src="/FinOps_Certified_Engineer.png" 
                    alt="FinOps Certified Engineer" 
                    className="h-32 w-32 md:h-40 md:w-40 object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-4 text-center">FinOps Certified<br/>Engineer</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 bg-slate-100 border-y border-slate-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 mb-6 font-medium tracking-wide">TRUSTED BY CLOUD-NATIVE ENTERPRISES</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="bg-accent-100 p-2 rounded-lg flex-shrink-0">
                  <FaCheckCircle className="text-accent-600 text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Enterprise Ready</p>
                  <p className="text-xs text-gray-500">SOC 2 Compliant</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="bg-accent-100 p-2 rounded-lg flex-shrink-0">
                  <FaAward className="text-accent-600 text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">FinOps Certified</p>
                  <p className="text-xs text-gray-500">Best Practices</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="bg-accent-100 p-2 rounded-lg flex-shrink-0">
                  <FaLock className="text-accent-600 text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Bank-Grade Security</p>
                  <p className="text-xs text-gray-500">256-bit Encryption</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="bg-accent-100 p-2 rounded-lg flex-shrink-0">
                  <MdSpeed className="text-accent-600 text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Fast Deployment</p>
                  <p className="text-xs text-gray-500">Live in 48 hours</p>
                </div>
              </motion.div>
            </div>

            {/* Cloud & FinOps Certifications Row */}
            {/* <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-6 font-medium tracking-wide text-center">OUR TEAM'S CLOUD & FINOPS CERTIFICATIONS</p>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  src="/FinOps_Certified_Practitioner.png"
                  alt="FinOps Certified Practitioner"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="FinOps Certified Practitioner"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  src="/FinOps_Certified_Engineer.png"
                  alt="FinOps Certified Engineer"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="FinOps Certified Engineer"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  src="/FinOps_Certified_FOCUS_Analyst.png"
                  alt="FinOps Certified FOCUS Analyst"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="FinOps Certified FOCUS Analyst"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  src="https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png"
                  alt="AWS Certified Solutions Architect"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="AWS Certified Solutions Architect"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  src="/DevOps_Badge.png"
                  alt="AWS Certified DevOps Engineer"
                  className="h-16 md:h-24 w-auto object-contain hover:scale-110 transition-transform"
                  title="AWS Certified DevOps Engineer"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  src="https://images.credly.com/size/340x340/images/c3ab66f8-5d59-4afa-a6c2-0ba30a1989ca/CERT-Expert-DevOps-Engineer-600x600.png"
                  alt="Azure DevOps Engineer Expert"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="Azure DevOps Engineer Expert"
                />
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  src="https://templates.images.credential.net/16590187933301617801540872729153.png"
                  alt="GCP Professional Cloud Architect"
                  className="h-14 md:h-20 w-auto object-contain hover:scale-110 transition-transform"
                  title="GCP Professional Cloud Architect"
                />
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs font-semibold text-gray-600 mb-4 tracking-wide">OUR CLIENTS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">Trusted by Leading Enterprise Organizations</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              <motion.a
                href="https://www.concentrix.com/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Concentrix</p>
              </motion.a>

              <motion.a
                href="https://www.netxcell.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Netxcell</p>
              </motion.a>

              <motion.a
                href="https://www.capgemini.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Capgemini</p>
              </motion.a>

              <motion.a
                href="https://www.bankofamerica.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Bank Of America</p>
              </motion.a>

              <motion.a
                href="https://www.spark.co.nz/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">SparkNZ</p>
              </motion.a>

              <motion.a
                href="https://www.suez.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Suez</p>
              </motion.a>

              <motion.a
                href="https://www.nn-group.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">NN Group</p>
              </motion.a>

              <motion.a
                href="https://www.godataflow.com/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">GoDataFlow INC</p>
              </motion.a>

              <motion.a
                href="https://www.iicl.org"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">IICL</p>
              </motion.a>

              <motion.a
                href="https://www.solaiera.ai"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24 cursor-pointer"
              >
                <p className="font-semibold text-gray-700 text-sm md:text-base hover:text-accent-600 transition-colors">Solaiera</p>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-100/50 to-gray-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-50/30 to-slate-50/30 rounded-full blur-3xl"></div>
        
        <div className="container-custom px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-5 py-2 bg-white rounded-full border border-gray-300 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Key Challenges</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Problems We <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Solve</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-semibold">
              Transform your cloud operations by addressing these critical challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                number: 1,
                title: 'Uncontrolled Cloud Spending',
                description: 'Cloud bills grow 30%-50% annually without clear ownership. Engineering builds, finance pays, and no one optimizes.',
                gradient: 'from-slate-50 to-slate-100',
                iconBg: 'from-slate-100 to-slate-200',
                icon: <FaExclamationTriangle />
              },
              {
                number: 2,
                title: 'Zero Multi-Cloud Visibility',
                description: 'You cannot manage what you cannot see. Scattered dashboards across AWS, Azure, and GCP make it impossible to track costs by team, application, or environment.',
                gradient: 'from-slate-50 to-slate-100',
                iconBg: 'from-slate-100 to-slate-200',
                icon: <FaEye />
              },
              {
                number: 3,
                title: 'Reactive Cost Control',
                description: 'Finance teams receive bills after the spend happens. By the time they react, waste has already compounded for weeks.',
                gradient: 'from-slate-50 to-slate-100',
                iconBg: 'from-slate-100 to-slate-200',
                icon: <FaClock />
              },
              {
                number: 4,
                title: 'No FinOps Practice',
                description: 'Teams lack FinOps expertise, processes, and time. One-off audits deliver temporary savings—then costs creep back up.',
                gradient: 'from-slate-50 to-slate-100',
                iconBg: 'from-slate-100 to-slate-200',
                icon: <FaChartLine />
              }
            ].map((problem, index) => (
              <motion.div
                key={problem.number}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className={`h-full bg-gradient-to-br ${problem.gradient} rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 border-2 border-white`}>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-gray-900 mb-4">{problem.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">{problem.description}</p>
                  </div>

                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 md:mt-16 text-center"
          >
            <motion.p
              className="text-gray-800 text-xl mb-8 font-semibold max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Enable your engineering teams to focus on innovation while we optimize your cloud economics.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTypeform('assessment')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-accent-300/50 transition-all duration-300 cursor-pointer"
            >
              <span>Get Started Today</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - COMMENTED OUT
      <section id="benefits" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/30 to-slate-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-200/20 to-primary-100/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-5 py-2 bg-white rounded-full border border-gray-300 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Proven Outcomes</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Measurable <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Business Impact</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto font-medium">
              Enterprise-grade outcomes from our FinOps platform and expert services
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <div className="text-white text-2xl">{benefit.icon}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black mb-2 text-slate-900">
                    {benefit.stat}
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-1">{benefit.label}</div>
                  <div className="text-sm text-gray-600">{benefit.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Customer Success Story Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/20 to-slate-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tl from-slate-200/20 to-primary-100/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-5 py-2 bg-white rounded-full border border-gray-300 shadow-sm">
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Customer Success Story</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              From <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">$340K Monthly Surprise</span> to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Predictable Savings</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How a fast-growing SaaS company reduced their AWS costs by 31% in one quarter
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* The Problem - Cloud Bill Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-red-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">The Problem</h3>
                    <p className="text-gray-600 font-medium">March 2025 - CFO receives the monthly bill</p>
                  </div>
                </div>

                {/* Simulated Cloud Bill */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-red-200">
                    <span className="text-sm font-bold text-gray-700">AWS Cost Explorer</span>
                    <span className="text-xs text-gray-600">March 1-31, 2025</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">EC2 Compute</span>
                      <span className="text-sm font-bold text-gray-900">$127,340</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">RDS Databases</span>
                      <span className="text-sm font-bold text-gray-900">$89,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">S3 Storage</span>
                      <span className="text-sm font-bold text-gray-900">$43,890</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Data Transfer</span>
                      <span className="text-sm font-bold text-gray-900">$52,140</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Other Services</span>
                      <span className="text-sm font-bold text-gray-900">$27,400</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-red-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Monthly Cost</span>
                      <span className="text-3xl font-black text-red-600">$340,000</span>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-sm text-red-700 font-bold">↑ 47% vs. last month</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-red-100 border-l-4 border-red-600 p-4 rounded">
                  <p className="text-sm text-red-900 font-semibold italic">
                    "We had no idea why costs jumped. Engineering said usage was flat. No one could explain where $100K went."
                  </p>
                  <p className="text-xs text-red-800 mt-2">— CFO, Series B SaaS Company</p>
                </div>
              </div>
            </motion.div>

            {/* The Solution & Results */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Week 1-2: Discovery */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phase 1: Root Cause Analysis</h4>
                    <p className="text-xs text-gray-600">Days 1-10</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Discovered 47 idle RDS instances from old staging environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Found EC2 instances running 24/7 with &lt;5% utilization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Identified 12TB of S3 data in expensive storage tiers</span>
                  </li>
                </ul>
              </div>

              {/* Week 3-4: Implementation */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaCogs className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phase 2: Optimization Execution</h4>
                    <p className="text-xs text-gray-600">Days 11-35</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Automated shutdown of non-prod resources after hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Rightsized 83 EC2 instances based on actual usage patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                    <span>Implemented S3 lifecycle policies for cost-effective storage</span>
                  </li>
                </ul>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-xl border-2 border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaTrophy className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">Results After One Quarter</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-600 mb-1">31%</div>
                    <div className="text-xs text-gray-700 font-semibold">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-600 mb-1">$105K</div>
                    <div className="text-xs text-gray-700 font-semibold">Monthly Savings</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-700 font-semibold">New Monthly Cost</span>
                    <span className="text-2xl font-black text-green-600">$235,000</span>
                  </div>
                  <div className="text-xs text-green-700 font-bold text-right">
                    = $1.26M annual savings
                  </div>
                </div>

                <div className="mt-4 bg-green-100 border-l-4 border-green-600 p-4 rounded">
                  <p className="text-sm text-green-900 font-semibold italic">
                    "C3Ops paid for itself in the first month. Now we have full visibility and automated controls."
                  </p>
                  <p className="text-xs text-green-800 mt-2">— CTO, Series B SaaS Company</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-gray-700 mb-6 font-semibold">
              Ready to uncover hidden waste in your cloud bill?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openTypeform('assessment')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-bold text-lg rounded-xl shadow-xl transition-all duration-300"
            >
              Get Your Free Cloud Cost Assessment
              <FaArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* (FinOps Knowledge section removed — links moved to footer) */}

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-50/20 to-slate-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-trust-100/20 to-slate-100/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Industry Leaders</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-semibold">Trusted by leading cloud-native companies</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-slate-100 relative overflow-hidden"
              >
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-50/30 to-slate-50/30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Star rating */}
                  <motion.div 
                    className="flex gap-1 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3 + i * 0.05, type: "spring", stiffness: 200 }}
                      >
                        <FaStar className="text-yellow-400 text-xl" />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Quote icon */}
                  <div className="text-5xl text-slate-300 mb-3 leading-none">"</div>
                  
                  <p className="text-sm md:text-base text-gray-700 mb-6 italic leading-relaxed font-medium">
                    {testimonial.content}
                  </p>
                  
                  {/* Metric badge */}
                  {testimonial.metric && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-accent-50 to-accent-100 border-2 border-accent-300 rounded-full">
                      <FaChartLine className="text-accent-700 text-xs" />
                      <span className="text-xs font-bold text-accent-800">{testimonial.metric}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-gray-600 font-semibold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Get Your Free Cloud Cost Assessment
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-light">
                Your cloud is costing too much. Let's fix it. Discover how to reduce spending by 20 - 30%.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 md:p-8 rounded-xl mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-accent-500 p-2 rounded-lg">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  What You'll Get:
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-accent-500 mt-1 flex-shrink-0 text-lg" />
                    <span className="text-gray-700 font-medium">Detailed spend breakdown by service & team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-accent-500 mt-1 flex-shrink-0 text-lg" />
                    <span className="text-gray-700 font-medium">Immediate cost-saving opportunities identified</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-accent-500 mt-1 flex-shrink-0 text-lg" />
                    <span className="text-gray-700 font-medium">Projected savings estimate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-accent-500 mt-1 flex-shrink-0 text-lg" />
                    <span className="text-gray-700 font-medium">Customized optimization roadmap</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <div className="text-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTypeform('assessment')}
                  className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-bold py-5 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer text-lg inline-flex items-center gap-3"
                >
                  <FaRocket className="text-xl" />
                  Book Free Assessment
                </motion.button>
                <p className="text-sm text-gray-600 mt-4">
                  No commitment • No risk • Results in 2 weeks
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer"
                  onClick={() => window.open('https://maps.google.com/?q=C3Ops+Technologies+Private+Limited+The+Skyview+10+Sy+No+83/1+2nd+Floor+Hitech+City+Main+Road+Raidurgam+Hyderabad+Telangana+500081', '_blank')}
                >
                  <div className="bg-accent-600 p-4 rounded-xl shadow-lg">
                    <FaMapMarkerAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      C3Ops Technologies Private Limited<br />
                      The Skyview 10, Sy No 83/1, 2nd Floor,<br />
                      Hitech City Main Road, Raidurgam<br />
                      Hyderabad, Telangana - 500081
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="bg-accent-500 p-4 rounded-xl shadow-lg">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Email</h3>
                    <a 
                      href="mailto:info@c3ops.io" 
                      className="text-accent-600 hover:text-accent-700 font-medium text-lg hover:underline"
                    >
                      info@c3ops.io
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Connect with us:</span>
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/company/c3ops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A66C2] p-3 rounded-xl text-white hover:bg-[#004182] transition-all shadow-lg hover:shadow-xl"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-2xl" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/finops.c3ops"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-3 rounded-xl text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-2xl" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-100 py-8 md:py-12 border-t-2 border-accent-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="md:col-span-3 lg:col-span-2">
              <div className="flex items-center mb-3 md:mb-4">
                <img 
                  src="/c3ops-logo-full-light.svg" 
                  alt="C3Ops - FinOps Platform" 
                  className="h-10 md:h-12 w-auto"
                />
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
                We deliver <span className="text-gray-900 font-medium">FinOps-as-a-Service</span> using our <span className="text-gray-900 font-medium">Ai-Driven FinOps Platform</span>, driving cost optimization across <span className="text-gray-900">AWS, Azure, GCP</span>, On-premises infrastructure, <span className="text-gray-900">SaaS licensing</span>, and <span className="text-gray-900">AI workloads</span>.
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-3 max-w-md">
                By implementing <span className="text-gray-900 font-medium">FinOps Foundation</span> best practices, we help clients build cost-conscious engineering cultures that deliver sustained value.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-gray-900">Product</h4>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
                <li><Link to="/platform" className="hover:text-accent-600 transition-colors">Platform</Link></li>
                <li><Link to="/pricing" className="hover:text-accent-600 transition-colors">Pricing</Link></li>
                <li><a href="https://finops.c3ops.io" target="_blank" rel="noopener noreferrer" className="hover:text-accent-600 transition-colors">Launch App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-gray-900">Company</h4>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
                <li><Link to="/about" className="hover:text-accent-600 transition-colors">About Us</Link></li>
                {/* <li><Link to="/testimonials" className="hover:text-accent-600 transition-colors">Testimonials</Link></li> */}
                <li><Link to="/contact" className="hover:text-accent-600 transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-accent-600 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-gray-900">FinOps Knowledge</h4>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
                {finopsKnowledge.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/knowledge/${item.slug}`} className="hover:text-accent-600 transition-colors">
                      {item.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-gray-900">Resources</h4>
              <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
                <li><Link to="/documentation" className="hover:text-accent-600 transition-colors">Documentation</Link></li>
                {/* <li><Link to="/blog" className="hover:text-accent-600 transition-colors">Blog</Link></li> */}
                {/* <li><Link to="/case-studies" className="hover:text-accent-600 transition-colors">Case Studies</Link></li> */}
                {/* <li><Link to="/whitepapers" className="hover:text-accent-600 transition-colors">Whitepapers</Link></li> */}
                <li><a href="mailto:info@c3ops.io" className="hover:text-accent-600 transition-colors">Support</a></li>
                <li><Link to="/privacy-policy" className="hover:text-accent-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-accent-200 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
            <p className="text-gray-700 text-xs md:text-sm text-center md:text-left">
              © 2026 C3Ops Technologies Private Limited. All rights reserved.
            </p>
            <div className="flex gap-3 md:gap-4 text-sm md:text-base">
              <Link to="/terms" className="text-gray-700 hover:text-accent-600 transition-colors">Terms</Link>
              <Link to="/privacy-policy" className="text-gray-700 hover:text-accent-600 transition-colors">Privacy</Link>
              <Link to="/cookies" className="text-gray-700 hover:text-accent-600 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Typeform Modal */}
      <TypeformModal 
        isOpen={isTypeformOpen} 
        onClose={() => setIsTypeformOpen(false)}
        actionType={typeformAction}
      />
    </div>
  );
}

export default App;
