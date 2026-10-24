import React from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Filter,
  FileText,
  Code2,
  Atom,
  Flame,
  Layers,
} from 'lucide-react';
import { SkillFilter } from '../types/github';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSkill: SkillFilter;
  onSkillChange: (skill: SkillFilter) => void;
  goodFirstIssue: boolean;
  onToggleGoodFirstIssue: (enabled: boolean) => void;
  totalCount: number;
  isLoading: boolean;
}

interface SkillPillConfig {
  id: SkillFilter;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const SKILL_PILLS: SkillPillConfig[] = [
  { id: 'All', label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'JavaScript', label: 'JavaScript', icon: <Code2 className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'React', label: 'React', icon: <Atom className="w-3.5 h-3.5 text-cyan-400" /> },
  { id: 'Python', label: 'Python', icon: <Flame className="w-3.5 h-3.5 text-blue-400" /> },
  { id: 'Documentation', label: 'Documentation', icon: <FileText className="w-3.5 h-3.5 text-emerald-400" /> },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSkill,
  onSkillChange,
  goodFirstIssue,
  onToggleGoodFirstIssue,
  totalCount,
  isLoading,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl border border-slate-800/80">
      {/* Top Search Input & Good First Issue Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 mb-5">
        {/* Search input field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by repository name (e.g. facebook/react) or keywords..."
            className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-normal shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Extra Toggle: "good first issue" (checked by default) */}
        <div className="flex items-center justify-between sm:justify-start space-x-3 px-4 py-2.5 bg-slate-900/80 rounded-xl border border-slate-800/90 flex-shrink-0">
          <label
            htmlFor="good-first-issue-toggle"
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="relative inline-flex items-center">
              <input
                id="good-first-issue-toggle"
                type="checkbox"
                checked={goodFirstIssue}
                onChange={(e) => onToggleGoodFirstIssue(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-semibold text-slate-200 block leading-tight">
                good first issue
              </span>
              <span className="text-[10px] text-slate-400 block">
                {goodFirstIssue ? 'Beginner-friendly only' : 'All open issues'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Feature 2: Quick Skill Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-indigo-400" />
            Skills:
          </span>

          {SKILL_PILLS.map((pill) => {
            const isSelected = selectedSkill === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onSkillChange(pill.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/20 scale-105'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {pill.icon}
                <span>{pill.label}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Live Query / Count Info */}
        <div className="text-right flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          {isLoading ? (
            <span className="text-indigo-400 font-medium animate-pulse">
              Fetching matching issues...
            </span>
          ) : (
            <span>
              Found <strong className="text-slate-200 font-semibold">{totalCount.toLocaleString()}</strong> results
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
