import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

interface ShowMoreProps {
  resource: string;
  link: "/articles" | "/mentors";
  text?: string;
}

/**
 * Component that displays a "Show more" button,
 * Used at the bottom of resource lists (e.g., articles, mentors).
 */
export default function ShowMoreContent({ resource, link, text }: ShowMoreProps) {
  return (
    <div className="pt-2 mt-2 border-t">
      <Button
        asChild
        variant="outline"
        className="w-full cursor-pointer"
        aria-label={`Show more ${resource}`}
      >
        <Link to={link}>
          {text ?? "Show more"} {resource}
        </Link>
      </Button>
    </div>
  );
}

