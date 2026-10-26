import React, { useState, useEffect } from 'react';
import {
  GitPullRequest,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { GithubIssue } from '../types/github';
import { useContributionChecklist } from '../hooks/useContributionChecklist';

interface PersistentChecklistTabProps {
  activeIssue: GithubIssue | null;
  onOpenIssueModal: (issue: GithubIssue, initialTab?: 'insights' | 'checklist') => void;
  onClearActiveIssue?: () => void;
}

export const PersistentChecklistTab: React.FC<PersistentChecklistTabProps> = ({
  activeIssue,
  onOpenIssueModal,
  onClearActiveIssue,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [localActiveIssue, setLocalActiveIssue] = useState<GithubIssue | null>(activeIssue);

  // Sync with prop, or fallback to localStorage if available
  useEffect(() => {
    if (activeIssue) {
      setLocalActiveIssue(activeIssue);
      return;
    }

    try {
      const stored = localStorage.getItem('openstart_active_issue');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalActiveIssue(parsed as GithubIssue);
      }
    } catch (e) {
      console.warn('Failed to read active issue from localStorage:', e);
    }
  }, [activeIssue]);

  const { completedCount, totalCount, progressPercent, isAllCompleted } =
    useContributionChecklist(localActiveIssue);

  // If no issue has ever been selected, don't show the persistent tab
  if (!localActiveIssue) {
    return null;
  }

  const handleOpenChecklist = () => {
    if (localActiveIssue) {
      onOpenIssueModal(localActiveIssue, 'checklist');
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalActiveIssue(null);
    localStorage.removeItem('openstart_active_issue');
    if (onClearActiveIssue) onClearActiveIssue();
  };

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <aside aria-label="Contribution Checklist Widget" className="fixed bottom-5 right-5 z-40 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all hover:scale-105 active:scale-95 group ${
            isAllCompleted
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
              : 'bg-slate-900/90 border-indigo-500/40 text-slate-100 shadow-indigo-950/50'
          }`}
          title="Expand Contribution Checklist tracker"
        >
          <div className="relative flex items-center justify-center">
            <GitPullRequest
              className={`w-4 h-4 ${isAllCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}
            />
            {isAllCompleted && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <span className="text-xs font-semibold">
            Checklist: <strong className="text-white">{completedCount}/{totalCount}</strong>
          </span>

          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </aside>
    );
  }

  // Expanded Persistent Docked Tab View
  return (
    <aside aria-label="Contribution Checklist Widget" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-full px-2 sm:px-0 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`glass-dropdown rounded-2xl p-4 sm:p-4.5 border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all ${
          isAllCompleted
            ? 'border-emerald-500/50 shadow-emerald-950/40'
            : 'border-slate-700/80 hover:border-indigo-500/40 shadow-slate-950/80'
        }`}
      >
        {/* Subtle accent glow */}
        <div
          className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isAllCompleted ? 'bg-emerald-500/20' : 'bg-indigo-600/15'
          }`}
        />

        <div className="relative z-10">
          {/* Top Bar with Repo & Controls */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isAllCompleted ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 truncate">
                Active Checklist
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300 font-mono truncate">
                #{localActiveIssue.number}
              </span>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Minimize checklist tab"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Close active checklist tracker"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Issue title */}
          <h4
            onClick={handleOpenChecklist}
            className="text-xs font-semibold text-slate-100 hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer mb-2.5"
            title={localActiveIssue.title}
          >
            {localActiveIssue.title}
          </h4>

          {/* Progress Bar & Status */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                {isAllCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                )}
                <span>
                  <strong>{completedCount}</strong> of <strong>{totalCount}</strong> steps completed
                </span>
              </span>
              <span className="font-mono text-indigo-300 font-bold">{progressPercent}%</span>
            </div>

            <div className="h-2 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenChecklist}
              className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isAllCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <span>{isAllCompleted ? 'View PR Steps 🎉' : 'Open Checklist'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
