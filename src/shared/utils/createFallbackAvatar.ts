/**
 * Generates a fallback avatar label (e.g. "JD" for "John Doe").
 *
 * @param name - Full name or display name of the user.
 * @returns Uppercase initials (one or two letters).
 */
export function createFallbackAvatar(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  // Use first two initials if there are multiple words, otherwise the first letter only.
  if (words.length > 1) {
    return (
      words[0].charAt(0).toUpperCase() +
      words[1].charAt(0).toUpperCase()
    );
  }

  return words[0].charAt(0).toUpperCase();
}

