import { useState } from "react";
import { toast } from "sonner";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";
import { useDeleteMedia } from "./useDeleteMedia";
import { useGenerateToken } from "./useGenerateToken";

export const useUploadMedia = () => {
	const generateTokenMutation = useGenerateToken();
	const deleteMediaMutation = useDeleteMedia();
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [fileDetails, setFileDetails] = useState<CloudinaryResponse>({
		public_id: "",
		original_filename: "",
		resource_type: "",
		secure_url: "",
		bytes: 0,
		asset_folder: "",
	});

	const uploadToCloudinary = async (
		file: File,
		resourceType: string,
		cloudName: string,
		apiKey: string,
		token: string,
		uploadPreset: string,
		timestamp: number,
	) => {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
			const xhr = new XMLHttpRequest();
			const formData = new FormData();

			formData.append("file", file);
			formData.append("upload_preset", uploadPreset);
			formData.append("api_key", apiKey);
			formData.append("timestamp", timestamp.toString());
			formData.append("signature", token);
			formData.append("type", "authenticated");
			formData.append("resource_type", resourceType);

			xhr.open("POST", url, true);

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const progress = Math.round((event.loaded / event.total) * 100);
					setUploadProgress(progress);
				}
			};

			xhr.onload = () => {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.responseText);
					resolve(response);
				} else {
					reject(new Error("Upload failed"));
				}
			};

			xhr.onerror = () => {
				reject(new Error("Upload failed"));
			};

			xhr.send(formData);
		});
	};

	const handleUpload = async (file: File): Promise<CloudinaryResponse> => {
		if (!file) {
			toast.error("Please select a file to upload");
			throw new Error("No file selected");
		}

		try {
			setIsUploading(true);
			setUploadProgress(0);
			const resourceType = file.type === "application/pdf" ? "raw" : "image";

			const tokenData = await generateTokenMutation.mutateAsync(resourceType);

			const fileDetails = await uploadToCloudinary(
				file,
				resourceType,
				tokenData.data.cloud_name,
				tokenData.data.api_key,
				tokenData.data.signature,
				tokenData.data.upload_preset,
				tokenData.data.timestamp,
			);
			setFileDetails(fileDetails);

			return fileDetails;
		} catch (error) {
			toast.error("Failed to upload file");
			console.error("Upload error:", error);
			throw error;
		} finally {
			setIsUploading(false);
		}
	};
	const handleDelete = async () => {
		if (!fileDetails.public_id) return;

		try {
			await deleteMediaMutation.mutateAsync({
				fileId: fileDetails.public_id,
				mediaType: fileDetails.resource_type,
			});
			resetUpload();
		} catch (err) {
			toast.error("Error deleting file");
			console.error(err);
		}
	};

	const resetUpload = () => {
		setFileDetails({
			public_id: "",
			original_filename: "",
			resuource_type: "",
			secure_url: "",
			bytes: 0,
			asset_folder: "",
		});
		setUploadProgress(0);
	};

	return {
		handleUpload,
		handleDelete,
		uploadProgress,
		isUploading,
		fileDetails,
		setUploadProgress,
		resetUpload,
		isDeleting: deleteMediaMutation.isPending,
	};
};
