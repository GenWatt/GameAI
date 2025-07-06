import { Card, CardAction, CardContent } from "@/components/ui/card";
import ImageComponent from "@/components/ui/image";
import type { IProject } from "@/shared/types";
import { Star } from "lucide-react";
import { Link } from "react-router";

export interface ProjectCardProps {
    project: IProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Link to={`/project/${project.id}`} className="no-underline">
            <Card className="p-0 m-0 min-w-60 relative bg-card border-border rounded-lg overflow-hidden hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 cursor-pointer">

                <CardContent className="p-0">
                    <CardAction className="absolute right-2 top-2 ">
                        <Star
                            fill={project.type === 'special' ? 'yellow' : 'transparent'}
                            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200" />
                    </CardAction>

                    <ImageComponent
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full object-cover h-36"
                    />
                </CardContent>
                <div className="p-2">
                    <p className="text-lg font-semibold text-foreground truncate">
                        {project.name}
                    </p>
                </div>
            </Card>
        </Link>
    );
};
