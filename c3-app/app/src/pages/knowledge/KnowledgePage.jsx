import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaExternalLinkAlt, FaTimes, FaExpand } from 'react-icons/fa';
import { knowledgeContent } from './content';

export default function KnowledgePage() {
  const { slug } = useParams();
  const entry = knowledgeContent[slug];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = (body) => {
    const sections = body.split('\n\n');
    return sections.map((section, index) => {
      // Skip empty sections
      if (!section.trim()) return null;
      
      // Handle main headers (##)
      if (section.trim().startsWith('##')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-green-700 mt-8 mb-4">
            {section.replace(/^##\s*/, '').replace(/\*\*/g, '')}
          </h2>
        );
      }
      
      // Handle sub headers (single # or **header**)
      if (section.trim().startsWith('#') || (section.trim().startsWith('**') && section.trim().endsWith('**') && section.split('\n').length === 1)) {
        return (
          <h3 key={index} className="text-xl font-bold text-green-700 mt-6 mb-3">
            {section.replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '')}
          </h3>
        );
      }
      
      // Check if section contains bullet points
      if (section.includes('• ') || section.includes('- ')) {
        const lines = section.split('\n');
        const heading = lines.find(line => !line.trim().startsWith('• ') && !line.trim().startsWith('- ') && line.trim() && !line.trim().startsWith('**'));
        const bullets = lines.filter(line => line.trim().startsWith('• ') || line.trim().startsWith('- '));
        
        return (
          <div key={index} className="mb-4">
            {heading && (
              <p className="text-gray-700 mb-2 font-medium">
                {heading.replace(/\*\*/g, '')}
              </p>
            )}
            <ul className="list-disc pl-6 space-y-1">
              {bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="text-gray-700">
                  {renderTextWithFormatting(bullet.replace(/^[•\-]\s*/, ''))}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Handle numbered lists (1., 2., etc.)
      if (/^\d+\./.test(section.trim())) {
        const lines = section.split('\n').filter(line => line.trim());
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2 mb-4">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex} className="text-gray-700">
                {renderTextWithFormatting(line.replace(/^\d+\.\s*/, ''))}
              </li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraphs with inline formatting
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {renderTextWithFormatting(section)}
        </p>
      );
    }).filter(Boolean); // Remove null entries
  };

  const renderTextWithFormatting = (text) => {
    // Handle **bold** text
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <section className="section-padding min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <Link to="/" className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors">
              <FaArrowLeft />
              <img 
                src="/c3ops-logo-full-light.svg" 
                alt="C3Ops - FinOps Platform" 
                className="h-10 w-auto"
              />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          {entry ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-green-700 mb-6">
                  {entry.title}
                </h1>

                {/* Hero Diagram/Image Section */}
                {entry.diagram && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100">
                    <div className="text-center">
                      <div 
                        className="w-full bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden relative cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <img 
                          src={entry.diagram} 
                          alt={`${entry.title} Diagram`}
                          className="w-full h-auto min-h-[400px] max-h-[600px] object-contain transition-transform group-hover:scale-105"
                          style={{ imageRendering: 'crisp-edges', imageRendering: '-webkit-optimize-contrast' }}
                          onLoad={(e) => {
                            console.log('Image loaded successfully:', entry.diagram);
                            // Hide fallback when image loads successfully
                            const fallback = e.target.nextSibling;
                            if (fallback) fallback.style.display = 'none';
                          }}
                          onError={(e) => {
                            console.log('Image failed to load:', entry.diagram);
                            // Hide image and show fallback
                            e.target.style.display = 'none';
                            const fallback = e.target.nextSibling;
                            if (fallback) {
                              fallback.style.display = 'flex';
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        <div className="w-full h-64 hidden items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <div className="text-5xl text-green-500 mb-3">📊</div>
                            <p className="text-green-600 font-semibold text-lg mb-1">{entry.title}</p>
                            <p className="text-sm text-gray-500 mb-2">Interactive Framework Diagram</p>
                            <div className="mt-3 px-3 py-1 bg-green-100 rounded-full text-green-700 text-xs">
                              Diagram not available
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaExpand className="text-green-600" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Click to view full-size diagram
                      </div>
                    </div>
                  </div>
                )}

                <div className="prose prose-gray max-w-none">
                  {renderContent(entry.body)}
                </div>

                {/* Additional Resources Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Resources</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">FinOps Foundation</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Access official FinOps Foundation resources and best practices
                      </p>
                      <a 
                        href="https://www.finops.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                      >
                        Visit FinOps.org <FaExternalLinkAlt className="text-xs" />
                      </a>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">C3Ops Platform</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        See how C3Ops implements these FinOps principles in practice
                      </p>
                      <Link 
                        to="/platform"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        Explore Platform <FaArrowLeft className="text-xs transform rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Related Topics */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Related FinOps Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(knowledgeContent).filter(key => key !== slug).map((relatedSlug) => (
                      <Link
                        key={relatedSlug}
                        to={`/knowledge/${relatedSlug}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {knowledgeContent[relatedSlug].title}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-black text-green-700 mb-2">Topic Not Found</h1>
              <p className="text-gray-600">We couldn't find that FinOps topic. Please go back and choose another.</p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaArrowLeft />
                Back to Home
              </Link>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Full-size Diagram Modal */}
      {isModalOpen && entry && entry.diagram && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              <FaTimes size={20} />
            </button>
            <img
              src={entry.diagram}
              alt={`${entry.title} Diagram - Full Size`}
              className="max-w-[90vw] max-h-[90vh] object-contain bg-white rounded-lg shadow-2xl"
              style={{ imageRendering: 'crisp-edges', imageRendering: '-webkit-optimize-contrast' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3 rounded-b-lg">
              <h3 className="font-semibold">{entry.title}</h3>
              <p className="text-sm text-gray-300">Click outside or press the X to close</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
