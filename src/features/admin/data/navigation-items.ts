import {
	ChartLine,
	Home,
	MessageCircle,
	Newspaper,
	Settings,
	ShieldCheck,
	Star,
	Users,
} from "lucide-react";

export interface NavigationItem {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
	badge?: string;
}
export const navigationItems: NavigationItem[] = [
	{ id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
	{
		id: "usermanagement",
		name: "User Management",
		icon: Users,
		href: "/usermanagement",
	},
	{
		id: "expertisemanagement",
		name: "Expertise Management",
		icon: Star,
		href: "/expertisemanagement",
	},
	{
		id: "mentormanagement",
		name: "Mentor Management",
		icon: ShieldCheck,
		href: "/mentormanagement",
	},
	{ id: "articles", name: "Articles", icon: Newspaper, href: "/articles" },
	{
		id: "chatandsessions",
		name: "Chat & Sessions",
		icon: MessageCircle,
		href: "/chatandselp",
	},
	{
		id: "analytics",
		name: "Analytics",
		icon: ChartLine,
		href: "/analytics",
	},
	{ id: "settings", name: "Settings", icon: Settings, href: "/settings" },
];
