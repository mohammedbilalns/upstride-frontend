import { Link } from "@tanstack/react-router";
import { Calendar, FileText, MessageCircle, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResourceType, ResourceConfig } from "@/shared/types/resourceTypes";

interface NoResourceProps {
  resource: ResourceType;
  isSearch?: boolean;
  clearFilters?: () => void;
  isHome?: boolean;
}

//TODO: update the component to take custom redirect urls
/**
 * Mapping of resources to their icon and messages.
 * Keeps UI text consistent across sections.
 */
const resourceConfig: ResourceConfig = {
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
    defaultMessage: "Get started by exploring mentors.",
    searchMessage: "Try adjusting your search filters or browse all followers.",
  },
  following: {
    icon: UsersRound,
    defaultMessage: "Get started by exploring mentors.",
    searchMessage: "Try adjusting your search filters or browse all following.",
  },
  chats: {
    icon: MessageCircle,
    defaultMessage: "Get started by creating a chat.",
    searchMessage: "Try adjusting your search filters or browse all chats.",
  },
  messages: {
    icon: MessageCircle,
    defaultMessage: "Get started by creating a chat.",
    searchMessage: "Try adjusting your search filters or browse all chats.",
  },
};

/**
 * A generic empty-state component displayed when no data is available.
 * It adapts based on the resource type, search context, and home context.
 */
const NoResource: React.FC<NoResourceProps> = ({
  resource,
  isSearch,
  clearFilters,
  isHome,
}) => {
  const config = resourceConfig[resource];
  const Icon = config.icon;

  /**
   * Conditionally render an action button:
   * - "Clear filters" for search results
   * - "Go to Home" for general empty states
   */
  const renderActionButton = () => {
    if (isSearch && clearFilters) {
      return (
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      );
    }

    if (!isHome) {
      return (
        <Button asChild className="cursor-pointer">
          <Link to="/home">Go to Home</Link>
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium mb-2 capitalize">
        No {resource} found
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md">
        {isSearch ? config.searchMessage : config.defaultMessage}
      </p>

      {/* Optional Actions */}
      {renderActionButton() && (
        <div className="flex gap-3">{renderActionButton()}</div>
      )}
    </div>
  );
};

export default NoResource;

