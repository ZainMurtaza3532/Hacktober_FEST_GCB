import React from 'react';
import { GithubIssue, ApiError } from '../types/github';
import { IssueCard } from './IssueCard';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBanner } from './ErrorBanner';
import { SearchX, RotateCcw } from 'lucide-react';

interface IssueListProps {
  issues: GithubIssue[];
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  onResetFilters: () => void;
  onInspect: (issue: GithubIssue, initialTab?: 'insights' | 'checklist') => void;
}

export const IssueList: React.FC<IssueListProps> = ({
  issues,
  isLoading,
  error,
  onRetry,
  onResetFilters,
  onInspect,
}) => {
  // Error state
  if (error) {
    return <ErrorBanner error={error} onRetry={onRetry} />;
  }

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // Empty state matching requirement
  if (issues.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-slate-800/80 my-8 max-w-xl mx-auto shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-5 border border-indigo-500/20 shadow-inner">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2 font-['Outfit']">
          No issues found matching your filters.
        </h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
          Try clearing some tags, adjusting your keywords, or toggling off "good first issue" to see more results.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  // Grid of cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} onInspect={onInspect} />
      ))}
    </div>
  );
};
