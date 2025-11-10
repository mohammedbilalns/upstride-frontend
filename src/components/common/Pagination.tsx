import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RowsPerPage } from "@/features/admin/schemas/searchParamsSchema";

interface PaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: RowsPerPage) => void;
}

/**
 * Pagination component with page controls and row selection.
 * - Displays page buttons with ellipsis for large datasets.
 * - Provides rows-per-page selector.
 */
export function Pagination({
  page,
  totalPages,
  rowsPerPage,
  setPage,
  setRowsPerPage,
}: PaginationProps) {
  /**
   * Generates pagination numbers with ellipses for long ranges.
   * Example: [1, "…", 5, 6, 7, "…", 10]
   */
  const getPaginationRange = () => {
    const delta = 2; // how many pages to show around the current
    const range: (number | string)[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) range.unshift("…");
    if (page + delta < totalPages - 1) range.push("…");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
      {/* Rows-per-page selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => {
            setRowsPerPage(Number(v));
            setPage(1); // reset page when rows-per-page changes
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

      {/* Pagination buttons */}
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="cursor-pointer"
          aria-label="Previous page"
        >
          Previous
        </Button>

        {getPaginationRange().map((p, i) =>
          typeof p === "number" ? (
            <Button
              key={`${p}-${i}`}
              size="sm"
              variant={p === page ? "default" : "outline"}
              onClick={() => setPage(p)}
              className="cursor-pointer"
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ) : (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-muted-foreground select-none"
              aria-hidden="true"
            >
              …
            </span>
          )
        )}

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="cursor-pointer"
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

