import { createBrowserRouter } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import { Layout } from "../components/Layout";
import SettingsPage from "../pages/SettingsPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: "project/:projectId",
                element: <ProjectDetailPage />
            },
            {
                path: "settings",
                element: <SettingsPage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            }
        ]
    }
]);