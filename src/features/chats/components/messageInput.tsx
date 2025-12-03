import { useState, useRef } from "react";
import { Send, Image, File, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageInputProps {
  onSend: (message: string, file?: File) => void;
}
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; 
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    
    // Only send if there's content or a file
    if (trimmedMessage || uploadedFile) {
      onSend(trimmedMessage, uploadedFile);
      setMessage("");
      setUploadedFile(null);
      setFileError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (type: "file" | "image") => {
    setFileError(null);
    if (type === "file") fileInputRef.current?.click();
    if (type === "image") imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size
      const isImage = file.type.startsWith("image/");
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
      
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        const fileType = isImage ? "image" : "file";
        
        setFileError(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} size (${sizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB`);
        return;
      }
      // Only take the first file
      setUploadedFile(file);
      setFileError(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError(null);
  };

  return (
    <div className={`${isMobile ? "p-3" : "p-4"} border-t space-y-3 bg-card`}>
      {/* File Error */}
      {fileError && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center text-destructive">
            <Info className="h-4 w-4 mr-2" />
            <span className="text-sm">{fileError}</span>
          </div>
        </div>
      )}
      
      {/* File Preview */}
      {uploadedFile && (
        <div className="p-2 bg-muted rounded-lg">
          <div className="flex items-center bg-background rounded p-2">
            {uploadedFile.type.startsWith("image/") ? (
              <Image className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <File className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="text-sm truncate max-w-[150px]">{uploadedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={removeFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        
        {/* Direct Image Upload Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => handleFileUpload("image")}
                disabled={!!uploadedFile}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload image (max 2MB)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Direct File Upload Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => handleFileUpload("file")}
                disabled={!!uploadedFile}
              >
                <File className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload file (max 5MB)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Message Input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className={`${isMobile ? "min-h-9" : "min-h-10"}`}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() && !uploadedFile}
          className="shrink-0"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
