import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).role;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(getRoleFromToken(localStorage.getItem('token')));

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setRole(getRoleFromToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
