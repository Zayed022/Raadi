import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);
  const [appliedCode, setAppliedCode] = useState("");

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
      (res.data.finalTotal ?? updatedCart.totalPrice) -
      discount +
      (res.data.tax ?? 0) +
      (res.data.shipping ?? 0);

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
    <>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1b3f] mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <p className="text-center text-gray-600 text-xl mt-20">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cart.items.map((item) => (
              <div
                key={item?.product?._id}
                className="flex gap-4 bg-white rounded-xl shadow p-3 sm:p-4 
                hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={item?.product?.images?.[0]}
                  alt={item?.product?.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg bg-gray-100"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[#0b1b3f] line-clamp-1">
                      {item?.product?.name}
                    </h2>

                    <p className="text-gray-600 text-sm">
                      ₹{item?.product?.price} each
                    </p>

                    <p className="text-lg font-bold mt-1 text-orange-600">
                      ₹{item?.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-2">
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

          {/* RIGHT — Summary */}
          <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>₹{cart.totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-lg text-gray-500 mt-1">
              <span>Tax:</span>
              <span>₹{tax?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-lg text-gray-500 mt-1">
              <span>Shipping:</span>
              <span>₹{shipping?.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-lg text-green-600 mt-2">
                <span>Discount ({appliedCode.toUpperCase()}):</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold mt-4 border-t pt-3">
              <span>Total:</span>
              <span className="text-orange-600">₹{finalTotal?.toLocaleString()}</span>
            </div>

            {/* Promo Code */}
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
              className="w-full py-3 mt-6 bg-orange-500 text-white rounded-xl 
              text-lg font-bold hover:bg-orange-600 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
    <Footer/>
    </>
  );
}
