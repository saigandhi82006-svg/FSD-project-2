import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#173B6C] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">Alumni Network</span>
                <span className="text-xs font-semibold text-[#F59E0B] tracking-wider uppercase block">Directory</span>
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Connecting college students, esteemed alumni, and academic departments to foster
              meaningful mentorship, campus placement guidance, internships, and lifelong professional relationships.
            </p>
            <div className="flex items-center gap-3 text-xs text-blue-200">
              <span className="px-2.5 py-1 bg-white/10 rounded-md font-medium">B.Tech · M.Tech · MBA · MCA</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-md font-medium">FSD Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B] mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/directory" className="hover:text-white transition">Alumni Directory</Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition">Job & Internship Board</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">College & Alumni Events</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About the Platform</Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B] mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/register" className="hover:text-white transition">Student Registration</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">Alumni Verification</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Member Login</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Help & Support</Link>
              </li>
            </ul>
          </div>

          {/* Campus Office Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F59E0B] mb-4">Alumni Relations</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <span>Alumni Cell & TPO, Administrative Block, Main Campus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>alumni.relations@college.edu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 (080) 2854-8900</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Alumni Network Directory. All rights reserved. Designed for Indian Colleges.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Role-Based Access Control
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Full Stack MERN Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
