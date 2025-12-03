import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    name: "Zayn Malik",
    role: "Entrepreneur",
    comment:
      "Absolutely premium fragrance products! The aroma diffusers changed the feel of my home and office completely. Highly recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    name: "Ananya Sharma",
    role: "Interior Designer",
    comment:
      "Top-notch product quality and professional service. Their perfumes are long-lasting and luxurious. I always recommend them to my clients.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Rahul Verma",
    role: "Perfume Collector",
    comment:
      "The best fragrance brand I’ve experienced. Absolutely elegant packaging and outstanding quality scents!",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Sara Johnson",
    role: "Marketing Head",
    comment:
      "Their fragrance diffusers create an amazing ambience in our office. The aroma is refreshing and soothing!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    name: "Ahmed Ali",
    role: "Business Owner",
    comment:
      "Great luxury range and affordable pricing. Customer support is exceptional and super fast delivery!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
  }
];

export default function Testimonials() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="py-20 bg-[#f9fafc]">
      <h2 className="text-center text-4xl md:text-5xl font-bold text-[#071a3c] mb-4" data-aos="fade-up">
        What Our Customers Say
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10" data-aos="fade-up">
        Real experiences shared by our premium customers from around the world.
      </p>

      <Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 3500, disableOnInteraction: false }}
  pagination={{ clickable: true }}
  spaceBetween={40}
  slidesPerView={1}
  breakpoints={{
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1280: { slidesPerView: 3 }
  }}
  className="px-4 md:px-16"
>

        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
  <div
    className="relative bg-white rounded-[30px] shadow-lg p-12 pt-20 min-h-[420px] text-center
    transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.05]"
    data-aos="zoom-in"
  >
    {/* Avatar */}
    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
      <img
        src={t.avatar}
        alt={t.name}
        className="w-28 h-28 rounded-full object-cover border-[6px] border-white shadow-xl hover:scale-110 transition-transform duration-300 mt-18"
      />
    </div>

    <h3 className="mt-14 text-2xl font-bold text-[#0b1b3f]">{t.name}</h3>
    <p className="text-gray-500 text-base">{t.role}</p>

    {/* RATING */}
    <div className="flex justify-center mt-3">
      {[...Array(t.rating)].map((_, i) => (
        <span key={i} className="text-[#f89f23] text-2xl tracking-wider">★</span>
      ))}
    </div>

    {/* REVIEW TEXT */}
    <p className="text-gray-600 mt-5 leading-relaxed text-lg px-4">
      “{t.comment}”
    </p>
  </div>
</SwiperSlide>

        ))}
      </Swiper>
    </section>
  );
}
