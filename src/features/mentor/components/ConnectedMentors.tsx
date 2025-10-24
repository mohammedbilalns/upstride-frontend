import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MentorInList } from "@/shared/types/mentor";
import { useFetchFollowing } from "@/features/connnections/hooks/useFetchFollowed";
import UserAvatar from "@/components/common/UserAvatar";

export default function ConnectedMentors() {
	const { data, isLoading } = useFetchFollowing();

	const mentors = data?.pages.flatMap(page => page) || [];

	return (
		<Card>
			<CardHeader>
				<h2 className="text-lg font-semibold">Followed Mentors</h2>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{isLoading ? (
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
						</div>
					) : mentors.length === 0 ? (
							<p className="text-center text-muted-foreground">No Mentors Followed</p>
						) : (
								mentors.slice(0, 2).map((mentor: MentorInList) => (
									<div key={mentor.id} className="flex items-center">
										<UserAvatar image={mentor.user?.profilePicture} name={mentor.user?.name} size={8} />
										<div className="ml-3">
											<p className="text-sm font-medium">{mentor.user?.name}</p>
											<p className="text-xs text-muted-foreground">
												{mentor.expertise?.name}
											</p>
										</div>
									</div>
								))
							)}
				</div>
			</CardContent>
		</Card>
	);
}
