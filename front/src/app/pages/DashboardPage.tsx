import React from 'react';
import SystemStatusDisplay from '@/features/system/components/SystemStatusDisplay';
import { ProjectsSection } from '@/features/project';
import usePlatform from '@/shared/lib/usePlatform';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardPage: React.FC = () => {
    const { platform } = usePlatform();

    return (
        <div className="bg-background text-foreground px-4 font-sans py-2 h-full">
            <div className="max-w-7xl mx-auto h-full ">

                <ProjectsSection />

                <ScrollArea className="h-full">
                    {platform === 'desktop' && <SystemStatusDisplay />}
                </ScrollArea>
            </div>
        </div>
    );
};

export default DashboardPage;