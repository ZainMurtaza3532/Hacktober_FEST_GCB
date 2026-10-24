import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 animate-pulse flex flex-col justify-between border border-slate-800/60 min-h-[260px]">
      <div>
        {/* Repo & Badge skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
          <div className="h-4 w-10 bg-slate-800 rounded-md"></div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-5 w-4/5 bg-slate-800 rounded-md"></div>
          <div className="h-5 w-2/3 bg-slate-800 rounded-md"></div>
        </div>

        {/* Body preview skeleton */}
        <div className="space-y-1.5 mb-5">
          <div className="h-3 w-full bg-slate-800/60 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-800/60 rounded"></div>
          <div className="h-3 w-3/4 bg-slate-800/60 rounded"></div>
        </div>
      </div>

      <div>
        {/* Tags skeleton */}
        <div className="flex space-x-2 mb-4">
          <div className="h-5 w-16 bg-slate-800 rounded"></div>
          <div className="h-5 w-24 bg-slate-800 rounded"></div>
        </div>

        {/* Footer skeleton */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div className="h-3.5 w-24 bg-slate-800 rounded"></div>
          <div className="h-3.5 w-16 bg-slate-800 rounded"></div>
        </div>
      </div>
    </div>
  );
};
