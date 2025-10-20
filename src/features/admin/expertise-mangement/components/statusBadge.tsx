import { Check, X } from "lucide-react";

export function StatusBadge({ isVerified }: { isVerified: boolean }) {
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
				isVerified
					? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
					: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
			}`}
		>
			{isVerified ? (
				<>
					<Check className="w-3 h-3" />
					Verified
				</>
			) : (
				<>
					<X className="w-3 h-3" />
					Not Verified
				</>
			)}
		</span>
	);
}
