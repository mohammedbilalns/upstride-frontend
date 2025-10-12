export const SkillSkeleton = () => (
	<div className="space-y-3">
		<div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
		<div className="grid grid-cols-2 gap-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center space-x-2">
					<div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
				</div>
			))}
		</div>
	</div>
);
