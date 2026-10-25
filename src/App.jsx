import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import AlumniProfilePage from './pages/AlumniProfilePage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import MentorshipPage from './pages/MentorshipPage';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import { useState, useEffect } from 'react';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';
import api from './api/client';

export function App() {
  const [dbStatus, setDbStatus] = useState({ checked: false, connected: true });
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        if (res.database) {
          setDbStatus({
            checked: true,
            connected: res.database.connected,
            host: res.database.host,
            error: res.database.error
          });
        }
      })
      .catch(() => {
        setDbStatus({ checked: true, connected: false, error: 'Could not reach backend health check' });
      });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#172033]">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#172033',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '1px solid #E2E8F0'
              }
            }}
          />

          {dbStatus.checked && !dbStatus.connected && !bannerDismissed && (
            <div className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 max-w-5xl mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
                <span>
                  <strong>Database Setup Required:</strong> MongoDB is disconnected. Set your MongoDB Atlas cluster URI in <code className="bg-amber-600/30 px-1.5 py-0.5 rounded font-mono text-[11px]">.env</code> and run <code className="bg-amber-600/30 px-1.5 py-0.5 rounded font-mono text-[11px]">npm run seed</code> to populate data.
                </span>
              </div>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 hover:bg-amber-600/30 rounded text-slate-950 transition shrink-0 ml-2"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Navbar />

          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/directory" element={<AlumniDirectoryPage />} />
              <Route path="/alumni/:id" element={<AlumniProfilePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Role-Protected Dashboards */}
              <Route
                path="/student/dashboard"
                element={
                  <RoleRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/alumni/dashboard"
                element={
                  <RoleRoute allowedRoles={['ALUMNI']}>
                    <AlumniDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />

              {/* Authenticated User Features */}
              <Route
                path="/mentorship"
                element={
                  <ProtectedRoute>
                    <MentorshipPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
