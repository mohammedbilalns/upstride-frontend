import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/app/store/auth.store";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateCommentData,
	commentSchema,
} from "../../schemas/comment.schema";
import { useCreateComment } from "../hooks/useCreateComment";

interface CommentFormProps {
	articleId: string;
	commentId?: string;
	onCancel?: () => void;
	placeholder?: string;
	rows?: number;
	avatarSize?: "sm" | "md";
	buttonText?: string;
	className?: string;
}

export default function CommentForm({
	articleId,
	commentId,
	onCancel,
	placeholder = "Share your thoughts...",
	rows = 3,
	avatarSize = "md",
	buttonText = commentId ? "Reply" : "Post Comment",
	className = "",
}: CommentFormProps) {
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

	const contentValue = watch("content");

	const onSubmit = async (data: CreateCommentData) => {
		try {
			await createCommentMutation.mutateAsync({
				articleId,
				content: data.content,
				parentCommentId: commentId,
			});
			reset();

			if (onCancel) {
				onCancel();
			}
		} catch (error) {
			console.error("Failed to post comment:", error);
		}
	};

	const isReply = !!commentId;
	const avatarImageSize = avatarSize === "sm" ? 8 : 10;
	const buttonSize = isReply ? "sm" : "default";
	const containerClass = isReply ? "mt-4" : "mb-8";

	return (
		<div className={`flex gap-3 ${containerClass} ${className}`}>
			{/* Avatar */}

			{user && (
				<UserAvatar
					image={user.profilePicture}
					name={user.name}
					size={avatarImageSize}
				/>
			)}
			<div className="flex-1">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<Textarea
							{...register("content")}
							placeholder={placeholder}
							rows={rows}
							className={errors.content ? "border-red-500" : ""}
						/>
						{errors.content && (
							<p className="text-red-500 text-sm mt-1">
								{errors.content.message}
							</p>
						)}
					</div>
					<div
						className={`flex ${isReply ? "justify-end gap-2" : "justify-end"} mt-${isReply ? "2" : "3"}`}
					>
						{isReply && onCancel && (
							<Button
								type="button"
								className="cursor-pointer"
								variant="outline"
								size={buttonSize}
								onClick={onCancel}
							>
								Cancel
							</Button>
						)}
						<Button
							type="submit"
							size={buttonSize}
							className="cursor-pointer"
							disabled={!contentValue?.trim() || isSubmitting}
						>
							{isSubmitting ? "Posting..." : buttonText}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
