'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileTree } from '@/components/file-tree/file-tree';
import { Terminal } from '@/components/terminal/terminal';
import { PlaygroundSkeleton } from '@/components/shared/playground-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Square, RefreshCw } from 'lucide-react';
import { AIPanel } from '@/components/ai/ai-panel';

// Mock data - will be replaced with real API calls
const MOCK_FILES = [
  {
    name: 'src',
    path: '/src',
    type: 'folder' as const,
    children: [
      {
        name: 'app',
        path: '/src/app',
        type: 'folder' as const,
        children: [
          { name: 'page.tsx', path: '/src/app/page.tsx', type: 'file' as const },
          { name: 'layout.tsx', path: '/src/app/layout.tsx', type: 'file' as const },
        ],
      },
      { name: 'index.ts', path: '/src/index.ts', type: 'file' as const },
    ],
  },
  {
    name: 'package.json',
    path: '/package.json',
    type: 'file' as const,
  },
];

const MOCK_FILE_CONTENT: Record<string, string> = {
  '/src/app/page.tsx': `export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Hello IntabIDE!</h1>
    </div>
  );
}`,
  '/src/index.ts': `console.log('Hello from IntabIDE!');`,
  '/package.json': `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`,
};

export default function PlaygroundPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState('/src/app/page.tsx');
  const [fileContent, setFileContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    setFileContent(MOCK_FILE_CONTENT[selectedFile] || '// File not found');
  }, [selectedFile]);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  if (loading) {
    return <PlaygroundSkeleton />;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {/* File Tree */}
      <div className="w-64 border-r h-full overflow-hidden">
        <FileTree files={MOCK_FILES} selectedFile={selectedFile} onFileSelect={handleFileSelect} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{selectedFile.split('/').pop()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={fileContent}
            onChange={setFileContent}
            language={
              selectedFile.endsWith('.tsx') || selectedFile.endsWith('.ts')
                ? 'typescript'
                : selectedFile.endsWith('.json')
                  ? 'json'
                  : 'javascript'
            }
            theme="vs-dark"
            path={selectedFile}
          />
        </div>

        {/* Terminal */}
        <div className="h-48 border-t">
          <Tabs defaultValue="terminal" className="h-full">
            <TabsList className="h-8 px-2">
              <TabsTrigger value="terminal" className="text-xs">
                Terminal
              </TabsTrigger>
              <TabsTrigger value="problems" className="text-xs">
                Problems
              </TabsTrigger>
              <TabsTrigger value="output" className="text-xs">
                Output
              </TabsTrigger>
            </TabsList>
            <TabsContent value="terminal" className="h-[calc(100%-2rem)] m-0">
              <Terminal />
            </TabsContent>
            <TabsContent value="problems" className="h-[calc(100%-2rem)] m-0 p-2">
              <div className="text-sm text-muted-foreground">No problems found</div>
            </TabsContent>
            <TabsContent value="output" className="h-[calc(100%-2rem)] m-0 p-2">
              <div className="text-sm text-muted-foreground">Ready</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="w-80 border-l h-full overflow-hidden">
        <AIPanel selectedCode={fileContent} selectedFile={selectedFile} />
      </div>
    </div>
  );
}
