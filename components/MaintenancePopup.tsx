'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MaintenancePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Maintenance is complete - popup disabled
    setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('maintenance-popup-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
        
        <div className="pr-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Maintenance Notice
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Ball machine rentals will be unavailable from June 24-June 30. I am sending the machine back to the manufacturer for a tune-up. Thank you for your understanding!
          </p>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 