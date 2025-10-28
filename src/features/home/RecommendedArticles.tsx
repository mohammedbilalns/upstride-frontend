import { Link } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import Pending from "@/components/common/pending";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Article } from "@/shared/types/article";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { useFetchArticles } from "../articles/hooks/useFetchArticles";
import ShowMoreContent from "@/components/common/ShowMore";

export default function RecommendedArticles() {
	const { data: articles, isPending, isError, refetch } = useFetchArticles();
	// TODO: show proper recommended articles instead of this

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Recommended Articles</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 cursor-pointer">
					{isPending ? (
						<Pending resource="articles" />
					) : isError ? (
						<ErrorState
							message="Failed to load articles. Please try again."
							onRetry={() => refetch()}
							variant="compact"
						/>
					) : articles.length > 0 ? (
						<>
							{articles.map((article: Article) => (
								<Link
									to="/articles/$articleId"
									key={article.id}
									params={{ articleId: article.id }}
									className="block"
								>
									<div className="flex items-start p-2 rounded-lg hover:bg-muted transition-colors group">
										{article.featuredImage ? (
											<img
												src={article.featuredImage}
												alt={article.title}
												className="h-12 w-12 rounded object-cover mr-3"
												onError={(e) => {
													e.currentTarget.style.display = "none";
													e.currentTarget.nextElementSibling?.classList.remove(
														"hidden",
													);
												}}
											/>
										) : null}

										<div
											className={`h-12 w-12 rounded mr-3 bg-muted flex items-center justify-center ${
												article.featuredImage ? "hidden" : ""
											}`}
										>
											<ImageIcon className="h-6 w-6 text-muted-foreground" />
										</div>

										<div className="flex-1">
											<p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
												{article.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatRelativeTime(article.createdAt)}
											</p>
										</div>
									</div>
								</Link>
							))}

							<ShowMoreContent resource="articles" link="/articles" />
						</>
					) : (
						<NoResource resource="articles" />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
