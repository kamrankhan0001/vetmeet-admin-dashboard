import React, { useState } from 'react';
import ProductsFormPage from './ProductsFormPage';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = (newProduct) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.name === editingProduct.name ? newProduct : p
        )
      );
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (name) => {
    setProducts((prev) => prev.filter((p) => p.name !== name));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📦 Product Management</h2>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No products available. Click “Add Product” to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 shadow-lg p-5 rounded-xl hover:shadow-2xl transition"
            >
              {/* Optional Image Preview */}
              {product.imageUrls?.[0] && (
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-md mb-4"
                />
              )}

              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>

              <div className="mt-2 text-sm text-gray-600">{product.description}</div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(product.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Render */}
      {showModal && (
        <ProductsFormPage
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleAddProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
