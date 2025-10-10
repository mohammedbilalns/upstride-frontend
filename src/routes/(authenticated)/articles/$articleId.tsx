// In your article page component file

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	Bookmark,
	Calendar,
	Edit,
	Eye,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Share,
	User,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth.store";
import { dummyComments } from "./-dummy-data";
import { queryClient } from "@/main";
import { fetchArticle } from "./-services/article.service";
import type { Tag } from "@/types/article";

export const Route = createFileRoute("/(authenticated)/articles/$articleId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { articleId } = params;
		return queryClient.fetchQuery({
			queryKey: ["article", articleId],
			queryFn: () => fetchArticle(articleId),
		});
	},
});

function RouteComponent() {
	const { articleId } = Route.useParams();
	const navigate = useNavigate();
	const data = Route.useLoaderData();
	const article = data.article;
	const initialIsLiked = data.isLiked;

	const { user } = useAuthStore();
	const [liked, setLiked] = useState(initialIsLiked);
	const [bookmarked, setBookmarked] = useState(false);
	const [newComment, setNewComment] = useState("");

	const isAuthor = user && article && article.author === user.id;

	const handleGoBack = () => {
		navigate({ to: "/articles" });
	};

	const handleLike = () => {
		setLiked(!liked);
	};

	const handleBookmark = () => {
		setBookmarked(!bookmarked);
	};

	const handleSubmitComment = () => {
		if (newComment.trim()) {
			console.log("Submitting comment:", newComment);
			setNewComment("");
		}
	};

	if (!article) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
				<p className="text-muted-foreground mb-6">
					The article you're looking for doesn't exist or has been removed.
				</p>
				<Button onClick={handleGoBack}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Articles
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-5xl">
			{/* Back Button */}
			<Button variant="ghost" className="mb-4 -ml-2" onClick={handleGoBack}>
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back
			</Button>

			{/* Article Header */}
			<header className="mb-6">
				<h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
					{article.title}
				</h1>

				{/* Author Info & Date */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center space-x-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={article.authorImage} alt={article.authorName} />
							<AvatarFallback>
								<User className="h-5 w-5" />
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium text-base">{article.authorName}</p>
							<p className="text-sm text-muted-foreground">
								{new Date(article.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
					{isAuthor && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => navigate({ to: `/articles/edit/${article.id}` })}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Article
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</header>

			{/* Featured Image with Fixed Aspect Ratio */}
			{article.featuredImage && (
				<div className="w-full aspect-video rounded-lg overflow-hidden mb-6">
					<img
						src={article.featuredImage}
						alt={`Featured image for ${article.title}`}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* Article Content */}
			<div
				className="prose-custom max-w-none mb-6" // <-- USE THE NEW CLASS HERE
				dangerouslySetInnerHTML={{ __html: article.content }}
			/>

			{/* Tags */}
			<div className="flex flex-wrap gap-2 mb-6">
				{article.tags.map((tag:Tag) => (
					<Badge key={tag._id} variant="secondary">
						{tag.name}
					</Badge>
				))}
			</div>

			<Separator className="my-6" />

			{/* Engagement Bar */}
			<div className="flex items-center justify-between py-2">
				<div className="flex items-center space-x-6 text-sm text-muted-foreground">
					<span className="flex items-center">
						<Eye className="h-4 w-4 mr-1" />
						{article.views.toLocaleString()} views
					</span>
					<span className="flex items-center">
						<MessageCircle className="h-4 w-4 mr-1" />
						{article.comments} comments
					</span>
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant={liked ? "default" : "outline"}
						size="sm"
						onClick={handleLike}
					>
						<Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
						{liked ? article.likes + 1 : article.likes}
					</Button>
					<Button variant="outline" size="sm" onClick={handleBookmark}>
						<Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
					</Button>
					<Button variant="outline" size="sm">
						<Share className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<Separator className="my-8" />

			{/* Comments Section */}
			<section>
				<h2 className="text-2xl font-bold mb-6 tracking-tight">Comments ({dummyComments.length})</h2>

				{/* Add Comment */}
				<div className="flex gap-3 mb-8">
					<Avatar className="h-10 w-10">
						<AvatarImage src={article.authorImage} />
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

				{/* Comments List */}
				<div className="space-y-6">
					{dummyComments.map((comment) => (
						<div key={comment.id} className="flex gap-3">
							<Avatar className="h-10 w-10">
								<AvatarImage src={comment.author.imageUrl} alt={comment.author.name} />
								<AvatarFallback>
									<User className="h-5 w-5" />
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<div className="flex items-center justify-between">
									<p className="font-semibold text-sm">{comment.author.name}</p>
									<span className="text-xs text-muted-foreground">{comment.timestamp}</span>
								</div>
								<p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
								<Button variant="ghost" size="sm" className="text-xs h-8 px-2">
									<Heart className="h-3 w-3 mr-1" />
									{comment.likes}
								</Button>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
