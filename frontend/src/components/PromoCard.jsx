import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://raadi.onrender.com/api/v1/promoCard/";

export default function PromoGrid() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_BASE)
      .then((res) => setCards(res.data.cards || []))
      .catch((err) => console.error("Promo fetch error:", err));
  }, []);

  const getCard = (pos) => cards.find((c) => c.position === pos);
  const handleClick = (card) => card?.buttonLink && navigate(card.buttonLink);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">

      {/* Heading */}
      <h2 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl text-blue-900 tracking-tight">
        Recommended For You
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-10 md:mb-12 text-sm md:text-base">
        Handpicked products your customers will love.
      </p>

      {/* GRID */}
      <div
        className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 lg:grid-rows-2 
        gap-4 md:gap-6
        "
      >
        {/* HERO CARD */}
        {(() => {
          const card = getCard(1);
          return card ? (
            <div
              onClick={() => handleClick(card)}
              className="
              col-span-1 sm:col-span-2 
              lg:col-span-1 lg:row-span-2
              rounded-3xl p-5 md:p-7 
              shadow-[0_10px_25px_rgba(0,0,0,0.08)]
              hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)]
              transition-all duration-300 cursor-pointer 
              flex flex-col justify-between 
              relative overflow-hidden
            "
              style={{ backgroundColor: card.bgColor || "#ECECEC" }}
            >
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
                  {card.title}
                </h3>
                <p className="text-base md:text-lg text-gray-700 max-w-sm">
                  {card.subtitle}
                </p>

                <button
                  className="
                  mt-3 bg-[#F4C28B] text-white px-5 md:px-6 py-2 
                  rounded-lg text-sm md:text-base font-semibold
                  hover:bg-[#e9a363] transition shadow-sm hover:shadow-md
                "
                >
                  {card.buttonText || "Shop Now"}
                </button>
              </div>

              <img
                src={card.image}
                alt={card.title}
                className="
                object-contain mx-auto mt-4
                w-[180px] h-[180px] 
                md:w-[240px] md:h-[240px]
                drop-shadow-xl
              "
              />
            </div>
          ) : null;
        })()}

        {/* SMALLER CARDS */}
        {[2, 3, 4, 5].map((pos) => {
          const card = getCard(pos);
          if (!card) return null;

          return (
            <div
              key={card._id}
              onClick={() => handleClick(card)}
              className="
              rounded-2xl p-4 md:p-6 
              flex justify-between items-center
              bg-white shadow-[0_5px_14px_rgba(0,0,0,0.06)]
              hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)]
              transition-all duration-300 cursor-pointer
            "
              style={{ backgroundColor: card.bgColor || "#fafafa" }}
            >
              <div className="space-y-1.5 md:space-y-2 w-[55%]">
                <h4 className="text-lg md:text-xl font-bold text-gray-800">
                  {card.title}
                </h4>
                <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                  {card.subtitle}
                </p>

                <button
                  className="
                  mt-2 bg-[#F4C28B] text-white px-4 py-1.5 
                  rounded-lg font-medium text-xs md:text-sm
                  hover:bg-[#e7a05d] transition
                "
                >
                  {card.buttonText || "Shop Now"}
                </button>
              </div>

              <img
                src={card.image}
                alt={card.title}
                className="
                w-[80px] h-[100px]
                sm:w-[100px] sm:h-[120px]
                md:w-[120px] md:h-[150px]
                object-contain drop-shadow-lg
              "
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
