import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { RowsPerPage } from "@/routes/admin/-validations/searchParamsSchema";

interface PaginationProps {
	page: number;
	totalPages: number;
	rowsPerPage: number;
	setPage: (page: number) => void;
	setRowsPerPage: (rows: RowsPerPage) => void;
}

export function Pagination({
	page,
	totalPages,
	rowsPerPage,
	setPage,
	setRowsPerPage,
}: PaginationProps) {
	const getPaginationRange = () => {
		const delta = 2;
		const range: (number | string)[] = [];
		for (
			let i = Math.max(2, page - delta);
			i <= Math.min(totalPages - 1, page + delta);
			i++
		) {
			range.push(i);
		}
		if (page - delta > 2) {
			range.unshift("…");
		}
		if (page + delta < totalPages - 1) {
			range.push("…");
		}
		range.unshift(1);
		if (totalPages > 1) range.push(totalPages);
		return range;
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
			<div className="flex items-center space-x-2 ">
				<span className="text-sm text-muted-foreground">Rows per page:</span>
				<Select
					value={String(rowsPerPage)}
					onValueChange={(v) => {
						setRowsPerPage(Number(v));
						setPage(1);
					}}
				>
					<SelectTrigger className="w-20">
						<SelectValue placeholder="Rows" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="20">20</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center space-x-2">
				<Button
					className="cursor-pointer"
					size="sm"
					variant="outline"
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
				>
					Previous
				</Button>

				{getPaginationRange().map((p, i) =>
					typeof p === "number" ? (
						<Button
							className="cursor-pointer"
							key={i}
							size="sm"
							variant={p === page ? "default" : "outline"}
							onClick={() => setPage(p)}
						>
							{p}
						</Button>
					) : (
						<span key={p} className="px-2 text-muted-foreground">
							…
						</span>
					),
				)}

				<Button
					className="cursor-pointer"
					size="sm"
					variant="outline"
					disabled={page === totalPages}
					onClick={() => setPage(page + 1)}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
