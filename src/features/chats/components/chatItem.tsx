import UserAvatar from "@/components/common/UserAvatar";
import { Check, CheckCheck, Image as ImageIcon, File } from "lucide-react";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import { Badge } from "@/components/ui/badge";
import type{ Chat } from "@/shared/types/chat";
import { cn } from "@/shared/utils/utils";

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
}

export function ChatItem({ chat, isActive }: ChatItemProps) {
  const last = chat.lastMessage;

  // Detect attachment message types
  const isAttachment = last?.type === "FILE" || last?.type === "IMAGE";

  const getAttachmentIcon = () => {
    if (!last) return null;

    if (last.type === "IMAGE") return <ImageIcon className="h-4 w-4 text-primary" />;
    if (last.type === "FILE") return <File className="h-4 w-4 text-primary" />;

    return null;
  };

  const getPreviewText = () => {
    if (!last) return "No messages yet";

    if (isAttachment) {
      if (last.type === "IMAGE") return "Photo";
      return "Attachment";
    }

    return last.content || "";
  };

  // Check if we should show read receipt
  const shouldShowReadReceipt = last && last.senderId === chat.userIds[0] && last.status === "read";

  return (
    <div
      className={cn(
        "p-4 cursor-pointer transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-start space-x-3">
        <UserAvatar
          image={chat.participant.profilePicture}
          name={chat.participant.name}
          size={12}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold truncate">
              {chat.participant.name}
            </h4>

            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {last?.createdAt ? formatChatTimestamp(last.createdAt) : ""}
              </span>
              
              {/* Show read receipt for the last message if status is "read" */}
              {shouldShowReadReceipt ? (
                <CheckCheck className="h-3 w-3 text-muted-foreground" />
              ) : last ? (
                <Check className="h-3 w-3 text-muted-foreground" />
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 min-w-0">
              {isAttachment && (
                <span className="shrink-0">
                  {getAttachmentIcon()}
                </span>
              )}

              <p className="text-sm text-muted-foreground truncate">
                {getPreviewText()}
              </p>
            </div>

            {chat.unread > 0 && (
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
