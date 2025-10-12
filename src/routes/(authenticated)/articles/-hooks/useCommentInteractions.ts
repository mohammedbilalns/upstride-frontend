import { useState, useCallback } from "react";
import type { Comment } from "@/types/comment";
import { useReactResource } from "./useReactResource";

export function useCommentInteractions(comment: Comment) {
	const [liked, setLiked] = useState(comment.isLiked);
	const [likes, setLikes] = useState(comment.likes);
	const reactCommentMutation = useReactResource();

	const handleReact = useCallback(() => {
		if (reactCommentMutation.isPending) return;

		const newLikedState = !liked;
		const newLikesCount = newLikedState ? likes + 1 : likes - 1;
		const reaction = newLikedState ? "like" : "dislike";

		// Optimistic update
		setLiked(newLikedState);
		setLikes(newLikesCount);

		reactCommentMutation.mutate(
			{ resourceId: comment.id, reaction, resourceType: "comment" },
			{
				onError: () => {
					// Revert on error
					setLiked(!newLikedState);
					setLikes(newLikedState ? newLikesCount - 1 : newLikesCount + 1);
				},
			}
		);
	}, [liked, likes, comment.id, reactCommentMutation]);

	return {
		liked,
		likes,
		handleReact,
		isPending: reactCommentMutation.isPending,
	};
}

