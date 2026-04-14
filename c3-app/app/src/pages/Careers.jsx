import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaDollarSign,
  FaChartLine, FaCloud, FaRobot, FaDatabase, FaCogs, FaEnvelope
} from 'react-icons/fa';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobOpenings = [
    {
      id: 1,
      title: "FinOps Practitioner",
      department: "FinOps",
      location: "Remote / Hyderabad, India",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹8-15 LPA",
      icon: <FaChartLine className="text-2xl text-blue-600" />,
      description: "Drive cost optimization initiatives across multi-cloud environments and establish FinOps best practices.",
      responsibilities: [
        "Implement FinOps Framework across AWS, Azure, and GCP",
        "Create cost allocation strategies and showback/chargeback models",
        "Collaborate with engineering teams on cost-conscious architecture",
        "Develop automated cost monitoring and alerting systems",
        "Conduct cost optimization workshops and training sessions"
      ],
      requirements: [
        "2+ years in cloud cost management or FinOps",
        "Strong understanding of AWS, Azure, or GCP billing",
        "Experience with cost optimization tools and techniques",
        "FinOps Foundation certification preferred",
        "Excellent analytical and communication skills"
      ]
    },
    {
      id: 2,
      title: "FinOps for AI Engineer",
      department: "AI/ML",
      location: "Remote / Hyderabad, India",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹12-20 LPA",
      icon: <FaRobot className="text-2xl text-purple-600" />,
      description: "Specialize in optimizing costs for AI/ML workloads and implement FinOps practices for AI infrastructure.",
      responsibilities: [
        "Optimize costs for ML training and inference workloads",
        "Implement GPU utilization monitoring and optimization",
        "Design cost-efficient ML pipeline architectures",
        "Create AI workload cost forecasting models",
        "Establish ML resource governance and policies"
      ],
      requirements: [
        "3+ years in AI/ML infrastructure or cloud engineering",
        "Experience with GPU instances, ML frameworks (TensorFlow, PyTorch)",
        "Understanding of ML lifecycle and model deployment",
        "Knowledge of Kubernetes, containerization for ML workloads",
        "Background in cloud cost optimization"
      ]
    },
    {
      id: 3,
      title: "FinOps Analyst",
      department: "Analytics",
      location: "Remote / Hyderabad, India",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹6-10 LPA",
      icon: <FaDatabase className="text-2xl text-green-600" />,
      description: "Analyze cloud spending patterns, create financial reports, and provide data-driven cost optimization insights.",
      responsibilities: [
        "Analyze cloud billing data and identify cost trends",
        "Create executive dashboards and cost reports",
        "Perform cost anomaly detection and root cause analysis",
        "Support budget planning and forecasting activities",
        "Develop KPIs and metrics for FinOps success measurement"
      ],
      requirements: [
        "1+ years in data analysis, preferably cloud or financial data",
        "Proficiency in SQL, Python, or R for data analysis",
        "Experience with BI tools (Tableau, Power BI, Looker)",
        "Understanding of cloud billing and cost structures",
        "Strong Excel skills and attention to detail"
      ]
    },
    {
      id: 4,
      title: "FinOps Manager",
      department: "Management",
      location: "Remote / Hyderabad, India",
      type: "Full-time",
      experience: "5-8 years",
      salary: "₹18-28 LPA",
      icon: <FaUsers className="text-2xl text-red-600" />,
      description: "Lead FinOps initiatives, manage client relationships, and drive organizational cost culture transformation.",
      responsibilities: [
        "Lead and mentor FinOps team members",
        "Manage client FinOps transformation projects",
        "Establish FinOps governance and operating models",
        "Drive cross-functional collaboration between finance and engineering",
        "Present cost optimization strategies to C-level executives"
      ],
      requirements: [
        "5+ years in FinOps, cloud consulting, or related field",
        "Proven track record of leading cost optimization projects",
        "FinOps Foundation certification required",
        "Strong leadership and project management skills",
        "Experience with enterprise client management"
      ]
    }
  ];

  const benefits = [
    "Competitive salary and equity participation",
    "Comprehensive health insurance for family",
    "Flexible work arrangements and remote-first culture",
    "Professional development and certification support",
    "Annual learning budget of ₹50,000",
    "Collaborative and innovation-driven work environment"
  ];

  const companyValues = [
    {
      title: "Cost-Conscious Culture",
      description: "We believe in practicing what we preach - every decision is made with cost implications in mind."
    },
    {
      title: "Continuous Learning",
      description: "FinOps is evolving rapidly. We invest in our team's growth and stay at the forefront of innovation."
    },
    {
      title: "Client Success",
      description: "Our success is measured by the value we deliver to our clients through sustained cost optimization."
    },
    {
      title: "Data-Driven Decisions",
      description: "Every recommendation and strategy is backed by solid data analysis and proven methodologies."
    }
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">FinOps Revolution</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Help organizations across the globe optimize their cloud spending and build cost-conscious engineering cultures. 
              Be part of a team that's transforming how companies think about cloud economics.
            </p>
          </motion.div>

          {/* Company Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Current Openings</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Job List */}
            <div className="space-y-4">
              {jobOpenings.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm">
                      {job.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaDollarSign />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Job Details */}
            <div className="lg:sticky lg:top-24">
              {selectedJob ? (
                <motion.div
                  key={selectedJob.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {selectedJob.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedJob.title}</h3>
                      <p className="text-gray-600">{selectedJob.department} • {selectedJob.experience}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {selectedJob.responsibilities.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <a
                        href={`mailto:careers@c3ops.io?subject=Application for ${selectedJob.title}&body=Hi,%0A%0AI am interested in applying for the ${selectedJob.title} position. Please find my resume attached.%0A%0AThank you!`}
                        className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-6 rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <FaEnvelope />
                        Apply for this position
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center">
                  <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">Select a Position</h3>
                  <p className="text-gray-500">Click on any job opening to view detailed requirements and responsibilities.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container-custom">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Why Join C3Ops?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center"
              >
                <p className="text-gray-700 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Careers;