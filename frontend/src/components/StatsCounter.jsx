import { useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function StatsCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  const statsData = [
    { value: 10, suffix: "+", label: "Service" },
    { value: 30, suffix: "M+", label: "Fortune Clients" },
    { value: 10, suffix: "K+", label: "Sales Per Month" },
    { value: 20, suffix: "+", label: "Years of Journey" },
  ];

  return (
    <section className="w-full py-10 bg-white">
      <div
        ref={ref}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        {statsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{
              scale: 1.06,
              boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
            }}
            className="bg-white rounded-xl px-4 py-6 cursor-pointer
                       transition-all duration-300 border border-gray-200 
                       hover:border-orange-400 hover:bg-orange-50"
          >
            {/* Number */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              {inView && (
                <CountUp
                  start={0}
                  end={item.value}
                  duration={2.2}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              )}
              {item.suffix}
            </h2>

            {/* Label */}
            <p className="mt-1 text-sm md:text-base text-gray-600 font-medium">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
