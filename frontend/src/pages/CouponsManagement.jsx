// // vetnmeet-admin-frontend/src/components/CouponsManagement.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaTag, FaPlus, FaEdit, FaTrashAlt, FaSpinner } from 'react-icons/fa';
// import CouponManagement from './CouponsManagement'; // Import the new modal
// import ContentFormModal from './ContentFormModal';

// const CouponsManagement = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showAddEditModal, setShowAddEditModal] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState(null); // Null for add, object for edit
//   const [deletingId, setDeletingId] = useState(null);

//   const API_BASE_URL = 'http://localhost:5000/api/admin'; // Your backend admin API base URL

//   // Function to fetch coupons from the backend
//   const fetchCoupons = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('adminIdToken');
//       if (!token) {
//         setError('Admin not logged in.');
//         setLoading(false);
//         return;
//       }
//       const response = await axios.get(`${API_BASE_URL}/coupons`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCoupons(response.data);
//     } catch (err) {
//       console.error('Error fetching coupons:', err);
//       setError('Failed to fetch coupons: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to save (add/edit) a coupon
//   const handleSaveCoupon = async (couponData) => {
//     setError('');
//     try {
//       const token = localStorage.getItem('adminIdToken');
//       if (!token) {
//         setError('Admin not logged in.');
//         return;
//       }

//       if (editingCoupon) {
//         // Update existing coupon
//         await axios.put(`${API_BASE_URL}/coupons/${editingCoupon._id}`, couponData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         });
//         alert('Coupon updated successfully!'); // Replace with custom toast
//       } else {
//         // Add new coupon
//         await axios.post(`${API_BASE_URL}/coupons`, couponData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         });
//         alert('Coupon added successfully!'); // Replace with custom toast
//       }
//       setShowAddEditModal(false);
//       setEditingCoupon(null);
//       fetchCoupons(); // Refresh the list
//     } catch (err) {
//       console.error('Error saving coupon:', err);
//       setError('Failed to save coupon: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   // Function to delete a coupon
//   const handleDeleteCoupon = async (couponId) => {
//     if (!window.confirm('Are you sure you want to delete this coupon?')) {
//       return;
//     }
//     setDeletingId(couponId);
//     setError('');
//     try {
//       const token = localStorage.getItem('adminIdToken');
//       if (!token) {
//         setError('Admin not logged in.');
//         setDeletingId(null);
//         return;
//       }
//       await axios.delete(`${API_BASE_URL}/coupons/${couponId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Coupon deleted successfully!'); // Replace with custom toast
//       fetchCoupons(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting coupon:', err);
//       setError('Failed to delete coupon: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const openAddModal = () => {
//     setEditingCoupon(null);
//     setShowAddEditModal(true);
//   };

//   const openEditModal = (coupon) => {
//     setEditingCoupon(coupon);
//     setShowAddEditModal(true);
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const getStatus = (expiryDate) => {
//     const now = new Date();
//     const expiry = new Date(expiryDate);
//     return now > expiry ? 'Expired' : 'Active';
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold flex items-center">
//           <FaTag className="mr-3" /> Coupons / Discounts Management
//         </h2>
//         <button
//           onClick={openAddModal}
//           className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors"
//         >
//           <FaPlus className="mr-2" /> Create New Coupon
//         </button>
//       </div>

//       {loading && <p className="text-gray-600">Loading coupons...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && (
//         <div className="overflow-x-auto">
//           {coupons.length === 0 ? (
//             <p className="text-gray-500 text-center py-8">No coupons found. Create one!</p>
//           ) : (
//             <table className="min-w-full bg-white border border-gray-200">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Code</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Type</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Value</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Expiry Date</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Usage Limit</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Applies To</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
//                   <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {coupons.map((coupon) => (
//                   <tr key={coupon._id} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border-b text-sm text-gray-800 font-mono">{coupon.code}</td>
//                     <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">{coupon.discountType}</td>
//                     <td className="py-2 px-4 border-b text-sm text-gray-800">
//                       {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue.toFixed(2)}`}
//                     </td>
//                     <td className="py-2 px-4 border-b text-sm text-gray-800">
//                       {new Date(coupon.expiryDate).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 px-4 border-b text-sm text-gray-800">{coupon.usageLimit}</td>
//                     <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">
//                       {coupon.appliesTo} {coupon.appliesTo !== 'all' && `(${coupon.applicableItems.length})`}
//                     </td>
//                     <td className="py-2 px-4 border-b text-sm">
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         getStatus(coupon.expiryDate) === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {getStatus(coupon.expiryDate)}
//                       </span>
//                     </td>
//                     <td className="py-2 px-4 border-b text-sm">
//                       <button
//                         onClick={() => openEditModal(coupon)}
//                         className="text-blue-600 hover:underline mr-3"
//                         title="Edit Coupon"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCoupon(coupon._id)}
//                         className="text-red-600 hover:underline"
//                         title="Delete Coupon"
//                         disabled={deletingId === coupon._id}
//                       >
//                         {deletingId === coupon._id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {showAddEditModal && (
//         <CouponFormModal
//           onClose={() => setShowAddEditModal(false)}
//           onSave={handleSaveCoupon}
//           editingCoupon={editingCoupon}
//         />
//       )}
//     </div>
//   );
// };

// export default CouponsManagement;




// vetnmeet-admin-frontend/src/components/CouponsManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTag, FaPlus, FaEdit, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import CouponFormModal from './CouponFormModal'; // Corrected: Import CouponFormModal

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null); // Null for add, object for edit
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/admin'; // Your backend admin API base URL

  // Function to fetch coupons from the backend
  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to fetch coupons: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to save (add/edit) a coupon
  const handleSaveCoupon = async (couponData) => {
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        return;
      }

      if (editingCoupon) {
        // Update existing coupon
        await axios.put(`${API_BASE_URL}/coupons/${editingCoupon._id}`, couponData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        alert('Coupon updated successfully!'); // Replace with custom toast
      } else {
        // Add new coupon
        await axios.post(`${API_BASE_URL}/coupons`, couponData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        alert('Coupon added successfully!'); // Replace with custom toast
      }
      setShowAddEditModal(false);
      setEditingCoupon(null);
      fetchCoupons(); // Refresh the list
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Failed to save coupon: ' + (err.response?.data?.message || err.message));
    }
  };

  // Function to delete a coupon
  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    setDeletingId(couponId);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setDeletingId(null);
        return;
      }
      await axios.delete(`${API_BASE_URL}/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Coupon deleted successfully!'); // Replace with custom toast
      fetchCoupons(); // Refresh the list
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError('Failed to delete coupon: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  // Function to open the modal for adding a new coupon (sets editingCoupon to null)
  const openAddModal = () => {
    setEditingCoupon(null);
    setShowAddEditModal(true);
  };

  // Function to open the modal for editing an existing coupon (passes the coupon object)
  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setShowAddEditModal(true);
  };

  // Fetch coupons when the component mounts
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Helper function to determine coupon status
  const getStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry ? 'Expired' : 'Active';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaTag className="mr-3" /> Coupons / Discounts Management
        </h2>
        <button
          onClick={openAddModal} 
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Create New Coupon
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading coupons...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {coupons.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No coupons found. Create one!</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Code</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Value</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Expiry Date</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Usage Limit</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Applies To</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800 font-mono">{coupon.code}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">{coupon.discountType}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue.toFixed(2)}`}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{coupon.usageLimit}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">
                      {coupon.appliesTo} {coupon.appliesTo !== 'all' && `(${coupon.applicableItems.length})`}
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        getStatus(coupon.expiryDate) === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {getStatus(coupon.expiryDate)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-blue-600 hover:underline mr-3"
                        title="Edit Coupon"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-600 hover:underline"
                        title="Delete Coupon"
                        disabled={deletingId === coupon._id}
                      >
                        {deletingId === coupon._id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Conditionally render the CouponFormModal */}
      {showAddEditModal && (
        <CouponFormModal
          onClose={() => setShowAddEditModal(false)}
          onSave={handleSaveCoupon}
          editingCoupon={editingCoupon}
        />
      )}
    </div>
  );
};

export default CouponsManagement;
