import { FileText, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui";
import type { CloudinaryResponse } from "@/types/cloudinaryResponse";

interface FilePreviewProps {
  resumeFile: File;
  fileDetails?: CloudinaryResponse | null;
  handleUpload: (file: File) => Promise<CloudinaryResponse>;
  removeResume: () => void;
  isDeleting: boolean;
  isUploading: boolean;
}

export default function FilePreview({
  resumeFile,
  fileDetails,
  removeResume,
  isDeleting,
  isUploading,
}: FilePreviewProps) {
  const isUploadSuccessful = fileDetails && fileDetails.secure_url;

  return (
    <div className="space-y-4">
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
      
      {isUploadSuccessful && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Resume Preview</h4>
          
          </div>
          
          <div className="flex items-center justify-center">
            <a
              href={fileDetails.secure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Resume
            </a>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click the link above to preview your resume 
          </p>
        </div>
      )}
      
      {/* Upload failed state */}
      {!isUploadSuccessful && !isUploading && (
        <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-destructive">Upload Failed</h4>
          </div>
          <p className="text-xs text-destructive">
            The resume could not be uploaded. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
