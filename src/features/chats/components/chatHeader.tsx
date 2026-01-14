import { Info, MoreHorizontal, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

interface ChatHeaderProps {
    chat: {
        id: string;
        name: string;
        avatar?: string;
        // isOnline: boolean;
        // isOnline: boolean;
        isMentor: boolean;
        participantId?: string;
    };
    onBack: () => void;
}

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center space-x-3">
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="-ml-2 h-9 w-9"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                <div className="relative group cursor-pointer ring-2 ring-background transition-shadow group-hover:ring-primary/20 rounded-full">
                    <UserAvatar
                        image={chat?.avatar}
                        name={chat?.name}
                        size={10}
                    />
                    {/* {chat?.isOnline && ( */}
                    {/*     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-in zoom-in-50 duration-300"></div> */}
                    {/* )} */}
                </div>

                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-sm leading-none tracking-tight">
                            {chat?.name}
                        </h2>
                        {chat?.isMentor && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5 font-medium bg-primary/10 text-primary hover:bg-primary/20 border-transparent"
                            >
                                MENTOR
                            </Badge>
                        )}
                    </div>
                    {/* <p className="text-[10px] text-muted-foreground font-medium"> */}
                    {/*     {chat?.isOnline ? <span className="text-green-600">Online</span> : "Offline"} */}
                    {/* </p> */}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {chat?.isMentor && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <Link to="/mentors/$mentorId" params={{ mentorId: chat.participantId || '' }}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Info className="h-4 w-4 mr-2" />
                                    View Profile
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
