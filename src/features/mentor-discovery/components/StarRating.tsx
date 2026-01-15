import { Star, StarHalf } from "lucide-react";

export const StarRating = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = 5 - Math.ceil(rating);

	const fullStarKeys = Array.from(
		{ length: fullStars },
		(_, i) => `full-star-${i}`,
	);
	const emptyStarKeys = Array.from(
		{ length: emptyStars },
		(_, i) => `empty-star-${i}`,
	);

	return (
		<div className="flex text-yellow-400">
			{fullStarKeys.map((key) => (
				<Star key={key} className="h-4 w-4 fill-current" />
			))}
			{hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
			{emptyStarKeys.map((key) => (
				<Star key={key} className="h-4 w-4" />
			))}
		</div>
	);
};
