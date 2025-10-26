import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthChart() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Network Growth</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-40 flex items-center justify-center bg-muted rounded-md">
					<p className="text-sm text-muted-foreground">Network growth chart</p>
				</div>
			</CardContent>
		</Card>
	);
}
