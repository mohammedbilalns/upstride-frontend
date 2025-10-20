import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Eye,
	Filter,
	Heart,
	LayoutGrid,
	List,
	MessageCircle,
	Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth.store";

interface Article {
	id: number;
	title: string;
	description: string;
	category: string;
	publishedAt: string;
	imageUrl: string;
	likes: number;
	comments: number;
	views: number;
}

// Dummy data for articles
const dummyArticles: Article[] = [
	{
		id: 1,
		title: "5 Strategies for Effective Remote Leadership",
		description:
			"Leading remote teams requires different approaches than traditional in-person management. Here are five strategies I've found most effective...",
		category: "Leadership",
		publishedAt: "2 hours ago",
		imageUrl:
			"https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 42,
		comments: 7,
		views: 1200,
	},
	{
		id: 2,
		title: "Navigating Career Transitions in Tech",
		description:
			"Changing roles within the tech industry can be challenging but rewarding. Here's how to make a smooth transition without losing momentum...",
		category: "Career Growth",
		publishedAt: "1 day ago",
		imageUrl:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 87,
		comments: 0,
		views: 3400,
	},
	{
		id: 3,
		title: "Building Your Personal Brand as a Professional",
		description:
			"Your personal brand is how you market yourself to the world. Here are practical steps to build and maintain a strong professional brand...",
		category: "Personal Branding",
		publishedAt: "3 days ago",
		imageUrl:
			"https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 124,
		comments: 23,
		views: 5700,
	},
	{
		id: 4,
		title: "Effective Communication in Remote Teams",
		description:
			"Communication is the foundation of successful remote teams. Here are strategies to ensure clear and effective communication...",
		category: "Communication",
		publishedAt: "5 days ago",
		imageUrl:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 98,
		comments: 18,
		views: 4200,
	},
	{
		id: 5,
		title: "AI in the Workplace: Opportunities and Challenges",
		description:
			"Artificial intelligence is transforming how we work. This article explores the opportunities and challenges of AI integration...",
		category: "Technology",
		publishedAt: "1 week ago",
		imageUrl:
			"https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 156,
		comments: 32,
		views: 7800,
	},
	{
		id: 6,
		title: "Networking Strategies for Introverts",
		description:
			"Networking doesn't have to be exhausting. Discover strategies tailored for introverts to build meaningful professional connections...",
		category: "Networking",
		publishedAt: "1 week ago",
		imageUrl:
			"https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
		likes: 89,
		comments: 21,
		views: 3100,
	},
];

// Categories for filter dropdown
const categories = [
	"All Categories",
	"Leadership",
	"Career Growth",
	"Personal Branding",
	"Communication",
	"Technology",
	"Networking",
];

// Sort options
const sortOptions = [
	{ value: "newest", label: "Newest First" },
	{ value: "popular", label: "Most Popular" },
	{ value: "commented", label: "Most Commented" },
];

// Popular tags
const popularTags = [
	"Leadership",
	"Career",
	"Networking",
	"Communication",
	"Technology",
	"Personal Brand",
];

export const Route = createFileRoute("/(authenticated)/articles/")({
	component: RouteComponent,
	validateSearch: articlesParamsSchema,
	loaderDeps: ({ search }) => ({
		category: search.category,
		sortBy: search.sortBy,
		tag: search.tag,
	}),
	loader: async ({ deps }) => {
		const initialData = await fetchArticles(
			1,
			"",
			deps.category ?? "",
			deps.tag ?? "",
			deps.sortBy ?? "",
		);
		return { initialData };
	},
});

function RouteComponent() {
	const { user } = useAuthStore();
	const isMentor = user?.role === "mentor";
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [searchInput, setSearchInput] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const debouncedSearchInput = useDebounce(searchInput, 500);

	const {
		data,
		fetchNextPage,
		isFetchingNextPage,
		isFetching, // Track the overall fetching state
		isLoading, // Track the initial loading state
	} = useInfiniteQuery({
		queryKey: ["articles", debouncedSearchInput, searchParams],
		queryFn: ({ pageParam = 1 }) =>
			fetchArticles(
				pageParam,
				debouncedSearchInput,
				searchParams.category,
				searchParams.tag,
				searchParams.sortBy,
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

	// Determine if we should show loading state
	const isDataLoading = isLoading || (isFetching && articles.length === 0);

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
			<div className="mb-6 flex justify-between">
				<div>
					<h1 className="text-2xl font-bold mb-2">Articles</h1>
					<p className="text-muted-foreground">
						Explore our collection of articles on career growth, leadership, and
						professional development.
					</p>
				</div>
				{isMentor && (
					<div>
						<Link to={"/articles/create"}>
							<Button>Create Article</Button>
						</Link>
					</div>
				)}
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Filters Sidebar */}
				<div className="w-full md:w-1/4">
					<Card className="mb-6">
						<CardHeader>
							<h2 className="text-lg font-semibold flex items-center gap-2">
								<Filter className="h-5 w-5" />
								Filter Articles
							</h2>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Category
								</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="All Categories" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category} value={category.toLowerCase()}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">
									Sort By
								</label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Newest First" />
									</SelectTrigger>
									<SelectContent>
										{sortOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button className="w-full cursor-pointer">Apply Filters</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Popular Tags</h2>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{popularTags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Articles Grid */}
				<div className="w-full md:w-3/4">
					<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div className="relative w-full sm:max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input placeholder="Search articles..." className="pl-10" />
						</div>
						<div className="flex space-x-2">
							<Button variant="outline" size="sm">
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="sm">
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{dummyArticles.map((article) => (
							<Card key={article.id} className="overflow-hidden">
								<div className="w-full h-48 bg-muted">
									<img
										src={article.imageUrl}
										alt={article.title}
										className="w-full h-full object-cover"
									/>
								</div>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<Badge variant="secondary">{article.category}</Badge>
										<span className="text-xs text-muted-foreground">
											{article.publishedAt}
										</span>
									</div>
									<h3 className="text-lg font-semibold">{article.title}</h3>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="text-muted-foreground text-sm">
										{article.description}
									</p>
								</CardContent>
								<CardFooter className="flex justify-between items-center pt-3">
									<div className="flex space-x-3 text-sm text-muted-foreground">
										<div className="flex items-center">
											<Heart className="h-4 w-4 mr-1" />
											<span>{article.likes}</span>
										</div>
										{article.comments > 0 && (
											<div className="flex items-center">
												<MessageCircle className="h-4 w-4 mr-1" />
												<span>{article.comments}</span>
											</div>
										)}
										<div className="flex items-center">
											<Eye className="h-4 w-4 mr-1" />
											<span>
												{article.views >= 1000
													? `${(article.views / 1000).toFixed(1)}K`
													: article.views}
											</span>
										</div>
									</div>
									<Link to={`/articles/${article.id}`}>
										<Button
											variant="link"
											className="cursor-pointer text-sm p-0 h-auto"
										>
											Read More
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>

					<div className="mt-6 flex justify-center">
						<Button variant="outline">Load More Articles</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
