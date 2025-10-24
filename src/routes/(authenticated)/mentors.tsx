import { createFileRoute } from "@tanstack/react-router";
import {
	Clock,
	LayoutGrid,
	List,
	MessageCircle,
	Search,
	UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/features/mentor/components/StarRating";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMentorsForUser } from "@/features/mentor/services/mentor.service";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { MentorsSearchSchema } from "@/features/mentor/schemas/mentorsSearchSchema";
import MentorSideBar from "@/features/mentor/components/MentorSideBar";
import { createFallbackAvatar } from "@/shared/utils/createFallbackAvatar";

const dummyRatings: Record<string, { rating: number; reviewsCount: number; isAvailable: boolean }> = {
	"68d25a05fca23226d5a1df2c": {
		rating: 4.8,
		reviewsCount: 24,
		isAvailable: true,
	},
};

export const Route = createFileRoute("/(authenticated)/mentors")({
	validateSearch: (search: Record<string, string>) => {
		return MentorsSearchSchema.parse(search);
	},
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps: { search } }) => {
		const limit = 10;
		return getMentorsForUser(
			"1", 
			limit.toString(), 
			search.query || '', 
			search.expertiseId || '', 
			search.skillId || ''
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [limit] = useState(10);
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const [searchInput, setSearchInput] = useState(search.query || '');
	const debouncedSearchInput = useDebounce(searchInput, 500);

	useEffect(() => {
		if (debouncedSearchInput !== search.query) {
			navigate({
				search: (prev) => ({ ...prev, query: debouncedSearchInput || undefined }),
			});
		}
	}, [debouncedSearchInput, search.query, navigate]);

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ['mentors', search.query, search.expertiseId, search.skillId],
		queryFn: ({ pageParam = 1 }) => 
			getMentorsForUser(
				pageParam.toString(), 
				limit.toString(), 
				search.query || '', 
				search.expertiseId || '', 
				search.skillId || ''
			),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.mentors.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});

	const mentors = data?.pages.flatMap(page => page.mentors) || [];

	const { setTarget } = useInfiniteScroll({
		onIntersect: () => fetchNextPage(),
		hasNextPage: !!hasNextPage,
		isFetching: isFetchingNextPage,
	});

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Find Mentors</h1>
				<p className="text-muted-foreground">
					Connect with experienced professionals who can guide you in your
					career journey.
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Filters Sidebar */}
				<MentorSideBar search={search} navigate={navigate} />
				{/* Mentors Grid */}
				<div className="w-full md:w-3/4">
					<div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div className="relative w-full sm:max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input 
								placeholder="Search mentors..." 
								className="pl-10" 
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
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
						{mentors.map((mentor) => {
							const dummyRating = dummyRatings[mentor.id] || {
								rating: 4.5,
								reviewsCount: 10,
								isAvailable: true,
							};

							return (
								<Card key={mentor.id} className="relative">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="flex items-start space-x-3">
												<div className="relative">
													<Avatar className="h-16 w-16">
														<AvatarImage 
															src={mentor.user.profilePicture} 
															alt={mentor.user.name} 
														/>
														<AvatarFallback>
															{createFallbackAvatar(mentor.user.name)}
														</AvatarFallback>
													</Avatar>
													{dummyRating.isAvailable && (
														<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
													)}
												</div>
												<div>
													<h3 className="text-lg font-semibold">{mentor.user.name}</h3>
													<p className="text-sm text-muted-foreground">
														{mentor.expertise.name}
													</p>
													<div className="flex items-center mt-1">
														<StarRating rating={dummyRating.rating} />
														<span className="text-xs text-muted-foreground ml-2">
															{dummyRating.rating} ({dummyRating.reviewsCount} reviews)
														</span>
													</div>
												</div>
											</div>
											{!dummyRating.isAvailable && (
												<Badge variant="outline" className="text-xs">
													<Clock className="h-3 w-3 mr-1" />
													Busy
												</Badge>
											)}
										</div>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-muted-foreground text-sm mb-4">
											{mentor.bio}
										</p>
										<div className="flex flex-wrap gap-2 mb-4">
											{mentor.skills.map((skill:{name:string, id: string}) => (
												<Badge key={skill.id} variant="secondary" className="text-xs">
													{skill.name}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter className="flex justify-between items-center pt-3">
										<div className="text-sm">
											<span className="text-muted-foreground">Experience:</span>
											<span className="font-medium ml-1">
												{mentor.yearsOfExperience} {mentor.yearsOfExperience === 1 ? 'year' : 'years'}
											</span>
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												className="cursor-pointer"
											>
												<MessageCircle className="h-4 w-4 mr-1" />
												Message
											</Button>
											<Button size="sm" className="cursor-pointer">
												<UserCheck className="h-4 w-4 mr-1" />
												Follow
											</Button>
										</div>
									</CardFooter>
								</Card>
							);
						})}
					</div>

					{/* Intersection Observer Target */}
					<div ref={setTarget} className="mt-6 flex justify-center">
						{isFetchingNextPage && (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						)}
						{!hasNextPage && mentors.length > 0 && (
							<p className="text-muted-foreground text-sm">
								You've reached the end of the list
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
