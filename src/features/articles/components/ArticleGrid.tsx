import { Button } from "@/components/ui/button";
import type { ArticleInList } from "@/shared/types/article";
import { cn } from "@/shared/utils/utils";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
	articles: ArticleInList[];
	total: number;
	viewMode: "grid" | "list";
	onLoadMore: () => void;
	isLoading?: boolean;
	hasMore?: boolean;
}

export function ArticleGrid({
	articles,
	viewMode,
	onLoadMore,
	isLoading = false,
	hasMore = false,
}: ArticleGridProps) {
	if (articles.length === 0 && !isLoading) {
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
