'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { cn } from '@/lib/utils/cn';

interface TerminalProps {
  className?: string;
  onInput?: (data: string) => void;
  onOutput?: (data: string) => void;
}

export function Terminal({ className, onInput, onOutput }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    term.write('\x1b[32m➜\x1b[0m  IntabIDE Terminal\r\n');
    term.write('\x1b[1;32m$\x1b[0m ');

    term.onData(data => {
      onInput?.(data);
    });

    setTerminal(term);

    return () => {
      term.dispose();
    };
  }, []);

  useEffect(() => {
    if (terminal) {
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      fitAddon.fit();

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalRef.current!);

      return () => resizeObserver.disconnect();
    }
  }, [terminal]);

  return (
    <div className={cn('h-full w-full overflow-hidden', className)}>
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}
