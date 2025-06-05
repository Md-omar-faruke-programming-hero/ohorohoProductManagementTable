import { useState, useRef } from "react";
import { uploadToImageBB } from "../utils/imageBBUploader";
export default function ProductForm({ products = [], onAdd, loading }) {
  console.log(products);
  const [isModelBooked, setIsModelBooked] = useState(false);
  const [product, setProduct] = useState({
    productName: "",
    category: "",
    description: "",
    variantOrModel: "",
    sizes: [],
    color: [],
    wholeSellPrice: "",
    sellPrice: "",
    featuredImages: [],
    galleryImages: [],
    stockStatus: "in",
  });
  const [customColor, setCustomColor] = useState("");
  const [currentSize, setCurrentSize] = useState({
    sizeType: "",
    customSize: "",
  });

  const [featuredPreviews, setFeaturedPreviews] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  // Refs for file inputs
  const featuredInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "featuredImages") {
      const filesArray = Array.from(files);
      setProduct((prev) => ({ ...prev, featuredImages: filesArray }));
      setFeaturedPreviews(filesArray.map((file) => URL.createObjectURL(file)));
    } else if (name === "galleryImages") {
      const filesArray = Array.from(files);
      setProduct((prev) => ({ ...prev, galleryImages: filesArray }));
      setGalleryPreviews(filesArray.map((file) => URL.createObjectURL(file)));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));

      // For checking if the model code exists
      if (name === "variantOrModel") {
        const codeExists = products.some(
          (item) => item.variantOrModel.trim().toLowerCase() === value.trim().toLowerCase()
        );
        setIsModelBooked(codeExists);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuredImageUrls = await Promise.all(
        product.featuredImages.map((file) => uploadToImageBB(file))
      );

      const galleryImageUrls = await Promise.all(
        product.galleryImages.map((file) => uploadToImageBB(file))
      );

      const finalProduct = {
        ...product,
        featuredImages: featuredImageUrls,
        galleryImages: galleryImageUrls,
        size: `${product.sizeType} - ${product.customSize}`,
      };

      onAdd(finalProduct);

      // Reset form
      setProduct({
        productName: "",
        category: "",
        description: "",
        variantOrModel: "",
        sizes: [],
        color: [],
        wholeSellPrice: "",
        sellPrice: "",
        featuredImages: [],
        galleryImages: [],
        stockStatus: "in",
      });

      setFeaturedPreviews([]);
      setGalleryPreviews([]);

      if (featuredInputRef.current) featuredInputRef.current.value = null;
      if (galleryInputRef.current) galleryInputRef.current.value = null;
    } catch (error) {
      console.error(error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="productName">
            Product Name
          </label>
          <input
            id="productName"
            name="productName"
            placeholder="Product Name"
            onChange={handleChange}
            value={product.productName}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            value={product.category}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={product.description}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black"
            required
          ></textarea>
        </div>

        {/* Variant/Model */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="variantOrModel">
            Variant Or Model
          </label>
          <input
            id="variantOrModel"
            name="variantOrModel"
            placeholder="ভ্যারিয়েন্ট/মডেল"
            onChange={handleChange}
            value={product.variantOrModel}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black"
          />
          {isModelBooked && (
            <p className="text-red-500 text-sm mt-1">This model code is already booked.</p>
          )}
        </div>

        {/* Size */}

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Size</label>
          <select
            value={currentSize.sizeType}
            onChange={(e) => setCurrentSize((prev) => ({ ...prev, sizeType: e.target.value }))}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          >
            <option value="">-- Choose Size --</option>
            <option value="বড়">বড়</option>
            <option value="মাঝারি">মাঝারি</option>
            <option value="ছোট">ছোট</option>
          </select>

          <input
            type="text"
            placeholder='উদাহরণ: ১৬" x ৫" x ৭"'
            value={currentSize.customSize}
            onChange={(e) => setCurrentSize((prev) => ({ ...prev, customSize: e.target.value }))}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 placeholder-black"
          />

          <button
            type="button"
            onClick={() => {
              if (currentSize.sizeType && currentSize.customSize) {
                setProduct((prev) => ({
                  ...prev,
                  sizes: [...prev.sizes, currentSize],
                }));
                setCurrentSize({ sizeType: "", customSize: "" });
                console.log(product.sizes);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Size
          </button>
          <div className="mt-2">
            {product.sizes.map((size, index) => (
              <div key={index} className="text-sm text-gray-700">
                {size.sizeType} - {size.customSize}
              </div>
            ))}
          </div>
        </div>

        {/* Color */}

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">রঙ নির্বাচন করুন</label>

          {/* Predefined Color Options as Checkboxes */}
          <div className="flex flex-wrap gap-2 mb-3">
            {["লাল", "নীল", "সবুজ", "কালো", "সাদা"].map((colorOption) => (
              <label key={colorOption} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={colorOption}
                  checked={product.color?.includes(colorOption)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    setProduct((prev) => {
                      const updatedColors = checked
                        ? [...(prev.color || []), value]
                        : prev.color.filter((c) => c !== value);
                      return { ...prev, color: updatedColors };
                    });
                  }}
                />
                <span>{colorOption}</span>
              </label>
            ))}
          </div>

          {/* Optional Custom Color Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="কাস্টম রঙ লিখুন (যেমনঃ সোনালী)"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black"
              value={customColor || ""}
              onChange={(e) => setCustomColor(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => {
                if (customColor && !product.color?.includes(customColor)) {
                  setProduct((prev) => ({
                    ...prev,
                    color: [...(prev.color || []), customColor],
                  }));
                  setCustomColor("");
                }
              }}
            >
              যোগ করুন
            </button>
          </div>

          {/* Display Selected Colors */}
          <div className="mt-2 text-sm text-black">
            নির্বাচিত রঙ: {product.color?.join(", ") || "কোনো রঙ নির্বাচন করা হয়নি"}
          </div>
        </div>

        {/* Wholesale Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="wholeSellPrice">
            Wholesale Price
          </label>
          <input
            type="text"
            id="wholeSellPrice"
            name="wholeSellPrice"
            placeholder="Wholesale Price"
            onChange={handleChange}
            value={product.wholeSellPrice}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-black"
          />
        </div>

        {/* Sell Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="sellPrice">
            Sell Price
          </label>
          <input
            id="sellPrice"
            type="text"
            name="sellPrice"
            placeholder="Sell Price"
            onChange={handleChange}
            value={product.sellPrice}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-black"
          />
        </div>

        {/* Stock Status */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="stockStatus">
            Stock Status
          </label>
          <select
            id="stockStatus"
            name="stockStatus"
            onChange={handleChange}
            value={product.stockStatus}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
            <option value="up">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Featured Images (multiple) */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="featuredImages">
          Featured Images
        </label>
        <input
          id="featuredImages"
          type="file"
          name="featuredImages"
          onChange={handleChange}
          accept="image/*"
          multiple
          ref={featuredInputRef}
          className="w-full text-gray-700"
        />
        {product.featuredImages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setProduct((prev) => ({ ...prev, featuredImages: [] }));
              if (featuredInputRef.current) featuredInputRef.current.value = null;
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        )}
        {product.featuredImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {featuredPreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Featured Preview ${index + 1}`}
                className="h-32 w-32 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="galleryImages">
          Gallery Images
        </label>
        <input
          id="galleryImages"
          type="file"
          name="galleryImages"
          multiple
          onChange={handleChange}
          accept="image/*"
          ref={galleryInputRef}
          className="w-full text-gray-700"
        />
        {product.galleryImages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setProduct((prev) => ({ ...prev, galleryImages: [] }));
              if (galleryInputRef.current) galleryInputRef.current.value = null;
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        )}
        {product.galleryImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {galleryPreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Gallery Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
        >
          <span className="loading loading-dots loading-xl"></span>
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
        >
          Add Product
        </button>
      )}
    </form>
  );
}
