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
  const [couponMessage, setCouponMessage] = useState(null);
  const [couponApplying, setCouponApplying] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);

  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchPricingConfig();
  }, []);

  const fetchPricingConfig = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/pricingConfig");
      setTax(res.data.taxAmount || 0);
      setShipping(res.data.shippingAmount || 0);
    } catch (err) {
      console.log("Pricing config fetch error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/cart", {
        withCredentials: true,
      });

      const cartData = res.data.cart || { items: [], totalPrice: 0 };
      setCart(cartData);

      const total =
        cartData.totalPrice +
        (res.data.tax ?? 0) +
        (res.data.shipping ?? 0) -
        discount;

      setFinalTotal(total);
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
        "https://raadi.onrender.com/api/v1/cart/update",
        { productId, quantity: newQty },
        { withCredentials: true }
      );

      refreshTotalsAfterChange(res);
    } catch (error) {
      console.log("Update Quantity Error", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete("https://raadi.onrender.com/api/v1/cart/remove", {
        data: { productId },
        withCredentials: true,
      });

      if (!res.data.cart?.items?.length) {
        setCart({ items: [], totalPrice: 0 });
        setFinalTotal(0);
        return;
      }

      fetchCart();
    } catch (err) {
      console.log("Remove Error", err);
    }
  };

  const refreshTotalsAfterChange = (res) => {
    const updatedCart = res.data.cart || { items: [], totalPrice: 0 };

    setCart(updatedCart);

    const total =
      updatedCart.totalPrice +
      (res.data.tax ?? tax) +
      (res.data.shipping ?? shipping) -
      discount;

    setFinalTotal(total);
  };

  // ------------------------
  // APPLY PROMO CODE
  // ------------------------
  const applyPromo = async () => {
    if (!promoCode.trim()) {
      setCouponMessage({ type: "error", text: "Enter a valid promo code" });
      return;
    }

    setCouponApplying(true);
    setCouponMessage(null);

    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/promoCode/apply-promo",
        { code: promoCode },
        { withCredentials: true }
      );

      if (res.data.success) {
        const discountValue = res.data.discount;

        setDiscount(discountValue);

        const newTotal =
          cart.totalPrice + tax + shipping - discountValue;

        setFinalTotal(newTotal);

        setCouponMessage({
          type: "success",
          text: `Coupon Applied Successfully! You saved ₹${discountValue}`,
        });
      }
    } catch (err) {
      let msg = "Unable to apply promo code";

      if (err.response?.data?.message) msg = err.response.data.message;

      setCouponMessage({
        type: "error",
        text: msg,
      });

      setDiscount(0);
    } finally {
      setCouponApplying(false);
    }
  };

  const removePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setCouponMessage(null);

    if (!cart) return;

    const total = cart.totalPrice + tax + shipping;
    setFinalTotal(total);
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading Cart...</div>;

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1b3f] mb-8">
          Shopping Cart
        </h1>

        {!cart || !cart.items?.length ? (
          <p className="text-center text-gray-600 text-xl mt-20">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT — ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-28 h-28 object-contain bg-gray-100 rounded-lg"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#0b1b3f] line-clamp-1">
                        {item.product.name}
                      </h2>

                      <p className="text-gray-600 text-sm">
                        ₹{item.product.price} each
                      </p>

                      <p className="text-lg font-bold mt-1 text-orange-600">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
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

            {/* RIGHT — SUMMARY */}
            <div className="bg-white shadow-lg rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-lg text-gray-500 mt-1">
                <span>Tax:</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-lg text-gray-500 mt-1">
                <span>Shipping:</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-lg text-green-600 mt-2">
                  <span>Discount:</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-2xl font-bold mt-4 border-t pt-3">
                <span>Total:</span>
                <span className="text-orange-600">
                  ₹{finalTotal?.toLocaleString()}
                </span>
              </div>

              {/* PROMO CODE FIELD */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Apply Promo Code</h3>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border rounded-lg px-4 py-2"
                  />

                  <button
                    onClick={applyPromo}
                    disabled={couponApplying}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {couponApplying ? "Applying..." : "Apply"}
                  </button>
                </div>

                {couponMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      couponMessage.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}

                {discount > 0 && (
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
                className="w-full py-3 mt-6 bg-orange-500 text-white rounded-xl text-lg font-bold hover:bg-orange-600 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
