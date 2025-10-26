import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyFollowers } from "../data/dummyFollowers";
import { useFetchFollowing } from "../hooks/useFetchFollowed";

export default function ConnectionStats() {
	const { data } = useFetchFollowing();
	// TODO: show the followers list count here
	const mentors = data?.pages.flat() || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Connection Stats
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Following</span>
					<span className="font-medium">{mentors.length}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-sm text-muted-foreground">Followers</span>
					<span className="font-medium">{dummyFollowers.length}</span>
				</div>
			</CardContent>
		</Card>
	);
}
