import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-3xl flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable in the directory.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B6C] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
