/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import StaffDashboard from './pages/StaffDashboard';
import StaffView from './pages/StaffView';
import ClientView from './pages/ClientView';
import ClientProfile from './pages/ClientProfile';
import AdminView from './pages/AdminView';
import AdminProfile from './pages/AdminProfile';
import StaffProfile from './pages/StaffProfile';
import StaffRota from './pages/StaffRota';
import StaffPolicies from './pages/StaffPolicies';
import AdminInterviews from './pages/AdminInterviews';
import AdminFinance from './pages/AdminFinance';
import AdminCompliance from './pages/AdminCompliance';
import AdminClients from './pages/AdminClients';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        
        {/* Staff Routes */}
        <Route path="staff" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="staff/shift" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffView /></ProtectedRoute>} />
        <Route path="staff/profile" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffProfile /></ProtectedRoute>} />
        <Route path="staff/rota" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffRota /></ProtectedRoute>} />
        <Route path="staff/policies" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffPolicies /></ProtectedRoute>} />
        
        {/* Client Routes */}
        <Route path="client" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientView /></ProtectedRoute>} />
        <Route path="client/profile" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientProfile /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminView />} />
          <Route path="interviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminInterviews /></ProtectedRoute>} />
          <Route path="finance" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>} />
          <Route path="compliance" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompliance /></ProtectedRoute>} />
          <Route path="clients" element={<ProtectedRoute allowedRoles={['admin']}><AdminClients /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
