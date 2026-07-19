'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateProjectButton } from '@/components/dashboard/create-project-button';
import { ImportGitHubModal } from '@/components/dashboard/import-github-modal';
import { ProjectCard } from '@/components/dashboard/project-card';

// Temporary mock data - will be replaced with real API calls
const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'My Next.js App',
    template: 'nextjs' as const,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    starred: true,
  },
  {
    id: '2',
    name: 'Express API Server',
    template: 'express' as const,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    starred: false,
  },
  {
    id: '3',
    name: 'Dashboard UI',
    template: 'nextjs' as const,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    starred: false,
  },
];

export default function DashboardPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStar = (id: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, starred: !p.starred } : p)));
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateProject = (project: { name: string; template: string }) => {
    const newProject = {
      id: Date.now().toString(),
      name: project.name,
      template: project.template as 'nextjs' | 'express',
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const handleImportGitHub = (url: string) => {
    // Extract repo name from URL
    const parts = url.split('/');
    const repoName = parts[parts.length - 1]?.replace('.git', '') || 'imported-repo';

    const newProject = {
      id: Date.now().toString(),
      name: repoName,
      template: 'nextjs' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const starredProjects = filteredProjects.filter(p => p.starred);
  const otherProjects = filteredProjects.filter(p => !p.starred);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your playgrounds and create new projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateProjectButton onProjectCreated={handleCreateProject} />
          <ImportGitHubModal onImport={handleImportGitHub} />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Starred Projects */}
      {starredProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">⭐ Starred</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {starredProjects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                onStar={handleStar}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {starredProjects.length > 0 ? 'All Projects' : 'Projects'}
        </h2>
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first playground to get started.
            </p>
            <CreateProjectButton onProjectCreated={handleCreateProject} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {otherProjects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                onStar={handleStar}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
