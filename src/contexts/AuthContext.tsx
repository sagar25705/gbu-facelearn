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
    // STEP 1 — Login
    const loginData = await authAPI.login(email, password);

    localStorage.setItem("access_token", loginData.access_token);

    // STEP 2 — Fetch full user profile
    const profile = await authAPI.getCurrentUser();

    // Map roles
    const roleMap: any = {
      1: "admin",
      2: "teacher",
      3: "student",
    };

    const roleString = roleMap[profile.role];

    if (!roleString) {
      toast.error("Invalid role");
      return false;
    }

    const finalUser = {
      ...profile,
      role: roleString,
    };

    // STEP 3 — Save full profile
    localStorage.setItem("gbu_user", JSON.stringify(finalUser));
    localStorage.setItem("user_role", roleString);

    // STEP 4 — setUser
    setUser(finalUser);

    navigate(`/${roleString}`);
    toast.success(`Welcome, ${profile.name}!`);
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