import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Compass,
  ShieldCheck,
  Building,
  Target,
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Institutional Alumni Network Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Bridging the College Campus <br />
          <span className="text-[#2563EB]">with the Tech Industry</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
          The Alumni Network Directory connects current engineering and postgraduate students
          with accomplished alumni across multinational tech companies, startups, and research institutions.
        </p>
      </div>

      {/* Role Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">For Students</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Discover verified seniors, explore real placement interview experiences, request 1-on-1 resume reviews, and apply to exclusive internships.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
            <li>• Direct mentorship requests</li>
            <li>• Off-campus job referrals</li>
            <li>• Tech workshops and events</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">For Alumni</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Give back to your college community. Mentor aspiring engineers, post job vacancies from your current team, and expand your network with peers.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
            <li>• Share career guidance</li>
            <li>• Post hiring opportunities</li>
            <li>• Homecoming & reunions</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">For Administrators</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Institutional governance and verification. Verify alumni degrees against university records, moderate job posts, and track placement analytics.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
            <li>• Institutional verification</li>
            <li>• Opportunity moderation</li>
            <li>• Departmental analytics</li>
          </ul>
        </div>
      </div>

      {/* Tech Architecture Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Architecture & Technical Stack</h3>
            <p className="text-xs text-slate-500">Enterprise MERN Stack implementation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-900 block font-bold mb-1">Frontend</strong>
            <span className="text-slate-600">React 19, Vite, Tailwind CSS, Recharts</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-900 block font-bold mb-1">Backend</strong>
            <span className="text-slate-600">Node.js, Express 5, ES Modules</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-900 block font-bold mb-1">Database</strong>
            <span className="text-slate-600">MongoDB Atlas, Mongoose ODM</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-900 block font-bold mb-1">Security</strong>
            <span className="text-slate-600">JWT, bcryptjs, RBAC, Helmet</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <span>Get Started Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
