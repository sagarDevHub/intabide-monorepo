export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface Playground {
  id: string;
  name: string;
  template: 'nextjs' | 'express';
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
}

export interface File {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: File[];
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  response: string;
  cached?: boolean;
  remaining?: number;
}
