import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import BabysitterDashboard from './pages/BabysitterDashboard';
import ChildManagement from './pages/ChildManagement';
import BabysitterManagement from './pages/BabysitterManagement';
import FinancialManagement from './pages/FinancialManagement';
import ReportIncident from './pages/ReportIncident';
import Schedule from './pages/Schedule';
import ChildAttendance from './pages/ChildAttendance';

const PrivateRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  console.log('PrivateRoute check:', { isAuthenticated, userRole, requiredRole });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`User role (${userRole}) doesn't match required role (${requiredRole}), redirecting to login`);
    return <Navigate to="/login" replace />;
  }

  console.log('Access granted to:', requiredRole);
  return children;
};

const App = () => {
  console.log('App rendered');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <PrivateRoute requiredRole="manager">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/manager/children"
          element={
            <PrivateRoute requiredRole="manager">
              <ChildManagement />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/manager/babysitters"
          element={
            <PrivateRoute requiredRole="manager">
              <BabysitterManagement />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/manager/financial"
          element={
            <PrivateRoute requiredRole="manager">
              <FinancialManagement />
            </PrivateRoute>
          }
        />
        
        {/* Babysitter Routes */}
        <Route
          path="/babysitter"
          element={
            <PrivateRoute requiredRole="babysitter">
              <BabysitterDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/report-incident"
          element={
            <PrivateRoute requiredRole="babysitter">
              <ReportIncident />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/schedule"
          element={
            <PrivateRoute requiredRole="babysitter">
              <Schedule />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/child-attendance"
          element={
            <PrivateRoute requiredRole="babysitter">
              <ChildAttendance />
            </PrivateRoute>
          }
        />
        
        {/* Root Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              {localStorage.getItem('userRole') === 'manager' ? (
                <Navigate to="/manager" replace />
              ) : (
                <Navigate to="/babysitter" replace />
              )}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; 