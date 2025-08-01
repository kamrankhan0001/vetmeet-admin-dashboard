// vetnmeet-admin-frontend/src/components/ReviewsManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSpinner, FaFilter, FaSearch } from 'react-icons/fa';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // For individual review status updates
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState(''); // For searching comments/users

  const API_BASE_URL = 'http://localhost:5000/api/admin'; // Your backend admin API base URL

  // Function to fetch reviews from the backend
  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setLoading(false);
        return;
      }

      let url = `${API_BASE_URL}/reviews`;
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to update review status (approve/reject)
  const updateReviewStatus = async (reviewId, newStatus) => {
    setUpdatingId(reviewId);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setUpdatingId(null);
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Update the local state with the updated review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        )
      );
      alert(`Review ${reviewId} status updated to ${newStatus}`); // Replace with custom toast
    } catch (err) {
      console.error('Error updating review status:', err);
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  // Function to mark/unmark review as abusive
  const toggleAbusiveStatus = async (reviewId, currentIsAbusive) => {
    setUpdatingId(reviewId);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setUpdatingId(null);
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}/abusive`,
        { isAbusive: !currentIsAbusive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        )
      );
      alert(`Review ${reviewId} marked as ${!currentIsAbusive ? 'abusive' : 'not abusive'}`);
    } catch (err) {
      console.error('Error toggling abusive status:', err);
      setError('Failed to toggle abusive status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  // Function to delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) {
      return;
    }
    setUpdatingId(reviewId);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setUpdatingId(null);
        return;
      }
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
      alert('Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, searchTerm]); // Re-fetch when filter or search term changes

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? '' : 'text-gray-300'} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaStar className="mr-3" /> Reviews & Ratings Management
      </h2>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search comment or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews found matching your criteria.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Product/Service</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">User</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Rating</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Comment</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Abusive?</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{review.productName || review.serviceName || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{review.userEmail || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{renderStars(review.rating)}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {review.comment}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        review.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-center">
                      <input
                        type="checkbox"
                        checked={review.isAbusive}
                        onChange={() => toggleAbusiveStatus(review._id, review.isAbusive)}
                        className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                        disabled={updatingId === review._id}
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      {updatingId === review._id ? (
                        <FaSpinner className="animate-spin text-blue-500" />
                      ) : (
                        <div className="flex space-x-2">
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => updateReviewStatus(review._id, 'approved')}
                              className="text-green-600 hover:text-green-800"
                              title="Approve Review"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => updateReviewStatus(review._id, 'rejected')}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Reject Review"
                            >
                              <FaTimesCircle />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Review"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
