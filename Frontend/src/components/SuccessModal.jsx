import React from "react";

const SuccessModal = ({ visible, title, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 className="text-xl font-semibold text-green-600 mb-3">{title}</h2>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
