import { AlertCircle, Filter, Loader2, RefreshCw } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { sortOptions } from "@/features/articles/data/sort-options";
import { useFetchExpertiseAreas } from "@/features/auth/hooks/onboarding.hooks";
import type { Category } from "@/shared/types/category";
import { useFetchMostUsedTags } from "../hooks/article-queries.hooks";

interface FilterSidebarProps {
	searchParams: {
		category?: string;
		sortBy?: string;
		tag?: string;
	};
	onCategoryChange: (value: string) => void;
	onSortByChange: (value: string) => void;
	onTagClick: (tag: string) => void;
	onClearFilters: () => void;
}

// FIX: layout shift when opening the dropdown
export function FilterSidebar({
	searchParams,
	onCategoryChange,
	onSortByChange,
	onTagClick,
	onClearFilters,
}: FilterSidebarProps) {
	const id = useId();

	const {
		isLoading: isLoadingTags,
		isError: isTagsError,
		data: tags,
		refetch: refetchTags,
	} = useFetchMostUsedTags();

	const {
		isLoading: isLoadingCategories,
		isError: isCategoriesError,
		data: categoriesData,
		refetch: refetchCategories,
	} = useFetchExpertiseAreas();
	const categories = categoriesData?.expertises;
	const isAnyLoading = isLoadingTags || isLoadingCategories;

	const isCategorySelected =
		searchParams.category && searchParams.category !== "all";
	const shouldShowTags = !isCategorySelected;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filter Articles
					</h2>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label
							htmlFor="category-select"
							className="block text-sm font-medium mb-2"
						>
							Category
						</label>
						{isLoadingCategories ? (
							<div className="flex items-center justify-center h-10 border rounded-md bg-muted">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
								<span className="text-sm text-muted-foreground">
									Loading categories...
								</span>
							</div>
						) : isCategoriesError ? (
							<div className="space-y-2">
								<div className="flex items-center text-destructive text-sm">
									<AlertCircle className="h-4 w-4 mr-2" />
									<span>Failed to load categories</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => refetchCategories()}
									className="w-full"
								>
									<RefreshCw className="h-3 w-3 mr-2" />
									Retry
								</Button>
							</div>
						) : (
							<Select
								value={searchParams.category || "all"}
								onValueChange={onCategoryChange}
							>
								<SelectTrigger id={`category-select-${id}`}>
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories && categories.length > 0 ? (
										categories.map((category: Category) => (
											<SelectItem
												className="cursor-pointer"
												key={category.id}
												value={category.id}
											>
												{category.name}
											</SelectItem>
										))
									) : (
										<SelectItem value="no-categories" disabled>
											No categories available
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						)}
					</div>

					<div>
						<label
							htmlFor="sort-select"
							className="block text-sm font-medium mb-2"
						>
							Sort By
						</label>
						<Select
							value={searchParams.sortBy || "newest"}
							onValueChange={onSortByChange}
						>
							<SelectTrigger id={`sort-select-${id}`}>
								<SelectValue placeholder="Newest First" />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem
										className="cursor-pointer"
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Button
						className="w-full"
						onClick={onClearFilters}
						disabled={isAnyLoading}
					>
						Clear Filters
					</Button>
				</CardContent>
			</Card>

			{shouldShowTags && (
				<Card>
					<CardHeader>
						<h2 className="text-lg font-semibold">Popular Tags</h2>
					</CardHeader>
					<CardContent>
						{isLoadingTags ? (
							<div className="flex justify-center items-center py-4">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
								<span className="ml-2 text-sm text-muted-foreground">
									Loading tags...
								</span>
							</div>
						) : isTagsError ? (
							<div className="space-y-3">
								<div className="flex items-center text-destructive">
									<AlertCircle className="h-4 w-4 mr-2" />
									<span className="text-sm">Failed to load tags</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => refetchTags()}
									className="w-full"
								>
									<RefreshCw className="h-3 w-3 mr-2" />
									Try Again
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{tags && tags.length > 0 ? (
									tags.map((tag) => (
										<Badge
											key={tag.id}
											variant={
												searchParams.tag === tag.id ? "default" : "secondary"
											}
											className="cursor-pointer"
											onClick={() => onTagClick(tag.id)}
										>
											{tag.name}
										</Badge>
									))
								) : (
									<p className="text-sm text-muted-foreground">
										No tags available
									</p>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
