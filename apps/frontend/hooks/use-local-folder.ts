'use client';

import { useCallback, useState } from 'react';

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

  const openFolder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // @ts-expect-error - File System Access API
      const dirHandle = await window.showDirectoryPicker();
      const fileTree = await readDirectory(dirHandle, '/');
      setFiles(fileTree);

      return fileTree;
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'SecurityError') {
        setError(err.message || 'Failed to open folder');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const readDirectory = async (
    dirHandle: FileSystemDirectoryHandle,
    path: string
  ): Promise<FileNode[]> => {
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

    entries.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
    return entries;
  };

  const readFile = useCallback(async (path: string): Promise<string> => {
    return `// File content for ${path}`;
  }, []);

  return {
    files,
    loading,
    error,
    openFolder,
    readFile,
  };
}
