import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTruck, FaDownload, FaSyncAlt, FaUserShield, FaTimesCircle } from 'react-icons/fa';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminIdToken');
        const res = await axios.get('https://vetmeet-admin-dashboard-api.onrender.com/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'shipped' : 'delivered';
    try {
      const token = localStorage.getItem('adminIdToken');
      await axios.put(
        `https://vetmeet-admin-dashboard-api.onrender.com/api/admin/orders/${orderId}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: nextStatus } : order
        )
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDownloadInvoice = (orderId) => {
    alert(`Downloading invoice for order ID: ${orderId}`);
    // Replace with actual download implementation
  };

  const handleDateFilter = (e) => setFilterDate(e.target.value);

  const filteredOrders = filterDate
    ? orders.filter((order) => order.createdAt?.slice(0, 10) === filterDate)
    : orders;

  const getStatusBadge = (status) => {
    const base = "text-xs px-2 py-1 rounded-full font-semibold";
    switch (status) {
      case 'pending':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'shipped':
        return `${base} bg-blue-100 text-blue-800`;
      case 'delivered':
        return `${base} bg-green-100 text-green-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">📦 Orders Management</h2>
        <input
          type="date"
          value={filterDate}
          onChange={handleDateFilter}
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-blue-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-auto rounded-md border">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Order ID</th>
                <th className="py-3 px-4 text-left font-medium">Customer</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Delivery Partner</th>
                <th className="py-3 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 font-mono">{order._id}</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {order.deliveryPartner || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2 text-xs">
                    {order.status !== 'delivered' && (
                      <button
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                        onClick={() =>
                          handleStatusUpdate(order._id, order.status)
                        }
                      >
                        <FaSyncAlt />
                        {order.status === 'pending' ? 'Ship' : 'Deliver'}
                      </button>
                    )}
                    <button
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                      onClick={() => handleDownloadInvoice(order._id)}
                    >
                      <FaDownload />
                      Invoice
                    </button>
                    <button className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-800">
                      <FaUserShield />
                      Assign
                    </button>
                    <button className="inline-flex items-center gap-1 text-red-500 hover:text-red-700">
                      <FaTimesCircle />
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
