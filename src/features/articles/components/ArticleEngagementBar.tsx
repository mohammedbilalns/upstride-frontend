import { Bookmark, Eye, Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReactResource } from "../hooks/useReactResource";

interface ArticleEngagementBarProps {
	articleId: string;
	initialLikes: number;
	comments: number;
	views: number;
	isLiked: boolean;
	isBookmarked: boolean;
}
export default function ArticleEngagementBar({
	articleId,
	views,
	initialLikes,
	comments,
	isLiked,
	isBookmarked,
}: ArticleEngagementBarProps) {
	const [liked, setLiked] = useState(isLiked);
	const [likes, setLikes] = useState(initialLikes);
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	const reactResourceMutation = useReactResource();

	const handleLike = () => {
		if (reactResourceMutation.isPending) return;
		const newLikedState = !liked;
		const newLikesCount = newLikedState ? likes + 1 : likes - 1;
		const reaction = newLikedState ? "like" : "dislike";
		setLiked(newLikedState);
		setLikes(newLikesCount);

		reactResourceMutation.mutate(
			{ resourceId: articleId, reaction, resourceType: "article" },
			{
				onError: () => {
					setLiked(!newLikedState);
					setLikes(newLikedState ? newLikesCount - 1 : newLikesCount + 1);
				},
			},
		);
	};

	const handleBookmark = () => {
		setBookmarked(!bookmarked);
	};

	return (
		<div className="flex items-center justify-between py-2">
			<div className="flex items-center space-x-6 text-sm text-muted-foreground">
				<span className="flex items-center">
					<Eye className="h-4 w-4 mr-1" />
					{views.toLocaleString()} views
				</span>
				<span className="flex items-center">
					<MessageCircle className="h-4 w-4 mr-1" />
					{comments} comments
				</span>
			</div>

			<div className="flex items-center space-x-2">
				<Button
					variant={liked ? "default" : "outline"}
					size="sm"
					className="cursor-pointer"
					onClick={handleLike}
					disabled={reactResourceMutation.isPending}
				>
					<Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
					{likes}
				</Button>
				<Button
					className="cursor-pointer"
					variant="outline"
					size="sm"
					onClick={handleBookmark}
				>
					<Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
				</Button>
				<Button className="cursor-pointer" variant="outline" size="sm">
					<Share className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
