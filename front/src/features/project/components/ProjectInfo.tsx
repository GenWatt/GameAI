import React from 'react';
import type { IProject } from '@/shared/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import ImageComponent from '@/components/ui/image';

interface ProjectInfoProps {
    project: IProject;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
    return (
        <Card className="overflow-hidden border-0 pt-0 bg-card shadow-md">
            <div className="relative h-36 w-full bg-muted">
                {project.imageUrl ? (
                    <ImageComponent
                        src={project.imageUrl}
                        alt={project.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-muted">
                        <span className="text-2xl font-bold text-primary/70">{project.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                    <Badge variant={project.type === 'special' ? 'default' : 'secondary'}>
                        {project.type}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {project.description && (
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};