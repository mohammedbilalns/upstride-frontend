import { Bookmark, Eye, Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

interface ArticleEngagementBarProps {
	articleId: string;
	likes: number;
	comments: number;
	views: number;
	isLiked: boolean; 
	isBookmarked: boolean; 

}
export default function ArticleEngagementBar({articleId,views,likes,comments , isLiked , isBookmarked}:ArticleEngagementBarProps){

	const [liked, setLiked] = useState(isLiked);
	const [bookmarked, setBookmarked] = useState(isBookmarked);

	// implement like and bookmark
	const handleLike = () => {
		console.log("articleId", articleId)
		setLiked(!liked);
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
					onClick={handleLike}
				>
					<Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
					{likes}	
				</Button>
				<Button variant="outline" size="sm" onClick={handleBookmark}>
					<Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
				</Button>
				<Button variant="outline" size="sm">
					<Share className="h-4 w-4" />
				</Button>
			</div>
		</div>

	)
}
