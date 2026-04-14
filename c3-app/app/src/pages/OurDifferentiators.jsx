import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaEye, FaChartLine, FaSyncAlt,
  FaCheckCircle, FaUsers, FaShieldAlt, FaAward, FaArrowRight, FaArrowLeft
} from 'react-icons/fa';

function OurDifferentiators() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/c3ops-logo-full-light.svg" 
                alt="C3Ops - FinOps Platform" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-gray-900">Why C3Ops</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold text-accent-600 uppercase tracking-widest mb-5">Why C3Ops</span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
              We don't just find savings.<br className="hidden sm:block" />
              <span className="text-accent-600">We deliver them.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              Most FinOps consultants hand you a report and move on. We stay, automate, and continuously optimise — so the savings keep growing.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium text-gray-600 border border-gray-100">
                <FaShieldAlt className="text-accent-500 text-xs" />
                Enterprise Ready
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium text-gray-600 border border-gray-100">
                <FaAward className="text-accent-500 text-xs" />
                FinOps Certified
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest mb-3 block">Our Approach</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Three steps to continuous savings
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Not just monitoring — real action across your entire cloud infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaEye className="text-xl text-accent-600" />,
                step: "01",
                title: "See Everything",
                description: "One dashboard for AWS, Azure, and GCP. Real-time spend tracking by team, app, and environment.",
                features: ["Multi-cloud aggregation", "Cost allocation & tagging", "Shared visibility for eng + finance"]
              },
              {
                icon: <FaChartLine className="text-xl text-accent-600" />,
                step: "02",
                title: "Optimise Automatically",
                description: "AI-powered recommendations with ROI modelling — rightsizing, reservations, scheduling, and storage tiers.",
                features: ["Rightsizing & reservations", "Storage optimisation", "Modelled savings per action"]
              },
              {
                icon: <FaSyncAlt className="text-xl text-accent-600" />,
                step: "03",
                title: "Automate & Govern",
                description: "Continuous automated actions with policy guardrails and anomaly detection — not once, but always.",
                features: ["Automated scheduling", "Policy-driven governance", "FinOps KPI tracking"]
              }
            ].map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-accent-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">{module.icon}</div>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Step {module.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-accent-400 mt-0.5 flex-shrink-0 text-xs" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different — Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest mb-3 block">How We Compare</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              The old way vs. the C3Ops way
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
              Here's what changes when you work with a team that stays.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { label: "Approach", old: "One-time audits and reports", ours: "Continuous automation & optimisation" },
              { label: "Coverage", old: "Single cloud or basic dashboards", ours: "Multi-cloud unified visibility" },
              { label: "Action", old: "Manual recommendations you implement", ours: "Automated actions with guardrails" },
              { label: "Speed", old: "Months to see results", ours: "Savings visible within weeks" },
              { label: "Relationship", old: "Engagement ends after delivery", ours: "Ongoing partnership & quarterly reviews" }
            ].map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] gap-3 items-center"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.label}</span>
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 border border-gray-100 line-through decoration-gray-300">{row.old}</div>
                <div className="bg-accent-50 rounded-xl px-4 py-3 text-sm text-accent-700 font-medium border border-accent-100">{row.ours}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10"
          >
            <div className="flex items-center gap-2 mb-5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-light italic">
              "We reduced AWS costs from $340K to $235K/month while improving performance. C3Ops paid for itself in 6 weeks."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-50 flex items-center justify-center">
                <FaUsers className="text-accent-600 text-sm" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Global E-commerce Company</div>
                <div className="text-xs text-gray-400">$105K monthly savings achieved</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-3xl p-10 md:p-14 relative overflow-hidden"
          >
            {/* Subtle accent glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <span className="inline-block text-xs font-semibold text-accent-400 uppercase tracking-widest mb-4">Let's talk</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Ready to stop overspending<br className="hidden sm:block" /> on cloud?
              </h2>
              <p className="text-sm md:text-base text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Book a free 30-minute assessment. We'll show you exactly where your savings are — no strings attached.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all group"
                >
                  Book Free Assessment
                  <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-7 py-3.5 rounded-xl text-sm font-medium transition-all"
                >
                  View Pricing
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-800 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-lg font-bold text-white">25-35%</div>
                  <div className="text-xs text-gray-500">Avg. Savings</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent-400">&lt;90 Days</div>
                  <div className="text-xs text-gray-500">Time to ROI</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">100+</div>
                  <div className="text-xs text-gray-500">Happy Clients</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default OurDifferentiators;