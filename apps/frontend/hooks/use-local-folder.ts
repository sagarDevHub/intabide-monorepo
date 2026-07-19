'use client';

import { useState, useCallback } from 'react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export function useLocalFolder() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readDirectory = useCallback(
    async (dirHandle: FileSystemDirectoryHandle, path: string): Promise<FileNode[]> => {
      const entries: FileNode[] = [];

      for await (const [name, handle] of dirHandle.entries()) {
        const currentPath = path === '/' ? `/${name}` : `${path}/${name}`;

        if (handle.kind === 'directory') {
          const children = await readDirectory(handle as FileSystemDirectoryHandle, currentPath);
          entries.push({
            name,
            path: currentPath,
            type: 'folder',
            children: children.length > 0 ? children : undefined,
          });
        } else {
          entries.push({
            name,
            path: currentPath,
            type: 'file',
          });
        }
      }

      // Sort: folders first, then files alphabetically
      entries.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
      });

      return entries;
    },
    []
  );

  const openFolder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if the browser supports the File System Access API
      if (!('showDirectoryPicker' in window)) {
        setError('Your browser does not support opening folders. Please use Chrome or Edge.');
        setLoading(false);
        return null;
      }

      // @ts-expect-error - File System Access API is not in TypeScript types
      const dirHandle = await window.showDirectoryPicker();
      const fileTree = await readDirectory(dirHandle, '/');
      setFiles(fileTree);

      return fileTree;
    } catch (err) {
      // User cancelled or error occurred
      const error = err as Error;
      if (error.name !== 'AbortError' && error.name !== 'SecurityError') {
        setError(error.message || 'Failed to open folder');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [readDirectory]);

  const readFile = useCallback(async (_path: string): Promise<string> => {
    // This would need to read from the opened folder
    // For now, return a placeholder
    return `// File content for ${_path}`;
  }, []);

  return {
    files,
    loading,
    error,
    openFolder,
    readFile,
  };
}
