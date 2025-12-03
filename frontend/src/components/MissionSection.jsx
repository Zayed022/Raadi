export default function MissionSection() {
  const data = [
    {
      icon: "🚚", // You can replace later with lucide-react or image icons
      title: "QUALITY ASSURANCE",
      description:
        "Every product is carefully selected and tested to meet our high standards."
    },
    {
      icon: "🎧",
      title: "24/7 SUPPORT",
      description:
        "Dedicated technical support team available around the clock."
    },
    {
      icon: "⚡",
      title: "FAST DELIVERY",
      description:
        "Quick and secure shipping to your doorstep."
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-center text-4xl md:text-5xl font-bold text-[#0b1b3f] mb-6 animate-fadeIn">
        Our Mission
      </h2>

      <p className="text-center text-gray-600 text-lg mb-14 max-w-3xl mx-auto">
        To provide high-quality accessories that enhance your experience,
        backed by exceptional customer service and technical support.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="group bg-[#eef0f5] rounded-2xl p-8 border border-transparent
                       hover:border-[#e6860b] transition-all duration-300
                       shadow-sm hover:shadow-xl cursor-pointer
                       hover:scale-[1.04] hover:bg-white"
          >
            <div className="flex items-center space-x-4 mb-5">
              <span
                className="text-4xl p-4 rounded-full bg-[#f4c48a] shadow-md
                           group-hover:scale-110 transition-transform duration-300"
              >
                {item.icon}
              </span>
              <h3 className="text-xl font-semibold tracking-wide text-gray-900">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
