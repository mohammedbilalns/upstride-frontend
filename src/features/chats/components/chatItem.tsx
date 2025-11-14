import { type Chat } from "@/shared/types/chat";
import { cn } from "@/shared/utils/utils";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCheck } from "lucide-react";

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
}

export function ChatItem({ chat, isActive }: ChatItemProps) {
  
  return (
    <div className={cn(
      "p-4 cursor-pointer transition-colors",
      isActive ? "bg-muted" : "hover:bg-muted/50"
    )}>
      <div className="flex items-start space-x-3">
        <div className="relative shrink-0">
          <UserAvatar 
            image={chat.participant.profilePicture} 
            name={chat.participant.name} 
            size={12} 
          />
                 </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold truncate">{chat.participant.name}</h4>
             
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {chat.lastMessage?.createdAt ? formatChatTimestamp(chat.lastMessage.createdAt) : ""}
              </span>
              {chat.isRead ? (
                <CheckCheck className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Check className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate pr-2">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
            {chat.unread && chat.unread > 0 && (
              <Badge
                variant="destructive"
                className="text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 shrink-0"
              >
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
