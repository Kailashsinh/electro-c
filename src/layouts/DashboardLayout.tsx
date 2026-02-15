import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Wrench, ClipboardList, CreditCard,
  Bell, LogOut, Menu, X, Zap, ChevronRight,
  Users, Briefcase, User, Bot, Github
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const userNav: NavItem[] = [
  { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { label: 'My Appliances', path: '/user/appliances', icon: Wrench },
  { label: 'My Requests', path: '/user/requests', icon: ClipboardList },
  { label: 'Smart Troubleshooter', path: '/user/troubleshoot', icon: Bot },
  { label: 'Subscription', path: '/user/subscription', icon: CreditCard },
  { label: 'Notifications', path: '/user/notifications', icon: Bell },
  { label: 'Profile', path: '/user/profile', icon: User },
];

const technicianNav: NavItem[] = [
  { label: 'Dashboard', path: '/technician/dashboard', icon: LayoutDashboard },
  { label: 'Incoming Requests', path: '/technician/requests', icon: ClipboardList },
  { label: 'Profile', path: '/technician/profile', icon: User },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Technicians', path: '/admin/technicians', icon: Briefcase },
  { label: 'Requests', path: '/admin/requests', icon: ClipboardList },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = role === 'admin' ? adminNav : role === 'technician' ? technicianNav : userNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      { }
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      { }
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto shadow-2xl lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          { }
          <div className="flex items-center gap-3 p-6 border-b border-gray-100/50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">ElectroCare</span>
            <button className="lg:hidden ml-auto text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          { }
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${isActive
                    ? 'text-white shadow-lg shadow-indigo-500/25'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'group-hover:text-indigo-600'}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto text-white/80 relative z-10" />}
                </Link>
              );
            })}
          </nav>

          { }
          <div className="p-4 border-t border-gray-100/50">
            <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 text-sm font-bold shadow-sm overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      { }
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        { }
        <header className="sticky top-0 z-30 h-20 border-b border-white/20 bg-white/70 backdrop-blur-2xl flex items-center px-6 lg:px-8 shadow-sm">
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link
              to={role === 'user' ? '/user/notifications' : '#'}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200 relative"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Link
              to={role?.toLowerCase() === 'technician' ? '/technician/profile' : '/user/profile'}
              className="relative z-50 block"
            >
              <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
            </Link>
          </div>
        </header>

        { }
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>

          { }
          <footer className="mt-12 border-t border-gray-200 py-8 bg-white/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">

                { }
                <div className="col-span-1 md:col-span-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">ElectroCare</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Your trusted partner for home appliance repairs and services. Expert technicians, transparent pricing, and instant booking.
                  </p>
                </div>

                { }
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Quick Links</h3>
                  <ul className="space-y-2 text-xs text-gray-600 font-medium">
                    {role === 'technician' ? (
                      <>
                        <li><Link to="/technician/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                        <li><Link to="/technician/requests" className="hover:text-indigo-600 transition-colors">Incoming Requests</Link></li>
                        <li><Link to="/technician/profile" className="hover:text-indigo-600 transition-colors">My Profile</Link></li>
                      </>
                    ) : role === 'admin' ? (
                      <>
                        <li><Link to="/admin/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                        <li><Link to="/admin/users" className="hover:text-indigo-600 transition-colors">Manage Users</Link></li>
                        <li><Link to="/admin/technicians" className="hover:text-indigo-600 transition-colors">Manage Technicians</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/user/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                        <li><Link to="/user/requests" className="hover:text-indigo-600 transition-colors">My Requests</Link></li>
                        <li><Link to="/user/troubleshoot" className="hover:text-indigo-600 transition-colors">Smart AI Support</Link></li>
                        <li><Link to="/user/profile" className="hover:text-indigo-600 transition-colors">My Profile</Link></li>
                      </>
                    )}
                  </ul>
                </div>

                { }
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Contact Us</h3>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Email:</span>
                      <a href="mailto:kailashsinhrajput25@gmail.com" className="hover:text-indigo-600">kailashsinhrajput25@gmail.com</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Phone:</span>
                      <span className="font-mono">9712360092</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-semibold text-gray-400">HQ:</span>
                      <span>Ahmedabad, Gujarat</span>
                    </li>
                  </ul>
                </div>

                { }
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Developed By</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Kailashsinh Rajput', url: 'https://github.com/Kailashsinh' },
                      { name: 'Dhruvil Vyas', url: 'https://github.com/DhruviilVyas' },
                      { name: 'Abhay Parmar', url: 'https://github.com/ABHAYPARMAR9499' }
                    ].map(dev => (
                      <a
                        key={dev.name}
                        href={dev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-1.5 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors group border border-transparent hover:border-indigo-100"
                      >
                        <Github className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">{dev.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} ElectroCare Services. All rights reserved.</p>
                <div className="flex gap-4">
                  <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>
                  <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
