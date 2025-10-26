import GoToChat from "@/components/common/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FollowButton from "@/features/connnections/components/FollowButton";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useFetchFollowing } from "../hooks/useFetchFollowed";

interface FollowedListProps {
	searchQuery: string;
	sortBy: string;
}

export default function FollowedList({
	searchQuery,
	sortBy,
}: FollowedListProps) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useFetchFollowing();
	const mentors = data?.pages.flatMap((page) => page) || [];

	const { setTarget } = useInfiniteScroll({
		onIntersect: () => fetchNextPage(),
		hasNextPage: !!hasNextPage,
		isFetching: isFetchingNextPage,
	});

	const filteredFollowing = mentors.filter(
		(mentor) =>
			mentor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			mentor.expertise?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const sortConnections = (connections: any[]) => {
		const sorted = [...connections];
		switch (sortBy) {
			case "newest":
				return sorted.sort(
					(a, b) =>
						new Date(b.connectedAt || 0).getTime() -
						new Date(a.connectedAt || 0).getTime(),
				);
			case "oldest":
				return sorted.sort(
					(a, b) =>
						new Date(a.connectedAt || 0).getTime() -
						new Date(b.connectedAt || 0).getTime(),
				);
			case "name":
				return sorted.sort((a, b) => a.user.name.localeCompare(b.user.name));
			case "name-desc":
				return sorted.sort((a, b) => b.user.name.localeCompare(a.user.name));
			default:
				return sorted;
		}
	};

	const sortedFollowing = sortConnections(filteredFollowing);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Followed Mentors</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				) : sortedFollowing.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No mentors followed yet</p>
						<Button className="mt-4">Find Mentors</Button>
					</div>
				) : (
					<div className="space-y-4">
						{sortedFollowing.map((mentor) => (
							<div
								key={mentor.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center">
									<UserAvatar
										image={mentor.user?.profilePicture}
										name={mentor.user?.name}
										size={12}
									/>
									<div className="ml-4">
										<h3 className="font-medium">{mentor.user?.name}</h3>
										<p className="text-sm text-muted-foreground">
											{mentor.expertise?.name}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											Following since {new Date().toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex space-x-2">
									<GoToChat userId={mentor.id} isText={true} />
									<FollowButton isFollowing={true} mentorId={mentor.id} />
								</div>
							</div>
						))}
						<div ref={setTarget} className="mt-6 flex justify-center">
							{isFetchingNextPage && (
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
