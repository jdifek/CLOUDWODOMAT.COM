import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface Subscription {
  id: string;
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'INCOMPLETE';
  price: number;
  devicesCount: number;
  currentPeriodEnd?: string;
}

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  surname?: string;
  phone?: string;
  company?: string;
  subscription?: Subscription;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/me');
      setUser(response.data);
    } catch  {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const hasActiveSubscription = user?.subscription?.status === 'ACTIVE';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, hasActiveSubscription, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}