import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Loni2010', // Change this password!
    role: 'admin'
  };

  const TEACHER_CREDENTIALS = {
    username: 'Burim',
    password: 'Profi123', // Change this password!
    role: 'teacher'
  };

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = { username, role: 'admin' };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    } else if (username === TEACHER_CREDENTIALS.username && password === TEACHER_CREDENTIALS.password) {
      const userData = { username, role: 'teacher' };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, role: 'teacher' };
    }
    return { success: false, error: 'Kredencialet e gabuara!' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'admin';
  const isTeacher = () => user?.role === 'teacher' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isAdmin, isTeacher }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
