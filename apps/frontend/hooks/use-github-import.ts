'use client';

import { useCallback, useState } from 'react';

export function useGithubImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importRepo = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid Github URL');
      }
      const [, owner, repo] = match;
      const repoName = repo.replace('.git', '');

      return {
        owner,
        repo: repoName,
        url: `https://github.com/${owner}/${repoName}`,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to import repository');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    importRepo,
  };
}
