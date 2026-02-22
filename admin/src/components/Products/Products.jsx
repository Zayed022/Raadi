// src/pages/products/ProductPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { title: 'Add Product', path: '/products/add' },
  { title: 'Manage Product', path: '/products/manage' },
  
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Product Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="text-sm text-gray-400 mb-1 group-hover:text-indigo-500 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="text-lg font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
              {action.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
