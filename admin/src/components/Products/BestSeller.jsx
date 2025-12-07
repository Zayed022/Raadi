import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBestSellers() {
  const API = "https://raadi.onrender.com/api/v1/bestSeller";

  const [bestSellers, setBestSellers] = useState([]);
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all best sellers
  const fetchBestSellers = async () => {
    try {
      const res = await axios.get(API);
      setBestSellers(res.data.bestSellers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  // Add new best seller
  const handleAdd = async () => {
    if (!productId) return alert("Product ID is required");

    try {
      setLoading(true);
      await axios.post(API, { product: productId });
      alert("Added Successfully!");
      setProductId("");
      fetchBestSellers();
    } catch (err) {
      console.error(err);
      alert("Error adding best seller");
    } finally {
      setLoading(false);
    }
  };

  // Delete best seller
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this best seller?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchBestSellers();
    } catch (err) {
      console.error(err);
    }
  };

  // Update active / position
  const handleUpdate = async (id, field, value) => {
    try {
      await axios.put(`${API}/${id}`, { [field]: value });
      fetchBestSellers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        Manage Best Sellers
      </h1>

      {/* ADD SECTION */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Add Best Seller</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Product ID</label>
            <input
              type="text"
              className="w-full border py-2 px-3 rounded-lg mt-1"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Adding..." : "Add Best Seller"}
            </button>
          </div>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Best Seller List</h2>

        {bestSellers.length === 0 ? (
          <p className="text-gray-500 italic">No best sellers added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bestSellers.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={item.product?.images?.[0]}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg shadow"
                      />
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {item.product?.name}
                    </td>

                    {/* Position Input */}
                    <td className="p-3">
                      <input
                        type="number"
                        value={item.position}
                        onChange={(e) =>
                          handleUpdate(item._id, "position", Number(e.target.value))
                        }
                        className="w-20 border px-2 py-1 rounded-lg"
                      />
                    </td>

                    {/* Active Toggle */}
                    <td className="p-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            handleUpdate(item._id, "isActive", e.target.checked)
                          }
                          className="w-5 h-5"
                        />
                        <span className="ml-2 text-gray-700">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
