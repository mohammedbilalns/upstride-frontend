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
    defaultMessage: "Get started by exploring mentors",
    searchMessage: "Try adjusting your search filters or browse all followers.",
  },
  following: {
    icon: UsersRound,
    defaultMessage: "Get started by exploring mentors",
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

const NoResource: React.FC<NoResourceProps> = ({ resource, isSearch, clearFilters, isHome }) => {
  const config = resourceConfig[resource];
  const Icon = config.icon;

  const renderActionButton = () => {
    if (isSearch && clearFilters) {
      return (
        <Button className="cursor-pointer" variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      );
    }

    if (!isHome) {
      return (
        <Button asChild>
          <Link to="/home">Go To Home</Link>
        </Button>
      );
    }

    return null; 
  };

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
        {renderActionButton()}
      </div>
    </div>
  );
};

export default NoResource;

