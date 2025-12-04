import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
    <div className="max-w-4xl mx-auto px-6 py-12 leading-relaxed text-gray-800">
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-extrabold text-[#0b1b3f] mb-6">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-6">
        This Privacy Policy describes how RAADI (“we”, “our”, “us”) collects,
        uses, and protects your personal information when you visit or make a
        purchase from our website.
      </p>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">1. Personal Information We Collect</h2>

        <p className="mb-4">
          When you visit our Site, we automatically collect certain information
          about your device, including details about your web browser, IP
          address, time zone, and cookies installed on your device. As you
          browse the Site, we collect information about pages you view, search
          terms that referred you to the Site, and how you interact with the
          website. We refer to this as <strong>“Device Information.”</strong>
        </p>

        <h3 className="text-xl font-semibold mb-2">Device Information is collected through:</h3>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            <strong>Cookies:</strong> Data files placed on your device, often containing a unique identifier.
          </li>
          <li>
            <strong>Log Files:</strong> Track actions on the Site such as IP address, browser type, ISP,
            and timestamp.
          </li>
          <li>
            <strong>Web Beacons, Tags & Pixels:</strong> Electronic files that collect browsing behavior.
          </li>
        </ul>

        <p className="mt-4">
          When you attempt to make a purchase through the Site, we collect your{" "}
          <strong>Order Information</strong> such as:
        </p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-2">
          <li>Name</li>
          <li>Billing Address</li>
          <li>Shipping Address</li>
          <li>Payment Information (including card details)</li>
          <li>Email Address</li>
          <li>Phone Number</li>
        </ul>

        <p className="mt-4">
          “<strong>Personal Information</strong>” in this policy refers to both
          Device Information and Order Information.
        </p>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">
          2. How Do We Use Your Personal Information?
        </h2>

        <p className="mb-4">We use your Order Information to:</p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Process your payment and fulfill your orders</li>
          <li>Arrange shipping and provide order confirmations</li>
          <li>Communicate with you regarding orders</li>
          <li>Screen orders for potential fraud or risks</li>
          <li>
            Provide information or advertisements based on your preferences
          </li>
        </ul>

        <p className="mt-4">
          Device Information is used to improve and optimize our Site—for
          example, analytics on browsing behavior and marketing performance.
        </p>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">3. Behavioural Advertising</h2>

        <p className="mb-4">
          We use your information to provide personalized advertising or
          marketing messages we believe may interest you.
        </p>

        <p className="font-semibold">You can opt out here:</p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-2">
          <li>Facebook Ads: https://www.facebook.com/</li>
          <li>Google Ads: https://www.google.com/</li>
        </ul>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">4. Do Not Track</h2>
        <p>
          Our Site does not alter its data collection practices when your
          browser sends a Do Not Track signal.
        </p>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">5. Your Rights</h2>
        <p className="mb-4">
          If you are a European resident, you have the right to access, correct,
          update, or delete your personal information.
        </p>
        <p>
          Additionally, we may process your information to fulfill contracts or
          for legitimate business operations. Your data may be transferred
          outside of Europe, including Canada and the USA.
        </p>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">6. Data Retention</h2>
        <p>
          We retain your Order Information for our records unless you request
          its deletion.
        </p>
      </section>

      {/* SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">7. Changes</h2>
        <p>
          We may update this privacy policy from time to time to reflect changes
          in our practices or legal requirements.
        </p>
      </section>

      {/* CONTACT */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
        <p>
          For questions or concerns about our privacy practices, please contact:
        </p>

        <p className="mt-3 font-semibold">
          Email:{" "}
          <a href="mailto:raadi10008@gmail.com" className="text-orange-600">
            raadi10008@gmail.com
          </a>
        </p>
      </section>
    </div>
    <Footer/>
    </>
  );
}
