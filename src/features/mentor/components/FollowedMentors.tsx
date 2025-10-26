import { Link } from "@tanstack/react-router";
import GoToChat from "@/components/common/GoToChat";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetchFollowing } from "@/features/connnections/hooks/useFetchFollowed";
import type { MentorInList } from "@/shared/types/mentor";

interface FollowedMentorProps {
	count?: number;
}

export default function FollowedMentors({ count = 2 }: FollowedMentorProps) {
	const { data, isPending } = useFetchFollowing();

	// NOTE: replaced flatmap with flat
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
					) : mentors.length === 0 ? (
						<p className="text-center text-muted-foreground">
							You&rsquo;re not following any mentors yet.
						</p>
					) : (
						mentors.slice(0, count).map((mentor: MentorInList) => (
							<div
								key={mentor.id}
								className="flex items-center justify-between"
							>
								<div className="flex items-center">
									<UserAvatar
										image={mentor.user?.profilePicture}
										name={mentor.user?.name}
										size={8}
									/>
									<div className="ml-3">
										<p className="text-sm font-medium">{mentor.user?.name}</p>
										<p className="text-xs text-muted-foreground">
											{mentor.expertise?.name}
										</p>
									</div>
								</div>
								<GoToChat userId={mentor.id} />
							</div>
						))
					)}
				</div>

				{!isPending && mentors.length > 0 && hasMoreToShow && (
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
