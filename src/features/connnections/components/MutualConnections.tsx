import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchMutualMentors } from "@/features/articles/hooks/useFetchMutualMentors";

export default function MutualConnections() {
	const { data, isPending, isError, refetch } = useFetchMutualMentors();
	console.log("data", data);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Mutual Connections</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div className="flex -space-x-2">
							<Avatar className="h-8 w-8 border-2 border-background">
								<AvatarImage src="https://randomuser.me/api/portraits/men/5.jpg" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<Avatar className="h-8 w-8 border-2 border-background">
								<AvatarImage src="https://randomuser.me/api/portraits/women/6.jpg" />
								<AvatarFallback>SW</AvatarFallback>
							</Avatar>
							<Avatar className="h-8 w-8 border-2 border-background">
								<AvatarImage src="https://randomuser.me/api/portraits/men/7.jpg" />
								<AvatarFallback>MJ</AvatarFallback>
							</Avatar>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium">3 mutual connections</p>
							<p className="text-xs text-muted-foreground">
								with Sarah Williams
							</p>
						</div>
					</div>
					<Button size="sm" variant="outline" className="cursor-pointer">
						View
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
