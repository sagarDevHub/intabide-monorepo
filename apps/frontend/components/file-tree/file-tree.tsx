'use client';

import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  selectedFile?: string;
  onFileSelect?: (path: string) => void;
  onFileCreate?: (path: string, name: string) => void;
  onFileDelete?: (path: string) => void;
}

export function FileTree({
  files,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
}: FileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/']));

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedPaths.has(node.path);
    const isSelected = selectedFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-accent/50 transition-colors',
              'text-sm'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => toggleExpand(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Folder className="h-4 w-4 text-blue-500" />
            <span>{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>{node.children.map(child => renderFileNode(child, level + 1))}</div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-accent/50 transition-colors',
          'text-sm',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onFileSelect?.(node.path)}
      >
        <File className="h-4 w-4 text-muted-foreground" />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex gap-1">
          <button
            className="p-1 rounded hover:bg-accent transition-colors"
            onClick={() => onFileCreate?.('/', 'new-file.txt')}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      {files.map(node => renderFileNode(node))}
    </div>
  );
}
