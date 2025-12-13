import { Link } from "@tanstack/react-router";
import ErrorState from "@/components/common/ErrorState";
import GoToChat from "@/features/chats/components/GoToChat";
import NoResource from "@/components/common/NoResource";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetchFollowing } from "@/features/connnections/hooks/connections-queries.hooks";
import { JSONSchemaGenerator } from "zod/v4/core";

interface FollowedMentorProps {
	count?: number;
}

export default function FollowedMentors({ count = 2 }: FollowedMentorProps) {
	const { data, isPending, isError, refetch } = useFetchFollowing();
	const mentors = data?.pages.flat() || [];
	const hasMoreToShow = mentors?.length > count;

	return (
		<Card>
			<CardHeader>
				<h2 className="text-lg font-semibold">Followed Mentors</h2>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{isPending ? (
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
						</div>
					) : isError ? (
						<ErrorState
							message="Failed to load followed mentors. Please try again."
							onRetry={() => refetch()}
							variant="compact"
						/>
					) : mentors.length === 0 ? (
						<NoResource resource="followers" isHome={true} />
					) : (
						mentors.slice(0, count).map((mentor) => (
							<Link
								key={mentor.id}
								to="/mentor/$mentorId"
								params={{ mentorId: mentor?.mentorId?._id}}
								className="block"
							>
								<div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
									<div className="flex items-center flex-1">
										<UserAvatar
											image={mentor.mentorId?.userId?.profilePicture}
											name={mentor.mentorId?.userId?.name}
											size={8}
										/>
										<div className="ml-3">
											<p className="text-sm font-medium group-hover:text-primary transition-colors">
												{mentor.mentorId?.userId?.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{mentor.mentorId?.expertiseId?.name}
											</p>
										</div>
									</div>
									<div onClick={(e) => e.preventDefault()}>
										<GoToChat userId={mentor.mentorId?.userId?._id} />
									</div>
								</div>
							</Link>
						))
					)}
				</div>

				{!isPending && !isError && mentors.length > 0 && hasMoreToShow && (
					<div className="mt-4 pt-4 border-t">
						<Link to="/network">
							<Button variant="outline" className="w-full">
								Show All
							</Button>
						</Link>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
