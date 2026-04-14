import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaCloud, FaUsers, FaDatabase, FaChartLine, 
  FaShieldAlt, FaCogs, FaRocket, FaStar, FaTrophy, FaAward,
  FaHeadset, FaCode
} from 'react-icons/fa';
import { MdTrendingDown } from 'react-icons/md';

const PricingPlans = ({ openTypeform }) => {
  const plans = [
    {
      name: 'Starter Plan',
      subtitle: 'For SMBs',
      price: '$499',
      period: 'month',
      annualPrice: '$5.9K annually',
      badge: null,
      popular: false,
      features: {
        platform: [
          '1 Cloud Provider (AWS/Azure/GCP)',
          'Asset Management/CMDB (100 assets)',
          'Subscription Tracking',
          'Annual IT Budget Planning',
          'Cost Dashboards & Reporting',
          'Budget Alerts',
          '3 User Seats'
        ],
        engineer: '10 hours/month of FinOps Engineer support'
      },
      roi: {
        cloudSpend: '$1M',
        savings: '20',
        savingsAmount: '$200K',
        platformCost: '$5.9K',
        netBenefit: '$194.1K',
        roiMultiplier: '33x',
        period: 'first year'
      },
      color: 'blue',
      icon: FaRocket
    },
    {
      name: 'Professional Plan',
      subtitle: 'For Mid-Market',
      price: '$1,499',
      period: 'month',
      annualPrice: '$17.9K annually',
      badge: 'MOST POPULAR',
      popular: true,
      features: {
        platform: [
          '2 Cloud Providers',
          'Asset Management (500 assets)',
          'Showback/Chargeback Reporting',
          'Multi-year Budget Forecasting',
          'Advanced Tag Governance',
          'API Access',
          '9 User Seats'
        ],
        engineer: '25 hours/month of FinOps Engineer support'
      },
      roi: {
        cloudSpend: '$5M',
        savings: '25%',
        savingsAmount: '$1.25M',
        platformCost: '$17.9K',
        netBenefit: '$1.23M',
        roiMultiplier: '69x',
        period: 'first year'
      },
      color: 'accent',
      icon: FaStar
    },
    {
      name: 'Enterprise Plan',
      subtitle: 'For Large Organizations',
      price: '$4,999',
      period: 'month',
      annualPrice: '$56.9K annually',
      badge: null,
      popular: false,
      features: {
        platform: [
          '3+ Cloud Providers + On-Prem',
          'Unlimited Asset Management',
          'Enterprise SSO/SAML',
          'Custom Automation & Workflows',
          '18+ User Seats',
          'Dedicated Support Channel',
          'Subscription & License Optimization'
        ],
        engineer: '60 hours/month of FinOps Team support'
      },
      roi: {
        cloudSpend: '$20M',
        savings: '30%',
        savingsAmount: '$6M',
        platformCost: '$56.9K',
        netBenefit: '$5.94M',
        roiMultiplier: '105x',
        period: 'first year'
      },
      color: 'purple',
      icon: FaTrophy
    }
  ];

  const whyChooseItems = [
    {
      icon: FaUsers,
      title: 'Platform + People',
      description: 'Not just dashboards - you get expert engineers implementing optimizations',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      icon: FaTrophy,
      title: 'Proven Results',
      description: 'Average 25-35% cost reduction with 3-6 month ROI',
      gradient: 'from-success-500 to-success-600'
    },
    {
      icon: FaChartLine,
      title: 'Predictable Pricing',
      description: 'No percentage of cloud spend - just transparent monthly fees',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      icon: MdTrendingDown,
      title: 'Fast ROI',
      description: 'Most clients see 3-6 month payback period',
      gradient: 'from-success-500 to-success-600'
    },
    {
      icon: FaAward,
      title: 'FinOps Certified',
      description: 'FinOps Foundation partners with certified professionals',
      gradient: 'from-accent-500 to-accent-600'
    },
    {
      icon: FaShieldAlt,
      title: 'No Lock-in',
      description: 'Month-to-month after initial term, own your optimizations',
      gradient: 'from-accent-500 to-accent-600'
    }
  ];

  const whatYouGet = [
    'Enterprise-grade FinOps platform (CMDB, Budget Tracking, Cost Dashboards)',
    'Dedicated FinOps Certified Engineer working with your team',
    'Hands-on implementation, not just recommendations',
    'Proven 3-phase approach: Assess → Optimize → Govern'
  ];

  const getColorClasses = (color, popular = false) => {
    if (popular) {
      return {
        border: 'border-accent-500',
        bg: 'bg-gradient-to-br from-accent-50 to-white',
        badge: 'bg-gradient-to-r from-accent-500 to-accent-600',
        button: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white',
        icon: 'text-accent-500'
      };
    }
    return {
      border: 'border-gray-200',
      bg: 'bg-white',
      badge: 'bg-gray-600',
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      icon: 'text-primary-500'
    };
  };

  return (
    <section id="pricing-plans" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 px-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            C3Ops Pricing Plans
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-accent-600 mb-6 font-semibold">
            FinOps-Driven DevOps Platform + Expert Engineers
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the plan that matches your organization's cloud spend and optimization needs
          </p>
        </motion.div>

        {/* What Makes C3Ops Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary-50 rounded-2xl p-6 md:p-10 mb-12 md:mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            What Makes C3Ops Different
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {whatYouGet.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <FaCheckCircle className="text-accent-500 text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-base md:text-lg">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 px-4 mb-16">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color, plan.popular);
            const Icon = plan.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${colors.bg} ${colors.border} border-2 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className={`${colors.badge} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2`}>
                      <FaStar className="text-sm" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6 pt-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${plan.popular ? 'bg-accent-100' : 'bg-primary-100'} rounded-full mb-4`}>
                    <Icon className={`text-3xl ${colors.icon}`} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
                  {/* Price hidden - showing tailored pricing approach */}
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-accent-600">Custom Pricing</p>
                    <p className="text-sm text-gray-600">Tailored to your needs</p>
                  </div>
                </div>

                {/* Platform Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Platform Features
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.features.platform.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FaCheckCircle className={`${colors.icon} mt-1 flex-shrink-0 text-sm`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Engineer Support */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaHeadset className={`${colors.icon} text-xl flex-shrink-0 mt-1`} />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Expert Support</p>
                      <p className="text-sm text-gray-700">{plan.features.engineer}</p>
                    </div>
                  </div>
                </div>

                {/* ROI Example */}
                <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MdTrendingDown className="text-green-600" />
                    ROI Example
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Cloud Spend:</span>
                      <span className="font-semibold text-gray-900">{plan.roi.cloudSpend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Savings:</span>
                      <span className="font-semibold text-green-600">
                        {plan.roi.savings} ({plan.roi.savingsAmount})
                      </span>
                    </div>
                    <div className="border-t border-green-300 mt-2 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-bold">Typical ROI:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {plan.roi.roiMultiplier} in {plan.roi.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTypeform('assessment')}
                  className={`block w-full text-center ${colors.button} font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg cursor-pointer`}
                >
                  Contact for Pricing
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 border-2 border-slate-100"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-5 py-2 bg-white rounded-full border border-gray-300 shadow-sm"
            >
              <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Our Differentiators</span>
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">This Approach</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 text-center">{item.title}</h4>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPlans;

