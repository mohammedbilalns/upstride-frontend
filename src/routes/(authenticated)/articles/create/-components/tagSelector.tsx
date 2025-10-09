import { Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TagSelectorProps {
	tags: string[];
	addTag: ()=>void;
	removeTag:(tag: string)=> void;
	newTag: string;
	setNewTag: any;
	error?: string  ;   
}

export default function TagSelector({
	tags,
	addTag,
	removeTag,
	newTag,
	setNewTag,
	error
}: TagSelectorProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Tag className="h-5 w-5 mr-2" />
					Tags
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-2">
					{tags.map((tag, index) => (
						<Badge
							key={index}
							variant="secondary"
							className="flex items-center"
						>
							{tag}
							<button
								onClick={() => removeTag(tag)}
								className="ml-2 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
				<div className="flex space-x-2">
					<Input
						placeholder="Add tag..."
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter" && newTag.trim()) {
								addTag();
								setNewTag("");
							}
						}}
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							if (newTag.trim()) {
								addTag();
								setNewTag("");
							}
						}}
					>
						Add
					</Button>
				</div>
			</CardContent>
			{error && (
				<p className="text-red-500 text-sm mt-1">
					{error}
				</p>
			)}
		</Card>
	);
}
