import { useEffect, useState } from "react";

import axios from "axios";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductsTable";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [products, setProducts] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      //setLoading(true);
      const res = await axios.get("https://productmanageserver.vercel.app/products");
      setProducts(res.data);
      // setError("");
    } catch (err) {
      console.error(err);
      //setError("Failed to fetch products");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  // add product
  const addProduct = async (product) => {
    try {
      setLoading(true);
      const res = await axios.post("https://productmanageserver.vercel.app/add/products", product);
      setProducts([...products, res.data]);
      console.log(res);
      fetchProducts();
      if (res.status == "201") {
        setShowFormModal(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setShowFormModal(false);
      setLoading(false);
    }
  };
  // delete product
  const deleteProduct = async (index) => {
    const productToDelete = products[index];
    console.log(productToDelete._id, "delete index");
    try {
      await axios.delete(`https://productmanageserver.vercel.app/products/${productToDelete._id}`);
      setProducts(products.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };
  // edit product

  const editProduct = async (index, updatedProduct) => {
    try {
      const id = products[index]._id;

      // Make a copy and remove _id
      const { _id, ...productWithoutId } = updatedProduct;

      await axios.put(`https://productmanageserver.vercel.app/products/${id}`, productWithoutId);

      // Refetch all products after update
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true; // show all if search is empty

    const productName = product.productName?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const variantOrModel = product.variantOrModel?.toLowerCase() || "";

    const combinedText = `${productName} ${category} ${description} ${variantOrModel} `;

    // Split the search query by spaces into individual words
    const queryWords = query.split(/\s+/);

    // Check if every word in the query is included in combinedText
    return queryWords.every((word) => combinedText.includes(word));
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            {/* <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul> */}
          </div>
          <a className="btn btn-ghost text-xl">Ohoroho Gallery</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          {/* <ul className="menu menu-horizontal px-1">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul> */}
        </div>
        <div className="navbar-end">
          <div className="flex justify-center md:justify-start mb-4">
            <button
              onClick={() => setShowFormModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 container  mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
            Product Management
          </h1>
          <div className=" w-full max-w-md border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Modal */}
        {showFormModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-4"
            onClick={() => setShowFormModal(false)}
          >
            <div
              className="relative bg-white w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowFormModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold z-10"
              >
                &times;
              </button>

              <h3 className="text-lg font-bold mb-4 text-center sm:text-left">Add Product</h3>
              <ProductForm
                loading={loading}
                onAdd={addProduct}
                onCancel={() => setShowFormModal(false)}
                products={filteredProducts}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <ProductTable products={filteredProducts} onDelete={deleteProduct} onEdit={editProduct} />
        </div>
      </div>
    </>
  );
}

export default App;
