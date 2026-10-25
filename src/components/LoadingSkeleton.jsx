import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className={`grid ${type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded-md w-full" />
            <div className="h-3 bg-slate-100 rounded-md w-5/6" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-slate-100 rounded-md w-16" />
            <div className="h-6 bg-slate-100 rounded-md w-20" />
            <div className="h-6 bg-slate-100 rounded-md w-14" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
