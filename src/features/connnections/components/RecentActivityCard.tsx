import { Calendar } from "lucide-react";
import ErrorState from "@/components/common/ErrorState";
import Pending from "@/components/common/Pending";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { useFetchRecentActivity } from "../hooks/connections-queries.hooks";
import { getActivityDisplay } from "./GetActivityDisplay";

export default function RecentActivityCard() {
	const { data = [], isPending, isError, refetch } = useFetchRecentActivity();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="h-5 w-5" />
					Recent Activity
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-3">
				{isPending ? (
					<Pending resource="recent activities" />
				) : isError ? (
					<ErrorState
						message="Failed to load recent activity. Please try again."
						onRetry={() => refetch()}
						variant="compact"
					/>
				) : data.length === 0 ? (
					<p className="text-sm text-muted-foreground">No recent activity</p>
				) : (
					data.map((activity) => {
						const { message, color } = getActivityDisplay(activity);
						const timeAgo = activity.createdAt
							? formatRelativeTime(activity.createdAt)
							: "";

						return (
							<div key={activity.id} className="flex items-start space-x-3">
								<div className={`w-2 h-2 ${color} rounded-full mt-2`} />
								<div>
									<p className="text-sm">{message}</p>
									{timeAgo && (
										<p className="text-xs text-muted-foreground">{timeAgo}</p>
									)}
								</div>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
