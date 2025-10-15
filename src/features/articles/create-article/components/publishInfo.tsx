import { Calendar, User } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PublishInfoProps {
	handleSave: () => void;
	isSaving: boolean;
	isEdit?: boolean;
}

export default function PublishInfo({
	handleSave,
	isSaving,
	isEdit = false,
}: PublishInfoProps) {
	const { user } = useAuthStore();

	return (
		<Card className="flex-1 flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Calendar className="h-5 w-5 mr-2" />
					{isEdit ? "Update" : "Publish"}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col space-y-4">
				<div className="flex items-center text-sm text-muted-foreground">
					<User className="h-4 w-4 mr-2" />
					<span>Published as {user?.name}</span>
				</div>
				{/* <div className="flex items-center text-sm text-muted-foreground"> */}
				{/*   <Calendar className="h-4 w-4 mr-2" /> */}
				{/*   <span>{isEdit ? "Updated" : "Immediately on publish"}</span> */}
				{/* </div> */}
				<Separator />
				<div className="mt-auto">
					<Button
						className="w-full cursor-pointer"
						onClick={handleSave}
						disabled={isSaving}
					>
						{isSaving
							? isEdit
								? "Updating..."
								: "Saving..."
							: isEdit
								? "Update Article"
								: "Publish Article"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
