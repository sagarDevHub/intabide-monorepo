'use client';

import Link from 'next/link';
import { FolderOpen, Star, MoreVertical, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  id: string;
  name: string;
  template: 'nextjs' | 'express';
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  onStar?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  id,
  name,
  template,
  createdAt,
  updatedAt,
  starred,
  onStar,
  onDelete,
}: ProjectCardProps) {
  const templateColors = {
    nextjs: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    express: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  const templateLabels = {
    nextjs: 'Next.js',
    express: 'Express.js',
  };

  return (
    <Card className="group hover:border-primary/20 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Link href={`/playground/${id}`}>
              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
            </Link>
            <Badge variant="outline" className={templateColors[template]}>
              {templateLabels[template]}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onStar?.(id)}>
            <Star
              className={`h-4 w-4 transition-all ${
                starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/playground/${id}`}>Open Playground</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
