import { Check, CheckCheck, Image, File, Mic } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";

interface ChatMessageProps {
  message: {
    id: string;
    content?: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    recipient: {
      id: string;
      name: string;
      avatar?: string;
    };
    isRead: boolean;
    attachments?: Array<{
      type: "image" | "file" | "audio";
      name?: string;
      url?: string;
    }>;
  };
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isOwn && (
          <div className="shrink-0 mr-2">
            <UserAvatar 
              image={message?.sender?.avatar} 
              name={message?.sender?.name} 
              size={8} 
            />
          </div>
        )}

        <div
          className={`rounded-lg px-4 py-3 ${
isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
}`}
        >
          {message.content && <p className="text-sm mb-2">{message.content}</p>}

          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-2 rounded ${
isOwn ? "bg-primary-foreground/10" : "bg-background/50"
}`}
                >
                  {attachment.type === "image" ? (
                    <>
                      <Image className="h-4 w-4" />
                      <span className="text-xs">Image</span>
                    </>
                  ) : attachment.type === "file" ? (
                      <>
                        <File className="h-4 w-4" />
                        <span className="text-xs truncate">
                          {attachment.name}
                        </span>
                      </>
                    ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          <span className="text-xs">Audio</span>
                        </>
                      )}
                </div>
              ))}
            </div>
          )}

          <div
            className={`flex items-center mt-1 space-x-1 ${
isOwn ? "justify-end" : "justify-start"
}`}
          >
            <span
              className={`text-xs ${
isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
}`}
            >
              {formatChatTimestamp(message.createdAt)}
            </span>

            {isOwn && (
              <div className="text-xs">
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                    <Check className="h-3 w-3" />
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
