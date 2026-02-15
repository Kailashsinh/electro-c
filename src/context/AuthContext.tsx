import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';

export type UserRole = 'user' | 'technician' | 'admin';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser, role: UserRole) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('electrocare_token');
    const storedUser = localStorage.getItem('electrocare_user');
    const storedRole = localStorage.getItem('electrocare_role') as UserRole | null;

    if (storedToken && storedUser && storedRole) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('electrocare_token');
        localStorage.removeItem('electrocare_user');
        localStorage.removeItem('electrocare_role');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, user: AuthUser, role: UserRole) => {
    localStorage.setItem('electrocare_token', token);
    localStorage.setItem('electrocare_user', JSON.stringify(user));
    localStorage.setItem('electrocare_role', role);
    setToken(token);
    setUser(user);
    setRole(role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('electrocare_token');
    localStorage.removeItem('electrocare_user');
    localStorage.removeItem('electrocare_role');
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      if (role === 'user') {
        const res = await authApi.getUserProfile();
        setUser(res.data);
        localStorage.setItem('electrocare_user', JSON.stringify(res.data));
      } else if (role === 'technician') {
        const res = await authApi.getTechnicianProfile();
        setUser(res.data);
        localStorage.setItem('electrocare_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [role]);

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
