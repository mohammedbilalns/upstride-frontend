import { Book, Calendar, UserPlus } from "lucide-react";

interface Session {
	id: number;
	mentorName: string;
	title: string;
	time: string;
	date: string;
	color: string;
}
interface RecommendedArticle {
	id: number;
	title: string;
	readTime: string;
	imageUrl: string;
}
interface QuickAction {
	id: number;
	title: string;
	icon: React.ComponentType<{ className?: string }>;
}

// Dummy data for sessions
export const dummySessions: Session[] = [
	{
		id: 1,
		mentorName: "Sarah Williams",
		title: "Leadership Coaching",
		time: "2:00 PM - 3:00 PM",
		date: "Today",
		color: "border-l-blue-500",
	},
	{
		id: 2,
		mentorName: "Michael Chen",
		title: "Career Guidance",
		time: "11:00 AM - 12:00 PM",
		date: "Tomorrow",
		color: "border-l-green-500",
	},
];
// Dummy data for recommended articles
export const dummyRecommendedArticles: RecommendedArticle[] = [
	{
		id: 1,
		title: "Effective Communication in Remote Teams",
		readTime: "5 min read",
		imageUrl:
			"https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
	},
	{
		id: 2,
		title: "Setting Career Goals That Actually Work",
		readTime: "7 min read",
		imageUrl:
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
	},
	{
		id: 3,
		title: "Networking Strategies for Introverts",
		readTime: "4 min read",
		imageUrl:
			"https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
	},
];
// Dummy data for quick actions
export const dummyQuickActions: QuickAction[] = [
	{
		id: 1,
		title: "Request Mentorship",
		icon: UserPlus,
	},
	{
		id: 2,
		title: "Browse Resources",
		icon: Book,
	},
	{
		id: 3,
		title: "View Calendar",
		icon: Calendar,
	},
];
