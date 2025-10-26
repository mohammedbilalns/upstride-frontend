import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { Button } from "@/components/ui/button";
import FollowedMentors from "@/features/mentor/components/FollowedMentors";
import FindMentorsSection from "@/features/home/FindMentorsSection";
import UpcomingSessions from "@/features/home/UpcomingSessions";
import RecommendedArticles from "@/features/home/RecommendedArticles";
import QuickActions from "@/features/home/QuickActions";
import RegisterMentorCard from "@/features/home/RegisterMentorCard";
import { Activity } from "react";
import ArticleFeed from "@/features/home/ArticleFeed";
import { fetchArticles } from "@/features/articles/services/article.service";
import type { Article } from "@/shared/types/article";

export const Route = createFileRoute("/(authenticated)/home/")({
  component: RouteComponent,
  loader: async () =>  fetchArticles()
  
});

function RouteComponent() {
  const { user } = useAuthStore();
  const data = Route.useLoaderData()
  const articles = data?.articles.slice(0, 3)
  const isUser = true;
  const isMentor = user?.role === "mentor";
  const isExceededLimit = false; 
  // TODO: add logic to check exceded limit

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Activity mode={ isUser && !isMentor && !isExceededLimit ? "visible" : "hidden"} >
              <RegisterMentorCard/>
            </Activity>
            {/* Find Mentors */}
            <FindMentorsSection />
            {/* My Mentors */}
            <FollowedMentors count={4} />
          </div>

          {/* Main Feed */}
          <div className="w-full lg:w-2/4 space-y-6">
            {articles.map((article: Article) => (
              <ArticleFeed article={article} />
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Upcoming Sessions */}
            <UpcomingSessions />
            {/* Recommended Articles */}
            <RecommendedArticles />
            {/* Quick Actions */}
            <QuickActions />
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
