import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

const API = "https://raadi.onrender.com/api/v1";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [editData, setEditData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products`, {
        params: { page, limit: 10, search },
      });

      if (res.data.success) {
        setProducts(res.data.products);
        setPages(res.data.pages);
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  /* ================= DELETE ================= */

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product permanently?")) return;

    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= TOGGLES ================= */

  const toggleFlag = async (id, type) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      await axios.patch(`${API}/products/${id}/${type}`);
      toast.success("Updated successfully");
      fetchProducts();
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= UPDATE ================= */

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      await axios.put(`${API}/products/${editData._id}`, editData);

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        await axios.put(
          `${API}/products/${editData._id}/update-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Product updated");
      setEditModalOpen(false);
      setImageFile(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* SEARCH */}
      <div className="mb-6 flex items-center bg-white px-4 py-3 rounded-lg shadow">
        <FiSearch className="mr-3 text-gray-400" />
        <input
          placeholder="Search products..."
          className="outline-none w-full"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-4">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name || p.category}</td>

                  {/* FLAGS COLUMN */}
                  <td className="space-y-1">
                    <div>
                      <button
                        onClick={() =>
                          toggleFlag(p._id, "toggle-top")
                        }
                        className={`px-2 py-1 rounded text-xs ${
                          p.isTopProduct
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        Top
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          toggleFlag(p._id, "toggle-featured")
                        }
                        className={`px-2 py-1 rounded text-xs ${
                          p.isFeatureProduct
                            ? "bg-purple-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        Featured
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() =>
                          toggleFlag(p._id, "toggle-bestseller")
                        }
                        className={`px-2 py-1 rounded text-xs ${
                          p.isBestSeller
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        Best Seller
                      </button>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="space-x-2">
                    <button
                      onClick={() => {
                        setEditData(p);
                        setEditModalOpen(true);
                      }}
                      className="text-blue-600"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center gap-2">
        {[...Array(pages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n + 1)}
            className={`px-3 py-1 rounded ${
              page === n + 1
                ? "bg-orange-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {n + 1}
          </button>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-lg font-bold mb-4">
              Edit Product
            </h2>

            <form onSubmit={updateProduct} className="space-y-3">
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({ ...editData, stock: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />

              <button className="w-full bg-orange-500 text-white py-2 rounded">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}