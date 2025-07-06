import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UpdateNotification } from "@/features/updater/components/UpdateNotification";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Gem, Cog, UserCircle, Home } from "lucide-react";
import { NavLink } from "react-router";

const AppHeader: React.FC = () => {
    const navLinkClassName = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
        isPending ? "text-muted" : isActive ? "bg-primary text-secondary rounded-md font-semibold" : "";

    return (
        <header className="bg-background border-b border-accent pb-2">
            <div className="flex justify-between items-center pt-2 px-4">
                <NavLink to="/" className="flex items-center space-x-3">
                    <Gem size={28} className="text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">GameDev AI</h1>
                </NavLink>

                <div className="flex items-center space-x-2 h-full">
                    <ModeToggle />

                    <div className="w-0.5 h-6 bg-primary rounded-md" />

                    <div className="flex gap-2">
                        <NavLink to="/" className={navLinkClassName}>
                            <Button variant="ghost" className="hover:text-foreground">
                                <Home size={24} />
                            </Button>
                        </NavLink>
                        <NavLink to="/settings" className={navLinkClassName}>
                            <Button variant="ghost" className="hover:text-foreground">
                                <Cog size={24} />
                            </Button>
                        </NavLink>
                    </div>

                    <NavLink to="/profile" className={navLinkClassName}>
                        <Avatar>
                            <AvatarFallback>
                                <Button variant="ghost" className="hover:text-foreground">
                                    <UserCircle size={24} />
                                </Button>
                            </AvatarFallback>
                        </Avatar>
                    </NavLink>

                    <UpdateNotification />
                </div>
            </div>

        </header>
    );
};

export default AppHeader;