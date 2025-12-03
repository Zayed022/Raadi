// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

function formatCurrency(n) {
  if (!n && n !== 0) return "₹0.00";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

export default function Checkout() {
  const navigate = useNavigate();

  // --- cart data ---
  const [cart, setCart] = useState({ items: [] });

  // --- user / contact info ---
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  // --- shipping address form ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const [useSameForBilling, setUseSameForBilling] = useState(true);

  // --- payment / shipping / coupon ---
  const [shippingOption, setShippingOption] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState("easybuzz");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);

  // --- async + validation state ---
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ==========================
  // Initial fetch: cart + profile
  // ==========================
  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [cartRes, profileRes] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/cart", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/api/v1/users/profile", {
            withCredentials: true,
          }),
        ]);

        if (!mounted) return;

        // cart
        setCart(cartRes.data.cart || { items: [] });

        // profile -> email + first saved address (if any)
        const user = profileRes.data.user;
        if (user?.email) setEmail(user.email);

        if (Array.isArray(user?.addresses) && user.addresses.length > 0) {
          const a = user.addresses[0];
          setFirstName(a.firstName || "");
          setLastName(a.lastName || "");
          setAddress(a.address || "");
          setApartment(a.apartment || "");
          setCity(a.city || "");
          setStateField(a.state || "");
          setPincode(a.pincode || "");
          setPhone(a.phone || "");
        }

        setError(null);
      } catch (err) {
        console.error("Checkout fetch error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Could not load checkout details. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // ==========================
  // Derived totals
  // ==========================
  const subtotal = useMemo(() => {
    return (cart.items || []).reduce(
      (s, it) =>
        s + ((it.product?.price || 0) * (it.quantity || 0)),
      0
    );
  }, [cart]);

  const shippingCharge = shippingOption === "free" ? 0 : 50;
  const discount =
    couponMessage && couponMessage.applied
      ? couponMessage.discountValue || 0
      : 0;

  const total = Math.max(0, subtotal + shippingCharge - discount);

  // ==========================
  // Coupon (simple demo logic)
  // ==========================
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({
        type: "error",
        text: "Enter coupon code",
      });
      return;
    }

    setCouponApplying(true);
    setCouponMessage(null);

    try {
      // Demo: RAADI10 = 10% off
      await new Promise((r) => setTimeout(r, 600));
      if (couponCode.toLowerCase() === "raadi10") {
        const discountValue = Math.round(subtotal * 0.1);
        setCouponMessage({
          type: "success",
          text: `Applied: ${formatCurrency(discountValue)} off`,
          applied: true,
          discountValue,
        });
      } else {
        setCouponMessage({
          type: "error",
          text: "Invalid or expired coupon",
          applied: false,
        });
      }
    } catch (err) {
      console.error("Apply coupon error", err);
      setCouponMessage({
        type: "error",
        text: "Could not apply coupon",
      });
    } finally {
      setCouponApplying(false);
    }
  };

  // ==========================
  // Validation
  // ==========================
  const validateAddress = () => {
    const errors = {};

    if (!firstName.trim()) errors.firstName = "Please enter a valid first name";
    if (!lastName.trim()) errors.lastName = "Please enter a valid last name";
    if (!address.trim()) errors.address = "Please enter a valid address";
    if (!city.trim()) errors.city = "Please enter a valid city";
    if (!stateField.trim()) errors.state = "Please enter a valid state";
    if (!pincode.trim()) errors.pincode = "Please enter a valid PIN code";
    if (!phone.trim()) errors.phone = "Please enter a valid phone";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================
  // Place order: save address in user profile first
  // ==========================
  const handlePlaceOrder = async () => {
    setError(null);

    if (!validateAddress()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const addressPayload = {
      firstName,
      lastName,
      address,
      apartment,
      city,
      state: stateField,
      pincode,
      phone,
      type: "home",
    };

    setPlacingOrder(true);
    try {
      // 1) Save / overwrite address in user profile
      await axios.put(
        "http://localhost:8000/api/v1/users/profile",
        { addresses: [addressPayload] },
        { withCredentials: true }
      );

      // 2) Create order with shippingAddress
      const body = {
        shippingAddress: addressPayload,
        paymentMethod,
        shippingOption,
        coupon: couponMessage?.applied ? couponCode : null,
      };

      const res = await axios.post(
        "http://localhost:8000/api/v1/order/create",
        body,
        { withCredentials: true }
      );

      if (res.data.success) {
        const orderId =
          res.data.order?._id || res.data.orderId || "success";
        navigate(`/order/${orderId}`);
      } else {
        setError(res.data.message || "Could not create order.");
      }
    } catch (err) {
      console.error("Place order error", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================
  // Loading
  // ==========================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">
          Loading checkout…
        </div>
      </div>
    );
  }

  // ==========================
  // UI
  // ==========================
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 md:py-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b1b3f]">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT: Main content */}
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Contact information */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-[#0b1b3f] mb-2">
                Contact information
              </h2>
              <p className="text-sm md:text-base text-gray-500 mb-4">
                We'll use this email to send you details and updates
                about your order.
              </p>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-gray-200 rounded-md p-3 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />

              <div className="flex items-center gap-3 mt-3">
                <input
                  id="subscribe"
                  type="checkbox"
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
                <label
                  htmlFor="subscribe"
                  className="text-xs md:text-sm text-gray-600"
                >
                  Subscribe to our newsletter (optional)
                </label>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                You are currently checking out as a guest.
              </p>
            </div>

            {/* Shipping address form */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-[#0b1b3f] mb-2">
                Shipping address
              </h2>
              <p className="text-sm md:text-base text-gray-500 mb-4">
                Enter the address where you want your order delivered.
              </p>

              {/* Country – fixed India for now */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Country/Region
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-3 text-sm bg-gray-50"
                  defaultValue="India"
                  disabled
                >
                  <option value="India">India</option>
                </select>
              </div>

              {/* First / Last name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.firstName
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.lastName
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                    fieldErrors.address
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-orange-200"
                  }`}
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* Apartment (optional) */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* City / State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.city
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    value={stateField}
                    onChange={(e) => setStateField(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.state
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.state && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Pincode / Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.pincode
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.pincode && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.pincode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                      fieldErrors.phone
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-300 focus:ring-orange-200"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Same for billing */}
              <div className="mb-4">
                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={useSameForBilling}
                    onChange={(e) =>
                      setUseSameForBilling(e.target.checked)
                    }
                  />
                  <span className="text-xs md:text-sm text-gray-700">
                    Use same address for billing
                  </span>
                </label>
              </div>
            </div>

            {/* Shipping options */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-[#0b1b3f] mb-3">
                Shipping options
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border bg-white cursor-pointer ${
                    shippingOption === "free"
                      ? "border-orange-300 ring-1 ring-orange-200"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm md:text-base">
                      Free shipping
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Estimated 5–7 days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs md:text-sm font-semibold">
                      FREE
                    </div>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingOption === "free"}
                      onChange={() => setShippingOption("free")}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Payment options */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-[#0b1b3f] mb-3">
                Payment options
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border bg-white cursor-pointer ${
                    paymentMethod === "easybuzz"
                      ? "border-orange-300 ring-1 ring-orange-200"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "easybuzz"}
                    onChange={() => setPaymentMethod("easybuzz")}
                  />
                  <div>
                    <div className="font-semibold text-sm md:text-base">
                      Easybuzz payments
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Secure online payment powered by Easybuzz
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border bg-white cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-orange-300 ring-1 ring-orange-200"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div>
                    <div className="font-semibold text-sm md:text-base">
                      Cash on delivery
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Pay with cash when you receive the order
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Note + footer actions */}
            <div className="mb-8">
              <label className="inline-flex items-center gap-3">
                <input type="checkbox" />
                <span className="text-xs md:text-sm text-gray-600">
                  Add a note to your order
                </span>
              </label>
            </div>

            <div className="border-t pt-6">
              <p className="text-xs md:text-sm text-gray-500">
                By proceeding with your purchase you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-orange-600 underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-orange-600 underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link
                  to="/cart"
                  className="text-orange-600 inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <FiChevronRight className="rotate-180" /> Return to
                  Cart
                </Link>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full md:w-auto py-3 px-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-400 text-white font-semibold shadow hover:from-orange-600 hover:to-orange-500 transition disabled:opacity-70"
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-sm text-red-600">{error}</div>
              )}
            </div>
          </section>

          {/* RIGHT: Order summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 shadow-sm w-full min-w-[280px]">
              <h3 className="text-base md:text-lg font-bold text-[#0b1b3f] mb-4">
                Order summary
              </h3>

              {/* Items */}
              <div className="space-y-4">
                {(cart.items || []).map((it) => (
                  <div
                    key={it.product?._id}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={it.product?.images?.[0]}
                        alt={it.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {it.product?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {it.quantity} ×{" "}
                        {formatCurrency(it.product?.price)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(
                        (it.product?.price || 0) *
                          (it.quantity || 0)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-5 border-t pt-4">
                <button
                  onClick={() => {
                    const el =
                      document.getElementById("coupon-collapse");
                    if (el) el.classList.toggle("hidden");
                  }}
                  className="w-full flex items-center justify-between text-xs md:text-sm font-medium text-gray-700"
                >
                  <span>Add coupons</span>
                  <FiChevronDown />
                </button>

                <div id="coupon-collapse" className="hidden mt-3">
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value)
                      }
                      className="flex-1 border p-2 rounded-md text-xs md:text-sm"
                      placeholder="Coupon code"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplying}
                      className="px-3 py-2 bg-orange-500 text-white rounded-md text-xs md:text-sm"
                    >
                      {couponApplying ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {couponMessage && (
                    <div
                      className={`mt-2 text-xs md:text-sm ${
                        couponMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {couponMessage.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-3 text-sm md:text-base">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCharge === 0
                      ? "FREE"
                      : formatCurrency(shippingCharge)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-base md:text-lg font-bold">
                    Total
                  </span>
                  <span className="text-lg md:text-xl font-extrabold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
