import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = "https://raadi.onrender.com/api/v1/gallery/";

export default function GalleryCarousel() {
  const [images, setImages] = useState([]);
  const carouselRef = useRef(null);
  const indexRef = useRef(0);

  // Fetch images
  useEffect(() => {
    let mounted = true;

    axios
      .get(API_BASE, { timeout: 8000 })
      .then((res) => mounted && setImages(res.data.images || []))
      .catch((err) => console.error("Gallery fetch error:", err));

    return () => (mounted = false);
  }, []);

  // Auto-slide using transform (much smoother than scrollTo)
  useEffect(() => {
    if (images.length === 0) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const tiles = carousel.children;
    const tileWidth = tiles[0]?.clientWidth || 280;

    const slide = () => {
      if (!carousel) return;

      indexRef.current =
        (indexRef.current + 1) % Math.max(images.length, 1);

      carousel.style.transform = `translateX(-${
        indexRef.current * (tileWidth + 16)
      }px)`;
    };

    const interval = setInterval(slide, 2600);

    return () => clearInterval(interval);
  }, [images]);

  // Lazy load images using IntersectionObserver
  const lazyLoad = useCallback((node) => {
    if (!node) return;

    const img = node;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = img.getAttribute("data-src");
            if (src) img.src = src;
            obs.unobserve(img);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(img);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-900">Our Gallery</h2>
        <p className="text-gray-600 mt-2">
          Do not wait any longer and discover other related perfume products
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div className="overflow-hidden rounded-xl bg-gray-100 p-2">
        <div
          ref={carouselRef}
          className="flex gap-4 transition-transform duration-700 ease-out will-change-transform"
        >
          {images.map((img) => (
            <div key={img._id} className="snap-center flex-shrink-0">
              <img
                ref={lazyLoad}
                data-src={img.imageUrl} // Image loads ONLY when visible
                alt={img.title || "Gallery"}
                loading="lazy"
                className="
                  rounded-lg object-cover shadow-md 
                  transition-transform duration-300 hover:scale-105
                  bg-gray-300 animate-pulse
                  w-[260px] h-[300px] 
                  sm:w-[300px] sm:h-[330px]
                  md:w-[330px] md:h-[350px]
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
