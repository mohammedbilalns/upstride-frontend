import { Book, Calendar, UserPlus } from "lucide-react";

interface Mentor {
	id: number;
	name: string;
	title: string;
	imageUrl: string;
	isOnline: boolean;
}
interface Article {
	id: number;
	title: string;
	description: string;
	author: {
		name: string;
		imageUrl: string;
		isMentor: boolean;
	};
	publishedAt: string;
	likes: number;
	comments: number;
	views: string;
}
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
	icon: any;
}

export const dummyMentors: Mentor[] = [
	{
		id: 1,
		name: "Sarah Williams",
		title: "Leadership Coach",
		imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		isOnline: true,
	},
	{
		id: 2,
		name: "Michael Chen",
		title: "Tech Career Advisor",
		imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		isOnline: true,
	},
	{
		id: 3,
		name: "Emma Thompson",
		title: "Personal Branding",
		imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
		isOnline: false,
	},
];
// Dummy data for articles
export const dummyArticles: Article[] = [
	{
		id: 1,
		title: "5 Strategies for Effective Remote Leadership",
		description:
			"Leading remote teams requires different approaches than traditional in-person management. Here are five strategies I've found most effective in my 10+ years of experience...",
		author: {
			name: "Sarah Williams",
			imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
			isMentor: true,
		},
		publishedAt: "2 hours ago",
		likes: 42,
		comments: 7,
		views: "1.2K",
	},
	{
		id: 2,
		title: "Navigating Career Transitions in Tech",
		description:
			"Changing roles within the tech industry can be challenging but rewarding. Here's how to make a smooth transition without losing momentum in your career growth...",
		author: {
			name: "Michael Chen",
			imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
			isMentor: true,
		},
		publishedAt: "1 day ago",
		likes: 87,
		comments: 15,
		views: "3.4K",
	},
	{
		id: 3,
		title: "Building Your Personal Brand as a Professional",
		description:
			"Your personal brand is how you market yourself to the world. Here are practical steps to build and maintain a strong professional brand that opens doors...",
		author: {
			name: "Emma Thompson",
			imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
			isMentor: true,
		},
		publishedAt: "3 days ago",
		likes: 124,
		comments: 23,
		views: "5.7K",
	},
];
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
