import { motion } from 'framer-motion';
import { FaCookie, FaToggleOn, FaChartLine, FaCog, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Cookies() {
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
              <span className="font-bold text-gray-900">Cookie Policy</span>
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
            <FaCookie className="text-6xl mx-auto mb-6 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">Cookie Policy</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Learn how we use cookies to improve your experience and provide personalized content.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit 
                our website www.c3ops.io or use our FinOps Platform at finops.c3ops.io. Cookies help us 
                provide a better user experience by remembering your preferences, analyzing usage patterns, and ensuring 
                platform security.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This Cookie Policy explains how C3Ops Technologies Private Limited ("C3Ops," "we," "us," or "our") uses 
                cookies and similar tracking technologies, and how you can manage your cookie preferences.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaCog className="text-primary-600" />
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Strictly Necessary Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies are essential for the platform to function and cannot be disabled. They enable core 
                    functionality such as security, authentication, and session management.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                      <li><code className="bg-gray-200 px-1 rounded">session_token</code> - Maintains your logged-in state</li>
                      <li><code className="bg-gray-200 px-1 rounded">csrf_token</code> - Protects against cross-site request forgery attacks</li>
                      <li><code className="bg-gray-200 px-1 rounded">auth_state</code> - Manages authentication flow</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2"><strong>Duration:</strong> Session (deleted when browser closes) or up to 30 days</p>
                  </div>
                </div>

                <div className="border-l-4 border-accent-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Functional Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies remember your preferences and choices to provide enhanced functionality and personalization.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                      <li><code className="bg-gray-200 px-1 rounded">user_preferences</code> - Stores dashboard layout and theme settings</li>
                      <li><code className="bg-gray-200 px-1 rounded">language_pref</code> - Remembers your language selection</li>
                      <li><code className="bg-gray-200 px-1 rounded">cloud_filter</code> - Saves your cloud provider filter selections</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2"><strong>Duration:</strong> Up to 1 year</p>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Analytics and Performance Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies help us understand how users interact with our platform, enabling us to improve performance 
                    and user experience.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                      <li><code className="bg-gray-200 px-1 rounded">_ga</code> - Google Analytics tracking cookie</li>
                      <li><code className="bg-gray-200 px-1 rounded">_gid</code> - Google Analytics session identifier</li>
                      <li><code className="bg-gray-200 px-1 rounded">c3ops_analytics</code> - Internal platform usage metrics</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2"><strong>Duration:</strong> 24 hours to 2 years</p>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Marketing and Advertising Cookies</h3>
                  <p className="text-gray-700 mb-2">
                    These cookies track your browsing activity to deliver relevant advertisements and measure campaign effectiveness.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Examples:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                      <li><code className="bg-gray-200 px-1 rounded">_fbp</code> - Facebook Pixel tracking</li>
                      <li><code className="bg-gray-200 px-1 rounded">_gcl_au</code> - Google Ads conversion tracking</li>
                      <li><code className="bg-gray-200 px-1 rounded">linkedin_oauth</code> - LinkedIn advertising integration</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2"><strong>Duration:</strong> 90 days to 2 years</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaChartLine className="text-primary-600" />
                Third-Party Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use third-party services that may set their own cookies. These include:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Google Analytics</h4>
                  <p className="text-sm text-gray-700">
                    Tracks website traffic and user behavior. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Intercom</h4>
                  <p className="text-sm text-gray-700">
                    Customer support chat widget and user communication. <a href="https://www.intercom.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Hotjar</h4>
                  <p className="text-sm text-gray-700">
                    Heatmaps and session recordings to improve UX. <a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Stripe</h4>
                  <p className="text-sm text-gray-700">
                    Payment processing and fraud prevention. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaToggleOn className="text-primary-600" />
                Managing Your Cookie Preferences
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cookie Consent Manager</h3>
                  <p>
                    When you first visit our website, you'll see a cookie consent banner. You can accept all cookies, 
                    reject non-essential cookies, or customize your preferences by category.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Browser Settings</h3>
                  <p className="mb-2">You can control and delete cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage cookies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Opt-Out Links</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Browser Add-on</a></li>
                    <li>Facebook: <a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Ad Preferences</a></li>
                    <li>LinkedIn: <a href="https://www.linkedin.com/psettings/guest-controls" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Ad Settings</a></li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>⚠️ Note:</strong> Disabling certain cookies may affect platform functionality. Strictly necessary 
                    cookies cannot be disabled as they are required for security and core features.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Do Not Track (DNT)</h2>
              <p className="text-gray-700 leading-relaxed">
                Some browsers offer a "Do Not Track" (DNT) signal. Currently, there is no industry standard for responding 
                to DNT signals. We do not alter our data collection practices in response to DNT signals, but we respect 
                your cookie preferences set through our consent manager.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookie Duration Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Can Opt-Out?</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-3">Strictly Necessary</td>
                      <td className="px-4 py-3">Session - 30 days</td>
                      <td className="px-4 py-3">❌ No (Required)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Functional</td>
                      <td className="px-4 py-3">Up to 1 year</td>
                      <td className="px-4 py-3">✅ Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">24 hours - 2 years</td>
                      <td className="px-4 py-3">✅ Yes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Marketing</td>
                      <td className="px-4 py-3">90 days - 2 years</td>
                      <td className="px-4 py-3">✅ Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Cookie Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, 
                or our practices. We will notify you of material changes by posting the updated policy with a new "Last Updated" 
                date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2 text-gray-700">
                <p><strong>C3Ops Technologies Private Limited</strong></p>
                <p>The Skyview 10, Sy No 83/1, 2nd Floor,</p>
                <p>Hitech City Main Road, Raidurgam</p>
                <p>Hyderabad, Telangana - 500081, India</p>
                <p>Email: <a href="mailto:privacy@c3ops.io" className="text-primary-600 hover:underline">privacy@c3ops.io</a></p>
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
