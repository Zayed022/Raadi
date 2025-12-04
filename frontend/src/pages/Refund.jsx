import Footer from "../components/Footer";

export default function RefundPolicy() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-extrabold text-[#0b1b3f] mb-6">
        Refund, Return & Exchange Policy
      </h1>

      <p className="mb-4">
        At <span className="font-semibold">RAADI</span>, we strive to offer superior-quality
        products. However, we understand that rare circumstances such as transit damage,
        manufacturing defects, or order mismatches may occur. In such cases, we gladly offer
        **refunds or exchanges within 7 days of delivery**.
      </p>

      <p className="mb-6">
        You may also choose to return the product even if you are simply unhappy with the purchase.
        In such cases, we will refund the product amount (excluding COD charges & return shipping).
      </p>

      {/* SECTION 1 */}
      <h2 className="text-2xl font-bold mt-10 mb-3">Eligibility for Refund / Exchange</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>The request must be placed within <strong>7 days of delivery</strong>.</li>
        <li>Product must be returned in its <strong>original box, packaging and invoice</strong>.</li>
        <li>
          Items must be <strong>unused, undamaged, unscratched, and untampered</strong>.
        </li>
        <li>
          Products that are resized, altered, used or damaged by the customer are not eligible.
        </li>
        <li>
          In case of ring size replacement, we will ship the new size — <strong>one-way shipping
          cost must be paid by the customer</strong>.
        </li>
      </ul>

      {/* SECTION 2 */}
      <h2 className="text-2xl font-bold mt-10 mb-3">Non-Refundable Conditions</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          If the product shows signs of use, mishandling, or tampering after delivery.
        </li>
        <li>
          If original packaging, invoice, or product box is missing.
        </li>
        <li>
          COD charges (if applicable) are <strong>not refunded</strong>.
        </li>
        <li>
          Return shipping charges are non-refundable.
        </li>
      </ul>

      {/* SECTION 3 */}
      <h2 className="text-2xl font-bold mt-10 mb-3">Refund / Exchange Process</h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>
          Drop us an email at{" "}
          <a href="mailto:raadi10008@gmail.com" className="text-orange-600 font-semibold">
            raadi10008@gmail.com
          </a>{" "}
          or call{" "}
          <a href="tel:+918422996280" className="text-orange-600 font-semibold">
            +91 84229 96280
          </a>{" "}
          between <strong>9:30 AM – 6:30 PM</strong>.
        </li>
        <li>Expect a response from our support team within 1–2 working days.</li>
        <li>
          Pack the product securely in its original box with proper protective packaging
          (bubble wrap advised).
        </li>
        <li>
          Courier the product to the return address (given below). After inspection and quality
          check, the refund/exchange will be processed.
        </li>
      </ol>

      <p className="mt-4 italic text-sm text-gray-600">
        Note: Refund will only be issued after we receive and inspect the returned item. If the
        product is found used, damaged or tampered with, no refund will be issued and the product
        will be sent back at the customer’s expense.
      </p>

      {/* SECTION 4 */}
      <h2 className="text-2xl font-bold mt-10 mb-3">Example of Refund Calculation</h2>
      <p className="mb-4">
        If a customer purchased a product worth ₹1500 + ₹50 COD charges (total ₹1550) and requests a
        refund:
      </p>

      <ul className="list-disc pl-6 space-y-2">
        <li>Refund amount = <strong>₹1500 only</strong>.</li>
        <li>COD charges (₹50) are <strong>non-refundable</strong>.</li>
      </ul>

      {/* SECTION 5 */}
      <h2 className="text-2xl font-bold mt-10 mb-3">Return / Exchange Shipping Address</h2>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">India</h3>
          <p className="text-gray-700">
            The Ambience Court, Vashi 19D,<br />
            Groma Marg, Navi Mumbai, 400703
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Dubai</h3>
          <p className="text-gray-700">
            AI Kalbayani Building,<br />
            Deira – Dubai, UAE
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">South Africa</h3>
          <p className="text-gray-700">
            Branch Office – South Africa
          </p>
        </div>

        <p className="mt-4 font-semibold">
          Contact No:{" "}
          <a href="tel:+918422996280" className="text-orange-600">
            +91 84229 96280
          </a>
        </p>
      </div>

      {/* END SECTION */}
      <p className="mt-10 text-sm text-gray-500">
        For any concerns or assistance, please feel free to reach out — your satisfaction is our
        priority.
      </p>
    </div>
    <Footer/>
    </>
  );
}
