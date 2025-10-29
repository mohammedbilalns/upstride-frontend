import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

interface ShowMoreProps {
	resource: string;
	link: "/articles" | "/mentors";
	text?: string;
}

export default function ShowMoreContent({
	resource,
	link,
	text,
}: ShowMoreProps) {
	return (
		<div className="pt-2 mt-2 border-t">
			<Button variant="outline" className="w-full" asChild>
				<Link to={link}>
					{text ? text : "Show more"} {resource}
				</Link>
			</Button>
		</div>
	);
}
