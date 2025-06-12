import React from "react";

const DescriptionModal = ({setModalDescription,modalDescription,handleCopyDescription,copied}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setModalDescription(null)}
    >
      <div
        className="relative bg-white w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">Full Description</h3>
        <p className="text-gray-800">{modalDescription}</p>
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setModalDescription(null)}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleCopyDescription}
          >
            Copy
          </button>

          {copied && <span className="text-sm text-green-600 sm:ml-2 sm:mt-0 mt-2">Copied!</span>}
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
