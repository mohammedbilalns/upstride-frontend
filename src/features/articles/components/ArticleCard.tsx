import { Link } from "@tanstack/react-router";
import { Eye, Heart, ImageIcon, MessageCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { ArticleInList, Tag } from "@/shared/types/article";
import { formatDate } from "@/shared/utils/utils";

export function ArticleCard({ article }: { article: ArticleInList }) {
	return (
		<Card className="overflow-hidden flex flex-col h-full">
			<div className="w-full h-36 bg-muted relative flex-shrink-0">
				{article.featuredImage ? (
					<img
						src={article.featuredImage}
						alt={article.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
						<ImageIcon className="h-10 w-10 mb-1" />
						<span className="text-xs">No Image</span>
					</div>
				)}
			</div>

			<CardHeader className="pb-2 px-4 pt-3 flex-shrink-0">
				<div className="flex items-center justify-between mb-1">
					<div className="flex gap-1 flex-wrap">
						{article.tags.slice(0, 2).map((tag: Tag) => (
							<Badge key={tag._id} variant="secondary" className="text-xs">
								{tag.name}
							</Badge>
						))}
						{article.tags.length > 2 && (
							<Badge variant="outline" className="text-xs">
								+{article.tags.length - 2}
							</Badge>
						)}
					</div>
					<span className="text-xs text-muted-foreground">
						{formatDate(article.createdAt)}
					</span>
				</div>
				<h3 className="text-base font-semibold line-clamp-2">
					{article.title}
				</h3>

				<Link
					to={`/authors/${article.author}`}
					className="flex items-center gap-2 mt-2 hover:underline"
				>
					{article.authorImage ? (
						<img
							src={article.authorImage}
							alt={article.authorName}
							className="w-6 h-6 rounded-full object-cover"
						/>
					) : (
						<div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
							<User className="h-3 w-3 text-muted-foreground" />
						</div>
					)}
					<span className="text-xs text-muted-foreground">
						{article.authorName}
					</span>
				</Link>
			</CardHeader>

			<CardContent className="pt-0 px-4 flex-grow min-h-[3rem]">
				<p className="text-muted-foreground text-xs line-clamp-2">
					{article.description}
				</p>
			</CardContent>

			<CardFooter className="flex justify-between items-center pt-2 px-4 pb-3 flex-shrink-0 mt-auto">
				<div className="flex space-x-3 text-xs text-muted-foreground">
					<div className="flex items-center">
						<Heart className="h-3 w-3 mr-1" />
						<span>{article.likes}</span>
					</div>
					{article.comments > 0 && (
						<div className="flex items-center">
							<MessageCircle className="h-3 w-3 mr-1" />
							<span>{article.comments}</span>
						</div>
					)}
					<div className="flex items-center">
						<Eye className="h-3 w-3 mr-1" />
						<span>
							{article.views >= 1000
								? `${(article.views / 1000).toFixed(1)}K`
								: article.views}
						</span>
					</div>
				</div>
				<Link to={`/articles/${article.id}`}>
					<Button variant="link" className="cursor-pointer text-xs p-0 h-auto">
						Read More
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
