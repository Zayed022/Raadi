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
      const res = await axios.get(
        "https://raadi-jdun.onrender.com/api/v1/pricingConfig"
      );
      setTax(res.data.taxAmount || 0);
      setShipping(res.data.shippingAmount || 0);
    } catch {}
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://raadi-jdun.onrender.com/api/v1/cart",
        { withCredentials: true }
      );

      const cartData = res.data.cart || { items: [], totalPrice: 0 };
      setCart(cartData);

      const total =
        cartData.totalPrice + tax + shipping - discount;

      setFinalTotal(total);
    } catch {}
    setLoading(false);
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) return removeItem(productId);

    const res = await axios.put(
      "https://raadi-jdun.onrender.com/api/v1/cart/update",
      { productId, quantity: newQty },
      { withCredentials: true }
    );

    const updatedCart = res.data.cart;
    setCart(updatedCart);

    const total =
      updatedCart.totalPrice + tax + shipping - discount;

    setFinalTotal(total);
  };

  const removeItem = async (productId) => {
    await axios.delete(
      "https://raadi-jdun.onrender.com/api/v1/cart/remove",
      {
        data: { productId },
        withCredentials: true,
      }
    );

    fetchCart();
  };

  const applyPromo = async () => {
    if (!promoCode.trim()) {
      setCouponMessage({ type: "error", text: "Enter valid promo code" });
      return;
    }

    setCouponApplying(true);

    try {
      const res = await axios.post(
        "https://raadi-jdun.onrender.com/api/v1/promoCode/apply-promo",
        { code: promoCode },
        { withCredentials: true }
      );

      const discountValue = res.data.discount;
      setDiscount(discountValue);

      const newTotal =
        cart.totalPrice + tax + shipping - discountValue;

      setFinalTotal(newTotal);

      setCouponMessage({
        type: "success",
        text: `Saved ₹${discountValue} successfully!`,
      });
    } catch (err) {
      setCouponMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid promo code",
      });
      setDiscount(0);
    }

    setCouponApplying(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading your cart...
      </div>
    );

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            Shopping Cart
          </h1>

          {!cart?.items?.length ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm text-center">
              <p className="text-gray-500 text-lg">
                Your cart is empty.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
                  >
                    <div className="flex gap-6">
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-32 h-32 rounded-xl bg-gray-100 object-contain"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-semibold text-lg text-gray-900">
                            {item.product.name}
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            ₹{item.product.price} each
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          {/* Quantity */}
                          <div className="flex items-center border rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            >
                              –
                            </button>
                            <span className="px-6 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-6">
                            <span className="font-bold text-lg text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>

                            <button
                              onClick={() =>
                                removeItem(item.product._id)
                              }
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE */}
              <div className="bg-white rounded-3xl shadow-md p-8 h-fit sticky top-28">
                <h2 className="text-2xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cart.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ₹{finalTotal?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* PROMO */}
                <div className="mt-8">
                  <h3 className="font-medium mb-3">
                    Promo Code
                  </h3>

                  <div className="flex gap-3">
                    <input
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value)
                      }
                      placeholder="Enter code"
                      className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
                    />

                    <button
                      onClick={applyPromo}
                      disabled={couponApplying}
                      className="bg-gray-900 text-white px-5 rounded-xl hover:bg-black transition"
                    >
                      {couponApplying ? "..." : "Apply"}
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
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-lg font-semibold transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}