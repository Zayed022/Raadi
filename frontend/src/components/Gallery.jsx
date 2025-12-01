import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1/gallery/";

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

  // Auto-slide scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = setInterval(() => {
      const scrollAmount = 380; // adjust based on width of each tile
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (carousel.scrollLeft >= maxScroll) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollTo({
          left: carousel.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-semibold text-blue-900">Our Gallery</h2>
        <p className="text-gray-600 mt-2">
          Do not wait any longer and discover other related perfume products
        </p>
      </div>

      <div
        ref={carouselRef}
        className="flex flex-row gap-4 p-4 overflow-x-scroll scroll-smooth bg-gray-100 rounded-xl whitespace-nowrap"
      >
        {images.map((img) => (
          <div key={img._id} className="inline-block">
            <img
              src={img.imageUrl}
              alt={img.title || "Gallery"}
              className="w-[330px] h-[350px] object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
