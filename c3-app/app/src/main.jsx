import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Terms from './pages/Terms.jsx'
import Cookies from './pages/Cookies.jsx'
import KnowledgePage from './pages/knowledge/KnowledgePage.jsx'
import Deck from './pages/Deck.jsx'
import Careers from './pages/Careers.jsx'
import Documentation from './pages/Documentation.jsx'
// import DocumentationTest from './pages/DocumentationTest.jsx'
import Blog from './pages/Blog.jsx'
import CaseStudies from './pages/CaseStudies.jsx'
import Whitepapers from './pages/Whitepapers.jsx'
import AboutUs from './pages/AboutUs.jsx'
// import Testimonials from './pages/Testimonials.jsx'
import Contact from './pages/Contact.jsx'
import Pricing from './pages/Pricing.jsx'
import Platform from './pages/Platform.jsx'

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/knowledge/:slug" element={<KnowledgePage />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/whitepapers" element={<Whitepapers />} />
        <Route path="/about" element={<AboutUs />} />
        {/* <Route path="/testimonials" element={<Testimonials />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/platform" element={<Platform />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
