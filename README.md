# OpenStart: From First Issue to First Contribution 🚀

A modern React web application built for aspiring open-source contributors to discover beginner-friendly GitHub issues ("good first issue"), filter by programming language and keywords, and kickstart their journey to their first merged pull request.

## Tech Stack
- **Framework:** React 18 + Vite (TypeScript)
- **Styling:** Tailwind CSS (Dark-mode palette with modern glassmorphism)
- **Icons:** [Lucide React](https://lucide.dev)
- **Data Source:** [GitHub REST API (Search Issues)](https://docs.github.com/en/rest/search/search#search-issues-and-pull-requests)

## Features Included in This Setup
1. **Responsive Navbar**:
   - Logo: **OpenStart** with gradient icon
   - Tagline: *"From First Issue to First Contribution"*
   - GitHub link & Hacktober ready badge
2. **Modular GitHub REST API Service (`fetchGithubIssues`)**:
   - Queries `https://api.github.com/search/issues`
   - Formats query: `is:issue is:open label:"good first issue" [language:lang] [keyword]`
   - Extracts and normalizes: `title`, `html_url`, `repository_url`, `labels`, `comments`, `created_at`, `body`
   - Dedicated rate-limiting error handling: detects HTTP 403/429, extracts `x-ratelimit-reset` header, and presents user-friendly countdown advice
3. **State Management & Throttling**:
   - React state hooks (`useState`, `useEffect`)
   - Custom `useDebounce` hook throttling search keystrokes by 300ms to safeguard unauthenticated API quotas (10 requests/min limit)
4. **Interactive UI**:
   - Quick pills for top languages (TypeScript, JavaScript, Python, Rust, Go, Java, C++)
   - Label selection pills (`good first issue`, `help wanted`, `beginner-friendly`, `documentation`)
   - Shimmer skeleton loaders for seamless perceived performance
   - Error banner with retry mechanism

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Build for production
npm run build
```
