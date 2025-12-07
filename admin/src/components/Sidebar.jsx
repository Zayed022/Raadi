import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiLayers,
  FiImage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: <FiHome className="text-lg" />,
  },
  {
    label: "Products",
    to: "/products",
    icon: <FiBox className="text-lg" />,
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: <FiLayers className="text-lg" />,
  },
  {
    label: "Banners",
    to: "/admin/banners",
    icon: <FiImage className="text-lg" />,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: <FiShoppingBag className="text-lg" />,
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: <FiUsers className="text-lg" />,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: <FiSettings className="text-lg" />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        bg-gray-900 text-white min-h-screen
        flex flex-col
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Top Brand + Collapse Button */}
      
        

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"} // exact match for dashboard
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${
                isActive
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-200 hover:bg-gray-800 hover:text-white"
              }
            `
            }
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Optional footer (version/info) */}
      <div className="border-t border-gray-800 px-3 py-3 text-[11px] text-gray-400">
        {!collapsed && <span>© {new Date().getFullYear()} Raadi</span>}
      </div>
    </aside>
  );
}
