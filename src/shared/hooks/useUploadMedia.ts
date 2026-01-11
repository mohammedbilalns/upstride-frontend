import { useState } from "react";
import { toast } from "sonner";
import type { CloudinaryResponse } from "@/shared/types/cloudinaryResponse";
import { useDeleteMedia } from "./useDeleteMedia";
import { uploadMedia } from "@/shared/services/media.service";

export const useUploadMedia = () => {
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

  const handleUpload = async (file: File): Promise<CloudinaryResponse> => {
    if (!file) {
      toast.error("Please select a file to upload");
      throw new Error("No file selected");
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const resourceType = file.type === "application/pdf" ? "raw" : "image";

      const response = await uploadMedia(file, resourceType, (progress) => {
        setUploadProgress(progress);
      });

      const fileDetails = response.data;
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
      resource_type: "",
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
