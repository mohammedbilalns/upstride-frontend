import UserAvatar from "@/components/common/UserAvatar";
import { Check, CheckCheck, File, Image, Loader2 } from "lucide-react";
import { formatChatTimestamp } from "@/shared/utils/dateUtil";
import type { ChatMessage } from "@/shared/types/message";

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
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] gap-2 ${
          isOwn ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isOwn && (
          <UserAvatar
            image={message?.sender?.profilePicture}
            name={message?.sender?.name}
            size={8}
          />
        )}

        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {/* TEXT MESSAGE */}
          {message.content && (
            <p className="text-sm leading-relaxed mb-2 wrap-break-word">
              {message.content}
            </p>
          )}

          {/* ATTACHMENTS */}
          {message.attachment && (
            <div className="space-y-3">
              {/* IMAGE PREVIEW */}
              {message.attachment.fileType === "image" ? (
                <div className="relative w-full">
                  <div
                    className={`overflow-hidden rounded-xl border ${
                      isOwn ? "border-white/20" : "border-black/10"
                    } shadow`}
                  >
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.name}
                      className={`w-full max-h-72 object-cover ${
                        isUploading ? "opacity-60" : ""
                      }`}
                    />
                  </div>

                  {/* Upload overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
                      <Loader2 className="h-7 w-7 text-white animate-spin mb-3" />
                      <div className="w-3/4 bg-white/30 rounded-full h-1.5">
                        <div
                          className="bg-white h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-white text-xs mt-2 font-medium">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* FILE PREVIEW */
                <div
                  className={`relative flex items-center p-3 rounded-xl border ${
                    isOwn ? "border-white/20" : "border-black/10"
                  } bg-background/60 shadow-sm`}
                >
                  {isUploading ? (
                    <div className="flex items-center w-full">
                      <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                      <div className="flex-1">
                        <span className="text-xs block font-medium truncate">
                          {message.attachment.name}
                        </span>

                        <div className="w-full bg-black/10 rounded-full h-1 mt-1">
                          <div
                            className="bg-primary h-1 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs ml-3">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <a
                      href={message.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full hover:opacity-80 transition"
                    >
                      <File className="h-5 w-5 mr-3" />
                      <span className="text-sm truncate max-w-[140px]">
                        {message.attachment.name ||
                          message.attachment.url.split("/").pop()}
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TIMESTAMP + READ STATUS */}
          <div
            className={`flex items-center mt-2 space-x-1 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-[10px] ${
                isOwn
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground/70"
              }`}
            >
              {formatChatTimestamp(message.createdAt)}
            </span>

            {isOwn && !isUploading && (
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
