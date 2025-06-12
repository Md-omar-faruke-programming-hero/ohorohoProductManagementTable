import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { uploadToImageBB } from "../utils/imageBBUploader";
import DescriptionModal from "./DescriptionModal";
import FeatureImageModal from "./FeatureImageModal";
import GalleryImageModal from "./GalleryImageModal";
import EditModal from "./EditModal";

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
                        <>
                          {gallery
                            .slice(0, 1)
                            .map((url, i) =>
                              typeof url === "string" ? (
                                <img
                                  onClick={() => setModalGalleryImage(gallery)}
                                  key={i}
                                  src={url}
                                  alt={`gallery ${i}`}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : null
                            )}
                          {gallery.length > 3 && (
                            <div
                              onClick={() => setModalGalleryImage(gallery)}
                              className=" object-cover rounded text-xs text-black font-bold"
                            >
                              See more (+{gallery.length - 1})
                            </div>
                          )}
                        </>
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
        <DescriptionModal
          modalDescription={modalDescription}
          setModalDescription={setModalDescription}
          handleCopyDescription={handleCopyDescription}
          copied={copied}
        ></DescriptionModal>
      )}
      {/* carrousel feature image Modal */}
      {modalFeatureImage && (
        <FeatureImageModal
          setModalFeatureImage={setModalFeatureImage}
          modalFeatureImage={modalFeatureImage}
          handleDownloadAll={handleDownloadAll}
        ></FeatureImageModal>
      )}
      {/* carrousel Gallery image Modal */}
      {modalGalleryImage && (
        <GalleryImageModal
          setModalGalleryImage={setModalGalleryImage}
          modalGalleryImage={modalGalleryImage}
          handleDownloadAll={handleDownloadAll}
        ></GalleryImageModal>
      )}

      {/* Edit Modal */}
      {editIndex !== null && (
        <EditModal
          setEditIndex={setEditIndex}
          editData={editData}
          handleInputChange={handleInputChange}
          setEditData={setEditData}
          uploadToImageBB={uploadToImageBB}
          handleSave={handleSave}
        ></EditModal>
      )}
    </>
  );
}
