'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface AuthUserDto {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
}

interface AuthContextValue {
  user: AuthUserDto | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: AuthUserDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUser(): AuthUserDto | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUserDto) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = useCallback((token: string, userData: AuthUserDto) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      // The backend sets the HttpOnly accessToken cookie, so no JS cookie manipulation here.
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      // Call backend to clear the HttpOnly cookie
      fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout` : 'http://localhost:8080/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
