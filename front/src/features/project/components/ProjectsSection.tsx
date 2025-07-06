// import mockProjects from "@/data/mockProjects";
import { ProjectList } from "./ProjectList";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useProjects } from "../api";

export const ProjectsSection: React.FC = () => {
    const { data } = useProjects();
    const projects = data?.data || []

    return (
        <section className="w-full">
            <header className='flex items-center justify-between mb-4'>
                <h2 className="text-3xl font-semibold text-foreground">Projects</h2>
                <CreateProjectDialog onProjectCreated={(project) => console.log(project)} />
            </header>

            <ProjectList projects={projects} />
        </section>
    );
};