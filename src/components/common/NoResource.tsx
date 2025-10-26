import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";

interface NoResourceProps {
  resource: string;
  isSearch?: boolean;
  clearFilters?: () => void;
}

export default function NoResource({ 
  resource, 
  isSearch,
  clearFilters 
}: NoResourceProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
        <UsersRound className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No {resource} found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {isSearch
          ? `Try adjusting your search filters or browse all ${resource}.`
          : `Get started by exploring our ${resource} program.`}
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
            <Button asChild>
              <Link to={"/home"}>Go To Home</Link>
            </Button>
          )}
      </div>
    </div>
  );
}
