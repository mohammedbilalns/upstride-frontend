import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import { UserPlus } from "lucide-react";


const dummySuggestions = [
	{
		id: "sug1",
		user: {
			_id: "suguser1",
			name: "Emily Rodriguez",
			profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
		},
		bio: "UX Designer with 8 years of experience in mobile app design",
		expertise: { name: "UX Design" },
		skills: ["Figma", "User Research", "Prototyping"],
		mutualConnections: 3,
	},
];

export default function SuggestedConnections() {

	return (

		<Card>
			<CardHeader>
				<CardTitle>Suggested Connections</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{dummySuggestions.map((suggestion) => (
					<div key={suggestion.id} className="flex items-center justify-between">
						<div className="flex items-center">
							<UserAvatar image={suggestion.user.profilePicture} name={suggestion.user.name} size={10} />
							<div className="ml-3">
								<p className="text-sm font-medium">{suggestion.user.name}</p>
								<p className="text-xs text-muted-foreground">
									{suggestion.mutualConnections} mutual connections
								</p>
							</div>
						</div>
						<Button size="sm" variant="outline">
							<UserPlus className="h-4 w-4 mr-1" />
							Connect
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	)

}
