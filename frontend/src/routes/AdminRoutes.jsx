import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import AdminLogin from '../pages/AdminLogin';
import AdminLayout from '../components/AdminLayout';
import DashboardHome from '../pages/DashboardHome';
import UsersManagement from '../pages/UserManagement';
import ProductsManagement from '../pages/ProductsManagement';
import OrdersManagement from '../pages/OrdersManagement';
import AppointmentsManagement from '../pages/AppointmentsManagement';
import CouponsManagement from '../pages/CouponsManagement';
import InventoryManagement from '../pages/InventoryManagement';
import Analytics from '../pages/Analytics';
import ReviewsManagement from '../pages/ReviewsManagement';
import CMSManagement from '../pages/ContentManagementPage';
import PrivateRoute from '../pages/PrivateRoute'; // ✅ Ensure this file exists and is working

const AdminRoutes = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(!!localStorage.getItem('adminIdToken'));
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminIdToken');
    setAdminLoggedIn(false);
    navigate('/admin/login');
  };

  // Redirect based on login state
  useEffect(() => {
    if (!adminLoggedIn && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    } else if (adminLoggedIn && location.pathname === '/admin/login') {
      navigate('/admin/dashboard');
    }
  }, [adminLoggedIn, location.pathname, navigate]);

  return (
    <Routes>
      {/* Public Route - Admin Login */}
      <Route path="/admin/login" element={<AdminLogin setAdminLoggedIn={setAdminLoggedIn} />} />

      {/* Private Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <AdminLayout handleLogout={handleLogout} />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="appointments" element={<AppointmentsManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="cmsmanagement" element={<CMSManagement />} />
        <Route path="*" element={<DashboardHome />} />
      </Route>

      {/* Base route redirect */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
