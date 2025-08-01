import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaBox, FaShoppingCart, FaCalendarAlt, FaPlus, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';



const DashboardHome = () => {
  const [stats, setStats] = useState({ users: 3, products: 50, orders: 10, appointments: 2 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const socket = io('http://localhost:5000');
  const navigate = useNavigate();


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminIdToken');
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem('adminIdToken');
        const res = await axios.get('http://localhost:5000/api/admin/recent-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch recent orders:', err);
        // Fallback mock data
        setRecentOrders([
          { _id: '1', userName: 'Kamran Khan', status: 'Pending', total: 1299 },
          { _id: '2', userName: 'Amit Sharma', status: 'Delivered', total: 899 },
          
        ]);
      }
    };

    fetchStats();
    fetchRecentOrders();

    
  }, []);

  const cards = [
    { name: 'Users', count: stats.users, icon: <FaUser className="text-blue-500" /> },
    { name: 'Products', count: stats.products, icon: <FaBox className="text-green-500" /> },
    { name: 'Orders', count: stats.orders, icon: <FaShoppingCart className="text-yellow-500" /> },
    { name: 'Appointments', count: stats.appointments, icon: <FaCalendarAlt className="text-purple-500" /> },
  ];

  const quickActions = [
    {
      label: 'Add Product',
      icon: <FaPlus />,
      onClick: () => navigate('/admin/products'),
    },
    {
      label: 'View Orders',
      icon: <FaClipboardList />,
      onClick: () => navigate('/admin/orders'),
    },
    {
      label: 'Manage Appointments',
      icon: <FaCalendarAlt />,
      onClick: () => navigate('/admin/appointments'),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1">Good {getGreeting()}, Admin 👋</h2>
      <p className="text-gray-600 mb-6 font-semibold">Welcome to your Vet&Meet Admin Dashboard.</p>

      {/* Stats Cards */}
      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-gray-50 border p-4 rounded-lg flex items-center space-x-4 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="text-3xl">{card.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{card.name}</h3>
                <p className="text-xl font-bold text-gray-700">{card.count}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="bg-orange-400 hover:bg-orange-500 transition p-3 rounded-lg shadow flex items-center justify-center space-x-2 text-white font-bold"
          >
            <span>{action.icon}</span>
            <span className="font-semibold">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{order.userName}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2 font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No recent orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;


