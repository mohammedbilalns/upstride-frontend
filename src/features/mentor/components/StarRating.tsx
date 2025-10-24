import { Star, StarHalf } from "lucide-react";

export const StarRating = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = 5 - Math.ceil(rating);

	return (
		<div className="flex text-yellow-400">
			{[...Array(fullStars)].map((_, i) => (
				<Star key={`full-${i}`} className="h-4 w-4 fill-current" />
			))}
			{hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
			{[...Array(emptyStars)].map((_, i) => (
				<Star key={`empty-${i}`} className="h-4 w-4" />
			))}
		</div>
	);
};
