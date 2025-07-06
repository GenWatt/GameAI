import type { IProject } from "@/shared/types"
import { ProjectCard } from "./ProjectCard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface ProjectListProps {
    projects: IProject[]
}

export function ProjectList({ projects }: ProjectListProps) {
    return (
        <ScrollArea className="w-full" type="scroll">
            <div className="flex space-x-4 p-1 w-max">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}