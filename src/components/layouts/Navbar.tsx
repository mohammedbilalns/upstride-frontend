import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/features/auth/hooks/logout.hooks";
import { NotificationsDropdown } from "@/features/notifications/components/NotificationDropdown";
import ThemeToggle from "../common/Theme-toggle";
import UserAvatar from "../common/UserAvatar";

// Navigation Links
const navLinks = [
	{ label: "Articles", href: "/articles", section: "articles" },
	{ label: "Mentors", href: "/mentors", section: "mentors" },
	{ label: "Sessions", href: "/sessions", section: "sessions" },
	{ label: "Network", href: "/network", section: "Network" },
	{ label: "Chats", href: "/chats", section: "chats" },
];

export default function Navbar() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const logoutMutation = useLogout();
	const { user } = useAuthStore();

	return (
		<header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
						<Zap className="h-5 w-5 text-primary-foreground" />
					</div>
					<h1 className="text-2xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
						UpStride
					</h1>
				</Link>

				<nav className="hidden md:flex items-center space-x-8">
					{navLinks.map((link) => (
						<Link
							key={link.section}
							to={link.href}
							className={`text-muted-foreground hover:text-foreground transition-colors font-medium ${
								router.state.location.pathname === link.href
									? "text-foreground"
									: ""
							}`}
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right Side Actions */}
				<div className="flex items-center space-x-4">
					<NotificationsDropdown />

					{/* Theme Toggle */}
					<ThemeToggle />
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="cursor-pointer relative h-8 w-8 rounded-full"
							>
								{user && (
									<UserAvatar
										name={user.name}
										image={user.profilePicture}
										size={8}
									/>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<div className="px-4 py-2 text-sm">
								<div>{user?.name}</div>
							</div>
							<Separator />
							<DropdownMenuItem asChild className="cursor-pointer">
								<Link to="/profile">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onSelect={() => logoutMutation.mutate()}
							>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsOpen(!isOpen)}
					>
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden py-3 border-t border-border/50">
					<nav className="flex flex-col space-y-2">
						{navLinks.map((link) => (
							<Link
								key={link.section}
								to={link.href}
								className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
									router.state.location.pathname === link.href
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted"
								}`}
								onClick={() => setIsOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</header>
	);
}
