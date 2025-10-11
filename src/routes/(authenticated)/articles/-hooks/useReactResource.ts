import { useMutation, useQueryClient } from "@tanstack/react-query"
import { reactResource } from "../-services/reaction.service"
import type { ApiError } from "@/types"
import { toast } from "sonner"
import type { Article } from "@/types/article"
import type { ReactionMutationParams } from "@/types/reaction"

export const useReactResource = () =>{
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({resourceId, reaction, resourceType}:ReactionMutationParams ) => reactResource(resourceId, reaction,resourceType),

		onMutate: async ({resourceId, reaction})=>{
			await queryClient.cancelQueries({queryKey: ["article", resourceId]})
			// snapshot the previous data
			const previousArticleData = queryClient.getQueryData(["article", resourceId])
			// optimistically update the cache with the new data
			queryClient.setQueryData(['article', resourceId],(old:{article: Article, isLiked: boolean})=>{	
				if(!old) return old 
				return {
					...old,
					article:{
						...old.article,
						likes: reaction === "like" ? old.article.likes + 1 : old.article.likes - 1,
					},
					isLiked: reaction === "like" ? true : false
				}
			})
			// return the context with the snapshot 
			return {previousArticleData, resourceId}
		},
		onError:(error: ApiError ,_variables, context) =>{
			// revert the cache to the previous state	
			if(context?.previousArticleData){
				queryClient.setQueryData(['article',context.resourceId],context.previousArticleData)

			}
			const errorMessage = error?.response?.data?.message || "Failed to react to resource"
			toast.error(errorMessage)
		},
		onSettled: (_data, _error, variables) => {
			//  refetch after error or success to ensure sync
			queryClient.invalidateQueries({ queryKey: ['article', variables.resourceId], refetchType:"none" });
		}
	})
}
