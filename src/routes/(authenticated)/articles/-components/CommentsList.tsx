import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui";
import { dummyComments as comments } from "../-dummy-data";
import CommentForm from "./CommentForm";

export default function CommentsList({ articleId }: { articleId: string }) {
	// fetch comments from api
	const fetchComments = () => {
		console.log("fetching comments for articleId", articleId);
	};

	return (
		<section>
			<h2 className="text-2xl font-bold mb-6 tracking-tight">
				Comments ({comments.length})
			</h2>
			<CommentForm articleId={articleId} />
			<div className="space-y-6">
				{comments.map((comment) => (
					<div key={comment.id} className="flex gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={comment.author.imageUrl}
								alt={comment.author.name}
							/>
							<AvatarFallback>
								<User className="h-5 w-5" />
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-2">
							<div className="flex items-center justify-between">
								<p className="font-semibold text-sm">{comment.author.name}</p>
								<span className="text-xs text-muted-foreground">
									{comment.timestamp}
								</span>
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{comment.content}
							</p>
							<Button variant="ghost" size="sm" className="text-xs h-8 px-2">
								<Heart className="h-3 w-3 mr-1" />
								{comment.likes}
							</Button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
