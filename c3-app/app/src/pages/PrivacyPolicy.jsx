import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaDatabase, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
              <span className="font-bold text-gray-900">Privacy Policy</span>
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
            <FaShieldAlt className="text-6xl mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Privacy Policy</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                C3Ops Technologies Private Limited ("C3Ops," "we," "us," or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website www.c3ops.io and use our FinOps Platform at finops.c3ops.io (collectively, the "Services").
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaDatabase className="text-primary-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name, email address, phone number, and company name</li>
                    <li>Account credentials and authentication information</li>
                    <li>Billing and payment information</li>
                    <li>Cloud infrastructure configurations and metadata</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Log data including IP addresses, browser type, and device information</li>
                    <li>Platform usage patterns and feature interactions</li>
                    <li>Performance metrics and analytics data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cloud Infrastructure Data</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Multi-cloud resource configurations and metadata</li>
                    <li>Cost and usage data from connected cloud accounts</li>
                    <li>Security and compliance scan results</li>
                    <li>Infrastructure automation logs and histories</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaUserShield className="text-primary-600" />
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide, maintain, and improve our FinOps Platform</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Analyze cloud infrastructure costs and provide optimization recommendations</li>
                <li>Monitor platform performance and troubleshoot issues</li>
                <li>Send administrative information, updates, and security alerts</li>
                <li>Respond to customer service requests and support inquiries</li>
                <li>Conduct research and development to enhance our services</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaLock className="text-primary-600" />
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>End-to-end encryption for data in transit and at rest</li>
                <li>Multi-factor authentication (MFA) for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Role-based access control (RBAC) and least privilege principles</li>
                <li>SOC 2 Type II and ISO 27001 compliance frameworks</li>
                <li>24/7 security monitoring and incident response</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (cloud hosting, analytics, payment processing)</li>
                <li><strong>Cloud Providers:</strong> AWS, Azure, and GCP for infrastructure management as authorized by you</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>With Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation on processing of your information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@c3ops.io" className="text-primary-600 hover:underline">privacy@c3ops.io</a>
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. 
                Account data is retained for the duration of your active subscription plus 90 days. Cloud infrastructure data 
                and usage logs are retained for 13 months for cost analysis and trending purposes. After the retention period, 
                data is securely deleted or anonymized.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by 
                the European Commission and adherence to data protection frameworks such as GDPR and CCPA.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal 
                information from children. If we become aware that we have collected information from a child, we will 
                take steps to delete such information promptly.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                posting the new policy on this page and updating the "Last Updated" date. Continued use of our Services 
                after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p><strong>C3Ops Technologies Private Limited</strong></p>
                <p>The Skyview 10, Sy No 83/1, 2nd Floor,</p>
                <p>Hitech City Main Road, Raidurgam</p>
                <p>Hyderabad, Telangana - 500081, India</p>
                <p>Email: <a href="mailto:privacy@c3ops.io" className="text-primary-600 hover:underline">privacy@c3ops.io</a></p>
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
