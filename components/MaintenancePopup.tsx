'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Auto-hides after this date. Set to 7/16 so it shows through all of 7/15 Pacific.
const MAINTENANCE_END = new Date('2026-07-16');
const STORAGE_KEY = 'maintenance-popup-dismissed-jul-2026';

export default function MaintenancePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    const isBeforeMaintenanceEnds = now <= MAINTENANCE_END;

    setIsVisible(!isDismissed && isBeforeMaintenanceEnds);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
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
            Temporarily Unavailable
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Ball machine rentals are temporarily paused for unexpected maintenance. We&apos;re working to get it back as soon as possible and expect to be available again soon. Thank you for your patience!
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