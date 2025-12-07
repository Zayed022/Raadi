import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------------------
  // Fetch categories (runs once)
  // -------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://raadi.onrender.com/api/v1/category/");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const goToCategory = useCallback(
    (slug) => slug && navigate(`/category/${slug}`),
    []
  );

  // -------------------------------
  // Must run BEFORE any returns
  // -------------------------------
  const categoryList = useMemo(
    () =>
      categories.map((cat) => (
        <CategoryCard key={cat._id} cat={cat} onClick={goToCategory} />
      )),
    [categories, goToCategory]
  );

  // -------------------------------
  // Now we can safely conditionally return
  // -------------------------------
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center text-4xl font-semibold text-blue-900">
          Shop By Category
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-10 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="text-center">
              <div className="w-[140px] h-[140px] bg-gray-200 rounded-xl"></div>
              <div className="mt-3 h-5 w-24 bg-gray-200 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-center text-4xl font-semibold text-blue-900">
        Shop By Category
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-10">
        {categoryList}
      </div>
    </section>
  );
}

const CategoryCard = React.memo(({ cat, onClick }) => {
  return (
    <div
      onClick={() => onClick(cat.slug)}
      className="cursor-pointer text-center transform transition duration-300 hover:scale-110"
    >
      <div className="w-[140px] h-[140px] mx-auto bg-gray-100 rounded-xl shadow-md overflow-hidden flex items-center justify-center border">
        <img
          src={cat.image}
          alt={cat.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <p className="mt-3 text-lg font-medium text-gray-700 hover:text-orange-500 transition">
        {cat.name}
      </p>
    </div>
  );
});
