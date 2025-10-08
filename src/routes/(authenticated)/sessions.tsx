import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	Calendar,
	CalendarDays,
	CheckCircle,
	ChevronRight,
	Clock,
	Filter,
	History,
	MapPin,
	MoreHorizontal,
	Search,
	User,
	Video,
	XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for session data
interface Mentor {
	id: number;
	name: string;
	title: string;
	imageUrl: string;
}

interface Session {
	id: number;
	mentor: Mentor;
	title: string;
	description: string;
	date: string;
	time: string;
	duration: string;
	status: "upcoming" | "completed" | "canceled";
	meetingLink?: string;
	location?: string;
	notes?: string;
}

// Dummy data for sessions
const dummySessions: Session[] = [
	{
		id: 1,
		mentor: {
			id: 1,
			name: "Sarah Williams",
			title: "Leadership Coach",
			imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
		title: "Leadership Coaching Session",
		description:
			"One-on-one coaching session focusing on remote team leadership strategies and conflict resolution.",
		date: "2024-01-15",
		time: "14:00",
		duration: "1 hour",
		status: "upcoming",
		meetingLink: "https://meet.google.com/abc-defg-hij",
	},
	{
		id: 2,
		mentor: {
			id: 2,
			name: "Michael Chen",
			title: "Tech Career Advisor",
			imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
		title: "Career Path Planning",
		description:
			"Discussing career progression in tech industry and setting goals for the next 2 years.",
		date: "2024-01-20",
		time: "11:00",
		duration: "45 minutes",
		status: "upcoming",
		meetingLink: "https://zoom.us/j/123456789",
	},
	{
		id: 3,
		mentor: {
			id: 1,
			name: "Sarah Williams",
			title: "Leadership Coach",
			imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
		},
		title: "Team Management Workshop",
		description:
			"Interactive workshop on building and managing high-performing teams.",
		date: "2024-01-10",
		time: "15:00",
		duration: "2 hours",
		status: "completed",
		notes: "Great session! Learned about effective communication strategies.",
	},
	{
		id: 4,
		mentor: {
			id: 3,
			name: "Emma Thompson",
			title: "Personal Branding Expert",
			imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
		},
		title: "Personal Branding Strategy",
		description:
			"Developing a personal brand strategy for professional growth.",
		date: "2024-01-08",
		time: "10:00",
		duration: "1 hour",
		status: "completed",
		notes: "Excellent insights on building online presence.",
	},
	{
		id: 5,
		mentor: {
			id: 2,
			name: "Michael Chen",
			title: "Tech Career Advisor",
			imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
		},
		title: "Technical Interview Preparation",
		description: "Mock technical interview and feedback session.",
		date: "2024-01-05",
		time: "14:00",
		duration: "1 hour",
		status: "canceled",
		notes: "Rescheduled due to mentor availability.",
	},
	{
		id: 6,
		mentor: {
			id: 4,
			name: "David Wilson",
			title: "Communication Specialist",
			imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
		},
		title: "Public Speaking Skills",
		description: "Improving presentation and public speaking skills.",
		date: "2024-01-25",
		time: "16:00",
		duration: "1.5 hours",
		status: "upcoming",
		location: "Conference Room A",
	},
];

// Helper function to format date
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
};

// Helper function to get status badge
const getStatusBadge = (status: Session["status"]) => {
	switch (status) {
		case "upcoming":
			return <Badge variant="default">Upcoming</Badge>;
		case "completed":
			return <Badge variant="secondary">Completed</Badge>;
		case "canceled":
			return <Badge variant="destructive">Canceled</Badge>;
		default:
			return null;
	}
};

// Helper function to get status icon
const getStatusIcon = (status: Session["status"]) => {
	switch (status) {
		case "upcoming":
			return <Calendar className="h-4 w-4" />;
		case "completed":
			return <CheckCircle className="h-4 w-4 text-green-500" />;
		case "canceled":
			return <XCircle className="h-4 w-4 text-red-500" />;
		default:
			return null;
	}
};

export const Route = createFileRoute("/(authenticated)/sessions")({
	component: RouteComponent,
});

function RouteComponent() {
	const upcomingSessions = dummySessions.filter((s) => s.status === "upcoming");
	const pastSessions = dummySessions.filter(
		(s) => s.status === "completed" || s.status === "canceled",
	);

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Sessions</h1>
				<p className="text-muted-foreground">
					Manage your upcoming and past mentorship sessions.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Main Content */}
				<div className="w-full lg:w-3/4">
					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input placeholder="Search sessions..." className="pl-10" />
						</div>
						<Button variant="outline">
							<Filter className="h-4 w-4 mr-2" />
							Filter
						</Button>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="upcoming" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="upcoming" className="flex items-center gap-2">
								<CalendarDays className="h-4 w-4" />
								Upcoming ({upcomingSessions.length})
							</TabsTrigger>
							<TabsTrigger value="past" className="flex items-center gap-2">
								<History className="h-4 w-4" />
								Past ({pastSessions.length})
							</TabsTrigger>
							<TabsTrigger value="all" className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								All ({dummySessions.length})
							</TabsTrigger>
						</TabsList>

						{/* Upcoming Sessions */}
						<TabsContent value="upcoming" className="space-y-4">
							{upcomingSessions.length === 0 ? (
								<Card>
									<CardContent className="flex flex-col items-center justify-center py-12">
										<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											No upcoming sessions
										</h3>
										<p className="text-muted-foreground text-center mb-4">
											You don't have any upcoming sessions scheduled.
										</p>
										<Button>Schedule a Session</Button>
									</CardContent>
								</Card>
							) : (
								upcomingSessions.map((session) => (
									<Card
										key={session.id}
										className="hover:shadow-md transition-shadow"
									>
										<CardContent className="p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-start space-x-4">
													<Avatar className="h-12 w-12">
														<AvatarImage
															src={session.mentor.imageUrl}
															alt={session.mentor.name}
														/>
														<AvatarFallback>
															{session.mentor.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="text-lg font-semibold">
															{session.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															with {session.mentor.name}, {session.mentor.title}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{getStatusBadge(session.status)}
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem>
																<Calendar className="h-4 w-4 mr-2" />
																Reschedule
															</DropdownMenuItem>
															<DropdownMenuItem className="text-red-600">
																<XCircle className="h-4 w-4 mr-2" />
																Cancel Session
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>

											<p className="text-muted-foreground mb-4">
												{session.description}
											</p>

											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="h-4 w-4 mr-2" />
													<span>{formatDate(session.date)}</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="h-4 w-4 mr-2" />
													<span>
														{session.time} ({session.duration})
													</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													{session.meetingLink ? (
														<Video className="h-4 w-4 mr-2" />
													) : (
														<MapPin className="h-4 w-4 mr-2" />
													)}
													<span>
														{session.meetingLink ? "Online" : session.location}
													</span>
												</div>
											</div>

											<div className="flex justify-between items-center">
												<div className="flex items-center space-x-2 text-sm text-muted-foreground">
													{getStatusIcon(session.status)}
													<span>Session starts in 2 days</span>
												</div>
												<Button>
													<Video className="h-4 w-4 mr-2" />
													Join Session
												</Button>
											</div>
										</CardContent>
									</Card>
								))
							)}
						</TabsContent>

						{/* Past Sessions */}
						<TabsContent value="past" className="space-y-4">
							{pastSessions.length === 0 ? (
								<Card>
									<CardContent className="flex flex-col items-center justify-center py-12">
										<History className="h-12 w-12 text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											No past sessions
										</h3>
										<p className="text-muted-foreground text-center">
											You haven't completed any sessions yet.
										</p>
									</CardContent>
								</Card>
							) : (
								pastSessions.map((session) => (
									<Card
										key={session.id}
										className="hover:shadow-md transition-shadow"
									>
										<CardContent className="p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-start space-x-4">
													<Avatar className="h-12 w-12">
														<AvatarImage
															src={session.mentor.imageUrl}
															alt={session.mentor.name}
														/>
														<AvatarFallback>
															{session.mentor.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="text-lg font-semibold">
															{session.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															with {session.mentor.name}, {session.mentor.title}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{getStatusBadge(session.status)}
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem>
																<Calendar className="h-4 w-4 mr-2" />
																Schedule Again
															</DropdownMenuItem>
															<DropdownMenuItem>
																<User className="h-4 w-4 mr-2" />
																View Mentor Profile
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>

											<p className="text-muted-foreground mb-4">
												{session.description}
											</p>

											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="h-4 w-4 mr-2" />
													<span>{formatDate(session.date)}</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="h-4 w-4 mr-2" />
													<span>
														{session.time} ({session.duration})
													</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													{getStatusIcon(session.status)}
													<span className="ml-2 capitalize">
														{session.status}
													</span>
												</div>
											</div>

											{session.notes && (
												<div className="bg-muted p-3 rounded-lg mb-4">
													<p className="text-sm">
														<strong>Notes:</strong> {session.notes}
													</p>
												</div>
											)}

											<div className="flex justify-between items-center">
												<div className="text-sm text-muted-foreground">
													{session.status === "completed"
														? "Session completed successfully"
														: "Session was canceled"}
												</div>
												<Button variant="outline">
													View Details
													<ChevronRight className="h-4 w-4 ml-2" />
												</Button>
											</div>
										</CardContent>
									</Card>
								))
							)}
						</TabsContent>

						{/* All Sessions */}
						<TabsContent value="all" className="space-y-4">
							{dummySessions.length === 0 ? (
								<Card>
									<CardContent className="flex flex-col items-center justify-center py-12">
										<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											No sessions found
										</h3>
										<p className="text-muted-foreground text-center">
											You haven't scheduled any sessions yet.
										</p>
									</CardContent>
								</Card>
							) : (
								dummySessions.map((session) => (
									<Card
										key={session.id}
										className="hover:shadow-md transition-shadow"
									>
										<CardContent className="p-6">
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-start space-x-4">
													<Avatar className="h-12 w-12">
														<AvatarImage
															src={session.mentor.imageUrl}
															alt={session.mentor.name}
														/>
														<AvatarFallback>
															{session.mentor.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="text-lg font-semibold">
															{session.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															with {session.mentor.name}, {session.mentor.title}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{getStatusBadge(session.status)}
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															{session.status === "upcoming" && (
																<>
																	<DropdownMenuItem>
																		<Calendar className="h-4 w-4 mr-2" />
																		Reschedule
																	</DropdownMenuItem>
																	<DropdownMenuItem className="text-red-600">
																		<XCircle className="h-4 w-4 mr-2" />
																		Cancel Session
																	</DropdownMenuItem>
																</>
															)}
															{session.status === "completed" && (
																<>
																	<DropdownMenuItem>
																		<Calendar className="h-4 w-4 mr-2" />
																		Schedule Again
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<User className="h-4 w-4 mr-2" />
																		View Mentor Profile
																	</DropdownMenuItem>
																</>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>

											<p className="text-muted-foreground mb-4">
												{session.description}
											</p>

											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="h-4 w-4 mr-2" />
													<span>{formatDate(session.date)}</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="h-4 w-4 mr-2" />
													<span>
														{session.time} ({session.duration})
													</span>
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													{getStatusIcon(session.status)}
													<span className="ml-2 capitalize">
														{session.status}
													</span>
												</div>
											</div>

											{session.notes && (
												<div className="bg-muted p-3 rounded-lg mb-4">
													<p className="text-sm">
														<strong>Notes:</strong> {session.notes}
													</p>
												</div>
											)}

											<div className="flex justify-between items-center">
												<div className="text-sm text-muted-foreground">
													{session.meetingLink ? (
														<span className="flex items-center">
															<Video className="h-4 w-4 mr-1" />
															Online session
														</span>
													) : (
														<span className="flex items-center">
															<MapPin className="h-4 w-4 mr-1" />
															{session.location}
														</span>
													)}
												</div>
												{session.status === "upcoming" ? (
													<Button>
														<Video className="h-4 w-4 mr-2" />
														Join Session
													</Button>
												) : (
													<Button variant="outline">
														View Details
														<ChevronRight className="h-4 w-4 ml-2" />
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								))
							)}
						</TabsContent>
					</Tabs>
				</div>

				{/* Sidebar */}
				<div className="w-full lg:w-1/4 space-y-6">
					{/* Quick Stats */}
					<Card>
						<CardHeader>
							<CardTitle>Session Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Total Sessions
								</span>
								<span className="font-semibold">{dummySessions.length}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">Upcoming</span>
								<span className="font-semibold">{upcomingSessions.length}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">Completed</span>
								<span className="font-semibold">
									{dummySessions.filter((s) => s.status === "completed").length}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">Canceled</span>
								<span className="font-semibold">
									{dummySessions.filter((s) => s.status === "canceled").length}
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Upcoming Sessions Preview */}
					<Card>
						<CardHeader>
							<CardTitle>Next Session</CardTitle>
						</CardHeader>
						<CardContent>
							{upcomingSessions.length > 0 ? (
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={upcomingSessions[0].mentor.imageUrl}
												alt={upcomingSessions[0].mentor.name}
											/>
											<AvatarFallback>
												{upcomingSessions[0].mentor.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<p className="text-sm font-medium">
												{upcomingSessions[0].title}
											</p>
											<p className="text-xs text-muted-foreground">
												{upcomingSessions[0].mentor.name} •{" "}
												{formatDate(upcomingSessions[0].date)}
											</p>
										</div>
									</div>
									<Button className="w-full" size="sm">
										<Calendar className="h-4 w-4 mr-2" />
										Add to Calendar
									</Button>
								</div>
							) : (
								<div className="text-center py-4">
									<Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
									<p className="text-sm text-muted-foreground">
										No upcoming sessions
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button className="w-full justify-start">
								<Calendar className="h-4 w-4 mr-2" />
								Schedule New Session
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<User className="h-4 w-4 mr-2" />
								Find Mentors
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Video className="h-4 w-4 mr-2" />
								Test Equipment
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
