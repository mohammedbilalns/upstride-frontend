import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { articlesParamsSchema } from "./-validations/articleParams.validation";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ArticlesSearchBar, ArticleGrid, FilterSidebar } from "./-components";
import { fetchArticles } from "./-services/article.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/(authenticated)/articles/")({
  component: RouteComponent,
  validateSearch: (input) => {
    const result = articlesParamsSchema.safeParse(input);
    if (result.success) return result.data;
    return { category: "", sortBy: "", tag: "" };
  },
});

function RouteComponent() {
  const { user } = useAuthStore();
  const isMentor = user?.role === "mentor";
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["articles", debouncedSearchInput, searchParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchArticles(
        pageParam,
        debouncedSearchInput,
        searchParams.category,
        searchParams.tag,
        searchParams.sortBy
      ),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.articles.length < lastPage.total;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const articles = data?.pages.flatMap((page) => page.articles) || [];
  const total = data?.pages[0]?.total || 0;
  const showLoadMore = articles.length < total;

  const handleLoadMore = () => {
    if (showLoadMore) {
      fetchNextPage();
    }
  };

  const handleCategoryChange = (value: string) => {
    const newCategoryValue = value === "All Categories" ? "" : value;
    navigate({
      search: (prev) => ({ ...prev, category: newCategoryValue }),
    });
  };

  const handleSortByChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, sortBy: value }),
    });
  };

  const handleTagClick = (tag: string) => {
    navigate({
      search: (prev) => ({ ...prev, tag }),
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    navigate({ search: {} });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">
            Explore our collection of articles on career growth, leadership, and
            professional development.
          </p>
        </div>
        {isMentor && (
          <div>
            <Link to="/articles/create">
              <Button className="cursor-pointer">Create Article</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <FilterSidebar
            searchParams={searchParams}
            onCategoryChange={handleCategoryChange}
            onSortByChange={handleSortByChange}
            onTagClick={handleTagClick}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <ArticlesSearchBar
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <ArticleGrid
            articles={articles}
            total={total}
            viewMode={viewMode}
            onLoadMore={handleLoadMore}
            isLoading={isFetchingNextPage}
            hasMore={showLoadMore}
          />
        </div>
      </div>
    </div>
  );
}
