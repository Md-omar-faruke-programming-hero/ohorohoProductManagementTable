import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
const EditModal = ({
  setEditIndex,
  editData,
  handleInputChange,
  setEditData,
  uploadToImageBB,
  handleSave,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2"
      onClick={() => setEditIndex(null)}
    >
      <div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-bold mb-4">Edit Product</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Product Name", name: "productName" },
            { label: "Category", name: "category" },
            { label: "Description", name: "description" },
            { label: "Variant / Model", name: "variantOrModel" },
            { label: "Wholesale Price", name: "wholeSellPrice" },
            { label: "Sell Price", name: "sellPrice" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm text-black mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={editData[name] || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          ))}
          {/* order quantity */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="MinimumOrderQuantity">
              Minimum Order Quantity
            </label>
            <input
              id="Minimum Order Quantity"
              type="number"
              name="minimumOrderQuantity"
              placeholder="Minimum Order Quantity"
              onChange={handleInputChange}
              value={editData.minimumOrderQuantity}
              className="w-full border  rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-black"
            />
          </div>

          {/* Featured Images */}
          <div className="md:col-span-2">
            <label className="block text-sm text-black mb-1">Featured Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editData.featuredImages?.map((img, index) => (
                <div key={index} className="relative h-16 w-16">
                  <img
                    src={img}
                    alt={`Featured ${index}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditData((prev) => ({
                        ...prev,
                        featuredImages: prev.featuredImages.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-0 right-0"
                  >
                    <AiFillCloseCircle className="text-[25px]" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                const uploadedUrls = await Promise.all(files.map((file) => uploadToImageBB(file)));
                setEditData((prev) => ({
                  ...prev,
                  featuredImages: [...(prev.featuredImages || []), ...uploadedUrls],
                }));
              }}
              className="block w-full text-sm border rounded p-2"
            />
          </div>

          {/* Gallery Images */}
          <div className="md:col-span-2">
            <label className="block text-sm text-black mb-1">Gallery Images</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {editData.galleryImages?.map((img, i) => (
                <div key={i} className="relative h-12 w-12">
                  <img src={img} alt="gallery" className="h-12 w-12 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() =>
                      setEditData((prev) => ({
                        ...prev,
                        galleryImages: prev.galleryImages.filter((_, index) => index !== i),
                      }))
                    }
                    className="absolute top-0 right-0"
                  >
                    <AiFillCloseCircle className="text-[25px]" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                const uploadedUrls = await Promise.all(files.map((file) => uploadToImageBB(file)));
                setEditData((prev) => ({
                  ...prev,
                  galleryImages: [...(prev.galleryImages || []), ...uploadedUrls],
                }));
              }}
              className="block w-full text-sm border rounded p-2"
            />
          </div>

          {/* Stock Status */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm text-black mb-1">Stock Status</label>
            <div className="flex gap-4">
              {["in", "out"].map((val) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="stockStatus"
                    value={val}
                    checked={editData.stockStatus === val}
                    onChange={handleInputChange}
                  />
                  {val === "in" ? "Stock In" : "Stock Out"}
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm text-black mb-1">Sizes</label>
            {(editData.sizes || []).map((size, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size Type"
                  value={size.sizeType}
                  onChange={(e) => {
                    const updated = [...editData.sizes];
                    updated[idx].sizeType = e.target.value;
                    setEditData({ ...editData, sizes: updated });
                  }}
                  className="flex-1 p-2 border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Custom Size"
                  value={size.customSize}
                  onChange={(e) => {
                    const updated = [...editData.sizes];
                    updated[idx].customSize = e.target.value;
                    setEditData({ ...editData, sizes: updated });
                  }}
                  className="flex-1 p-2 border rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditData({
                      ...editData,
                      sizes: editData.sizes.filter((_, i) => i !== idx),
                    })
                  }
                  className="px-2 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setEditData({
                  ...editData,
                  sizes: [...(editData.sizes || []), { sizeType: "", customSize: "" }],
                })
              }
              className="mt-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
            >
              + Add Size
            </button>
          </div>

          {/* Colors */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm text-black mb-1">Colors (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(editData.color) ? editData.color.join(", ") : ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  color: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm text-black mb-1">Colors Type (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(editData.colorType) ? editData.colorType.join(", ") : ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  colorType: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm text-black mb-1">
              Colors Finish Type(comma-separated)
            </label>
            <input
              type="text"
              value={Array.isArray(editData.colorfinish) ? editData.colorfinish.join(", ") : ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  colorfinish: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditIndex(null)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
