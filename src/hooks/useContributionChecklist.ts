import { useState, useEffect, useCallback, useRef } from 'react';
import { GithubIssue } from '../types/github';
import { fireCelebrationConfetti } from '../utils/confetti';

export type ChecklistStepId = 'fork' | 'clone' | 'branch' | 'test' | 'commit' | 'pr';

export const CHECKLIST_STEP_IDS: ChecklistStepId[] = [
  'fork',
  'clone',
  'branch',
  'test',
  'commit',
  'pr',
];

export interface ChecklistState {
  fork: boolean;
  clone: boolean;
  branch: boolean;
  test: boolean;
  commit: boolean;
  pr: boolean;
}

const DEFAULT_STATE: ChecklistState = {
  fork: false,
  clone: false,
  branch: false,
  test: false,
  commit: false,
  pr: false,
};

function getStorageKey(issue: GithubIssue | null): string | null {
  if (!issue) return null;
  const sanitizedRepo = (issue.repository_name || 'repo').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `openstart_checklist_${sanitizedRepo}_${issue.number}`;
}

export function getStoredChecklistProgress(issue: GithubIssue | null): { completed: number; total: number } {
  const key = getStorageKey(issue);
  if (!key) return { completed: 0, total: 6 };
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { completed: 0, total: 6 };
    const parsed = JSON.parse(raw);
    const completed = CHECKLIST_STEP_IDS.filter((id) => Boolean(parsed[id])).length;
    return { completed, total: 6 };
  } catch {
    return { completed: 0, total: 6 };
  }
}

export function useContributionChecklist(issue: GithubIssue | null) {
  const storageKey = getStorageKey(issue);

  const [steps, setSteps] = useState<ChecklistState>(() => {
    if (!storageKey) return DEFAULT_STATE;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          fork: Boolean(parsed.fork),
          clone: Boolean(parsed.clone),
          branch: Boolean(parsed.branch),
          test: Boolean(parsed.test),
          commit: Boolean(parsed.commit),
          pr: Boolean(parsed.pr),
        };
      }
    } catch (e) {
      console.warn('Failed to parse checklist state from localStorage:', e);
    }
    return DEFAULT_STATE;
  });

  // Track previous count to trigger confetti only on completion transition
  const prevCompletedCountRef = useRef<number>(0);

  // Sync state whenever the selected issue changes
  useEffect(() => {
    if (!storageKey) {
      setSteps(DEFAULT_STATE);
      prevCompletedCountRef.current = 0;
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const loaded: ChecklistState = {
          fork: Boolean(parsed.fork),
          clone: Boolean(parsed.clone),
          branch: Boolean(parsed.branch),
          test: Boolean(parsed.test),
          commit: Boolean(parsed.commit),
          pr: Boolean(parsed.pr),
        };
        setSteps(loaded);
        const count = CHECKLIST_STEP_IDS.filter((id) => loaded[id]).length;
        prevCompletedCountRef.current = count;
        return;
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }

    setSteps(DEFAULT_STATE);
    prevCompletedCountRef.current = 0;
  }, [storageKey]);

  const completedCount = CHECKLIST_STEP_IDS.filter((id) => steps[id]).length;
  const totalCount = CHECKLIST_STEP_IDS.length;
  const isAllCompleted = completedCount === totalCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Save to localStorage and check for completion transition
  const saveState = useCallback(
    (nextState: ChecklistState) => {
      setSteps(nextState);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(nextState));
          // Also persist this as active issue info
          if (issue) {
            localStorage.setItem(
              'openstart_active_issue',
              JSON.stringify({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                repository_name: issue.repository_name,
                html_url: issue.html_url,
              })
            );
          }
        } catch (e) {
          console.warn('Failed to save checklist state to localStorage:', e);
        }
      }

      const nextCompletedCount = CHECKLIST_STEP_IDS.filter((id) => nextState[id]).length;
      if (nextCompletedCount === totalCount && prevCompletedCountRef.current < totalCount) {
        fireCelebrationConfetti();
      }
      prevCompletedCountRef.current = nextCompletedCount;
    },
    [storageKey, issue, totalCount]
  );

  const toggleStep = useCallback(
    (stepId: ChecklistStepId) => {
      saveState({
        ...steps,
        [stepId]: !steps[stepId],
      });
    },
    [steps, saveState]
  );

  const setStep = useCallback(
    (stepId: ChecklistStepId, value: boolean) => {
      saveState({
        ...steps,
        [stepId]: value,
      });
    },
    [steps, saveState]
  );

  const resetChecklist = useCallback(() => {
    saveState(DEFAULT_STATE);
  }, [saveState]);

  const completeAll = useCallback(() => {
    saveState({
      fork: true,
      clone: true,
      branch: true,
      test: true,
      commit: true,
      pr: true,
    });
  }, [saveState]);

  return {
    steps,
    toggleStep,
    setStep,
    resetChecklist,
    completeAll,
    completedCount,
    totalCount,
    progressPercent,
    isAllCompleted,
  };
}
