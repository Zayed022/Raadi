import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/v1/promoCard/";

export default function PromoGrid() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_BASE)
      .then((res) => setCards(res.data.cards || []))
      .catch((err) => console.error("Promo fetch error:", err));
  }, []);

  const getCard = (pos) => cards.find((c) => c.position === pos);

  const handleClick = (card) => {
    if (!card?.buttonLink) return;
    navigate(card.buttonLink);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-center font-extrabold text-4xl text-blue-900 tracking-tight">
        Recommended For You
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-14 text-lg">
        Handpicked products your customers will love.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8">

        {/* HERO CARD */}
        {(() => {
          const card = getCard(1);
          return card ? (
            <div
              onClick={() => handleClick(card)}
              className="col-span-1 md:col-span-1 row-span-2 rounded-3xl p-10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.1)]
              hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer
              flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: card.bgColor || "#ECECEC" }}
            >
              <div className="space-y-4">
                <h3 className="text-4xl font-extrabold text-gray-800 leading-tight">{card.title}</h3>
                <p className="text-xl text-gray-700 max-w-sm leading-relaxed">{card.subtitle}</p>
                <button
                  className="mt-4 bg-[#F4C28B] text-white px-8 py-3 rounded-lg text-lg font-semibold
                  hover:bg-[#e9a363] transition shadow-sm hover:shadow-md"
                >
                  {card.buttonText || "Shop Now"}
                </button>
              </div>

              <img
                src={card.image}
                alt={card.title}
                className="object-contain mx-auto mt-6 w-[330px] h-[330px] drop-shadow-xl"
              />
            </div>
          ) : null;
        })()}

        {/* OTHER FOUR CARDS */}
        {[2, 3, 4, 5].map((pos) => {
          const card = getCard(pos);
          if (!card) return null;

          return (
            <div
              key={card._id}
              onClick={() => handleClick(card)}
              className="rounded-3xl p-8 flex justify-between items-center
              bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.15)]
              transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: card.bgColor || "#fafafa" }}
            >
              <div className="space-y-3 w-[55%]">
                <h4 className="text-2xl font-bold text-gray-800 leading-tight">{card.title}</h4>
                <p className="text-gray-600 text-base truncate">{card.subtitle}</p>
                <button
                  className="mt-2 bg-[#F4C28B] text-white px-6 py-2 rounded-lg font-medium
                  hover:bg-[#e7a05d] transition"
                >
                  {card.buttonText || "Shop Now"}
                </button>
              </div>

              <img
                src={card.image}
                alt={card.title}
                className="w-[160px] h-[200px] object-contain drop-shadow-lg"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
