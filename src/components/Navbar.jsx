import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  Calendar,
  Users,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import api from '../api/client';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then(res => {
          if (res.success) {
            setUnreadNotifications(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'ALUMNI') return '/alumni/dashboard';
    return '/student/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#173B6C] to-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#173B6C] leading-tight">Alumni Network</div>
            <div className="text-[11px] font-semibold text-[#F59E0B] tracking-wider uppercase">Directory</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/directory"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/directory') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Find Alumni
          </Link>
          <Link
            to="/jobs"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/jobs') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Careers
          </Link>
          <Link
            to="/events"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/events') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Events
          </Link>
          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/about') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/contact') ? 'text-[#2563EB] bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Link button */}
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-[#2563EB] hover:bg-blue-100 rounded-lg text-sm font-semibold transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* Notification icon */}
              <Link
                to={getDashboardPath() + '#notifications'}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition text-left"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#173B6C] text-white flex items-center justify-center font-bold text-xs">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden xl:block">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</div>
                    <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                      <span className="capitalize">{user.role?.toLowerCase()}</span>
                      {user.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-fade-in z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                    </Link>

                    {user.role === 'ALUMNI' && (
                      <Link
                        to={`/alumni/${user._id}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" /> View Public Profile
                      </Link>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Compass className="w-4 h-4 text-slate-400" /> Settings & Profile
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-[#173B6C] hover:text-[#2563EB] transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition"
              >
                Join Network
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              className="p-2 text-[#2563EB] bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Find Alumni
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Careers & Jobs
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            College Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            About Network
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#173B6C] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</div>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 bg-[#2563EB] text-white text-center rounded-lg font-semibold text-sm"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 bg-slate-100 text-slate-700 text-center rounded-lg font-medium text-sm"
                >
                  Settings & Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2.5 px-4 text-red-600 bg-red-50 text-center rounded-lg font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-4 text-center rounded-lg font-semibold text-sm border border-slate-300 text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-4 text-center rounded-lg font-semibold text-sm bg-[#2563EB] text-white"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
