import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  const finopsKnowledge = [
    { question: 'What is FinOps?', slug: 'what-is-finops' },
    { question: 'Why FinOps?', slug: 'why-finops' },
    { question: 'FinOps Culture', slug: 'finops-culture' },
    { question: 'FinOps Framework', slug: 'finops-framework' },
    { question: 'Cost Optimization', slug: 'cost-optimization' },
    { question: 'FinOps for AI', slug: 'finops-for-ai' },
    { question: 'AI for FinOps', slug: 'ai-for-finops' }
  ];

  return (
    <footer className="bg-accent-100 py-8 md:py-12 border-t-2 border-accent-200 mt-12">
      <div className="container-custom px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="flex items-center mb-3 md:mb-4">
              <img src="/c3ops-logo-full-light.svg" alt="C3Ops - FinOps Platform" className="h-10 md:h-12 w-auto" />
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We deliver <span className="text-gray-900 font-medium">FinOps-as-a-Service</span> using our AI-Driven FinOps Platform, driving cost optimization across AWS, Azure, GCP, On-premises infrastructure, SaaS licensing, and AI workloads.
              <br /><br />
              By implementing FinOps Foundation best practices, we help clients build cost-conscious engineering cultures that deliver sustained value.
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
              <li><Link to="/contact" className="hover:text-accent-600 transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-accent-600 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-gray-900">FinOps Knowledge</h4>
            <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
              {finopsKnowledge.map((item) => (
                <li key={item.slug}>
                  <Link to={`/knowledge/${item.slug}`} className="hover:text-accent-600 transition-colors">{item.question}</Link>
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
              {/* <li><a href="mailto:info@c3ops.io" className="hover:text-accent-600 transition-colors">Support</a></li> */}
              <li><Link to="/privacy-policy" className="hover:text-accent-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-200 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <p className="text-gray-700 text-xs md:text-sm text-center md:text-left">© 2026 C3Ops Technologies Private Limited. All rights reserved.</p>
          <div className="flex gap-3 md:gap-4 text-sm md:text-base">
            <Link to="/terms" className="text-gray-700 hover:text-accent-600 transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="text-gray-700 hover:text-accent-600 transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-gray-700 hover:text-accent-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
