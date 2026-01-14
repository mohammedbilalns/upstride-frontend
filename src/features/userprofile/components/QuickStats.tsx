import { Award, BarChart3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickStatsProps {
	expertiseCount: number;
	skillsCount: number;
	role: string;
}

export function QuickStats({
	expertiseCount,
	skillsCount,
	role,
}: QuickStatsProps) {
	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle className="text-lg">Quick Stats</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<BarChart3 className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm">Expertise Areas</span>
					</div>
					<Badge variant="outline">{expertiseCount}</Badge>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Award className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm">Skills</span>
					</div>
					<Badge variant="outline">{skillsCount}</Badge>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Users className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm">Account Type</span>
					</div>
					<Badge variant={role === "mentor" ? "default" : "secondary"}>
						{role === "mentor" ? "Mentor" : "User"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
