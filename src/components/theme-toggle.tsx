import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/theme.store";
import { Button } from "./ui/button";

export default function ThemeToggle() {
	const { isDarkMode, toggleTheme } = useThemeStore();
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		if (theme === "dark" && !isDarkMode) {
			useThemeStore.setState({ isDarkMode: true });
		} else if (theme === "light" && isDarkMode) {
			useThemeStore.setState({ isDarkMode: false });
		}
	}, [theme, isDarkMode]);

	const handleToggleTheme = () => {
		toggleTheme();
		setTheme(isDarkMode ? "light" : "dark");
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleToggleTheme}
						className=" cursor-pointer relative h-10 w-10 rounded-full border bg-background/70 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:shadow-md"
						aria-label="Toggle theme"
					>
						<AnimatePresence mode="wait" initial={false}>
							{isDarkMode ? (
								<motion.div
									key="moon"
									initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
								>
									<Moon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
								</motion.div>
							) : (
								<motion.div
									key="sun"
									initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
								>
									<Sun className="h-5 w-5 text-amber-500" />
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
