import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User & { password: string }> = {
  'ADMIN001': {
    id: 'ADMIN001',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@gbu.ac.in',
    role: 'admin',
    password: 'admin123',
  },
  'TEACH001': {
    id: 'TEACH001',
    name: 'Prof. Sharma',
    email: 'sharma@gbu.ac.in',
    role: 'teacher',
    department: 'Computer Science',
    school: 'School of Engineering',
    password: 'teacher123',
  },
  'STU2024001': {
    id: 'STU2024001',
    name: 'Rahul Singh',
    email: 'rahul.singh@gbu.ac.in',
    role: 'student',
    rollNo: '2024CS001',
    department: 'Computer Science',
    school: 'School of Engineering',
    course: 'B.Tech',
    password: 'student123',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('gbu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userId: string, password: string): boolean => {
    const foundUser = mockUsers[userId];
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('gbu_user', JSON.stringify(userWithoutPassword));
      
      // Navigate based on role
      switch (foundUser.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
      }
      
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gbu_user');
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};