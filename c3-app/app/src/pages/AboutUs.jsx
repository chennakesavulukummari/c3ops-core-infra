import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaRocket, FaUsers, FaChartLine, FaCloud, FaAward, 
  FaGlobe, FaHandshake, FaLightbulb, FaShieldAlt, FaHeart
} from 'react-icons/fa';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

const AboutUs = () => {
  

  const values = [
    {
      icon: <FaLightbulb className="text-yellow-500" />,
      title: "Innovation First",
      description: "We continuously innovate to stay ahead of cloud cost optimization trends and technologies."
    },
    {
      icon: <FaHandshake className="text-blue-500" />,
      title: "Client Partnership",
      description: "We view our clients as partners, working together to achieve sustainable cost optimization."
    },
    {
      icon: <FaShieldAlt className="text-green-500" />,
      title: "Trust & Transparency",
      description: "Complete transparency in our methodologies, pricing, and the results we deliver."
    },
    {
      icon: <FaHeart className="text-red-500" />,
      title: "Passion for Excellence",
      description: "Every team member is passionate about delivering exceptional value and results."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "Company Founded",
      description: "Started with a vision to democratize cloud cost optimization for enterprises."
    },
    {
      year: "2024", 
      title: "First 3 Clients",
      description: "Achieved significant milestone helping 3 companies optimize their cloud spend."
    },
    // {
    //   year: "2025",
    //   title: "Global Expansion",
    //   description: "Expanded operations to serve clients across Asia-Pacific and European markets."
    // },
    {
      year: "2025",
      title: "FinOps Certification",
      description: "Became official FinOps Foundation training partner and certification provider."
    },
    {
      year: "2025",
      title: "AI-Powered Platform",
      description: "Launched proprietary AI platform for predictive cost optimization and anomaly detection."
    }
    // {
    //   year: "2025",
    //   title: "Industry Recognition",
    //   description: "Named 'FinOps Partner of the Year' by leading cloud providers and industry associations."
    // }
  ];

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
              Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Cloud Economics</span> Globally
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to help organizations achieve maximum value from their cloud investments through 
              data-driven FinOps practices, cutting-edge automation, and expert guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Story</span>
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  C3Ops was founded in 2024 by CK, a cloud architect and FinOps practitioner who saw a clear gap: organizations of all sizes were struggling to control their growing cloud costs while maintaining performance and agility.
                </p>
               <p>
                What started as hands-on consulting has evolved into a focused FinOps practice combining deep technical expertise with financial discipline to help businesses stop overpaying for cloud.
                </p>
                <p>
                We're building C3Ops to be the FinOps partner every organization deserves accessible, actionable, and results-driven.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl">
                <FaRocket className="text-6xl text-green-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Our Mission</h3>
                <p className="text-center text-gray-700">
                  "Helping organizations get maximum value from every cloud dollar — through Agentic Ai FinOps, automation, and expert guidance."
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-2xl">
                <FaLightbulb className="text-6xl text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Our Vision</h3>
                <p className="text-center text-gray-700">
                  "To lead the next generation of AI-powered FinOps practices that enable organisations to predict, optimise, and govern cloud spend with confidence."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our relationships with clients, partners, and each other.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From startup to industry leader - key milestones that shaped our growth and success.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-sm font-bold text-green-600 mb-2">{item.year}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AboutUs;