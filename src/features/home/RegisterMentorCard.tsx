import { Link } from "@tanstack/react-router";
import { Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterMentorCard() {
	return (
		<Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
			<CardContent className="p-6">
				<div className="flex flex-col items-center text-center">
					<div className="bg-primary/10 p-3 rounded-full mb-4">
						<Award className="h-8 w-8 text-primary" />
					</div>
					<h3 className="text-lg font-semibold mb-2">Become a Mentor</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Share your expertise and help others grow in their careers.
					</p>

					<Link to="/mentors/register">
						<Button className="w-full cursor-pointer">
							<Star className="h-4 w-4 mr-2" />
							Register as Mentor
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
