
import React, { useEffect, useState } from 'react';
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

const AdminRoutes = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(!!localStorage.getItem('adminIdToken'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminIdToken');
    setAdminLoggedIn(false);
    navigate('/admin/login');
  };

  useEffect(() => {
    if (!adminLoggedIn && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    } else if (adminLoggedIn && location.pathname === '/admin/login') {
      navigate('/admin/dashboard');
    }
  }, [adminLoggedIn, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin setAdminLoggedIn={setAdminLoggedIn} />} />
      {adminLoggedIn && (
        <Route
          path="/admin/*"
          element={<AdminLayout handleLogout={handleLogout} />}
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
      )}
      {!adminLoggedIn && <Route path="/admin/*" element={<AdminLogin setAdminLoggedIn={setAdminLoggedIn} />} />}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
