import { Calendar, Check, X } from "lucide-react";
import type { Mentor } from "@/shared/types/mentor";

const StatusBadge = (mentor: Mentor) => {
	if (!mentor.isPending && !mentor.isRejected) {
		return (
			<span
				key={mentor.id}
				className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
			>
				<Check className="w-3 h-3" />
				Approved
			</span>
		);
	}
	if (mentor.isRejected) {
		return (
			<span
				key={mentor.id}
				className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
			>
				<X className="w-3 h-3" />
				Rejected
			</span>
		);
	}

	return (
		<span
			key={mentor.id}
			className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
		>
			<Calendar className="w-3 h-3" />
			Pending
		</span>
	);
};

export default StatusBadge;
