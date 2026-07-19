'use client';

import { Terminal } from './terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/cn';

interface TerminalDockProps {
  className?: string;
  onTerminalInput?: (data: string) => void;
}

export function TerminalDock({ className, onTerminalInput }: TerminalDockProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <Tabs defaultValue="terminal" className="flex flex-col h-full">
        <TabsList className="h-8 px-2 rounded-none border-b justify-start bg-transparent">
          <TabsTrigger value="terminal" className="text-xs data-[state=active]:bg-background">
            Terminal
          </TabsTrigger>
          <TabsTrigger value="problems" className="text-xs data-[state=active]:bg-background">
            Problems
          </TabsTrigger>
          <TabsTrigger value="output" className="text-xs data-[state=active]:bg-background">
            Output
          </TabsTrigger>
          <TabsTrigger value="debug" className="text-xs data-[state=active]:bg-background">
            Debug Console
          </TabsTrigger>
        </TabsList>
        <TabsContent value="terminal" className="flex-1 m-0 overflow-hidden">
          <Terminal onInput={onTerminalInput} />
        </TabsContent>
        <TabsContent value="problems" className="flex-1 m-0 overflow-auto p-2">
          <div className="text-sm text-muted-foreground">No problems found in workspace</div>
        </TabsContent>
        <TabsContent value="output" className="flex-1 m-0 overflow-auto p-2">
          <div className="text-sm text-muted-foreground">Ready</div>
        </TabsContent>
        <TabsContent value="debug" className="flex-1 m-0 overflow-auto p-2">
          <div className="text-sm text-muted-foreground">Debug console ready</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
