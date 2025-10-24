import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFile } from "@/shared/services/media.service";
import type { ApiError } from "@/shared/types";

export const useDeleteMedia = () => {
	return useMutation({
		mutationFn: ({
			fileId,
			mediaType,
		}: {
			fileId: string;
			mediaType: string;
		}) => deleteFile(fileId, mediaType),
		onSuccess: () => {},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Faied to generate token";
			toast.error(errorMessage);
		},
	});
};
