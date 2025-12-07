import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";
import React from "react";

const API_BASE = "https://raadi.onrender.com/api/v1/promoCard/";

export default function PromoGrid() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 API with short-term caching to avoid repeat calls
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE, {
        cache: "force-cache",
      });
      setCards(res.data.cards || []);
    } catch (err) {
      console.error("Promo fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const lookup = useMemo(() => {
    const map = {};
    cards.forEach((c) => (map[c.position] = c));
    return map;
  }, [cards]);

  const handleClick = (card) => card?.buttonLink && navigate(card.buttonLink);

  // 🔥 Preload hero image (position 1)
  useEffect(() => {
    const hero = cards.find((c) => c.position === 1);
    if (hero?.image) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = hero.image;
      document.head.appendChild(link);
    }
  }, [cards]);

  // -------------------------------------------------------------
  // SKELETON LOADER
  // -------------------------------------------------------------
  if (loading) return <SkeletonGrid />;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">

      <h2 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl text-blue-900">
        Recommended For You
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-10 md:mb-12 text-sm md:text-base">
        Handpicked products your customers will love.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 md:gap-6">

        {/* HERO CARD */}
        <PromoHero card={lookup[1]} onClick={handleClick} />

        {/* SMALL CARDS */}
        {[2, 3, 4, 5].map((p) =>
          lookup[p] ? (
            <PromoSmall key={lookup[p]._id} card={lookup[p]} onClick={handleClick} />
          ) : null
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------
   SKELETON LOADER
------------------------------------------------------------- */
function SkeletonGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-6 w-52 bg-gray-300 mx-auto rounded"></div>
      <div className="h-4 w-64 bg-gray-200 mx-auto mt-3 mb-10 rounded"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-40 sm:h-48 md:h-56 bg-gray-200 rounded-3xl"
          ></div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------
   HERO CARD (Position 1)
------------------------------------------------------------- */
const PromoHero = React.memo(function ({ card, onClick }) {
  if (!card) return null;

  return (
    <div
      onClick={() => onClick(card)}
      className="
        col-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-2
        rounded-3xl p-6 md:p-7 
        shadow hover:shadow-xl transition-all 
        cursor-pointer relative overflow-hidden
        will-change-transform
      "
      style={{ backgroundColor: card.bgColor || "#ECECEC" }}
    >
      <div className="space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold">{card.title}</h3>
        <p className="text-gray-700">{card.subtitle}</p>

        <button className="bg-[#F4C28B] text-white px-6 py-2 rounded-lg font-semibold">
          {card.buttonText}
        </button>
      </div>

      <LazyImage
        src={card.image}
        alt={card.title}
        width="260"
        height="260"
        className="mt-4 mx-auto"
      />
    </div>
  );
});

/* -------------------------------------------------------------
   SMALL CARDS (Positions 2–5)
------------------------------------------------------------- */
const PromoSmall = React.memo(function ({ card, onClick }) {
  return (
    <div
      onClick={() => onClick(card)}
      className="
        rounded-2xl p-4 md:p-6 flex justify-between items-center
        shadow hover:shadow-md cursor-pointer transition-all
        will-change-transform
      "
      style={{ backgroundColor: card.bgColor || "#fafafa" }}
    >
      <div className="space-y-2 w-[55%]">
        <h4 className="text-lg md:text-xl font-bold">{card.title}</h4>
        <p className="text-gray-600 text-sm md:text-base line-clamp-2">
          {card.subtitle}
        </p>
        <button className="bg-[#F4C28B] text-white px-4 py-1.5 rounded-lg text-xs md:text-sm">
          {card.buttonText}
        </button>
      </div>

      <LazyImage
        src={card.image}
        alt={card.title}
        width="140"
        height="160"
        className="drop-shadow-lg"
      />
    </div>
  );
});
