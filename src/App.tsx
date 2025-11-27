import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddStudent from "./pages/admin/AddStudent";
import ManageStudents from "./pages/admin/ManageStudents";
import ViewStudents from "./pages/admin/ViewStudents";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFound from "./pages/NotFound";
// In your router file (e.g., App.tsx or routes.tsx)
import AddTeacher from '@/pages/admin/AddTeacher';
import ManageTeacher from '@/pages/admin/ManageTeacher';
import ViewAllTeachers from '@/pages/admin/vieAllTeachers';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Login Route - Outside Layout (No Navbar) */}
            <Route path="/" element={<Login />} />
            
            {/* All Other Routes - Inside Layout (With Navbar) */}
            <Route path="/*" element={<Layout />}>
              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="add-student"
                  element={<AddStudent />}
                />
                <Route
                  path="add-teacher"
                  element={<AddTeacher />}
                />
                <Route
                  path="manage-teachers"
                  element={<ManageTeacher />}
                />
                <Route
                  path="view-teachers"
                  element={<ViewAllTeachers />}
                />
                <Route
                  path="manage-students"
                  element={<ManageStudents />}
                />
                <Route
                  path="view-students"
                  element={<ViewStudents />}
                />
              </Route>
              
              {/* Teacher Routes */}
              <Route
                path="teacher"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Student Routes */}
              <Route
                path="student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
