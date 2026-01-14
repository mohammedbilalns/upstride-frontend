import { useDebounce } from "@/shared/hooks/useDebounce";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/features/articles-mangement/components/ArticleGrid";
import { ArticlesSearchBar } from "@/features/articles-mangement/components/ArticlesSearchBar";
import { FilterSidebar } from "@/features/articles-mangement/components/FilterSideBar";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { articlesQueryOptions } from "../services/article.service";

const routeApi = getRouteApi("/(authenticated)/articles/");

// FIX: cache replication when changing the sort filters
export default function ArticleListPage() {
	const { user } = routeApi.useLoaderData();
	const isMentor = user?.role === "mentor";
	const search = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const [searchInput, setSearchInput] = useState(search.query || "");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const debouncedSearchInput = useDebounce(searchInput, 500);

	useEffect(() => {
		if (debouncedSearchInput !== search.query) {
			navigate({
				search: (prev) => ({
					...prev,
					query: debouncedSearchInput || undefined,
				}),
			});
		}
	}, [debouncedSearchInput, search.query, navigate]);

	const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
		useSuspenseInfiniteQuery(
			articlesQueryOptions(
				search.query,
				search.category,
				search.tag,
				search.sortBy,
			),
		);

	const articles = data?.pages.flatMap((page) => page.articles) || [];
	const isSearch = Boolean(
		search.query || search.category || search.tag || search.sortBy,
	);

	const total = data?.pages[0]?.total || 0;

	const { setTarget } = useInfiniteScroll({
		onIntersect: () => fetchNextPage(),
		hasNextPage: !!hasNextPage,
		isFetching: isFetchingNextPage,
	});

	const handleCategoryChange = (value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				category: value === "all" ? undefined : value,
			}),
		});
	};

	const handleSortByChange = (value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				sortBy: value === "newest" ? undefined : value,
			}),
		});
	};

	const handleTagClick = (tag: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				tag: tag === "all" ? undefined : tag,
			}),
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
				<div className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:h-fit">
					<FilterSidebar
						searchParams={search}
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
						isLoading={isLoading}
						isFetchingNextPage={isFetchingNextPage}
						hasNextPage={hasNextPage}
						setTarget={setTarget}
						isSearch={isSearch}
						clearFilters={handleClearFilters}
					/>
				</div>
			</div>
		</div>
	);
}
