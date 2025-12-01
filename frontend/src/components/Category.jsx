import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/v1";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/category/");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const goToCategory = (slug) => {
    navigate(`/products?category=${slug}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-center text-4xl font-semibold text-blue-900">Shop By Category</h2>

      <div className="mt-10 flex flex-wrap justify-center gap-10">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => goToCategory(cat.slug)}
            className="text-center cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-[120px] h-[120px] object-cover rounded-md mx-auto"
            />
            <p className="mt-3 text-lg font-medium text-gray-700 hover:text-orange-500">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
