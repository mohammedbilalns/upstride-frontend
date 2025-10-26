import type { Mentor } from "@/shared/types/mentor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, MessageCircle } from "lucide-react";
import { StarRating } from "./StarRating";
import FollowButton from "@/features/connnections/components/FollowButton";
import { Link } from "@tanstack/react-router";
import UserAvatar from "@/components/common/UserAvatar";
import GoToChat from "@/components/common/GoToChat";

const dummyRatings: Record<
	string,
	{ rating: number; reviewsCount: number; isAvailable: boolean }
> = {
	"68d25a05fca23226d5a1df2c": {
		rating: 4.8,
		reviewsCount: 24,
		isAvailable: true,
	},
};

export default function MentorCard({ mentor }: { mentor: Mentor }) {
	const dummyRating = dummyRatings[mentor.id] || {
		rating: 4.5,
		reviewsCount: 10,
		isAvailable: true,
	};

	return (
		<Card
			key={mentor.id}
			className="relative grid grid-rows-[auto_1fr_auto] h-full overflow-hidden"
		>
			<CardHeader className="pb-3 flex-shrink-0">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div className="flex flex-wrap items-start gap-3 min-w-0">
						<div className="relative flex-shrink-0">
							<UserAvatar image={mentor.user.profilePicture} name={mentor.user.name} />
							{dummyRating.isAvailable && (
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
							)}
						</div>

						<div className="min-w-0 flex-1">
							<h3 className="text-lg font-semibold truncate">
								{mentor.user.name}
							</h3>
							<p className="text-sm text-muted-foreground truncate">
								{mentor.expertise.name}
							</p>
							<div className="flex items-center mt-1 flex-wrap gap-1">
								<StarRating rating={dummyRating.rating} />
								<span className="text-xs text-muted-foreground">
									{dummyRating.rating} ({dummyRating.reviewsCount} reviews)
								</span>
							</div>
						</div>
					</div>

					{!dummyRating.isAvailable && (
						<Badge variant="outline" className="text-xs flex-shrink-0">
							<Clock className="h-3 w-3 mr-1" />
							Busy
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="pt-0 flex-1 flex flex-col overflow-hidden">
				{/* Limit bio to 2 lines */}
				<p className="text-sm text-muted-foreground line-clamp-2">
					{mentor.bio}
				</p>

				<div className="mt-3 flex flex-wrap gap-2">
					{mentor.skills.slice(0, 5).map((skill) => (
						<Badge
							key={skill.id}
							variant="secondary"
							className="text-xs flex-shrink-0"
						>
							{skill.name}
						</Badge>
					))}
					{mentor.skills.length > 5 && (
						<span className="text-xs text-muted-foreground">+{mentor.skills.length - 5} more</span>
					)}
				</div>
			</CardContent>

			<CardFooter className="flex flex-col items-start pt-3 sm:flex-row sm:items-center sm:justify-between gap-2 flex-wrap">
				<div className="text-sm mb-1 sm:mb-0">
					<span className="text-muted-foreground">Experience:</span>
					<span className="font-medium ml-1">
						{mentor.yearsOfExperience}{" "}
						{mentor.yearsOfExperience === 1 ? "year" : "years"}
					</span>
				</div>

				<div className="flex flex-wrap gap-2 w-full sm:w-auto">
					{/* Message button */}
			
					<GoToChat userId={mentor.id} isText={true} />

					{/* Follow button */}
					<FollowButton isFollowing={false} mentorId={mentor.id} />

					<Link
						to={`/mentor/$mentorId`}
            params={{mentorId: mentor.id}}
						className="flex-1 sm:flex-initial"
					>
						<Button size="sm" className="w-full cursor-pointer">
							View Profile
						</Button>
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

