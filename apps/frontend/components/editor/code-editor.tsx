'use client';

import { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  readOnly?: boolean;
  path?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  readOnly = false,
  path,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        width="100%"
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          bracketPairColorization: { enabled: true },
          renderWhitespace: 'selection',
          cursorBlinking: 'smooth',
        }}
      />
    </div>
  );
}
