import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PricingPlans from '../components/common/PricingPlans';
import SiteHeader from '../components/layouts/SiteHeader';
import SiteFooter from '../components/layouts/SiteFooter';
import TypeformModal from '../components/common/TypeformModal';

function Pricing() {
  const [isTypeformOpen, setIsTypeformOpen] = useState(false);
  const [typeformAction, setTypeformAction] = useState('');

  const openTypeform = (actionType) => {
    setTypeformAction(actionType);
    setIsTypeformOpen(true);
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <SiteHeader />
      <PricingPlans openTypeform={openTypeform} />
      <SiteFooter />
      
      {/* TypeForm Modal */}
      <TypeformModal 
        isOpen={isTypeformOpen} 
        onClose={() => setIsTypeformOpen(false)} 
        actionType={typeformAction}
      />
    </div>
  );
}

export default Pricing;
