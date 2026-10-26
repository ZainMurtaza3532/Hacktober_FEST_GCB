import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { IssueList } from './components/IssueList';
import { UnderstandIssueDrawer } from './components/UnderstandIssueDrawer';
import { PersistentChecklistTab } from './components/PersistentChecklistTab';
import { useGithubIssues } from './hooks/useGithubIssues';
import { GithubIssue, SkillFilter } from './types/github';
import { Heart, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Feature 1 & 2 Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<SkillFilter>('All');
  const [goodFirstIssue, setGoodFirstIssue] = useState<boolean>(true);

  // Modal / Drawer state for "Inspect & Contribute" and active tab
  const [selectedIssue, setSelectedIssue] = useState<GithubIssue | null>(null);
  const [drawerTab, setDrawerTab] = useState<'insights' | 'checklist'>('insights');

  const handleOpenIssue = (issue: GithubIssue, tab: 'insights' | 'checklist' = 'insights') => {
    setSelectedIssue(issue);
    setDrawerTab(tab);
  };

  // Fetch issues with 300ms debounce on search input
  const { issues, totalCount, isLoading, error, refetch } = useGithubIssues({
    skill: selectedSkill,
    goodFirstIssue,
    searchQuery,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All');
    setGoodFirstIssue(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Responsive Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Source Kickstart Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-['Outfit']">
            Find Your Next Open Source Contribution
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Discover beginner-friendly GitHub issues tailored to your skills.
            Pick your language, inspect actionable issues, and land your first merged pull request.
          </p>
        </div>

        {/* Feature 1 & 2: Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSkill={selectedSkill}
          onSkillChange={setSelectedSkill}
          goodFirstIssue={goodFirstIssue}
          onToggleGoodFirstIssue={setGoodFirstIssue}
          totalCount={totalCount}
          isLoading={isLoading}
        />

        {/* Issue Grid & Card Container */}
        <section aria-label="Open Source Issues">
          <IssueList
            issues={issues}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onResetFilters={handleResetFilters}
            onInspect={handleOpenIssue}
          />
        </section>
      </main>

      {/* Feature 3 & 4: Understand This Issue Drawer with Contribution Checklist */}
      <UnderstandIssueDrawer
        issue={selectedIssue}
        isOpen={selectedIssue !== null}
        onClose={() => setSelectedIssue(null)}
        initialTab={drawerTab}
      />

      {/* Feature 4: Persistent Contribution Checklist Tab */}
      <PersistentChecklistTab
        activeIssue={selectedIssue}
        onOpenIssueModal={handleOpenIssue}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">OpenStart</span>
            <span>—</span>
            <span>From First Issue to First Contribution</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline" />
            <span>for the open source community</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
