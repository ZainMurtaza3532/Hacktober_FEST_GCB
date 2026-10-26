import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  FolderGit2,
  MessageSquare,
} from 'lucide-react';
import { GithubIssue } from '../types/github';
import { ContributionChecklist } from './ContributionChecklist';

interface ContributeModalProps {
  issue: GithubIssue | null;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ issue, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl glass-dropdown rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl border border-slate-700/80 my-8 max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1.5">
              <FolderGit2 className="w-4 h-4" />
              <span>{issue.repository_name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Issue #{issue.number}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Embedded Contribution Checklist */}
        <div className="overflow-y-auto py-5 pr-1">
          <ContributionChecklist issue={issue} onClose={onClose} />
        </div>

        {/* Footer CTAs */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{issue.comments} comments on GitHub</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300"
            >
              Close
            </button>
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Contribute on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
