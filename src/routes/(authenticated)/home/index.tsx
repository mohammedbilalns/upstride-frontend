import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Award,
	Bell,
	Bookmark,
	Clock,
	Eye,
	Filter,
	Heart,
	MessageCircle,
	MessageSquare,
	Search,
	Star,
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	dummyArticles,
	dummyMentors,
	dummyQuickActions,
	dummyRecommendedArticles,
	dummySessions,
} from "./-dummyData";
import UserAvatar from "@/components/common/UserAvatar";

export const Route = createFileRoute("/(authenticated)/home/")({
	component: RouteComponent,
});
function RouteComponent() {
	const { user } = useAuthStore();
	const isUser = true;
	const isMentor = user?.role === "mentor";
	const isExceededLimit = false; // temp for now

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Register as Mentor Card - Only shows if user is authenticated and not already a mentor */}
						{isUser && !isMentor && !isExceededLimit && (
							<Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
								<CardContent className="p-6">
									<div className="flex flex-col items-center text-center">
										<div className="bg-primary/10 p-3 rounded-full mb-4">
											<Award className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-lg font-semibold mb-2">
											Become a Mentor
										</h3>
										<p className="text-sm text-muted-foreground mb-4">
											Share your expertise and help others grow in their
											careers.
										</p>

										<Link to="/mentor/register">
											<Button className="w-full cursor-pointer">
												<Star className="h-4 w-4 mr-2" />
												Register as Mentor
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Find Mentors */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Find Mentors</span>
									<Button
										className="cursor-pointer"
										variant="ghost"
										size="icon"
									>
										<Filter className="h-4 w-4" />
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										placeholder="Search by expertise..."
										className="pl-10"
									/>
								</div>

								<div className="space-y-3">
									{dummyMentors.map((mentor) => (
										<div
											key={mentor.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center">
												<div className="relative">
													<UserAvatar image={mentor.imageUrl} name={mentor.name} size={10} />
												
													{mentor.isOnline && (
														<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
													)}
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium">{mentor.name}</p>
													<p className="text-xs text-muted-foreground">
														{mentor.title}
													</p>
												</div>
											</div>
											<Button className="cursor-pointer" size="sm">
												Connect
											</Button>
										</div>
									))}
								</div>

								<Button variant="link" className="w-full cursor-pointer">
									View All Mentors
								</Button>
							</CardContent>
						</Card>

						{/* My Mentors */}
						<Card>
							<CardHeader>
								<CardTitle>My Mentors</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{dummyMentors
									.filter((m) => m.isOnline)
									.map((mentor) => (
										<div
											key={mentor.id}
											className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
										>
											<div className="flex items-center">
												<div className="relative">
													<UserAvatar image={mentor.imageUrl} name={mentor.name} size={8} />
													<div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-background"></div>
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium">{mentor.name}</p>
													<p className="text-xs text-muted-foreground">
														Active now
													</p>
												</div>
											</div>
											<Button variant="ghost" size="icon">
												<MessageCircle className="h-4 w-4" />
											</Button>
										</div>
									))}

								<Button variant="link" className="w-full cursor-pointer">
									View All Mentors
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Main Feed */}
					<div className="w-full lg:w-2/4 space-y-6">
						{dummyArticles.map((article) => (
							<Card
								key={article.id}
								className="hover:shadow-md transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-center mb-4">
										<UserAvatar image={article.author.imageUrl} name={article.author.name} size={10} />
										<div className="ml-3">
											<div className="flex items-center">
												<p className="text-sm font-medium">
													{article.author.name}
												</p>
												{article.author.isMentor && (
													<Badge variant="secondary" className="ml-2 text-xs">
														MENTOR
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{article.publishedAt}
											</p>
										</div>
									</div>

									<h3 className="text-lg font-semibold mb-2">
										{article.title}
									</h3>
									<p className="text-muted-foreground mb-4">
										{article.description}
									</p>

									<div className="flex items-center justify-between">
										<div className="flex space-x-4 text-sm text-muted-foreground">
											<button className="flex items-center hover:text-primary transition-colors">
												<Heart className="h-4 w-4 mr-1" />
												<span>{article.likes}</span>
											</button>
											<button className="flex items-center hover:text-primary transition-colors">
												<MessageSquare className="h-4 w-4 mr-1" />
												<span>{article.comments}</span>
											</button>
											<button className="flex items-center hover:text-primary transition-colors">
												<Bookmark className="h-4 w-4 mr-1" />
											</button>
										</div>
										<div className="flex items-center text-sm text-muted-foreground">
											<Eye className="h-4 w-4 mr-1" />
											<span>{article.views} views</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Right Sidebar */}
					<div className="w-full lg:w-1/4 space-y-6">
						{/* Upcoming Sessions */}
						<Card>
							<CardHeader>
								<CardTitle>Upcoming Sessions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{dummySessions.map((session) => (
									<div
										key={session.id}
										className={`p-3 rounded-lg bg-muted border-l-4 ${session.color}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-sm font-medium">
													{session.mentorName}
												</p>
												<p className="text-xs text-muted-foreground">
													{session.title}
												</p>
											</div>
											<Badge variant="outline">{session.date}</Badge>
										</div>
										<div className="flex items-center mt-2 text-sm text-muted-foreground">
											<Clock className="h-3 w-3 mr-1" />
											<span>{session.time}</span>
										</div>
										<Button className="cursor-pointer w-full mt-3" size="sm">
											Join Session
										</Button>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Recommended Articles */}
						<Card>
							<CardHeader>
								<CardTitle>Recommended Articles</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 cursor-pointer">
								{dummyRecommendedArticles.map((article) => (
									<div
										key={article.id}
										className="flex items-start p-2 rounded-lg hover:bg-muted transition-colors"
									>
										<img
											src={article.imageUrl}
											alt={article.title}
											className="h-12 w-12 rounded object-cover mr-3"
										/>
										<div className="flex-1">
											<p className="text-sm font-medium line-clamp-2">
												{article.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{article.readTime}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{dummyQuickActions.map((action) => {
									const Icon = action.icon;
									return (
										<Button
											key={action.id}
											variant="ghost"
											className="cursor-pointer w-full justify-start"
										>
											<div className="bg-muted p-2 rounded-lg mr-3">
												<Icon className="h-4 w-4 text-primary" />
											</div>
											<span>{action.title}</span>
										</Button>
									);
								})}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>

			{/* Floating Action Buttons */}
			<div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3">
				<Button size="icon" className="rounded-full shadow-lg">
					<MessageCircle className="h-5 w-5" />
					<span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
				</Button>
				<Button
					size="icon"
					variant="outline"
					className="rounded-full shadow-lg"
				>
					<Bell className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
