import { useCallback, useState } from "react";
import type { Comment } from "@/shared/types/comment";
import { useReactResource } from "../../hooks/useReactResource";

export function useCommentInteractions(comment?: Comment) {
    // 1. Initialize state with safe defaults if 'comment' is undefined
    const [liked, setLiked] = useState(comment?.isLiked ?? false);
    const [likes, setLikes] = useState(comment?.likes ?? 0);
    const reactCommentMutation = useReactResource();

    const handleReact = useCallback(() => {
        if (reactCommentMutation.isPending || !comment?.id) {
            return;
        }

        const originalLikedState = liked;
        const originalLikesCount = likes;

        const newLikedState = !liked;
        const newLikesCount = newLikedState ? likes + 1 : likes - 1;
        const reaction = newLikedState ? "like" : "dislike";

        setLiked(newLikedState);
        setLikes(newLikesCount);

        reactCommentMutation.mutate(
            { resourceId: comment.id, reaction, resourceType: "comment" },
            {
                onError: () => {
                    setLiked(originalLikedState);
                    setLikes(originalLikesCount);
                },
            },
        );
    }, [liked, likes, comment?.id, reactCommentMutation]);

    return {
        liked,
        likes,
        handleReact,
        isPending: reactCommentMutation.isPending,
    };
}