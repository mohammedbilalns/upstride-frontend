import { FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import type { CloudinaryResponse } from "@/types/cloudinaryResponse";

interface FilePreviewProps {
  resumeFile: File;
  handleUpload: (file: File) => Promise<CloudinaryResponse>;
  removeResume: () => void;
  isDeleting: boolean;
  isUploading: boolean;
}

export default function FilePreview({
  resumeFile,
  removeResume,
  isDeleting,
}: FilePreviewProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FileText className="h-8 w-8 text-primary mr-3" />
        <div className="text-left">
          <p className="font-medium">{resumeFile.name}</p>
          <p className="text-sm text-muted-foreground">
            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        {isDeleting ? (
          <Button type="button" variant="outline" size="sm" disabled>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Removing...
          </Button>
        ) : (
          <Button
            disabled={isDeleting}
            type="button"
            variant="outline"
            size="sm"
            onClick={removeResume}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
