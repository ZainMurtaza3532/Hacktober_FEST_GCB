import React from 'react';
import {
  MessageSquare,
  ExternalLink,
  Calendar,
  FolderGit2,
  Sparkles,
  GitPullRequest,
  BookOpen,
} from 'lucide-react';
import { GithubIssue } from '../types/github';

interface IssueCardProps {
  issue: GithubIssue;
  onInspect: (issue: GithubIssue) => void;
}

/**
 * Format ISO date string into human friendly "X days ago"
 */
function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes <= 1) return 'just now';
        return `${diffMinutes} mins ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return dateStr;
  }
}

/**
 * Clean body snippet preview
 */
function getSnippet(body: string | null): string {
  if (!body) return 'No description provided by the maintainer.';
  return body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/#+\s/g, '')
    .trim()
    .slice(0, 140) + '...';
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onInspect }) => {
  // Identify key labels
  const isGoodFirst = issue.labels.some((l) =>
    l.name.toLowerCase().includes('good first')
  );

  return (
    <article className="group relative flex flex-col justify-between glass-panel hover:bg-slate-900/90 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 border border-slate-800/80 hover:border-indigo-500/40">
      <div>
        {/* Header: Repository name & Comment count */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 min-w-0">
            <FolderGit2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <a
              href={`https://github.com/${issue.repository_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-indigo-300 transition-colors truncate tracking-wide"
              title={issue.repository_name}
            >
              {issue.repository_name}
            </a>
          </div>

          <div
            className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 flex-shrink-0"
            title={`${issue.comments} comments`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{issue.comments}</span>
          </div>
        </div>

        {/* Issue Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2 leading-snug mb-2.5">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline focus:outline-none"
          >
            {issue.title}
          </a>
        </h3>

        {/* Issue Body Preview */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 font-light leading-relaxed">
          {getSnippet(issue.body)}
        </p>

        {/* Badges/Tags for labels */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {isGoodFirst && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-400" />
              good first issue
            </span>
          )}

          {issue.labels
            .filter((l) => !l.name.toLowerCase().includes('good first'))
            .slice(0, 3)
            .map((label) => (
              <span
                key={label.id || label.name}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-slate-700/60"
                style={{
                  borderLeftColor: label.color ? `#${label.color}` : undefined,
                  borderLeftWidth: '3px',
                }}
              >
                {label.name}
              </span>
            ))}

          {issue.labels.length > 4 && (
            <span className="text-[10px] text-slate-500 self-center">
              +{issue.labels.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div>
        {/* Metadata info: Created Date formatted as "X days ago" */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 mb-4">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Opened {formatTimeAgo(issue.created_at)}</span>
          </div>
          <span className="text-[11px] text-slate-500">#{issue.number}</span>
        </div>

        {/* Two Action Buttons: "View on GitHub" & "Inspect & Contribute" */}
        <div className="grid grid-cols-2 gap-2">
          {/* Action 1: View on GitHub */}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:text-white"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Action 2: Understand Issue Drawer */}
          <button
            type="button"
            onClick={() => onInspect(issue)}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Understand Issue</span>
          </button>
        </div>
      </div>
    </article>
  );
};
