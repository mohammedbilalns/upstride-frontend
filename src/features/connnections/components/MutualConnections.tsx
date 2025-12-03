import NoResource from "@/components/common/NoResource";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchMutualMentors } from "@/features/mentor/hooks/mentors-queries.hooks";
import ShowMoreContent from "@/components/common/ShowMore";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";

interface MutualConnection {
	id: string;
	name: string;
	profilePicture?: string;
	currentRole: string;
	organisation: string;
	mutualConnectionCount: number;
	user?: {
		profilePicture?: string;
	};
}

export default function MutualConnections() {
	const { data, isPending, isError, refetch } = useFetchMutualMentors();
	const connections: MutualConnection[] = data?.connections || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Mutual Connections</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{isPending ? (
					<Pending resource="mentors" />
				) : isError ? (
					<ErrorState
						message="Failed to load mutual connections. Please try again."
						onRetry={() => refetch()}
						variant="compact"
					/>
				) : connections.length === 0 ? (
					<NoResource resource="mentors" />
				) : (
					<div className="space-y-3">
						{connections.map((connection: MutualConnection) => (
							<div
								key={connection.id}
								className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
							>
								<div className="flex items-center">
									<UserAvatar
										image={connection?.user?.profilePicture || connection.profilePicture}
										name={connection.name}
										size={10}
									/>
									<div className="ml-3">
										<p className="text-sm font-medium group-hover:text-primary transition-colors">
											{connection.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{connection.currentRole} at {connection.organisation}
										</p>
										<p className="text-xs text-muted-foreground">
											{connection.mutualConnectionCount} mutual connection
											{connection.mutualConnectionCount !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
								<Button size="sm" variant="outline">
									View
								</Button>
							</div>
						))}
					</div>
				)}
				{connections.length > 0 && (
					<ShowMoreContent
						resource="connections"
						link="/mentors"
						text="View all connections"
					/>
				)}
			</CardContent>
		</Card>
	);
}
