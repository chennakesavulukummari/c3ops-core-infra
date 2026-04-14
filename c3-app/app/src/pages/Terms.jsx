import { motion } from 'framer-motion';
import { FaFileContract, FaHandshake, FaExclamationTriangle, FaBalanceScale, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Terms() {
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
              <span className="font-bold text-gray-900">Terms of Service</span>
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
            <FaFileContract className="text-6xl mx-auto mb-6 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Terms of Service</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. They govern your use of our platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last Updated: November 9, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") 
                and C3Ops Technologies Private Limited ("C3Ops," "we," "us," or "our") governing your access to and use of 
                our FinOps platform available at finops.c3ops.io and www.c3ops.io (the "Platform" or "Services").
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms. If you do not agree with these Terms, you must not access or use our Services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaHandshake className="text-primary-600" />
                Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                C3Ops provides a comprehensive FinOps Platform that includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Single Source of Truth:</strong> Unified dashboard for multi-cloud infrastructure visibility</li>
                <li><strong>FinOps Excellence:</strong> AI-powered cost optimization and financial governance</li>
                <li><strong>Infrastructure Automation:</strong> Automated provisioning, scaling, and management</li>
                <li><strong>Security Essentials:</strong> Continuous security monitoring and compliance management</li>
                <li>Multi-cloud support for AWS, Azure, and Google Cloud Platform</li>
                <li>Real-time cost tracking, anomaly detection, and budget alerts</li>
                <li>Terraform-based Infrastructure as Code (IaC) automation</li>
                <li>Security scanning, vulnerability management, and compliance reporting</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Registration and Security</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Eligibility</h3>
                  <p>
                    You must be at least 18 years old and have the legal capacity to enter into contracts. By registering, 
                    you represent that all information provided is accurate and complete.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Account Credentials</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Use strong, unique passwords and enable multi-factor authentication</li>
                    <li>Notify us immediately of any unauthorized access or security breach</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Not share your account credentials with third parties</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cloud Account Integration</h3>
                  <p>
                    When connecting your cloud accounts (AWS, Azure, GCP), you grant C3Ops read-only access to cost and 
                    usage data, resource metadata, and configuration information necessary to provide our Services. You 
                    retain full ownership and control of your cloud infrastructure.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceptable Use Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Use the Platform for unauthorized or illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                <li>Upload malware, viruses, or malicious code</li>
                <li>Scrape, mine, or extract data using automated means without permission</li>
                <li>Resell or redistribute the Services without written authorization</li>
                <li>Remove or modify any proprietary notices or labels</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscription and Payment Terms</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Subscription Plans</h3>
                  <p>
                    C3Ops offers various subscription tiers based on usage, features, and support levels. Pricing details 
                    are available on our website or upon request.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Billing and Payments</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Subscriptions are billed monthly or annually in advance</li>
                    <li>All fees are in USD and exclude applicable taxes</li>
                    <li>You authorize us to charge your payment method on file</li>
                    <li>Failed payments may result in service suspension</li>
                    <li>Price changes require 30 days' advance notice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Refunds and Cancellations</h3>
                  <p>
                    You may cancel your subscription at any time. Cancellations take effect at the end of the current billing 
                    period. We do not provide refunds for partial months or unused service, except where required by law or 
                    at our sole discretion.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">C3Ops Ownership</h3>
                  <p>
                    The Platform, including all software, algorithms, design, text, graphics, logos, and other content, 
                    is owned by C3Ops and protected by copyright, trademark, and other intellectual property laws. We grant 
                    you a limited, non-exclusive, non-transferable license to access and use the Platform in accordance with these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">User Data Ownership</h3>
                  <p>
                    You retain all ownership rights to your cloud infrastructure data, configurations, and any content you 
                    upload to the Platform ("User Data"). You grant C3Ops a license to use User Data solely to provide and 
                    improve our Services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Feedback</h3>
                  <p>
                    Any feedback, suggestions, or ideas you provide to C3Ops become our property, and we may use them without 
                    obligation or compensation to you.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaExclamationTriangle className="text-primary-600" />
                Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Service Availability</h3>
                  <p>
                    We strive for 99.9% uptime but do not guarantee uninterrupted or error-free service. The Platform is 
                    provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Limitation of Liability</h3>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, C3OPS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, 
                    OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO C3OPS IN THE 12 MONTHS 
                    PRECEDING THE CLAIM.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">User Responsibility</h3>
                  <p>
                    You are solely responsible for your use of the Platform and any decisions made based on cost optimization 
                    recommendations. C3Ops is not liable for any infrastructure changes, cost variations, or cloud provider charges.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaBalanceScale className="text-primary-600" />
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless C3Ops, its affiliates, officers, directors, employees, 
                and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' 
                fees) arising from: (a) your use of the Services, (b) your violation of these Terms, (c) your violation of 
                any third-party rights, or (d) your User Data.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause, 
                with or without notice, including for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violation of these Terms or Acceptable Use Policy</li>
                <li>Non-payment of fees</li>
                <li>Fraudulent or illegal activity</li>
                <li>Conduct that harms C3Ops or other users</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Upon termination, your right to access the Platform ceases immediately. We may delete your User Data after 
                90 days, so please export any data you wish to retain before termination.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dispute Resolution and Governing Law</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Governing Law</h3>
                  <p>
                    These Terms are governed by and construed in accordance with the laws of India, without regard to 
                    conflict of law principles.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Jurisdiction</h3>
                  <p>
                    Any disputes arising from these Terms or the Services shall be subject to the exclusive jurisdiction 
                    of the courts in Hyderabad, Telangana, India.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Arbitration</h3>
                  <p>
                    Any dispute not resolved through negotiation shall be settled by binding arbitration under the 
                    Arbitration and Conciliation Act, 1996, conducted in Hyderabad, India.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Material changes will be communicated via email 
                or through the Platform. Continued use of the Services after changes constitutes acceptance of the updated Terms. 
                We recommend reviewing these Terms periodically.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">General Provisions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
                <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right</li>
                <li><strong>Assignment:</strong> You may not assign these Terms without our written consent</li>
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and C3Ops</li>
                <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions or concerns about these Terms of Service, please contact:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p><strong>C3Ops Technologies Private Limited</strong></p>
                <p>The Skyview 10, Sy No 83/1, 2nd Floor,</p>
                <p>Hitech City Main Road, Raidurgam</p>
                <p>Hyderabad, Telangana - 500081, India</p>
                <p>Email: <a href="mailto:legal@c3ops.io" className="text-primary-600 hover:underline">legal@c3ops.io</a></p>
                <p>Support: <a href="mailto:info@c3ops.io" className="text-primary-600 hover:underline">info@c3ops.io</a></p>
                <p>Phone: <a href="tel:+919390361519" className="text-primary-600 hover:underline">+91 9390361519</a></p>
                <p>Website: <a href="https://www.c3ops.io" className="text-primary-600 hover:underline">www.c3ops.io</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary-50 via-accent-50 to-pastel-blue py-8 border-t-2 border-primary-200">
        <div className="container-custom text-center">
          <p className="text-gray-700">
            © 2026 C3Ops Technologies Private Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
