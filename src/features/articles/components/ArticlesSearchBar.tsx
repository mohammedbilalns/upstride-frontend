import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	searchInput: string;
	onSearchChange: (value: string) => void;
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
}

export function ArticlesSearchBar({
	searchInput,
	onSearchChange,
	viewMode,
	onViewModeChange,
}: SearchBarProps) {
	return (
		<div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-lg border">
			<div className="relative w-full sm:max-w-md">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					placeholder="Search articles..."
					className="pl-10"
					value={searchInput}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>
			<div className="flex space-x-2">
				<Button
					variant={viewMode === "grid" ? "default" : "outline"}
					size="sm"
					onClick={() => onViewModeChange("grid")}
				>
					<LayoutGrid className="h-4 w-4" />
				</Button>
				<Button
					variant={viewMode === "list" ? "default" : "outline"}
					size="sm"
					onClick={() => onViewModeChange("list")}
				>
					<List className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
