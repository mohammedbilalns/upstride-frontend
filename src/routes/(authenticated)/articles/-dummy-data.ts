export const sortOptions = [
	{ value: "newest", label: "Newest First" },
	{ value: "popular", label: "Most Popular" },
	{ value: "commented", label: "Most Commented" },
];

export interface Comment {
	id: number;
	author: {
		name: string;
		imageUrl: string;
	};
	content: string;
	timestamp: string;
	likes: number;
}

export const dummyComments: Comment[] = [
	{
		id: 1,
		author: {
			name: "Alex Johnson",
			imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
		},
		content:
			"Great article! These strategies have really helped me improve my remote leadership skills. The point about focusing on outcomes rather than activity is particularly valuable.",
		timestamp: "2 hours ago",
		likes: 12,
	},
	{
		id: 2,
		author: {
			name: "Maria Garcia",
			imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
		},
		content:
			"I especially appreciate the emphasis on team well-being. It's so important to remember that remote work can be isolating and leaders need to be proactive about maintaining team connections.",
		timestamp: "5 hours ago",
		likes: 8,
	},
	{
		id: 3,
		author: {
			name: "James Wilson",
			imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
		},
		content:
			"The communication protocols section is spot on. We've implemented similar strategies in our team and it's made a huge difference in our productivity.",
		timestamp: "1 day ago",
		likes: 15,
	},
];
