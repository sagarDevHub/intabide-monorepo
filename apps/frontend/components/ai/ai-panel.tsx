'use client';

import { useState } from 'react';
import { Send, Loader2, Sparkles, Bug, Zap, Lightbulb, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIPanelProps {
  className?: string;
  selectedCode?: string;
  selectedFile?: string;
}

export function AIPanel({ className, selectedCode, selectedFile }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI coding assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content: `I received your message: "${input}". This is a mock response. In production, this will connect to Gemini AI.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAIAction = (action: string) => {
    let message = '';
    const code = selectedCode || '// No code selected';

    switch (action) {
      case 'explain':
        message = `Explain this code:\n\n${code}`;
        break;
      case 'optimize':
        message = `Optimize this code:\n\n${code}`;
        break;
      case 'bugs':
        message = `Find bugs in this code:\n\n${code}`;
        break;
      case 'suggest':
        message = `Suggest improvements for this code:\n\n${code}`;
        break;
      case 'summarize':
        message = `Summarize this code:\n\n${code}`;
        break;
      default:
        return;
    }

    setInput(message);
    // Auto-send after a moment
    setTimeout(() => handleSend(), 100);
  };

  const AIActions = [
    { id: 'explain', label: 'Explain', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'optimize', label: 'Optimize', icon: Zap, color: 'text-blue-500' },
    { id: 'bugs', label: 'Find Bugs', icon: Bug, color: 'text-red-500' },
    { id: 'suggest', label: 'Suggest', icon: Sparkles, color: 'text-purple-500' },
    { id: 'summarize', label: 'Summarize', icon: FileText, color: 'text-green-500' },
  ];

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="border-b px-2">
          <TabsList className="h-10 justify-start bg-transparent">
            <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-accent">
              💬 Chat
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs data-[state=active]:bg-accent">
              ⚡ Actions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-4 py-2 text-sm',
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-[10px] opacity-50 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-2 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI something..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="flex-1 m-0 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-2">
            {AIActions.map(action => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto flex-col gap-1 py-3"
                  onClick={() => handleAIAction(action.id)}
                >
                  <Icon className={cn('h-5 w-5', action.color)} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>

          {selectedCode && (
            <Card className="mt-4">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Selected code from: {selectedFile || 'current file'}
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {selectedCode.slice(0, 200)}
                  {selectedCode.length > 200 && '...'}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
