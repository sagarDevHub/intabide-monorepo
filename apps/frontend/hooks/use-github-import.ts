'use client';

import { useState, useCallback } from 'react';

interface GitHubRepo {
  owner: string;
  repo: string;
  url: string;
}

interface ImportError {
  message: string;
  type?: 'invalid_url' | 'network' | 'unknown';
}

export function useGitHubImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importRepo = useCallback(async (url: string): Promise<GitHubRepo | null> => {
    setLoading(true);
    setError(null);

    try {
      // Extract owner and repo from URL
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL. Please use format: https://github.com/username/repo');
      }

      const [, owner, repo] = match;
      const repoName = repo.replace('.git', '');

      // For now, just return the repo info
      // In production, this would call your backend service
      return {
        owner,
        repo: repoName,
        url: `https://github.com/${owner}/${repoName}`,
      };
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to import repository');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    importRepo,
    clearError,
  };
}
