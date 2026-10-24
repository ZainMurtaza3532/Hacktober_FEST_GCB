import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  GitPullRequest,
  FolderGit2,
  Copy,
  Check,
  Terminal,
  MessageSquare,
  Sparkles,
  GitBranch,
  BookOpen,
} from 'lucide-react';
import { GithubIssue } from '../types/github';

interface ContributeModalProps {
  issue: GithubIssue | null;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ issue, onClose }) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedBranch, setCopiedBranch] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  const repoName = issue.repository_name || 'repo';
  const branchName = `fix/issue-${issue.number}`;
  const cloneCmd = `git clone https://github.com/${repoName}.git`;
  const branchCmd = `git checkout -b ${branchName}`;

  const copyToClipboard = (text: string, type: 'clone' | 'branch') => {
    navigator.clipboard.writeText(text);
    if (type === 'clone') {
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } else {
      setCopiedBranch(true);
      setTimeout(() => setCopiedBranch(false), 2000);
    }
  };

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

      {/* Modal / Drawer Content */}
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-5 space-y-6 pr-1">
          {/* Labels */}
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {issue.labels.map((l) => (
                <span
                  key={l.id || l.name}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-200"
                  style={{
                    borderLeftColor: l.color ? `#${l.color}` : undefined,
                    borderLeftWidth: '3px',
                  }}
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}

          {/* Contribution Quickstart Workflow */}
          <div className="rounded-2xl p-5 bg-indigo-950/20 border border-indigo-500/30">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>First Contribution Quickstart Guide</span>
            </div>

            <ol className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span>Fork repository on GitHub, then clone your fork:</span>
                  <div className="mt-1.5 flex items-center justify-between bg-slate-950/80 rounded-xl px-3 py-2 font-mono text-xs border border-slate-800">
                    <span className="text-emerald-400 truncate mr-2">{cloneCmd}</span>
                    <button
                      onClick={() => copyToClipboard(cloneCmd, 'clone')}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy clone command"
                    >
                      {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span>Create a new feature branch for this issue:</span>
                  <div className="mt-1.5 flex items-center justify-between bg-slate-950/80 rounded-xl px-3 py-2 font-mono text-xs border border-slate-800">
                    <span className="text-indigo-300 truncate mr-2">{branchCmd}</span>
                    <button
                      onClick={() => copyToClipboard(branchCmd, 'branch')}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy branch command"
                    >
                      {copiedBranch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </li>

              <li className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span>
                    Read the repo's <code className="text-amber-300">CONTRIBUTING.md</code>, make your changes, write tests, and submit a Pull Request referencing <code className="text-indigo-300">#{issue.number}</code>!
                  </span>
                </div>
              </li>
            </ol>
          </div>

          {/* Issue Description */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Issue Description</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-56 overflow-y-auto">
              {issue.body || 'No description provided by the author.'}
            </div>
          </div>
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
