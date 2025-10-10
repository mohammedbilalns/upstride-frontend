import { Button, Textarea } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useState } from "react";


export default function CommentForm({articleId}:{articleId: string}){
	const [newComment, setNewComment] = useState("");
	const  {user} = useAuthStore()

	const handleSubmitComment = () => {
		if (newComment.trim()) {
			console.log("Submitting comment:", newComment, articleId);
			setNewComment("");
		}
	};

	return (
		<div className="flex gap-3 mb-8">
			<Avatar className="h-10 w-10">
				<AvatarImage src={user?.profilePicture} />
				<AvatarFallback>
					<User className="h-5 w-5" />
				</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<Textarea
					placeholder="Share your thoughts..."
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					rows={3}
				/>
				<div className="flex justify-end mt-3">
					<Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
						Post Comment
					</Button>
				</div>
			</div>
		</div>
	)

}
