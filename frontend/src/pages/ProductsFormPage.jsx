// src/components/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductFormModal = ({ onClose = () => {}, onSave = () => {}, editingProduct = null }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    stock: '',
    imageUrls: [],
    brand: '',
    status: 'active',
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setProductData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || '',
        tags: editingProduct.tags ? editingProduct.tags.join(', ') : '',
        stock: editingProduct.stock || '',
        imageUrls: editingProduct.imageUrls || [],
        brand: editingProduct.brand || '',
        status: editingProduct.status || 'active',
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlAdd = () => {
    if (
      imageUrlInput.trim() &&
      !productData.imageUrls.includes(imageUrlInput.trim())
    ) {
      setProductData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrlInput.trim()],
      }));
      setImageUrlInput('');
    }
  };

  const handleImageUrlRemove = (urlToRemove) => {
    setProductData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      !productData.name ||
      !productData.price ||
      !productData.category ||
      productData.stock === ''
    ) {
      setError('Please fill all required fields (Name, Price, Category, Stock).');
      return;
    }

    if (Number(productData.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    if (Number(productData.stock) < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    const finalProductData = {
      ...productData,
      tags: productData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (typeof onSave === 'function') {
      onSave(finalProductData);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name*</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)*</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                min="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock*</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category*</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={productData.tags}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={productData.status}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700">Upload Images</label>

  {/* File input */}
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setProductData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    }}
    className="mt-1 block w-full p-2 border rounded-md"
  />

  {/* Preview uploaded images */}
  <div className="mt-4 space-y-2">
    {productData.imageUrls.map((url, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
      >
        <img
          src={url}
          alt={`Preview ${index}`}
          className="h-10 w-10 object-cover rounded-md mr-2"
        />
        <span className="truncate text-xs flex-1">{url}</span>
        <button
          type="button"
          onClick={() =>
            setProductData((prev) => ({
              ...prev,
              imageUrls: prev.imageUrls.filter((u) => u !== url),
            }))
          }
          className="text-red-500 hover:text-red-700"
        >
          <FaTimes />
        </button>
      </div>
    ))}
  </div>
</div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
