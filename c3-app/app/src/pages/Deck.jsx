import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const Deck = () => {
  const painPoints = [
    'Cloud costs up 30-50% annually',
    'Zero cost visibility',
    'Resources running 24/7 idle',
    'Over-provisioned infrastructure',
    'No spending accountability'
  ];

  const solutions = [
    '✓ 25-40% cost reduction in 90 days',
    '✓ 100% cost visibility by team/project',
    '✓ Automated optimization',
    '✓ Showback/chargeback enabled',
    '✓ FinOps culture embedded'
  ];

  const phase1Items = [
    'Resource utilization audit',
    'Cost allocation review',
    'Waste identification',
    'Quick-win opportunities'
  ];

  const phase2Items = [
    'Right-sizing instances',
    'Reserved capacity planning',
    'Automated scheduling',
    'Storage optimization'
  ];

  const phase3Items = [
    'Cost tagging standards',
    'Team accountability dashboards',
    'Budget alerts & policies',
    'Continuous optimization'
  ];

  const differencePoints = [
    'Results in 90 days, not 9 months',
    'Zero disruption to engineering',
    'Sustainable savings',
    'FinOps.org Partners',
    'Cloud, DevOps & FinOps Certified Professionals'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/c3ops-logo-full-light.svg" 
                alt="C3Ops - FinOps Platform" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-gray-900">Deck</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-3">
            C3Ops Technologies Private Limited
          </h1>
          <p className="text-xl md:text-2xl text-primary-500 font-medium">
            FinOps Platform
          </p>
        </motion.div>

        {/* Cloud Cost Crisis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg mb-12"
        >
          <h2 className="text-3xl font-bold text-red-600 mb-3">The Cloud Cost Crisis</h2>
          <p className="text-lg text-gray-800 italic">
            Organizations waste 30-50% of cloud spend on unused, over-provisioned resources
          </p>
        </motion.div>

        {/* Pain Points vs Solutions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Common Pain Points */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-primary-700 mb-6">Common Pain Points</h3>
            <ul className="space-y-3">
              {painPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">•</span>
                  <span className="text-gray-800 text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The C3Ops Solution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-6">The C3Ops Solution</h3>
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-800 text-lg">{solution}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 3-Phase Approach */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-primary-700 text-center mb-8">
            Our 3-Phase Approach: FinOps Embedded into DevOps
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phase 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
              <h4 className="text-xl font-bold text-primary-700 mb-4">Phase 1: Assess</h4>
              <ul className="space-y-2">
                {phase1Items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
              <h4 className="text-xl font-bold text-primary-700 mb-4">Phase 2: Optimize</h4>
              <ul className="space-y-2">
                {phase2Items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500">
              <h4 className="text-xl font-bold text-primary-700 mb-4">Phase 3: Govern</h4>
              <ul className="space-y-2">
                {phase3Items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Proven Results */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-primary-700 text-center mb-8">
            Proven Results That Impact Your Bottom Line
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cost Reduction */}
            <div className="bg-green-50 p-8 rounded-lg text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">25-40%</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Cost Reduction</h4>
              <p className="text-gray-700">Average cloud spend reduction within first 90 days</p>
            </div>

            {/* Cost Visibility */}
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="text-6xl font-bold text-primary-600 mb-2">100%</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Cost Visibility</h4>
              <p className="text-gray-700">Full transparency by team, project, and environment</p>
            </div>
          </div>
        </motion.div>

        {/* The C3Ops Difference */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary-700 text-white p-8 rounded-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-6">The C3Ops Difference</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base">
            {differencePoints.map((point, index) => (
              <React.Fragment key={index}>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  {point}
                </span>
                {index < differencePoints.length - 1 && (
                  <span className="hidden md:inline text-primary-300">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link
            to="/#contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Schedule Your Free Assessment
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Deck;
