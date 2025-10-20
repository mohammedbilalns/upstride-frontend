import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleInList} from "@/shared/types/article";
import { cn } from "@/shared/utils/utils";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
	articles: ArticleInList[];
	total: number;
	viewMode: "grid" | "list";
	onLoadMore: () => void;
	isLoading?: boolean;
	isDataLoading?: boolean;
	hasMore?: boolean;
}

export function ArticleGrid({
	articles,
	viewMode,
	onLoadMore,
	isLoading = false,
	isDataLoading = false,
	hasMore = false,
}: ArticleGridProps) {
	if (isDataLoading) {
		return (
			<div>
				<div
					className={cn(
						viewMode === "grid"
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
							: "space-y-4",
					)}
				>
					{Array.from({ length: 8 }).map((_, index) => (
						<div key={index} className={cn(viewMode === "grid" ? "space-y-3" : "flex gap-4")}>
							<Skeleton className={cn(viewMode === "grid" ? "h-40 w-full" : "h-24 w-24 flex-shrink-0")} />
							<div className={cn(viewMode === "grid" ? "space-y-2" : "flex-1 space-y-2")}>
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-5/6" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Show no articles message only when not loading and there are no articles
	if (articles.length === 0 && !isDataLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<h3 className="text-lg font-medium mb-2">No articles found</h3>
				<p className="text-muted-foreground mb-4">
					Try adjusting your search or filter criteria
				</p>
				<Button onClick={() => window.location.reload()}>Reset Filters</Button>
			</div>
		);
	}

	return (
		<div>
			<div
				className={cn(
					viewMode === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
						: "space-y-4",
				)}
			>
				{articles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</div>

			{/* Pagination / Load More */}
			{hasMore && (
				<div className="mt-8 flex justify-center">
					<Button
						className="cursor-pointer"
						variant="outline"
						onClick={onLoadMore}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Load More Articles"}
					</Button>
				</div>
			)}
		</div>
	);
}
