import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleInList } from "@/shared/types/article";
import { cn } from "@/shared/utils/utils";
import { ArticleCard } from "./ArticleCard";
import NoResource from "@/components/common/NoResource";

interface ArticleGridProps {
  articles: ArticleInList[];
  total: number;
  viewMode: "grid" | "list";
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  setTarget?: (node: HTMLDivElement | null) => void;
  isSearch?: boolean;
  clearFilters: () => void;
}

export function ArticleGrid({
  articles,
  viewMode,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  setTarget,
  isSearch,
  clearFilters,
}: ArticleGridProps) {
  if (isLoading && articles.length === 0) {
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
            <div
              key={index}
              className={cn(viewMode === "grid" ? "space-y-3" : "flex gap-4")}
            >
              <Skeleton
                className={cn(
                  viewMode === "grid"
                    ? "h-40 w-full"
                    : "h-24 w-24 flex-shrink-0",
                )}
              />
              <div
                className={cn(
                  viewMode === "grid" ? "space-y-2" : "flex-1 space-y-2",
                )}
              >
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

  if (articles.length === 0 && !isLoading) {
    return (
      <NoResource resource={"articles"} isSearch={isSearch} clearFilters={clearFilters} />
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

      {/* Intersection Observer Target for Infinite Scroll */}
      <div ref={setTarget} className="mt-6 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!hasNextPage && articles.length > 0 && (
          <p className="text-muted-foreground text-sm">
            You've reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
}
