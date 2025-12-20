import { createContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (accessToken, userRole, id) => {
    setToken(accessToken);
    setRole(userRole);
    setUserId(id);
    setAuthToken(accessToken); // sync axios
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setToken(null);
    setRole(null);
    setAuthToken(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post('/auth/refresh');
        login(res.data.accessToken, res.data.user.role, res.data.user.id);
      } catch {
        setToken(null);
        setRole(null);
        setUserId(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
