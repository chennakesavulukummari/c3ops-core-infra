import React from 'react';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';

const DocumentationTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 pt-24">
      <SiteHeader />
      
      <div className="container-custom px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Documentation Test</h1>
        <p className="text-lg text-gray-700">
          This is a test page to see if the documentation loads.
        </p>
      </div>

      <SiteFooter />
    </div>
  );
};

export default DocumentationTest;