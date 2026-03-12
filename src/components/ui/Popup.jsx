import React from 'react';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
