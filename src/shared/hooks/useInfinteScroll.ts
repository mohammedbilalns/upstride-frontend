import { useEffect, useState } from "react";

interface UseInfiniteScrollProps {
	// function to call when the element is visible
	onIntersect: () => void;
	//  boolean to check if there are more pages to load
	hasNextPage: boolean;
	//  boolean to check if a fetch is already in progress
	isFetching: boolean;
}

export function useInfiniteScroll({
	onIntersect,
	hasNextPage,
	isFetching,
}: UseInfiniteScrollProps) {
	// State to hold the reference to our target element
	const [target, setTarget] = useState<HTMLDivElement | null>(null);

	useEffect(() => {
		// Don't observe if there's no target, no more pages, or if we're already fetching
		if (!target || !hasNextPage || isFetching) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onIntersect();
				}
			},
			{
				rootMargin: "100px",
			},
		);

		observer.observe(target);

		return () => {
			observer.unobserve(target);
		};
	}, [target, hasNextPage, isFetching, onIntersect]);

	return { setTarget };
}
