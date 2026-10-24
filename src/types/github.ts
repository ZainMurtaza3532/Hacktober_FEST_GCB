/**
 * GitHub Label definition from REST API
 */
export interface GithubLabel {
  id: number;
  node_id?: string;
  url?: string;
  name: string;
  color: string;
  default?: boolean;
  description: string | null;
}

/**
 * Simplified GitHub User reference
 */
export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

/**
 * Standard Issue structure conforming to the user requirements
 */
export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels: GithubLabel[];
  comments: number;
  created_at: string;
  body: string | null;
  state: 'open' | 'closed';
  user?: GithubUser;
  // Computed property helper for clean UI display (owner/repo)
  repository_name: string;
}

/**
 * Raw GitHub Search API response format
 */
export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<{
    id: number;
    number: number;
    title: string;
    html_url: string;
    repository_url: string;
    labels: GithubLabel[];
    comments: number;
    created_at: string;
    body: string | null;
    state: 'open' | 'closed';
    user?: GithubUser;
  }>;
}

/**
 * Quick skill filter pills for Feature 2
 */
export type SkillFilter = 'All' | 'JavaScript' | 'React' | 'Python' | 'Documentation';

/**
 * Structured filter options for fetching issues
 */
export interface FetchIssuesOptions {
  skill?: SkillFilter | string;
  goodFirstIssue?: boolean;
  searchQuery?: string;
  language?: string;
  label?: string;
  keyword?: string;
  page?: number;
  perPage?: number;
}

/**
 * Structured API Error with rate limit metadata
 */
export interface ApiError {
  message: string;
  isRateLimit?: boolean;
  rateLimitReset?: Date;
  status?: number;
}
