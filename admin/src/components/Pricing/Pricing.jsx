import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPricingConfig() {
  const [config, setConfig] = useState({
    deliveryCharge: "",
    minOrderValue: "",
    freeDeliveryAbove: "",
    taxPercentage: "",
    codCharge: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://raadi.onrender.com/api/v1/pricing/");
      if (res.data.config) {
        setConfig(res.data.config);
      }
    } catch (err) {
      console.error("Fetch Pricing Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/pricing/update",
        config
      );

      setMessage("Pricing settings updated successfully ✔");
      fetchConfig();
    } catch (err) {
      console.error("Pricing Update Error:", err);
      setMessage("Error updating pricing configuration ❌");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        💰 Pricing Configuration
      </h1>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading settings…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* DELIVERY CHARGE */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Delivery Charge (₹)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded-lg"
                  value={config.deliveryCharge || ""}
                  onChange={(e) =>
                    setConfig({ ...config, deliveryCharge: e.target.value })
                  }
                />
              </div>

              {/* MIN ORDER VALUE */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded-lg"
                  value={config.minOrderValue || ""}
                  onChange={(e) =>
                    setConfig({ ...config, minOrderValue: e.target.value })
                  }
                />
              </div>

              {/* FREE DELIVERY ABOVE */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Free Delivery Above (₹)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded-lg"
                  value={config.freeDeliveryAbove || ""}
                  onChange={(e) =>
                    setConfig({ ...config, freeDeliveryAbove: e.target.value })
                  }
                />
              </div>

              {/* TAX PERCENTAGE */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Tax Percentage (%)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded-lg"
                  value={config.taxPercentage || ""}
                  onChange={(e) =>
                    setConfig({ ...config, taxPercentage: e.target.value })
                  }
                />
              </div>

              {/* COD CHARGE */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  COD Charge (₹)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 border rounded-lg"
                  value={config.codCharge || ""}
                  onChange={(e) =>
                    setConfig({ ...config, codCharge: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>

            {/* Message */}
            {message && (
              <p className="mt-4 text-center font-medium text-green-600">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
