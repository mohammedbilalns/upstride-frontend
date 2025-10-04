import { Upload } from "lucide-react";
import { Button } from "@/components/ui";

interface FileUploadProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ handleFileChange }: FileUploadProps) {
  return (
    <div>
      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium mb-1">Drag & drop your resume here</p>
      <p className="text-sm text-muted-foreground mb-3">or</p>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={() => document.getElementById("resume-upload")?.click()}
      >
        Browse File
      </Button>
			<input
				id="resume-upload"
				type="file"
				accept=".pdf,application/pdf"
				className="hidden"
				onChange={handleFileChange}
			/>
		</div>
  );
}
