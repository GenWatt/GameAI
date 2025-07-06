import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Footer from "./Footer";
import { HealthCheck } from "@/features/healthCheck";

export const Layout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen font-sans">
            <AppHeader />

            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>

            <Footer />

            <HealthCheck />
        </div>
    );
};
