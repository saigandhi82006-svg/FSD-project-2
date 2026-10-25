import React from 'react';
import { Sparkles, User, GraduationCap, ShieldCheck } from 'lucide-react';

export const DemoCredentialsBanner = ({ onSelectDemo }) => {
  const accounts = [
    {
      role: 'Student',
      email: 'rohan.student@college.edu',
      password: 'Student@123',
      name: 'Rohan Sharma (B.Tech CSE)',
      icon: GraduationCap,
      color: 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
    },
    {
      role: 'Alumni',
      email: 'priya.sharma@microsoft.com',
      password: 'Alumni@123',
      name: 'Priya Sharma (Microsoft)',
      icon: User,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
    },
    {
      role: 'Admin',
      email: 'admin@college.edu',
      password: 'Admin@123456',
      name: 'Dean of Alumni Affairs',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-6">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>Quick Demo Account Switcher (Click to auto-fill)</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        Easily evaluate all 3 user roles during assessment or project demonstration:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {accounts.map((acc) => {
          const Icon = acc.icon;
          return (
            <button
              key={acc.role}
              type="button"
              onClick={() => onSelectDemo && onSelectDemo(acc.email, acc.password)}
              className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 ${acc.color}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold">{acc.role} Demo</div>
                <div className="text-[10px] opacity-80 truncate">{acc.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoCredentialsBanner;
