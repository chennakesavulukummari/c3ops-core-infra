import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCloud, FaCogs, FaUsers, FaCheckCircle, FaRocket, FaBolt,
  FaChartLine, FaShieldAlt, FaLock, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

function Platform() {
  const securityCompliance = [
    { name: "SOC 2 Type II", status: "In Progress", description: "Enterprise security standards" },
    { name: "ISO 27001", status: "Planned 2026", description: "Information security management" },
    { name: "GDPR Compliant", status: "Active", description: "EU data protection" },
    { name: "Data Encryption", status: "Active", description: "AES-256 at rest, TLS 1.3 in transit" }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      <SiteHeader />

      {/* Platform & Methodology Section */}
      <section className="section-padding bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-100/30 to-primary-50/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-50/20 to-slate-100/30 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-5 py-2 bg-white rounded-full border border-gray-300 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">How It Works</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Platform & <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Methodology</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Advanced FinOps software combined with expert services to deliver sustainable cloud savings
            </p>
          </motion.div>

          {/* Key Capabilities */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4">
                <FaCloud className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Multi-Cloud Visibility</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Unified dashboard across AWS, Azure, and GCP</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Cost allocation by team, application, environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Real-time anomaly detection and alerts</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4">
                <FaCogs className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Intelligent Automation</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Rightsizing recommendations with ROI modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Automated resource scheduling and cleanup</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Policy-driven governance and guardrails</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Expert Services</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>FinOps-certified engineers implementing optimizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Team training and knowledge transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                  <span>Ongoing strategic guidance and support</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* 3-Phase Approach */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Three-Phase Methodology
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-600 rounded-xl flex items-center justify-center">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">Phase 1: Discovery</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Cloud spend analysis & anomaly detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Immediate optimization opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Strategic savings roadmap</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-600 rounded-xl flex items-center justify-center">
                  <FaBolt className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">Phase 2: Optimization</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Resource rightsizing automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Commitment-based discount optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Advanced cost allocation framework</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-accent-600 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">Phase 3: Governance</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Team enablement & knowledge transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Policy framework & automated controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-accent-600 mt-1 flex-shrink-0" />
                    <span>Self-sustaining optimization culture</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Integration Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center"
          >
            <p className="text-gray-700 font-medium">
              <span className="font-bold text-gray-900">Seamless Integration:</span> Works with AWS, Azure, GCP, Terraform, Kubernetes, Jenkins, GitHub Actions, Slack, Datadog, and more
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="section-padding bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-slate-100/30 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10 px-4">
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
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Trust & Security</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">Compliance</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-semibold max-w-3xl mx-auto">
              Enterprise-grade security protecting your cloud cost data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {securityCompliance.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-green-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-gray-900">{item.name}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.status === 'Active' ? 'bg-green-100 text-green-800' :
                        item.status.includes('Progress') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-green-200">
                <FaLock className="text-green-700 text-xl" />
                <span className="font-black text-gray-800">Bank-Level Encryption</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-green-200">
                <FaShieldAlt className="text-green-700 text-xl" />
                <span className="font-black text-gray-800">Read-Only Access</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-green-200">
                <FaCheckCircle className="text-green-700 text-xl" />
                <span className="font-black text-gray-800">GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 rounded-3xl p-10 md:p-14 relative overflow-hidden border border-gray-200 shadow-lg"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-100/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-100/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                See the platform in action
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Book a free 30-minute walkthrough. We'll show you exactly how it works with your cloud setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all group"
                >
                  Book Free Demo
                  <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 px-7 py-3.5 rounded-xl text-sm font-medium transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default Platform;
