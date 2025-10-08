import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadingIndicatorProps {
	uploadProgress: number;
}

export default function UploadingIndicator({
	uploadProgress,
}: UploadingIndicatorProps) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col items-center justify-center">
				<Upload className="h-10 w-10 text-muted-foreground mb-3" />
				<p className="font-medium">Uploading your resume...</p>
			</div>
			<div className="w-full">
				<Progress value={uploadProgress} className="w-full" />
				<p className="text-sm text-muted-foreground mt-1">{uploadProgress}%</p>
			</div>
		</div>
	);
}
