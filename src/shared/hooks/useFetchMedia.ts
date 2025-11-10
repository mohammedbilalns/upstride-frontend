import { useQuery } from "@tanstack/react-query";
import type { MediaResponse, MediaStreamParams } from "@/shared/types/media";
import api from "@/api/api";

/**
 * Fetches a media file from the server as a Blob.
 * Automatically extracts filename and content type from the response headers.
 *
 * @param params - Media identifiers (publicId and mediaType)
 * @returns React Query object with { blob, filename, contentType }
 */
export const useFetchMedia = (params: MediaStreamParams) => {
  return useQuery<MediaResponse>({
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

      // Extract filename from Content-Disposition header if present
      const contentDisposition = response.headers["content-disposition"];
      let filename = "document";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }

      return {
        blob: response.data,
        filename,
        contentType: response.headers["content-type"],
      };
    },
    enabled: Boolean(params.publicId && params.mediaType),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
    refetchOnWindowFocus: false, // prevents refetching blob on focus 
  });
};

