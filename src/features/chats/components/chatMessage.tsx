import UserAvatar from "@/components/common/UserAvatar";
import { Check, CheckCheck, File, Loader2 } from "lucide-react";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import type { ChatMessageProps } from "@/shared/types/message";
import { cn } from "@/shared/utils/utils";

interface ChatMessageProps {
  message: ChatMessage;
  isOwn: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
}

export function ChatMessage({
  message,
  isOwn,
  uploadProgress = 0,
  isUploading = false,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-2 animate-in slide-in-from-bottom-2 fade-in duration-300",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] sm:max-w-[75%] gap-2 group",
          isOwn ? "flex-row-reverse" : "flex-row",
        )}
      >
        {!isOwn && (
          <div className="shrink-0 self-end mb-1">
            <UserAvatar
              image={message?.sender?.profilePicture}
              name={message?.sender?.name}
              size={8}
              className="ring-1 ring-border/50 shadow-sm"
            />
          </div>
        )}

        <div
          className={cn(
            "relative px-4 py-2.5 shadow-sm transition-all",
            isOwn
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
              : "bg-muted/60 text-foreground border border-border/50 rounded-2xl rounded-tl-sm hover:bg-muted/80",
          )}
        >
          {/* TEXT MESSAGE */}
          {message.content && (
            <p
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap break-words",
                isOwn ? "text-primary-foreground/95" : "text-foreground/90",
              )}
            >
              {message.content}
            </p>
          )}

          {/* ATTACHMENTS */}
          {message.attachment && (
            <div className={cn("mt-2 first:mt-0", isOwn ? "-mx-2" : "-mx-2")}>
              {/* IMAGE PREVIEW */}
              {message.attachment.fileType === "image" ? (
                <div className="relative group/image overflow-hidden rounded-lg mx-2 mb-1">
                  <div className="absolute inset-0 bg-black/5 group-hover/image:bg-black/0 transition-colors pointer-events-none" />
                  <img
                    src={message.attachment.url}
                    alt={message.attachment.name}
                    className={cn(
                      "w-full max-h-72 object-cover transition-opacity duration-300",
                      isUploading ? "opacity-50 blur-[1px]" : "opacity-100",
                    )}
                  />

                  {/* Upload overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <Loader2 className="h-6 w-6 text-white animate-spin mb-2" />
                      <span className="text-white text-[10px] font-medium tracking-wide">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* FILE PREVIEW */
                <div
                  className={cn(
                    "mx-2 p-2.5 rounded-lg flex items-center gap-3 transition-colors",
                    isOwn
                      ? "bg-white/10 hover:bg-white/20 border-white/10 border"
                      : "bg-background/50 hover:bg-background border border-border/50",
                  )}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 p-1.5 shrink-0 animate-spin bg-background/20 rounded-md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate opacity-90">
                          {message.attachment.name}
                        </p>
                        <div className="w-full bg-foreground/10 h-1 mt-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-current h-full rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <a
                      href={message.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full gap-3 group/file"
                    >
                      <div className="p-2 rounded-md bg-background/10 group-hover/file:bg-background/20 transition-colors">
                        <File className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate opacity-95">
                          {message.attachment.name ||
                            message.attachment.url.split("/").pop()}
                        </p>
                        <p className="text-[10px] opacity-70 truncate mt-0.5">
                          Attachment
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TIMESTAMP + READ STATUS */}
          <div
            className={cn(
              "flex items-center gap-1 mt-1 select-none",
              isOwn ? "justify-end text-primary-foreground/70" : "justify-start text-muted-foreground/60",
            )}
          >
            <span className="text-[10px] leading-none tabular-nums tracking-tight">
              {formatChatTimestamp(message.createdAt)}
            </span>

            {isOwn && !isUploading && (
              <div className="ml-0.5">
                {message.status === "read" ? (
                  <CheckCheck className="h-3 w-3 opacity-90" />
                ) : (
                  <Check className="h-3 w-3 opacity-80" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
