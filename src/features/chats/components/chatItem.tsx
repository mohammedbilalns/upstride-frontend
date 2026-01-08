import UserAvatar from "@/components/common/UserAvatar";
import { Check, CheckCheck, Image as ImageIcon, File } from "lucide-react";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import { Badge } from "@/components/ui/badge";
import type { Chat } from "@/shared/types/chat";
import { cn } from "@/shared/utils/utils";
import { useAuthStore } from "@/app/store/auth.store";

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
}

export function ChatItem({ chat, isActive }: ChatItemProps) {
  const { user } = useAuthStore();
  const userId = user?.id;
  const last = chat.lastMessage;

  const isAttachment = last?.type === "FILE" || last?.type === "IMAGE";

  const getAttachmentIcon = () => {
    if (!last) return null;

    if (last.type === "IMAGE") return <ImageIcon className="h-4 w-4 text-primary" />;
    if (last.type === "FILE") return <File className="h-4 w-4 text-primary" />;

    return null;
  };

  const getPreviewText = () => {
    if (!last) return "No messages yet";

    let messageText = "";

    if (isAttachment) {
      if (last.type === "IMAGE") messageText = "Photo";
      else messageText = "Attachment";
    } else {
      messageText = last.content || "";
    }

    if (last.senderId !== userId) {
      return `${chat.participant.name}: ${messageText}`;
    }

    return messageText;
  };

  // Check if we should show read receipt (only for messages sent by current user)
  const shouldShowReadReceipt = last && last.senderId === userId && last.status === "read";
  const shouldShowSingleCheck = last && last.senderId === userId && last.status !== "read";

  return (
    <div
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 border-l-2",
        isActive
          ? "bg-primary/5 border-primary"
          : "hover:bg-muted/50 border-transparent hover:border-border"
      )}
    >
      <div className="flex items-start space-x-3.5">
        <div className="relative shrink-0 ring-2 ring-background shadow-sm rounded-full">
          <UserAvatar
            image={chat.participant.profilePicture}
            name={chat.participant.name}
            size={10}
          />
          {/* Online status indicator could go here */}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center h-10">
          <div className="flex items-center justify-between leading-none mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className={cn(
                "text-sm font-medium truncate",
                chat.unreadCount > 0 ? "text-foreground font-semibold" : "text-foreground/90"
              )}>
                {chat.participant.name}
              </h4>
              {chat.participant.isMentor && (
                <Badge
                  variant="secondary"
                  className="text-[9px] h-3.5 px-1 font-medium bg-primary/10 text-primary hover:bg-primary/20 border-transparent shrink-0"
                >
                  MENTOR
                </Badge>
              )}
            </div>

            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {last?.createdAt ? formatChatTimestamp(last.createdAt) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0 text-xs text-muted-foreground">
              {/* Show read receipt only for messages sent by current user */}
              <div className="shrink-0 flex items-center">
                {shouldShowReadReceipt ? (
                  <CheckCheck className="h-3.5 w-3.5 text-primary" />
                ) : shouldShowSingleCheck ? (
                  <Check className="h-3.5 w-3.5" />
                ) : null}
              </div>

              {isAttachment && (
                <span className="shrink-0 text-foreground/70">
                  {getAttachmentIcon()}
                </span>
              )}

              <p className={cn(
                "truncate transition-colors",
                chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {getPreviewText()}
              </p>
            </div>

            {chat?.unreadCount > 0 && (
              <Badge
                className="h-5 min-w-[1.25rem] px-1 flex items-center justify-center rounded-full text-[10px] bg-primary text-primary-foreground shadow-sm animate-in zoom-in-50 duration-300"
              >
                {chat.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
