import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";

interface FeaturedImageUploadProps {
	onImageChange: (imageData: CloudinaryResponse | null) => void;
	error?: string;
	initialImage?: CloudinaryResponse;
	className?: string;
}

export function FeaturedImageUpload({
	onImageChange,
	error,
	initialImage,
	className,
}: FeaturedImageUploadProps) {
	const id = useId();
	const fileInputId = `file-upload-${id}`;
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialImage?.secure_url || null,
	);
	const [initialImageLoaded, setInitialImageLoaded] = useState(false);

	const {
		handleUpload,
		handleDelete,
		uploadProgress,
		isUploading,
		fileDetails,
		resetUpload,
		isDeleting,
	} = useUploadMedia();

	useEffect(() => {
		if (initialImage && !initialImageLoaded) {
			setPreviewUrl(initialImage.secure_url);
			setInitialImageLoaded(true);
		}
	}, [initialImage, initialImageLoaded]);

	useEffect(() => {
		if (fileDetails.secure_url && previewUrl !== fileDetails.secure_url) {
			setPreviewUrl(fileDetails.secure_url);
			onImageChange(fileDetails);
		}
	}, [fileDetails, previewUrl, onImageChange]);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("File size must be less than 5MB");
				return;
			}
			let tempPreviewUrl: string = "";

			try {
				tempPreviewUrl = URL.createObjectURL(file);
				setPreviewUrl(tempPreviewUrl);

				await handleUpload(file);

				URL.revokeObjectURL(tempPreviewUrl);
			} catch (error) {
				URL.revokeObjectURL(tempPreviewUrl);
				setPreviewUrl(initialImage?.secure_url || null);
				console.error("Upload error:", error);
			}
		}
	};

	const handleRemoveImage = async () => {
		if (fileDetails.public_id) {
			await handleDelete();
		} else {
			resetUpload();
		}

		setPreviewUrl(null);
		onImageChange(null);

		const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Featured Image</CardTitle>
			</CardHeader>
			<CardContent>
				{previewUrl ? (
					// Preview state
					<div className="space-y-3">
						<div className="relative overflow-hidden rounded-md border">
							<img
								src={previewUrl}
								alt="FeaturedImage preview"
								className="w-full h-48 object-cover"
							/>
							{isUploading && (
								<div className="absolute inset-0 bg-background/80 flex items-center justify-center">
									<div className="w-3/4 space-y-2">
										<Progress value={uploadProgress} className="w-full" />
										<p className="text-foreground text-xs text-center">
											{uploadProgress}%
										</p>
									</div>
								</div>
							)}
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => document.getElementById(fileInputId)?.click()}
								disabled={isUploading}
								className="flex-1"
							>
								{isUploading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Uploading...
									</>
								) : (
									"Change Image"
								)}
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleRemoveImage}
								disabled={isUploading || isDeleting}
								className="px-3"
							>
								{isDeleting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<X className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
				) : (
					// Upload state
					<Button
						variant="outline"
						type="button"
						onClick={() => document.getElementById(fileInputId)?.click()}
						className="w-full h-auto border-dashed p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-foreground/20 transition-colors"
					>
						{isUploading ? (
							<>
								<Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
								<Progress value={uploadProgress} className="w-full" />
								<p className="text-sm text-muted-foreground">
									Uploading... {uploadProgress}%
								</p>
							</>
						) : (
							<>
								<Upload className="h-12 w-12 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Click to upload an image
								</p>
								<p className="text-xs text-muted-foreground/70">
									PNG, JPG, GIF up to 5MB
								</p>
							</>
						)}
					</Button>
				)}
				<input
					id={fileInputId}
					type="file"
					onChange={handleFileChange}
					accept="image/*"
					className="hidden"
					disabled={isUploading}
				/>
				{error && <p className="text-destructive text-sm mt-1">{error}</p>}
			</CardContent>
		</Card>
	);
}
