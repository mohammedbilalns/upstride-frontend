import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	Edit,
	MoreHorizontal,
	User,
} from "lucide-react";
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
import { useAuthStore } from "@/store/auth.store";
import { queryClient } from "@/main";
import { fetchArticle } from "./-services/article.service";
import type { Article, Tag } from "@/types/article";
import CommentsList from "./-components/CommentsList";
import ArticleEngagementBar from "./-components/ArticleEngagementBar";
import { ArticleNotFound } from "./-components/ArticleNotFound";

export const Route = createFileRoute("/(authenticated)/articles/$articleId")({
	component: RouteComponent,
	notFoundComponent: ArticleNotFound,
	loader: async ({ params }) => {
		const { articleId } = params;
		return queryClient.fetchQuery({
			queryKey: ["article", articleId],
			queryFn: () => fetchArticle(articleId),
		});
	},
});

function RouteComponent() {
	const { user } = useAuthStore();
	const { articleId } = Route.useParams();
	const navigate = useNavigate();
	const data = Route.useLoaderData();
	const article: Article = data?.article;
	const isLiked: boolean = data?.isLiked;
	const isAuthor = user && article && article.author === user.id;

	const handleGoBack = () => {
		navigate({ to: "/articles" });
	};

	if (!article) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
				<p className="text-muted-foreground mb-6">
					The article you're looking for doesn't exist or has been removed.
				</p>
				<Button onClick={handleGoBack}>
					<ArrowLeft className="h-4 w-4 cursor-pointer mr-2" />
					Back to Articles
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-6xl">
			{/* Back Button */}
			<Button variant="ghost" className="mb-4 -ml-2 cursor-pointer" onClick={handleGoBack}>
				<ArrowLeft className="h-4  w-4 mr-2" />
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
								<DropdownMenuItem asChild>
									<Link to={`/articles/edit/${article.id}`}>
										<Edit className="h-4 w-4 mr-2" />
										Edit Article
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>	
					)}
				</div>
			</header>

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
				className="prose-custom max-w-none mb-6" 
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
			{/* ement Bar */}
			<ArticleEngagementBar articleId={articleId} likes={article.likes} comments={article.comments} views={article.views} isLiked={isLiked} isBookmarked={false} />
			<Separator className="my-8" />
			<CommentsList articleId={article.id} />
		</div>
	);
}
