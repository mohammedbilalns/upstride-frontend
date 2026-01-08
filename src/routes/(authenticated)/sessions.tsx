import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Calendar,
	CalendarDays,
	Clock,
	History,
	Video,
} from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getSessions } from "@/features/sessions/services/session.service";
import Loading from "@/components/common/Loading";
import { getMentor } from "@/features/mentor/services/mentor.service";
import type { Booking } from "@/shared/types/session";

export const Route = createFileRoute("/(authenticated)/sessions")({
	component: RouteComponent,
});

// Helper function to format date
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
};

const getStatusBadge = (status: Booking["status"]) => {
	switch (status) {
		case "CONFIRMED":
			return <Badge variant="default">Upcoming</Badge>;
		case "COMPLETED":
			return <Badge variant="secondary">Completed</Badge>;
		case "CANCELLED":
			return <Badge variant="destructive">Canceled</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

const SessionCard = ({ session }: { session: Booking }) => {
	const navigate = useNavigate();
	const { data: mentor } = useQuery({
		queryKey: ["mentor", session.slot?.mentorId],
		queryFn: () => getMentor(session.slot?.mentorId || ""),
		enabled: !!session.slot?.mentorId
	});

	const isUpcoming = session.status === "CONFIRMED";
	const slot = session.slot;
	if (!slot) return null;

	const startAt = new Date(slot.startAt);
	const endAt = new Date(slot.endAt);
	const durationMs = endAt.getTime() - startAt.getTime();
	const durationMinutes = Math.floor(durationMs / 60000);
	const timeString = startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	// Check if joinable (e.g., 5 mins before start until end)
	const now = new Date();
	// Allow joining 10 minutes before
	const isJoinable = isUpcoming && now >= new Date(startAt.getTime() - 10 * 60000) && now <= endAt;

	const handleJoin = () => {
		// Navigate to live session
		navigate({ to: `/session/${session.id}` as any });
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-start space-x-4">
						<UserAvatar
							image={mentor?.user?.profilePicture}
							name={mentor?.user?.name || "Mentor"}
							size={12}
						/>
						<div>
							<h3 className="text-lg font-semibold">
								Session with {mentor?.user?.name || "Mentor"}
							</h3>
							<p className="text-sm text-muted-foreground">
								{mentor?.currentRole} at {mentor?.organisation}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{getStatusBadge(session.status)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
					<div className="flex items-center text-sm text-muted-foreground">
						<Calendar className="h-4 w-4 mr-2" />
						<span>{formatDate(slot.startAt)}</span>
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<Clock className="h-4 w-4 mr-2" />
						<span>
							{timeString} ({durationMinutes} mins)
						</span>
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<Video className="h-4 w-4 mr-2" />
						<span>Online</span>
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="text-sm text-muted-foreground">
						{isUpcoming ? (
							isJoinable ? "Session is ready to join" : "Starts soon"
						) : (
							session.status
						)}
					</div>
					{isUpcoming && isJoinable && (
						<Button onClick={handleJoin} disabled={false}>
							<Video className="h-4 w-4 mr-2" />
							Join Session
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

function RouteComponent() {
	const { data: upcomingSessions, isLoading: isLoadingUpcoming } = useQuery({
		queryKey: ["sessions", "upcoming"],
		queryFn: () => getSessions("upcoming"),
	});

	const { data: historySessions, isLoading: isLoadingHistory } = useQuery({
		queryKey: ["sessions", "history"],
		queryFn: () => getSessions("history"),
	});

	if (isLoadingUpcoming || isLoadingHistory) return <Loading />;

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Sessions</h1>
				<p className="text-muted-foreground">
					Manage your upcoming and past mentorship sessions.
				</p>
			</div>

			<Tabs defaultValue="upcoming" className="space-y-4">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upcoming" className="flex items-center gap-2">
						<CalendarDays className="h-4 w-4" />
						Upcoming ({upcomingSessions?.length || 0})
					</TabsTrigger>
					<TabsTrigger value="history" className="flex items-center gap-2">
						<History className="h-4 w-4" />
						History ({historySessions?.length || 0})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming" className="space-y-4">
					{upcomingSessions?.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No upcoming sessions
								</h3>
								<p className="text-muted-foreground text-center mb-4">
									You don't have any upcoming sessions scheduled.
								</p>
							</CardContent>
						</Card>
					) : (
						upcomingSessions?.map((session) => (
							<SessionCard key={session.id} session={session} />
						))
					)}
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					{historySessions?.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<History className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No history
								</h3>
							</CardContent>
						</Card>
					) : (
						historySessions?.map((session) => (
							<SessionCard key={session.id} session={session} />
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
