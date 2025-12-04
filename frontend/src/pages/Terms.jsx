import Footer from "../components/Footer";

// src/pages/Terms.jsx
export default function Terms() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-12 leading-relaxed text-gray-800">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-[#0b1b3f] mb-6">
        Terms & Conditions
      </h1>

      <p className="text-gray-600 mb-6">
        Please read the following terms and conditions carefully. By subscribing to
        or using any of our services, you agree that you have read, understood,
        and are bound by these Terms. If you do not wish to be bound, you must not
        use our services.
      </p>

      {/* SECTION 1 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">1. Introduction</h2>
      <p>
        a) <b>SIraj Enterprises</b> is an e-commerce portal developed to sell
        Diffusers, Fragrances & Spray products under the brand name SIraj
        Enterprises.
      </p>
      <p className="mt-2">
        b) Your use of this website implies acceptance of these Terms & Conditions.
        We reserve the right to decline registration or deny service without
        providing any reason.
      </p>

      {/* SECTION 2 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">
        2. User Account, Password & Security
      </h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        and password and for all activities that occur under your account.
      </p>
      <ul className="list-disc ml-6 mt-3 text-gray-700">
        <li>Notify us immediately of unauthorized account use.</li>
        <li>Ensure you log out after every session.</li>
      </ul>

      {/* SECTION 3 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">3. Services Offered</h2>
      <p>
        SIraj Enterprises enables users to purchase authentic products from our
        online store. Additional product-specific terms may apply.
      </p>

      {/* SECTION 4 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">4. Policies</h2>
      <p>
        By using our website, you agree that you have read and understood our:
      </p>
      <ul className="list-disc ml-6 mt-3">
        <li>Privacy Policy</li>
        <li>Shipping & Return Policy</li>
        <li>Cancellation Policy</li>
      </ul>

      {/* SECTION 5 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">5. Limited User License</h2>
      <p>
        You agree not to copy, modify, distribute, transmit, reproduce, publish,
        license, create derivative works from, or sell any content from this
        website without written permission.
      </p>

      {/* SECTION 6 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">6. User Conduct</h2>
      <p>You agree NOT to:</p>
      <ul className="list-disc ml-6 mt-3 text-gray-700">
        <li>Post harmful, abusive, defamatory, or illegal content</li>
        <li>Violate intellectual property rights</li>
        <li>Upload harmful software or viruses</li>
        <li>Engage in fraudulent or illegal activities</li>
      </ul>

      {/* SECTION 7 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">
        7. User Warranty & Representation
      </h2>
      <p>
        You confirm that you own or are licensed to use all content you submit
        and that such content does not infringe on any third-party rights.
      </p>

      {/* SECTION 8 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">8. Exactness Not Guaranteed</h2>
      <p>
        Product images may differ from actual products due to lighting, device
        color calibration, and other factors. No refunds are provided on this
        basis.
      </p>

      {/* SECTION 9 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">
        9. Intellectual Property Rights
      </h2>
      <p>
        All content—including text, images, logos, designs, and trademarks—is the
        property of SIraj Enterprises and protected by copyright law.
      </p>

      {/* SECTION 10 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">
        10. Links to Third-Party Sites
      </h2>
      <p>
        SIraj Enterprises is not responsible for the content or accuracy of
        third-party links appearing on the website.
      </p>

      {/* SECTION 11 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">
        11. Disclaimer of Liability
      </h2>
      <p>
        We do not guarantee that the website will always be available, error-free,
        or uninterrupted. We are not liable for any damages arising from website
        use.
      </p>

      {/* SECTION 12 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">12. Indemnification</h2>
      <p>
        You agree to indemnify SIraj Enterprises against all claims or damages
        resulting from your misuse of the website.
      </p>

      {/* SECTION 13 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">13. Pricing</h2>
      <p>
        All prices may change without prior notice at the discretion of SIraj
        Enterprises.
      </p>

      {/* SECTION 14 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">14. Shipping</h2>
      <p>
        Ownership and risk pass to the buyer once the product has been handed
        over to the shipping carrier.
      </p>

      {/* SECTION 15 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">15. Termination</h2>
      <p>
        SIraj Enterprises may suspend or terminate access for violation of these
        Terms. You remain liable for products ordered prior to termination.
      </p>

      {/* SECTION 16 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">16. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of India. All disputes will be
        subject exclusively to the courts of New Delhi.
      </p>

      {/* SECTION 17 */}
      <h2 className="text-2xl font-bold mt-8 mb-3">17. Severability</h2>
      <p>
        If any part of these Terms is found invalid, the remaining sections shall
        continue to remain in full effect.
      </p>

      {/* FOOTER */}
      <p className="mt-12 text-sm text-gray-500">
        If you have questions regarding these Terms, email us at:
        <br />
        <b>raadi10008@gmail.com</b>
      </p>
    </div>
    <Footer/>
    </>
  );
}
