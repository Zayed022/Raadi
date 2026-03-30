import { useCart } from "../context/CartContext";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const tax = 0;       // you can keep fixed or dynamic later
  const shipping = 0;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const finalTotal = subtotal + tax + shipping;

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">
            Shopping Cart
          </h1>

          {/* EMPTY */}
          {!cart.length ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm text-center">
              <p className="text-gray-500 text-lg">
                Your cart is empty.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl p-6 shadow border"
                  >
                    <div className="flex gap-6">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-32 h-32 object-contain bg-gray-100 rounded-xl"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-semibold text-lg">
                            {item.name}
                          </h2>
                          <p className="text-gray-500">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex justify-between mt-6 items-center">
                          
                          {/* Quantity */}
                          <div className="flex border rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="px-4 py-2 bg-gray-100"
                            >
                              –
                            </button>

                            <span className="px-6">{item.quantity}</span>

                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="px-4 py-2 bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Price + Remove */}
                          <div className="flex items-center gap-6">
                            <span className="font-bold text-lg">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>

                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-red-500"
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

              {/* RIGHT */}
              <div className="bg-white p-8 rounded-3xl shadow-md h-fit">
                <h2 className="text-2xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-8 py-4 bg-orange-500 text-white rounded-2xl"
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