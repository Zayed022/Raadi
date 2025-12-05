import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://raadi.onrender.com/api/v1/category/");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };

    fetchCategories();
  }, []);

  /** Navigate user to category page */
  const goToCategory = (slug) => {
    if (!slug) return;
    navigate(`/category/${slug}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-center text-4xl font-semibold text-blue-900">
        Shop By Category
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-10">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => goToCategory(cat.slug)}
            className="cursor-pointer text-center hover:scale-110 transition-all duration-300"
          >
            <div className="w-[140px] h-[140px] mx-auto bg-gray-100 rounded-xl shadow-md overflow-hidden flex items-center justify-center border">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            <p className="mt-3 text-lg font-medium text-gray-700 hover:text-orange-500">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
