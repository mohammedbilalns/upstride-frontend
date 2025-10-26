import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createFallbackAvatar } from "@/shared/utils/createFallbackAvatar";

interface UserAvatarProps {
	image?: string;
	name: string;
	size?: number;
}

export default function UserAvatar({ image, name, size }: UserAvatarProps) {
	const heightStyle = size ? `h-${size} w-${size}` : "h-16 w-16";

	return (
		<Avatar className={heightStyle}>
			<AvatarImage src={image} alt={name} />
			<AvatarFallback>{createFallbackAvatar(name)}</AvatarFallback>
		</Avatar>
	);
}
