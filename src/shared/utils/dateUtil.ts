export const formatRelativeTime = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 0) {
		return "just now";
	}
	if (seconds < 30) {
		return "just now";
	}

	if (seconds < 60) {
		return "few seconds ago";
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		if (minutes === 1) {
			return "1 minute ago";
		} else if (minutes < 5) {
			return "a few minutes ago";
		} else {
			return `${minutes} minutes ago`;
		}
	}

	// If less than a day, return hours
	const hours = Math.floor(seconds / 3600);
	if (hours < 24) {
		if (hours === 1) {
			return "1 hour ago";
		} else {
			return `${hours} hours ago`;
		}
	}

	// If less than a week, return days
	const days = Math.floor(seconds / 86400);
	if (days < 7) {
		if (days === 1) {
			return "1 day ago";
		} else {
			return `${days} days ago`;
		}
	}

	// If less than a month, return weeks
	const weeks = Math.floor(seconds / 604800);
	if (weeks < 4) {
		if (weeks === 1) {
			return "1 week ago";
		} else {
			return `${weeks} weeks ago`;
		}
	}

	// If less than a year, return months
	const months = Math.floor(seconds / 2592000);
	if (months < 12) {
		if (months === 1) {
			return "1 month ago";
		} else {
			return `${months} months ago`;
		}
	}

	// If more than a year, return years
	const years = Math.floor(seconds / 31536000);
	if (years === 1) {
		return "1 year ago";
	} else {
		return `${years} years ago`;
	}
};

export const formatSmartDate = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds > 604800) {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
	return formatRelativeTime(dateString);
};

export const formatChatTimestamp = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();

	const isSameDay =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	const isYesterday = (() => {
		const yesterday = new Date(now);
		yesterday.setDate(now.getDate() - 1);
		return (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear()
		);
	})();
	// 🕓 If the message is from today — show only time
	if (isSameDay) {
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	}
	// If it’s from yesterday
	if (isYesterday) {
		return "Yesterday";
	}
	// If it’s from this week
	const dayDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
	if (dayDiff < 7) {
		return date.toLocaleDateString([], {
			weekday: "short", // e.g., "Mon", "Tue"
		});
	}
	// Otherwise show full date (short form)
	return date.toLocaleDateString([], {
		month: "short",
		day: "numeric",
		year: now.getFullYear() === date.getFullYear() ? undefined : "numeric",
	});
};

