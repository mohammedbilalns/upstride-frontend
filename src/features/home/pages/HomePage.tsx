import ArticleFeed from "@/features/home/components/ArticleFeed";
import { articlesQueryOptions } from "@/features/articles-mangement/services/article.service";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import RecommendedArticles from "@/features/home/components/RecommendedArticles";
import RegisterMentorCard from "@/features/home/components/RegisterMentorCard";
import SuggestedMentors from "@/features/home/components/SuggestedMentors";
import UpcomingSessions from "@/features/home/components/UpcomingSessions";
import FollowedMentors from "@/features/mentor-discovery/components/FollowedMentors";
import type { Article } from "@/shared/types/article";
import { Bell, MessageCircle } from "lucide-react";
import { Activity } from "react";

import NoResource from "@/components/common/NoResource";
import { Button } from "@/components/ui/button";

const routeApi = getRouteApi("/(authenticated)/home/");

export default function HomePage() {
	const { user } = routeApi.useLoaderData();
	const { data } = useSuspenseInfiniteQuery(articlesQueryOptions());
	const articles = data?.pages.flatMap((page) => page.articles).slice(0, 4) || [];
	const isUser = true;
	const isMentor = user?.role === "mentor";
	const isExceededLimit = false;

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col lg:flex-row gap-6 relative">
					{/* Left Sidebar */}
					<aside className="w-full lg:w-1/4 space-y-6 lg:sticky lg:top-6 self-start h-fit z-10">
						<Activity
							mode={
								isUser && !isMentor && !isExceededLimit ? "visible" : "hidden"
							}
						>
							<RegisterMentorCard />
						</Activity>
						{/* Find Mentors */}
						<SuggestedMentors />
						{/* My Mentors */}
						<FollowedMentors count={2} />
					</aside>

					{/* Main Feed */}
					<section className="w-full lg:w-2/4 space-y-6 min-h-[800px]">
						{articles.length === 0 ? (
							<NoResource resource="articles" isHome={true} />
						) : (
							articles.map((article: Article) => (
								<ArticleFeed key={article.id} article={article} />
							))
						)}
					</section>

					{/* Right Sidebar */}
					<aside className="w-full lg:w-1/4 space-y-6 lg:sticky lg:top-6 self-start h-fit z-10">
						{/* Upcoming Sessions */}
						<UpcomingSessions />
						{/* Recommended Articles */}
						<RecommendedArticles />
					</aside>
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
