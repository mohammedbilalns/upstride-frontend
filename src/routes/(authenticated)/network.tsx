import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionStats from "@/features/connnections/components/ConnectionStats";
import FollowersList from "@/features/connnections/components/FollowersList";
import FollowingList from "@/features/connnections/components/FollowingList";
import GrowthChart from "@/features/connnections/components/GrowthChart";
import MutualConnections from "@/features/connnections/components/MutualConnections";
import RecentActivityCard from "@/features/connnections/components/RecentActivityCard";
import SuggestedMentors from "@/features/home/SuggestedMentors";

export const Route = createFileRoute("/(authenticated)/network")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuthStore();
	const isMentor = user?.role === "mentor";
	const [activeTab, setActiveTab] = useState("following");

	return (
		<div className="min-h-[calc(100vh-5rem)] bg-background">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold mb-2">Network</h1>
					<p className="text-muted-foreground">
						Manage your professional network and connect with mentors in your
						field.
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Connection Stats */}
						<ConnectionStats />
						{/* Suggested Connections - Only for non-mentors */}
						{!isMentor && <SuggestedMentors />}
					</div>

					{/* Main Content Area */}
					<div className="w-full lg:w-2/4">
						{isMentor ? (
							// Show tabs for mentors
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger
										value="following"
										className="flex items-center gap-2 cursor-pointer "
									>
										<UserCheck className="h-4 w-4" />
										Following
									</TabsTrigger>
									<TabsTrigger
										value="followers"
										className="flex items-center gap-2 cursor-pointer"
									>
										<Users className="h-4 w-4" />
										Followers
									</TabsTrigger>
								</TabsList>

								<TabsContent value="following" className="mt-6">
									<FollowingList />
								</TabsContent>
								<TabsContent value="followers" className="mt-6">
									<FollowersList />
								</TabsContent>
							</Tabs>
						) : (
							// Show only following list for non-mentors
							<div className="mt-6">
								<div className="mb-4">
									<h2 className="text-lg font-semibold flex items-center gap-2">
										<UserCheck className="h-5 w-5" />
										Following
									</h2>
								</div>
								<FollowingList />
							</div>
						)}
					</div>

					{/* Right Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Recent Activity */}
						<RecentActivityCard />
						{/* Mutual Connections */}
						<MutualConnections />
						{/* Growth Chart - Only show for mentors */}
						{isMentor && <GrowthChart />}
					</div>
				</div>
			</main>
		</div>
	);
}
