import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummySessions } from "@/routes/(authenticated)/home/-dummyData";

export default function UpcomingSessions() {
	// TODO: add real data
	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Sessions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{dummySessions.map((session) => (
					<div
						key={session.id}
						className={`p-3 rounded-lg bg-muted border-l-4 ${session.color}`}
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium">{session.mentorName}</p>
								<p className="text-xs text-muted-foreground">{session.title}</p>
							</div>
							<Badge variant="outline">{session.date}</Badge>
						</div>
						<div className="flex items-center mt-2 text-sm text-muted-foreground">
							<Clock className="h-3 w-3 mr-1" />
							<span>{session.time}</span>
						</div>
						<Button className="cursor-pointer w-full mt-3" size="sm">
							Join Session
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
