import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/features/articles/components/ArticleGrid";
import { ArticlesSearchBar } from "@/features/articles/components/ArticlesSearchBar";
import { FilterSidebar } from "@/features/articles/components/FilterSideBar";
import { fetchArticles } from "@/features/articles/services/article.service";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { articlesParamsSchema } from "../../../features/articles/schemas/article-params.schema";

export const Route = createFileRoute("/(authenticated)/articles/")({
	component: RouteComponent,
	validateSearch: (search: Record<string, string>) => {
		return articlesParamsSchema.parse(search);
	},
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps: { search } }) => {
		return fetchArticles(
			1,
			search.query || "",
			search.category || "",
			search.tag || "",
			search.sortBy || "",
		);
	},
});

function RouteComponent() {
	const { user } = useAuthStore();
	const isMentor = user?.role === "mentor";
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
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
		useInfiniteQuery({
			queryKey: [
				"articles",
				search.query,
				search.category,
				search.tag,
				search.sortBy,
			],
			queryFn: ({ pageParam = 1 }) =>
				fetchArticles(
					pageParam,
					search.query || "",
					search.category || "",
					search.tag || "",
					search.sortBy || "",
				),
			getNextPageParam: (lastPage, allPages) => {
				if (lastPage.articles.length < 4) return undefined;
				return allPages.length + 1;
			},
			initialPageParam: 1,
		});

	const articles = data?.pages.flatMap((page) => page.articles) || [];
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
					{/* <p className="text-muted-foreground"> */}
					{/* 	Explore our collection of articles on career growth, leadership, and */}
					{/* 	professional development. */}
					{/* </p> */}
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
					/>
				</div>
			</div>
		</div>
	);
}
