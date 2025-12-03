import ErrorState from "@/components/common/ErrorState";
import GoToChat from "@/features/chats/components/GoToChat";
import NoResource from "@/components/common/NoResource";
import Pending from "@/components/common/Pending";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useFetchFollowers } from "../hooks/connections-queries.hooks";

export default function FollowersList() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
		isError,
		refetch,
	} = useFetchFollowers();
	const followers = data?.pages.flat() || [];

	const { setTarget } = useInfiniteScroll({
		onIntersect: () => fetchNextPage(),
		hasNextPage: !!hasNextPage,
		isFetching: isFetchingNextPage,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Followers</CardTitle>
			</CardHeader>
			<CardContent>
				{isPending ? (
					<Pending resource="followers" />
				) : isError ? (
					<ErrorState
						message="Failed to load followers. Please try again."
						onRetry={() => refetch()}
					/>
				) : followers.length === 0 ? (
					<NoResource resource="followers" />
				) : (
					<div className="space-y-4">
						{followers.map((follower) => (
							<div
								key={follower.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center">
									<div className="relative">
										<UserAvatar
											image={follower.followerId?.profilePicture}
											name={follower.followerId.name}
											size={12}
										/>
									</div>
									<div className="ml-4">
										<h3 className="font-medium">{follower.followerId?.name}</h3>
									</div>
								</div>
								<div className="flex space-x-2">
									<GoToChat userId={follower.followerId._id} isText={true} />
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
