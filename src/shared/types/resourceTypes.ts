export type ResourceType =
  | "mentors"
  | "articles"
  | "sessions"
  | "followers"
  | "following"
  | "chats"
  | "messages";

export type ResourceConfig = Record<
  PropertyKey,
  {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    defaultMessage: string;
    searchMessage: string;
    defaultTitle?: string;
    searchTitle?: string;
  }
>;

