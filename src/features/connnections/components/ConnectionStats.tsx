import { TrendingUp } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import ErrorState from "@/components/common/ErrorState";
import Pending from "@/components/common/pending";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchFollowers } from "../hooks/useFetchFollowers";
import { useFetchFollowing } from "../hooks/useFetchFollowing";

export default function ConnectionStats() {
	const { user } = useAuthStore();
	const isMentor = user?.role === "mentor";

	const {
		data: followingData,
		isPending: isFollowingPending,
		isError: isFollowingError,
		refetch: refetchFollowing,
	} = useFetchFollowing();

	const {
		data: followersData,
		isPending: isFollowersPending,
		isError: isFollowersError,
		refetch: refetchFollowers,
	} = useFetchFollowers();

	const following = followingData?.pages.flat() || [];
	const followers = followersData?.pages.flat() || [];

	const isLoading = isFollowingPending || (isMentor && isFollowersPending);

	const hasError = isFollowingError || (isMentor && isFollowersError);

	const handleRetry = () => {
		if (isFollowingError) refetchFollowing();
		if (isMentor && isFollowersError) refetchFollowers();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Connection Stats
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<Pending resource="connection stats" />
				) : hasError ? (
					<ErrorState
						message="Failed to load connection stats. Please try again."
						onRetry={handleRetry}
						variant="compact"
					/>
				) : (
					<>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Following</span>
							<span className="font-medium">{following.length}</span>
						</div>
						{isMentor && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Followers</span>
								<span className="font-medium">{followers.length}</span>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
