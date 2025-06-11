import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { uploadToImageBB } from "../utils/imageBBUploader";

export default function ProductTable({ products = [], onDelete, onEdit, loading }) {
  const [modalDescription, setModalDescription] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [modalFeatureImage, setModalFeatureImage] = useState(null);
  const [modalGalleryImage, setModalGalleryImage] = useState(null);
  const [copied, setCopied] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="relative w-14 h-14">
          {/* Outer gradient ring */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-yellow-500 animate-spin 
                    border-4 border-transparent shadow-xl shadow-pink-400/40"
          ></div>

          {/* Inner mask to create the hollow ring effect */}
          <div className="absolute inset-[4px] bg-white dark:bg-gray-900 rounded-full"></div>

          {/* Inner glow dot */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-md shadow-pink-400 animate-ping"></div>
        </div>
      </div>
    );
  }
  if (!products.length) {
    return <p className="text-center text-gray-500 mt-4">No products available.</p>;
  }

  const handleDownloadAll = async (img) => {
    if (img == "galleryimage") {
      for (const [index, imgUrl] of modalGalleryImage.entries()) {
        
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `image-${index + 1}.jpg`; // You can customize filename
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Failed to download image:", imgUrl, err);
        }
      }
    } else {
      for (const [index, imgUrl] of modalFeatureImage.entries()) {
       
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `image-${index + 1}.jpg`; // You can customize filename
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Failed to download image:", imgUrl, err);
        }
      }
    }
  };

  const handleCopyDescription = () => {
    if (modalDescription) {
      navigator.clipboard.writeText(modalDescription).then(() => {
        setCopied(true);
        setTimeout(() => {
          setModalDescription(null);
          setCopied(false);
        }, 1000);
        // Reset after 2 seconds
      });
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border cursor-pointer">
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
              const colortype = p?.colorType || [];
              const colorfinish = p?.colorfinish || [];
              const wholesalePrice = p?.wholeSellPrice || "—";
              const sellPrice = p?.sellPrice || "—";
              const image = p?.featuredImages || [];
              const gallery = p?.galleryImages || [];

              return (
                <tr key={index} className="border-t text-sm">
                  <td className="p-2 border">{index + 1}</td>
                  <td
                    className="p-2 border"
                    onClick={() => {
                      navigator.clipboard.writeText(name).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {name}
                  </td>
                  <td
                    className="p-2 border"
                    onClick={() => {
                      navigator.clipboard.writeText(category).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {category}
                  </td>
                  <td
                    className="p-2 border  cursor-pointer"
                    onClick={() => setModalDescription(description)}
                  >
                    {truncate(description, 20)}
                  </td>
                  <td
                    className="p-2 border"
                    onClick={() => {
                      navigator.clipboard.writeText(model).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {model}
                  </td>
                  {/* <td className="p-2 border">{size}</td> */}
                  <td
                    className="p-2 border"
                    onClick={() => {
                      if (Array.isArray(size)) {
                        const textToCopy = size
                          .map((s) => `${s.sizeType} - ${s.customSize}`)
                          .join(", ");
                        navigator.clipboard.writeText(textToCopy).then(() => {
                          toast.success("Copied!");
                        });
                      }
                    }}
                  >
                    {Array.isArray(size) &&
                      size.map((size, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {size.sizeType} - {size.customSize}
                        </div>
                      ))}
                  </td>

                  <td
                    className="p-2 border"
                    onClick={() => {
                      const textToCopy = Array.isArray(color) ? color.join(", ") : color || "—";
                      navigator.clipboard.writeText(textToCopy).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {Array.isArray(color) && color.length > 0 ? color.join(", ") : color || "—"}
                    {(Array.isArray(colortype) && colortype.length > 0) ||
                    (Array.isArray(colorfinish) && colorfinish.length > 0) ? (
                      <>
                        {" "}
                        ({[...(colortype || []), ...(colorfinish || [])].filter(Boolean).join(", ")}
                        )
                      </>
                    ) : null}
                  </td>

                  <td
                    className="p-2 border"
                    onClick={() => {
                      navigator.clipboard.writeText(wholesalePrice).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {wholesalePrice}৳
                  </td>
                  <td
                    className="p-2 border"
                    onClick={() => {
                      navigator.clipboard.writeText(sellPrice).then(() => {
                        toast.success("Copied!");
                      });
                    }}
                  >
                    {sellPrice}৳
                  </td>
                  <td className="p-2 border text-center">
                    {p.stockStatus === "in" && (
                      <span className="text-green-600 font-semibold">In Stock</span>
                    )}
                    {p.stockStatus === "out" && (
                      <span className="text-gray-500 font-semibold">Out of Stock</span>
                    )}

                    {p.stockStatus === "up" && (
                      <span className="text-orange-500 font-semibold">Upcoming</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-1">
                      {image && image.length > 0 ? (
                        image.map((url, i) =>
                          typeof url === "string" ? (
                            <img
                              onClick={() => setModalFeatureImage(image)}
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
                              onClick={() => setModalGalleryImage(gallery)}
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

              {copied && (
                <span className="text-sm text-green-600 sm:ml-2 sm:mt-0 mt-2">Copied!</span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* carrousel feature image Modal */}
      {modalFeatureImage && (
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
                  const prevIndex =
                    (index - 1 + modalFeatureImage.length) % modalFeatureImage.length;
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
      )}
      {/* carrousel Gallery image Modal */}
      {modalGalleryImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalGalleryImage(null)}
        >
          <div
            className="relative bg-white w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="carousel w-full max-w-screen-lg mx-auto">
                {modalGalleryImage.map((img, index) => {
                  const prevIndex =
                    (index - 1 + modalGalleryImage.length) % modalGalleryImage.length;
                  const nextIndex = (index + 1) % modalGalleryImage.length;

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
                onClick={() => handleDownloadAll("galleryimage")}
              >
                Download All
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setModalGalleryImage(null)}
              >
                Close
              </button>
            </div>
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
                    const uploadedUrls = await Promise.all(
                      files.map((file) => uploadToImageBB(file))
                    );
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
                    const uploadedUrls = await Promise.all(
                      files.map((file) => uploadToImageBB(file))
                    );
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
                <label className="block text-sm text-black mb-1">
                  Colors Type (comma-separated)
                </label>
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
      )}
    </>
  );
}
