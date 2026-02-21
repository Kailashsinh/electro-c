import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";


import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";

import NotFound from "@/pages/NotFound";


import UserDashboard from "@/pages/user/Dashboard";
import MyAppliances from "@/pages/user/MyAppliances";
import MyRequests from "@/pages/user/MyRequests";
import RequestDetails from "@/pages/user/RequestDetails";
import CreateServiceRequest from "@/pages/user/CreateServiceRequest";
import SubscriptionPage from "@/pages/user/SubscriptionPage";
import NotificationsPage from "@/pages/user/NotificationsPage";
import ProfilePage from "@/pages/user/ProfilePage";
import SmartTroubleshooter from "@/pages/user/SmartTroubleshooter";


import TechnicianDashboard from "@/pages/technician/Dashboard";
import IncomingRequests from "@/pages/technician/IncomingRequests";
import TechnicianProfile from "@/pages/technician/TechnicianProfile";
import VerificationPage from "@/pages/technician/VerificationPage";



import AdminLogin from './pages/admin/AdminLogin';
import AdminLayoutComponent from './components/layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import TechnicianManagement from './pages/admin/TechnicianManagement';
import RequestManagement from './pages/admin/RequestManagement';
import ApplianceManagement from './pages/admin/ApplianceManagement';
import Reports from './pages/admin/Reports';

const queryClient = new QueryClient();

const UserLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['user']}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const TechLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['technician']}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);



const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster />
        <BrowserRouter>
          <Routes>
            { }
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />


            { }
            <Route path="/user/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
            <Route path="/user/appliances" element={<UserLayout><MyAppliances /></UserLayout>} />
            <Route path="/user/requests" element={<UserLayout><MyRequests /></UserLayout>} />
            <Route path="/user/requests/new" element={<UserLayout><CreateServiceRequest /></UserLayout>} />
            <Route path="/user/requests/:requestId" element={<UserLayout><RequestDetails /></UserLayout>} />
            <Route path="/user/subscription" element={<UserLayout><SubscriptionPage /></UserLayout>} />
            <Route path="/user/notifications" element={<UserLayout><NotificationsPage /></UserLayout>} />
            <Route path="/user/profile" element={<UserLayout><ProfilePage /></UserLayout>} />
            <Route path="/user/troubleshoot" element={<UserLayout><SmartTroubleshooter /></UserLayout>} />

            { }
            <Route path="/technician/dashboard" element={<TechLayout><TechnicianDashboard /></TechLayout>} />
            <Route path="/technician/requests" element={<TechLayout><IncomingRequests /></TechLayout>} />
            <Route path="/technician/profile" element={<TechLayout><TechnicianProfile /></TechLayout>} />
            <Route path="/technician/verification" element={<TechLayout><VerificationPage /></TechLayout>} />

            { }
            { }
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayoutComponent />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="technicians" element={<TechnicianManagement />} />
              <Route path="appliances" element={<ApplianceManagement />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
