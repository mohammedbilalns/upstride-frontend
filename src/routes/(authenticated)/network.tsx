import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search, UserCheck, Users } from "lucide-react";
import { useId, useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionStats from "@/features/connnections/components/ConnectionStats";
import FollowedList from "@/features/connnections/components/FollowedList";
import FollowersList from "@/features/connnections/components/FollowersList";
import GrowthChart from "@/features/connnections/components/GrowthChart";
import MutualConnections from "@/features/connnections/components/MutualConnections";
import RecentActivityCard from "@/features/connnections/components/RecentActivityCard";
import SuggestedConnections from "@/features/connnections/components/SuggestedConnections";
import { sortOptions } from "@/features/connnections/data/sortOptions";

export const Route = createFileRoute("/(authenticated)/network")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuthStore();
	const isAdmin = user?.role === "admin";
	const isMentor = user?.role === "mentor";
	console.log(isAdmin, isMentor);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("following");
	const [sortBy, setSortBy] = useState("newest");

	// Generate unique IDs for form controls
	const sortById = useId();

	const handleClearFilters = () => {
		setSearchQuery("");
		setSortBy("newest");
	};

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="mb-6">
					<h1 className="text-2xl font-bold mb-2">Connections</h1>
					<p className="text-muted-foreground">
						Manage your professional network and connect with mentors in your
						field.
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Filter Options - Moved to top */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Filter className="h-5 w-5" />
									Filter Connections
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										placeholder="Search connections..."
										className="pl-10"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>

								<div>
									<label
										htmlFor={sortById}
										className="block text-sm font-medium mb-2"
									>
										Sort By
									</label>
									<Select value={sortBy} onValueChange={setSortBy}>
										<SelectTrigger id={sortById}>
											<SelectValue placeholder="Newest First" />
										</SelectTrigger>
										<SelectContent>
											{sortOptions.map((option) => (
												<SelectItem
													className="cursor-pointer"
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<Button
									className="w-full cursor-pointer"
									onClick={handleClearFilters}
								>
									Clear Filters
								</Button>
							</CardContent>
						</Card>

						{/* Connection Stats */}
						<ConnectionStats />
						{/* Suggested Connections */}
						<SuggestedConnections />
					</div>

					{/* Main Content Area */}
					<div className="w-full lg:w-2/4">
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
								<FollowedList searchQuery={searchQuery} sortBy={sortBy} />
							</TabsContent>
							<TabsContent value="followers" className="mt-6">
								<FollowersList searchQuery={searchQuery} sortBy={sortBy} />
							</TabsContent>
						</Tabs>
					</div>

					{/* Right Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Recent Activity */}
						<RecentActivityCard />
						{/* Mutual Connections */}
						<MutualConnections />
						{/* Growth Chart */}
						<GrowthChart />
					</div>
				</div>
			</main>
		</div>
	);
}
