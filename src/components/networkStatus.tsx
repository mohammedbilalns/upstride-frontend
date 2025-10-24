import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

export default function NetworkStatusIndicator() {
	const isOnline = useNetworkStatus();

	if (isOnline) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-3 text-sm text-white bg-yellow-600 shadow-lg animate-pulse">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="w-5 h-5 mr-2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
			You are currently offline.
		</div>
	);
}
