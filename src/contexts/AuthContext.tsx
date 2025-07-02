import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Demo accounts configuration
const DEMO_ACCOUNTS = {
  'admin@emu.edu.tr': {
    password: 'password',
    user: {
      id: 'admin-001',
      email: 'admin@emu.edu.tr',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'super_admin' as const,
      studentId: 'EMU2024001',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      isActive: true,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  },
  'club@emu.edu.tr': {
    password: 'password',
    user: {
      id: 'club-001',
      email: 'club@emu.edu.tr',
      firstName: 'Club',
      lastName: 'Administrator',
      role: 'club_admin' as const,
      studentId: 'EMU2024002',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      isActive: true,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  },
  'member@emu.edu.tr': {
    password: 'password',
    user: {
      id: 'member-001',
      email: 'member@emu.edu.tr',
      firstName: 'Student',
      lastName: 'Member',
      role: 'member' as const,
      studentId: 'EMU2024003',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      isActive: true,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Convert date strings back to Date objects
          parsedUser.createdAt = new Date(parsedUser.createdAt);
          if (parsedUser.lastLogin) {
            parsedUser.lastLogin = new Date(parsedUser.lastLogin);
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check demo accounts
      const demoAccount = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS];
      
      if (demoAccount && demoAccount.password === password) {
        const authenticatedUser = {
          ...demoAccount.user,
          lastLogin: new Date()
        };
        
        localStorage.setItem('authToken', 'demo-jwt-token-' + Date.now());
        localStorage.setItem('userData', JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        return;
      }
      
      // If not a demo account, throw error
      throw new Error('Invalid credentials');
      
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'member',
        studentId: userData.studentId,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      };

      localStorage.setItem('authToken', 'new-user-jwt-token-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};