// vetnmeet-admin-frontend/src/components/Analytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartBar, FaShoppingCart, FaUsers, FaDollarSign, FaCalendarCheck, FaBox } from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalOrdersMonth: 0,
    totalSalesMonth: 0,
    newUsersMonth: 0,
    topSellingProducts: [],
    appointmentStats: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    },
    salesByMonth: [],
    appointmentsByStatus: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://vetmeet-admin-dashboard-api.onrender.com/api/admin'; // Your backend admin API base URL

  // Mock Data (replace with actual API calls in useEffect)
  const mockAnalyticsData = {
    totalOrdersMonth: 125,
    totalSalesMonth: 85000, // in INR
    newUsersMonth: 45,
    topSellingProducts: [
      { name: 'Premium Dog Food 10kg', sales: 15000, units: 120 },
      { name: 'Anti-Tick Shampoo', sales: 8000, units: 250 },
      { name: 'Cat Litter (Clumping)', sales: 7200, units: 180 },
      { name: 'Puppy Training Pads', sales: 5000, units: 300 },
      { name: 'Pet Grooming Kit', sales: 4500, units: 50 },
    ],
    appointmentStats: {
      pending: 15,
      confirmed: 60,
      completed: 120,
      cancelled: 5,
    },
    salesByMonth: [
      { name: 'Jan', sales: 40000 },
      { name: 'Feb', sales: 45000 },
      { name: 'Mar', sales: 60000 },
      { name: 'Apr', sales: 55000 },
      { name: 'May', sales: 70000 },
      { name: 'Jun', sales: 85000 },
    ],
    appointmentsByStatus: [
      { name: 'Pending', value: 15 },
      { name: 'Confirmed', value: 60 },
      { name: 'Completed', value: 120 },
      { name: 'Cancelled', value: 5 },
    ],
  };

  const PIE_COLORS = ['#FFBB28', '#00C49F', '#0088FE', '#FF8042']; // Colors for pie chart segments

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminIdToken');
        if (!token) {
          setError('Admin not logged in.');
          setLoading(false);
          return;
        }

        // In a real application, you would make multiple axios calls here
        // or a single call to a comprehensive analytics endpoint.
        // Example:
        // const [ordersRes, salesRes, usersRes, productsRes, appointmentsRes] = await Promise.all([
        //   axios.get(`${API_BASE_URL}/analytics/orders-month`, { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${API_BASE_URL}/analytics/sales-month`, { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${API_BASE_URL}/analytics/new-users-month`, { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${API_BASE_URL}/analytics/top-products`, { headers: { Authorization: `Bearer ${token}` } }),
        //   axios.get(`${API_BASE_URL}/analytics/appointment-stats`, { headers: { Authorization: `Bearer ${token}` } }),
        // ]);
        // setAnalyticsData({
        //   totalOrdersMonth: ordersRes.data.count,
        //   totalSalesMonth: salesRes.data.total,
        //   newUsersMonth: usersRes.data.count,
        //   topSellingProducts: productsRes.data,
        //   appointmentStats: appointmentsRes.data,
        //   salesByMonth: salesRes.data.monthlyData, // Assuming your sales API returns this
        //   appointmentsByStatus: appointmentsRes.data.statusBreakdown, // Assuming your appointments API returns this
        // });

        // For now, use mock data
        setTimeout(() => { // Simulate API delay
          setAnalyticsData(mockAnalyticsData);
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to fetch analytics: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaChartBar className="mr-3" /> Analytics Dashboard
      </h2>

      {loading && <p className="text-gray-600">Loading analytics data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-5 rounded-lg shadow-sm flex items-center">
              <FaShoppingCart className="text-blue-600 text-3xl mr-4" />
              <div>
                <p className="text-gray-600 text-sm">Total Orders (This Month)</p>
                <p className="text-2xl font-bold text-blue-800">{analyticsData.totalOrdersMonth}</p>
              </div>
            </div>
            <div className="bg-green-100 p-5 rounded-lg shadow-sm flex items-center">
              <FaDollarSign className="text-green-600 text-3xl mr-4" />
              <div>
                <p className="text-gray-600 text-sm">Total Sales (This Month)</p>
                <p className="text-2xl font-bold text-green-800">₹{analyticsData.totalSalesMonth.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-purple-100 p-5 rounded-lg shadow-sm flex items-center">
              <FaUsers className="text-purple-600 text-3xl mr-4" />
              <div>
                <p className="text-gray-600 text-sm">New Users (This Month)</p>
                <p className="text-2xl font-bold text-purple-800">{analyticsData.newUsersMonth}</p>
              </div>
            </div>
          </div>

          {/* Sales by Month Chart (Line Chart) */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.salesByMonth}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Products */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBox className="mr-2 text-lg" /> Top Selling Products
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Product Name</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Total Sales (₹)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topSellingProducts.length > 0 ? (
                    analyticsData.topSellingProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-sm text-gray-800">{product.name}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">₹{product.sales.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">{product.units}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-gray-500">No top selling products data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Appointment Statistics (Pie Chart and Bar Chart) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCalendarCheck className="mr-2 text-lg" /> Appointment Status Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {analyticsData.appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Appointments by Status (Count)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(analyticsData.appointmentStats).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Number of Appointments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
