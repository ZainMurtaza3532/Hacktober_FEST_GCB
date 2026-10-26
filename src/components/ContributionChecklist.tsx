import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  RotateCcw,
  GitFork,
  Terminal,
  GitBranch,
  CheckCircle2,
  GitCommit,
  GitPullRequest,
  Trophy,
  PartyPopper,
  Info,
} from 'lucide-react';
import { GithubIssue } from '../types/github';
import {
  useContributionChecklist,
  ChecklistStepId,
} from '../hooks/useContributionChecklist';
import { fireCelebrationConfetti } from '../utils/confetti';

interface ContributionChecklistProps {
  issue: GithubIssue | null;
  onClose?: () => void;
  className?: string;
}

export const ContributionChecklist: React.FC<ContributionChecklistProps> = ({
  issue,
  className = '',
}) => {
  const {
    steps,
    toggleStep,
    resetChecklist,
    completedCount,
    totalCount,
    progressPercent,
    isAllCompleted,
  } = useContributionChecklist(issue);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!issue) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl border border-slate-800">
        <Info className="w-10 h-10 mx-auto mb-3 text-slate-500" />
        <h3 className="text-base font-semibold text-slate-200">No issue selected</h3>
        <p className="text-xs text-slate-400 mt-1">
          Select an issue from the list to track your contribution checklist progress.
        </p>
      </div>
    );
  }

  const repoName = issue.repository_name || 'owner/repository';
  const branchName = `fix-issue-${issue.number}`;
  const repoUrl = `https://github.com/${repoName}`;
  const forkUrl = `https://github.com/${repoName}/fork`;
  const prUrl = `https://github.com/${repoName}/pulls`;

  // Generated Git commands dynamically populated with issue details
  const cloneCmd = `git clone https://github.com/${repoName}.git`;
  const branchCmd = `git checkout -b ${branchName}`;
  const commitCmd = `git commit -m "fix: resolve issue #${issue.number}"`;
  const pushCmd = `git push origin ${branchName}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress & Header Card */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          className={`absolute -right-16 -top-16 w-44 h-44 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
            isAllCompleted
              ? 'bg-emerald-500/25 opacity-100'
              : 'bg-indigo-500/15 opacity-80'
          }`}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Step-by-Step Contribution Checklist</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Track Your Progress to Your First Merged PR
              </h3>
            </div>

            <div className="flex items-center space-x-2.5 self-start sm:self-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isAllCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20 animate-pulse'
                    : completedCount > 0
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700/60'
                }`}
              >
                {isAllCompleted
                  ? '🎉 All 6 Steps Completed!'
                  : `${completedCount} of ${totalCount} Completed`}
              </span>

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  title="Reset all checkboxes"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>
                Progress: <strong className="text-slate-200">{completedCount}/{totalCount}</strong> steps completed
              </span>
              <span className="font-mono text-indigo-300 font-bold">{progressPercent}%</span>
            </div>

            <div className="h-3 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Encouraging Badge & Celebration Card (when 6/6 completed) */}
      {isAllCompleted && (
        <div className="relative rounded-2xl p-5 sm:p-6 border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-indigo-950/40 shadow-xl shadow-emerald-950/30 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex-shrink-0 shadow-lg shadow-emerald-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-400 animate-bounce" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1.5">
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>Encouraging Badge: Ready for Merge</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  🎉 Fantastic Job! You're Ready to Submit Your PR!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-light">
                  You've completed every step from forking to pushing your branch.
                  Reference <code className="text-indigo-300 font-mono">Fixes #{issue.number}</code> in your pull request description so it links automatically!
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open Pull Request</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={fireCelebrationConfetti}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                <span>Celebrate Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The 6 Steps Container */}
      <div className="space-y-4">
        {/* ================= STEP 1: Fork Repository ================= */}
        <StepCard
          stepNumber={1}
          stepId="fork"
          isDone={steps.fork}
          onToggle={() => toggleStep('fork')}
          icon={<GitFork className="w-4 h-4 text-indigo-400" />}
          title="Fork Repository"
          subtitle="Fork the repository to your GitHub account to create your personal writable remote copy."
        >
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Repository URL:</div>
            <div className="flex items-center justify-between bg-slate-950/90 rounded-xl px-3.5 py-2 font-mono text-xs border border-slate-800">
              <span className="text-indigo-300 truncate mr-2 select-all">{repoUrl}</span>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(repoUrl, 'step1-url')}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 transition-colors"
                  title="Copy repository link"
                >
                  {copiedKey === 'step1-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={forkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <span>Fork on GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </StepCard>

        {/* ================= STEP 2: Clone locally ================= */}
        <StepCard
          stepNumber={2}
          stepId="clone"
          isDone={steps.clone}
          onToggle={() => toggleStep('clone')}
          icon={<Terminal className="w-4 h-4 text-cyan-400" />}
          title="Clone locally"
          subtitle="Clone your repository fork to your local machine using git clone."
        >
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Run in your terminal:</div>
            <CommandBox
              command={cloneCmd}
              copied={copiedKey === 'step2-clone'}
              onCopy={() => copyToClipboard(cloneCmd, 'step2-clone')}
            />
            <p className="text-[11px] text-slate-500 font-light">
              Tip: After cloning, remember to enter the folder with{' '}
              <code className="text-slate-300 font-mono">cd {repoName.split('/')[1] || 'repo'}</code>.
            </p>
          </div>
        </StepCard>

        {/* ================= STEP 3: Create branch ================= */}
        <StepCard
          stepNumber={3}
          stepId="branch"
          isDone={steps.branch}
          onToggle={() => toggleStep('branch')}
          icon={<GitBranch className="w-4 h-4 text-emerald-400" />}
          title="Create branch"
          subtitle={`Create and switch to a descriptive feature branch for issue #${issue.number}.`}
        >
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Create isolated branch:</div>
            <CommandBox
              command={branchCmd}
              copied={copiedKey === 'step3-branch'}
              onCopy={() => copyToClipboard(branchCmd, 'step3-branch')}
            />
            <p className="text-[11px] text-slate-500 font-light">
              Tip: Never write fixes directly on the main/master branch so you can easily sync upstream updates.
            </p>
          </div>
        </StepCard>

        {/* ================= STEP 4: Make changes & run tests ================= */}
        <StepCard
          stepNumber={4}
          stepId="test"
          isDone={steps.test}
          onToggle={() => toggleStep('test')}
          icon={<CheckCircle2 className="w-4 h-4 text-amber-400" />}
          title="Make changes & run tests"
          subtitle="Implement the bug fix or feature, review changed files with git diff, and verify the test suite passes."
        >
          <div className="mt-3 space-y-2.5">
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/80">
                <span>Check status & test verification:</span>
                <span className="text-indigo-400">verification commands</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-300">git status</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('git status', 'step4-status')}
                  className="text-slate-400 hover:text-white text-xs inline-flex items-center space-x-1"
                >
                  {copiedKey === 'step4-status' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">npm test || pytest || cargo test</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('npm test', 'step4-test')}
                  className="text-slate-400 hover:text-white text-xs inline-flex items-center space-x-1"
                >
                  {copiedKey === 'step4-test' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-light">
              Make sure existing unit tests pass and add new test cases covering this specific bug or enhancement.
            </p>
          </div>
        </StepCard>

        {/* ================= STEP 5: Commit with clean message ================= */}
        <StepCard
          stepNumber={5}
          stepId="commit"
          isDone={steps.commit}
          onToggle={() => toggleStep('commit')}
          icon={<GitCommit className="w-4 h-4 text-violet-400" />}
          title="Commit with clean message"
          subtitle="Stage your changes and write a descriptive conventional commit message."
        >
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Stage & commit:</div>
            <CommandBox
              command={commitCmd}
              copied={copiedKey === 'step5-commit'}
              onCopy={() => copyToClipboard(commitCmd, 'step5-commit')}
            />
            <p className="text-[11px] text-slate-500 font-light">
              Tip: Standard prefix format: <code className="text-slate-300 font-mono">fix:</code>,{' '}
              <code className="text-slate-300 font-mono">feat:</code>, or{' '}
              <code className="text-slate-300 font-mono">docs:</code> followed by issue number #{issue.number}.
            </p>
          </div>
        </StepCard>

        {/* ================= STEP 6: Push & Open Pull Request ================= */}
        <StepCard
          stepNumber={6}
          stepId="pr"
          isDone={steps.pr}
          onToggle={() => toggleStep('pr')}
          icon={<GitPullRequest className="w-4 h-4 text-pink-400" />}
          title="Push & Open Pull Request"
          subtitle="Push your committed branch to your GitHub fork and submit your PR to the upstream repository."
        >
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Push branch to origin:</div>
            <CommandBox
              command={pushCmd}
              copied={copiedKey === 'step6-push'}
              onCopy={() => copyToClipboard(pushCmd, 'step6-push')}
            />

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-light">
                Once pushed, click below to open your Pull Request directly on GitHub:
              </span>

              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all hover:scale-105"
              >
                <span>Open PR on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </StepCard>
      </div>
    </div>
  );
};

interface StepCardProps {
  stepNumber: number;
  stepId: ChecklistStepId;
  isDone: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  isDone,
  onToggle,
  icon,
  title,
  subtitle,
  children,
}) => {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
        isDone
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
          : 'glass-panel border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start space-x-3.5">
        {/* Interactive Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isDone}
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950 ${
            isDone
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
              : 'bg-slate-950 border border-slate-700/80 hover:border-indigo-400 text-transparent'
          }`}
          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
        >
          <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'text-slate-950' : 'opacity-0'}`} />
        </button>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              onClick={onToggle}
              className="cursor-pointer select-none flex items-center space-x-2"
            >
              <div className="p-1 rounded-md bg-slate-950/60 border border-slate-800">
                {icon}
              </div>
              <h4
                className={`text-sm sm:text-base font-bold transition-colors ${
                  isDone
                    ? 'text-emerald-300 line-through decoration-emerald-500/40'
                    : 'text-slate-100'
                }`}
              >
                {stepNumber}. {title}
              </h4>
            </div>

            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
              }`}
            >
              {isDone ? 'Completed' : 'Pending'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
};

interface CommandBoxProps {
  command: string;
  copied: boolean;
  onCopy: () => void;
}

const CommandBox: React.FC<CommandBoxProps> = ({ command, copied, onCopy }) => {
  return (
    <div className="flex items-center justify-between bg-slate-950/95 rounded-xl px-3.5 py-2.5 font-mono text-xs border border-slate-800 shadow-inner group">
      <span className="text-emerald-400 truncate mr-3 select-all tracking-wide">{command}</span>
      <button
        type="button"
        onClick={onCopy}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
          copied
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:text-white'
        }`}
        title="Copy command to clipboard"
      >
        {copied ? (
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
  );
};
