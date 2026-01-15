import { Link } from "@tanstack/react-router";
import { Activity } from "react";
import ErrorState from "@/components/common/ErrorState";
import Pending from "@/components/common/Pending";
import ShowMoreContent from "@/components/common/ShowMore";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Mentor } from "@/shared/types/mentor";
import { useFetchSuggestedMentors } from "../../mentor/hooks/mentors-queries.hooks";

interface SuggestedMentorsProps {
	count?: number;
}
export default function SuggestedMentors({ count }: SuggestedMentorsProps) {
	const { data, isPending, isError, refetch } = useFetchSuggestedMentors(count);
	const mentors = data?.pages.flat() || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Suggested Mentors</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{isPending ? (
					<Pending resource="mentors" />
				) : isError ? (
					<ErrorState
						message="Failed to load suggested mentors. Please try again."
						onRetry={() => refetch()}
						variant="compact"
					/>
				) : mentors.length === 0 ? (
					<p className="text-center text-muted-foreground">
						No mentors in the Platform yet.
					</p>
				) : (
					<div className="space-y-3">
						{mentors.map((mentor: Mentor) => (
							<Link
								key={mentor.id}
								to="/mentors/$mentorId"
								params={{ mentorId: mentor.id }}
								className="block"
							>
								<div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
									<div className="flex items-center">
										<div className="relative">
											<UserAvatar
												image={mentor?.user?.profilePicture}
												name={mentor?.user?.name}
												size={10}
											/>
										</div>
										<div className="ml-3">
											<p className="text-sm font-medium group-hover:text-primary transition-colors">
												{mentor?.user?.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{mentor?.expertise?.name}
											</p>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
				<Activity mode={mentors?.length > 0 ? "visible" : "hidden"}>
					<ShowMoreContent
						resource="mentors"
						link="/mentors"
						text="Discover more"
					/>
				</Activity>
			</CardContent>
		</Card>
	);
}
