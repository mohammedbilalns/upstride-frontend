import GoToChat from "@/components/common/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FollowButton from "@/features/connnections/components/FollowButton";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useFetchFollowing } from "../hooks/useFetchFollowing";
import Pending from "@/components/common/pending";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";

export default function FollowingList() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
		isError,
		refetch,
	} = useFetchFollowing();
	// NOTE: replaced flatmap with flat
	const mentors = data?.pages.flat() || [];

	const { setTarget } = useInfiniteScroll({
		onIntersect: () => fetchNextPage(),
		hasNextPage: !!hasNextPage,
		isFetching: isFetchingNextPage,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Followed Mentors</CardTitle>
			</CardHeader>
			<CardContent>
				{isPending ? (
					<Pending resource="following mentors" />
				) : isError ? (
					<ErrorState
						message="Failed to load following mentors. Please try again."
						onRetry={() => refetch()}
					/>
				) : mentors.length === 0 ? (
					<NoResource resource="following" />
				) : (
					<div className="space-y-4">
						{mentors.map((mentor) => (
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
