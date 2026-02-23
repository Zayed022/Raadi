export default function MissionSection() {
  const data = [
    {
      icon: "🚚",
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
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0b1b3f] mb-6">
          Our Mission
        </h2>

        {/* Subheading */}
        <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed">
          To provide high-quality accessories that enhance your experience,
          backed by exceptional customer service and technical support.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {data.map((item, index) => (
            <div
              key={index}
              className="group bg-[#eef0f5] rounded-2xl p-6 sm:p-8 lg:p-10
                         border border-transparent
                         transition-all duration-300
                         shadow-sm hover:shadow-2xl
                         hover:border-[#e6860b]
                         hover:-translate-y-2
                         hover:bg-white"
            >
              <div className="flex items-start sm:items-center gap-4 mb-6">
                <span
                  className="text-3xl sm:text-4xl p-3 sm:p-4 rounded-full 
                             bg-[#f4c48a] shadow-md
                             transition-transform duration-300
                             group-hover:scale-110"
                >
                  {item.icon}
                </span>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide text-gray-900">
                  {item.title}
                </h3>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}