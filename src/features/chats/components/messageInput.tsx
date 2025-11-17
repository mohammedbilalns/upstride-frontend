import { useState, useRef } from "react";
import { Send, Image, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

interface MessageInputProps {
  onSend: (message: string, file?: File) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSend = () => {
    if (message.trim() || uploadedFile) {
      onSend(message, uploadedFile);
      setMessage("");
      setUploadedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (type: "file" | "image") => {
    if (type === "file") fileInputRef.current?.click();
    if (type === "image") imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Only take the first file
      setUploadedFile(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className={`${isMobile ? "p-3" : "p-4"} border-t space-y-3 bg-card`}>
      
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
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => handleFileUpload("image")}
          disabled={!!uploadedFile}
        >
          <Image className="h-4 w-4" />
        </Button>

        {/* Direct File Upload Button */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => handleFileUpload("file")}
          disabled={!!uploadedFile}
        >
          <File className="h-4 w-4" />
        </Button>

        {/* Message Input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
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
