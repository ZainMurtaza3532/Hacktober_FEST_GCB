import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ExternalLink,
  FolderGit2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  FileText,
  Code2,
  Atom,
  Flame,
  Terminal,
  GitPullRequest,
  Bot,
} from 'lucide-react';
import { GithubIssue } from '../types/github';
import { ContributionChecklist } from './ContributionChecklist';
import { useContributionChecklist } from '../hooks/useContributionChecklist';

interface UnderstandIssueDrawerProps {
  issue: GithubIssue | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'insights' | 'checklist';
}

interface PrerequisiteItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Extracts the first ~300 characters of clean text from issue.body,
 * removing code fences, raw markdown images, html comments, and badges.
 */
export function getQuickSummary(body: string | null, maxChars: number = 300): string {
  if (!body || !body.trim()) {
    return 'No description provided by the repository maintainer.';
  }

  // 1. Strip code blocks ```...```
  let clean = body.replace(/```[\s\S]*?```/g, '');
  // 2. Strip inline code `...`
  clean = clean.replace(/`([^`]+)`/g, '$1');
  // 3. Strip HTML comments <!-- ... -->
  clean = clean.replace(/<!--[\s\S]*?-->/g, '');
  // 4. Strip markdown image links ![alt](url)
  clean = clean.replace(/!\[.*?\]\(.*?\)/g, '');
  // 5. Strip markdown links [text](url) -> keep text only
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // 6. Strip headers (#, ##, etc.)
  clean = clean.replace(/^#+\s+/gm, '');
  // 7. Collapse excessive whitespace and newlines
  clean = clean.replace(/\s+/g, ' ').trim();

  if (clean.length <= maxChars) {
    return clean;
  }

  // Truncate cleanly at word boundary
  const sliced = clean.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 200 ? sliced.slice(0, lastSpace) : sliced) + '...';
}

/**
 * Rule-based offline engine to infer prerequisites dynamically
 * based on labels, repository name, issue title, and body.
 */
export function inferPrerequisites(issue: GithubIssue): PrerequisiteItem[] {
  const prereqs: PrerequisiteItem[] = [];

  const textToInspect = [
    issue.title,
    issue.repository_name,
    ...(issue.labels?.map((l) => l.name) || []),
    issue.body || '',
  ]
    .join(' ')
    .toLowerCase();

  // 1. React / Next.js Detection
  if (
    textToInspect.includes('react') ||
    textToInspect.includes('next.js') ||
    textToInspect.includes('jsx') ||
    textToInspect.includes('tsx')
  ) {
    prereqs.push({
      id: 'react',
      title: 'React Fundamentals',
      description: 'Requires basic knowledge of React components, hooks (useState, useEffect), and JSX syntax.',
      icon: <Atom className="w-4 h-4 text-cyan-400" />,
    });
  }

  // 2. TypeScript Detection
  if (
    textToInspect.includes('typescript') ||
    textToInspect.includes('type definition') ||
    textToInspect.includes('interfaces')
  ) {
    prereqs.push({
      id: 'ts',
      title: 'TypeScript Basics',
      description: 'Requires familiarity with TypeScript interfaces, type annotations, and strict type checking.',
      icon: <Code2 className="w-4 h-4 text-blue-400" />,
    });
  }

  // 3. Python Detection
  if (
    textToInspect.includes('python') ||
    textToInspect.includes('django') ||
    textToInspect.includes('flask') ||
    textToInspect.includes('fastapi') ||
    textToInspect.includes('pytest')
  ) {
    prereqs.push({
      id: 'python',
      title: 'Python Workflow',
      description: 'Requires foundational Python syntax, virtual environment (venv) setup, and running pip packages.',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    });
  }

  // 4. Documentation / Technical Writing Detection
  if (
    textToInspect.includes('documentation') ||
    textToInspect.includes('doc') ||
    textToInspect.includes('readme') ||
    textToInspect.includes('typo') ||
    textToInspect.includes('guide')
  ) {
    prereqs.push({
      id: 'docs',
      title: 'Technical Writing',
      description: 'Requires clear writing, Markdown formatting, and grammar review (no deep programming required!).',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
    });
  }

  // 5. CSS / UI / Styling Detection
  if (
    textToInspect.includes('css') ||
    textToInspect.includes('tailwind') ||
    textToInspect.includes('ui') ||
    textToInspect.includes('layout') ||
    textToInspect.includes('style')
  ) {
    prereqs.push({
      id: 'ui',
      title: 'Modern CSS & Styling',
      description: 'Requires understanding of responsive web design, layout primitives (Flexbox/Grid), and CSS classes.',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    });
  }

  // 6. Bug Fixing / Testing
  if (
    textToInspect.includes('bug') ||
    textToInspect.includes('fix') ||
    textToInspect.includes('test') ||
    textToInspect.includes('reproduce')
  ) {
    prereqs.push({
      id: 'testing',
      title: 'Debugging & Reproduction',
      description: 'Ability to follow reproduction steps locally and verify assertions before committing changes.',
      icon: <Terminal className="w-4 h-4 text-violet-400" />,
    });
  }

  // Default fallback if no specific frameworks were detected
  if (prereqs.length === 0) {
    prereqs.push({
      id: 'general',
      title: 'JavaScript / Web Basics',
      description: 'Requires general familiarity with web development concepts and package management (npm / yarn).',
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
    });
  }

  // Standard universal prerequisite
  prereqs.push({
    id: 'git',
    title: 'Git & GitHub Workflow',
    description: 'Comfortable with forking a repository, creating a branch, and submitting a Pull Request.',
    icon: <GitPullRequest className="w-4 h-4 text-slate-300" />,
  });

  return prereqs;
}

export const UnderstandIssueDrawer: React.FC<UnderstandIssueDrawerProps> = ({
  issue,
  isOpen,
  onClose,
  initialTab = 'insights',
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'checklist'>(initialTab);
  const [copiedComment, setCopiedComment] = useState(false);
  const [showAiPlaceholder, setShowAiPlaceholder] = useState(false);

  // Sync tab if initialTab changes or drawer reopens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab, issue?.id]);

  const { completedCount, totalCount, isAllCompleted } = useContributionChecklist(issue);

  // Suggested comment template
  const commentTemplate = 'Hi! I would love to work on this issue. Can you please assign it to me?';

  // Keyboard shortcut: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const quickSummary = useMemo(() => {
    return issue ? getQuickSummary(issue.body) : '';
  }, [issue]);

  const prerequisites = useMemo(() => {
    return issue ? inferPrerequisites(issue) : [];
  }, [issue]);

  if (!isOpen || !issue) return null;

  const handleCopyComment = () => {
    navigator.clipboard.writeText(commentTemplate);
    setCopiedComment(true);
    setTimeout(() => setCopiedComment(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-2xl bg-slate-900/95 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 sm:px-8 border-b border-slate-800/90 bg-slate-950/60 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Repo & Issue Badge */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2">
                <FolderGit2 className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`https://github.com/${issue.repository_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  {issue.repository_name}
                </a>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">#{issue.number}</span>
              </div>

              <h2
                id="drawer-title"
                className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2"
              >
                {issue.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 sm:px-8">
            <button
              type="button"
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'insights'
                  ? 'border-indigo-500 text-white shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <span>Issue Insights</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'border-indigo-500 text-white shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${isAllCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}
              />
              <span>Contribution Checklist</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isAllCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : completedCount > 0
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {completedCount}/{totalCount}
              </span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            {activeTab === 'checklist' ? (
              <ContributionChecklist issue={issue} />
            ) : (
              <>
                {/* Section 1: Quick Summary */}
                <section className="glass-panel rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Quick Summary</span>
                <span className="text-[10px] lowercase text-slate-500 font-normal">
                  (~300 chars extracted)
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {quickSummary}
              </p>
            </section>

            {/* Section 2: Dynamically Inferred Prerequisites */}
            <section className="glass-panel rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  <span>Prerequisites</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Rule-based inference
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prerequisites.map((prereq) => (
                  <div
                    key={prereq.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                      {prereq.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 mb-1">
                        {prereq.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        {prereq.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Suggested Next Steps */}
            <section className="glass-panel rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Suggested Next Steps</span>
              </div>

              <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
                {/* Step 1 */}
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">
                      Read the issue conversation
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-light">
                      Check existing comments to ensure nobody has already been assigned or opened an active Pull Request.
                    </p>
                  </div>
                </li>

                {/* Step 2 */}
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-200">
                      Comment politely to claim the issue
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 mb-2 leading-relaxed font-light">
                      Ask the maintainers to assign it to you before starting work:
                    </p>

                    {/* Copyable polite message */}
                    <div className="flex items-center justify-between bg-slate-950/90 rounded-xl px-3.5 py-2.5 border border-slate-800">
                      <span className="text-xs italic text-indigo-300 font-mono pr-2">
                        "{commentTemplate}"
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyComment}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-all flex-shrink-0"
                      >
                        {copiedComment ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </li>

                {/* Step 3 */}
                <li className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">
                      Check the repository's CONTRIBUTING.md
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-light">
                      Review their guidelines for code style, branch naming conventions, test commands, and PR templates before writing code.
                    </p>
                  </div>
                </li>
              </ol>

              {/* Ready to Contribute Checklist CTA */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 rounded-xl p-4 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-indigo-200 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ready to start working?</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Follow the 6-step checklist with dynamically generated commands and progress tracking.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 flex-shrink-0"
                >
                  <span>Launch Checklist ({completedCount}/{totalCount})</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Section 4: Optional/Experimental AI Breakdown Toggle */}
            <section className="rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-purple-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-200 tracking-wide">
                    ✨ AI Breakdown (Optional / Experimental)
                  </span>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowAiPlaceholder(!showAiPlaceholder)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showAiPlaceholder ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                  aria-pressed={showAiPlaceholder}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showAiPlaceholder ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible AI Architecture Placeholder */}
              {showAiPlaceholder ? (
                <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] text-indigo-300 font-medium">
                    <span>LLM Integration Ready (Gemini / Claude / OpenAI)</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Experimental
                    </span>
                  </div>

                  {/* Simulated Output / Architecture Wireup */}
                  <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs text-slate-300 font-mono">
                    <div className="text-emerald-400 font-semibold">
                      // AI Breakdown Preview (Ready for API integration):
                    </div>
                    <div>
                      <strong className="text-slate-200">Target Files:</strong>{' '}
                      <span className="text-indigo-300">
                        {issue.repository_name.includes('react')
                          ? 'packages/react/src/...'
                          : 'src/components/, docs/'}
                      </span>
                    </div>
                    <div>
                      <strong className="text-slate-200">Estimated Effort:</strong>{' '}
                      <span className="text-emerald-400">Beginner (15 - 45 mins)</span>
                    </div>
                    <div>
                      <strong className="text-slate-200">Implementation Hint:</strong>{' '}
                      <span className="text-slate-400">
                        Locate the referenced component or documentation file, reproduce the scenario, and apply the fix with a minimal diff.
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal font-light">
                    Tip: When connected to an API key, this module sends the issue title and body to generate an automated PR implementation plan.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-2 font-light">
                  Toggle on to preview the experimental LLM breakdown card schema.
                </p>
              )}
            </section>
          </>
        )}
      </div>

          {/* Footer CTAs */}
          <div className="px-6 py-4 sm:px-8 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>{issue.comments} comments on GitHub</span>
            </div>

            <div className="flex items-center space-x-2.5">
              {activeTab === 'insights' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 transition-colors inline-flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Contribution Checklist ({completedCount}/{totalCount})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('insights')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors inline-flex items-center space-x-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Issue Insights</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
              >
                Close
              </button>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
