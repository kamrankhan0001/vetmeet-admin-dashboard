
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const CouponFormModal = ({ onClose, onSave, editingCoupon }) => {
  // State to hold the form data for a coupon
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: 'percentage', 
    discountValue: '',
    expiryDate: '', 
    usageLimit: '',
    appliesTo: 'all', 
    applicableItems: [], 
    minOrderAmount: '', 
  });
  const [error, setError] = useState(''); 

  // useEffect to populate the form when an existing coupon is passed for editing
  useEffect(() => {
    if (editingCoupon) {
      // If editingCoupon is provided, set the form data to its values
      setCouponData({
        code: editingCoupon.code || '',
        discountType: editingCoupon.discountType || 'percentage',
        discountValue: editingCoupon.discountValue || '',
        // Format expiryDate to YYYY-MM-DD for HTML date input
        expiryDate: editingCoupon.expiryDate ? new Date(editingCoupon.expiryDate).toISOString().split('T')[0] : '',
        usageLimit: editingCoupon.usageLimit || '',
        appliesTo: editingCoupon.appliesTo || 'all',
        applicableItems: editingCoupon.applicableItems || [],
        minOrderAmount: editingCoupon.minOrderAmount || '',
      });
    } else {
      // If not editing, reset the form to its initial empty values for a new coupon
      setCouponData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiryDate: '',
        usageLimit: '',
        appliesTo: 'all',
        applicableItems: [],
        minOrderAmount: '',
      });
    }
    setError(''); // Clear any previous errors when the modal opens or changes context
  }, [editingCoupon]); // Dependency array: re-run when editingCoupon prop changes

  // Generic handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Special handler for applicableItems (comma-separated string to array)
  const handleApplicableItemsChange = (e) => {
    const items = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
    setCouponData((prevData) => ({
      ...prevData,
      applicableItems: items,
    }));
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic client-side validation
    if (!couponData.code || !couponData.discountValue || !couponData.expiryDate || !couponData.usageLimit) {
      setError('Please fill all required fields.');
      return;
    }
    if (couponData.discountType === 'percentage' && (couponData.discountValue < 1 || couponData.discountValue > 100)) {
      setError('Percentage discount must be between 1 and 100.');
      return;
    }
    if (couponData.appliesTo !== 'all' && couponData.applicableItems.length === 0) {
      setError('Please specify applicable categories or products.');
      return;
    }

    // Call the onSave prop function passed from the parent (CouponsManagement)
    onSave(couponData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose} // Call onClose prop to close the modal
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'} {/* Title changes based on context */}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Coupon Code*</label>
            <input
              type="text"
              id="code"
              name="code"
              value={couponData.code}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!!editingCoupon} // Disable code editing for existing coupons
            />
          </div>

          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type*</label>
            <select
              id="discountType"
              name="discountType"
              value={couponData.discountType}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div>
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Discount Value*</label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={couponData.discountValue}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
              step={couponData.discountType === 'percentage' ? "1" : "0.01"} // Step depends on discount type
              max={couponData.discountType === 'percentage' ? "100" : undefined} // Max 100 for percentage
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date*</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={couponData.expiryDate}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Usage Limit* (Total uses)</label>
            <input
              type="number"
              id="usageLimit"
              name="usageLimit"
              value={couponData.usageLimit}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>

          <div>
            <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700">Minimum Order Amount (Optional)</label>
            <input
              type="number"
              id="minOrderAmount"
              name="minOrderAmount"
              value={couponData.minOrderAmount}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="appliesTo" className="block text-sm font-medium text-gray-700">Applies To*</label>
            <select
              id="appliesTo"
              name="appliesTo"
              value={couponData.appliesTo}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="all">All Products</option>
              <option value="categories">Specific Categories</option>
              <option value="products">Specific Products</option>
            </select>
          </div>

          {couponData.appliesTo !== 'all' && (
            <div>
              <label htmlFor="applicableItems" className="block text-sm font-medium text-gray-700">
                {couponData.appliesTo === 'categories' ? 'Category IDs (comma-separated)*' : 'Product IDs (comma-separated)*'}
              </label>
              <input
                type="text"
                id="applicableItems"
                name="applicableItems"
                value={couponData.applicableItems.join(', ')}
                onChange={handleApplicableItemsChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., cat-food-id, dog-toy-id"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter IDs separated by commas. (e.g., `60d5ec49f8c7e9001c8a4b3d, 60d5ec49f8c7e9001c8a4b3e`)</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            disabled={false} // Add loading state if onSave is async
          >
            {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
