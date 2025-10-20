import { useCallback, useEffect, useMemo, useState } from "react";
import type { Comment } from "@/shared/types/comment";
import { useFetchComments } from "../../hooks/useFetchComments";

export function useCommentReplies(articleId: string, commentId: string) {
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState<Comment[]>([]);
	const [totalReplies, setTotalReplies] = useState(0);
	const [shouldFetchReplies, setShouldFetchReplies] = useState(false);

	const {
		data: repliesData,
		fetchNextPage,
		isFetchingNextPage,
		isLoading: isLoadingReplies,
	} = useFetchComments(articleId, 10, commentId, shouldFetchReplies);

	const hasMoreReplies = useMemo(
		() => replies.length < totalReplies,
		[replies.length, totalReplies],
	);

	const handleToggleReplies = useCallback(() => {
		if (!showReplies && replies.length === 0) {
			setShouldFetchReplies(true);
		}
		setShowReplies((prev) => !prev);
	}, [showReplies, replies.length]);

	const handleLoadMoreReplies = useCallback(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	// Update replies when new data is fetched
	useEffect(() => {
		if (!repliesData?.pages.length) return;

		const allReplies = repliesData.pages.flatMap((page) => page.comments);

		setReplies(allReplies);

		const total = repliesData.pages[0]?.total;
		if (total !== undefined) {
			setTotalReplies(total);
		}
	}, [repliesData]);

	return {
		showReplies,
		replies,
		isLoadingReplies,
		hasMoreReplies,
		isFetchingNextPage,
		handleToggleReplies,
		handleLoadMoreReplies,
	};
}
