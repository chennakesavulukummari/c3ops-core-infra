import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const TypeformModal = ({ isOpen, onClose, actionType }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClickedSubmit, setHasClickedSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    monthlyCloudSpend: '',
    cloudProviders: [],
    primaryGoal: '',
    timeline: '',
    phone: '',
    message: ''
  });

  const resetForm = () => {
    setCurrentStep(1);
    setHasClickedSubmit(false);
    setFormData({
      name: '', email: '', company: '', role: '', monthlyCloudSpend: '',
      cloudProviders: [], primaryGoal: '', timeline: '', phone: '', message: ''
    });
  };

  const questions = [
    {
      id: 1,
      title: "Let's start with the basics",
      subtitle: "Tell us about yourself",
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
        { name: 'email', label: 'Work Email', type: 'email', required: true, placeholder: 'john@company.com' },
        { name: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'Your Company' }
      ]
    },
    {
      id: 2,
      title: "What's your role?",
      subtitle: "This helps us understand your perspective",
      fields: [
        { 
          name: 'role', 
          label: 'Your Role', 
          type: 'radio', 
          required: true,
          options: [
            'Engineering/DevOps',
            'Finance/Procurement',
            'Cloud Architect',
            'CTO/VP Engineering',
            'CFO/Finance Leader',
            'Other'
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Tell us about your cloud usage",
      subtitle: "Understanding your current setup",
      fields: [
        { 
          name: 'monthlyCloudSpend', 
          label: 'Monthly Cloud Spend', 
          type: 'radio', 
          required: true,
          options: [
            'Less than $10K',
            '$10K - $50K',
            '$50K - $200K',
            '$200K - $1M',
            'More than $1M'
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Which cloud providers do you use?",
      subtitle: "Select all that apply",
      fields: [
        { 
          name: 'cloudProviders', 
          label: 'Cloud Providers', 
          type: 'checkbox', 
          required: true,
          options: [
            'AWS',
            'Microsoft Azure',
            'Google Cloud Platform (GCP)',
            'On-premises',
            'Other'
          ]
        }
      ]
    },
    {
      id: 5,
      title: "What's your primary goal?",
      subtitle: "Help us understand what you're looking to achieve",
      fields: [
        { 
          name: 'primaryGoal', 
          label: 'Primary Goal', 
          type: 'radio', 
          required: true,
          options: [
            'Reduce cloud costs by 20-30%',
            'Get better visibility into spending',
            'Implement FinOps best practices',
            'Automate cost optimization',
            'Prepare for budget planning',
            'Other'
          ]
        }
      ]
    },
    {
      id: 6,
      title: "When are you looking to start?",
      subtitle: "Timeline for implementation",
      fields: [
        { 
          name: 'timeline', 
          label: 'Timeline', 
          type: 'radio', 
          required: true,
          options: [
            'Immediately (within 1 month)',
            'Within 3 months',
            'Within 6 months',
            'Just exploring options'
          ]
        }
      ]
    },
    {
      id: 7,
      title: "Final details",
      subtitle: "How can we best reach you?",
      fields: [
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+1 (555) 123-4567' },
        { name: 'message', label: 'Anything else you\'d like us to know?', type: 'textarea', required: false, placeholder: 'Tell us about your specific challenges or goals...' }
      ]
    }
  ];

  const totalSteps = questions.length;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      // Phone number validation - only allow numbers, +, spaces, parentheses, and hyphens
      if (name === 'phone') {
        const phoneRegex = /^[0-9+\s()\-]*$/;
        if (!phoneRegex.test(value)) {
          return; // Don't update if invalid characters
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateCurrentStep = () => {
    const currentQuestion = questions.find(q => q.id === currentStep);
    if (!currentQuestion) return false;

    return currentQuestion.fields.every(field => {
      if (!field.required) return true;
      
      const value = formData[field.name];
      if (field.type === 'checkbox') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.trim() !== '';
    });
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent Enter key from submitting the form
    if (e.key === 'Enter') {
      e.preventDefault();
      // On non-final steps, move to next step
      if (currentStep < totalSteps && validateCurrentStep()) {
        nextStep();
      }
      // On final step, do nothing - user must click Submit button
    }
  };

  const handleSubmitClick = async () => {
    if (!validateCurrentStep() || isSubmitting) return;
    
    await handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateCurrentStep() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Determine API URL - for development, use the live API since we don't have a local backend
      const API_BASE_URL = 'https://3tz75do8r6.execute-api.ap-south-2.amazonaws.com/prod';

      const response = await fetch(`${API_BASE_URL}/api/typeform/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          actionType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      console.log('Form submitted successfully:', result);
      
      // Reset form state before closing
      resetForm();
      
      // Close modal and show success message
      onClose();
      
      // Show contextual success message based on action type
      let successMessage = '';
      switch (actionType) {
        case 'assessment':
          successMessage = '🎉 Thank you! We\'ll contact you within 24 hours to schedule your free FinOps assessment.';
          break;
        case 'trial':
          successMessage = '🚀 Great! We\'ll set up your free trial and send access details within 24 hours.';
          break;
        case 'contact':
          successMessage = '📞 Thank you! Our sales team will reach out within 24 hours to discuss your needs.';
          break;
        default:
          successMessage = '✅ Thank you! We\'ll be in touch within 24 hours.';
      }
      
      alert(successMessage);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your form. Please try again or contact us directly at info@c3ops.io');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentQuestion = questions.find(q => q.id === currentStep);
  const progress = (currentStep / totalSteps) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{currentStep}</span>
                  </div>
                  <span className="text-sm text-gray-500">of {totalSteps}</span>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-primary-400 h-2 rounded-full transition-all duration-300"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion?.title}</h2>
              <p className="text-gray-600">{currentQuestion?.subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="space-y-6">
                  {currentQuestion?.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'radio' && (
                        <div className="space-y-3">
                          {field.options.map((option) => (
                            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-all">
                              <input
                                type="radio"
                                name={field.name}
                                value={option}
                                checked={formData[field.name] === option}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${formData[field.name] === option ? 'border-primary-400 bg-primary-400' : 'border-gray-300'}`}>
                                {formData[field.name] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {field.type === 'checkbox' && (
                        <div className="space-y-3">
                          {field.options.map((option) => (
                            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-accent-400 hover:bg-accent-50 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                name={field.name}
                                value={option}
                                checked={(formData[field.name] || []).includes(option)}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${(formData[field.name] || []).includes(option) ? 'border-accent-500 bg-accent-500' : 'border-gray-300'}`}>
                                {(formData[field.name] || []).includes(option) && <FaArrowRight className="text-white text-xs" />}
                              </div>
                              <span className="text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.name === 'phone' ? '+1 (555) 123-4567' : field.placeholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      currentStep === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FaArrowLeft />
                    Back
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                        validateCurrentStep()
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next
                      <FaArrowRight />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitClick}
                      disabled={!validateCurrentStep() || isSubmitting}
                      className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                        validateCurrentStep() && !isSubmitting
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <FaArrowRight />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypeformModal;