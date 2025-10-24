import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MentorInList } from "@/shared/types/mentor";

export default function ConnectedMentors() {
	const connectedMentors:MentorInList[]= []

	return (
		<Card>
			<CardHeader>
				<h2 className="text-lg font-semibold">My Connected Mentors</h2>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{connectedMentors.slice(0, 2).map((mentor: MentorInList) => (
						<div key={mentor.id} className="flex items-center">
							<img
								src={mentor.user.profilePicture || "https://randomuser.me/api/portraits/lego/0.jpg"}
								alt={mentor.user.name}
								className="h-8 w-8 rounded-full mr-3"
							/>
							<div>
								<p className="text-sm font-medium">{mentor.user.name}</p>
								<p className="text-xs text-muted-foreground">
									{mentor.expertise.name}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>

	)
}
