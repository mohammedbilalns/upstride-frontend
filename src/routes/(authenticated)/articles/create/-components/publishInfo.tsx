import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PublishInfoProps {
	handleSave: any;
	isSaving: boolean;
}

export default function PublishInfo({
	handleSave,
	isSaving,
}: PublishInfoProps) {
	return (
		<Card className="flex-1 flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Calendar className="h-5 w-5 mr-2" />
					Publish
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col space-y-4">
				<div className="flex items-center text-sm text-muted-foreground">
					<User className="h-4 w-4 mr-2" />
					<span>Published as Alex Johnson</span>
				</div>
				<div className="flex items-center text-sm text-muted-foreground">
					<Calendar className="h-4 w-4 mr-2" />
					<span>Immediately on publish</span>
				</div>
				<Separator />
				<div className="mt-auto">
					<Button
						className="w-full cursor-pointer"
						onClick={handleSave}
						disabled={isSaving}
					>
						{isSaving ? "Saving..." : "Publish Article"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
