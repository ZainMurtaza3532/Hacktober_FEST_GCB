import {
  GithubIssue,
  GithubSearchResponse,
  ApiError,
  FetchIssuesOptions,
} from '../types/github';

const GITHUB_SEARCH_ENDPOINT = 'https://api.github.com/search/issues';

/**
 * Custom error class for GitHub API failures, retaining rate-limit and status metadata.
 */
export class GithubApiError extends Error implements ApiError {
  isRateLimit?: boolean;
  rateLimitReset?: Date;
  status?: number;

  constructor(message: string, status?: number, isRateLimit?: boolean, rateLimitReset?: Date) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
    this.isRateLimit = isRateLimit;
    this.rateLimitReset = rateLimitReset;
  }
}

/**
 * Normalizes input arguments into standard FetchIssuesOptions
 */
function normalizeOptions(
  arg1?: string | FetchIssuesOptions,
  arg2?: string,
  arg3?: string,
  goodFirstIssue: boolean = true
): FetchIssuesOptions {
  if (typeof arg1 === 'object' && arg1 !== null) {
    return {
      goodFirstIssue: true,
      perPage: 24,
      page: 1,
      ...arg1,
    };
  }

  return {
    language: arg1,
    label: arg2,
    keyword: arg3,
    goodFirstIssue,
    page: 1,
    perPage: 24,
  };
}

/**
 * Fetches open issues from the GitHub Public REST API.
 * Formats query according to Feature 1 (Issue Finder) and Feature 2 (Skill Filters):
 * - Quick Pills: "All", "JavaScript", "React", "Python", "Documentation" (label:"documentation")
 * - Extra toggle: "good first issue" (checked by default)
 * - Search input field to search by repository name or keywords
 */
export async function fetchGithubIssues(
  optionsOrLanguage?: string | FetchIssuesOptions,
  labelParam?: string,
  keywordParam?: string,
  goodFirstIssueParam: boolean = true
): Promise<{ issues: GithubIssue[]; totalCount: number }> {
  const options = normalizeOptions(
    optionsOrLanguage,
    labelParam,
    keywordParam,
    goodFirstIssueParam
  );

  const {
    skill = 'All',
    goodFirstIssue = true,
    searchQuery = '',
    language = '',
    label = '',
    keyword = '',
    page = 1,
    perPage = 24,
  } = options;

  // Base Query: open issues only
  const queryTokens: string[] = ['is:issue', 'is:open'];

  // 1. Extra Toggle: "good first issue" (checked by default)
  if (goodFirstIssue) {
    queryTokens.push('label:"good first issue"');
  }

  // 2. Skill Pills Filter
  const currentSkill = (skill || '').trim();
  if (currentSkill && currentSkill !== 'All') {
    switch (currentSkill) {
      case 'JavaScript':
        queryTokens.push('language:javascript');
        break;
      case 'React':
        queryTokens.push('react');
        break;
      case 'Python':
        queryTokens.push('language:python');
        break;
      case 'Documentation':
        queryTokens.push('label:"documentation"');
        break;
      default:
        // Generic language or skill fallback
        queryTokens.push(currentSkill);
        break;
    }
  }

  // Extra direct language parameter if provided separately
  if (language && language.trim() && language.toLowerCase() !== 'all') {
    queryTokens.push(`language:${language.trim().toLowerCase()}`);
  }

  // Extra direct label parameter if provided and not redundant
  if (label && label.trim() && label !== 'good first issue') {
    queryTokens.push(`label:"${label.trim()}"`);
  }

  // 3. Search input (repository name or keywords)
  const combinedSearch = (searchQuery || keyword || '').trim();
  if (combinedSearch) {
    // Check if input looks like a repository: e.g. "facebook/react" or "vercel/next.js"
    const repoMatch = combinedSearch.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (repoMatch) {
      queryTokens.push(`repo:${combinedSearch}`);
    } else if (combinedSearch.startsWith('repo:')) {
      queryTokens.push(combinedSearch);
    } else {
      queryTokens.push(combinedSearch);
    }
  }

  const queryString = queryTokens.join(' ');

  const searchParams = new URLSearchParams({
    q: queryString,
    sort: 'updated',
    order: 'desc',
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const url = `${GITHUB_SEARCH_ENDPOINT}?${searchParams.toString()}`;

  try {
    const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };

    if (githubToken && githubToken.trim() !== '') {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await fetch(url, {
      headers,
    });

    // Handle rate-limiting (HTTP 403 or 429)
    if (response.status === 403 || response.status === 429) {
      const resetHeader = response.headers.get('x-ratelimit-reset');
      let resetDate: Date | undefined;
      let minutesWait = 1;

      if (resetHeader) {
        const resetSeconds = parseInt(resetHeader, 10);
        if (!isNaN(resetSeconds)) {
          resetDate = new Date(resetSeconds * 1000);
          const diffMs = resetDate.getTime() - Date.now();
          minutesWait = Math.max(1, Math.ceil(diffMs / 60000));
        }
      }

      const errorMessage = `GitHub API rate limit reached (Search API is capped at 10 requests/min for public IP). Please wait ${minutesWait} minute${minutesWait > 1 ? 's' : ''} before searching again.`;

      throw new GithubApiError(errorMessage, response.status, true, resetDate);
    }

    if (!response.ok) {
      if (response.status === 422) {
        throw new GithubApiError(
          'GitHub query validation failed. Try adjusting your search keywords or repository name.',
          422
        );
      }
      throw new GithubApiError(
        `GitHub API returned error ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data: GithubSearchResponse = await response.json();

    // Map and normalize to GithubIssue schema
    const issues: GithubIssue[] = (data.items || []).map((item) => {
      // Derive clean "owner/repo" name from "https://api.github.com/repos/{owner}/{repo}"
      const repoMatch = item.repository_url.match(/repos\/([^/]+\/[^/]+)/);
      const repoName = repoMatch ? repoMatch[1] : item.repository_url.split('/').slice(-2).join('/');

      return {
        id: item.id,
        number: item.number,
        title: item.title,
        html_url: item.html_url,
        repository_url: item.repository_url,
        repository_name: repoName,
        labels: item.labels || [],
        comments: item.comments || 0,
        created_at: item.created_at,
        body: item.body || null,
        state: item.state,
        user: item.user,
      };
    });

    return {
      issues,
      totalCount: data.total_count || 0,
    };
  } catch (error: unknown) {
    if (error instanceof GithubApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new GithubApiError(
        'Unable to connect to GitHub. Please check your internet connection.',
        0
      );
    }

    throw new GithubApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred while fetching issues.'
    );
  }
}
