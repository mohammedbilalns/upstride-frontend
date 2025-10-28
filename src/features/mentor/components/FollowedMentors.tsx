import { Link } from "@tanstack/react-router";
import GoToChat from "@/components/common/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetchFollowing } from "@/features/connnections/hooks/useFetchFollowing";
import type { MentorInList } from "@/shared/types/mentor";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";

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
						mentors.slice(0, count).map((mentor: MentorInList) => (
							<Link
								key={mentor.id}
								to="/mentor/$mentorId"
								params={{ mentorId: mentor.id }}
								className="block"
							>
								<div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
									<div className="flex items-center flex-1">
										<UserAvatar
											image={mentor?.user?.profilePicture}
											name={mentor.user?.name}
											size={8}
										/>
										<div className="ml-3">
											<p className="text-sm font-medium group-hover:text-primary transition-colors">
												{mentor.user?.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{mentor.expertise?.name}
											</p>
										</div>
									</div>
									<div onClick={(e) => e.preventDefault()}>
										<GoToChat userId={mentor.id} />
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
