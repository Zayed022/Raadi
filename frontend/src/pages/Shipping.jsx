import Footer from "../components/Footer";

export default function ShippingPolicy() {
  return (
    <>
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-orange-500 mb-6">Shipping & Delivery</h1>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Delivery Charges</h2>
      <p>
        Delivery charges vary by seller. Orders above ₹500 are delivered free, 
        while orders below ₹500 may include a ₹40 shipping fee.
      </p>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Delivery Timeline</h2>
      <p>
        Delivery estimates depend on:
      </p>
      <ul className="list-disc ml-6">
        <li>Product availability</li>
        <li>Seller location</li>
        <li>Holidays and weekends</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Serviceability</h2>
      <p>
        Enter your pincode on product page to check delivery availability.
      </p>

      <h2 className="text-2xl font-semibold mt-4 mb-2">COD Availability</h2>
      <p>
        COD depends on courier partner limits and your location.
      </p>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Return Pickup</h2>
      <p>
        Contact support to arrange a return pickup. If unavailable, you may use
        a third-party courier.
      </p>

      <h2 className="text-2xl font-semibold mt-4 mb-2">Stock Status Explained</h2>
      <ul className="list-disc ml-6">
        <li><b>In Stock:</b> Ready to ship.</li>
        <li><b>Preorder:</b> Ships on launch day.</li>
        <li><b>Imported:</b> Takes 10+ days.</li>
        <li><b>Temporarily Unavailable:</b> Check back later.</li>
        <li><b>Permanently Discontinued:</b> No longer available.</li>
      </ul>
    </div>
    <Footer/>
    </>
  );
}
