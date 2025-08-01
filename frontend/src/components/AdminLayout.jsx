import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import {
  FaUser,
  FaBox,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCalendarCheck,
  FaTag,
  FaBoxes,
  FaChartLine,
  FaStar,
  FaEdit,
} from 'react-icons/fa';

const AdminLayout = ({ handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FaCog />, path: '/admin/dashboard' },
    { name: 'Users', icon: <FaUser />, path: '/admin/users' },
    { name: 'Products', icon: <FaBox />, path: '/admin/products' },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Appointments', icon: <FaCalendarCheck />, path: '/admin/appointments' },
    { name: 'Coupons', icon: <FaTag />, path: '/admin/coupons' },
    { name: 'Inventory', icon: <FaBoxes />, path: '/admin/inventory' },
    { name: 'Analytics', icon: <FaChartLine />, path: '/admin/analytics' },
    { name: 'Reviews', icon: <FaStar />, path: '/admin/reviews' },
    { name: 'CMSManagement', icon: <FaEdit />, path: '/admin/cmsmanagement' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Mobile overlay */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 z-50 transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vet&Meet Admin</h1>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 rounded-md hover:bg-red-700 text-red-300 transition-colors"
          >
            <FaSignOutAlt />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar - Mobile */}
        <header className="bg-white shadow p-4 flex items-center justify-between md:hidden">
          <button className="text-gray-800" onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-2xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div></div>
        </header>

        {/* Page content from nested routes */}
        <main className="p-6 flex-1">
          <Outlet /> {/* 👈 Required to render child routes like dashboard, users, etc. */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
