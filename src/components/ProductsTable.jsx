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
              <th className="p-2 border">Model</th>
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
              const name = p.name || p.productName || "—";
              const category = p.category || "—";
              const description = p.description || "—";
              const model = p.model || p.variantOrModel || "—";
              const size = p.size || "—";
              const color = p.color || "—";
              const wholesalePrice = p.wholesalePrice || p.wholeSellPrice || "—";
              const sellPrice = p.sellPrice || "—";
              const image = p.image || p.featuredImage || "";
              const gallery = p.gallery || p.galleryImages || [];

              return (
                <tr key={index} className="border-t text-sm">
                  <td className="p-2 border">{index+1}</td>
                  <td className="p-2 border">{name}</td>
                  <td className="p-2 border">{category}</td>
                  <td
                    className="p-2 border  cursor-pointer"
                    onClick={() => setModalDescription(description)}
                  >
                    {truncate(description, 20)}
                  </td>
                  <td className="p-2 border">{model}</td>
                  <td className="p-2 border">{size}</td>
                  <td className="p-2 border">{color}</td>
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
                    {image ? (
                      <img src={image} alt={name} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-1">
                      {(gallery || []).map((url, i) =>
                        typeof url === "string" ? (
                          <img
                            key={i}
                            src={url}
                            alt={`Gallery ${i}`}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : null
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
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditIndex(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Edit Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "name",
                "category",
                "description",
                "model",
                "size",
                "color",
                "wholesalePrice",
                "sellPrice",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-600 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={editData[field] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}

              {/* File Inputs */}
              <div>
                <label className="block text-sm text-gray-600">Feature Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      image: URL.createObjectURL(e.target.files[0]),
                    }))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Gallery Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      gallery: Array.from(e.target.files).map((file) => URL.createObjectURL(file)),
                    }))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Stock Checkboxes */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Stock Status</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="in"
                      checked={editData.stockStatus === "in"}
                      onChange={handleInputChange}
                    />
                    Stock In
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="out"
                      checked={editData.stockStatus === "out"}
                      onChange={handleInputChange}
                    />
                    Stock Out
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditIndex(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
