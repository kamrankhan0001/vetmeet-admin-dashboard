import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBoxOpen, FaPlus, FaEdit, FaTrashAlt, FaSpinner, FaDownload } from 'react-icons/fa';
import ProductFormPage from './ProductsFormPage';


const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Null for add, object for edit
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = 'https://vetmeet-admin-dashboard-api.onrender.com/api/admin'; // Your backend admin API base URL
  const LOW_STOCK_THRESHOLD = 10; // Define your low stock threshold

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to save (add/edit) a product
  const handleSaveProduct = async (productData) => {
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        return;
      }

      if (editingProduct) {
        // Update existing product
        await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        alert('Product updated successfully!'); // Replace with custom toast
      } else {
        // Add new product
        await axios.post(`${API_BASE_URL}/products`, productData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        alert('Product added successfully!'); // Replace with custom toast
      }
      setShowAddEditModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    setDeletingId(productId);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setDeletingId(null);
        return;
      }
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product deleted successfully!'); // Replace with custom toast
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    if (products.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ["ID", "Name", "Description", "Price", "Category", "Stock", "Brand", "Image URLs"];
    const rows = products.map(product => [
      product._id,
      product.name,
      product.description,
      product.price,
      product.category,
      product.stock,
      product.brand || '',
      product.imageUrls.join('; ') // Join multiple URLs with a semicolon
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'products_inventory.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your browser does not support downloading files directly. Please copy the data manually.');
    }
  };


  const openAddModal = () => {
    setEditingProduct(null);
    setShowAddEditModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowAddEditModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaBoxOpen className="mr-3" /> Inventory Management
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCsv}
            className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-700 transition-colors"
          >
            <FaDownload className="mr-2" /> Export CSV
          </button>
          <button
            onClick={openAddModal} // This correctly calls openAddModal
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Product
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products found. Add some to your inventory!</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Image</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Stock</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{product.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{product.category}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">₹{product.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{product.stock}</td>
                    <td className="py-2 px-4 border-b text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > LOW_STOCK_THRESHOLD ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > LOW_STOCK_THRESHOLD ? 'In Stock' :
                         product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:underline mr-3"
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:underline"
                        title="Delete Product"
                        disabled={deletingId === product._id}
                      >
                        {deletingId === product._id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {showAddEditModal && (
        <ProductFormPage // This correctly renders ProductFormModal
          onClose={() => setShowAddEditModal(false)}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
