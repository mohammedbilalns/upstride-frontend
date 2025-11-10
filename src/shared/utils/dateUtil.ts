/**
 * Formats a given date string into a human-readable relative time string.
 * Examples: "just now", "2 minutes ago", "1 week ago", "3 months ago"
 *
 * @param dateString - The ISO date string to format.
 * @returns A relative time string.
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // Handle invalid or future dates
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0 || seconds < 30) return "just now";

  // time intervals in seconds
  const intervals = {
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31536000,
  };

  if (seconds < intervals.minute) return "few seconds ago";

  const minutes = Math.floor(seconds / intervals.minute);
  if (minutes < 60) {
    if (minutes === 1) return "1 minute ago";
    if (minutes < 5) return "a few minutes ago";
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(seconds / intervals.hour);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;

  const days = Math.floor(seconds / intervals.day);
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;

  const weeks = Math.floor(seconds / intervals.week);
  if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;

  const months = Math.floor(seconds / intervals.month);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;

  const years = Math.floor(seconds / intervals.year);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};

/**
 * Smart date formatter:
 * - Returns relative time if within a week.
 * - Returns short date format (e.g., "Nov 10, 2025") if older.
 *
 * @param dateString - The date to format.
 * @returns A smartly formatted date string.
 */
export const formatSmartDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If older than a week → show date instead of relative time
  if (seconds > 604800) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return formatRelativeTime(dateString);
};

/**
 * Formats timestamps for chat messages:
 * - "12:45 PM" for today
 * - "Yesterday" for yesterday
 * - "Mon", "Tue" for messages within a week
 * - "Nov 10" or "Nov 10, 2024" for older messages
 *
 * @param dateString - The date of the message.
 * @returns Formatted timestamp string.
 */
export const formatChatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  if (isNaN(date.getTime())) return "";

  // Check if same day
  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (isYesterday) return "Yesterday";

  const dayDiff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Within the same week → show weekday name
  if (dayDiff < 7) {
    return date.toLocaleDateString([], {
      weekday: "short",
    });
  }

  // Otherwise → show short date
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: now.getFullYear() === date.getFullYear() ? undefined : "numeric",
  });
};


export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};
