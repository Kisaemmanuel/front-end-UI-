import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole');
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail');
  });

  useEffect(() => {
    // Check if user is already logged in
    const auth = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (auth === 'true') {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserEmail(email);
    }
  }, []);

  const login = (email, role) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 