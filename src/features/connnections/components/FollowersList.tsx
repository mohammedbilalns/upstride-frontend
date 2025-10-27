import GoToChat from "@/components/common/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyFollowers } from "../data/dummyFollowers";

interface FollowersListProps {
	searchQuery: string;
	sortBy: string;
}

export default function FollowersList({
	searchQuery,
	sortBy,
}: FollowersListProps) {
	const filteredFollowers = dummyFollowers.filter(
		(follower) =>
			follower.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			follower.expertise.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// FIX: specify the type
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

	const sortedFollowers = sortConnections(filteredFollowers);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Followers</CardTitle>
			</CardHeader>
			<CardContent>
				{sortedFollowers.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No followers yet</p>
					</div>
				) : (
					<div className="space-y-4">
						{sortedFollowers.map((follower) => (
							<div
								key={follower.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center">
									<div className="relative">
										<UserAvatar
											image={follower.user.profilePicture}
											name={follower.user.name}
											size={12}
										/>
										{/* {follower.isOnline && ( */}
										{/* 	<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div> */}
										{/* )} */}
									</div>
									<div className="ml-4">
										<h3 className="font-medium">{follower.user.name}</h3>
										<p className="text-sm text-muted-foreground">
											{follower.expertise.name}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											Following since{" "}
											{new Date(follower.connectedAt).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex space-x-2">
									<GoToChat userId={follower.user.id} isText={true} />
									<Button size="sm" variant="outline">
										View Profile
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
