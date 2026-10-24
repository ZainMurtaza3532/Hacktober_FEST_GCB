import React from 'react';
import { AlertCircle, Clock, RefreshCw, Info } from 'lucide-react';
import { ApiError } from '../types/github';

interface ErrorBannerProps {
  error: ApiError;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => {
  const isRateLimit = error.isRateLimit;

  return (
    <div
      className={`w-full rounded-2xl p-5 mb-8 border transition-all ${
        isRateLimit
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          : 'bg-red-950/30 border-red-500/40 text-red-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              isRateLimit ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isRateLimit ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>

          <div>
            <h4 className="font-semibold text-sm sm:text-base tracking-tight mb-1">
              {isRateLimit ? 'GitHub API Rate Limit Reached' : 'Unable to Fetch Issues'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {error.message}
            </p>

            {isRateLimit && (
              <div className="mt-2.5 flex items-center space-x-2 text-xs text-amber-300/80">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  GitHub's public unauthenticated Search API has a quota of 10 requests/minute.
                  Your debounced searches help conserve this limit.
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onRetry}
          type="button"
          className="flex-shrink-0 inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 shadow transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
