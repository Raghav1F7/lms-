import React, { useEffect } from 'react';

interface FlashProps {
  message: string;
  type?: 'success' | 'error';
  onClear: () => void;
}

export const Flash: React.FC<FlashProps> = ({ message, type = 'success', onClear }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  const bgClass = type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white';

  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg z-50 flex items-center ${bgClass} transition-opacity duration-300`}>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};