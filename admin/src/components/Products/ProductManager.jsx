import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

const API = "https://raadi.onrender.com/api/v1";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [editData, setEditData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`, {
        params: { page, limit: 12, search, category: categoryFilter },
      });

      if (res.data.success) {
        setProducts(res.data.products);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/category`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryFilter]);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      const res = await axios.delete(`${API}/products/${id}`);
      if (res.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // Open Edit modal
  const openEditModal = (product) => {
    setEditData(product);
    setEditModalOpen(true);
  };

  // Handle Edit Submit
  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`${API}/products/${editData._id}`, editData);
      if (res.data.success) {
        toast.success("Product updated");
        setEditModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6 flex-wrap">

        {/* Search */}
        <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="outline-none"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Category Filter */}
        <select
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border px-4 py-2 rounded-lg shadow-sm bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Flags</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">

                {/* IMAGE */}
                <td className="p-3">
                  <img
                    src={p.images?.[0]}
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                </td>

                {/* NAME */}
                <td className="p-3 font-medium">{p.name}</td>

                {/* PRICE */}
                <td className="p-3">₹{p.price}</td>

                {/* STOCK */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      p.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>

                {/* CATEGORY */}
                <td className="p-3">{p.categoryName || p.category}</td>

                {/* FLAGS */}
                <td className="p-3 space-x-2 text-sm">
                  {p.isTopProduct && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      Top
                    </span>
                  )}
                  {p.isFeatureProduct && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded">
                      Feature
                    </span>
                  )}
                  {p.isBestSeller && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded">
                      Best
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openEditModal(p)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit size={20} />
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-3">
          {[...Array(pages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === num + 1
                  ? "bg-orange-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <form onSubmit={updateProduct} className="space-y-4">

              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className="border p-2 rounded w-full"
                placeholder="Price"
              />

              <input
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({ ...editData, stock: e.target.value })
                }
                className="border p-2 rounded w-full"
                placeholder="Stock"
              />

              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="border p-2 rounded w-full h-24"
              />

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Product
              </button>

              <button
                onClick={() => setEditModalOpen(false)}
                type="button"
                className="w-full mt-2 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
