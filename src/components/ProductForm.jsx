import { useState, useRef } from "react";
import { uploadToImageBB } from "../utils/imageBBUploader";

export default function ProductForm({ onAdd }) {
  const [product, setProduct] = useState({
    productName: "",
    category: "",
    description: "",
    variantOrModel: "",
    size: "",
    color: "",
    wholeSellPrice: "",
    sellPrice: "",
    featuredImages: [], // multiple featured images now
    galleryImages: [],
    stockStatus: "in",
  });

  // Refs for file inputs
  const featuredInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "featuredImages") {
      setProduct({ ...product, featuredImages: Array.from(files) });
    } else if (name === "galleryImages") {
      setProduct({ ...product, galleryImages: Array.from(files) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload all featured images and gallery images
    const featuredImageUrls = await Promise.all(
      product.featuredImages.map((file) => uploadToImageBB(file))
    );
    const galleryUrls = await Promise.all(
      product.galleryImages.map((file) => uploadToImageBB(file))
    );

    const finalProduct = {
      ...product,
      featuredImages: featuredImageUrls,
      galleryImages: galleryUrls,
    };

    onAdd(finalProduct);

    // Reset form state
    setProduct({
      productName: "",
      category: "",
      description: "",
      variantOrModel: "",
      size: "",
      color: "",
      wholeSellPrice: "",
      sellPrice: "",
      featuredImages: [],
      galleryImages: [],
      stockStatus: "in",
    });

    // Reset file inputs via refs
    if (featuredInputRef.current) featuredInputRef.current.value = null;
    if (galleryInputRef.current) galleryInputRef.current.value = null;
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
        </div>

        {/* Variant/Model */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="variantOrModel">
            ভ্যারিয়েন্ট/মডেল
          </label>
          <input
            id="variantOrModel"
            name="variantOrModel"
            placeholder="ভ্যারিয়েন্ট/মডেল"
            onChange={handleChange}
            value={product.variantOrModel}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="size">
            মাপ
          </label>
          <input
            id="size"
            name="size"
            placeholder="মাপ"
            onChange={handleChange}
            value={product.size}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="color">
            রঙ
          </label>
          <input
            id="color"
            name="color"
            placeholder="রঙ"
            onChange={handleChange}
            value={product.color}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Wholesale Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="wholeSellPrice">
            Wholesale Price
          </label>
          <input
            id="wholeSellPrice"
            name="wholeSellPrice"
            placeholder="Wholesale Price"
            onChange={handleChange}
            value={product.wholeSellPrice}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sell Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="sellPrice">
            Sell Price
          </label>
          <input
            id="sellPrice"
            name="sellPrice"
            placeholder="Sell Price"
            onChange={handleChange}
            value={product.sellPrice}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stock Status */}
        <div>
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
            <option value="preorder">Preorder</option>
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
            {product.featuredImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Featured Preview ${idx + 1}`}
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
            {product.galleryImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Gallery Preview ${idx + 1}`}
                className="h-24 w-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
      >
        Add Product
      </button>
    </form>
  );
}
