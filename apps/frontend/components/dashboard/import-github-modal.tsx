'use client';

import { useState } from 'react';
import { GitBranch, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImportGitHubModalProps {
  onImport?: (url: string) => void;
  onOpenFolder?: () => void;
}

export function ImportGitHubModal({ onImport, onOpenFolder }: ImportGitHubModalProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('github');

  const handleImport = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      await onImport?.(url);
      setOpen(false);
      setUrl('');
    } catch (error) {
      console.error('Failed to import:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFolder = () => {
    onOpenFolder?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GitBranch className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
          <DialogDescription>Import from GitHub or open a local folder.</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="local">Local Folder</TabsTrigger>
          </TabsList>

          <TabsContent value="github" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repo"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleImport()}
              />
              <p className="text-xs text-muted-foreground">
                Paste any public GitHub repository URL
              </p>
            </div>
            <Button className="w-full" onClick={handleImport} disabled={!url.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Import from GitHub
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="local" className="space-y-4 py-4">
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Open a local folder to start coding
              </p>
              <Button onClick={handleOpenFolder}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Folder
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
