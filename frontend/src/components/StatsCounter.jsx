import { useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function StatsCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  const statsData = [
    { value: 10, suffix: "+", label: "Service" },
    { value: 30, suffix: "M+", label: "Fortune Clients" },
    { value: 10, suffix: "K+", label: "Sales Per month" },
    { value: 20, suffix: "+", label: "Years of Journey" },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div
        ref={ref}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
      >
        {statsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            whileHover={{
              scale: 1.12,
              boxShadow: "0px 12px 30px rgba(0,0,0,0.12)",
            }}
            className="bg-white rounded-2xl px-6 py-10 cursor-pointer
                       transition-all duration-300 border border-gray-200 hover:border-orange-400
                       hover:bg-orange-50"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900">
              {inView && (
                <CountUp
                  start={0}
                  end={item.value}
                  duration={2.8}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              )}
              {item.suffix}
            </h2>

            <p className="mt-2 text-lg md:text-xl text-gray-600 font-medium">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
