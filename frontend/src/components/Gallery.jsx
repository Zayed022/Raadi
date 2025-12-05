import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = "https://raadi.onrender.com/api/v1/gallery/";

export default function GalleryCarousel() {
  const [images, setImages] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(API_BASE);
        setImages(res.data.images || []);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    };
    fetchGallery();
  }, []);

  // Auto-slide
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = setInterval(() => {
      const tileWidth = carousel.firstChild?.clientWidth || 300;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (carousel.scrollLeft >= maxScroll - 10) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollTo({
          left: carousel.scrollLeft + tileWidth + 16,
          behavior: "smooth",
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-900">Our Gallery</h2>
        <p className="text-gray-600 mt-2">
          Do not wait any longer and discover other related perfume products
        </p>
      </div>

      {/* Responsive Carousel */}
      <div
        ref={carouselRef}
        className="
          flex gap-4 p-4 
          overflow-x-auto 
          scroll-smooth 
          rounded-xl 
          bg-gray-100 
          no-scrollbar
          snap-x snap-mandatory
        "
      >
        {images.map((img) => (
          <div key={img._id} className="snap-center flex-shrink-0">
            <img
              src={img.imageUrl}
              alt={img.title || "Gallery"}
              className="
                rounded-lg object-cover shadow-md transition-transform duration-300
                hover:scale-105
                w-[260px] h-[300px] 
                sm:w-[300px] sm:h-[330px]
                md:w-[330px] md:h-[350px]
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}
