import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Briefcase,
  Calendar,
  Bookmark,
  ShieldCheck,
  Settings,
  LogOut,
  UserCheck,
  Mail,
  PlusCircle,
  FileCheck2,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const role = user.role;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#173B6C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">{user.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                role === 'ALUMNI' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-700'
              }`}>
                {role}
              </span>
              {user.verificationStatus === 'VERIFIED' && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Member" />
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </div>

          {/* STUDENT MENU */}
          {role === 'STUDENT' && (
            <>
              <NavLink
                to="/student/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/directory"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Find Alumni</span>
              </NavLink>

              <NavLink
                to="/mentorship"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mentorship</span>
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs & Internships</span>
              </NavLink>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                <span>College Events</span>
              </NavLink>
            </>
          )}

          {/* ALUMNI MENU */}
          {role === 'ALUMNI' && (
            <>
              <NavLink
                to="/alumni/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to={`/alumni/${user._id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <GraduationCap className="w-4 h-4" />
                <span>My Public Profile</span>
              </NavLink>

              <NavLink
                to="/mentorship"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mentorship Requests</span>
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Briefcase className="w-4 h-4" />
                <span>Post & Manage Jobs</span>
              </NavLink>

              <NavLink
                to="/directory"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Alumni Directory</span>
              </NavLink>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </NavLink>
            </>
          )}

          {/* ADMIN MENU */}
          {role === 'ADMIN' && (
            <>
              <button
                onClick={() => onTabChange ? onTabChange('overview') : navigate('/admin/dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === 'overview' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Analytics</span>
              </button>

              <button
                onClick={() => onTabChange ? onTabChange('verification') : navigate('/admin/dashboard?tab=verification')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === 'verification' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Alumni Verification</span>
              </button>

              <button
                onClick={() => onTabChange ? onTabChange('jobs') : navigate('/admin/dashboard?tab=jobs')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === 'jobs' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Job Moderation</span>
              </button>

              <button
                onClick={() => onTabChange ? onTabChange('users') : navigate('/admin/dashboard?tab=users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === 'users' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </button>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Events</span>
              </NavLink>

              <button
                onClick={() => onTabChange ? onTabChange('messages') : navigate('/admin/dashboard?tab=messages')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === 'messages' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Inquiries</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Settings & Sign Out */}
      <div className="pt-4 border-t border-slate-200 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings & Profile</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
