export function createFallbackAvatar(name: string) {
	const words = name?.split(" ");
	if (words?.length > 1) {
		return (
			words[0]?.charAt(0)?.toUpperCase() + words[1]?.charAt(0)?.toUpperCase()
		);
	} else {
		return name?.charAt(0)?.toUpperCase();
	}
}
