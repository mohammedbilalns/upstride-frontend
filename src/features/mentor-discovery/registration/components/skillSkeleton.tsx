export const SkillSkeleton = () => {
	const skeletonKeys = [
		"skill-skeleton-1",
		"skill-skeleton-2",
		"skill-skeleton-3",
		"skill-skeleton-4",
	];

	return (
		<div className="space-y-3">
			<div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
			<div className="grid grid-cols-2 gap-2">
				{skeletonKeys.map((key) => (
					<div key={key} className="flex items-center space-x-2">
						<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
					</div>
				))}
			</div>
		</div>
	);
};
