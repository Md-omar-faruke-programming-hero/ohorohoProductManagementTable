import React from "react";

const FeatureImageModal = ({setModalFeatureImage,modalFeatureImage,handleDownloadAll}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setModalFeatureImage(null)}
    >
      <div
        className="relative bg-white w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="carousel w-full max-w-screen-lg mx-auto">
            {modalFeatureImage.map((img, index) => {
              const prevIndex = (index - 1 + modalFeatureImage.length) % modalFeatureImage.length;
              const nextIndex = (index + 1) % modalFeatureImage.length;

              return (
                <div key={index} id={`slide${index}`} className="carousel-item relative w-full">
                  <img
                    src={img}
                    alt={`Slide ${index}`}
                    className="w-full h-auto sm:h-72 md:h-96 lg:h-[500px] xl:h-[600px] object-cover rounded"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a
                      href={`#slide${prevIndex}`}
                      className="btn btn-circle bg-black bg-opacity-40 text-white hover:bg-opacity-70"
                    >
                      ❮
                    </a>
                    <a
                      href={`#slide${nextIndex}`}
                      className="btn btn-circle bg-black bg-opacity-40 text-white hover:bg-opacity-70"
                    >
                      ❯
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleDownloadAll}
          >
            Download All
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setModalFeatureImage(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureImageModal;
