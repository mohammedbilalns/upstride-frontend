import UserAvatar from "@/components/common/UserAvatar";
import { Check, CheckCheck, File, Image } from "lucide-react";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import type { ChatMessage } from "@/shared/types/message";

interface ChatMessageProps {
  message: ChatMessage;
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
              image={message?.sender?.profilePicture} 
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

          {message.attachment && (
            <div className="space-y-2">
                <div
                  className={`flex items-center space-x-2 p-2 rounded ${
                    isOwn ? "bg-primary-foreground/10" : "bg-background/50"
                  }`}
                >
                  {message.attachment.fileType === "image" ? (
                    <div className="w-full">

                      <img 
                        src={message.attachment.url} 
                        alt={message.attachment.url || "Image"} 
                        className="max-w-full rounded-md"
                      />
                      <div className="flex items-center mt-1">
                        <Image className="h-4 w-4 mr-2" />
                        {/* <span className="text-xs truncate">{message.attachment.url}</span> */}
                      </div>
                    </div>
                  ) : (
                    <a 
                      href={message.attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full"
                    >
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-xs truncate">{message.attachment.url}</span>
                    </a>
                  )}
                </div>
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
                {message.status === "read" ? (
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
