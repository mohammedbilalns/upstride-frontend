import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Textarea } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { useCreateComment } from "../-hooks/useCreateComment";
import {
	type CreateCommentData,
	commentSchema,
} from "../-validations/comment.validation";

export default function CommentForm({ articleId }: { articleId: string }) {
	const { user } = useAuthStore();
	const createCommentMutation = useCreateComment();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<CreateCommentData>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});

	const commentValue = watch("content");
	const onSubmit = async (data: CreateCommentData) => {
		try {
			await createCommentMutation.mutateAsync({
				articleId,
				...data,
			});
			reset();
		} catch (error) {
			console.error("Failed to post comment:", error);
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<Textarea
							{...register("content")}
							placeholder="Share your thoughts..."
							rows={3}
							className={errors.content ? "border-red-500" : ""}
						/>
						{errors.content && (
							<p className="text-red-500 text-sm mt-1">
								{errors.content.message}
							</p>
						)}
					</div>
					<div className="flex justify-end mt-3">
						<Button
							type="submit"
							disabled={!commentValue?.trim() || isSubmitting}
						>
							{isSubmitting ? "Posting..." : "Post Comment"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
