import { useState } from "react";

export default function ProductTable({ products = [], onDelete, onEdit }) {
  const [modalDescription, setModalDescription] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const truncate = (str, n) => (str.length > n ? str.slice(0, n) + "..." : str);

  const handleEditClick = (index, product) => {
    setEditIndex(index);
    setEditData(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(editIndex, editData);
    setEditIndex(null);
    setEditData({});
  };

  if (!products.length) {
    return <p className="text-center text-gray-500 mt-4">No products available.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2 border">item</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Variant / Model</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Color</th>
              <th className="p-2 border">Wholesale Price</th>
              <th className="p-2 border">Sell Price</th>
              <th className="p-2 border">Stock Status</th>

              <th className="p-2 border">Image</th>
              <th className="p-2 border">Gallery</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => {
              const name = p?.productName || "—";
              const category = p?.category || "—";
              const description = p?.description || "—";
              const model = p?.variantOrModel || "—";
              const size = p?.sizes || [];
              const color = p?.color || [];
              const wholesalePrice = p?.wholeSellPrice || "—";
              const sellPrice = p?.sellPrice || "—";
              const image = p?.featuredImages || [];
              const gallery = p?.galleryImages || [];

              return (
                <tr key={index} className="border-t text-sm">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{name}</td>
                  <td className="p-2 border">{category}</td>
                  <td
                    className="p-2 border  cursor-pointer"
                    onClick={() => setModalDescription(description)}
                  >
                    {truncate(description, 20)}
                  </td>
                  <td className="p-2 border">{model}</td>
                  {/* <td className="p-2 border">{size}</td> */}
                  <td className="p-2 border">
                    {Array.isArray(size) &&
                      size.map((size, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {size.sizeType} - {size.customSize}
                        </div>
                      ))}
                  </td>

                  <td className="p-2 border">
                    {Array.isArray(color) ? color.join(", ") : color || "—"}
                  </td>

                  <td className="p-2 border">{wholesalePrice}৳</td>
                  <td className="p-2 border">{sellPrice}৳</td>
                  <td className="p-2 border text-center">
                    {p.stockStatus === "in" ? (
                      <span className="text-green-600 font-semibold">Stock In</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Stock Out</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-1">
                      {image && image.length > 0 ? (
                        image.map((url, i) =>
                          typeof url === "string" ? (
                            <img
                              key={i}
                              src={url}
                              alt={`image ${i}`}
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : null
                        )
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-1">
                      {gallery && gallery.length > 0 ? (
                        gallery.map((url, i) =>
                          typeof url === "string" ? (
                            <img
                              key={i}
                              src={url}
                              alt={`gallery ${i}`}
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : null
                        )
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border space-y-2">
                    <button
                      onClick={() => handleEditClick(index, p)}
                      className="w-full px-4 py-1 bg-blue-100 text-blue-600 font-medium rounded hover:bg-blue-200 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="w-full px-4 py-1 bg-red-100 text-red-600 font-medium rounded hover:bg-red-200 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Full Description Modal */}
      {modalDescription && (
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
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setModalDescription(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editIndex !== null && (
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
                  <label className="block text-sm text-gray-600 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={editData[name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              ))}

              {/* Feature Image */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Featured Images</label>

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
                        className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newImages = files.map((file) => URL.createObjectURL(file));
                    setEditData((prev) => ({
                      ...prev,
                      featuredImages: [...(prev.featuredImages || []), ...newImages],
                    }));
                  }}
                  className="block w-full text-sm border rounded p-2"
                />
              </div>

              {/* Gallery Images */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Gallery Images</label>
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
                        className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      galleryImages: Array.from(e.target.files).map((file) =>
                        URL.createObjectURL(file)
                      ),
                    }))
                  }
                  className="block w-full text-sm border rounded p-2"
                />
              </div>

              {/* Stock Status */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Stock Status</label>
                <div className="flex flex-wrap gap-4">
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
                <label className="block text-sm text-gray-600 mb-1">Sizes</label>
                {Array.isArray(editData.sizes) &&
                  editData.sizes.map((size, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Size Type"
                        value={size.sizeType}
                        onChange={(e) => {
                          const updatedSizes = [...editData.sizes];
                          updatedSizes[idx].sizeType = e.target.value;
                          setEditData({ ...editData, sizes: updatedSizes });
                        }}
                        className="flex-1 p-2 border rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Custom Size"
                        value={size.customSize}
                        onChange={(e) => {
                          const updatedSizes = [...editData.sizes];
                          updatedSizes[idx].customSize = e.target.value;
                          setEditData({ ...editData, sizes: updatedSizes });
                        }}
                        className="flex-1 p-2 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSizes = editData.sizes.filter((_, i) => i !== idx);
                          setEditData({ ...editData, sizes: updatedSizes });
                        }}
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
                <label className="block text-sm text-gray-600 mb-1">Colors (comma-separated)</label>
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
      )}
    </>
  );
}
