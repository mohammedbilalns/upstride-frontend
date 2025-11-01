import { useEffect, useState } from "react";

interface Chat {
	id: string;
	name: string;
	avatar?: string;
	lastMessage: string;
	timestamp: string;
	unread: number;
	isOnline: boolean;
	isMentor: boolean;
	isRead: boolean;
}

interface Message {
	id: string;
	content: string;
	timestamp: string;
	isOwn: boolean;
	isRead?: boolean;
	attachments?: {
		type: "image" | "file" | "audio";
		url?: string;
		name?: string;
	}[];
}

// Dummy data for chats
const dummyChats: Chat[] = [
	{
		id: "1",
		name: "Sarah Williams",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
		lastMessage: "Looking forward to our next session!",
		timestamp: "2024-01-15T10:30:00",
		unread: 0,
		isOnline: true,
		isMentor: true,
		isRead: true,
	},
	{
		id: "2",
		name: "Michael Chen",
		avatar: "https://randomuser.me/api/portraits/men/22.jpg",
		lastMessage: "Thanks for the advice on career transitions",
		timestamp: "2024-01-14T15:45:00",
		unread: 2,
		isOnline: false,
		isMentor: true,
		isRead: false,
	},
	{
		id: "3",
		name: "Alex Johnson",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
		lastMessage: "Are you available for a quick call tomorrow?",
		timestamp: "2024-01-13T09:20:00",
		unread: 0,
		isOnline: true,
		isMentor: false,
		isRead: true,
	},
	{
		id: "4",
		name: "Emma Thompson",
		avatar: "https://randomuser.me/api/portraits/women/68.jpg",
		lastMessage: "Your personal brand strategy looks great!",
		timestamp: "2024-01-12T14:15:00",
		unread: 1,
		isOnline: false,
		isMentor: true,
		isRead: false,
	},
];

// Dummy messages for each chat
const dummyMessages: Record<string, Message[]> = {
	"1": [
		{
			id: "1-1",
			content: "Hi Sarah! I wanted to follow up on our last session.",
			timestamp: "2024-01-15T10:15:00",
			isOwn: true,
			isRead: true,
		},
		{
			id: "1-2",
			content: "Hello! Great to hear from you. How are things going?",
			timestamp: "2024-01-15T10:18:00",
			isOwn: false,
			isRead: true,
		},
		{
			id: "1-3",
			content:
				"I've been implementing the leadership strategies we discussed, and they're making a real difference.",
			timestamp: "2024-01-15T10:20:00",
			isOwn: true,
			isRead: true,
		},
		{
			id: "1-4",
			content:
				"That's wonderful to hear! Which strategies have been most effective for you?",
			timestamp: "2024-01-15T10:25:00",
			isOwn: false,
			isRead: true,
		},
		{
			id: "1-5",
			content:
				"The regular check-ins and focusing on outcomes rather than activity. Looking forward to our next session!",
			timestamp: "2024-01-15T10:30:00",
			isOwn: true,
			isRead: true,
		},
	],
	"2": [
		{
			id: "2-1",
			content: "Hi Michael, thanks for the advice on career transitions.",
			timestamp: "2024-01-14T15:30:00",
			isOwn: true,
			isRead: false,
		},
		{
			id: "2-2",
			content: "You're welcome! How is the job search going?",
			timestamp: "2024-01-14T15:35:00",
			isOwn: false,
			isRead: false,
		},
		{
			id: "2-3",
			content:
				"I've had two interviews already, and your tips really helped me prepare.",
			timestamp: "2024-01-14T15:40:00",
			isOwn: true,
			isRead: false,
		},
		{
			id: "2-4",
			content: "That's great news! Keep me updated on your progress.",
			timestamp: "2024-01-14T15:45:00",
			isOwn: false,
			isRead: false,
		},
	],
};

export function useChats() {
	const [chats, setChats] = useState<Chat[]>(dummyChats);
	const [isLoading, setIsLoading] = useState(false);

	return {
		chats,
		isLoading,
	};
}

export function useChat(chatId: string) {
	const [chat, setChat] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate API call to fetch chat details
		const fetchChat = async () => {
			setIsLoading(true);

			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			const foundChat = dummyChats.find((c) => c.id === chatId);
			const chatMessages = dummyMessages[chatId] || [];

			setChat(foundChat || null);
			setMessages(chatMessages);
			setIsLoading(false);
		};

		fetchChat();
	}, [chatId]);

	const sendMessage = (content: string, files?: File[], audioBlob?: Blob) => {
		const attachments: {
			type: "image" | "file" | "audio";
			url?: string;
			name?: string;
		}[] = [];

		// Process files
		if (files && files.length > 0) {
			files.forEach((file) => {
				if (file.type.startsWith("image/")) {
					attachments.push({
						type: "image",
						url: URL.createObjectURL(file),
						name: file.name,
					});
				} else {
					attachments.push({
						type: "file",
						name: file.name,
					});
				}
			});
		}

		// Process audio
		if (audioBlob) {
			attachments.push({
				type: "audio",
				url: URL.createObjectURL(audioBlob),
			});
		}

		const newMessage: Message = {
			id: `${chatId}-${Date.now()}`,
			content,
			timestamp: new Date().toISOString(),
			isOwn: true,
			isRead: false,
			attachments: attachments.length > 0 ? attachments : undefined,
		};

		setMessages((prev) => [...prev, newMessage]);

		// Simulate reply after a delay
		setTimeout(() => {
			const replyMessage: Message = {
				id: `${chatId}-${Date.now()}`,
				content: "Thanks for your message! I'll get back to you soon.",
				timestamp: new Date().toISOString(),
				isOwn: false,
				isRead: true,
			};
			setMessages((prev) => [...prev, replyMessage]);
		}, 2000);
	};

	return {
		chat,
		messages,
		sendMessage,
		isLoading,
	};
}
