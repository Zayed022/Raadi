import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);
  const [appliedCode, setAppliedCode] = useState("");

  // pricing config fields
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchPricingConfig();
  }, []);

  const fetchPricingConfig = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/pricingConfig");
      setTax(res.data.taxAmount || 0);
      setShipping(res.data.shippingAmount || 0);
    } catch (err) {
      console.log("Pricing config fetch error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart", {
        withCredentials: true,
      });

      setCart(res.data.cart || { items: [] });

      setFinalTotal(
        res.data.finalTotal ??
          (res.data.cart?.totalPrice || 0) + (res.data.tax || 0) + (res.data.shipping || 0)
      );

      setTax(res.data.tax);
      setShipping(res.data.shipping);

      setLoading(false);
    } catch (error) {
      console.log("Fetch cart error", error);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    try {
      if (newQty <= 0) return removeItem(productId);

      const res = await axios.put(
        "http://localhost:8000/api/v1/cart/update",
        { productId, quantity: newQty },
        { withCredentials: true }
      );

      updateTotals(res);
    } catch (error) {
      console.log("Update Quantity Error", error);
    }
  };

const removeItem = async (productId) => {
  try {
    const res = await axios.delete("http://localhost:8000/api/v1/cart/remove", {
      data: { productId },
      withCredentials: true,
    });

    if (!res.data.cart || !res.data.cart.items?.length) {
      setCart({ items: [], totalPrice: 0 });
      setFinalTotal(0);
      return;
    }

    // Refetch fresh populated cart to avoid missing product details
    fetchCart();

  } catch (err) {
    console.log("Remove Error", err);
  }
};





const updateTotals = (res) => {
  const updatedCart = res.data.cart || { items: [], totalPrice: 0 };

  setCart(updatedCart);
  setTax(res.data.tax ?? 0);
  setShipping(res.data.shipping ?? 0);

  const calculatedFinal =
    (res.data.finalTotal ?? updatedCart.totalPrice) - discount + (res.data.tax ?? 0) + (res.data.shipping ?? 0);

  setFinalTotal(calculatedFinal);
};



  const applyPromo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/apply-promo",
        { code: promoCode },
        { withCredentials: true }
      );

      if (res.data.success) {
        setDiscount(res.data.discount);
        setFinalTotal(res.data.finalTotal);
        setAppliedCode(promoCode);
      }
    } catch (err) {
      console.log("Promo Error:", err);
    }
  };
  

  const removePromo = () => {
    setAppliedCode("");
    setPromoCode("");
    setDiscount(0);
    fetchCart();
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading Cart...</div>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#0b1b3f] mb-8">Shopping Cart</h1>

      {!cart || !cart.items || cart.items.length === 0 ? 
 (
        <p className="text-center text-gray-600 text-xl mt-20">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT - Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
  <div
    key={item?.product?._id || Math.random()}
    className="flex bg-white rounded-2xl shadow-md overflow-hidden p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <img
      src={item?.product?.images?.[0] || "/placeholder.png"}
      alt={item?.product?.name || "Product"}
      className="w-32 h-32 object-cover rounded-xl"
    />

    <div className="flex-1 ml-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#0b1b3f]">{item?.product?.name}</h2>
        <p className="text-gray-600 text-sm">₹{item?.product?.price} each</p>
        <p className="text-lg font-bold mt-1 text-orange-600">₹{item?.price?.toLocaleString()}</p>
      </div>


                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                    >
                      –
                    </button>

                    <span className="text-lg font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-xl"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT - Price Summary */}
          <div className="bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>₹{cart.totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-lg text-gray-500 mt-2">
              <span>Estimated Tax:</span>
              <span>₹{tax?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-lg text-gray-500 mt-1">
              <span>Estimated Shipping:</span>
              <span>₹{shipping?.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-lg mt-1 text-green-600">
                <span>Discount ({appliedCode.toUpperCase()}):</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold mt-4 border-t pt-3">
              <span>Total:</span>
              <span className="text-orange-600">₹{finalTotal?.toLocaleString()}</span>
            </div>

            {/* PROMO Code */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Apply Promo Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo"
                  className="flex-1 border rounded-lg px-4 py-2"
                />
                <button
                  onClick={applyPromo}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>

              {appliedCode && (
                <button
                  onClick={removePromo}
                  className="mt-2 text-red-500 underline text-sm hover:text-red-700"
                >
                  Remove Promo
                </button>
              )}
            </div>

            <button
      onClick={() => navigate("/checkout")}
      className="w-full py-3 mt-5 bg-orange-500 text-white rounded-xl text-lg font-bold hover:bg-orange-600 transition-all"
    >
      Checkout
    </button>
          </div>
        </div>
      )}
    </section>
  );
}
