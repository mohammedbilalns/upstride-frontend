import { Link } from "@tanstack/react-router";
import { Calendar, FileText, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResourceProps {
	resource: ResourceType;
	isSearch?: boolean;
	clearFilters?: () => void;
	isHome?: boolean;
}

type ResourceType =
	| "mentors"
	| "articles"
	| "sessions"
	| "followers"
	| "following";

const resourceConfig = {
	mentors: {
		icon: UsersRound,
		defaultMessage: "Get started by exploring our mentorship program.",
		searchMessage: "Try adjusting your search filters or browse all mentors.",
	},
	articles: {
		icon: FileText,
		defaultMessage: "Get started by exploring our articles collection.",
		searchMessage: "Try adjusting your search filters or browse all articles.",
	},
	sessions: {
		icon: Calendar,
		defaultMessage: "Get started by exploring our upcoming sessions.",
		searchMessage: "Try adjusting your search filters or browse all sessions.",
	},
	followers: {
		icon: UsersRound,
		defaultMessage: "Get started by exploring mentors",
		searchMessage: "Try adjusting your search filters or browse all followers.",
	},
	following: {
		icon: UsersRound,
		defaultMessage: "Get started by exploring mentors",
		searchMessage: "Try adjusting your search filters or browse all following.",
	},
};

export default function NoResource({
	resource,
	isSearch,
	clearFilters,
	isHome,
}: NoResourceProps) {
	const config = resourceConfig[resource];
	const Icon = config.icon;

	return (
		<div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
			<div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
				<Icon className="w-8 h-8 text-muted-foreground" />
			</div>

			<h3 className="text-lg font-medium mb-2">No {resource} found</h3>

			<p className="text-muted-foreground mb-6 max-w-md">
				{isSearch ? config.searchMessage : config.defaultMessage}
			</p>

			<div className="flex gap-3">
				{isSearch ? (
					<Button
						className="cursor-pointer"
						variant="outline"
						onClick={clearFilters}
					>
						Clear filters
					</Button>
				) : (
					!isHome && (
						<Button asChild>
							<Link to="/home">Go To Home</Link>
						</Button>
					)
				)}
			</div>
		</div>
	);
}
