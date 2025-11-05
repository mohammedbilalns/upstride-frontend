import { Paperclip, Send, Smile, Mic, Image, File, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSend: (message: string, files?: File[], audioBlob?: Blob) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0 || audioBlob) {
      onSend(message, uploadedFiles, audioBlob || undefined);
      setMessage("");
      setUploadedFiles([]);
      setAudioBlob(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (type: "file" | "image" | "audio") => {
    if (type === "file") {
      fileInputRef.current?.click();
    } else if (type === "image") {
      imageInputRef.current?.click();
    } else if (type === "audio") {
      audioInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
  };

  return (
    <div className="space-y-3">
      {/* File Preview */}
      {(uploadedFiles.length > 0 || audioBlob) && (
        <div className="p-2 bg-muted rounded-lg">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-background rounded p-2"
              >
                {file.type.startsWith("image/") ? (
                  <Image className="h-4 w-4 mr-2 text-primary" />
                ) : (
                    <File className="h-4 w-4 mr-2 text-primary" />
                  )}
                <span className="text-sm truncate max-w-[150px]">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {audioBlob && (
              <div className="flex items-center bg-background rounded p-2">
                <Mic className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Audio recording</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  onClick={removeAudio}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        {/* Attachment Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer" >
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleFileUpload("image")}>
              <Image className="h-4 w-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload("file")}>
              <File className="h-4 w-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload("audio")}>
              <Mic className="h-4 w-4 mr-2" />
              Audio File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Audio Recording Button */}
        <Button
          variant="ghost"
          size="icon"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={isRecording ? "text-destructive cursor-pointer" : "cursor-pointer"}
        >
          <Mic className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="cursor-pointer" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-full p-2">
            <div className="grid grid-cols-6 gap-1">
              {["😀", "😂", "😍", "👍", "👋", "🎉"].map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setMessage((prev) => prev + emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-11"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() && uploadedFiles.length === 0 && !audioBlob}
          className="cursor-pointer"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        multiple
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
        multiple
      />
    </div>
  );
}
