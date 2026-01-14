import { useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/common/Theme-toggle";
import { type NavigationItem, navigationItems } from "../data/navigation-items";
import { SidebarItem } from "@/components/common/SidebarItem";
import AdminDetails from "./AdminDetails";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
	className?: string;
}

// WARNING: Not type safe since some of the routes are not defined yet 
export function Sidebar({ className = "" }: SidebarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const location = useLocation();

	const currentPath = location.pathname;

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => setIsOpen(!isOpen);
	const toggleCollapse = () => setIsCollapsed(!isCollapsed);

	const handleItemClick = () => {
		if (window.innerWidth < 768) {
			setIsOpen(false);
		}
	};

	const isActive = (item: NavigationItem) => {
		return currentPath === `/admin${item.href}`;
	};

	return (
		<>
			<button
				onClick={toggleSidebar}
				type="button"
				className="fixed bottom-6 left-6 z-50 p-3 rounded-xl bg-card shadow-lg border border-border/50 backdrop-blur-sm md:hidden hover:bg-accent transition-all duration-200"
				aria-label="Toggle sidebar"
			>
				{isOpen ? (
					<X className="h-5 w-5 text-foreground" />
				) : (
					<Menu className="h-5 w-5 text-foreground" />
				)}
			</button>

			{/* Mobile overlay */}
			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
					onClick={toggleSidebar}
					aria-label="Close sidebar"
				/>
			)}

			<div
				className={`
          fixed top-0 left-0 h-screen bg-linear-to-b from-background to-muted/20 border-r border-border/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-80"}
          md:translate-x-0 md:relative md:z-auto
          ${className}
        `}
			>
				<div className="flex items-center justify-between p-6 border-b border-border/50">
					{!isCollapsed && (
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<span className="text-primary-foreground font-bold text-lg">
									S
								</span>
							</div>
							<div className="flex flex-col">
								<span className="font-bold text-foreground text-xl">
									Upstride
								</span>
								<span className="text-sm text-muted-foreground">Dashboard</span>
							</div>
						</div>
					)}

					{isCollapsed && (
						<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
							<span className="text-primary-foreground font-bold text-lg">
								S
							</span>
						</div>
					)}

					{/* Desktop collapse button */}
					<button
						type="button"
						onClick={toggleCollapse}
						className="hidden md:flex p-2 rounded-lg hover:bg-accent transition-all duration-200"
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{isCollapsed ? (
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						) : (
							<ChevronLeft className="h-4 w-4 text-muted-foreground" />
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav
					className={`flex-1 px-4 scrollbar-hide py-2  scrollbar-hide ${isCollapsed ? "overflow-hidden" : "overflow-y-auto"
						}`}
				>
					<ul className="space-y-1">
						{navigationItems.map((item) => (
							<SidebarItem
								key={item.id}
								to={`/admin/${item.href}`}
								icon={item.icon}
								name={item.name}
								badge={item.badge}
								isActive={isActive(item)}
								isCollapsed={isCollapsed}
								onClick={handleItemClick}
							/>
						))}
					</ul>
				</nav>

				<div
					className={`p-4 flex ${isCollapsed ? "justify-center" : "justify-start"}`}
				>
					<ThemeToggle />
				</div>

				<div className="mt-auto border-t border-border/50 backdrop-blur-sm">
					<AdminDetails isCollapsed={isCollapsed} />
					<LogoutButton isCollapsed={isCollapsed} />
				</div>
			</div>
		</>
	);
}
