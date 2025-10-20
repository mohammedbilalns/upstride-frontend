import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

interface MediaStreamParams {
	publicId: string;
	mediaType: string;
}

export const useFetchMedia = (params: MediaStreamParams) => {
	return useQuery({
		queryKey: ["media", params.publicId, params.mediaType],
		queryFn: async () => {
			const response = await api.post<Blob>(
				"/media",
				{
					publicId: params.publicId,
					mediaType: params.mediaType,
				},
				{
					responseType: "blob",
				},
			);

			const contentDisposition = response.headers["content-disposition"];
			let filename = "document";

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="(.+)"/);
				if (filenameMatch?.[1]) {
					filename = filenameMatch[1];
				}
			}

			return {
				blob: response.data,
				filename,
				contentType: response.headers["content-type"],
			};
		},
		enabled: !!params.publicId && !!params.mediaType,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});
};
