import { useState, useEffect, useCallback, useRef } from 'react';
import { GithubIssue, ApiError, SkillFilter } from '../types/github';
import { fetchGithubIssues } from '../services/githubApi';
import { useDebounce } from './useDebounce';

interface UseGithubIssuesOptions {
  skill: SkillFilter;
  goodFirstIssue: boolean;
  searchQuery: string;
}

export function useGithubIssues({
  skill,
  goodFirstIssue,
  searchQuery,
}: UseGithubIssuesOptions) {
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Debounce rapid typing in the search bar (300ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reference for abort controller to avoid race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchGithubIssues({
        skill,
        goodFirstIssue,
        searchQuery: debouncedSearchQuery,
      });

      setIssues(result.issues);
      setTotalCount(result.totalCount);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({
          message: err.message,
          isRateLimit: (err as any).isRateLimit,
          rateLimitReset: (err as any).rateLimitReset,
          status: (err as any).status,
        });
      } else {
        setError({
          message: 'An unexpected error occurred while loading issues.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [skill, goodFirstIssue, debouncedSearchQuery]);

  useEffect(() => {
    loadIssues();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadIssues]);

  return {
    issues,
    totalCount,
    isLoading,
    error,
    refetch: loadIssues,
  };
}
