import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';

interface AuthContextType {

  user: any | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("gbu_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.login(email, password);

      const roleMap: any = {
        1: "admin",
        2: "student",
        3: "teacher",
      };

      const roleString = roleMap[data.role];
      if (!roleString) {
        toast.error("Invalid user role returned from server");
        return false;
      }

      // Save everything
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", roleString);   // <-- FIXED
      localStorage.setItem("gbu_user", JSON.stringify({
        ...data,
        role: roleString,      // <-- FIXED
      }));

      setUser({
        ...data,
        role: roleString,
      });

      // Navigation based on role
      navigate(`/${roleString}`);

      toast.success(`Welcome, ${data.name}!`);
      return true;

    } catch (err) {
      toast.error("Invalid credentials");
      return false;
    }
  };


  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
